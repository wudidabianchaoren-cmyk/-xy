import fs from 'node:fs/promises';

const advance=s=>s.replaceAll('32.101','32.NEXT').replaceAll('32.100','32.101').replaceAll('32.NEXT','32.102').replaceAll('v32-101','v32-NEXT').replaceAll('v32-100','v32-101').replaceAll('v32-NEXT','v32-102');
let save=advance(await fs.readFile('scripts/save-current-v32-101.mjs','utf8')).replaceAll('CURRENT-V32-101-RESUME.md','CURRENT-V32-102-RESUME.md');
const unchanged=[
 'after-journey.css','after-journey.js','after-journey.html','rural-return.html','mid-autumn.html','v23.js','v32-88.css','src/native-v20.ts','reading.html','src/reading-book.ts','src/home-discoveries.ts','work-project.js',
 'assets/loading-study/loading-study-v32-84.mp4','assets/prompt-lab/prompt-structure.webp','assets/prompt-lab/production-pipeline.webp','assets/prompt-lab/director-orchestration.webp',
 'assets/works/after-journey/trailer-v32-92.mp4','assets/works/after-journey/cover-v32-92.webp','assets/works/after-journey/manifest.json','assets/works/rural-return/film-sr-v32-92.mp4','assets/works/rural-return/cover.webp','assets/works/rural-return/manifest.json',
 'assets/works/mid-autumn/mid-autumn-web.mp4','assets/works/mid-autumn/cover-v32-92.webp','assets/works/orbit-previews/bamboo-sun-path.webp','assets/works/orbit-previews/crane-cave-skull.webp',
 'assets/works/home-creation/construction-v32-93.mp4','assets/works/home-creation/manifest.json','assets/works/home-creation/frame-01.webp','assets/works/home-creation/frame-02.webp','assets/works/home-creation/frame-03.webp',
 'assets/works/home-creation-v101/manifest.json','assets/works/home-creation-v101/clock-collage-01.png','assets/works/home-creation-v101/clock-collage-02.png','assets/works/home-creation-v101/clock-collage-01.webp','assets/works/home-creation-v101/clock-collage-02.webp','assets/works/home-creation-v101/gallery-v101.css','assets/works/home-creation-v101/prompts.json',
 'blender/reference-architecture-v24/current-complete-courtyard.blend'
];
const changed=[
 'v31.html','v31-works-ring.js','physical-universe.html','home-creation.html','home-creation-launch.js','home-creation-gallery-v102.js','home-creation-gallery-v102.css',
 'assets/works/physical-universe-v102','assets/works/home-creation-v102','motion/physical-universe-v102','技能库记录.md','AGENTS.md','CURRENT-V32-102-RESUME.md',
 'scripts/render-physical-universe-v102.mjs','scripts/make-physical-audio-v102.py','scripts/prepare-physical-v102.mjs','scripts/physical-studies-v102.mjs','scripts/refine-physical-v102.mjs',
 'scripts/prepare-archive-v32-102.mjs','scripts/save-current-v32-102.mjs','scripts/verify-v32-102-package.mjs'
];
save=save.replace(/const unchanged=\[[\s\S]*?\];/,`const unchanged=${JSON.stringify(unchanged)};`).replace(/const changed=\[[\s\S]*?\];/,`const changed=${JSON.stringify(changed)};`);
// All five existing work entries must match the frozen package. Only this film's entry is changed.
const keepWorks=String.raw`const rowList=s=>s.match(/const works = \[([\s\S]*?)\]\.map/)[1].split('\n').map(r=>r.trim()).filter(r=>r.startsWith('[')&&!r.includes('让画面发生'));assert.deepEqual(rowList(await fs.readFile(source+'/v31-works-ring.js','utf8')),rowList(await fs.readFile(previous+'/项目/v31-works-ring.js','utf8')),'Original five work entries');`;
save=save.replace('const changed=',keepWorks+'\nconst changed=');
await fs.writeFile('scripts/save-current-v32-102.mjs',save);

let verify=advance(await fs.readFile('scripts/verify-v32-101-package.mjs','utf8'));
const second=`await new Promise((resolve,reject)=>{const p=spawn(process.execPath,['assets/works/home-creation-v102/verify-desktop.mjs'],{cwd:project,env:{...process.env,PORTFOLIO_URL:'http://localhost:8032',VERIFY_OUTPUT:'.verify/v32-102-independent/home-creation'},stdio:'inherit'});p.on('error',reject);p.on('exit',c=>c===0?resolve():reject(Error('Independent clock gallery failed '+c)));});const hc=JSON.parse(await fs.readFile(project+'/.verify/v32-102-independent/home-creation/checks.json','utf8'));assert(hc.pass);result.homeGalleryPassed=hc.pass;`;
verify=verify.replace("assert.equal(await hash(saved.previousPackage+'/保存结果.json'),saved.previousArchiveSha256);result.passed=true;",second+"assert.equal(await hash(saved.previousPackage+'/保存结果.json'),saved.previousArchiveSha256);result.passed=true;");
await fs.writeFile('scripts/verify-v32-102-package.mjs',verify);

let qa=advance(await fs.readFile('.verify/v32-101/check-normal.mjs','utf8')).replaceAll('physical-universe-v101','physical-universe-v102').replace('>=21','>=18');
qa=qa.replace("assert(Number(metadata.format.duration)>=18);","assert(Number(metadata.format.duration)>=18&&Number(metadata.format.duration)<18.05);assert.equal(Number(metadata.streams.find(x=>x.codec_type==='video').nb_frames),540);");
const clockStart=qa.indexOf("await p.goto(base+'/home-creation.html"),clockEnd=qa.indexOf('report.passed=true;',clockStart);
if(clockStart<0||clockEnd<0)throw Error('Previous QA clock probe boundaries not found');
qa=qa.slice(0,clockStart)+qa.slice(clockEnd);
await fs.mkdir('.verify/v32-102',{recursive:true});await fs.writeFile('.verify/v32-102/check-normal.mjs',qa);
console.log('V32.102 archive and desktop QA prepared; not saved or verified yet.');
