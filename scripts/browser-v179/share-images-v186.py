from pathlib import Path
from PIL import Image
import json,struct,gzip,hashlib,io,copy,posixpath
root=Path.cwd();folder=root/'assets/browser-v186/shared';folder.mkdir(parents=True,exist_ok=True);resourceFile=root/'browser-resources-v180.js';resources=json.loads(resourceFile.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));reports=[];images={};cache={}
sources=['/blender/reference-architecture-v16/architecture-world.glb','/blender/reference-architecture-v18/courtyard-additions.glb','/blender/reference-architecture-v19/architectural-profiles.glb','/blender/reference-architecture-v20/courtyard-depth.glb','/blender/reference-architecture-v24/baked-architecture.glb','/blender/reference-architecture-v25/clock-engraving.glb','/assets/odyssey/crew-v162/medieval-rowers.glb','/assets/odyssey/crew-v163/vessel-coherent.glb','/assets/odyssey/refit-v148/island-bridged-web-c.glb','/assets/odyssey/compact-v134/vegetation.glb','/assets/odyssey/refit-v148/grass-grounded-c.glb']
baseline=json.loads((root/'.verify/v32-180/site/browser-resources-v180.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
def shared(content,mime):
 sha=hashlib.sha256(content).hexdigest()
 if sha in cache:return cache[sha]
 result=content;typ=mime;proof={'sourceSHA256':sha,'sourceBytes':len(content),'pixelsUnchanged':True}
 if mime=='image/png':
  source=Image.open(io.BytesIO(content))
  if source.mode in ['RGB','RGBA']:
   out=io.BytesIO();source.save(out,format='WEBP',lossless=True,exact=True,method=6,icc_profile=source.info.get('icc_profile',b''));encoded=out.getvalue()
   if len(encoded)<len(content):
    decoded=Image.open(io.BytesIO(encoded)).convert(source.mode);assert decoded.size==source.size and decoded.tobytes()==source.tobytes(),'Image pixels changed';result=encoded;typ='image/webp';proof.update(width=source.width,height=source.height,decodedPixelSHA256=hashlib.sha256(source.tobytes()).hexdigest(),encoding='lossless WebP / exact transparent RGB')
 suffix={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/avif':'avif'}[typ];target=folder/(hashlib.sha256(result).hexdigest()[:24]+'.'+suffix)
 target.write_bytes(result);url='/'+target.relative_to(root).as_posix();proof.update(url=url,bytes=len(result));images[url]=proof;cache[sha]=(url,typ);return url,typ
for source in sources:
 record=baseline.get('binary',{}).get(source)
 if record:
  original=gzip.decompress(b''.join((root/p.lstrip('/')).read_bytes()for p in record['parts']))
 else:original=(root/source.lstrip('/')).read_bytes()
 size=struct.unpack_from('<I',original,12)[0];doc=json.loads(original[20:20+size]);before=copy.deepcopy(doc);binary=original[28+size:];removed=set();refs=[]
 for image in doc.get('images',[]):
  if 'bufferView'not in image:continue
  view=before['bufferViews'][image['bufferView']];start=view.get('byteOffset',0);content=binary[start:start+view['byteLength']];uri,mime=shared(content,image.get('mimeType','image/png'));removed.add(image.pop('bufferView'));image['uri']=posixpath.relpath(uri.lstrip('/'),posixpath.dirname(source.lstrip('/')));image['mimeType']=mime;refs.append(uri)
 if not removed:continue
 oldViews=before['bufferViews'];kept=[i for i in range(len(oldViews))if i not in removed];mapping={old:new for new,old in enumerate(kept)};payload=bytearray();views=[]
 for i in kept:
  view=copy.deepcopy(oldViews[i]);data=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
  while len(payload)%4:payload.append(0)
  view['byteOffset']=len(payload);payload.extend(data);views.append(view)
  assert payload[view['byteOffset']:view['byteOffset']+view['byteLength']]==data
 for accessor in doc.get('accessors',[]):
  if 'bufferView'in accessor:accessor['bufferView']=mapping[accessor['bufferView']]
  if 'sparse'in accessor:
   for kind in ['indices','values']:accessor['sparse'][kind]['bufferView']=mapping[accessor['sparse'][kind]['bufferView']]
 for mesh in doc.get('meshes',[]):
  for primitive in mesh['primitives']:
   draco=primitive.get('extensions',{}).get('KHR_draco_mesh_compression')
   if draco:draco['bufferView']=mapping[draco['bufferView']]
 # Material, node, animation, texture and sampler tables have identical meaning.
 for table in ['nodes','materials','animations','skins','textures','samplers']:assert before.get(table)==doc.get(table)
 while len(payload)%4:payload.append(0)
 doc['bufferViews']=views;doc['buffers'][0]['byteLength']=len(payload)
 head=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();head+=b' '*((-len(head))%4)
 glb=struct.pack('<III',0x46546c67,2,28+len(head)+len(payload))+struct.pack('<I4s',len(head),b'JSON')+head+struct.pack('<I4s',len(payload),b'BIN\0')+payload
 packed=gzip.compress(glb,compresslevel=9,mtime=0);digest=hashlib.sha256(packed).hexdigest()[:24];parts=[]
 for i,start in enumerate(range(0,len(packed),524288)):
  target=folder/(digest+'-'+str(i).zfill(3)+'.bin');target.write_bytes(packed[start:start+524288]);parts.append('/'+target.relative_to(root).as_posix())
 resources.setdefault('binary',{})[source]={'encoding':'gzip','bytes':len(glb),'parts':parts,'sha256':hashlib.sha256(glb).hexdigest()}
 report={'source':source,'beforeBytes':len(original),'geometryTransferBytes':len(packed),'images':refs,'geometryBuffersUnchanged':True,'materialNodeAnimationTablesUnchanged':True};reports.append(report);print(json.dumps(report),flush=True)
resourceFile.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8');(root/'deploy/shared-images-v186.json').write_text(json.dumps({'version':186,'records':reports,'uniqueImages':images,'sourceImages':len(cache),'uniqueImagesCount':len(images)},indent=2),encoding='utf-8');print(json.dumps({'complete':True,'models':len(reports),'images':len(images)}))
