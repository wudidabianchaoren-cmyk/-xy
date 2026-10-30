import bpy,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-162/medieval-rowers.blend'));rigs=sorted([o for o in bpy.context.scene.objects if o.type=='ARMATURE'and'skeleton'in o.name],key=lambda o:o.name);r=[]
for i,o in enumerate(rigs):
 p=o.matrix_world.translation;r.append({'name':o.name,'positionUEcm':[p.x*100,-p.y*100,p.z*100],'phase':i*1.73})
assert len(r)==14;(P/'.verify/v32-162/native-crew-roots.json').write_text(json.dumps(r,indent=2));print('Actual fourteen rig positions exported',flush=True)
