import bpy,json,runpy
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117';scene=bpy.context.scene
def export(objects,name):
 bpy.ops.object.select_all(action='DESELECT');count=0
 for o in objects:
  if not o or o.hide_render:continue
  o.hide_set(False);o.select_set(True);count+=1
 bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_extras=True,export_attributes=True,export_cameras=False,export_lights=False)
 return {'path':name,'objects':count,'bytes':(OUT/name).stat().st_size}
report=[];land=bpy.data.objects['V117_ISLAND']
forest=bpy.data.collections['V117_FOREST'];source=max((o for o in forest.objects if o and o.type=='MESH' and any(m and 'leaves' in m.name.lower() for m in o.data.materials)),key=lambda o:len(o.data.polygons))
module=runpy.run_path(str(ROOT/'scripts/mythology-v117-leaf-proxy.py'));(near,far),lod=module['build_leaf_proxy_lods'](source=source,root=str(ROOT))
temporary=bpy.data.collections.new('V117_TEMP_EXPORT');scene.collection.children.link(temporary);cache={};objects=[]
for src in forest.objects:
 if not src or src.type!='MESH' or src.hide_render:continue
 data=cache.get(src.data.name)
 if data is None:
  isleaf=src.data==source.data
  if isleaf:data=near.data
  elif src.modifiers:
   ev=src.evaluated_get(bpy.context.evaluated_depsgraph_get());data=bpy.data.meshes.new_from_object(ev)
  else:
   data=src.data.copy()
   if src.name.startswith('V117 tree'):
    tmp=bpy.data.objects.new('V117 trunk LOD temporary',data);temporary.objects.link(tmp);bpy.ops.object.select_all(action='DESELECT');tmp.select_set(True);bpy.context.view_layer.objects.active=tmp
    tri=sum(len(p.vertices)-2 for p in data.polygons);limit=2600
    if tri>limit:mod=tmp.modifiers.new('Bark silhouette LOD, leaf cards excluded','DECIMATE');mod.ratio=limit/tri;bpy.ops.object.modifier_apply(modifier=mod.name);data=tmp.data
    bpy.data.objects.remove(tmp,do_unlink=True)
  cache[src.data.name]=data
 o=bpy.data.objects.new('V117_WEB '+src.name,data);temporary.objects.link(o);o.matrix_world=src.matrix_world.copy();objects.append(o)
report.append(export(objects,'biome-web-v117.glb'))
for o in list(temporary.objects):bpy.data.objects.remove(o,do_unlink=True)
farcopy=bpy.data.objects.new('V117 far intact leaf geometry',far.data);temporary.objects.link(farcopy);report.append(export([farcopy],'leaf-far-v117.glb'));bpy.data.objects.remove(farcopy,do_unlink=True);bpy.data.collections.remove(temporary)
near.hide_render=True;far.hide_render=True;near.hide_set(True);far.hide_set(True)
bpy.ops.object.select_all(action='DESELECT');land.select_set(True);bpy.context.view_layer.objects.active=land;bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-corrected-anatomy-and-web-canopy.blend'))
(OUT/'export-audit.json').write_text(json.dumps({'actualBlenderMcp':True,'exports':report,'nativeFullLeafPreserved':True,'wholeLeafWebLOD':lod,'seaExportedOrChanged':False},indent=2),encoding='utf8');print(json.dumps(report))
