import bpy,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v133/hero-ship.glb'))
items=[]
for ob in bpy.context.scene.objects:
 if ob.type=='MESH' and any(s in ob.name.lower() for s in ['human.body','captain base','helmsman base','short-sleeve']):
  q=[ob.matrix_world@Vector(v) for v in ob.bound_box]
  items.append({'name':ob.name,'min':[min(v[i] for v in q) for i in range(3)],'max':[max(v[i] for v in q) for i in range(3)]})
(P/'.verify/v32-137/actor-bounds.json').write_text(json.dumps(items,indent=2),encoding='utf-8')
print('ACTOR_BOUNDS_READY')
