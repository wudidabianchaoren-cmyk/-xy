import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';
const source=process.cwd(),dest='E:/codex/脑海宇宙作品集/当前作品集_V32.63';
const checks=['v14-home-results.json','v14-delivery-results.json','v14-clock-export-results.json','odyssey-v32-63-results.json','scenes-typecheck-results.json','v32-61-particle-results.json','v32-61-entry-results.json','local-scenes-results.json','odyssey-framing-results.json'];
for(const f of checks)if(!JSON.parse(await readFile(path.join(source,'.verify',f),'utf8')).passed)throw Error('Unfinished check '+f);
const aggregate=JSON.parse(await readFile('.verify/v32-63-checks.json','utf8'));if(aggregate.length!==8||aggregate.some(c=>!c.passed))throw Error('Final checks unfinished');
try{if(JSON.parse(await readFile(path.join(dest,'保存结果.json'),'utf8')).complete)throw Error('V32.63 already frozen');}catch(e){if(e.code!=='ENOENT')throw e;}
const files=[];
async function add(src,rel){const info=await lstat(src);if(info.isSymbolicLink())throw Error('Unexpected link '+src);if(info.isDirectory())for(const e of await readdir(src,{withFileTypes:true}))await add(path.join(src,e.name),path.join(rel,e.name));else if(info.isFile())files.push({src,rel});}
for(const f of ['v31.html','v23.js','v23.css','v31-motion.js','v31-motion.css','v31-final.css','v31-personal.js','v31-hobby.js','v31-standalone.js','v31-progress.js','v31-controls.js','v31-works-ring.js','v31-sand-story.js','serve-preview.py','THIRD_PARTY_NOTICES.md'])await add(path.join(source,f),path.join('项目',f));
for(const f of ['assets','src','scene-dist','scripts'])await add(path.join(source,f),path.join('项目',f));
await add(path.join(source,'c4d/hybrid-study/three.module.js'),'项目/c4d/hybrid-study/three.module.js');
const native='blender/reference-architecture-v14';
for(const f of ['architecture-v14.blend','architecture-v14.mp4','architecture-v14-complete.mp4','clock-rig.glb','camera-track.json','character-library.blend','ulysses-rigged.glb','home-playback.js','build.py','build-actors.py','proof-actors.py','probe-actors.py','render.py','encode.mjs','SESSION-STATE.md','build-audit.json','character-audit.json','actor-proof-audit.json','actor-white-model.png','actor-material-proof.png','render-progress.json','video-audit.json','complete-video-audit.json'])await add(path.join(source,native,f),path.join('项目',native,f));
await add(path.join(source,'blender/reference-architecture-v13/architecture-v13.blend'),path.join('项目',native,'build-cache/baseline.blend'));
await add(path.join(source,'blender/reference-architecture-v13/build.py'),path.join('项目',native,'build-cache/facade-source.py'));
await add(path.join(source,'blender/reference-architecture-v11/build.py'),path.join('项目',native,'build-cache/geometry-source.py'));
for(const f of ['marble_01','rough_linen','calendar','anatomical-base.blend','SOURCES.json'])await add('E:/Brain-Universe-assets/V32-63/'+f,path.join('项目',native,'build-cache/assets',f));
for(const f of ['toolchain','odyssey','vendor'])await add('E:/Brain-Universe-assets/V32-61/'+f,'构建缓存/V32-61/'+f);
for(const f of ['wood_planks','models/marble_bust_01'])await add('E:/Brain-Universe-assets/V32-62/'+f,'构建缓存/V32-62/'+f);
for(const f of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json','textures'])await add('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+f,'构建缓存/V32-62/models/coastal_cliff_02/'+f);
await add('E:/Brain-Universe-assets/V32-63/mpfb-source/mpfb2-2.0.17','构建缓存/MPFB2-2.0.17');
for(const f of checks)await add(path.join(source,'.verify',f),path.join('当前检查结果',f));
await add(path.join(source,'.verify/v32-63-checks.json'),'当前检查结果/v32-63-checks.json');
for(const f of ['v14-home-wide.png','v14-home-dials.png','v14-home-automata.png','v14-home-three-windows.png','v14-home-west-shadow.png','v14-home-1440.png','odyssey-v32-63-0.png','odyssey-v32-63-24.png','odyssey-v32-63-1440.png'])await add(path.join(source,'.verify',f),path.join('效果截图',f));
async function hash(file){const h=createHash('sha256');for await(const b of createReadStream(file))h.update(b);return h.digest('hex').toUpperCase();}
await mkdir(dest,{recursive:true});await writeFile(path.join(dest,'保存结果.json'),JSON.stringify({complete:false,version:'V32.63'},null,2));const records=[];
for(const f of files){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);const sha256=await hash(target);if(sha256!==await hash(f.src))throw Error('Copy mismatch '+f.rel);records.push({path:f.rel.replaceAll('\\','/'),bytes:(await lstat(target)).size,sha256});if(records.length%200===0)console.log('Verified '+records.length+'/'+files.length);}
const resume=await readFile('CURRENT-V32-63-RESUME.md','utf8');await writeFile(path.join(dest,'接续说明.md'),resume);
await copyFile('scripts/save-current-v32-63.mjs',path.join(dest,'保存当前效果.mjs'));
await writeFile(path.join(dest,'项目/AGENTS.md'),'# 当前完整效果 V32.63\n\n先读 ../接续说明.md 和 ../保存结果.json。直接使用当前网站和原生V14，不重建、不恢复生长/半圆胶片；保留原三窗、粒子、其他页。神话是TypeScript实时场景。只有保存结果complete和currentPackageRunPassed为true才是完整交付。新账号增量继续，不用C4D。\n');
for(const f of ['接续说明.md','保存当前效果.mjs','项目/AGENTS.md'])records.push({path:f,bytes:(await lstat(path.join(dest,f))).size,sha256:await hash(path.join(dest,f))});
await writeFile(path.join(dest,'文件清单.json'),JSON.stringify(records,null,2));
const result={complete:true,currentPackageRunPassed:false,version:'V32.63',saved:new Date().toISOString(),files:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0),checks:checks.length,source,package:dest,scope:'Current website, native V14 and necessary reconstruction baseline, rigged anatomy, PBR, complete films, TS sources, current QA only. No history or middle frames.',renderer:'Blender Cycles CUDA, NOT UE5',referenceOneToOne:false,manifestSha256:await hash(path.join(dest,'文件清单.json'))};
await writeFile(path.join(dest,'保存结果.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
