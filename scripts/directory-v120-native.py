import bpy, math, json, time, hashlib, struct, zlib
import numpy as np
from pathlib import Path
from mathutils import Vector

ROOT=Path.cwd();OUT=ROOT/'assets/directory-v120';NATIVE=ROOT/'blender/directory-v32-120'
OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/directory-v32-119/directory-room.blend'))
scene=bpy.context.scene;scene.name='Original rainy archive room / V120'
for name in ['room-static','room-static-export']:
 ob=bpy.data.objects.get(name)
 if ob:bpy.data.objects.remove(ob,do_unlink=True)
for o in scene.objects:
 o.hide_set(False);o.hide_render=False
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 scene.cycles.device='GPU'
except Exception as exc:print(exc)

def principled(name,color,rough=.5,metal=0):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True
 n=m.node_tree.nodes;n.clear();p=n.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 o=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs[0],o.inputs[0]);m.diffuse_color=(*color,1);return m,p

# Long, low-contrast cabinet grain. The former high-frequency generated-noise bump is removed.
wood,p=principled('Oiled walnut / subtle long grain',(.17,.082,.039),.43)
n=wood.node_tree.nodes;lk=wood.node_tree.links;t=n.new('ShaderNodeTexCoord');v=n.new('ShaderNodeVectorMath');v.operation='MULTIPLY';v.inputs[1].default_value=(1.1,90,8);lk.new(t.outputs['Generated'],v.inputs[0])
noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=2.2;noise.inputs['Detail'].default_value=2;noise.inputs['Roughness'].default_value=.48;lk.new(v.outputs[0],noise.inputs[0])
r=n.new('ShaderNodeValToRGB');r.color_ramp.elements[0].position=.16;r.color_ramp.elements[0].color=(.085,.038,.017,1);r.color_ramp.elements[1].position=.84;r.color_ramp.elements[1].color=(.205,.112,.058,1);lk.new(noise.outputs['Fac'],r.inputs[0]);lk.new(r.outputs[0],p.inputs['Base Color'])
b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.035;b.inputs['Distance'].default_value=.00018;lk.new(noise.outputs['Fac'],b.inputs['Height']);lk.new(b.outputs[0],p.inputs['Normal']);p.inputs['Coat Weight'].default_value=.16;p.inputs['Coat Roughness'].default_value=.30
for name,col,rough,metal in [('Aged warm black television',(.021,.023,.025),.32,0),('Graphite molded ABS / fine grain',(.013,.016,.019),.38,0),('Warm plaster',(.28,.27,.245),.93,0),('Old painted window frame',(.29,.24,.175),.55,0),('Brushed warm brass',(.27,.16,.065),.30,.72),('Gunmetal small fittings',(.065,.074,.08),.34,.65),('Woven linen curtain',(.40,.34,.255),.93,0)]:
 principled(name,col,rough,metal)

def box(name,loc,dims,mat,bevel=.005):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  b=o.modifiers.new('Small real edge radius','BEVEL');b.width=bevel;b.segments=3;bpy.ops.object.modifier_apply(modifier=b.name)
 o.data.materials.append(mat);return o
wall=bpy.data.materials['Warm plaster'];trim=bpy.data.materials['Old painted window frame'];black=bpy.data.materials['Graphite molded ABS / fine grain'];paper=bpy.data.materials['Warm cotton paper']
floor,_=principled('Dark oiled room floor',(.065,.043,.027),.62)
box('Room floor',(0,-.15,-.055),(5.6,5.3,.10),floor)
box('Room left enclosing wall',(-2.12,-.20,1.60),(.14,3.15,3.3),wall)
box('Room right enclosing wall',(2.12,-.20,1.60),(.14,3.15,3.3),wall)
box('Room ceiling',(0,-.2,3.24),(4.25,3.15,.10),wall)
box('Left timber skirting',(-2.03,-.20,.09),(.035,3.0,.15),trim)
box('Right timber skirting',(2.03,-.20,.09),(.035,3.0,.15),trim)
box('Back timber skirting',(0,1.13,.09),(4.10,.035,.15),trim)
for x in [-.86,-.29,.28,.85]:box('Desk subtle board seam',(x,-.015,.7504),(.0018,1.59,.0007),floor,.0003)
yellow,p=principled('Yellow archive notepad cotton',(.70,.55,.285),.91)
nav=box('Desk yellow navigation paper / dynamic cover',(.90,-.46,.769),(.55,.38,.020),yellow,.003)
nav.rotation_euler[2]=-.10
box('Yellow paper front edge',(.90,-.655,.769),(.54,.008,.018),paper,.001)
# Tactile room density comes from connected, credible objects rather than random floating ornaments.
phone,p=principled('Warm cream landline ABS',(.58,.54,.43),.40)
box('Landline telephone base',(1.41,.68,.807),(.33,.27,.11),phone,.025)
for x in [1.27,1.55]:box('Telephone receiver cradle',(x,.73,.88),(.055,.10,.08),phone,.013)
box('Telephone handset',(1.41,.73,.916),(.39,.065,.067),phone,.026)
for i in range(12):box('Telephone dial key',(1.35+(i%3)*.041,.59+(i//3)*.034,.866),(.030,.024,.009),black,.003)
cord=bpy.data.curves.new('Coiled telephone cable','CURVE');cord.dimensions='3D';cord.bevel_depth=.003;cord.bevel_resolution=2;s=cord.splines.new('POLY');s.points.add(129)
for i,pt in enumerate(s.points):
 a=i*.63;pt.co=(1.60+.021*math.cos(a),.72-i*.0026,.87+.021*math.sin(a),1)
o=bpy.data.objects.new('Telephone coiled cable',cord);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');bpy.context.object.data.materials.append(black)
# Small wall print supplies depth at the lateral pan limit, no borrowed artwork.
ink,p=principled('Letterpress charcoal',(.012,.026,.029),.93)
box('Right wall framed print backing',(2.015,.55,1.88),(.028,.58,.78),black,.006)
box('Right wall framed print paper',(1.997,.55,1.88),(.004,.53,.73),paper,.001)
for i in range(12):
 box('Original print rhythmic ink bar',(1.991,.35+i*.032,1.88),(.003,.016,.15+.20*math.sin(i*.7)**2),ink,.001)

screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
lamplight.data.energy=48
tvlight.data.energy=7
bpy.data.objects['Cool rainy window ambient'].data.energy=75
bpy.data.objects['Gentle camera-side exposure fill'].data.energy=18
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.16
scene.camera.location=(.10,-3.28,1.89);target=Vector((-.05,.16,1.20));scene.camera.rotation_euler=(target-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=35
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=.30
excluded=lambda o:o==screen or o==bulb or o.name.startswith('Preview ')
static=[o for o in scene.objects if o.type=='MESH' and not excluded(o)]

def gltf(v):return [float(v[0]),float(v[2]),float(-v[1])]
zones={}
groups={'notepad':['Desk yellow navigation paper / dynamic cover'],'books':['Stacked archive volume cover','Upright archive binder'],'lamp':['Desk lamp base','Brass lamp shade / open thin shell'],'remote':['Tactile remote control'],'window':['Vertical window mullion','Horizontal window sash'],'tv':['CRT cabinet back','CRT top shell','CRT lower controls']}
for group,prefixes in groups.items():
 obs=[o for o in static if any(o.name.startswith(p) for p in prefixes)];vs=[o.matrix_world@Vector(c) for o in obs for c in o.bound_box]
 if vs:
  cv=[gltf(v) for v in vs];zones[group]={'objects':[o.name for o in obs],'min':[min(v[i] for v in cv) for i in range(3)],'max':[max(v[i] for v in cv) for i in range(3)]}
(OUT/'interactive-zones.json').write_text(json.dumps({'coordinateSystem':'glTF x,z,-y','zones':zones,'screen':{'center':[-.25,1.27,.205],'width':.55,'height':.40},'paper':{'center':[.90,.790,.46],'width':.55,'depth':.38,'rotationY':.10},'camera':{'position':[.10,1.89,3.28],'target':[-.05,1.20,-.16],'lensMM':35}},indent=2),encoding='utf8')

# Unique atlas while retaining material slots for a real-time specular response in the browser.
for o in bpy.context.selected_objects:o.select_set(False)
copies=[]
for original in static:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();atlas=bpy.context.object;atlas.name='room-static'
for u in list(atlas.data.uv_layers):atlas.data.uv_layers.remove(u)
uv=atlas.data.uv_layers.new(name='BAKE_UV');atlas.data.uv_layers.active=uv;uv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.0025,area_weight=.1);bpy.ops.object.mode_set(mode='OBJECT')
for o in static:o.hide_render=True;o.hide_set(True)
states={o.name:(o.hide_render,o.hide_get()) for o in scene.objects}
lights={o.name:(o.data.energy,tuple(o.data.color)) for o in scene.objects if o.type=='LIGHT'}
emissions=[]
for m in bpy.data.materials:
 if m.use_nodes:
  for node in m.node_tree.nodes:
   if node.type=='EMISSION':emissions.append((m.name,node.name,tuple(node.inputs[0].default_value),node.inputs[1].default_value))
world=scene.world.node_tree.nodes.get('Background');world_strength=world.inputs['Strength'].default_value
scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=True;scene.render.bake.margin=12
scene.render.image_settings.file_format='OPEN_EXR';scene.render.image_settings.color_depth='16';records=[]
def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d)&0xffffffff)
def writepng(path,rgb):
 h,w,c=rgb.shape;raw=b''.join(b'\0'+rgb[y].tobytes() for y in range(h));path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,8))+chunk(b'IEND',b''))
def bake(name):
 im=bpy.data.images.new(name,width=2048,height=2048,alpha=True,float_buffer=True);im.colorspace_settings.name='Linear Rec.709'
 for m in atlas.data.materials:
  if not m or not m.use_nodes:continue
  for nd in m.node_tree.nodes:nd.select=False
  nd=m.node_tree.nodes.get('Cycles radiance bake target')
  if nd is None:nd=m.node_tree.nodes.new('ShaderNodeTexImage');nd.name='Cycles radiance bake target'
  nd.image=im;nd.select=True;m.node_tree.nodes.active=nd
 for o in bpy.context.selected_objects:o.select_set(False)
 atlas.select_set(True);bpy.context.view_layer.objects.active=atlas
 start=time.time();bpy.ops.object.bake(type='DIFFUSE');elapsed=time.time()-start
 im.file_format='OPEN_EXR';im.save_render(str(OUT/(name+'.exr')),scene=scene)
 pix=np.empty(2048*2048*4,dtype=np.float32);im.pixels.foreach_get(pix);pix=pix.reshape(2048,2048,4)[:,:,:3];assert np.isfinite(pix).all();pix=np.maximum(pix,0)
 peak=float(pix.max());scale=2**math.ceil(math.log2(peak*1.0001)) if peak else 1
 enc=np.round(np.power(np.clip(pix/scale,0,1),1/3)*255).astype(np.uint8);path=OUT/(name+'.png');writepng(path,np.flipud(enc));decoded=np.power(enc.astype(np.float32)/255,3)*scale
 record={'name':name,'png':path.name,'master':name+'.exr','scale':scale,'encodedGamma':3,'decodeFormula':'pow(textureRGB,vec3(3))*scale','resolution':[2048,2048],'samples':24,'bakePass':'DIFFUSE COLOR DIRECT INDIRECT','includesAlbedo':True,'linearMax':peak,'decodedMAE':float(np.abs(decoded-pix).mean()),'bakeSeconds':elapsed,'pngBytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()};records.append(record);print('V120_PASS',json.dumps(record),flush=True)
def emissions_off():
 for mn,nn,c,s in emissions:bpy.data.materials[mn].node_tree.nodes[nn].inputs[1].default_value=0
try:
 emissions_off();lamplight.data.energy=0;tvlight.data.energy=0;screen.hide_render=True;bulb.hide_render=True
 bake('room-off')
 for o in scene.objects:
  if o.type=='LIGHT':o.data.energy=0
 world.inputs['Strength'].default_value=0;lamplight.data.energy=lights[lamplight.name][0]
 bake('room-lamp')
 lamplight.data.energy=0;tvlight.data.energy=lights[tvlight.name][0];tvlight.data.color=(1,1,1);screen.hide_render=False
 for mn,nn,c,s in emissions:
  if mn=='Blue CRT phosphor lighting only':nd=bpy.data.materials[mn].node_tree.nodes[nn];nd.inputs[0].default_value=(1,1,1,1);nd.inputs[1].default_value=s
 bake('room-tv')
finally:
 for name,(energy,col) in lights.items():bpy.data.objects[name].data.energy=energy;bpy.data.objects[name].data.color=col
 for mn,nn,col,strength in emissions:nd=bpy.data.materials[mn].node_tree.nodes[nn];nd.inputs[0].default_value=col;nd.inputs[1].default_value=strength
 world.inputs['Strength'].default_value=world_strength
 for name,(hr,hv) in states.items():bpy.data.objects[name].hide_render=hr;bpy.data.objects[name].hide_set(hv)

export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export'
slots=[]
for mat in list(export.data.materials):
 if mat is None:slots.append(None);continue
 p=next((x for x in mat.node_tree.nodes if x.type=='BSDF_PRINCIPLED'),None)
 rough=float(p.inputs['Roughness'].default_value) if p else .6;metal=float(p.inputs['Metallic'].default_value) if p else 0
 m,q=principled('WEB '+mat.name,(1,1,1),rough,metal);q.inputs['Coat Weight'].default_value=.16 if 'walnut' in mat.name else 0;slots.append(m)
indices=[p.material_index for p in export.data.polygons]
export.data.materials.clear()
for mat in slots:export.data.materials.append(mat)
for poly,index in zip(export.data.polygons,indices):poly.material_index=index
for o in bpy.context.selected_objects:o.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_texcoords=True,export_normals=True,export_materials='EXPORT')
export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for o in static:o.hide_render=False;o.hide_set(False)
screen.hide_render=False;bulb.hide_render=False
scene.cycles.samples=48;scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'native-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.ops.render.render(write_still=True)
atlas.data.calc_loop_triangles()
result={'complete':True,'epoch':'v32.120-original-enclosed-room-triple-light','originalAssets':True,'native':str(NATIVE/'directory-room.blend'),'staticObjects':len(static),'triangles':len(atlas.data.loop_triangles),'materialSlots':len(slots),'pngColorSpace':'Raw NoColorSpace','webUV':'flipY=false, glTF UV0, no vertical correction','linearComposite':'offDiffuse + lampOnlyDiffuse * lampLevel + tvWhiteDiffuse * dynamicScreenLinearAverageRGB','multiplyAlbedoAgain':False,'passes':records,'limitations':'Diffuse radiance is genuinely baked by Cycles. Web specular is separate real-time approximation; not real-time Cycles or reference artist model.'}
(OUT/'room-lighting.json').write_text(json.dumps(result,indent=2),encoding='utf8');print('V120_COMPLETE',json.dumps(result),flush=True)
