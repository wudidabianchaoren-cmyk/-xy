from pathlib import Path
from PIL import Image,ImageChops,ImageStat
import struct,json,hashlib,gzip,io,copy
root=Path.cwd();folder=root/'assets/browser-v185/transfer';folder.mkdir(parents=True,exist_ok=True);file=root/'browser-resources-v180.js';resources=json.loads(file.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));reports=[]
def encode(content):
 image=Image.open(io.BytesIO(content))
 if image.mode!='RGB' or image.width<512:return None
 stream=io.BytesIO();image.save(stream,format='AVIF',quality=98,speed=6,subsampling='4:4:4',max_threads=2);packed=stream.getvalue()
 if len(packed)>=len(content)*.85:return None
 decoded=Image.open(io.BytesIO(packed)).convert('RGB');difference=ImageChops.difference(image,decoded);rms=max(ImageStat.Stat(difference).rms);maximum=max(v[1]for v in difference.getextrema())
 if rms>2. or maximum>24:return None
 return packed,{'width':image.width,'height':image.height,'originalBytes':len(content),'bytes':len(packed),'maximumChannelError':maximum,'maximumChannelRMS':rms,'resolutionPreserved':True,'quality':98,'subsampling':'4:4:4'}
def publishBinary(source,raw):
 digest=hashlib.sha256(raw).hexdigest();packed=gzip.compress(raw,compresslevel=9,mtime=0);parts=[]
 for i,at in enumerate(range(0,len(packed),1024*1024)):
  target=folder/(digest[:20]+'-'+str(i).zfill(3)+'.bin');target.write_bytes(packed[at:at+1024*1024]);parts.append('/'+target.relative_to(root).as_posix())
 resources['binary'][source]={'encoding':'gzip','bytes':len(raw),'parts':parts,'sha256':digest}
 return len(packed)
for source in ['/blender/reference-architecture-v24/baked-architecture.glb','/blender/reference-architecture-v16/architecture-world.glb','/blender/reference-architecture-v18/courtyard-additions.glb']:
 record=resources.get('binary',{}).get(source);raw=gzip.decompress(b''.join((root/p.lstrip('/')).read_bytes()for p in record['parts']))if record and record.get('encoding')=='gzip'else(root/source.lstrip('/')).read_bytes();jl=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+jl]);original=copy.deepcopy(doc);binary=raw[28+jl:];replacement={};changed=set();proof=[];views={i['bufferView']:n for n,i in enumerate(doc.get('images',[]))if'bufferView'in i}
 for view,index in views.items():
  v=doc['bufferViews'][view];content=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];result=encode(content)
  if not result:continue
  replacement[view]=result[0];proof.append({'image':index,**result[1]});changed.add(index);doc['images'][index]['mimeType']='image/avif'
 for texture in doc.get('textures',[]):
  index=texture.get('source',texture.get('extensions',{}).get('EXT_texture_webp',{}).get('source'))
  if index in changed:
   texture.pop('source',None);texture.setdefault('extensions',{}).pop('EXT_texture_webp',None);texture['extensions']['EXT_texture_avif']={'source':index}
 if changed:
  for key in ['extensionsUsed','extensionsRequired']:
   if 'EXT_texture_avif'not in doc.setdefault(key,[]):doc[key].append('EXT_texture_avif')
 output=bytearray();cache={}
 for i,v in enumerate(doc['bufferViews']):
  old=original['bufferViews'][i];content=binary[old.get('byteOffset',0):old.get('byteOffset',0)+old['byteLength']];payload=replacement.get(i,content);sha=hashlib.sha256(payload).digest()
  if sha not in cache:
   while len(output)%4:output.append(0)
   cache[sha]=len(output);output.extend(payload)
  v['byteOffset']=cache[sha];v['byteLength']=len(payload)
  if i not in views:assert output[v['byteOffset']:v['byteOffset']+len(payload)]==content
 while len(output)%4:output.append(0)
 doc['buffers'][0]['byteLength']=len(output)
 for table in ['meshes','nodes','materials','animations','skins','accessors']:assert doc.get(table)==original.get(table)
 body=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();body+=b' '*((-len(body))%4);glb=struct.pack('<III',0x46546c67,2,12+8+len(body)+8+len(output))+struct.pack('<I4s',len(body),b'JSON')+body+struct.pack('<I4s',len(output),b'BIN\0')+output;transfer=publishBinary(source,glb);report={'source':source,'beforeBytes':len(raw),'afterBytes':len(glb),'transferBytes':transfer,'geometryBytesIdentical':True,'sceneTablesIdentical':True,'textures':proof};reports.append(report);print(json.dumps({k:v for k,v in report.items()if k!='textures'}),flush=True)
# The live courtyard's external maps are kept at their original resolution.
for source in(root/'assets/home').glob('*'):
 if source.suffix.lower()not in{'.png','.jpg','.jpeg'}or source.stat().st_size<300000:continue
 result=encode(source.read_bytes())
 if not result:continue
 digest=hashlib.sha256(result[0]).hexdigest()[:20];target=folder/(digest+'.avif');target.write_bytes(result[0]);resources.setdefault('imageAliases',{})['/'+source.relative_to(root).as_posix()]='/'+target.relative_to(root).as_posix();reports.append({'source':source.relative_to(root).as_posix(),**result[1]})
file.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8');(root/'deploy/transfer-v185.json').write_text(json.dumps(reports,indent=2),encoding='utf-8');print(json.dumps({'complete':True,'optimized':len(reports)}))
