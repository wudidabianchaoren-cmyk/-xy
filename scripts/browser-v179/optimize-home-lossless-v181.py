from pathlib import Path
from PIL import Image
import struct,json,hashlib,gzip,io,copy
root=Path.cwd().resolve();out=root/'assets/browser-v181';out.mkdir(exist_ok=True);assert out.resolve().is_relative_to(root)
resourcesPath=root/'browser-resources-v180.js';resources=json.loads(resourcesPath.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));reports=[]
for source in ['blender/reference-architecture-v24/baked-architecture.glb','blender/reference-architecture-v16/architecture-world.glb']:
 raw=(root/source).read_bytes();jsonLength=struct.unpack_from('<I',raw,12)[0];document=json.loads(raw[20:20+jsonLength]);original=copy.deepcopy(document);binaryStart=20+jsonLength+8;binary=raw[binaryStart:];imageViews={image['bufferView']:index for index,image in enumerate(document.get('images',[])) if 'bufferView'in image};replacement={};changed=set();imageProof=[]
 for view,index in imageViews.items():
  item=document['bufferViews'][view];content=binary[item.get('byteOffset',0):item.get('byteOffset',0)+item['byteLength']]
  if document['images'][index].get('mimeType')!='image/png' or content[24]!=8:continue
  image=Image.open(io.BytesIO(content)).convert('RGBA');encoded=io.BytesIO();image.save(encoded,format='WEBP',lossless=True,exact=True,method=4);packed=encoded.getvalue()
  if len(packed)>=len(content):continue
  decoded=Image.open(io.BytesIO(packed)).convert('RGBA');assert decoded.tobytes()==image.tobytes()
  replacement[view]=packed;changed.add(index);document['images'][index]['mimeType']='image/webp';imageProof.append({'image':index,'width':image.width,'height':image.height,'originalBytes':len(content),'bytes':len(packed),'pixelsIdentical':True,'pixelSHA256':hashlib.sha256(image.tobytes()).hexdigest()})
 for texture in document.get('textures',[]):
  if texture.get('source')in changed:texture.setdefault('extensions',{})['EXT_texture_webp']={'source':texture.pop('source')}
 if changed:
  for key in ['extensionsUsed','extensionsRequired']:
   if 'EXT_texture_webp'not in document.setdefault(key,[]):document[key].append('EXT_texture_webp')
 result=bytearray();dedupe={};geometryIdentical=True
 for index,view in enumerate(document['bufferViews']):
  old=original['bufferViews'][index];content=binary[old.get('byteOffset',0):old.get('byteOffset',0)+old['byteLength']];payload=replacement.get(index,content);digest=hashlib.sha256(payload).digest()
  if digest in dedupe:offset=dedupe[digest]
  else:
   while len(result)%4:result.append(0)
   offset=len(result);result.extend(payload);dedupe[digest]=offset
  view['byteOffset']=offset;view['byteLength']=len(payload)
  if index not in imageViews:assert result[offset:offset+len(payload)]==content
 while len(result)%4:result.append(0)
 document['buffers'][0]['byteLength']=len(result)
 for table in ['meshes','nodes','materials','animations','skins','accessors']:assert document.get(table)==original.get(table),table+' changed'
 body=json.dumps(document,separators=(',',':'),ensure_ascii=False).encode();body+=b' '*((-len(body))%4);glb=struct.pack('<III',0x46546c67,2,12+8+len(body)+8+len(result))+struct.pack('<I4s',len(body),b'JSON')+body+struct.pack('<I4s',len(result),b'BIN\0')+result
 name=Path(source).stem;folder=out/name;folder.mkdir(exist_ok=True);(folder/(name+'.glb')).write_bytes(glb);compressed=gzip.compress(glb,compresslevel=6,mtime=0);assert gzip.decompress(compressed)==glb;parts=[]
 for index,offset in enumerate(range(0,len(compressed),4*1024*1024)):
  path=folder/f'part-{index:03d}.bin';path.write_bytes(compressed[offset:offset+4*1024*1024]);parts.append('/'+path.relative_to(root).as_posix())
 report={'source':source,'sourceBytes':len(raw),'optimizedBytes':len(glb),'packedBytes':len(compressed),'originalSourceSHA256':hashlib.sha256(raw).hexdigest(),'sha256':hashlib.sha256(glb).hexdigest(),'geometryBuffersIdentical':True,'sceneTablesIdentical':True,'imagePixelsIdentical':True,'images':imageProof,'encoding':'gzip','bytes':len(glb),'parts':parts};reports.append(report);resources['binary']['/'+source]=report;print(json.dumps({'source':source,'original':len(raw),'optimized':len(glb),'transfer':len(compressed),'imagesChanged':len(changed),'pixelLoss':False}),flush=True)
resourcesPath.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8');(out/'verification.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
