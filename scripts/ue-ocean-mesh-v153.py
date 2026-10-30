"""One continuous adaptive ocean with valid UV tangents; derive the real hull waterline."""
import json,struct,array,math
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/runtime-v153';A.mkdir(exist_ok=True);N=192
axis=[20*math.sinh(math.asinh(50)*(i-N/2)/(N/2)) for i in range(N+1)]
positions=[(x,-.17,z) for z in axis for x in axis];normals=[(0,1,0)]*len(positions);uv=[((x+1000)/2000,(z+1000)/2000) for z in axis for x in axis];indices=[]
for z in range(N):
 for x in range(N):a=z*(N+1)+x;indices.extend([a,a+N+1,a+1,a+1,a+N+1,a+N+2])
data=bytearray();views=[];acc=[]
def add(vals,typ,fmt,component):
 while len(data)%4:data.append(0)
 off=len(data);arr=array.array(fmt,vals if typ=='SCALAR' else [v for p in vals for v in p]);data.extend(arr.tobytes());views.append({'buffer':0,'byteOffset':off,'byteLength':len(arr)*arr.itemsize});a={'bufferView':len(views)-1,'componentType':component,'count':len(vals),'type':typ}
 if typ=='VEC3':a.update(min=[min(p[k] for p in vals) for k in range(3)],max=[max(p[k] for p in vals) for k in range(3)])
 acc.append(a);return len(acc)-1
pp=add(positions,'VEC3','f',5126);nn=add(normals,'VEC3','f',5126);tt=add(uv,'VEC2','f',5126);ii=add(indices,'SCALAR','I',5125)
doc={'asset':{'version':'2.0','generator':'V153 continuous adaptive ocean'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0,'name':'V153ContinuousOcean'}],'meshes':[{'primitives':[{'attributes':{'POSITION':pp,'NORMAL':nn,'TEXCOORD_0':tt},'indices':ii,'material':0}]}],'materials':[{'name':'V153Water','pbrMetallicRoughness':{'baseColorFactor':[.015,.045,.052,1],'metallicFactor':0,'roughnessFactor':.38}}],'buffers':[{'byteLength':len(data)}],'bufferViews':views,'accessors':acc}
jj=json.dumps(doc,separators=(',',':')).encode();jj+=b' '*((-len(jj))%4);data+=b'\0'*((-len(data))%4);(A/'V153ContinuousOcean.glb').write_bytes(struct.pack('<III',0x46546c67,2,28+len(jj)+len(data))+struct.pack('<II',len(jj),0x4e4f534a)+jj+struct.pack('<II',len(data),0x004e4942)+data)
# Intersect actual authored hull planks with the original sea level, not the full
# ship bounding box (which includes oars, masts, sails and fore/aft ornaments).
b=(P/'assets/odyssey/refit-v146/vessel-unpruned.glb').read_bytes();jl=struct.unpack_from('<I',b,12)[0];src=json.loads(b[20:20+jl]);binary=b[28+jl:]
def accessor(i):
 a=src['accessors'][i];v=src['bufferViews'][a['bufferView']];cnt={'SCALAR':1,'VEC3':3}[a['type']];fmt={5126:'f',5125:'I',5123:'H'}[a['componentType']];off=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',struct.calcsize(fmt)*cnt);return [struct.unpack_from('<'+fmt*cnt,binary,off+j*stride) for j in range(a['count'])]
hits=[];hullParts=0;unsupported=[]
for node in src['nodes']:
 if 'hull strake' not in node.get('name',''):continue
 if node.get('rotation') or node.get('matrix'):unsupported.append(node['name']);continue
 hullParts+=1;tr=node.get('translation',[0,0,0]);sc=node.get('scale',[1,1,1])
 for prim in src['meshes'][node['mesh']]['primitives']:
  pts=[tuple(p[k]*sc[k]+tr[k] for k in range(3)) for p in accessor(prim['attributes']['POSITION'])];idx=[q[0] for q in accessor(prim['indices'])]
  for j in range(0,len(idx),3):
   tri=[pts[idx[j+k]] for k in range(3)]
   for k in range(3):
    p,q=tri[k],tri[(k+1)%3]
    if (p[1]+.17)*(q[1]+.17)<0:
     t=(-.17-p[1])/(q[1]-p[1]);hits.append((p[0]+t*(q[0]-p[0]),p[2]+t*(q[2]-p[2])))
assert hits and not unsupported,(len(hits),unsupported)
xmin,xmax=min(p[0] for p in hits)*100,max(p[0] for p in hits)*100;ymin,ymax=min(p[1] for p in hits)*100,max(p[1] for p in hits)*100
waterline={'seaZcm':-17,'hullParts':hullParts,'intersectionPoints':len(hits),'boundsXYcm':[xmin,xmax,ymin,ymax],'centerXYcm':[(xmin+xmax)/2,(ymin+ymax)/2],'lengthCm':xmax-xmin,'beamCm':ymax-ymin,'source':'actual hull strake triangle edges intersected with y=-0.17m in authored GLB'}
(A/'waterline.json').write_text(json.dumps(waterline,indent=2),encoding='utf-8');(A/'mesh-ledger.json').write_text(json.dumps({'vertices':len(positions),'triangles':len(indices)//3,'sizeMeters':2000,'centerCellMeters':axis[N//2+1]-axis[N//2],'oneContinuousMesh':True,'validUV':True,'waterline':waterline},indent=2),encoding='utf-8');print(waterline)
