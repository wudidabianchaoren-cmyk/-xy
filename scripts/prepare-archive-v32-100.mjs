import fs from 'node:fs/promises';
let save=await fs.readFile('scripts/save-current-v32-99.mjs','utf8');
save=save.replaceAll('32.99','32.TEMP').replaceAll('32.98','32.99').replaceAll('32.TEMP','32.100').replaceAll('v32-99','v32-TEMP').replaceAll('v32-98','v32-99').replaceAll('v32-TEMP','v32-100');
const changed=['v31.html','v31-works-ring.js','physical-universe.html','assets/works/physical-universe-v100','motion/physical-universe-v100','技能库记录.md','AGENTS.md','CURRENT-V32-100-RESUME.md','scripts/render-physical-universe-v100.mjs','scripts/make-physical-audio-v100.py','scripts/prepare-physical-v100.mjs','scripts/physical-studies-v100.mjs','scripts/prepare-archive-v32-100.mjs','scripts/save-current-v32-100.mjs','scripts/verify-v32-100-package.mjs'];
save=save.replace(/const changed=\[[\s\S]*?\];/,`const changed=${JSON.stringify(changed)};`).replace("source+'/CURRENT-V32-99-RESUME.md','接续说明.md'","source+'/CURRENT-V32-100-RESUME.md','接续说明.md'");
save=save.replace('qualityTargetComplete:false','qualityTargetComplete:false');
await fs.writeFile('scripts/save-current-v32-100.mjs',save);
const verify=(await fs.readFile('scripts/verify-v32-99-package.mjs','utf8')).replaceAll('32.99','32.100').replaceAll('v32-99','v32-100');await fs.writeFile('scripts/verify-v32-100-package.mjs',verify);
const qa=(await fs.readFile('.verify/v32-99/check-normal.mjs','utf8')).replaceAll('32.99','32.100').replaceAll('v32-99','v32-100').replaceAll('physical-universe-v99','physical-universe-v100');await fs.writeFile('.verify/v32-100/check-normal.mjs',qa);
const note=await fs.readFile('CURRENT-V32-100-RESUME.md','utf8');for(const f of['AGENTS.md','../AGENTS.md']){const previous=await fs.readFile(f,'utf8');if(!previous.startsWith('# CURRENT V32.100'))await fs.writeFile(f,note+'\n\n以下为历史记录，不覆盖当前版本。\n\n'+previous)}
console.log('V32.100 archive and desktop QA prepared');
