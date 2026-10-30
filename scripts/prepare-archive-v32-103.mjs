import fs from 'node:fs/promises';
const advance=s=>s.replaceAll('32.102','32.NEXT').replaceAll('32.101','32.102').replaceAll('32.NEXT','32.103').replaceAll('v32-102','v32-NEXT').replaceAll('v32-101','v32-102').replaceAll('v32-NEXT','v32-103');
let save=advance(await fs.readFile('scripts/save-current-v32-102.mjs','utf8')).replaceAll('CURRENT-V32-102-RESUME.md','CURRENT-V32-103-RESUME.md');
const unchanged=[
 'after-journey.css','after-journey.js','after-journey.html','rural-return.html','mid-autumn.html','v23.js','v32-88.css','src/native-v20.ts','reading.html','src/reading-book.ts','src/home-discoveries.ts','work-project.js',
 'assets/loading-study/loading-study-v32-84.mp4','assets/prompt-lab/prompt-structure.webp','assets/prompt-lab/production-pipeline.webp','assets/prompt-lab/director-orchestration.webp',
 'assets/works/after-journey/trailer-v32-92.mp4','assets/works/after-journey/cover-v32-92.webp','assets/works/after-journey/manifest.json','assets/works/rural-return/film-sr-v32-92.mp4','assets/works/rural-return/cover.webp','assets/works/rural-return/manifest.json','assets/works/mid-autumn/mid-autumn-web.mp4','assets/works/mid-autumn/cover-v32-92.webp','assets/works/orbit-previews/bamboo-sun-path.webp','assets/works/orbit-previews/crane-cave-skull.webp',
 'assets/works/home-creation/construction-v32-93.mp4','assets/works/home-creation/manifest.json','assets/works/home-creation/frame-01.webp','assets/works/home-creation/frame-02.webp','assets/works/home-creation/frame-03.webp',
 'assets/works/home-creation-v101/manifest.json','assets/works/home-creation-v101/clock-collage-01.png','assets/works/home-creation-v101/clock-collage-02.png','assets/works/home-creation-v101/clock-collage-01.webp','assets/works/home-creation-v101/clock-collage-02.webp','assets/works/home-creation-v101/gallery-v101.css','assets/works/home-creation-v101/prompts.json','blender/reference-architecture-v24/current-complete-courtyard.blend'
];
const changed=[
 'v31.html','v31-works-ring.js','physical-universe.html','home-creation.html','home-creation-gallery-v103.js','home-creation-gallery-v103.css',
 'src/odyssey-materials-v103.ts','src/odyssey-scene.ts','scene-dist','assets/odyssey/pbr-v103','blender/mythology-v32-103','blender/home-construction-v32-103','assets/works/home-creation-v103','assets/works/physical-universe-v103','motion/physical-universe-v103',
 'scripts/download-mythology-v103.mjs','scripts/extract-mythology-skin-v103.mjs','scripts/pack-mythology-surfaces-v103.py','scripts/render-mythology-v103.py',
 'scripts/build-construction-v32-103.py','scripts/render-construction-v32-103.py','scripts/compose-construction-score-v32-103.py','scripts/encode-construction-v32-103.mjs','scripts/audit-construction-v32-103.py',
 'scripts/prepare-physical-v103.mjs','scripts/render-physical-universe-v103.mjs','scripts/make-physical-audio-v103.py','scripts/physical-studies-v103.mjs','scripts/integrate-physical-v103.mjs',
 '技能库记录.md','AGENTS.md','CURRENT-V32-103-RESUME.md','scripts/prepare-archive-v32-103.mjs','scripts/save-current-v32-103.mjs','scripts/verify-v32-103-package.mjs'
];
save=save.replace(/const unchanged=\[[\s\S]*?\];/,`const unchanged=${JSON.stringify(unchanged)};`).replace(/const changed=\[[\s\S]*?\];/,`const changed=${JSON.stringify(changed)};`);
const readChecks=String.raw`const read=async f=>JSON.parse(await fs.readFile(f,'utf8'));
const web=await read('.verify/v32-103/web-checks.json'),media=await read('.verify/v32-103/promo/production.json'),home=await read('.verify/v32-103/home-gallery/checks.json'),native=await read('.verify/v32-103/promo/native-checks.json'),promoWeb=await read('.verify/v32-103/promo/web-checks.json');
const construction={render:await read('.verify/v32-103/construction/render.json'),production:await read('.verify/v32-103/construction/production.json'),native:await read('.verify/v32-103/construction/native-checks.json'),web:await read('.verify/v32-103/construction/web-checks.json')};
const mythology={state:await read('.verify/v32-103/mythology/after-checks.json'),errors:await read('.verify/v32-103/mythology/after-errors.json'),nativeAudit:await read('blender/mythology-v32-103/native-audit.json'),performance:await read('.verify/v32-103/mythology/performance.json')};
assert(web.passed&&media.passed&&home.pass&&native.passed&&promoWeb.passed);assert(Object.values(construction).every(x=>x.passed));assert.equal(media.duration,18);assert.equal(media.galleryFrames,8);assert.equal(construction.production.targetSeconds,24);assert.equal(construction.production.frames,720);assert.equal(home.originalImageBytesRetained.length,6);assert(home.originalImageBytesRetained.every(x=>x.retained));
assert(mythology.state.ready&&mythology.state.finish.version===103&&mythology.state.finish.realPbrMaps&&mythology.state.finish.seaChanged===false);assert.equal(mythology.state.boats,4);assert(!mythology.errors.some(e=>/shader|MAX_TEXTURE_IMAGE_UNITS|VALIDATE_STATUS/i.test(String(e))));assert(mythology.errors.every(e=>/404|favicon/i.test(String(e))));assert(web.mythology.passed&&web.mythology.unexpectedErrors.length===0&&web.mythology.missing.every(x=>new URL(x.url).pathname.endsWith('/favicon.ico')&&x.status===404));
assert(mythology.performance.passed&&mythology.nativeAudit.originalAnatomyUvMatched===true&&mythology.nativeAudit.cameraBackgroundExcludesHdriBuildings===true);
const typecheck=await read('.verify/scenes-typecheck-results.json');assert(typecheck.passed);assert((await fs.readFile('CURRENT-V32-103-RESUME.md','utf8')).includes('V32.103'));`;
save=save.replace(/const web=[\s\S]*?assert\(web\.passed&&media\.passed&&home\.pass&&native\.passed\);/,readChecks);
save=save.replace('web,media,home,native,unchangedSha256','web,media,home,native,promoWeb,construction,mythology,typecheck,unchangedSha256');
save=save.replace("'The film uses original Canvas pseudo-3D material painting, not a Blender or raytraced render.'","'The promo uses original Canvas graphic material painting; mythology real-time WebGL and the native Cycles material study are separate outputs.'");
save=save.replace("'Main-site performance was not re-benchmarked in this film task.'","'Functional and snapshot checks do not constitute user art approval; no global constant-frame-rate claim is made.'");
await fs.writeFile('scripts/save-current-v32-103.mjs',save);

let verify=advance(await fs.readFile('scripts/verify-v32-102-package.mjs','utf8'));
verify=verify.replace("['assets/works/home-creation-v102/verify-desktop.mjs']","['.verify/v32-103/home-gallery/check-desktop.mjs']");
verify=verify.replace("PORTFOLIO_OUTPUT:'.verify/v32-103-independent'","PORTFOLIO_OUTPUT:'.verify/v32-103-independent'");
const inherited=verify.indexOf("await new Promise((resolve,reject)=>{const p=spawn(process.execPath,['assets/works/home-creation-v102/verify-desktop.mjs']");
if(inherited>=0)throw Error('Home gallery verifier path was not replaced');
verify=verify.replace("const hc=JSON.parse(await fs.readFile(project+'/.verify/v32-103-independent/home-creation/checks.json','utf8'));assert(hc.pass);result.homeGalleryPassed=hc.pass;", "const hc=JSON.parse(await fs.readFile(project+'/.verify/v32-103-independent/home-creation/checks.json','utf8'));assert(hc.pass);result.homeGalleryPassed=hc.pass;" );
// Run the complete gallery suite and construction media checks from the copied package.
const third=String.raw`await new Promise((resolve,reject)=>{const p=spawn(process.execPath,['.verify/v32-103/construction/check-web.mjs'],{cwd:project,env:{...process.env,PORTFOLIO_URL:'http://localhost:8032',CONSTRUCTION_OUTPUT:'.verify/v32-103-independent/construction'},stdio:'inherit',windowsHide:true});p.on('error',reject);p.on('exit',c=>c===0?resolve():reject(Error('Independent construction playback failed '+c)));});const cc=JSON.parse(await fs.readFile(project+'/.verify/v32-103-independent/construction/web-checks.json','utf8'));assert(cc.passed);result.constructionPassed=true;`;
verify=verify.replace("assert.equal(await hash(saved.previousPackage+'/保存结果.json'),saved.previousArchiveSha256);result.passed=true;",third+"assert.equal(await hash(saved.previousPackage+'/保存结果.json'),saved.previousArchiveSha256);result.passed=true;");
verify=verify.replace("import assert from'node:assert/strict';","import assert from'node:assert/strict';import net from'node:net';");
verify=verify.replace("const server=spawn(","await new Promise((resolve,reject)=>{const c=net.createConnection({host:'127.0.0.1',port:8032});c.once('connect',()=>{c.destroy();reject(Error('Independent port 8032 is already in use'));});c.once('error',e=>e.code==='ECONNREFUSED'?resolve():reject(e));});\nconst server=spawn(");
verify=verify.replace("{stdio:'ignore'}","{stdio:'ignore',windowsHide:true}");
await fs.writeFile('scripts/verify-v32-103-package.mjs',verify);
console.log('Prepared V32.103 save/verify scripts. No copy, server, check or archive was executed.');
