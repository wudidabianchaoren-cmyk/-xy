from pathlib import Path
import re
root=Path.cwd()
page=root/'v31.html';text=page.read_text(encoding='utf-8')
for cls in ['personal-experience','personal-method']:
 text,n=re.subn(r'\s*<section class="'+cls+r'">.*?</section>','',text,flags=re.S);assert n==1
text=text.replace('<a href="tel:18928492291">18928492291</a>','<a href="tel:18928492291"><span>电话：</span>18928492291</a>').replace('<a href="mailto:wuxiaoyu7105@163.com">wuxiaoyu7105@163.com</a>','<a href="mailto:wuxiaoyu7105@163.com"><span>邮箱：</span>wuxiaoyu7105@163.com</a><span class="personal-wechat">微信：vvChi7</span>')
page.write_text(text,encoding='utf-8')
css=root/'personal-v154.css';css.write_text(css.read_text(encoding='utf-8')+'\n#personalPage .personal-contact{align-items:center;gap:12px 24px}#personalPage .personal-contact>a,#personalPage .personal-contact>.personal-wechat{font:inherit;white-space:nowrap;color:inherit}#personalPage .personal-contact>a>span{color:#62674e}\n',encoding='utf-8')
# Give changed modules a fresh immutable namespace; keep old published assets.
paths=['scripts/build-browser-v187.mjs','scripts/build-fallback-v187.mjs']+['scripts/browser-v179/'+n+'-v187.py' for n in ['build-release','stage-netlify','pack-delivery','pack-classic','pack-critical','preserve-old-modules','manifest']]
for name in paths:
 src=root/name;dst=root/name.replace('v187','v189');s=src.read_text(encoding='utf-8').replace('v187','v189').replace('v32-187','v32-189').replace('32.187','32.189').replace('version:187','version:189').replace("'version':187","'version':189")
 if 'stage-netlify' in name:
  s=s.replace("'assets/browser-v189','scene-dist/browser-v186'","'assets/browser-v187','assets/browser-v189','scene-dist/browser-v187','scene-dist/fallback-v187','scene-dist/browser-v186'")
  s=s.replace("name.startswith(('assets/browser-v185/','assets/browser-v186/','assets/browser-v189/'))","name.startswith(('assets/browser-v185/','assets/browser-v186/','assets/browser-v187/','assets/browser-v189/'))")
  # Transport/media are unchanged and must retain their established names.
  s=s.replace('transport-v189.js','transport-v187.js').replace('progressive-media-v189.js','progressive-media-v187.js')
 if 'preserve-old-modules' in name:s=s.replace("['scene-dist/browser-v185','scene-dist/fallback-v185']","['scene-dist/browser-v185','scene-dist/fallback-v185','scene-dist/browser-v186','scene-dist/fallback-v186','scene-dist/browser-v187','scene-dist/fallback-v187']")
 dst.write_text(s,encoding='utf-8')
for name in ['stage-cloudflare-v188.py','cloudflare-upload-v188.py','cloudflare-hashes-v188.mjs']:
 src=root/'scripts/browser-v179'/name;dst=src.with_name(name.replace('v188','v189'));s=src.read_text(encoding='utf-8').replace('v188','v189').replace('v32-188','v32-189').replace("'version':188","'version':189")
 if 'stage-cloudflare' in name:
  s=s.replace("source=root/'.verify/v32-187/site'","source=root/'.verify/v32-189/site'").replace("root/'.verify/v32-187/asset-plan.json'","root/'.verify/v32-189/asset-plan.json'").replace("out=root/'.verify/v32-189'","out=root/'.verify/v32-189/cloudflare'")
  s=s.replace("'sourceCandidate':187","'sourceCandidate':189")
 else:s=s.replace('.verify/v32-189','.verify/v32-189/cloudflare')
 dst.write_text(s,encoding='utf-8')
print('Personal changes and isolated release scripts prepared')
