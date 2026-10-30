import bpy,bmesh,json,pathlib,math
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v23';selected=[];audit=[]
for o in bpy.context.scene.objects:
 if o.type!='MESH' or 'pale_gold_bronze_batch' not in o.name or len(o.data.vertices)<40000:continue
 o.data=o.data.copy();bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00002)
 seen=set();changed=0
 for initial in bm.verts:
  if initial in seen:continue
  stack=[initial];component=[];seen.add(initial)
  while stack:
   v=stack.pop();component.append(v)
   for edge in v.link_edges:
    n=edge.other_vert(v)
    if n not in seen:seen.add(n);stack.append(n)
  if len(component)<100:continue
  minimum=[min(v.co[i] for v in component) for i in range(3)];maximum=[max(v.co[i] for v in component) for i in range(3)];size=[maximum[i]-minimum[i] for i in range(3)]
  if not(.6<size[0]<4.0 and .6<size[2]<4.0 and size[1]<.09 and .94<size[0]/size[2]<1.06):continue
  cx=(minimum[0]+maximum[0])/2;cz=(minimum[2]+maximum[2])/2;radii=[math.hypot(v.co.x-cx,v.co.z-cz) for v in component];mid=(min(radii)+max(radii))/2;half=(max(radii)-min(radii))/2
  if half>.028:continue
  for v,r in zip(component,radii):
   if r>.01:
    radius=mid+(r-mid)*max(1.,.022/max(.0001,half));v.co.x=cx+(v.co.x-cx)*radius/r;v.co.z=cz+(v.co.z-cz)*radius/r;v.co.y-=.004
  changed+=1
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free();o.data.update();selected.append(o);audit.append({'name':o.name,'rings':changed,'radialHalfWidthMetres':.022,'forwardSeparation':.004})
bpy.ops.object.select_all(action='DESELECT')
for o in selected:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'clock-engraving.glb'),export_format='GLB',use_selection=True,export_apply=True)
(out/'clock-engraving-audit.json').write_text(json.dumps({'actualNativeGeometry':True,'objects':audit,'reason':'Thin engraved rings widened in native geometry to remain continuous at web viewing distance'},indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
print(json.dumps(audit))
