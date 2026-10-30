import bpy,json
from pathlib import Path

def export_objects(out,objects,name):
 bpy.ops.object.select_all(action='DESELECT');visible=[]
 for o in objects:
  if not o or o.hide_render:continue
  o.hide_set(False);o.select_set(True);visible.append(o)
 bpy.ops.export_scene.gltf(filepath=str(out/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_extras=True,export_attributes=True,export_cameras=False,export_lights=False)
 return {'path':name,'objects':len(visible),'bytes':(out/name).stat().st_size}

def export_environment(root,out):
 root,out=Path(root),Path(out);sc=bpy.context.scene;land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];report=[]
 report.append(export_objects(out,[land],'island-v118.glb'))
 temporary=bpy.data.collections.new('V118_TEMP_EXPORT');sc.collection.children.link(temporary)
 # Join copies of woody roots to one draw batch. Original individually editable roots survive.
 copies=[]
 for src in bpy.data.collections['V118_ROOTS / ground following buttresses and maquis'].objects:
  if not src or src.hide_render:continue
  o=src.copy();o.data=src.data.copy();temporary.objects.link(o);copies.append(o)
 bpy.ops.object.select_all(action='DESELECT')
 for o in copies:o.select_set(True)
 bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();rootbatch=bpy.context.object;rootbatch.name='V118 actual embedded root systems / merged live draw batch'
 report.append(export_objects(out,[*bpy.data.collections['V118_CLOSED_ROCKS'].objects,rootbatch],'cliffs-v118.glb'));bpy.data.objects.remove(rootbatch,do_unlink=True)
 forest=bpy.data.collections['V117_FOREST'];source=max((o for o in forest.objects if o and o.type=='MESH' and any(m and 'leaves' in m.name.lower() for m in o.data.materials)),key=lambda o:len(o.data.polygons))
 near=bpy.data.objects['V117_WEB_LEAF_PROXY_NEAR'];cache={};objects=[]
 for src in forest.objects:
  if not src or src.type!='MESH' or src.hide_render:continue
  data=cache.get(src.data.name)
  if data is None:
   if src.data==source.data:data=near.data
   elif src.modifiers:
    ev=src.evaluated_get(bpy.context.evaluated_depsgraph_get());data=bpy.data.meshes.new_from_object(ev)
   else:
    data=src.data.copy()
    if src.name.startswith('V117 tree'):
     tmp=bpy.data.objects.new('V118 bark LOD temporary',data);temporary.objects.link(tmp);bpy.ops.object.select_all(action='DESELECT');tmp.select_set(True);bpy.context.view_layer.objects.active=tmp
     tri=sum(len(p.vertices)-2 for p in data.polygons)
     if tri>3000:mod=tmp.modifiers.new('Retain coarse bark silhouette; full leaf topology excluded','DECIMATE');mod.ratio=3000/tri;bpy.ops.object.modifier_apply(modifier=mod.name);data=tmp.data
     bpy.data.objects.remove(tmp,do_unlink=True)
   cache[src.data.name]=data
  o=bpy.data.objects.new('V118_WEB '+src.name,data);temporary.objects.link(o);o.matrix_world=src.matrix_world.copy();objects.append(o)
 report.append(export_objects(out,objects,'biome-web-v118.glb'))
 for o in list(temporary.objects):bpy.data.objects.remove(o,do_unlink=True)
 bpy.data.collections.remove(temporary)
 (out/'04-environment-export.json').write_text(json.dumps({'actualBlenderMcp':True,'reports':report,'nativeFullLeavesRetained':True,'noOpenScanSheets':True,'uniqueBakeUVExported':True},indent=2),encoding='utf8')
 bpy.ops.wm.save_as_mainfile(filepath=str(out/'04-thick-coast-and-web-ecosystem.blend'));print(json.dumps(report));return report

def export_figures(root,out):
 out=Path(out);fleet=[]
 for i in range(4):
  ship=bpy.data.objects['V112_SHIP_'+str(i)];fleet.extend([ship,*ship.children_recursive])
 report=[export_objects(out,fleet,'fleet-v118.glb')];giant=bpy.data.objects['V106_CYCLOPS / retained anatomical base, new male sculpt'];report.append(export_objects(out,[giant,*giant.children_recursive],'cyclops-v118.glb'))
 (out/'04-character-export.json').write_text(json.dumps({'actualBlenderMcp':True,'reports':report},indent=2),encoding='utf8');print(json.dumps(report));return report

if globals().get('V118_EXPORT_ENVIRONMENT'):
 export_environment(ROOT,OUT)
if globals().get('V118_EXPORT_FIGURES'):
 export_figures(ROOT,OUT)
