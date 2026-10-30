"""Derive the native ocean exclusion polygon from the actual authored hull triangles."""
import json,struct,math
from pathlib import Path
P=Path(__file__).resolve().parents[1];b=(P/'assets/odyssey/refit-v146/vessel-unpruned.glb').read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);binary=b[28+n:]
def acc(i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];cnt={'SCALAR':1,'VEC3':3}[a['type']];f={5126:'f',5125:'I',5123:'H'}[a['componentType']];off=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',struct.calcsize(f)*cnt);return[struct.unpack_from('<'+f*cnt,binary,off+k*stride)for k in range(a['count'])]
hits=[]
for node in j['nodes']:
 if 'hull strake'not in node.get('name',''):continue
 assert not node.get('rotation')and not node.get('matrix');tr=node.get('translation',[0,0,0]);s=node.get('scale',[1,1,1])
 for primitive in j['meshes'][node['mesh']]['primitives']:
  pts=[tuple(p[k]*s[k]+tr[k]for k in range(3))for p in acc(primitive['attributes']['POSITION'])];ids=[q[0]for q in acc(primitive['indices'])]
  for k in range(0,len(ids),3):
   tri=[pts[ids[k+q]]for q in range(3)]
   for z in range(3):
    a,c=tri[z],tri[(z+1)%3]
    if(a[1]+.17)*(c[1]+.17)<0:
     t=(-.17-a[1])/(c[1]-a[1]);hits.append((round((a[0]+t*(c[0]-a[0]))*100,4),round((a[2]+t*(c[2]-a[2]))*100,4)))
def cross(o,a,b):return(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
points=sorted(set(hits));lo=[];hi=[]
for p in points:
 while len(lo)>=2 and cross(lo[-2],lo[-1],p)<=0:lo.pop()
 lo.append(p)
for p in reversed(points):
 while len(hi)>=2 and cross(hi[-2],hi[-1],p)<=0:hi.pop()
 hi.append(p)
polygon=lo[:-1]+hi[:-1];file=P/'assets/odyssey/crew-v162/native-hull-mask.json';file.write_text(json.dumps({'source':'actual authored hull triangle intersection at sea level -0.17m','intersectionPoints':len(hits),'nativeXYcm':polygon,'inverseAnimatedBoatTransform':True},indent=2));print('ACTUAL_HULL_MASK',len(hits),len(polygon))
