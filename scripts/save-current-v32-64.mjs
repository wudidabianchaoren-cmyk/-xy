import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';
const source=process.cwd(),dest='E:/codex/脑海宇宙作品集/当前作品集_V32.64';
const checks=['scenes-typecheck-results.json','v15-native-results.json','v15-delivery-results.json','v15-home-results.json','odyssey-v32-64-results.json','v32-64-particle-results.json','v32-64-entry-results.json','v15-local-scenes-results.json'];
const aggregate=[];
for(const file of checks){const record=JSON.parse(await readFile('.verify/'+file,'utf8'));if(!record.passed)throw Error('Unfinished check '+file);aggregate.push({file,passed:true});}
await writeFile('.verify/v32-64-checks.json',JSON.stringify(aggregate,null,2));
try{const saved=JSON.parse(await readFile(dest+'/保存结果.json','utf8'));if(saved.complete&&saved.currentPackageRunPassed)throw Error('V32.64 already frozen');}catch(e){if(e.code!=='ENOENT')throw e;}
const files=[];
async function add(src,rel){const stat=await lstat(src);if(stat.isSymbolicLink())throw Error('Unexpected link '+src);if(stat.isDirectory())for(const e of await readdir(src))await add(path.join(src,e),path.join(rel,e));else if(stat.isFile())files.push({src,rel});}
for(const f of ['v31.html','v23.js','v23.css','v31-motion.js','v31-motion.css','v31-final.css','v31-personal.js','v31-hobby.js','v31-standalone.js','v31-progress.js','v31-controls.js','v31-works-ring.js','v31-sand-story.js','serve-preview.py','THIRD_PARTY_NOTICES.md','CURRENT-V32-64-RESUME.md'])await add(path.join(source,f),'项目/'+f);
for(const f of ['assets','src','scene-dist'])await add(path.join(source,f),'项目/'+f);
for(const f of ['build-scenes.mjs','check-scenes.mjs','save-current-v32-64.mjs'])await add(path.join(source,'scripts',f),'项目/scripts/'+f);
await add(path.join(source,'c4d/hybrid-study/three.module.js'),'项目/c4d/hybrid-study/three.module.js');
const native='blender/reference-architecture-v15';
for(const f of ['architecture-v15.blend','architecture-world.glb','world-track.json','character-library-clean.blend','ulysses-rigged-clean.glb','cyclops-cliff.blend','cyclops-cliff.glb','build.py','refine-armour.py','refine-west.py','fix-relief.py','export-world.py','export-human.py','build-cyclops.py','proofs.py','proof-solar.py','verify-native.py','SESSION-STATE.md','build-audit.json','export-audit.json','human-export-audit.json','solar-material-proof.png','keyframes'])await add(path.join(source,native,f),'项目/'+native+'/'+f);
for(const f of ['architecture-v14.blend','character-library.blend','camera-track.json'])await add(path.join(source,'blender/reference-architecture-v14',f),'项目/blender/reference-architecture-v14/'+f);
for(const version of ['v11','v13'])await add(path.join(source,'blender/reference-architecture-'+version,'build.py'),'项目/blender/reference-architecture-'+version+'/build.py');
for(const f of ['toolchain','odyssey','vendor'])await add('E:/Brain-Universe-assets/V32-61/'+f,'构建缓存/V32-61/'+f);
for(const f of ['wood_planks','white_sandstone_blocks_02','models/marble_bust_01'])await add('E:/Brain-Universe-assets/V32-62/'+f,'构建缓存/V32-62/'+f);
for(const f of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json','textures'])await add('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+f,'构建缓存/V32-62/models/coastal_cliff_02/'+f);
for(const f of ['marble_01','rough_linen','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-63/'+f,'构建缓存/V32-63/'+f);
await add('E:/Brain-Universe-assets/V32-63/mpfb-source/mpfb2-2.0.17','构建缓存/MPFB2-2.0.17');
for(const f of [...checks,'v32-64-checks.json']){await add(path.join(source,'.verify',f),'当前检查结果/'+f);await add(path.join(source,'.verify',f),'项目/.verify/'+f);}
for(const f of ['verify-v15-home.mjs','verify-v15-delivery.mjs','verify-odyssey-v32-64.mjs','run-v15-regressions.mjs','verify-v32-61-particles.mjs','verify-v32-61-entry.mjs','verify-local-scenes.mjs','run-v15-package-check.mjs','verify-v15-package.mjs'])await add(path.join(source,'.verify',f),'项目/.verify/'+f);
for(const f of ['v15-home-wide.png','v15-home-dials.png','v15-home-knights.png','v15-home-windows.png','v15-home-west-on.png','v15-home-fixed-wide.png','v15-home-1440.png','v15-home-390.png','odyssey-v32-64-0.png','odyssey-v32-64-24.png','odyssey-v32-64-1440.png','odyssey-v32-64-mobile.png'])await add(path.join(source,'.verify',f),'效果截图/'+f);
async function hash(file){const h=createHash('sha256');for await(const b of createReadStream(file))h.update(b);return h.digest('hex').toUpperCase();}
await mkdir(dest,{recursive:true});await writeFile(dest+'/保存结果.json',JSON.stringify({complete:false,version:'V32.64'},null,2));const records=[];
for(const f of files){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);const sha256=await hash(target);if(sha256!==await hash(f.src))throw Error('Copy mismatch '+f.rel);records.push({path:f.rel.replaceAll('\\','/'),bytes:(await lstat(target)).size,sha256});if(records.length%300===0)console.log('Verified '+records.length+'/'+files.length);}
await copyFile('CURRENT-V32-64-RESUME.md',dest+'/接续说明.md');
await copyFile('scripts/save-current-v32-64.mjs',dest+'/保存当前效果.mjs');
await writeFile(dest+'/项目/AGENTS.md','# 当前作品集 V32.64\n\n先读 ../接续说明.md 和 ../保存结果.json；两项完成标志都true才是完整包。当前首页为完整V15原生实时几何，开场一次后固定全景且元素继续运动，神话为TS实时3D。增量继续，不重建、不恢复照片下盘/半圆/生长/循环切镜；保留三窗原路径灯光、开场、七粒子、其他页，不用C4D。V14原生/字符库和V11/V13辅助脚本仅为本版必要源依赖，不是历史方向。\n');
for(const f of ['接续说明.md','保存当前效果.mjs','项目/AGENTS.md'])records.push({path:f,bytes:(await lstat(dest+'/'+f)).size,sha256:await hash(dest+'/'+f)});
await writeFile(dest+'/文件清单.json',JSON.stringify(records,null,2));
const result={complete:true,currentPackageRunPassed:false,version:'V32.64',saved:new Date().toISOString(),files:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0),checks:checks.length,source,package:dest,scope:'Current complete realtime website, native V15 models/proofs and necessary reconstruction dependencies; no historical chat, old films or middle frames.',renderer:'Blender Cycles proofs and Three.js realtime, NOT UE5/IMAX',referenceOneToOne:false,manifestSha256:await hash(dest+'/文件清单.json')};
await writeFile(dest+'/保存结果.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
