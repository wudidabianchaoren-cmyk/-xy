import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';import path from 'node:path';import {gzipSync} from 'node:zlib';
const out='assets/browser-v179/myth-field';await fs.mkdir(out,{recursive:true});
if(!(await fs.realpath(out)).startsWith(process.cwd()))throw Error('Output must remain isolated');
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--force_high_performance_gpu']});const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const file of ['mythology-local-v162.js','mythology-web-v165.js'])await p.route('**/scene-dist/'+file+'*',route=>route.fulfill({path:path.resolve('scene-dist',file),contentType:'application/javascript'}));
await p.route('**/scene-dist/mythology-offline-v162.js*',route=>route.fulfill({body:'',contentType:'application/javascript'}));
try{
 await p.goto('http://127.0.0.1:8031/mythology.html?renderer=web&bakeCapture=myth&v=179',{waitUntil:'domcontentloaded',timeout:45000});await p.waitForFunction(()=>window.odysseyState?.ready&&window.odysseyState.exportNativeBake,{},{timeout:120000});
 await p.evaluate(()=>{const h=window.__portfolioNativeHubV167;h.focused=true;h.claim=true;h.last='';window.odysseyState.nativeController.update();});
 const specs=[{id:'coast',p:[37,17,49],t:[-6,9,-16]}];
 for(const deg of [-15,15]){const angle=deg*Math.PI/180,x=-43,z=-65;specs.push({id:deg<0?'coast-left':'coast-right',p:[37,17,49],t:[37+x*Math.cos(angle)+z*Math.sin(angle),9,49-x*Math.sin(angle)+z*Math.cos(angle)]});}
 for(const distance of [55,88]){const length=Math.hypot(43,8,65);specs.push({id:distance===55?'coast-near':'coast-far',p:[-6+43/length*distance,9+8/length*distance,-16+65/length*distance],t:[-6,9,-16]});}
 specs.push({id:'cottage',view:3});
 const poses=[];
 for(const spec of specs){
  if(spec.view!==undefined)await p.evaluate(i=>window.odysseyState.view(i),spec.view);else await p.evaluate(s=>window.odysseyState.inspectCamera(s.p,s.t),spec);
  await p.waitForTimeout(1700);const pose={id:spec.id,captures:[]};
  for(const night of [false,true]){
   await p.evaluate(on=>window.odysseyState.setNight(on),night);await p.waitForTimeout(3500);
   await p.waitForFunction(()=>{const s=window.odysseyState,n=window.__portfolioNativeHubV167?.native;return s.nativeUE?.ready&&n?.scene==='myth'&&n.appliedCamera?.every((v,i)=>Math.abs(v-s.camera[i])<.002)&&n.target?.every((v,i)=>Math.abs(v-s.cameraTarget[i])<.002);},{},{timeout:45000});
   const snap=await p.evaluate(()=>window.odysseyState.exportNativeBake());const file=`${spec.id}-${night?'night':'day'}.png`;await fs.writeFile(path.join(out,file),Buffer.from(snap.image.split(',')[1],'base64'));
   if(!night){const depth=`${spec.id}-depth.bin.gz`;await fs.writeFile(path.join(out,depth),gzipSync(Buffer.from(snap.depth,'base64')));Object.assign(pose,Object.fromEntries(Object.entries(snap).filter(([k])=>!['image','depth'].includes(k))),{depth});}
   pose[night?'off':'on']=file;pose.captures.push({night,nativeFrameTime:snap.nativeFrameTime});console.log(JSON.stringify({id:spec.id,night,source:snap.sourceScene,position:snap.position}));
  }
  poses.push(pose);const manifest={version:179,scene:'myth',threeRevision:'180',originalAssetsModified:false,qualityApproved:false,poses};await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));await fs.writeFile('.verify/v32-179/myth-field-capture.json',JSON.stringify({errors,manifest},null,2));
 }
 await p.evaluate(()=>{window.odysseyState.setNight(false);window.odysseyState.view(0);});
}catch(error){await fs.writeFile('.verify/v32-179/myth-capture-failure.json',JSON.stringify({error:error.message,diagnostics:await p.evaluate(()=>({state:window.odysseyState,native:window.__portfolioNativeHubV167?.native})).catch(()=>null)},(k,v)=>typeof v==='function'?undefined:v,2));throw error;}finally{await b.close();}
