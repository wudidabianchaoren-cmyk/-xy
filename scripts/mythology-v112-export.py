import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112';scene=bpy.context.scene
def export(objs,file):
 bpy.ops.object.select_all(action='DESELECT')
 selected=[]
 for o in objs:
  if o.hide_render:continue
  o.hide_set(False);o.select_set(True);selected.append(o)
 bpy.ops.export_scene.gltf(filepath=str(OUT/file),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_extras=True,export_attributes=True,export_cameras=False,export_lights=False)
 return {'file':file,'objects':len(selected),'bytes':(OUT/file).stat().st_size}
report=[]
island=bpy.data.objects['V112_ISLAND / continuous bedrock, shallow bay, inland ridge']
report.append(export([island],'island-v112.glb'))
report.append(export(list(bpy.data.collections['V112_ROCKS / scanned cliff assemblies'].objects),'cliffs-v112.glb'))
report.append(export(list(bpy.data.collections['V112_FLEET'].all_objects),'fleet-v112.glb'))
giant=bpy.data.objects['V106_CYCLOPS / retained anatomical base, new male sculpt']
report.append(export([giant,*giant.children_recursive],'cyclops-v112.glb'))
# A separate real geometric LOD is exported for the live page. The detailed native canopy stays unchanged.
forest=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession'];temporary=bpy.data.collections.new('V112_TEMP_WEB_EXPORT');scene.collection.children.link(temporary)
copies={};objects=[]
for src in forest.objects:
 if src.type!='MESH':continue
 data=copies.get(src.data.name)
 if data is None:
  data=src.data.copy();tmp=bpy.data.objects.new('V112 temporary canopy LOD prototype',data);temporary.objects.link(tmp)
  if src.name.startswith(('V112 tree','V112 shrub')):
   bpy.ops.object.select_all(action='DESELECT');tmp.select_set(True);bpy.context.view_layer.objects.active=tmp
   tri=sum(len(p.vertices)-2 for p in data.polygons);limit=7000 if any('leaves' in m.name for m in data.materials if m) else 1200
   if tri>limit:
    dec=tmp.modifiers.new('Live page canopy LOD','DECIMATE');dec.ratio=limit/tri;bpy.ops.object.modifier_apply(modifier=dec.name);data=tmp.data
  copies[src.data.name]=data;bpy.data.objects.remove(tmp,do_unlink=True)
 o=bpy.data.objects.new('V112_WEB '+src.name,data);temporary.objects.link(o);o.matrix_world=src.matrix_world.copy();objects.append(o)
report.append(export(objects,'biome-web-v112.glb'))
for o in list(temporary.objects):bpy.data.objects.remove(o,do_unlink=True)
bpy.data.collections.remove(temporary)
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'05-complete-native-world.blend'))
(OUT/'export-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'nativeSaved':str(OUT/'05-complete-native-world.blend'),'exports':report,'seaExportedOrChanged':False,'nativeAndLiveCanopyLodDifferent':True},indent=2),encoding='utf8');print(json.dumps(report))
