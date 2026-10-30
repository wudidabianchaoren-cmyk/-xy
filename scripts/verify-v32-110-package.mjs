import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {spawn} from 'node:child_process';
import net from 'node:net';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from '../node_modules/playwright/index.mjs';
const root='E:/codex/脑海宇宙作品集',candidate=root+'/当前作品集_V32.109',final=root+'/当前作品集_V32.110';
const read=async p=>JSON.parse((await fs.readFile(p,'utf8')).replace(/^\uFEFF/,''));
const hash=async p=>{const h=createHash('sha256');for await(const b of createReadStream(p))h.update(b);return h.digest('hex')};
const receipt=await read(candidate+'/保存结果.json'),manifest=await read(candidate+'/文件清单.json');assert(!receipt.complete&&receipt.copyHashesPassed);
const manifestSHA=await hash(candidate+'/文件清单.json');let previousStage=null;try{previousStage=await read(candidate+'/独立SHA阶段.json')}catch{}if(previousStage?.passed&&previousStage.manifestSHA===manifestSHA&&previousStage.files===manifest.length){console.log('Reuse completed independent SHA stage '+manifest.length)}else{let n=0;await Promise.all(Array.from({length:6},async()=>{for(;;){const i=n++;if(i>=manifest.length)return;const r=manifest[i];assert.equal(await hash(candidate+'/'+r.path),r.sha256,r.path)}}));await fs.writeFile(candidate+'/独立SHA阶段.json',JSON.stringify({passed:true,manifestSHA,files:manifest.length,verifiedAt:new Date().toISOString()},null,2));console.log('Independent SHA passed '+manifest.length)}
await new Promise((resolve,reject)=>{const s=net.connect(8032,'127.0.0.1');s.once('connect',()=>{s.destroy();reject(Error('8032 occupied'))});s.once('error',e=>e.code==='ECONNREFUSED'?resolve():reject(e))});
const project=candidate+'/项目';
const server=spawn('C:/Users/HP/AppData/Local/Programs/Python/Python313/python.exe',['-c',"import runpy,sys;m=runpy.run_path(sys.argv[1]);m['ThreadingHTTPServer'](('127.0.0.1',8032),m['PreviewHandler']).serve_forever()",project+'/serve-preview.py'],{cwd:project,windowsHide:true,stdio:'ignore'});
let browser;const result={version:'V32.110',passed:false,port:8032,source:candidate,errors:[]};
try{
 for(let i=0;i<30;i++){const ok=await new Promise(resolve=>{const req=http.get('http://127.0.0.1:8032/yangjian.html',res=>{res.resume();res.on('end',()=>resolve(res.statusCode===200))});req.on('error',()=>resolve(false));req.setTimeout(1500,()=>{req.destroy();resolve(false)})});if(ok)break;await new Promise(r=>setTimeout(r,200))}
 browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>result.errors.push(e.message));
 await p.goto('http://localhost:8032/yangjian.html?v=32.110',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.yangjianReading?.getState().ready);assert.equal(await p.locator('.chapter').count(),8);result.boot=await p.evaluate(()=>window.yangjianReading.getState());assert(result.boot.beats>=39);
 await p.mouse.click(650,400);await p.waitForTimeout(1600);assert((await p.evaluate(()=>window.yangjianReading.getState())).soundEnabled);
 for(const beat of [6,22,32,34,39]){await p.evaluate(n=>window.yangjianReading.seekBeat(n),beat);await p.waitForTimeout(800);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);}
 await p.waitForFunction(()=>window.yangjianReading.getState().videoStates.some(v=>v.kind==='split'&&v.ready>=2));result.story=await p.evaluate(()=>window.yangjianReading.getState());assert.equal(result.story.mediaFailures.length,0);
 await p.goto('http://localhost:8032/v31.html?v=32.110&return=1',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.body.classList.contains('experience-entered')&&window.homeClockState?.ready,null,{timeout:120000});result.home=await p.evaluate(()=>({ready:window.homeClockState.ready,hotspots:document.querySelectorAll('.home-secret-hit').length,appendLast:document.getElementById('yangjianAppend')===document.querySelector('main').lastElementChild}));assert.equal(result.home.hotspots,4);assert(result.home.appendLast);
 await p.locator('#yangjianAppend').scrollIntoViewIfNeeded();await p.waitForFunction(()=>document.querySelector('#yangjianAppend img').naturalWidth>0);assert((await p.locator('#yjAppendEnter').getAttribute('href')).includes('32.110'));assert.equal(result.errors.length,0);result.passed=true;
}finally{await browser?.close();server.kill();await fs.writeFile(candidate+'/当前包运行检查.json',JSON.stringify(result,null,2))}
assert(result.passed,'Independent package did not pass');
const rows=[];async function walk(dir,rel=''){for(const name of await fs.readdir(dir)){const r=rel?rel+'/'+name:name;if(r==='文件清单.json'||r==='保存结果.json')continue;const f=dir+'/'+name,s=await fs.stat(f);if(s.isDirectory())await walk(f,r);else rows.push({path:r,bytes:s.size,sha256:await hash(f)})}}await walk(candidate);rows.sort((a,b)=>a.path.localeCompare(b.path));await fs.writeFile(candidate+'/文件清单.json',JSON.stringify(rows,null,2));
await fs.writeFile(candidate+'/保存结果.json',JSON.stringify({...receipt,package:final,complete:true,currentPackageRunPassed:true,independentPort:8032,saved:new Date().toISOString(),files:rows.length,bytes:rows.reduce((s,r)=>s+r.bytes,0),manifestSha256:await hash(candidate+'/文件清单.json')},null,2));
try{await fs.access(final);throw Error('Final already exists')}catch(e){if(e.code!=='ENOENT')throw e}assert.equal(path.dirname(await fs.realpath(candidate)),await fs.realpath(root));assert.equal(path.dirname(path.resolve(final)),await fs.realpath(root));await fs.rename(candidate,final);
console.log(JSON.stringify({complete:true,currentPackageRunPassed:true,package:final,files:rows.length,oldCompletePackageNotYetRemoved:true}));
