from pathlib import Path
root=Path.cwd()
names=['scripts/build-browser-v189.mjs','scripts/build-fallback-v189.mjs']+['scripts/browser-v179/'+n+'-v189.py'for n in ['build-release','stage-netlify','pack-delivery','pack-classic','pack-critical','preserve-old-modules','manifest','stage-cloudflare','cloudflare-upload']]+['scripts/browser-v179/cloudflare-hashes-v189.mjs']
for name in names:
 p=root/name;s=p.read_text(encoding='utf-8').replace('v189','v190').replace('v32-189','v32-190').replace('32.189','32.190').replace('version:189','version:190').replace("'version':189","'version':190");q=root/name.replace('v189','v190')
 if 'stage-netlify'in name:
  s=s.replace("'assets/browser-v190','scene-dist/browser-v187'","'assets/browser-v189','assets/browser-v190','scene-dist/browser-v189','scene-dist/fallback-v189','scene-dist/browser-v187'")
  s=s.replace("'assets/browser-v187/','assets/browser-v190/'","'assets/browser-v187/','assets/browser-v189/','assets/browser-v190/'")
  s=s.replace("'assets/browser-v190','scene-dist/browser-v190','scene-dist/fallback-v190'","'assets/browser-v189','scene-dist/browser-v189','scene-dist/fallback-v189','assets/browser-v190','scene-dist/browser-v190','scene-dist/fallback-v190'")
 if 'preserve-old-modules'in name:s=s.replace("['scene-dist/browser-v185'","['scene-dist/browser-v189','scene-dist/fallback-v189','scene-dist/browser-v185'")
 q.write_text(s,encoding='utf-8')
print('New immutable190 namespace prepared, previous189 resources preserved')
