import bpy,bmesh,json
from mathutils import Vector
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';body=bpy.data.objects['V117 CC0 complete male anatomical cyclops body'];bm=bmesh.new();bm.from_mesh(body.data);remaining={e for e in bm.edges if e.is_boundary};loops=[]
while remaining:
 e=next(iter(remaining));verts=set(e.verts);todo=[e];es=[]
 while todo:
  edge=todo.pop()
  if edge not in remaining:continue
  remaining.remove(edge);es.append(edge);verts.update(edge.verts)
  for v in edge.verts:todo.extend(q for q in v.link_edges if q in remaining)
 ps=[v.co for v in verts];c=sum(ps,Vector())/len(ps)
 if c.z>1.45:loops.append({'n':len(es),'center':list(c),'bounds':[[min(v[k] for v in ps),max(v[k] for v in ps)] for k in range(3)]})
bm.free();(O/'giant-head-boundaries.json').write_text(json.dumps(loops,indent=2),encoding='utf8');print(json.dumps(loops))