import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {mkdir,readdir,readFile,writeFile,copyFile,lstat} from 'node:fs/promises';
import path from 'node:path';
const source=process.cwd(),dest='E:/codex/脑海宇宙作品集/V32.63_进行中';
const native='blender/reference-architecture-v14';const items=[];let frames=0;
async function add(src,rel){const info=await lstat(src);if(info.isSymbolicLink())throw Error('Unexpected symbolic link '+src);if(info.isDirectory()){for(const e of await readdir(src,{withFileTypes:true})){if(/\.blend\d+$/.test(e.name))continue;await add(path.join(src,e.name),path.join(rel,e.name));}}else if(info.isFile()){
  if(src.includes('render-24fps')&&src.endsWith('.png')){const p=await readFile(src);if(p.readUInt32BE(16)!==1600||p.readUInt32BE(20)!==900||!p.subarray(-12).equals(Buffer.from([0,0,0,0,73,69,78,68,174,66,96,130])))throw Error('Invalid rendered PNG '+src);frames++;}
  items.push({src,rel});}}
for(const f of ['AGENTS.md','V31-CURRENT-HANDOFF.md','BLENDER-CURRENT-HANDOFF.md','ODYSSEY-CURRENT-HANDOFF.md','THIRD_PARTY_NOTICES.md','CURRENT-V32-63-RESUME.md','v31.html'])await add(path.join(source,f),path.join('项目',f));
for(const f of ['src','scripts','scene-dist',native])await add(path.join(source,f),path.join('项目',f));
for(const f of ['export-v14-clock-film.mjs','verify-v14-home.mjs','verify-v14-delivery.mjs','verify-odyssey-v32-63.mjs','check-v32-63.mjs','run-v14-package-check.mjs','verify-v14-package.mjs','scenes-typecheck-results.json','odyssey-v32-62-results.json'])await add(path.join(source,'.verify',f),path.join('项目/.verify',f));
if(frames!==212)throw Error('Paused frame count changed: '+frames);
async function hash(file){const h=createHash('sha256');for await(const chunk of createReadStream(file))h.update(chunk);return h.digest('hex').toUpperCase();}
const records=[];
for(const f of items){const target=path.join(dest,f.rel);await mkdir(path.dirname(target),{recursive:true});await copyFile(f.src,target);const sha256=await hash(target);if(sha256!==await hash(f.src))throw Error('Copy mismatch '+f.rel);records.push({path:f.rel.replaceAll('\\','/'),bytes:(await lstat(target)).size,sha256});}
const guide=path.join(dest,'进行中说明.md');records.push({path:'进行中说明.md',bytes:(await lstat(guide)).size,sha256:await hash(guide)});
await writeFile(path.join(dest,'file-manifest.json'),JSON.stringify(records,null,2));
const result={checkpointSaved:true,taskComplete:false,status:'paused_by_user',version:'V32.63',nativeVersion:'V14',saved:new Date().toISOString(),validFrames:frames,totalFrames:384,remainingFrames:384-frames,renderComplete:false,encoded:false,finalIntegrated:false,finalBrowserChecks:false,finalPackageFrozen:false,originalGuiPreserved:true,source,checkpoint:dest,lastCompletePackage:'E:/codex/脑海宇宙作品集/当前作品集_V32.62',files:records.length,bytes:records.reduce((n,f)=>n+f.bytes,0),manifestSha256:await hash(path.join(dest,'file-manifest.json')),note:'Restore current working changes, never rebuild or rerender valid frames. Heavy GPU job stopped. Assets remain E:/Brain-Universe-assets/V32-63.'};
await writeFile(path.join(dest,'checkpoint-result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
