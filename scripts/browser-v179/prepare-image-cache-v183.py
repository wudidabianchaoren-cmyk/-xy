from pathlib import Path
import re,json,hashlib,io
from PIL import Image
root=Path.cwd();out=root/'assets/browser-v183/images';out.mkdir(parents=True,exist_ok=True);assert out.resolve().is_relative_to(root)
resourcesPath=root/'browser-resources-v180.js';resources=json.loads(resourcesPath.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));aliases={};groups={}
for entry in json.loads((root/'deploy/netlify-v182-asset-plan.json').read_text())['files']:
 if Path(entry['path']).suffix in ['.png','.jpg','.jpeg','.webp']:groups.setdefault(entry['sha1'],[]).append(entry)
for entries in groups.values():
 entries.sort(key=lambda f:(len(f['path']),f['path']))
 for entry in entries[1:]:aliases['/'+entry['path']]='/'+entries[0]['path']
refs=set()
for p in [*root.glob('*.html'),*root.glob('*.js')]:
 refs.update(re.findall(r'''(?:\./|/)?((?:assets|blender)/[^\s"'`<>?#{}]+\.png)''',p.read_text(encoding='utf-8-sig')))
jobs=sorted([p for name in refs if(p:=root/name).is_file()and p.stat().st_size>1000000],key=lambda p:p.stat().st_size,reverse=True)[:20];proof=[]
for p in jobs:
 if any(x in p.name.lower()for x in ['rgbe','normal','depth','roughness','lightmap']):continue
 raw=p.read_bytes();im=Image.open(io.BytesIO(raw));im.load()
 if im.mode not in ['RGB','RGBA','P','L','LA']or(abs(im.info.get('gamma',.45455)-.45455)>.001 and not im.info.get('icc_profile')):continue
 pixels=im.convert('RGBA');blob=io.BytesIO();pixels.save(blob,format='WEBP',lossless=True,exact=True,method=3,icc_profile=im.info.get('icc_profile',b''));encoded=blob.getvalue()
 if len(encoded)>=len(raw):continue
 decoded=Image.open(io.BytesIO(encoded)).convert('RGBA');assert pixels.tobytes()==decoded.tobytes();sha=hashlib.sha256(raw).hexdigest();path=out/(sha[:20]+'.webp');path.write_bytes(encoded);source='/'+p.relative_to(root).as_posix();aliases[source]='/'+path.relative_to(root).as_posix();proof.append({'source':source,'target':aliases[source],'originalBytes':len(raw),'bytes':len(encoded),'width':pixels.width,'height':pixels.height,'pixelsIdentical':True,'pixelSHA256':hashlib.sha256(pixels.tobytes()).hexdigest()});print(json.dumps({'source':source,'before':len(raw),'after':len(encoded),'pixelsIdentical':True}),flush=True)
resources['imageAliases']=aliases
pageImages={}
for name in ['after-journey','rural-return','mid-autumn','physical-universe','humid-southeast-asia','reading','learning']:
 html=(root/(name+'.html')).read_text(encoding='utf-8');items=[]
 for tag in re.findall('<img\\b[^>]+>',html):
  match=re.search('src="(?:\\./)?([^"]+)"',tag)
  if match and(root/match[1]).is_file()and(root/match[1]).stat().st_size<1800000:items.append('/'+match[1])
 pageImages['/'+name+'.html']=list(dict.fromkeys(items))[:2]
pageImages['/v31.html']=[f'/assets/atmosphere-v172/atmosphere-{i:02}.webp'for i in range(1,12)if i!=7]
resources['pageImages']=pageImages;resourcesPath.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8')
report={'noResize':True,'noLossyEncoding':True,'sourceOriginalsPreserved':True,'converted':proof,'aliasCount':len(aliases),'pageImages':pageImages};(root/'deploy/netlify-v183-image-cache.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps({'done':True,'before':sum(p['originalBytes']for p in proof),'after':sum(p['bytes']for p in proof),'count':len(proof)}),flush=True)
