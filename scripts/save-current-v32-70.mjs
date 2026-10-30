import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';

const source=process.cwd(), root='E:/codex/脑海宇宙作品集', dest=root+'/当前作品集_V32.70';
const hash=async f=>{const h=createHash('sha256');for await(const b of createReadStream(f))h.update(b);return h.digest('hex');};
const report=JSON.parse(await readFile('.verify/v32-70-checks.json','utf8'));
if(!report.completeLocal||report.checks.length!==15||report.checks.some(c=>!c.passed))throw Error('Local V32.70 incomplete');
for(const c of report.checks)if(await hash(c.file)!==c.evidenceSha256)throw Error('Changed evidence '+c.file);
for(const [f,h] of Object.entries(report.sourceHashes))if(await hash(f)!==h)throw Error('Changed source '+f);
try{const r=JSON.parse(await readFile(dest+'/保存结果.json','utf8'));if(r.complete&&r.currentPackageRunPassed)throw Error('Archive already frozen; use a new version');}catch(e){if(e.code!=='ENOENT')throw e;}
const oldArchive=root+'/当前作品集_V32.65/保存结果.json', oldHash=await hash(oldArchive);
const policy='## 每次更新的保存约定 / 2026-10-09\n\n用户明确要求从 V32.70 增量继续。每次作品集更新完成，都必须把当前完整效果、源码、素材、接续说明和当前核验结果保存到 E:/codex/脑海宇宙作品集/ 的新版本目录，再更新该目录的先读这里.md。文件逐项校验且封存包独立运行通过后，保存结果.json 的 complete 和 currentPackageRunPassed 才能同时为 true。旧完整包不覆盖；中断时保存断点并明确未完成，不能把本地更新称为已在 E 盘保存。此约定覆盖历史“仅本地、不新增 E 包”，但不解除旧包冻结。\n\n';
for(const f of ['../AGENTS.md','AGENTS.md']){
 let s=await readFile(f,'utf8');if(!s.includes('## 每次更新的保存约定')){const p=s.indexOf('\n');s=s.slice(0,p+1)+'\n'+policy+s.slice(p+1);}
 s=s.replace('E V32.65封存冻结，仅本地V32.70。','E V32.65封存冻结；V32.70另存新接续包，以其保存结果双 true 为准。');await writeFile(f,s);
}
let resume=await readFile('CURRENT-V32-70-RESUME.md','utf8');
resume=resume.replace('E:/codex/脑海宇宙作品集/当前作品集_V32.65/ 冻结未改；保存结果双 true 只证明 V32.65。本轮没有新 E 封存包。以当前本地文件继续，历史版本仅作回滚。',
 '## E 盘保存与后续接续\n\n用户于 2026-10-09 明确要求从 V32.70 增量继续，且每次更新均保存到 E 盘。当前接续包：E:/codex/脑海宇宙作品集/当前作品集_V32.70/；先读其接续说明.md、保存结果.json 和当前包运行检查.json，只有 complete 与 currentPackageRunPassed 双 true 才表示封存完成。V32.65 和其他旧完整包冻结，供回滚。后续每一轮先完成增量修改与核验，再创建对应新版本包并更新 E 盘先读这里.md；中断则明确保存断点，不能假报完成。\n\n网站位于封存包的 项目/；源码在 项目/src/ 与 项目/motion/，当前影片和贴图在 项目/assets/，原生 V16 与必要增量依赖在 项目/blender/，本地构建依赖在 构建缓存/。复用当前 8031 服务。若换工作目录且 8031 未占用，可在 项目/ 运行 serve-preview.py；只查看效果无需重建或重渲染。scripts/build-scenes.mjs 使用 E:/Brain-Universe-assets 的缓存，换电脑时先按 构建缓存/README.md 恢复相应路径。');
await writeFile('CURRENT-V32-70-RESUME.md',resume);
const pending={complete:false,currentPackageRunPassed:false,version:'V32.70',source,package:dest,started:new Date().toISOString(),previousArchiveSha256:oldHash};
await mkdir(dest,{recursive:true});await writeFile(dest+'/保存结果.json',JSON.stringify(pending,null,2));
const files=[],seen=new Set();
async function add(src,rel,filter=()=>true){const s=await lstat(src);if(s.isSymbolicLink())throw Error('Unexpected symlink '+src);if(s.isDirectory()){for(const e of await readdir(src)){const r=rel+'/'+e;if(filter(r))await add(path.join(src,e),r,filter);}}else if(s.isFile()&&!seen.has(rel)){seen.add(rel);files.push({src,rel});}}
const local=f=>add(path.join(source,f),'项目/'+f);
for(const f of ['v31.html','v23.js','v23.css','v31-motion.js','v31-motion.css','v31-final.css','v31-personal.js','v31-hobby.js','v31-standalone.js','v31-progress.js','v31-controls.js','v31-works-ring.js','v31-sand-story.js','serve-preview.py','THIRD_PARTY_NOTICES.md','CURRENT-V32-70-RESUME.md','AGENTS.md','V31-CURRENT-HANDOFF.md','ODYSSEY-CURRENT-HANDOFF.md','C4D-CURRENT-HANDOFF.md','src','motion'])await local(f);
const bundle=JSON.parse(await readFile('scene-dist/build-manifest.json','utf8'));
for(const f of [...bundle.files,'scene-dist/scenes.css','scene-dist/build-manifest.json'])await local(f);
await add(path.join(source,'assets'),'项目/assets',r=>{
 if(/^项目\/assets\/life-purpose\/v32-(?!70)/.test(r))return false;
 if(/^项目\/assets\/loading-study\/(?:v32-69|loading-study-v32-(?!70)|opening-poster-v32-(?!70))/.test(r))return false;
 if(/^项目\/assets\/home\/(?:marble_01|white_sandstone\/|home-live-poster-v32-(?!70))/.test(r)||/^项目\/assets\/odyssey\/marble_bust_01/.test(r))return false;
 return true;
});
for(const f of ['build-scenes.mjs','check-scenes.mjs','save-current-v32-70.mjs','verify-v32-70-package.mjs'])await local('scripts/'+f);
await local('c4d/hybrid-study/three.module.js');
for(const f of ['playwright','playwright-core'])await local('node_modules/'+f);
for(const f of ['architecture-v16.blend','architecture-world.glb','world-track.json','build.py','refine-materials.py','export-world.py','proofs.py','verify-native.py','SESSION-STATE.md','build-audit.json','export-audit.json','keyframes'])await local('blender/reference-architecture-v16/'+f);
for(const f of ['architecture-v15.blend','character-library-clean.blend','ulysses-rigged-clean.glb','cyclops-cliff.blend','cyclops-cliff.glb','export-human.py','build-cyclops.py'])await local('blender/reference-architecture-v15/'+f);
await local('blender/reference-architecture-v14/camera-track.json');
for(const v of ['v11','v13'])await local('blender/reference-architecture-'+v+'/build.py');
for(const f of ['toolchain','odyssey','vendor'])await add('E:/Brain-Universe-assets/V32-61/'+f,'构建缓存/V32-61/'+f);
for(const f of ['wood_planks','white_sandstone_blocks_02'])await add('E:/Brain-Universe-assets/V32-62/'+f,'构建缓存/V32-62/'+f);
for(const f of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json','textures'])await add('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+f,'构建缓存/V32-62/models/coastal_cliff_02/'+f);
for(const f of ['rough_linen','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-63/'+f,'构建缓存/V32-63/'+f);
await add('E:/Brain-Universe-assets/V32-63/mpfb-source/mpfb2-2.0.17','构建缓存/MPFB2-2.0.17');
for(const f of ['sandstone_cracks','reference','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-65/'+f,'构建缓存/V32-65/'+f);
for(const f of ['Color','Roughness','NormalGL'])await add('E:/Brain-Universe-assets/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg','构建缓存/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg');
await add('E:/Brain-Universe-assets/V32-69/home-4k','构建缓存/V32-69/home-4k');
for(const f of report.checks.map(c=>c.file).concat('.verify/v32-70-checks.json')){await local(f);await add(path.join(source,f),'当前检查结果/'+f.slice('.verify/'.length));}
for(const e of await readdir('.verify')){
 if(/^(?:verify-.*v32-70|verify-v31-70).*\.(?:mjs|js)$/.test(e))await local('.verify/'+e);
 if(/^(?:v32-70|odyssey-v32-70|loading-.*v32-70).*\.png$/.test(e)&&!e.includes('failure'))await add('.verify/'+e,'效果截图/'+e);
}
for(const e of await readdir('.verify/life-film-v32-70'))if(/\.json$/.test(e)||/^(?:production-contact|production-all-seconds|shot-\d+)\.png$/.test(e))await add('.verify/life-film-v32-70/'+e,'当前检查结果/life-film-v32-70/'+e);
console.log('Curated current package: '+files.length+' files');
let n=0;for(const f of files){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);if(await hash(target)!==await hash(f.src))throw Error('Copy mismatch '+f.rel);if(++n%500===0)console.log('Copied and SHA256 checked '+n+'/'+files.length);}
await copyFile('CURRENT-V32-70-RESUME.md',dest+'/接续说明.md');
await copyFile('scripts/save-current-v32-70.mjs',dest+'/保存当前效果.mjs');
await writeFile(dest+'/构建缓存/README.md','# 当前构建缓存\n\n仅运行网站无需恢复缓存。若需要重新构建，将 V32-61、V32-62、V32-63、V32-65、V32-69 目录的必要文件恢复到 E:/Brain-Universe-assets/ 对应同名目录；不要覆盖已有较新文件。MPFB2-2.0.17 是原生人物生成的来源依赖。当前 TS 构建使用 V32-61/toolchain/node_modules；运行 node scripts/check-scenes.mjs 与 node scripts/build-scenes.mjs。影片源码位于项目/motion，当前成片已保存，不为查看效果重新编码或渲染。Windows 系统字体及 Python/FFmpeg/Node/浏览器需所在电脑安装；工具路径在相应脚本中明确，不包含账户密钥或 .env。\n');
const manifest=[];
async function record(dir,rel=''){for(const e of await readdir(dir)){const r=rel?rel+'/'+e:e;if(r==='文件清单.json'||r==='保存结果.json')continue;const f=path.join(dir,e),s=await lstat(f);if(s.isDirectory())await record(f,r);else if(s.isFile())manifest.push({path:r,bytes:s.size,sha256:await hash(f)});}}
await record(dest);await writeFile(dest+'/文件清单.json',JSON.stringify(manifest,null,2));
if(await hash(oldArchive)!==oldHash)throw Error('Old archive modified');
await writeFile(dest+'/保存结果.json',JSON.stringify({...pending,copiedFiles:files.length,copyHashesPassed:true,copied:new Date().toISOString()},null,2));
console.log('Copy ready for independent package check; delivery flags remain false.');
