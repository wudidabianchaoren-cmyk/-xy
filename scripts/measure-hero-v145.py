import bpy
from pathlib import Path
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-145/01-complete-rigged-warrior.blend'))
b=bpy.data.objects['V145 adult male anatomical body'];v=[p.co for p in b.data.vertices]
for z in [.03,.10,.15,.5,.9,1.,1.1,1.2,1.3,1.4,1.45,1.5,1.55,1.60,1.65,1.7,1.75]:
 ps=[p for p in v if abs(p.z-z)<.018 and abs(p.x)<(.27 if z>.8 else .3)]
 if ps:print(round(z,2),len(ps),'X',round(min(p.x for p in ps),3),round(max(p.x for p in ps),3),'Y',round(min(p.y for p in ps),3),round(max(p.y for p in ps),3))
for o in bpy.context.scene.objects:
 if '.eye.' in o.name:print(o.name, sum(p.co.x for p in o.data.vertices)/len(o.data.vertices),sum(p.co.y for p in o.data.vertices)/len(o.data.vertices),sum(p.co.z for p in o.data.vertices)/len(o.data.vertices))
