from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
def edit(f,a,b):
 p=root/f;s=p.read_text('utf-8');assert a in s,(f,a);p.write_text(s.replace(a,b),'utf-8')
edit('v31-sand-story.js','const f=faces.find(f=>random()*total<=f.limit)||faces[3];','const selection=random()*total;\n      const f=faces.find(f=>selection<=f.limit)||faces[3];')
edit('src/native-v18.ts','nativeBlender:true,eyeCount:1','nativeBlender:true,completeGarment:true,eyeCount:1')
for f in ['v31-motion.js','v31.html','src/scene-loader.ts']:
 p=root/f;s=p.read_text('utf-8').replace('loading-study-v32-71','loading-study-v32-72').replace('opening-poster-v32-71','opening-poster-v32-72').replace('?v=32.71','?v=32.72');p.write_text(s,'utf-8')
for name in ['verify-v32-71-home.mjs','verify-v32-71-final-home.mjs','verify-odyssey-v32-71.mjs','verify-v32-71-layout.mjs','run-v32-71-regressions.mjs']:
 s=(root/'.verify'/name).read_text('utf-8').replace('v32-71','v32-72').replace('32.71','32.72')
 if name=='verify-v32-71-home.mjs':s=s.replace('addedElements.length),22','addedElements.length),19')
 if name=='verify-v32-71-final-home.mjs':s=s.replace('labels.length,22','labels.length,19')
 if name=='verify-odyssey-v32-71.mjs':s=s.replace('assert.equal(result.state.storyElements.length,7)','assert.equal(result.state.storyElements.length,6)')
 (root/'.verify'/name.replace('v32-71','v32-72')).write_text(s,'utf-8')
print('Updated current URLs, density sampling and prepared regression runners')
