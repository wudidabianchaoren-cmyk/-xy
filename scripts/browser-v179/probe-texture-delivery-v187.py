from pathlib import Path
from PIL import Image
import io,json,hashlib
root=Path.cwd();out=root/'assets/browser-v187/texture-candidates';out.mkdir(parents=True,exist_ok=True);proof=[];seen=set();r=json.loads((root/'browser-resources-v180.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
for p in [*Path('assets/home').glob('*.jpg'),*Path('assets/odyssey/wood_planks').glob('*.jpg'),*Path('assets/browser-v186/shared').glob('*.jpg')]:
 url='/'+p.as_posix()
 for _ in range(4):
  if url not in r.get('imageAliases',{}):break
  url=r['imageAliases'][url]
 if not url.endswith('.jpg')or url in seen:continue
 seen.add(url);source=root/url.lstrip('/');im=Image.open(source);im.load();b=io.BytesIO();im.save(b,format='WEBP',lossless=True,exact=True,method=4,icc_profile=im.info.get('icc_profile',b''));data=b.getvalue()
 if len(data)>=source.stat().st_size*.85:continue
 target=out/(hashlib.sha256(data).hexdigest()[:24]+'.webp');target.write_bytes(data);assert Image.open(target).convert('RGBA').tobytes()==im.convert('RGBA').tobytes();item={'source':url,'candidate':'/'+target.relative_to(root).as_posix(),'before':source.stat().st_size,'after':len(data),'decodedPILPixelsEqual':True,'adopted':False};proof.append(item);print(json.dumps(item),flush=True)
(root/'.verify/v32-187/texture-delivery-probe.json').write_text(json.dumps(proof,indent=2));print(json.dumps({'candidates':len(proof),'savedBytes':sum(p['before']-p['after']for p in proof)}))
