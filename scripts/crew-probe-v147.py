import bpy,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-146/rigged-fleet-v146.blend'))
r=bpy.data.objects['V145 crew 02 skeleton'];m=next(o for o in bpy.context.scene.objects if o.type=='MESH' and o.parent==r and 'costume' in o.name)
adj=[[] for _ in m.data.vertices]
for e in m.data.edges:a,b=e.vertices;adj[a].append(b);adj[b].append(a)
seen=set();comp=[]
for i in range(len(adj)):
 if i in seen:continue
 st=[i];seen.add(i);ids=[]
 while st:
  q=st.pop();ids.append(q)
  for x in adj[q]:
   if x not in seen:seen.add(x);st.append(x)
 if len(ids)>30:
  pts=[m.data.vertices[x].co for x in ids];comp.append({'n':len(ids),'first':min(ids),'last':max(ids),'lo':[min(q[j] for q in pts) for j in range(3)],'hi':[max(q[j] for q in pts) for j in range(3)]})
info={'comp':comp,'hands':{}}
for s in [-1,1]:
 g=m.vertex_groups['hand'+str(s)];ib=r.data.bones[g.name].matrix_local.inverted();pts=[(v.index,tuple(ib@v.co)) for v in m.data.vertices if any(w.group==g.index and w.weight>.65 for w in v.groups)]
 info['hands'][str(s)]=pts
(P/'.verify/v32-146/crew-geometry-probe.json').write_text(json.dumps(info))
