import {chromium} from '../../node_modules/playwright/index.mjs';import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--force_high_performance_gpu']});const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const result={errors:[],console:[],http:[],nativeRequests:[],samples:[]};
p.on('pageerror',e=>result.errors.push(e.message));p.on('console',e=>{if(e.type()==='error')result.console.push(e.text())});p.on('response',r=>{if(r.status()>=400)result.http.push([r.status(),r.url()])});p.on('request',r=>{if(/:8089|\/_runtime\/|\/ue(?:\/|\?)/.test(r.url()))result.nativeRequests.push(r.url())});
await p.route('**/scene-dist/mythology-offline-v162.js*',r=>r.fulfill({body:'',contentType:'application/javascript'}));
try{
 await p.goto('http://127.0.0.1:8050/mythology.html?renderer=web&nativeLightfield=1&v=179',{waitUntil:'domcontentloaded',timeout:45000});await p.waitForFunction(()=>window.odysseyState?.ready,{},{timeout:120000});await p.waitForTimeout(2000);
 for(const name of ['coast','left','right','cottage','cottage-night']){
  if(name==='left'||name==='right'){await p.click('[data-odyssey-reset]');await p.waitForTimeout(1400);await p.mouse.move(960,520);await p.mouse.down();await p.mouse.move(name==='left'?1500:420,520,{steps:18});await p.mouse.up();}
  if(name==='cottage')await p.click('[data-odyssey-house]');if(name==='cottage-night')await p.click('[data-odyssey-night]');
  await p.waitForTimeout(name.includes('night')?4000:1700);await p.screenshot({path:'.verify/v32-179/myth-field-'+name+'.png'});result.samples.push(await p.evaluate(name=>({name,field:window.odysseyState.bakedLighting,fps:window.odysseyState.fps,camera:window.odysseyState.camera,target:window.odysseyState.cameraTarget,native:!!window.odysseyState.nativeController}),name));
 }
}catch(e){result.failure=e.message;await p.screenshot({path:'.verify/v32-179/myth-field-failure.png'}).catch(()=>{})}finally{await fs.writeFile('.verify/v32-179/myth-field-result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await b.close();}
