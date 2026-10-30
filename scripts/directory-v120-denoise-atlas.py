import bpy,json,math,hashlib,zlib,struct,time
import numpy as np
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v120';NATIVE=ROOT/'blender/directory-v32-120'
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'))
atlas=bpy.data.objects['room-static'];export=bpy.data.objects['room-static-export']
assert len(atlas.data.uv_layers)==1 and atlas.data.uv_layers[0].name=='BAKE_UV'
assert len(export.data.uv_layers)==1 and export.data.uv_layers[0].name=='BAKE_UV'
auv=np.array([tuple(x.uv) for x in atlas.data.uv_layers[0].data]);euv=np.array([tuple(x.uv) for x in export.data.uv_layers[0].data]);assert np.array_equal(auv,euv)
# Restore original physical base colours to affect metal specular, while the web diffuse is replaced by radiance.
for material in export.data.materials:
 if not material or not material.name.startswith('WEB '):continue
 original=bpy.data.materials.get(material.name[4:]);p=next((n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if original and p:
  source=next((n for n in original.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if original.use_nodes else None
  col=tuple(source.inputs['Base Color'].default_value) if source else tuple(original.diffuse_color)
  material.diffuse_color=col;p.inputs['Base Color'].default_value=col
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in [x for x in bpy.context.scene.objects if x.type=='MESH']:
 ob.hide_set(False);ob.select_set(True);bpy.context.view_layer.objects.active=ob
 bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35),keep_sharp_edges=True)
 ob.select_set(False)
atlas.hide_set(True)
export.hide_set(False);export.select_set(True);bpy.context.view_layer.objects.active=export
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_texcoords=True,export_normals=True,export_materials='EXPORT');export.hide_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))

d=(OUT/'room-static.glb').read_bytes();length=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+length]);binstart=20+length+8;data=d[binstart:]
guv=[]
for mesh in g['meshes']:
 for primitive in mesh['primitives']:
  ac=g['accessors'][primitive['attributes']['TEXCOORD_0']];view=g['bufferViews'][ac['bufferView']];off=view.get('byteOffset',0)+ac.get('byteOffset',0);stride=view.get('byteStride',8)
  for i in range(ac['count']):u,v=struct.unpack_from('<ff',data,off+i*stride);guv.append((u,1-v))
# Exporter reverses V by glTF convention. PNG is top-down; flipY=false compensates exactly.
from mathutils.kdtree import KDTree
unique=np.unique(auv,axis=0);tree=KDTree(len(unique))
for i,(u,v) in enumerate(unique):tree.insert((float(u),float(v),0),i)
tree.balance();maxerror=max(tree.find((float(u),float(v),0))[2] for u,v in guv)
uvcheck={'onlyUVLayer':'BAKE_UV','nativeExportUVExact':True,'glTFConvention':'TEXCOORD_0=(nativeU,1-nativeV)','uniqueNativeUVs':len(unique),'gltfVerticesChecked':len(guv),'maxNearestUVDistance':maxerror,'gltfUVWithinFloatTolerance':bool(maxerror<1e-6)}
assert uvcheck['gltfUVWithinFloatTolerance'],uvcheck
(OUT/'uv-audit.json').write_text(json.dumps(uvcheck,indent=2),encoding='utf8')

def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d)&0xffffffff)
def writepng(path,rgb):
 h,w,c=rgb.shape;raw=b''.join(b'\0'+rgb[y].tobytes() for y in range(h));path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,8))+chunk(b'IEND',b''))
comp=bpy.data.scenes.new('Atlas radiance denoising / no new bake');comp.render.engine='BLENDER_EEVEE';comp.camera=bpy.context.scene.camera;comp.collection.objects.link(comp.camera);comp.render.resolution_x=2048;comp.render.resolution_y=2048;comp.render.resolution_percentage=100;comp.render.image_settings.file_format='OPEN_EXR';comp.render.image_settings.color_depth='16';comp.view_settings.view_transform='Raw';comp.view_settings.look='None';comp.render.film_transparent=True
group=bpy.data.node_groups.new('OIDN linear irradiance atlas cleanup','CompositorNodeTree');group.interface.new_socket(name='Image',in_out='OUTPUT',socket_type='NodeSocketColor');comp.compositing_node_group=group
source=group.nodes.new('CompositorNodeImage');denoise=group.nodes.new('CompositorNodeDenoise');output=group.nodes.new('NodeGroupOutput');group.links.new(source.outputs['Image'],denoise.inputs['Image']);group.links.new(denoise.outputs['Image'],output.inputs['Image'])
result=json.loads((OUT/'room-lighting.json').read_text(encoding='utf8'));diagnostics=[]
for record in result['passes']:
 name=record['name'];raw=OUT/(name+'.exr');im=bpy.data.images.load(str(raw),check_existing=False);im.colorspace_settings.name='Linear Rec.709';source.image=im
 denoised=OUT/(name+'-denoised.exr');comp.render.filepath=str(denoised);start=time.time();bpy.ops.render.render(write_still=True,scene=comp.name)
 clean=bpy.data.images.load(str(denoised),check_existing=False);clean.colorspace_settings.name='Linear Rec.709';pixels=np.empty(2048*2048*4,dtype=np.float32);clean.pixels.foreach_get(pixels);rgb=np.maximum(pixels.reshape(2048,2048,4)[:,:,:3],0);assert np.isfinite(rgb).all()
 peak=float(rgb.max());scale=2**math.ceil(math.log2(peak*1.0001)) if peak else 1;encoded=np.round(np.power(np.clip(rgb/scale,0,1),1/3)*255).astype(np.uint8);png=OUT/(name+'.png');writepng(png,np.flipud(encoded));decoded=np.power(encoded.astype(np.float32)/255,3)*scale
 rawpixels=np.empty(2048*2048*4,dtype=np.float32);im.pixels.foreach_get(rawpixels);rawrgb=rawpixels.reshape(2048,2048,4)[:,:,:3]
 record.update({'rawMaster':raw.name,'master':denoised.name,'denoise':'Actual Blender compositor OpenImageDenoise, HDR scene-linear image, no auxiliary guides','scale':scale,'linearMax':peak,'decodedMAE':float(np.abs(decoded-rgb).mean()),'decodedMAEReference':denoised.name,'pngBytes':png.stat().st_size,'sha256':hashlib.sha256(png.read_bytes()).hexdigest()})
 diagnostics.append({'pass':name,'seconds':time.time()-start,'rawToDenoisedMAE':float(np.abs(rawrgb-rgb).mean()),'rawSHA256':hashlib.sha256(raw.read_bytes()).hexdigest(),'denoisedSHA256':hashlib.sha256(denoised.read_bytes()).hexdigest()});print('DENOISE_PASS',json.dumps(record),flush=True)
result['denoise']={'complete':True,'reason':'Cycles bake does not inherit render denoising; raw 24-sample atlas variance was visible in web despite denoised native render. Existing raw EXR masters retained.','passes':diagnostics};result['uvAudit']=uvcheck
(OUT/'room-lighting.json').write_text(json.dumps(result,indent=2),encoding='utf8')
mg=json.loads((OUT/'material-groups.json').read_text(encoding='utf8'));mg['glbSHA256']=hashlib.sha256((OUT/'room-static.glb').read_bytes()).hexdigest();mg['nativeSHA256']=hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest();mg['originalSpecularTintRestored']=True;(OUT/'material-groups.json').write_text(json.dumps(mg,indent=2),encoding='utf8')
print('DENOISE_COMPLETE',json.dumps(diagnostics),flush=True)
