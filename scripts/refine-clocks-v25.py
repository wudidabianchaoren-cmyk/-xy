import bpy,bmesh,json,pathlib,math
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v25';out.mkdir(exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(p/'blender/reference-architecture-v23/clock-engraving.glb'))
audit=[]
for o in list(bpy.context.scene.objects):
 if o.type!='MESH' or len(o.data.vertices)<40000:continue
 bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00002);seen=set();rings=[]
 for initial in bm.verts:
  if initial in seen:continue
  stack=[initial];component=[];seen.add(initial)
  while stack:
   v=stack.pop();component.append(v)
   for edge in v.link_edges:
    n=edge.other_vert(v)
    if n not in seen:seen.add(n);stack.append(n)
  if len(component)<100:continue
  lo=[min(v.co[i] for v in component) for i in range(3)];hi=[max(v.co[i] for v in component) for i in range(3)];size=[hi[i]-lo[i] for i in range(3)]
  if not(.6<size[0]<4 and .6<size[2]<4 and size[1]<.09 and .94<size[0]/size[2]<1.06):continue
  cx=(lo[0]+hi[0])/2;cz=(lo[2]+hi[2])/2;rs=[math.hypot(v.co.x-cx,v.co.z-cz) for v in component]
  if (max(rs)-min(rs))/2>.029:continue
  rings.append((sum(rs)/len(rs),component))
 rings.sort(key=lambda r:r[0]);removed=[]
 if len(rings)>=6:
  for index in [1,3]:
   radius,verts=rings[index];removed.append(radius);bmesh.ops.delete(bm,geom=verts,context='VERTS')
 bm.to_mesh(o.data);bm.free();o.data.update();audit.append({'mesh':o.name,'before':len(rings),'after':len(rings)-len(removed),'removedRadii':removed})
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(out/'clock-engraving.glb'),export_format='GLB',use_selection=True,export_apply=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'clock-refinement.blend'))
(out/'clock-audit.json').write_text(json.dumps({'passed':any(x['after']==4 for x in audit),'actualBlenderGeometry':True,'objects':audit,'completeCourtyardRetainedAt':'reference-architecture-v24/current-complete-courtyard.blend'},indent=2))
print('CLOCK_REFINEMENT '+json.dumps(audit))
