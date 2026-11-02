import {chromium} from '../../node_modules/playwright/index.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--force_high_performance_gpu']});const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const result={errors:[],console:[],http:[],nativeRequests:[]};
await p.addInitScript(()=>{const method=WebGL2RenderingContext.prototype.texSubImage2D;WebGL2RenderingContext.prototype.texSubImage2D=function(...args){try{return method.apply(this,args)}catch(error){(window.__badUploads??=[]).push(args.map(a=>typeof a==='number'?a:a==null?null:{type:a.constructor?.name,width:a.width,height:a.height,bytes:a.byteLength,src:a.currentSrc||a.src}));throw error;}};});
p.on('pageerror',e=>result.errors.push(e.message));p.on('console',e=>{if(e.type()==='error')result.console.push(e.text())});p.on('response',r=>{if(r.status()>=400)result.http.push([r.status(),r.url()])});p.on('request',r=>{if(/:8089|\/_runtime\/|\/ue(?:\/|\?)/.test(r.url()))result.nativeRequests.push(r.url())});
try{
 await p.goto('http://127.0.0.1:8050/directory.html?renderer=web&nativeLightfield='+(process.argv[2]==='baseline'?'0':'1')+'&v=179',{waitUntil:'domcontentloaded',timeout:45000});
 await p.waitForFunction(()=>window.directoryState?.ready,{},{timeout:90000});await p.waitForTimeout(1000);
 if(await p.evaluate(()=>window.directoryState.current.tvPowered))await p.evaluate(()=>window.directoryState.action('power'));
 await p.waitForTimeout(500);await p.screenshot({path:'.verify/v32-179/room-field-on.png'});
 result.state=await p.evaluate(()=>{const s=window.directoryState.current;return{ready:s.ready,field:s.bakedLighting,camera:s.camera,frames:s.frames,native:!!s.nativeController,badUploads:window.__badUploads}});
 await p.evaluate(()=>window.directoryState.action('lamp'));await p.waitForTimeout(1200);await p.screenshot({path:'.verify/v32-179/room-field-off.png'});
}catch(e){result.failure=e.message;await p.screenshot({path:'.verify/v32-179/room-field-failure.png'}).catch(()=>{})}finally{await fs.writeFile('.verify/v32-179/room-field-result'+(process.argv[2]||'')+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await b.close();}
