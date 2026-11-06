import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const origin=process.env.PERSONAL_ORIGIN||'http://127.0.0.1:8059',out=process.env.PERSONAL_OUTPUT||'.verify/v32-193/personal-local';
await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage({viewport:{width:1920,height:1080}}),r={origin,errors:[],console:[],http:[],views:[]};
p.on('pageerror',e=>r.errors.push(e.message));p.on('console',e=>{if(e.type()==='error')r.console.push(e.text());});p.on('response',e=>{if(e.status()>=400)r.http.push({status:e.status(),url:e.url()});});
try{
 await p.goto(origin+'/?return=1',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForFunction(()=>window.homeClockState?.ready,{},{timeout:180000});
 r.liveHome=true;
 await p.click('#indexTrigger');await p.locator('#indexList [data-open-standalone="personalPage"]').click();
 await p.waitForFunction(()=>document.querySelector('#personalPage')?.classList.contains('is-standalone-open'));
 for(const viewport of[{width:1920,height:1080},{width:1440,height:900},{width:1280,height:720}]){
  await p.setViewportSize(viewport);await p.locator('.personal-portrait img').evaluate(i=>i.decode());await p.waitForTimeout(700);
  const view=await p.locator('#personalPage').evaluate(el=>{const img=el.querySelector('.personal-portrait img'),footer=el.querySelector('.personal-contact'),rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}};return{text:el.textContent,introduction:[...el.querySelectorAll('.personal-introduction>p')].map(n=>n.textContent),protected:[...el.querySelector('.personal-resume-grid').children].map(n=>n.outerHTML),portrait:{src:img.src,fit:getComputedStyle(img).objectFit,position:getComputedStyle(img).objectPosition,background:getComputedStyle(img).backgroundColor,natural:[img.naturalWidth,img.naturalHeight],rect:rect(img)},footer:rect(footer),labels:[...footer.children].map(rect),horizontalOverflow:el.scrollWidth>el.clientWidth+1,scrollable:el.scrollHeight>el.clientHeight};});
  if(!view.text.includes('2005 年 3 月 5 日')||!view.text.includes('2026 湖南卫视芒果 TV 中秋晚会')||view.text.includes('关注人物、镜头和场景之间的连续性')||view.portrait.fit!=='cover'||view.portrait.background!=='rgba(0, 0, 0, 0)'||view.introduction.length!==3||view.horizontalOverflow||Math.max(...view.labels.map(n=>n.y))-Math.min(...view.labels.map(n=>n.y))>2)throw Error('Biography, portrait, overflow or contacts failed');
  r.views.push({viewport,...view});await p.screenshot({path:out+'/'+viewport.width+'.png'});
 }
 await p.setViewportSize({width:1440,height:900});await p.click('#personalHobbies');await p.waitForFunction(()=>document.querySelector('#hobbyPage').classList.contains('is-standalone-open'));r.hobbiesOpened=true;
 await p.click('#hobbyPageClose');await p.waitForFunction(()=>document.querySelector('#personalPage').classList.contains('is-standalone-open'));r.hobbiesReturned=true;
 await p.click('#personalPageClose');await p.waitForFunction(()=>!document.querySelector('#personalPage').classList.contains('is-standalone-open'));r.closed=true;
 await p.click('#indexTrigger');await p.locator('#indexList [data-open-standalone="personalPage"]').click();await p.waitForFunction(()=>document.querySelector('#personalPage').classList.contains('is-standalone-open'));r.reopened=true;
 await p.click('#personalPageClose');r.pass=r.closed&&r.reopened&&r.hobbiesReturned&&!r.errors.length&&!r.http.length;
}catch(e){r.failure=e.stack;r.pass=false;await p.screenshot({path:out+'/failure.png'}).catch(()=>{});}finally{await b.close();await fs.writeFile(out+'/result.json',JSON.stringify(r,null,2));console.log(JSON.stringify({pass:r.pass,failure:r.failure,views:r.views.length,errors:r.errors,console:r.console,http:r.http,hobbiesReturned:r.hobbiesReturned,reopened:r.reopened}));}
