import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const folder='.verify/v32-187/desktop-compat';await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();const report={errors:[],http:[]};
page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.http.push({url:r.url(),status:r.status()});});
await page.addInitScript(()=>{const original=window.createImageBitmap.bind(window);window.createImageBitmap=(input,...args)=>input instanceof Blob&&input.type==='image/avif'?Promise.reject(Error('Injected unsupported AVIF')):original(input,...args);window.MediaSource=undefined;window.OffscreenCanvas=undefined;});
try{
 await page.route('**/__desktop_compat__',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><script src="/browser-resources-v180.js"></script><script src="/browser-runtime-v180.js"></script><body></body>'}));
 await page.goto('http://127.0.0.1:8054/__desktop_compat__');await page.evaluate(()=>window.portfolioImageFormatsReady187);
 report.image=await page.evaluate(async()=>{const source=Object.keys(window.PORTFOLIO_RESOURCES_V180.imageFormatFallbacks187)[0],image=new Image();document.body.append(image);image.src=source;await image.decode();return{source,actual:image.currentSrc,width:image.naturalWidth,height:image.naturalHeight,capability:window.portfolioImageFormats187};});
 report.video=await page.evaluate(async()=>{const v=document.createElement('video');v.muted=true;v.playsInline=true;document.body.append(v);v.src='/assets/loading-study/loading-study-v32-84.mp4';await v.play();const start=performance.now();while(v.currentTime<.5){if(performance.now()-start>15000)throw Error('Direct original MP4 did not advance');await new Promise(r=>setTimeout(r,100));}return{source:v.currentSrc,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,delivery:window.portfolioDeliveryState};});
 report.pass=report.errors.length===0&&report.http.length===0&&report.image.actual.includes('/assets/browser-v187/images/')&&report.video.source.includes('/assets/browser-v187/media/')&&report.video.time>.5;
}catch(error){report.pass=false;report.failure=error.stack;}finally{await fs.writeFile(folder+'/result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser.close();}
