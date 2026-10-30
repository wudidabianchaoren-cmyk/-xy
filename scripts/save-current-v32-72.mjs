import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';

const source=process.cwd(), root='E:/codex/脑海宇宙作品集', dest=root+'/当前作品集_V32.72';
const hash=async f=>{const h=createHash('sha256');for await(const b of createReadStream(f))h.update(b);return h.digest('hex');};
const report=JSON.parse(await readFile('.verify/v32-72-checks.json','utf8'));
if(!report.completeLocal||report.checks.length<10||report.checks.some(c=>!c.passed))throw Error('Local V32.72 incomplete');
for(const c of report.checks)if(await hash(c.file)!==c.evidenceSha256)throw Error('Changed evidence '+c.file);
for(const [f,h] of Object.entries(report.sourceHashes))if(await hash(f)!==h)throw Error('Changed source '+f);
try{const r=JSON.parse(await readFile(dest+'/保存结果.json','utf8'));if(r.complete&&r.currentPackageRunPassed)throw Error('Archive already frozen; use a new version');}catch(e){if(e.code!=='ENOENT')throw e;}
const oldArchive=root+'/当前作品集_V32.65/保存结果.json', oldHash=await hash(oldArchive);
const oldV70Hash=await hash(root+'/当前作品集_V32.70/保存结果.json');
const oldV71Hash=await hash(root+'/当前作品集_V32.71/保存结果.json');
const pending={previousV71ArchiveSha256:oldV71Hash,previousV70ArchiveSha256:oldV70Hash,complete:false,currentPackageRunPassed:false,version:'V32.72',source,package:dest,started:new Date().toISOString(),previousArchiveSha256:oldHash};
await mkdir(dest,{recursive:true});await writeFile(dest+'/保存结果.json',JSON.stringify(pending,null,2));
const files=[],seen=new Set();
async function add(src,rel,filter=()=>true){const s=await lstat(src);if(s.isSymbolicLink())throw Error('Unexpected symlink '+src);if(s.isDirectory()){for(const e of await readdir(src)){const r=rel+'/'+e;if(filter(r))await add(path.join(src,e),r,filter);}}else if(s.isFile()&&!seen.has(rel)){seen.add(rel);files.push({src,rel});}}
const local=f=>add(path.join(source,f),'项目/'+f);
for(const f of ['v31.html','v23.js','v23.css','v31-motion.js','v31-motion.css','v31-final.css','v31-personal.js','v31-hobby.js','v31-standalone.js','v31-progress.js','v31-controls.js','v31-works-ring.js','v31-sand-story.js','serve-preview.py','THIRD_PARTY_NOTICES.md','CURRENT-V32-72-RESUME.md','AGENTS.md','V31-CURRENT-HANDOFF.md','ODYSSEY-CURRENT-HANDOFF.md','C4D-CURRENT-HANDOFF.md','src','motion'])await local(f);
const bundle=JSON.parse(await readFile('scene-dist/build-manifest.json','utf8'));
for(const f of [...bundle.files,'scene-dist/scenes.css','scene-dist/build-manifest.json'])await local(f);
await add(path.join(source,'assets'),'项目/assets',r=>{
 if(/^项目\/assets\/life-purpose\/v32-(?!70|72)/.test(r))return false;
 if(/^项目\/assets\/loading-study\/(?:v32-(?!71|72)|loading-study-v32-(?!72)|opening-poster-v32-(?!72))/.test(r))return false;
 if(/^项目\/assets\/home\/(?:marble_01|white_sandstone\/|home-live-poster-v32-(?!72))/.test(r)||/^项目\/assets\/odyssey\/marble_bust_01/.test(r))return false;
 return true;
});
for(const f of ['build-scenes.mjs','check-scenes.mjs','save-current-v32-72.mjs','verify-v32-72-package.mjs'])await local('scripts/'+f);
await local('c4d/hybrid-study/three.module.js');
for(const f of ['playwright','playwright-core'])await local('node_modules/'+f);
for(const f of ['architecture-v16.blend','architecture-world.glb','world-track.json','build.py','refine-materials.py','export-world.py','proofs.py','verify-native.py','SESSION-STATE.md','build-audit.json','export-audit.json','keyframes'])await local('blender/reference-architecture-v16/'+f);
for(const f of ['architecture-v15.blend','character-library-clean.blend','ulysses-rigged-clean.glb','cyclops-cliff.blend','cyclops-cliff.glb','export-human.py','build-cyclops.py'])await local('blender/reference-architecture-v15/'+f);
await local('blender/reference-architecture-v14/camera-track.json');
await add(path.join(source,'blender/reference-architecture-v18'),'项目/blender/reference-architecture-v18',r=>!r.endsWith('.blend1'));
await local('VIDEO-TOOLS-V32-72.md');
for(const f of await readdir('scripts'))if(f.includes('v32-72'))await local('scripts/'+f);
for(const f of ['hyperframes','hyperframes-animation','hyperframes-cli','remotion-best-practices','text-to-speech','sound-effects','music'])await add(path.join(source,'../.agents/skills',f),'安装技能/'+f);
await add(path.join(source,'blender/reference-architecture-v17'),'项目/blender/reference-architecture-v17',r=>!r.endsWith('.blend1'));
await add(path.join(source,'.verify/v32-72'),'项目/.verify/v32-72');
for(const f of ['export-v72-input.mjs','export-v72-input.ts','finalise-v32-72.mjs','protected-v32-72.mjs','run-v32-72-regressions.mjs'])await local('.verify/'+f);
await add(path.join(source,'.verify/life-film-v32-72'),'项目/.verify/life-film-v32-72');
for(const v of ['v11','v13'])await local('blender/reference-architecture-'+v+'/build.py');
for(const f of ['toolchain','odyssey','vendor'])await add('E:/Brain-Universe-assets/V32-61/'+f,'构建缓存/V32-61/'+f);
for(const f of ['wood_planks','white_sandstone_blocks_02'])await add('E:/Brain-Universe-assets/V32-62/'+f,'构建缓存/V32-62/'+f);
for(const f of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json','textures'])await add('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+f,'构建缓存/V32-62/models/coastal_cliff_02/'+f);
for(const f of ['rough_linen','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-63/'+f,'构建缓存/V32-63/'+f);
await add('E:/Brain-Universe-assets/V32-63/mpfb-source/mpfb2-2.0.17','构建缓存/MPFB2-2.0.17');
for(const f of ['sandstone_cracks','reference','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-65/'+f,'构建缓存/V32-65/'+f);
for(const f of ['Color','Roughness','NormalGL'])await add('E:/Brain-Universe-assets/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg','构建缓存/V32-65/Marble012/Marble012_2K-JPG_'+f+'.jpg');
await add('E:/Brain-Universe-assets/V32-69/home-4k','构建缓存/V32-69/home-4k');
for(const f of report.checks.map(c=>c.file).concat('.verify/v32-72-checks.json')){await local(f);await add(path.join(source,f),'当前检查结果/'+f.slice('.verify/'.length));}
for(const e of await readdir('.verify')){
 if(/^(?:verify-.*v32-72|verify-v31-70).*\.(?:mjs|js)$/.test(e))await local('.verify/'+e);
 if(/^(?:v32-72|odyssey-v32-72|loading-.*v32-72).*\.png$/.test(e)&&!e.includes('failure'))await add('.verify/'+e,'效果截图/'+e);
}
for(const e of await readdir('.verify/life-film-v32-70'))if(/\.json$/.test(e)||/^(?:production-contact|production-all-seconds|shot-\d+)\.png$/.test(e))await add('.verify/life-film-v32-70/'+e,'当前检查结果/life-film-v32-72/'+e);
console.log('Curated current package: '+files.length+' files');
let n=0;for(const f of files){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);if(await hash(target)!==await hash(f.src))throw Error('Copy mismatch '+f.rel);if(++n%500===0)console.log('Copied and SHA256 checked '+n+'/'+files.length);}
await copyFile('CURRENT-V32-72-RESUME.md',dest+'/接续说明.md');
await copyFile('scripts/save-current-v32-72.mjs',dest+'/保存当前效果.mjs');
await writeFile(dest+'/构建缓存/README.md','# 当前构建缓存\n\n仅运行网站无需恢复缓存。若需要重新构建，将 V32-61、V32-62、V32-63、V32-65、V32-69 目录的必要文件恢复到 E:/Brain-Universe-assets/ 对应同名目录；不要覆盖已有较新文件。MPFB2-2.0.17 是原生人物生成的来源依赖。当前 TS 构建使用 V32-61/toolchain/node_modules；运行 node scripts/check-scenes.mjs 与 node scripts/build-scenes.mjs。影片源码位于项目/motion，当前成片已保存，不为查看效果重新编码或渲染。Windows 系统字体及 Python/FFmpeg/Node/浏览器需所在电脑安装；工具路径在相应脚本中明确，不包含账户密钥或 .env。\n');
await writeFile(dest+'/工具恢复.md',(await readFile('VIDEO-TOOLS-V32-72.md','utf8'))+'\n\n异机恢复：将 项目/motion/remotion-v32-72/toolchain-lock/package.json 和 package-lock.json 复制到 E:/Brain-Universe-assets/V32-72/video-tools/，运行 npm ci --prefix E:/Brain-Universe-assets/V32-72/video-tools --cache E:/Brain-Universe-assets/V32-72/npm-cache。官方技能在安装技能/，复制到新工作区的 .agents/skills。Captions本地运行文件可运行项目/scripts/install-captions-runtime-v32-72.mjs重新生成；需要先运行 verify-video-tools-v32-72.mjs获取官方配置。运行网站不需要这些工具或云端密钥。\n');
const manifest=[];
async function record(dir,rel=''){for(const e of await readdir(dir)){const r=rel?rel+'/'+e:e;if(r==='文件清单.json'||r==='保存结果.json')continue;const f=path.join(dir,e),s=await lstat(f);if(s.isDirectory())await record(f,r);else if(s.isFile())manifest.push({path:r,bytes:s.size,sha256:await hash(f)});}}
await record(dest);await writeFile(dest+'/文件清单.json',JSON.stringify(manifest,null,2));
if(await hash(root+'/当前作品集_V32.70/保存结果.json')!==oldV70Hash)throw Error('Frozen V70 changed');
if(await hash(root+'/当前作品集_V32.71/保存结果.json')!==oldV71Hash)throw Error('Frozen V71 changed');
if(await hash(oldArchive)!==oldHash)throw Error('Old archive modified');
await writeFile(dest+'/保存结果.json',JSON.stringify({...pending,copiedFiles:files.length,copyHashesPassed:true,copied:new Date().toISOString()},null,2));
console.log('Copy ready for independent package check; delivery flags remain false.');
