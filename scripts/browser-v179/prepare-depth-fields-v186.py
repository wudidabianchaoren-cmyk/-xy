"""Reversible byte-plane/left prediction for packed numeric visibility data."""
from pathlib import Path
from PIL import Image,ImageChops
import gzip,json,hashlib
root=Path.cwd();source=root/'assets/browser-v179/myth-field/manifest.json';manifest=json.loads(source.read_text());out=root/'assets/browser-v186/depth-fields';out.mkdir(parents=True,exist_ok=True);records=[]
for pose in manifest['poses']:
 original=source.parent/pose['depth'];raw=gzip.decompress(original.read_bytes());width,height=pose['depthWidth'],pose['depthHeight'];assert len(raw)==width*height*4
 image=Image.frombytes('RGBA',(width,height),raw);left=ImageChops.offset(image,1,0);left.paste((0,0,0,0),(0,0,1,height));filtered=ImageChops.subtract_modulo(image,left).tobytes();planar=b''.join(filtered[c::4]for c in range(4));packed=gzip.compress(planar,9,mtime=0);digest=hashlib.sha256(packed).hexdigest();filename=digest[:24]+'.bin.gz';(out/filename).write_bytes(packed)
 for k in ['on','off']:pose[k]='/'+(source.parent/pose[k]).relative_to(root).as_posix()
 pose.update(depth=filename,depthCodec='byteplanes-left-gzip-v186',depthSHA256=hashlib.sha256(raw).hexdigest(),depthFallback='/'+original.relative_to(root).as_posix())
 records.append({'id':pose['id'],'beforeBytes':original.stat().st_size,'afterBytes':len(packed),'decodedBytes':len(raw),'decodedSHA256':pose['depthSHA256']})
(out/'manifest.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8');(root/'deploy/depth-fields-v186.json').write_text(json.dumps({'version':186,'codec':'byte-plane horizontal modulo256 prediction / gzip','originalInputsChanged':False,'runtimeSHA256Required':True,'records':records},indent=2),encoding='utf-8');print(json.dumps({'beforeBytes':sum(r['beforeBytes']for r in records),'afterBytes':sum(r['afterBytes']for r in records)}))
