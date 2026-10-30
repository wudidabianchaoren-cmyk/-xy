import bpy, json, math, time, hashlib, struct, zlib
from pathlib import Path
import numpy as np

ROOT=Path.cwd();OUT=ROOT/'assets/directory-v119';NATIVE=ROOT/'blender/directory-v32-119'
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'))
scene=bpy.context.scene
assert scene.name=='Original rain-night creative archive / V119'
atlas=bpy.data.objects['room-static']; export=bpy.data.objects['room-static-export']
screen=bpy.data.objects['nav-screen'];tvlight=bpy.data.objects['CRT soft blue bounce']
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 scene.cycles.device='GPU'
except Exception as exc: print(exc)
states={o.name:(o.hide_render,o.hide_get()) for o in scene.objects}
lights={o.name:(o.data.energy,tuple(o.data.color)) for o in scene.objects if o.type=='LIGHT'}
emissions=[]
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 for node in mat.node_tree.nodes:
  if node.type=='EMISSION':emissions.append((mat.name,node.name,tuple(node.inputs[0].default_value),node.inputs[1].default_value))
world=[]
for node in scene.world.node_tree.nodes:
 if node.type=='BACKGROUND':world.append((node.name,tuple(node.inputs['Color'].default_value),node.inputs['Strength'].default_value))
for o in scene.objects:
 if o.type=='MESH' and o not in [atlas,screen] and not o.name.startswith('Preview '):o.hide_render=True;o.hide_set(True)
atlas.hide_render=False;atlas.hide_set(False);screen.hide_render=False;screen.hide_set(False)
for o in bpy.context.selected_objects:o.select_set(False)
atlas.select_set(True);bpy.context.view_layer.objects.active=atlas
atlas.data.uv_layers.active=atlas.data.uv_layers['BAKE_UV'];atlas.data.uv_layers['BAKE_UV'].active_render=True
scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=True;scene.render.bake.margin=12
scene.render.image_settings.file_format='OPEN_EXR';scene.render.image_settings.color_depth='16'
records=[]
def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
def png_exact(path,rgb):
 h,w,c=rgb.shape;assert c==3
 raw=b''.join(b'\0'+rgb[y].tobytes() for y in range(h))
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,8))+chunk(b'IEND',b''))
def png_read_exact(path):
 d=path.read_bytes();p=8;data=[];shape=None
 while p<len(d):
  count=struct.unpack_from('>I',d,p)[0];kind=d[p+4:p+8];raw=d[p+8:p+8+count];p+=count+12
  if kind==b'IHDR':shape=struct.unpack('>IIBBBBB',raw)
  if kind==b'IDAT':data.append(raw)
 w,h=shape[:2];raw=zlib.decompress(b''.join(data));rows=np.frombuffer(raw,dtype=np.uint8).reshape(h,w*3+1);assert np.all(rows[:,0]==0)
 return rows[:,1:].reshape(h,w,3)

def bake(name):
 im=bpy.data.images.new('V119 '+name+' actual Cycles radiance',width=4096,height=4096,alpha=True,float_buffer=True);im.colorspace_settings.name='Linear Rec.709'
 for mat in atlas.data.materials:
  if mat is None or not mat.use_nodes:continue
  for node in mat.node_tree.nodes:node.select=False
  node=mat.node_tree.nodes.get('Cycles radiance bake target')
  if node is None:node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.name='Cycles radiance bake target'
  node.image=im;node.select=True;mat.node_tree.nodes.active=node
 start=time.time();bpy.ops.object.bake(type='DIFFUSE');elapsed=time.time()-start
 exrpath=OUT/(name+'.exr');im.filepath_raw=str(exrpath);im.file_format='OPEN_EXR';im.save_render(str(exrpath),scene=scene)
 pixels=np.empty(4096*4096*4,dtype=np.float32);im.pixels.foreach_get(pixels);pixels=pixels.reshape(4096,4096,4)[:,:,:3]
 assert np.all(np.isfinite(pixels))
 negative=int(np.count_nonzero(pixels<0));pixels=np.maximum(pixels,0)
 # Real 4K linear-light master; 2K box-filtered delivery atlas to constrain first-load cost.
 linear=pixels.reshape(2048,2,2048,2,3).mean(axis=(1,3));del pixels
 maximum=float(linear.max());scale=2**math.ceil(math.log2(maximum*1.0001)) if maximum>0 else 1
 encoded=np.round(np.power(np.clip(linear/scale,0,1),1/3)*255).astype(np.uint8)
 # Blender image.pixels are bottom-up. A regular PNG stores top rows first.
 pngpath=OUT/(name+'.png');png_exact(pngpath,np.flipud(encoded))
 roundtrip=np.flipud(png_read_exact(pngpath));assert np.array_equal(roundtrip,encoded)
 decoded=np.power(roundtrip.astype(np.float32)/255,3)*scale
 error=np.abs(decoded-linear);clipped=int(np.count_nonzero(linear>scale));assert clipped==0
 record={'name':name,'master':exrpath.name,'png':pngpath.name,'masterResolution':[4096,4096],'deliveryResolution':[2048,2048],'masterSamples':24,'bakePass':'DIFFUSE COLOR DIRECT INDIRECT','includesAlbedo':True,'scale':scale,'linearMax':maximum,'encodedGamma':3,'encodeFormula':'round(pow(max(linearRGB,0)/scale,1.0/3.0)*255)','decodeFormula':'pow(textureRGB,vec3(3.0))*scale','pngColorSpace':'Raw encoded data, no sRGB/gAMA/cHRM/iCCP chunks','webColorSpace':'THREE.NoColorSpace','webUV':'PNG top-down standard: flipY=false with original glTF UV0, no repeat.y=-1 correction','clippedChannelValues':clipped,'negativeInputClamped':negative,'roundtripExactBytes':True,'decodedMAE':float(error.mean()),'decodedMaxAbsoluteError':float(error.max()),'bakeSeconds':elapsed,'pngBytes':pngpath.stat().st_size,'sha256':hashlib.sha256(pngpath.read_bytes()).hexdigest()}
 records.append(record);print('DUAL_LIGHTING_PASS',json.dumps(record),flush=True)
 return im

try:
 # Base contains the room's warm desk lamp, cool rainy window, and neutral exposure fill.
 tvlight.data.energy=0
 for matname,nodename,col,strength in emissions:
  if matname=='Blue CRT phosphor lighting only':bpy.data.materials[matname].node_tree.nodes[nodename].inputs[1].default_value=0
 base=bake('room-base')
 # TV response contains only a white screen emitter and the colocated screen area-light approximation.
 for o in scene.objects:
  if o.type=='LIGHT':o.data.energy=0
 for nodename,col,strength in world:scene.world.node_tree.nodes[nodename].inputs['Strength'].default_value=0
 for matname,nodename,col,strength in emissions:
  node=bpy.data.materials[matname].node_tree.nodes[nodename];node.inputs[1].default_value=0
  if matname=='Blue CRT phosphor lighting only':node.inputs[0].default_value=(1,1,1,1);node.inputs[1].default_value=strength
 tvlight.data.energy=lights[tvlight.name][0];tvlight.data.color=(1,1,1)
 tv=bake('room-tv')
finally:
 for name,(energy,col) in lights.items():bpy.data.objects[name].data.energy=energy;bpy.data.objects[name].data.color=col
 for matname,nodename,col,strength in emissions:
  node=bpy.data.materials[matname].node_tree.nodes[nodename];node.inputs[0].default_value=col;node.inputs[1].default_value=strength
 for nodename,col,strength in world:
  node=scene.world.node_tree.nodes[nodename];node.inputs['Color'].default_value=col;node.inputs['Strength'].default_value=strength
 for name,(hidden,hidden_view) in states.items():bpy.data.objects[name].hide_render=hidden;bpy.data.objects[name].hide_set(hidden_view)
 scene.cycles.samples=40;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'native-preview.png')
 bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))

result={'complete':True,'epoch':'v32.119-original-desk-dual-lighting-1','sameGeometry':True,'sameUniqueBAKE_UV':True,'originalNativeLightsRestored':True,'sourceTVLight':'CRT soft blue bounce','sourceScreenObject':'nav-screen','sourceScreenMaterial':'Blue CRT phosphor lighting only','screenEmissionPower':2.2,'tvAreaWatts':lights[tvlight.name][0],'linearComposite':'baseDiffuseRGB + tvWhiteDiffuseRGB * dynamicScreenLinearAverageRGB','multiplyAlbedoAgain':False,'passes':records,'pngTotalBytes':sum(x['pngBytes'] for x in records),'firstLoadUnder10MB':sum(x['pngBytes'] for x in records)<10_000_000,'note':'True Cycles diffuse radiance pair including static material albedo, not an albedo-independent lightmap or a claim of real-time path tracing.'}
(OUT/'room-lighting.json').write_text(json.dumps(result,indent=2),encoding='utf8')
production=json.loads((OUT/'production.json').read_text(encoding='utf8'));production['dualLighting']=result;(OUT/'production.json').write_text(json.dumps(production,indent=2),encoding='utf8')
print('DUAL_LIGHTING_COMPLETE',json.dumps(result),flush=True)
