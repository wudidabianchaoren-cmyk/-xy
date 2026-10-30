import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
const source=process.cwd(),base='E:/codex/脑海宇宙作品集',previous=base+'/当前作品集_V32.107',candidate=base+'/当前作品集_V32.108_候选';
const read=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const hash=async p=>{const h=createHash('sha256');for await(const b of createReadStream(p))h.update(b);return h.digest('hex')};
const report=await read(source+'/.verify/v32-108-checks.json');assert(report.passed,'Final local checks must pass before copying');
const receipt=await read(previous+'/保存结果.json');assert(receipt.complete&&receipt.currentPackageRunPassed,'Current complete base required');
try{await fs.access(candidate);throw Error('Candidate already exists; inspect instead of replacing')}catch(e){if(e.code!=='ENOENT')throw e}
const records=await read(previous+'/文件清单.json');
const entries=new Map(records.filter(r=>r.path!=='当前包运行检查.json').map(r=>[r.path,{source:previous+'/'+r.path,sha256:r.sha256}]));
async function add(src,rel){const s=await fs.lstat(src);if(s.isDirectory()){for(const n of await fs.readdir(src)){if(n.includes('.hf-transaction-')||n==='node_modules'||n==='.git'||n==='renders')continue;await add(src+'/'+n,rel+'/'+n)}}else if(s.isFile())entries.set(rel,{source:src,sha256:await hash(src)})}
for(const f of ['v31.html','yangjian.html','yangjian.css','yangjian.js','yangjian-append.css','yangjian-append.js','AGENTS.md','YANGJIAN-REBUILD-BRIEF.md','CURRENT-V32-108-RESUME.md','assets/yangjian-v108','motion/yangjian-v108','.verify/v32-108','.verify/v32-108-checks.json','scripts/save-current-v32-108.mjs','scripts/verify-v32-108-package.mjs'])await add(source+'/'+f,'项目/'+f);
await add(source+'/../AGENTS.md','工作区入口.md');await add(source+'/CURRENT-V32-108-RESUME.md','接续说明.md');await add(source+'/.verify/v32-108-checks.json','当前检查结果-v32-108-checks.json');
const pending={version:'V32.108',source,package:candidate,currentPackageBase:previous,complete:false,currentPackageRunPassed:false,started:new Date().toISOString(),userVisualAcceptance:false,onlyLatestCompletePolicy:true};
await fs.mkdir(candidate,{recursive:true});await fs.writeFile(candidate+'/保存结果.json',JSON.stringify(pending,null,2));
const todo=[...entries],manifest=[];let next=0;console.log('Copy '+todo.length+' files with source/target SHA');
await Promise.all(Array.from({length:6},async()=>{for(;;){const i=next++;if(i>=todo.length)return;const[rel,item]=todo[i],dest=path.resolve(candidate,rel);assert(dest.startsWith(path.resolve(candidate)+path.sep));await fs.mkdir(path.dirname(dest),{recursive:true});await fs.copyFile(item.source,dest);const sha=await hash(dest);assert.equal(sha,item.sha256,rel);manifest.push({path:rel,bytes:(await fs.stat(dest)).size,sha256:sha});if(i%2500===0)console.log('Copied '+i)}}));
manifest.sort((a,b)=>a.path.localeCompare(b.path));await fs.writeFile(candidate+'/文件清单.json',JSON.stringify(manifest,null,2));
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...pending,copyHashesPassed:true,files:manifest.length,bytes:manifest.reduce((s,r)=>s+r.bytes,0)},null,2));
console.log('Candidate copied and verified; independent runtime pending.');
