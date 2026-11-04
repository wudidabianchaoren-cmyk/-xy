from pathlib import Path
import json,hashlib,base64
p=Path('browser-resources-v180.js');r=json.loads(p.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));known={};proof=[]
for path in list(dict.fromkeys(r.get('imageAliases',{}).values()))+['/'+p.as_posix()for p in Path('assets/home').glob('*.jpg')]+['/'+p.as_posix()for p in Path('assets/odyssey/wood_planks').glob('*.jpg')]:
 f=Path(path.lstrip('/'))
 if f.is_file():known.setdefault(hashlib.sha256(f.read_bytes()).hexdigest(),path)
for f in Path('assets/browser-v186/shared').glob('*'):
 if f.suffix not in ['.jpg','.webp','.avif','.png']:continue
 k=hashlib.sha256(f.read_bytes()).hexdigest();old='/'+f.as_posix()
 if k in known and known[k]!=old:
  r.setdefault('imageAliases',{})[old]=known[k];proof.append({'from':old,'to':known[k],'bytes':f.stat().st_size,'SHA256':k})
 else:known[k]=old
embedded={}
for url in r.get('mseMedia',{}).values():
 f=Path(url.lstrip('/'));m=json.loads(f.read_text());m['init']='data:video/mp4;base64,'+base64.b64encode((f.parent/m['init']).read_bytes()).decode();embedded[url]=m
r['mseManifests']=embedded;p.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(r,separators=(',',':'))+';',encoding='utf-8');Path('deploy/canonical-images-v186.json').write_text(json.dumps(proof,indent=2));print(json.dumps({'aliases':len(proof),'equivalentBytes':sum(x['bytes']for x in proof),'embeddedMediaHeaders':len(embedded)}))
