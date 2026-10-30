import fs from 'node:fs/promises';
const note=await fs.readFile('CURRENT-V32-96-RESUME.md','utf8');
const instructions=await fs.readFile('AGENTS.md','utf8');
if(!instructions.startsWith('# CURRENT V32.96'))await fs.writeFile('AGENTS.md',note+'\n\n'+instructions);
let source=await fs.readFile('scripts/save-current-v32-95.mjs','utf8');
source=source.replaceAll('32.95','32.TEMP').replaceAll('32.94','32.95').replaceAll('32.TEMP','32.96')
 .replaceAll('v32-95','v32-TEMP').replaceAll('v32-94','v32-95').replaceAll('v32-TEMP','v32-96')
 .replaceAll('V32-95','V32-TEMP').replaceAll('V32-94','V32-95').replaceAll('V32-TEMP','V32-96');
source=source.replace('.verify/v32-96/home-check/web-checks.json','.verify/v32-96/web-checks.json');
source=source.replace("'src/home-world.ts',",'');
const files=['v31.html','v31-motion.js','v31-sand-story.js','src/home-designed-intro.jsx','src/home-world.ts','src/scene-loader.ts','scene-dist','AGENTS.md','CURRENT-V32-96-RESUME.md','scripts/document-v32-96.mjs','scripts/save-current-v32-96.mjs','scripts/verify-v32-96-package.mjs'];
source=source.replace(/const changed=\[[\s\S]*?\];/,'const changed='+JSON.stringify(files)+';');
await fs.writeFile('scripts/save-current-v32-96.mjs',source);
let verify=await fs.readFile('scripts/verify-v32-95-package.mjs','utf8');
verify=verify.replaceAll('32.95','32.96').replaceAll('v32-95','v32-96').replace('.verify/v32-94/check-web.mjs','.verify/v32-96/check-normal.mjs');
await fs.writeFile('scripts/verify-v32-96-package.mjs',verify);
console.log('V96 resume and archive scripts prepared.');
