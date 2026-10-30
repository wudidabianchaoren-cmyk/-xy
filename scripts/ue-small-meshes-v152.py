"""Author two bounded, code-native meshes; no incumbent geometry is read or altered."""
import json,struct,array
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/runtime-v152';A.mkdir(exist_ok=True)
def glb(name,positions,normals,colors,indices):
 data=bytearray();views=[];accessors=[]
 def add(vals,typ,fmt,component):
  while len(data)%4:data.append(0)
  off=len(data);flat=vals if typ=='SCALAR' else [v for p in vals for v in p];arr=array.array(fmt,flat);data.extend(arr.tobytes());views.append({'buffer':0,'byteOffset':off,'byteLength':len(arr)*arr.itemsize});a={'bufferView':len(views)-1,'componentType':component,'count':len(vals),'type':typ}
  if typ=='VEC3':a.update(min=[min(p[k] for p in vals) for k in range(3)],max=[max(p[k] for p in vals) for k in range(3)])
  accessors.append(a);return len(accessors)-1
 pp=add(positions,'VEC3','f',5126);nn=add(normals,'VEC3','f',5126);cc=add(colors,'VEC4','f',5126);ii=add(indices,'SCALAR','I',5125)
 doc={'asset':{'version':'2.0','generator':'V152 bounded native mesh'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0,'name':name}],'meshes':[{'primitives':[{'attributes':{'POSITION':pp,'NORMAL':nn,'COLOR_0':cc},'indices':ii,'material':0}]}],'materials':[{'name':name,'doubleSided':True,'pbrMetallicRoughness':{'metallicFactor':0,'roughnessFactor':.5}}],'buffers':[{'byteLength':len(data)}],'bufferViews':views,'accessors':accessors}
 jj=json.dumps(doc,separators=(',',':')).encode();jj+=b' '*((-len(jj))%4);data+=b'\0'*((-len(data))%4);out=struct.pack('<III',0x46546c67,2,28+len(jj)+len(data))+struct.pack('<II',len(jj),0x4e4f534a)+jj+struct.pack('<II',len(data),0x004e4942)+data;(A/(name+'.glb')).write_bytes(out)
 return {'vertices':len(positions),'triangles':len(indices)//3}
# 400m near-water patch, 2.083m cells, with the far ocean retained underneath.
N=192;pos=[(-200+400*x/N,-.17,-200+400*z/N) for z in range(N+1) for x in range(N+1)];ind=[]
for z in range(N):
 for x in range(N):a=z*(N+1)+x;ind.extend([a,a+N+1,a+1,a+1,a+N+1,a+N+2])
sea=glb('V152NearSea',pos,[(0,1,0)]*len(pos),[(0,0,0,1)]*len(pos),ind)
# Fourteen triangles form a distant bird: body, fork tail, two shaped wings.
pos=[(0,.05,-.30),(.10,.04,-.05),(0,.09,.30),(-.10,.04,-.05),(0,-.07,-.03),(-.23,0,-.43),(.23,0,-.43),(-.13,.03,-.02),(-.50,.05,.07),(-.84,.01,-.06),(-.60,-.01,-.19),(-.18,.01,-.20),(.13,.03,-.02),(.50,.05,.07),(.84,.01,-.06),(.60,-.01,-.19),(.18,.01,-.20)];ind=[0,1,2,0,2,3,0,4,1,1,4,2,2,4,3,3,4,0,0,5,3,0,1,6,7,8,11,8,10,11,8,9,10,12,16,13,13,16,15,13,15,14];col=[(min(1,abs(p[0])/.84),0,0,1) for p in pos];bird=glb('V152DistantGull',pos,[(0,1,0)]*len(pos),col,ind)
(A/'mesh-ledger.json').write_text(json.dumps({'sea':sea,'bird':bird,'incumbentAssetsAltered':False},indent=2),encoding='utf-8');print(sea,bird)
