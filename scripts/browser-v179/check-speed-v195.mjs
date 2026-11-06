import{chromium}from'../../node_modules/playwright/index.mjs';import fs from'node:fs/promises';
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY='1';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:8059',out=process.env.QA_OUTPUT||'.verify/v32-195/local';await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true}),r={origin,films:[],errors:[]};
try{
 const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>r.errors.push(e.message));
 await p.route('**/__qa.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><style>html,body{margin:0;background:#000}iframe{border:0;width:100vw;height:100vh}</style>'}));
 await p.goto(origin+'/__qa.html');
 await p.evaluate(()=>{window.__audibleBeforeFrame195=[];setInterval(()=>{const f=document.querySelector('iframe');try{for(const v of f?.contentDocument?.querySelectorAll('video')||[])if(!v.paused&&!v.muted&&v.dataset.firstFramePainted195!=='true')window.__audibleBeforeFrame195.push(v.id);}catch{}},20);});
 for(const name of ['after-journey','rural-return','mid-autumn','physical-universe','humid-southeast-asia']){
  const start=Date.now();await p.evaluate(name=>{document.querySelector('iframe')?.remove();const f=document.createElement('iframe');f.allow='autoplay; fullscreen';f.src='/'+name+'.html?embedded=1';window.__ready195=false;const receive=e=>{if(e.source===f.contentWindow&&e.data?.type==='brain-universe:project-ready'){window.__ready195=true;f.contentWindow.postMessage({type:'brain-universe:project-visible'},location.origin);removeEventListener('message',receive);}};addEventListener('message',receive);document.body.append(f);},name);
  await p.waitForFunction(()=>window.__ready195,{},{timeout:90000});const frame=p.frames().find(f=>f.url().includes('/'+name+'.html'));
  const first=await frame.evaluate(()=>({posters:document.querySelectorAll('.film-poster,video[poster]').length,opaqueHero:getComputedStyle(document.querySelector('.project-film')||document.querySelector('video').parentElement).backgroundColor}));if(first.posters)throw Error(name+' retains a film poster');
  const videos=frame.locator('video');for(let i=0;i<await videos.count();i++){
   const v=videos.nth(i),visibleAt=Date.now();await v.scrollIntoViewIfNeeded();await frame.waitForFunction(i=>{const v=document.querySelectorAll('video')[i];return v?.readyState>=2;},i,{timeout:90000});if(await v.evaluate(v=>v.paused))await v.click();
   await frame.waitForFunction(i=>{const v=document.querySelectorAll('video')[i];return v?.dataset.firstFramePainted195==='true'&&v.currentTime>.2&&!v.paused;},i,{timeout:30000});
   const visibleToFrameMs=Date.now()-visibleAt,entryToFrameMs=Date.now()-start,a=await v.evaluate(v=>({id:v.id,time:v.currentTime,frames:v.getVideoPlaybackQuality().totalVideoFrames,duration:v.duration,opacity:getComputedStyle(v).opacity}));await p.waitForTimeout(700);const t=await v.evaluate(v=>v.currentTime);if(t<=a.time)throw Error(name+' film stalled');
   await v.evaluate(v=>{v.currentTime=v.duration*.5;});await frame.waitForFunction(i=>{const v=document.querySelectorAll('video')[i];return !v.seeking&&v.readyState>=2&&v.currentTime>v.duration*.49;},i,{timeout:60000});r.films.push({name,...a,advanced:t-a.time,posterCount:first.posters,visibleToFrameMs,entryToFrameMs});
  }
  await p.screenshot({path:out+'/'+name+'.png'});
 }
 r.audioLeaks=await p.evaluate(()=>window.__audibleBeforeFrame195);if(r.audioLeaks.length)throw Error('Audio started before painted frame');
 const desk=await b.newPage();desk.on('pageerror',e=>r.errors.push(e.message));await desk.route('**/__desk.html*',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><link rel="stylesheet" href="/scene-dist/directory-v144/app.css"><style>#directoryPreviewRoot{height:800px;width:1400px}</style><div id="directoryPreviewRoot"></div><script src="/browser-resources-v180.js"></script><script src="/browser-runtime-v180.js"></script><script type="module" src="/scene-dist/browser-v192/directory-app-fast195.js"></script>'}));
 await desk.addInitScript(()=>{const load=document.fonts.load.bind(document.fonts);let held=false;document.fonts.load=(font,...args)=>font.includes('DirectoryHand')&&!held?(held=true,new Promise(()=>{})):load(font,...args);});
 await desk.goto(origin+'/__desk.html?renderer=web&roomAtlas185=1&roomAO=0');await desk.waitForFunction(()=>window.directoryContextReadyAt>0,{},{timeout:60000});r.desktopContextBeforeFont=true;
 if(process.env.QA_DESK_FULL==='1'){await desk.waitForFunction(()=>window.directoryState?.ready,{},{timeout:120000});r.desktopActualReady=true;await desk.screenshot({path:out+'/desktop.png'});}
 r.pass=r.films.length===6&&!r.errors.length&&r.desktopContextBeforeFont;
}catch(e){r.failure=e.stack;r.pass=false;}finally{await b.close();await fs.writeFile(out+'/result.json',JSON.stringify(r,null,2));console.log(JSON.stringify(r));}
