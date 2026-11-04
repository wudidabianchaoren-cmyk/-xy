import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const out=process.env.VISUAL_OUTPUT||'.verify/v32-189/baseline';await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'msedge',headless:true});const p=await b.newPage({viewport:{width:1920,height:1080}});const report={errors:[],samples:[]};p.on('pageerror',e=>report.errors.push(e.message));
try{
 await p.goto(process.env.VISUAL_ORIGIN||'http://127.0.0.1:8054/',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>document.querySelector('.prelude-opening-video')?.currentTime>19,{timeout:90000});
 for(let i=0;i<12;i++){report.samples.push(await p.evaluate(()=>{const intro=document.querySelector('.home-designed-intro'),v=intro?.querySelector('video'),s=intro&&getComputedStyle(intro);return{at:performance.now(),opening:document.querySelector('.prelude-opening-video')?.currentTime,body:document.body.className,complete:document.body.dataset.openingComplete,intro:window.homeDesignedIntroState&&{frame:window.homeDesignedIntroState.frame,active:window.homeDesignedIntroState.active,ready:window.homeDesignedIntroState.firstFrameReady},style:s&&{visibility:s.visibility,opacity:s.opacity,display:s.display},bounds:intro?.getBoundingClientRect().toJSON(),video:v&&{time:v.currentTime,ready:v.readyState},top:document.elementsFromPoint(innerWidth/2,innerHeight/2).slice(0,6).map(x=>x.tagName+'.'+x.className)};}));await p.screenshot({path:out+'/handoff-'+i+'.jpg'});await p.waitForTimeout(90);}
 await p.waitForFunction(()=>window.homeDesignedIntroState?.finished,{timeout:90000});
 await p.evaluate(()=>{const el=document.getElementById('workFlow');const y=el.offsetTop+(el.offsetHeight-innerHeight)*.5;window.__v31Lenis?.scrollTo(y,{immediate:true,force:true});scrollTo(0,y);});await p.waitForTimeout(600);await p.screenshot({path:out+'/collage.png'});
 await p.locator('#archiveDirectory').evaluate(el=>el.scrollIntoView());await p.waitForFunction(()=>window.directoryState?.ready,{timeout:120000});await p.waitForTimeout(1200);
 await p.mouse.move(1100,700);await p.mouse.down();await p.mouse.move(600,700,{steps:25});await p.mouse.up();await p.waitForTimeout(1000);await p.screenshot({path:out+'/room-left.png'});
 report.room=await p.evaluate(()=>({state:window.directoryState.current.performance,lighting:window.directoryState.current.bakedLighting}));
 await p.evaluate(()=>{window.__v31Lenis?.scrollTo(0,{immediate:true,force:true});scrollTo(0,0);document.getElementById('personalEntry')?.click();});
 const personal=p.locator('#personalPage');if(await personal.isVisible()){await p.screenshot({path:out+'/personal.png'});report.personal=await personal.evaluate(el=>({extra:el.querySelectorAll('.personal-experience,.personal-method').length,contact:el.querySelector('.personal-contact')?.textContent}));}
}catch(e){report.failure=e.stack;}finally{await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));await b.close();console.log(JSON.stringify({failure:report.failure,errors:report.errors,room:report.room}));}
