import bpy,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-143/sealed-hull-and-fitted-footwear.blend'))
r=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH' and o.name.startswith(('Crew00__','Crew01__','Crew02__')):
  pts=[o.matrix_world@Vector(c) for c in o.bound_box]
  r.append({'name':o.name,'verts':len(o.data.vertices),'materials':[m.name if m else '' for m in o.data.materials],'min':[min(p[i] for p in pts) for i in range(3)],'max':[max(p[i] for p in pts) for i in range(3)],'groups':[v.name for v in o.vertex_groups],'matrix':[list(row) for row in o.matrix_world]})
(P/'.verify/v32-145/native-probe.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
print('PROBE_READY',len(r))
