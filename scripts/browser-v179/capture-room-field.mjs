import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=process.cwd(),out='assets/browser-v179/room-field';
if(!root.endsWith('cinematic-ai-archive-browser'))throw Error('Authoring must stay in isolated worktree');
await fs.mkdir(out,{recursive:true});if(!(await fs.realpath(out)).startsWith(root))throw Error('Do not write through an original asset junction');
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--force_high_performance_gpu']});
const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/scene-dist/directory-v144/app.js*',route=>route.fulfill({path:path.resolve('scene-dist/directory-v144/app.js'),contentType:'application/javascript'}));
try{
 await p.goto('http://127.0.0.1:8031/directory.html?v=browser179&bakeCapture=1',{waitUntil:'domcontentloaded',timeout:45000});
 await p.bringToFront();
 await p.waitForFunction(()=>window.directoryState?.current.exportNativeBake,{},{timeout:90000});
 await p.evaluate(()=>{const h=window.__portfolioNativeHubV167;if(h){h.focused=true;h.claim=true;h.last='';}window.directoryState.current.nativeController?.update();});
 await p.waitForFunction(()=>{const h=window.__portfolioNativeHubV167,s=window.directoryState?.current;return s?.nativeUE?.ready&&h?.native?.scene==='room'&&h.native.appliedCamera?.every((v,i)=>Math.abs(v-s.camera[i])<.003);},{},{timeout:60000});
 if(await p.evaluate(()=>window.directoryState.current.tvPowered))await p.evaluate(()=>window.directoryState.action('power'));
 await p.waitForTimeout(1400);
 const poses=[];
 const specs=process.argv.includes('--all')?[{id:'desk',view:'desk'},{id:'desk-left',view:'desk',drag:-450},{id:'desk-right',view:'desk',drag:450},{id:'tv',view:'tv'},{id:'window',view:'window'},{id:'phone',view:'detail-phone-v143'},{id:'books',view:'detail-books'},{id:'cds',view:'detail-cds'},{id:'pens',view:'detail-pen-v143'}]:[{id:'desk',view:'desk'}];
 for(const spec of specs){
 await p.evaluate(view=>window.directoryState.view(view),spec.view);await p.waitForTimeout(1300);
 if(spec.drag){await p.mouse.move(960,530);await p.mouse.down();await p.mouse.move(960+spec.drag,530,{steps:18});await p.mouse.up();await p.waitForTimeout(700);}
 const pose={id:spec.id,captures:[]};
 for(const on of [true,false]){
  if(await p.evaluate(()=>window.directoryState.current.lampOn)!==on)await p.evaluate(()=>window.directoryState.action('lamp'));
  await p.waitForTimeout(1600);
  await p.waitForFunction(()=>{const s=window.directoryState.current,n=window.__portfolioNativeHubV167.native;return n?.scene==='room'&&!s.cameraTransition.active&&n.appliedCamera?.every((v,i)=>Math.abs(v-s.camera[i])<.002)&&n.target?.every((v,i)=>Math.abs(v-s.look[i])<.002);},{},{timeout:30000});
  const snap=await p.evaluate(()=>window.directoryState.current.exportNativeBake());
  const name=`${spec.id}-${on?'on':'off'}.png`;await fs.writeFile(path.join(out,name),Buffer.from(snap.image.split(',')[1],'base64'));
  if(on){const depth=`${spec.id}-depth.bin.gz`;await fs.writeFile(path.join(out,depth),gzipSync(Buffer.from(snap.depth,'base64')));Object.assign(pose,Object.fromEntries(Object.entries(snap).filter(([k])=>!['image','depth'].includes(k))),{depth});}
  pose[on?'on':'off']=name;pose.captures.push({lamp:on,nativeFrameTime:snap.nativeFrameTime});
  console.log(JSON.stringify({pose:spec.id,lamp:on,source:snap.sourceScene,pixels:[snap.width,snap.height],depth:[snap.depthWidth,snap.depthHeight],position:snap.position}));
 }
 poses.push(pose);
 const manifest={version:179,scene:'room',threeRevision:'180',engineSource:'original UE 5.8.4 native output; captured locally once',originalAssetsModified:false,qualityApproved:false,poses};
 await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 await fs.writeFile('.verify/v32-179/room-field-capture.json',JSON.stringify({errors,manifest},null,2));
 }
 await p.evaluate(()=>{window.directoryState.view('desk');if(!window.directoryState.current.lampOn)window.directoryState.action('lamp');if(!window.directoryState.current.tvPowered)window.directoryState.action('power');});
}catch(error){
 const diagnostics=await p.evaluate(()=>{const h=window.__portfolioNativeHubV167;return{focus:document.hasFocus(),native:h?.native,focused:h?.focused,owner:h?.owner?.scene,errors:window.directoryState?.current.nativeUE}}).catch(()=>null);
 await fs.writeFile('.verify/v32-179/capture-failure.json',JSON.stringify({error:error.message,diagnostics},null,2));throw error;
}finally{await b.close();}
