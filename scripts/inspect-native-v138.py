import bpy,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-137/armed-crew-and-ship.blend'))
out=[]
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 if any(s in o.name for s in ['captain','deck board','amphora']):
  pts=[o.matrix_world@Vector(v) for v in o.bound_box];out.append({'name':o.name,'min':[min(v[i] for v in pts) for i in range(3)],'max':[max(v[i] for v in pts) for i in range(3)],'materials':[m.name for m in o.data.materials]})
(P/'.verify/v32-138/native-bounds.json').write_text(json.dumps(out,indent=2),encoding='utf-8');print('Native geometry inspected')
