import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const origin=process.env.PERSONAL_ORIGIN||'http://127.0.0.1:8059',out=process.env.PERSONAL_OUTPUT||'.verify/v32-192/personal';
await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:1920,height:1080}}),r={origin,errors:[],views:[]};
p.on('pageerror',e=>r.errors.push(e.message));
try{
 await p.goto(origin+'/?return=1',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForFunction(()=>window.homeClockState?.ready,{},{timeout:180000});
 await p.click('#indexTrigger');await p.locator('#indexList [data-open-standalone="personalPage"]').click();
 await p.waitForFunction(()=>document.querySelector('#personalPage')?.classList.contains('is-standalone-open'));
 for(const viewport of[{width:1920,height:1080},{width:1440,height:900}]){
  await p.setViewportSize(viewport);await p.locator('.personal-portrait img').evaluate(i=>i.decode());await p.waitForTimeout(800);
  const view=await p.locator('#personalPage').evaluate(el=>{const img=el.querySelector('.personal-portrait img'),footer=el.querySelector('.personal-contact'),rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}};return{text:el.textContent,portrait:{src:img.src,fit:getComputedStyle(img).objectFit,natural:[img.naturalWidth,img.naturalHeight],rect:rect(img)},footer:rect(footer),labels:[...footer.children].map(rect),horizontalOverflow:el.scrollWidth>el.clientWidth+1};});
  if(!view.text.includes('2005 年 3 月 5 日')||!view.text.includes('2026 湖南卫视芒果 TV 中秋晚会')||view.text.includes('从视觉设想到影像落地')||view.portrait.fit!=='contain'||view.horizontalOverflow||Math.max(...view.labels.map(n=>n.y))-Math.min(...view.labels.map(n=>n.y))>2)throw Error('Personal identity, portrait or contact alignment failed');
  r.views.push({viewport,...view});await p.screenshot({path:out+'/'+viewport.width+'.png'});
 }
 await p.click('#personalPageClose');r.closed=await p.locator('#personalPage').evaluate(el=>!el.classList.contains('is-standalone-open'));r.pass=r.closed&&!r.errors.length;
}catch(e){r.failure=e.stack;r.pass=false;await p.screenshot({path:out+'/failure.png'}).catch(()=>{});}finally{await b.close();await fs.writeFile(out+'/result.json',JSON.stringify(r,null,2));console.log(JSON.stringify({pass:r.pass,failure:r.failure,views:r.views.length,errors:r.errors}));}
