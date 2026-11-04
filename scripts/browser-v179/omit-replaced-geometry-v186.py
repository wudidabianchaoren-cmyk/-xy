"""Omit only the two buffers replaced unconditionally by retained V25 engraving.
Nodes/materials remain. Real V25 geometry is assigned before first render.
"""
from pathlib import Path
import json,gzip,struct,re,hashlib,copy
root=Path.cwd();p=root/'browser-resources-v180.js';r=json.loads(p.read_text().split('=',1)[1].rstrip(';'));source='/blender/reference-architecture-v16/architecture-world.glb'
def load(path):
 v=r['binary'].get(path);b=gzip.decompress(b''.join((root/t.lstrip('/')).read_bytes()for t in v['parts']))if v else(root/path.lstrip('/')).read_bytes();n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n]),bytearray(b[28+n:]),b
w,data,old=load(source);engraving,_,_=load('/blender/reference-architecture-v25/clock-engraving.glb')
if w.get('extras',{}).get('omittedReplacedGeometry186'):print('Already packed');raise SystemExit()
before=copy.deepcopy(w);originalData=bytes(data);clean=lambda name:re.sub('[^a-zA-Z0-9]','',name.replace('geometry','batch'))
replacementNames={clean(n.get('name',''))for n in engraving['nodes']if 'mesh'in n};matches=[]
for node in w['nodes']:
 if 'mesh'not in node or clean(node.get('name',''))not in replacementNames:continue
 assert node['name']in['V13 / chased pale gold bronze batch','V13 / chased pale gold bronze batch.001']
 matches.append(node['name'])
 for primitive in w['meshes'][node['mesh']]['primitives']:
  def accessor(values,componentType,type,count,minimum=None,maximum=None):
   while len(data)%4:data.append(0)
   view=len(w['bufferViews']);w['bufferViews'].append({'buffer':0,'byteOffset':len(data),'byteLength':len(values)});data.extend(values)
   a={'bufferView':view,'componentType':componentType,'count':count,'type':type}
   if minimum is not None:a.update(min=minimum,max=maximum)
   index=len(w['accessors']);w['accessors'].append(a);return index
  primitive['attributes']={'POSITION':accessor(struct.pack('<3f',0,0,0),5126,'VEC3',1,[0,0,0],[0,0,0]),'NORMAL':accessor(struct.pack('<3f',0,1,0),5126,'VEC3',1),'TEXCOORD_0':accessor(struct.pack('<2f',0,0),5126,'VEC2',1)}
  primitive['indices']=accessor(struct.pack('<3H',0,0,0),5123,'SCALAR',3)
  primitive.get('extensions',{}).pop('KHR_draco_mesh_compression',None)
assert len(matches)==2
references=[]
for mesh in w['meshes']:
 for primitive in mesh['primitives']:
  references.extend((primitive['attributes'],k)for k in primitive['attributes'])
  if 'indices'in primitive:references.append((primitive,'indices'))
  for target in primitive.get('targets',[]):references.extend((target,k)for k in target)
for skin in w.get('skins',[]):
 if'inverseBindMatrices'in skin:references.append((skin,'inverseBindMatrices'))
for animation in w.get('animations',[]):
 for sampler in animation['samplers']:references.extend((sampler,k)for k in['input','output'])
for node in w['nodes']:
 attrs=node.get('extensions',{}).get('EXT_mesh_gpu_instancing',{}).get('attributes',{});references.extend((attrs,k)for k in attrs)
kept=sorted({obj[k]for obj,k in references});amap={old:new for new,old in enumerate(kept)}
for obj,k in references:obj[k]=amap[obj[k]]
w['accessors']=[w['accessors'][i]for i in kept];views=[]
for a in w['accessors']:
 if'bufferView'in a:views.append((a,'bufferView'))
 for obj in a.get('sparse',{}).values():
  if isinstance(obj,dict)and'bufferView'in obj:views.append((obj,'bufferView'))
for mesh in w['meshes']:
 for primitive in mesh['primitives']:
  d=primitive.get('extensions',{}).get('KHR_draco_mesh_compression')
  if d:views.append((d,'bufferView'))
for im in w.get('images',[]):
 if'bufferView'in im:views.append((im,'bufferView'))
keptViews=sorted({obj[k]for obj,k in views});vmap={old:new for new,old in enumerate(keptViews)};packed=bytearray();table=[]
for i in keptViews:
 v=copy.deepcopy(w['bufferViews'][i]);payload=bytes(data[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']])
 while len(packed)%4:packed.append(0)
 v['byteOffset']=len(packed);packed.extend(payload);assert packed[v['byteOffset']:v['byteOffset']+v['byteLength']]==payload;table.append(v)
for obj,k in views:obj[k]=vmap[obj[k]]
while len(packed)%4:packed.append(0)
w['bufferViews']=table;w['buffers'][0]['byteLength']=len(packed);w.setdefault('extras',{})['omittedReplacedGeometry186']=matches
for key in['nodes','materials','animations','skins']:assert before.get(key)==w.get(key)
head=json.dumps(w,separators=(',',':'),ensure_ascii=False).encode();head+=b' '*((-len(head))%4)
glb=struct.pack('<III',0x46546c67,2,28+len(head)+len(packed))+struct.pack('<I4s',len(head),b'JSON')+head+struct.pack('<I4s',len(packed),b'BIN\0')+packed;compressed=gzip.compress(glb,compresslevel=9,mtime=0)
folder=root/'assets/browser-v186/retained-geometry';folder.mkdir(exist_ok=True);sha=hashlib.sha256(compressed).hexdigest()[:24];parts=[]
for i,at in enumerate(range(0,len(compressed),524288)):
 target=folder/(sha+'-'+str(i).zfill(3)+'.bin');target.write_bytes(compressed[at:at+524288]);parts.append('/'+target.relative_to(root).as_posix())
r['binary'][source]={'encoding':'gzip','bytes':len(glb),'parts':parts,'sha256':hashlib.sha256(glb).hexdigest()};p.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(r,separators=(',',':'))+';',encoding='utf-8')
proof={'version':186,'source':source,'omitted':matches,'replacement':'/blender/reference-architecture-v25/clock-engraving.glb','sourceRawBytes':len(old),'deliveredRawBytes':len(glb),'sourceTransferBytes':len(gzip.compress(old,compresslevel=9,mtime=0)),'deliveredTransferBytes':len(compressed),'retainedBufferViewsByteIdentical':True,'nodesMaterialsAnimationsPreserved':True,'originalFilesChanged':False}
(root/'deploy/replaced-geometry-v186.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof))
