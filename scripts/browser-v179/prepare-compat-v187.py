from pathlib import Path
from PIL import Image
import json,hashlib,base64,io,shutil
root=Path.cwd();rp=root/'browser-resources-v180.js';r=json.loads(rp.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));out=root/'assets/browser-v187';(out/'images').mkdir(parents=True,exist_ok=True);(out/'media').mkdir(exist_ok=True);records=[];fallbacks={};known={}
paths={p for p in r.get('imageAliases',{}).values()if p.endswith('.avif')}|{'/'+p.as_posix()for p in Path('assets/browser-v186/shared').glob('*.avif')}
for url in sorted(paths):
 p=root/url.lstrip('/');digest=hashlib.sha256(p.read_bytes()).hexdigest()
 if digest not in known:
  im=Image.open(p);im.load();target=out/'images'/(digest[:24]+'.webp');im.save(target,format='WEBP',lossless=True,exact=True,method=4,icc_profile=im.info.get('icc_profile',b''));decoded=Image.open(target).convert('RGBA');assert decoded.size==im.size and decoded.tobytes()==im.convert('RGBA').tobytes();known[digest]='/'+target.relative_to(root).as_posix();records.append({'source':url,'target':known[digest],'width':im.width,'height':im.height,'decodedPixelsPreserved':True,'sourceBytes':p.stat().st_size,'bytes':target.stat().st_size})
 fallbacks[url]=known[digest]
r['imageFormatFallbacks187']=fallbacks;probe=io.BytesIO();Image.new('RGB',(1,1),(72,98,110)).save(probe,format='AVIF',quality=100);r['avifProbe187']=base64.b64encode(probe.getvalue()).decode()
direct={}
for url in ['/assets/loading-study/loading-study-v32-84.mp4','/assets/home-intro-v170/courtyard-16s.mp4','/assets/works/after-journey/trailer-v32-92.mp4']:
 p=root/url.lstrip('/')
 if not p.is_file()or p.stat().st_size>49*1048576:continue
 sha=hashlib.sha256(p.read_bytes()).hexdigest();target=out/'media'/(sha[:24]+'.mp4');shutil.copyfile(p,target);assert hashlib.sha256(target.read_bytes()).hexdigest()==sha;direct[url]='/'+target.relative_to(root).as_posix();records.append({'source':url,'target':direct[url],'bytes':p.stat().st_size,'SHA256':sha,'videoBytesUnchanged':True})
r['directMedia187']=direct;rp.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(r,separators=(',',':'))+';',encoding='utf-8');(root/'deploy/compat-v187.json').write_text(json.dumps({'version':187,'fallbackImages':records,'capabilityBasedSelection':True,'sourceInputsChanged':False},indent=2),encoding='utf-8');print(json.dumps({'fallbackImages':len(known),'directMedia':direct}))
