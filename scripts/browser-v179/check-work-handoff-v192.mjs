import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const origin=process.env.HANDOFF_ORIGIN||'http://127.0.0.1:8059',out=process.env.HANDOFF_OUTPUT||'.verify/v32-192/work-handoff-final';
await fs.mkdir(out,{recursive:true});const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:1920,height:1080}}),r={origin,errors:[],samples:[],scope:'Archive opened through its existing application API, followed by actual mouse card click, composited handoff samples and actual return click'};
p.on('pageerror',e=>r.errors.push(e.message));
try{
 await p.goto(origin+'/?return=1',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForFunction(()=>window.homeClockState?.ready&&window.openWorksOrbitArchive,{},{timeout:180000});
 await p.evaluate(()=>window.openWorksOrbitArchive(document.getElementById('enterWork')));await p.waitForFunction(()=>window.worksOrbitState?.().ready,{},{timeout:30000});
 await p.click('#worksOrbitIndexTrigger');await p.click('[data-orbit-index="0"]');await p.waitForTimeout(2200);
 const card=await p.evaluate(()=>{const s=window.worksOrbitState();return s.cards[s.selectedIndex]});await p.mouse.click(card.x,card.y);
 await p.waitForFunction(()=>window.workTransitionState192?.href===document.getElementById('workProjectFrame')?.src,{},{timeout:60000});
 for(let n=0;n<5;n++){
  const row=await p.evaluate(()=>{const v=document.querySelector('.works-project-transition'),f=document.getElementById('workProjectFrame');return{state:window.workTransitionState192,curtainOpacity:v?getComputedStyle(v).opacity:null,archive:getComputedStyle(document.getElementById('worksOrbitArchive')).visibility,filmOpacity:f.contentDocument.querySelector('video').style.opacity};});
  if(row.archive!=='hidden'||row.curtainOpacity!==null&&row.curtainOpacity!=='1')throw Error('Transparent parent image overlap returned');r.samples.push(row);await p.screenshot({path:out+'/'+n+'.png'});await p.waitForTimeout(80);
 }
 const child=p.frames().find(f=>f.url().includes('after-journey.html'));await child.locator('[data-project-return]').first().click();await p.waitForFunction(()=>!document.getElementById('workProjectFrame'));r.returned=await p.locator('#worksOrbitArchive').evaluate(el=>getComputedStyle(el).visibility==='visible');r.pass=r.returned&&!r.errors.length;
}catch(e){r.pass=false;r.failure=e.stack;}finally{await b.close();await fs.writeFile(out+'/result.json',JSON.stringify(r,null,2));console.log(JSON.stringify({pass:r.pass,failure:r.failure,samples:r.samples.length,errors:r.errors}));}
