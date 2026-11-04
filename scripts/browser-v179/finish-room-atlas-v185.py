from pathlib import Path
from PIL import Image, ImageChops
import json
folder=Path('assets/browser-v185/room-atlas');report={}
def dilate(image,steps):
 for _ in range(steps):
  for dx,dy in [(0,1),(1,0),(0,-1),(-1,0)]:
   shifted=ImageChops.offset(image,dx,dy);mask=ImageChops.subtract(shifted.getchannel('A'),image.getchannel('A'));image.paste(shifted,(0,0),mask)
 return image
for mode in ['on','off']:
 native=Image.open(folder/(mode+'.png')).convert('RGBA');base=Image.open(folder/('base-'+mode+'.png')).convert('RGBA')
 # The same source picture fills each UV chart. Padding extends chart pixels;
 # it never blurs or replaces the interior colour/texture detail.
 result=Image.alpha_composite(base,native);result=dilate(result,4);result.save(folder/(mode+'.webp'),lossless=True,method=6)
 report[mode]={'bytes':(folder/(mode+'.webp')).stat().st_size,'width':result.width,'height':result.height,'encoding':'lossless WebP','nativeSources':9,'fallback':'original room PBR, baked on identical geometry'}
Path('deploy/room-atlas-v185.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report))
