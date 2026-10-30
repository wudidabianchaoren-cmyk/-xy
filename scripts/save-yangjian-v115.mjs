import fs from 'node:fs/promises';import path from 'node:path';import {createReadStream} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';import http from 'node:http';import net from 'node:net';
const read=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const sha=async p=>{const h=createHash('sha256');for await(const b of createReadStream(p))h.update(b);return h.digest('hex')};
const checks=await read('.verify/v32-115/checks.json');assert(checks.passed&&checks.returnToShelf);assert((await read('.verify/scenes-typecheck-results.json')).passed);
const root='E:/codex/脑海宇宙作品集',candidate=root+'/当前作品集_V32.114',final=root+'/当前作品集_V32.115';
const receipt=await read(candidate+'/保存结果.json');assert(receipt.complete&&receipt.currentPackageRunPassed);
const oldRows=await read(candidate+'/文件清单.json'),entries=new Map(oldRows.map(r=>[r.path,r]));
async function put(src,rel){
 const st=await fs.lstat(src);if(st.isDirectory()){if(src.startsWith('motion/yangjian-v115')&&['.hyperframes','.thumbnails','node_modules'].includes(path.basename(src)))return;for(const n of await fs.readdir(src))await put(src+'/'+n,rel+'/'+n);return;}if(!st.isFile())return;
 const hash=await sha(src),prior=entries.get(rel);if(prior?.sha256===hash)return;
 if(prior){assert.equal(await sha(candidate+'/'+rel),prior.sha256,rel);const old='项目/.verify/v32-115/previous-package-source/'+rel;await fs.mkdir(path.dirname(candidate+'/'+old),{recursive:true});await fs.copyFile(candidate+'/'+rel,candidate+'/'+old);entries.set(old,{path:old,bytes:prior.bytes,sha256:prior.sha256});}
 await fs.mkdir(path.dirname(candidate+'/'+rel),{recursive:true});await fs.copyFile(src,candidate+'/'+rel);assert.equal(await sha(candidate+'/'+rel),hash);entries.set(rel,{path:rel,bytes:st.size,sha256:hash});
}
const top="# CURRENT 脑海宇宙 V32.115 / 2026-10-15\n\n先读 cinematic-ai-archive-prototype/CURRENT-V32-115-RESUME.md。仅杨戬：粗墨黑白主体＋20秒新风雨渡河片，八章原故事与19图保留，新增3图，图文与背景共用视频波浪时钟/事件倾斜，主标题→第一章→居中梗概→图片。实录60秒雨水风替换重复短床，所有nativeAAC页内静音，由单WebAudio总线控制真实闪雷，M键和返回可用。实际REA运行开场前20000px、六章静态配置核对，覆盖限制在reference报告，不冒称完整六章运行或1:1电影级。原主页/四光点、阅读书架、神话与双片作品不改。预览 http://localhost:8031/yangjian.html?v=32.115 ，8031复用，不为查看重跑制作。完整包目标 E:/codex/脑海宇宙作品集/当前作品集_V32.115/，仅保存结果.json双true与独立运行/SHA通过为准。本轮无公网部署。\n\n---\n以下为历史记录，不覆盖V32.115。\n\n";
for(const p of ['AGENTS.md','../AGENTS.md']){const old=await fs.readFile(p,'utf8');assert(!old.startsWith('# CURRENT 脑海宇宙 V32.115'),'Do not rerun save');await fs.writeFile(p,top+old);}
for(const n of ['保存结果.json','文件清单.json','独立SHA阶段.json','当前包运行检查.json'])await put(candidate+'/'+n,'项目/.verify/v32-115/previous-package-source/'+n);
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...receipt,version:'V32.115',previousVersion:'V32.114',complete:false,currentPackageRunPassed:false},null,2));
const changed=["yangjian.html","yangjian.js","yangjian-v115.css","assets/yangjian-v115","motion/yangjian-v115",".verify/v32-115","CURRENT-V32-115-RESUME.md","AGENTS.md"];
for(const f of changed)await put(f,'项目/'+f);for(const n of (await fs.readdir('scripts')).filter(n=>n.includes('v115')))await put('scripts/'+n,'项目/scripts/'+n);await put('../AGENTS.md','工作区入口.md');await put('CURRENT-V32-114-RESUME.md','接续说明.md');
await new Promise((resolve,reject)=>{const s=net.connect(8032,'127.0.0.1');s.once('connect',()=>{s.destroy();reject(Error('8032 occupied; do not touch foreign server'))});s.once('error',e=>e.code==='ECONNREFUSED'?resolve():reject(e));});
const project=candidate+'/项目',server=spawn('C:/Users/HP/AppData/Local/Programs/Python/Python313/python.exe',['-c',"import runpy,sys;m=runpy.run_path(sys.argv[1]);m['ThreadingHTTPServer'](('127.0.0.1',8032),m['PreviewHandler']).serve_forever()",project+'/serve-preview.py'],{cwd:project,windowsHide:true,stdio:'ignore'});
try{
 let available=false;for(let i=0;i<30;i++){available=await new Promise(resolve=>{const r=http.get('http://127.0.0.1:8032/physical-universe.html',res=>{res.resume();res.on('end',()=>resolve(res.statusCode===200))});r.on('error',()=>resolve(false));});if(available)break;await new Promise(r=>setTimeout(r,200));}assert(available);
 await new Promise((resolve,reject)=>{const qa=spawn('E:/REA/runtime/node-v22.23.3-win-x64/node.exe',['.verify/v32-115/check-yangjian.mjs'],{cwd:process.cwd(),env:{...process.env,PREVIEW_ORIGIN:'http://localhost:8032'},windowsHide:true,stdio:'inherit'});qa.on('exit',code=>code===0?resolve():reject(Error('Independent QA failed '+code)));});
}finally{server.kill();}
const packageChecks=await read('.verify/v32-115/checks.json');assert(packageChecks.passed);
await fs.writeFile(candidate+'/当前包运行检查.json',JSON.stringify({version:'V32.115',port:8032,passed:true,checks:packageChecks},null,2));
await put('.verify/v32-115','项目/.verify/v32-115');
entries.set('当前包运行检查.json',{path:'当前包运行检查.json',bytes:(await fs.stat(candidate+'/当前包运行检查.json')).size,sha256:await sha(candidate+'/当前包运行检查.json')});
const current=[...entries.values()].filter(r=>r.path!=='独立SHA阶段.json').sort((a,b)=>a.path.localeCompare(b.path));
const known=new Set(current.map(r=>r.sha256));assert(oldRows.every(r=>known.has(r.sha256)),'Old unique content must survive increment');
console.log('Independent 8032 routes passed; verifying all package SHA values.');let next=0;
await Promise.all(Array.from({length:6},async()=>{for(;;){const i=next++;if(i>=current.length)return;assert.equal(await sha(candidate+'/'+current[i].path),current[i].sha256,current[i].path);}}));
await fs.writeFile(candidate+'/独立SHA阶段.json',JSON.stringify({version:'V32.115',passed:true,files:current.length,verifiedAt:new Date().toISOString()},null,2));
current.push({path:'独立SHA阶段.json',bytes:(await fs.stat(candidate+'/独立SHA阶段.json')).size,sha256:await sha(candidate+'/独立SHA阶段.json')});current.sort((a,b)=>a.path.localeCompare(b.path));
await fs.writeFile(candidate+'/文件清单.json',JSON.stringify(current,null,2));
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...receipt,version:'V32.115',previousVersion:'V32.114',package:final,complete:true,currentPackageRunPassed:true,copyHashesPassed:true,independentPort:8032,files:current.length,bytes:current.reduce((a,r)=>a+r.bytes,0),manifestSha256:await sha(candidate+'/文件清单.json'),saved:new Date().toISOString()},null,2));
try{await fs.access(final);throw Error('Final destination exists')}catch(e){if(e.code!=='ENOENT')throw e;}
const rootReal=await fs.realpath(root),candidateReal=await fs.realpath(candidate);assert.equal(path.dirname(candidateReal),rootReal);assert.equal(path.dirname(path.resolve(final)),rootReal);assert.equal(path.basename(candidateReal),'当前作品集_V32.114');
await fs.rename(candidate,final);
await fs.writeFile(root+'/先读这里.md','# 最新完整作品集 V32.115\n\n当前作品集_V32.115/保存结果.json complete/currentPackageRunPassed均为true；全文件SHA与独立8032运行通过。杨戬黑白风雨、共享镜头与实录声音升级；其它作品和阅读三书原内容保留。\n');
await fs.writeFile('.verify/v32-115/package-result.json',JSON.stringify({complete:true,currentPackageRunPassed:true,package:final,files:current.length},null,2));
console.log(JSON.stringify({complete:true,currentPackageRunPassed:true,package:final,files:current.length}));
