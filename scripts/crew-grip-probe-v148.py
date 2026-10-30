import bpy,json,struct
import numpy as np
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v146';O=P/'blender/mythology-v32-146'
bpy.ops.wm.open_mainfile(filepath=str(O/'rigged-fleet-v147.blend'));sc=bpy.context.scene;sc.frame_set(1)
b=(A/'vessel-unpruned.glb').read_bytes();jl=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+jl]);blob=b[20+jl+8:];shafts={}
for n in j['nodes']:
 if 'oar shaft' not in n.get('name',''):continue
 ac=j['accessors'][j['meshes'][n['mesh']]['primitives'][0]['attributes']['POSITION']];bv=j['bufferViews'][ac['bufferView']];off=bv.get('byteOffset',0)+ac.get('byteOffset',0);stride=bv.get('byteStride',12);pts=[]
 for q in range(ac['count']):
  x,y,z=struct.unpack_from('<fff',blob,off+q*stride);t=n['translation'];pts.append((x+t[0],-(z+t[2]),y+t[1]))
 arr=np.array(pts);mean=arr.mean(0);val,axes=np.linalg.eigh(np.cov(arr.T));axis=axes[:,-1];proj=(arr-mean)@axis;a=mean+axis*proj.min();c=mean+axis*proj.max();shafts[int(n['extras']['oarId'])]=(Vector(a),Vector(c))
out={'shafts':{k:[list(a),list(c)] for k,(a,c) in shafts.items()},'actors':[]}
for r in sorted([o for o in sc.objects if o.type=='ARMATURE' and 'skeleton' in o.name],key=lambda o:o.name):
 m=next(o for o in sc.objects if o.type=='MESH' and o.parent==r and 'costume' in o.name);ev=m.evaluated_get(bpy.context.evaluated_depsgraph_get());me=ev.to_mesh();info={'id':r.get('crewId'),'hip':list(r.location),'bones':{},'palms':{}}
 for side in [-1,1]:
  for name in ['upper'+str(side),'fore'+str(side),'hand'+str(side)]:
   p=r.pose.bones[name];info['bones'][name]={'head':list(r.matrix_world@p.head),'tail':list(r.matrix_world@p.tail)}
  g=m.vertex_groups['hand'+str(side)];ids=[v.index for v in m.data.vertices if v.index<10582 and any(w.group==g.index and w.weight>.90 for w in v.groups)];rest=[m.data.vertices[i].co for i in ids];center=sum(rest,Vector())/len(rest);actual=[m.matrix_world@me.vertices[i].co for i in ids];info['palms'][str(side)]={'restCenter':list(center),'center':list(sum(actual,Vector())/len(actual))}
 ev.to_mesh_clear();out['actors'].append(info)
(P/'.verify/v32-146/crew-grip-probe-v148.json').write_text(json.dumps(out,indent=2));print(json.dumps(out['actors'][2],indent=2))
