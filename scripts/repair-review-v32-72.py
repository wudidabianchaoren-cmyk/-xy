from pathlib import Path
import shutil
r=Path(__file__).resolve().parents[1]
shutil.copy2(r/'assets/home/home-live-poster-v32-71.png',r/'assets/home/home-live-poster-v32-72.png')
for f in ['verify-v32-72-home.mjs','verify-v32-72-final-home.mjs']:
 p=r/'.verify'/f;s=p.read_text('utf-8').replace('addedElements.length),19','addedElements.length),21').replace('labels.length,19','labels.length,21');p.write_text(s,'utf-8')
