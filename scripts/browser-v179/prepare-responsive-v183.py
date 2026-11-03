from pathlib import Path
import json,hashlib,io
from PIL import Image
root=Path.cwd();rp=root/'browser-resources-v180.js';resources=json.loads(rp.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));proof=json.loads((root/'deploy/netlify-v183-image-cache.json').read_text());responsive={};variants=[]
for record in proof['converted']:
 source=record['source']
 if any(x in source.lower()for x in ['rgbe','normal','depth','roughness','lightmap']):
  resources['imageAliases'].pop(source,None);continue
 original=root/source.lstrip('/');image=Image.open(original);image.load();pixels=image.convert('RGBA');items=[]
 for width in [640,1280,1920]:
  if width>=pixels.width:continue
  size=(width,round(pixels.height*width/pixels.width));small=pixels.resize(size,Image.Resampling.LANCZOS);name=hashlib.sha256(original.read_bytes()).hexdigest()[:20]+f'-{width}.webp';target=root/'assets/browser-v183/images'/name;small.save(target,format='WEBP',lossless=True,exact=True,method=2,icc_profile=image.info.get('icc_profile',b''));assert Image.open(target).convert('RGBA').tobytes()==small.tobytes();items.append({'src':'/'+target.relative_to(root).as_posix(),'width':width,'bytes':target.stat().st_size});variants.append({'source':source,'width':width,'height':size[1],'src':items[-1]['src'],'bytes':items[-1]['bytes'],'resampledPixelsIdentical':True})
 items.append({'src':record['target'],'width':pixels.width,'bytes':record['bytes']});responsive[source]=items;responsive[record['target']]=items
resources['responsiveImages']=responsive;rp.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8');proof['responsivePreviews']=variants;proof['previewNote']='DOM display previews use proportional Lanczos resizing then lossless encoding; original full-resolution images remain available for zoom. WebGL/data textures are never resized.';(root/'deploy/netlify-v183-image-cache.json').write_text(json.dumps(proof,indent=2),encoding='utf-8');print(json.dumps({'responsiveImages':len(responsive)//2,'previews':len(variants),'previewMiB':round(sum(v['bytes']for v in variants)/1048576,1)}))
