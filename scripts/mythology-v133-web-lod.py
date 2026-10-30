import bpy,json
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v133';bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-133/compact-cove.blend'))
root=bpy.data.objects['V112_SHIP_0'];before=after=0
for o in root.children_recursive:
 if o.type!='MESH':continue
 tri=sum(len(p.vertices)-2 for p in o.data.polygons);before+=tri
 limit=10000 if 'body' in o.name.lower() or 'captain' in o.name.lower() else 1800
 if tri>limit:
  o.data=o.data.copy();bpy.context.view_layer.objects.active=o;mod=o.modifiers.new('Web visible silhouette budget','DECIMATE');mod.ratio=limit/tri;bpy.ops.object.modifier_apply(modifier=mod.name)
 after+=sum(len(p.vertices)-2 for p in o.data.polygons)
bpy.ops.object.select_all(action='DESELECT')
root.select_set(True)
for o in root.children_recursive:
 if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'hero-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_attributes=True,export_cameras=False,export_lights=False)
land=bpy.data.objects['V133_ISLAND'];(A/'height.json').write_text(json.dumps({'size':117,'bounds':[-56,47,-4,86],'heights':[v.co.z for v in land.data.vertices]}))
report={'beforeTriangles':before,'afterTriangles':after,'nativeGeometryUnchanged':True};(A/'web-lod.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
