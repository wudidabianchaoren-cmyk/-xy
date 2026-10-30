"""Build native grass geometry on the existing GLB triangles; no terrain mutation."""
import struct,json,math,random,array
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v149';A.mkdir(exist_ok=True)
b=(P/'assets/odyssey/refit-v148/island-bridged-web-c.glb').read_bytes();js=struct.unpack_from('<I',b,12)[0];d=json.loads(b[20:20+js]);data=b[28+js:]
def accessor(i):
 a=d['accessors'][i];v=d['bufferViews'][a['bufferView']];size={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']];fmt={5126:'f',5125:'I',5123:'H',5121:'B'}[a['componentType']];off=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',struct.calcsize(fmt)*size);return [struct.unpack_from('<'+fmt*size,data,off+j*stride) for j in range(a['count'])]
prim=d['meshes'][0]['primitives'][0];pos=accessor(prim['attributes']['POSITION']);idx=[i[0] for i in accessor(prim['indices'])];cells={};step=2.
for j in range(0,len(idx),3):
 p,q,r=[pos[idx[j+k]] for k in range(3)];ux,uy,uz=[q[k]-p[k] for k in range(3)];vx,vy,vz=[r[k]-p[k] for k in range(3)];nx,ny,nz=uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx;l=(nx*nx+ny*ny+nz*nz)**.5
 if l<1e-9 or ny/l<.64 or max(p[1],q[1],r[1])<1.2:continue
 den=(q[2]-r[2])*(p[0]-r[0])+(r[0]-q[0])*(p[2]-r[2])
 if abs(den)<1e-8:continue
 tri=(p,q,r,den)
 for ix in range(math.floor(min(p[0],q[0],r[0])/step),math.floor(max(p[0],q[0],r[0])/step)+1):
  for iz in range(math.floor(min(p[2],q[2],r[2])/step),math.floor(max(p[2],q[2],r[2])/step)+1):cells.setdefault((ix,iz),[]).append(tri)
def height(x,z):
 result=None
 for p,q,r,den in cells.get((math.floor(x/step),math.floor(z/step)),[]):
  aa=((q[2]-r[2])*(x-r[0])+(r[0]-q[0])*(z-r[2]))/den;bb=((r[2]-p[2])*(x-r[0])+(p[0]-r[0])*(z-r[2]))/den;cc=1-aa-bb
  if min(aa,bb,cc)>=-1e-5:
   h=aa*p[1]+bb*q[1]+cc*r[1]
   if result is None or h>result:result=h
 return result
rng=random.Random(149);verts=[];normals=[];colors=[];indices=[];roots=[]
for ix in range(270):
 for iz in range(236):
  x=-56+(ix+rng.random())*.39;z=-88+(iz+rng.random())*.39;h=height(x,z)
  if h is None or h<1.5:continue
  density=.65+.2*math.sin(x*.24+math.sin(z*.17))+.15*math.sin(z*.42)
  if rng.random()>density:continue
  roots.append((x,h,z))
  for blade in range(9):
   a=rng.random()*math.tau;rad=rng.random()*.34;bx=x+math.cos(a)*rad;bz=z+math.sin(a)*rad;bh=height(bx,bz)
   if bh is None or abs(bh-h)>.55:continue
   bh-=.015;ang=rng.random()*math.tau;dx,dz=math.cos(ang),math.sin(ang);w=rng.uniform(.025,.055);hh=rng.uniform(.32,.85);lean=rng.uniform(.06,.19);n=len(verts)
   verts.extend([(bx-dx*w,bh,bz-dz*w),(bx+dx*w,bh,bz+dz*w),(bx+dx*w*.5+lean,bh+hh*.57,bz+dz*w*.5),(bx-dx*w*.5+lean,bh+hh*.57,bz-dz*w*.5),(bx+lean*1.5,bh+hh,bz+.04)])
   normals.extend([(-dz,0,dx)]*5);tone=rng.uniform(.65,1.2);c=(.17*tone,.21*tone,.07*tone,1);colors.extend([c,c,c,c,(.35*tone,.34*tone,.14*tone,1)]);indices.extend([n,n+1,n+2,n,n+2,n+3,n+3,n+2,n+4])
buf=bytearray();views=[];acc=[]
def put(vals,typ,fmt,component):
 while len(buf)%4:buf.append(0)
 offset=len(buf);flat=[v for p in vals for v in p] if typ!='SCALAR' else vals;ar=array.array(fmt,flat);buf.extend(ar.tobytes());views.append({'buffer':0,'byteOffset':offset,'byteLength':len(ar)*ar.itemsize});a={'bufferView':len(views)-1,'componentType':component,'count':len(vals),'type':typ}
 if typ=='VEC3':a.update(min=[min(p[i] for p in vals) for i in range(3)],max=[max(p[i] for p in vals) for i in range(3)])
 acc.append(a);return len(acc)-1
pa=put(verts,'VEC3','f',5126);na=put(normals,'VEC3','f',5126);ca=put(colors,'VEC4','f',5126);ia=put(indices,'SCALAR','I',5125)
doc={'asset':{'version':'2.0','generator':'V149 triangle grounded native meadow'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0,'name':'V149 grounded grass meadow'}],'meshes':[{'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na,'COLOR_0':ca},'indices':ia,'material':0}]}],'materials':[{'name':'V149 living olive and straw grass','doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':0,'roughnessFactor':.91}}],'buffers':[{'byteLength':len(buf)}],'bufferViews':views,'accessors':acc}
jb=json.dumps(doc,separators=(',',':')).encode();jb+=b' '*((-len(jb))%4);buf+=b'\0'*((-len(buf))%4)
out=struct.pack('<III',0x46546c67,2,12+8+len(jb)+8+len(buf))+struct.pack('<II',len(jb),0x4e4f534a)+jb+struct.pack('<II',len(buf),0x004e4942)+buf
(A/'meadow-v149.glb').write_bytes(out);(A/'meadow-v149.json').write_text(json.dumps({'clumps':len(roots),'blades':len(verts)//5,'vertices':len(verts),'triangles':len(indices)//3,'groundedOn':'V148 C actual triangles','islandModified':False,'roots':roots},separators=(',',':')),encoding='utf-8');print('MEADOW',len(roots),len(verts)//5,len(indices)//3)
