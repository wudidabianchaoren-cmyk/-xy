import fs from 'node:fs/promises';import path from 'node:path';import {createReadStream} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import http from 'node:http';import net from 'node:net';
const read=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const sha=async p=>{const h=createHash('sha256');for await(const b of createReadStream(p))h.update(b);return h.digest('hex')};
const checks=await read('.verify/v32-114/checks.json');assert(checks.passed&&checks.embeddedWorkReturn);assert((await read('.verify/scenes-typecheck-results.json')).passed);
const root='E:/codex/脑海宇宙作品集',candidate=root+'/当前作品集_V32.113',final=root+'/当前作品集_V32.114';
const receipt=await read(candidate+'/保存结果.json');assert(receipt.complete&&receipt.currentPackageRunPassed);
const oldRows=await read(candidate+'/文件清单.json'),entries=new Map(oldRows.map(r=>[r.path,r]));
async function put(src,rel){
 const st=await fs.lstat(src);if(st.isDirectory()){for(const n of await fs.readdir(src))await put(src+'/'+n,rel+'/'+n);return;}if(!st.isFile())return;
 const hash=await sha(src),prior=entries.get(rel);if(prior?.sha256===hash)return;
 if(prior){assert.equal(await sha(candidate+'/'+rel),prior.sha256,rel);const old='项目/.verify/v32-114/previous-package-source/'+rel;await fs.mkdir(path.dirname(candidate+'/'+old),{recursive:true});await fs.copyFile(candidate+'/'+rel,candidate+'/'+old);entries.set(old,{path:old,bytes:prior.bytes,sha256:prior.sha256});}
 await fs.mkdir(path.dirname(candidate+'/'+rel),{recursive:true});await fs.copyFile(src,candidate+'/'+rel);assert.equal(await sha(candidate+'/'+rel),hash);entries.set(rel,{path:rel,bytes:st.size,sha256:hash});
}
const top='# CURRENT 脑海宇宙 V32.114 / 2026-10-15\n\n先读 cinematic-ai-archive-prototype/CURRENT-V32-114-RESUME.md（项目内同名）。主页面神话介绍与代码电影长页已迁出；尤利西斯仅由阅读书架进入，原3D内部不改。“让画面发生”合并两片：1／18秒图形物理影片＋8张玻璃图；2／50秒提示词代码电影＋5张玻璃图；最后一份合并简介。原影片、音轨与13张制作图保持。独立控制器 code-films-v114.js/css，未修改其他作品共享脚本，主页世界与四光点保持。预览 http://localhost:8031/physical-universe.html?v=32.114 ，主站 http://localhost:8031/v31.html?v=32.114 。完整包目标 E:/codex/脑海宇宙作品集/当前作品集_V32.114/，仅保存结果.json双true与独立运行/SHA通过可称完整保存。本轮没有新公网部署。\n\n---\n以下为历史记录，不覆盖V32.114。\n\n';
for(const p of ['AGENTS.md','../AGENTS.md']){const old=await fs.readFile(p,'utf8');assert(!old.startsWith('# CURRENT 脑海宇宙 V32.114'),'Do not rerun save');await fs.writeFile(p,top+old);}
for(const n of ['保存结果.json','文件清单.json','独立SHA阶段.json','当前包运行检查.json'])await put(candidate+'/'+n,'项目/.verify/v32-114/previous-package-source/'+n);
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...receipt,version:'V32.114',previousVersion:'V32.113',complete:false,currentPackageRunPassed:false},null,2));
const changed=['v31.html','physical-universe.html','v31-works-ring.js','src/scene-loader.ts','src/chapter-navigation.ts','scene-dist/scene-loader.js','scene-dist/scene-loader.js.map','code-films-v114.js','code-films-v114.css','assets/works/code-films-v114','templates/code-films-v114.html','.verify/v32-114','.verify/scenes-typecheck-results.json','CURRENT-V32-114-RESUME.md','AGENTS.md'];
for(const f of changed)await put(f,'项目/'+f);for(const n of (await fs.readdir('scripts')).filter(n=>n.includes('v114')))await put('scripts/'+n,'项目/scripts/'+n);await put('../AGENTS.md','工作区入口.md');await put('CURRENT-V32-114-RESUME.md','接续说明.md');
await new Promise((resolve,reject)=>{const s=net.connect(8032,'127.0.0.1');s.once('connect',()=>{s.destroy();reject(Error('8032 occupied; do not touch foreign server'))});s.once('error',e=>e.code==='ECONNREFUSED'?resolve():reject(e));});
const project=candidate+'/项目',server=spawn('C:/Users/HP/AppData/Local/Programs/Python/Python313/python.exe',['-c',"import runpy,sys;m=runpy.run_path(sys.argv[1]);m['ThreadingHTTPServer'](('127.0.0.1',8032),m['PreviewHandler']).serve_forever()",project+'/serve-preview.py'],{cwd:project,windowsHide:true,stdio:'ignore'});
try{
 let available=false;for(let i=0;i<30;i++){available=await new Promise(resolve=>{const r=http.get('http://127.0.0.1:8032/physical-universe.html',res=>{res.resume();res.on('end',()=>resolve(res.statusCode===200))});r.on('error',()=>resolve(false));});if(available)break;await new Promise(r=>setTimeout(r,200));}assert(available);
 await new Promise((resolve,reject)=>{const qa=spawn('E:/REA/runtime/node-v22.23.3-win-x64/node.exe',['.verify/v32-114/check-consolidation.mjs'],{cwd:process.cwd(),env:{...process.env,PREVIEW_ORIGIN:'http://localhost:8032'},windowsHide:true,stdio:'inherit'});qa.on('exit',code=>code===0?resolve():reject(Error('Independent QA failed '+code)));});
}finally{server.kill();}
const packageChecks=await read('.verify/v32-114/checks.json');assert(packageChecks.passed);
await fs.writeFile(candidate+'/当前包运行检查.json',JSON.stringify({version:'V32.114',port:8032,passed:true,checks:packageChecks},null,2));
await put('.verify/v32-114','项目/.verify/v32-114');
entries.set('当前包运行检查.json',{path:'当前包运行检查.json',bytes:(await fs.stat(candidate+'/当前包运行检查.json')).size,sha256:await sha(candidate+'/当前包运行检查.json')});
const current=[...entries.values()].filter(r=>r.path!=='独立SHA阶段.json').sort((a,b)=>a.path.localeCompare(b.path));
const known=new Set(current.map(r=>r.sha256));assert(oldRows.every(r=>known.has(r.sha256)),'Old unique content must survive increment');
console.log('Independent 8032 routes passed; verifying all package SHA values.');let next=0;
await Promise.all(Array.from({length:6},async()=>{for(;;){const i=next++;if(i>=current.length)return;assert.equal(await sha(candidate+'/'+current[i].path),current[i].sha256,current[i].path);}}));
await fs.writeFile(candidate+'/独立SHA阶段.json',JSON.stringify({version:'V32.114',passed:true,files:current.length,verifiedAt:new Date().toISOString()},null,2));
current.push({path:'独立SHA阶段.json',bytes:(await fs.stat(candidate+'/独立SHA阶段.json')).size,sha256:await sha(candidate+'/独立SHA阶段.json')});current.sort((a,b)=>a.path.localeCompare(b.path));
await fs.writeFile(candidate+'/文件清单.json',JSON.stringify(current,null,2));
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...receipt,version:'V32.114',previousVersion:'V32.113',package:final,complete:true,currentPackageRunPassed:true,copyHashesPassed:true,independentPort:8032,files:current.length,bytes:current.reduce((a,r)=>a+r.bytes,0),manifestSha256:await sha(candidate+'/文件清单.json'),saved:new Date().toISOString()},null,2));
try{await fs.access(final);throw Error('Final destination exists')}catch(e){if(e.code!=='ENOENT')throw e;}
const rootReal=await fs.realpath(root),candidateReal=await fs.realpath(candidate);assert.equal(path.dirname(candidateReal),rootReal);assert.equal(path.dirname(path.resolve(final)),rootReal);assert.equal(path.basename(candidateReal),'当前作品集_V32.113');
await fs.rename(candidate,final);
await fs.writeFile(root+'/先读这里.md','# 最新完整作品集 V32.114\n\n当前作品集_V32.114/保存结果.json complete/currentPackageRunPassed均为true；全文件SHA与独立8032运行通过。主页面做减法，代码影片归入“让画面发生”，阅读三书与原场景保留。\n');
await fs.writeFile('.verify/v32-114/package-result.json',JSON.stringify({complete:true,currentPackageRunPassed:true,package:final,files:current.length},null,2));
console.log(JSON.stringify({complete:true,currentPackageRunPassed:true,package:final,files:current.length}));
