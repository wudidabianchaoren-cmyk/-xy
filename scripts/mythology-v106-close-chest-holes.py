import bpy,bmesh,json
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-106');giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt');body=next(o for o in giant.children_recursive if o.type=='MESH' and 'Human.body' in o.name);bm=bmesh.new();bm.from_mesh(body.data)
edges=[e for e in bm.edges if e.is_boundary and all(1.23<v.co.z<1.29 and .08<abs(v.co.x)<.2 and v.co.y<-.09 for v in e.verts)]
result=bmesh.ops.holes_fill(bm,edges=edges,sides=40);faces=result.get('faces',[]);uv=bm.loops.layers.uv.active
if uv:
 for face in faces:
  for loop in face.loops:loop[uv].uv=(.02,.98)
bmesh.ops.recalc_face_normals(bm,faces=faces);bm.to_mesh(body.data);bm.free();body.data.update()
bpy.ops.object.select_all(action='DESELECT')
for o in [giant,*giant.children_recursive]:o.hide_set(False);o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'cyclops-male-v106.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True);bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-cove-rocky-headlands-and-uplands.blend'))
audit={'actualBlenderMcp':True,'cause':'Removed separate nipple caps left genuine holes showing green terrain through the torso','filledBoundaryEdges':len(edges),'newChestCapFaces':len(faces)};(OUT/'chest-surface-repair.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
