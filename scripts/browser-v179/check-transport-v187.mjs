import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const folder='.verify/v32-187/transport';await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();const result={errors:[]};page.on('pageerror',e=>result.errors.push(e.message));
try{
 await page.route('**/__transport_check__',r=>r.fulfill({contentType:'text/html',body:'<!doctype html>'}));
 await page.route('**/__transport_asset__/**',async r=>{await new Promise(resolve=>setTimeout(resolve,250));await r.fulfill({contentType:'application/octet-stream',body:Buffer.from([1,2,3,4])}).catch(()=>{});});
 // The release injects this exact source inline; use the repository source here.
 await page.goto('http://127.0.0.1:8054/__transport_check__');
 await page.addScriptTag({content:await fs.readFile('transport-v187.js','utf8')});
 result.queue=await page.evaluate(async()=>{
  const finished=[],jobs=[];for(let i=0;i<12;i++)jobs.push(fetch('/__transport_asset__/'+i+'.png').then(async r=>{const b=await r.arrayBuffer();finished.push('image'+i);if(b.byteLength!==4)throw Error('Response payload changed');}));
  const abort=new AbortController();const cancelled=fetch('/__transport_asset__/cancel.png',{signal:abort.signal}).then(()=>false,e=>e.name==='AbortError');abort.abort();
  jobs.push(fetch('/__transport_asset__/film.m4s').then(async r=>{await r.arrayBuffer();finished.push('film');}));await Promise.all(jobs);return{...window.portfolioTransport187,cancelled:await cancelled,finished};
 });
 result.pass=result.errors.length===0&&result.queue.cancelled&&result.queue.peakActive<=8&&result.queue.active===0&&result.queue.queued===0&&result.queue.finished.indexOf('film')<=3;
}catch(error){result.failure=error.stack;result.pass=false;}finally{await fs.writeFile(folder+'/result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();}
