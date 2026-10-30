import bpy,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-146/rigged-fleet-v148.blend'))
rigs=sorted([o for o in bpy.context.scene.objects if o.type=='ARMATURE'and'skeleton'in o.name],key=lambda o:o.name);r=rigs[2]
out={'rig':r.name,'matrix':[list(v)for v in r.matrix_world],'bones':[{'name':b.name,'head':list(b.head_local),'tail':list(b.tail_local),'posedHead':list(r.pose.bones[b.name].head),'posedTail':list(r.pose.bones[b.name].tail)}for b in r.data.bones],'meshes':[{'name':o.name,'vertices':len(o.data.vertices),'materials':[m.name for m in o.data.materials],'bounds':[list(v)for v in o.bound_box]}for o in bpy.context.scene.objects if o.type=='MESH'and o.parent==r]}
(P/'.verify/v32-162/crew-inventory.json').write_text(json.dumps(out,indent=2));print('CREW_INVENTORY_READY',flush=True)
