import fs from 'node:fs/promises';
const old=await fs.readFile('.verify/v32-110/before/v109-yangjian.js','utf8');
let s=await fs.readFile('yangjian.js','utf8');const tick=old.split('\n').find(l=>l.startsWith('function tick(')).replace(/\$\('#chapterStatus'\)\.textContent=[\s\S]*?(?=\}const nextScene)/,'');
s=s.replace(/^function tick\([^\n]*/m,tick).replace(/let savedRead;[^\n]*\n/,'');
await fs.writeFile('yangjian.js',s);
// Reuse the proven source-frame sampler with the correct directory and full canvas size.
let q=await fs.readFile('.verify/v32-109/opening/check-opening.mjs','utf8');q=q.replaceAll('v32-109','v32-110').replaceAll('1280,height:720','1600,height:900').replaceAll('0,0,1280,720','0,0,1600,900');await fs.writeFile('.verify/v32-110/opening/check-opening.mjs',q);
