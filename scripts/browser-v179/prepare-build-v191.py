from pathlib import Path
root=Path.cwd();(root/'.verify/v32-191').mkdir(exist_ok=True)
names=['scripts/build-browser-v190.mjs','scripts/build-fallback-v190.mjs']+['scripts/browser-v179/'+n+'-v190.py'for n in['build-release','stage-netlify','pack-delivery','pack-classic','pack-critical','preserve-old-modules','manifest','stage-cloudflare','cloudflare-upload']]+['scripts/browser-v179/cloudflare-hashes-v190.mjs']
for name in names:
 s=(root/name).read_text(encoding='utf-8').replace('v190','v191').replace('v32-190','v32-191').replace('32.190','32.191').replace('version:190','version:191').replace("'version':190","'version':191")
 if 'stage-netlify'in name:
  s=s.replace("'assets/browser-v189','assets/browser-v191'","'assets/browser-v189','assets/browser-v190','scene-dist/browser-v190','scene-dist/fallback-v190','assets/browser-v191'")
  s=s.replace("'assets/browser-v189/','assets/browser-v191/'","'assets/browser-v189/','assets/browser-v190/','assets/browser-v191/'")
 if 'preserve-old-modules'in name:s=s.replace("['scene-dist/browser-v189'","['scene-dist/browser-v190','scene-dist/fallback-v190','scene-dist/browser-v189'")
 (root/name.replace('v190','v191')).write_text(s,encoding='utf-8')
from PIL import Image
folder=root/'assets/browser-v191/previews';folder.mkdir(parents=True,exist_ok=True)
for name,source in [('reading','reading-entry'),('mythology','myth-entry')]:
 image=Image.open(root/'.verify/v32-190/formal-normal'/f'{source}.png').convert('RGB');image.thumbnail((1440,810));image.save(folder/f'{name}.webp','WEBP',quality=93,method=6)
print('Independent191 build prepared; old189/190 assets and geometry preserved')
