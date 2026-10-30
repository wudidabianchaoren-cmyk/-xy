import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';
const source=process.cwd(),dest='E:/codex/脑海宇宙作品集/当前作品集_V32.65';
const checks=['scenes-typecheck-results.json','v16-native-results.json','v16-delivery-results.json','v16-home-results.json','odyssey-v32-65-results.json','v32-65-particle-results.json','v32-65-entry-results.json','v16-local-scenes-results.json','v32-65-performance-results.json'];
for(const file of checks)if(!JSON.parse(await readFile('.verify/'+file,'utf8')).passed)throw Error('Unfinished check '+file);
await writeFile('.verify/v32-65-checks.json',JSON.stringify(checks.map(file=>({file,passed:true})),null,2));
try{const saved=JSON.parse(await readFile(dest+'/保存结果.json','utf8'));if(saved.complete&&saved.currentPackageRunPassed)throw Error('V32.65 already frozen');}catch(e){if(e.code!=='ENOENT')throw e;}
const files=[];
async function add(src,rel,filter=()=>true){const stat=await lstat(src);if(stat.isSymbolicLink())throw Error('Unexpected link '+src);if(stat.isDirectory())for(const e of await readdir(src)){if(filter(path.join(rel,e)))await add(path.join(src,e),path.join(rel,e),filter);}else if(stat.isFile())files.push({src,rel});}
const local=f=>add(path.join(source,f),'项目/'+f);
for(const f of ['v31.html','v23.js','v23.css','v31-motion.js','v31-motion.css','v31-final.css','v31-personal.js','v31-hobby.js','v31-standalone.js','v31-progress.js','v31-controls.js','v31-works-ring.js','v31-sand-story.js','serve-preview.py','THIRD_PARTY_NOTICES.md','CURRENT-V32-65-RESUME.md','src'])await local(f);
// Current shared chunks only; obsolete bundles remain in the source workspace, not the save.
const bundle=JSON.parse(await readFile('scene-dist/build-manifest.json','utf8'));
for(const f of [...bundle.files,'scene-dist/scenes.css','scene-dist/build-manifest.json'])await local(f);
await add(path.join(source,'assets'),'项目/assets',rel=>!/^项目[\\/]assets[\\/]home[\\/](marble_01|white_sandstone)/.test(rel)&&!/^项目[\\/]assets[\\/]odyssey[\\/]marble_bust_01/.test(rel));
for(const f of ['build-scenes.mjs','check-scenes.mjs','save-current-v32-65.mjs'])await local('scripts/'+f);
await local('c4d/hybrid-study/three.module.js');
const native='blender/reference-architecture-v16';
for(const f of ['architecture-v16.blend','architecture-world.glb','world-track.json','build.py','refine-materials.py','export-world.py','proofs.py','verify-native.py','SESSION-STATE.md','build-audit.json','export-audit.json','keyframes'])await local(native+'/'+f);
// V15 is the one packed incremental source, not an old film or historical showcase.
for(const f of ['architecture-v15.blend','character-library-clean.blend','ulysses-rigged-clean.glb','cyclops-cliff.blend','cyclops-cliff.glb','export-human.py','build-cyclops.py'])await local('blender/reference-architecture-v15/'+f);
await local('blender/reference-architecture-v14/camera-track.json');
for(const version of ['v11','v13'])await local('blender/reference-architecture-'+version+'/build.py');
for(const f of ['toolchain','odyssey','vendor'])await add('E:/Brain-Universe-assets/V32-61/'+f,'构建缓存/V32-61/'+f);
for(const f of ['wood_planks'])await add('E:/Brain-Universe-assets/V32-62/'+f,'构建缓存/V32-62/'+f);
for(const f of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json','textures'])await add('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+f,'构建缓存/V32-62/models/coastal_cliff_02/'+f);
for(const f of ['rough_linen','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-63/'+f,'构建缓存/V32-63/'+f);
await add('E:/Brain-Universe-assets/V32-63/mpfb-source/mpfb2-2.0.17','构建缓存/MPFB2-2.0.17');
for(const f of ['sandstone_cracks','reference','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-65/'+f,'构建缓存/V32-65/'+f);
for(const f of ['Color','Roughness','NormalGL'])await add('E:/Brain-Universe-assets/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg','构建缓存/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg');
for(const f of [...checks,'v32-65-checks.json','v32-64-profile.json','v32-65-profile.json']){await local('.verify/'+f);await add(path.join(source,'.verify',f),'当前检查结果/'+f);}
for(const f of ['verify-v16-home.mjs','verify-v16-delivery.mjs','verify-odyssey-v32-65.mjs','run-v16-regressions.mjs','verify-v32-61-particles.mjs','verify-v32-61-entry.mjs','verify-local-scenes.mjs','run-v16-package-check.mjs','verify-v16-package.mjs','verify-v32-65-performance.mjs','profile-v32-65.mjs'])await local('.verify/'+f);
for(const f of ['v16-home-wide.png','v16-home-dials.png','v16-home-knights.png','v16-home-windows.png','v16-home-west-on.png','v16-home-fixed-wide.png','v16-home-1440.png','v16-home-390.png','odyssey-v32-65-0.png','odyssey-v32-65-24.png','odyssey-v32-65-40.png','odyssey-v32-65-1440.png','odyssey-v32-65-mobile.png','odyssey-v32-65-prologue-desktop.png','odyssey-v32-65-prologue-mobile.png'])await add(path.join(source,'.verify',f),'效果截图/'+f);
async function hash(file){const h=createHash('sha256');for await(const b of createReadStream(file))h.update(b);return h.digest('hex').toUpperCase();}
await mkdir(dest,{recursive:true});await writeFile(dest+'/保存结果.json',JSON.stringify({complete:false,version:'V32.65'},null,2));const records=[];
for(const f of files){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);const sha256=await hash(target);if(sha256!==await hash(f.src))throw Error('Copy mismatch '+f.rel);records.push({path:f.rel.replaceAll('\\','/'),bytes:(await lstat(target)).size,sha256});if(records.length%300===0)console.log('Verified '+records.length+'/'+files.length);}
await copyFile('CURRENT-V32-65-RESUME.md',dest+'/接续说明.md');await copyFile('scripts/save-current-v32-65.mjs',dest+'/保存当前效果.mjs');
await writeFile(dest+'/项目/AGENTS.md','# Current V32.65 / V16\n\nRead ../接续说明.md and ../保存结果.json first. Only complete/currentPackageRunPassed both true identify delivery. Incremental native V16 world, one six-shot intro then fixed live wide, protected three-window cues, all interactions retained. Lazy shared bundles, heavy PBR marble, warm stone courtyard. TS Odyssey original-art prologue plus extended sea/haze/open holds; exact original 64-second flight/lighting retained. No C4D changes; downloads E only. V15 packed blend and V14 camera/V11/V13 helpers are necessary source dependencies only. Do not rebuild to view; no UE5/IMAX/1:1 claims.\n');
for(const f of ['接续说明.md','保存当前效果.mjs','项目/AGENTS.md'])records.push({path:f,bytes:(await lstat(dest+'/'+f)).size,sha256:await hash(dest+'/'+f)});
await writeFile(dest+'/文件清单.json',JSON.stringify(records,null,2));
const result={complete:true,currentPackageRunPassed:false,version:'V32.65',saved:new Date().toISOString(),files:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0),checks:checks.length,source,package:dest,scope:'Current website/native V16/proofs and necessary incremental source/cache; no historical chat, old films, render frames or obsolete shared chunks.',renderer:'Blender Cycles proofs / Three.js realtime, NOT UE5/IMAX',referenceOneToOne:false,manifestSha256:await hash(dest+'/文件清单.json')};
await writeFile(dest+'/保存结果.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
