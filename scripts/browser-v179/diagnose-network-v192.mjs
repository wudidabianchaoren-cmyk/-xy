import {chromium} from '../../node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const out='.verify/v32-192/network-diagnostic';await fs.mkdir(out,{recursive:true});
for(const variant of['default','classical-diagnostic']){
 const b=await chromium.launch({channel:'msedge',headless:true,proxy:{server:'http://127.0.0.1:8060'},args:variant==='classical-diagnostic'?['--disable-features=PostQuantumKyber']:[]}),p=await b.newPage(),cdp=await p.context().newCDPSession(p),rows=new Map(),r={variant,diagnosticOnly:true,events:[],errors:[]};
 await cdp.send('Network.enable');cdp.on('Network.requestWillBeSent',e=>rows.set(e.requestId,{url:e.request.url,start:e.timestamp,type:e.type}));
 cdp.on('Network.responseReceived',e=>{const row=rows.get(e.requestId);if(row)Object.assign(row,{status:e.response.status,protocol:e.response.protocol,headers:e.response.headers,security:e.response.securityDetails,response:e.timestamp});});
 cdp.on('Network.loadingFinished',e=>{const row=rows.get(e.requestId);if(row)Object.assign(row,{finished:e.timestamp,wireBytes:e.encodedDataLength});});
 cdp.on('Network.loadingFailed',e=>{const row=rows.get(e.requestId);if(row)row.error=e.errorText;});
 p.on('pageerror',e=>r.errors.push(e.message));const began=Date.now();
 try{await p.goto('https://vvainex.click/?networkAudit192='+variant,{waitUntil:'commit',timeout:20000});await p.waitForTimeout(20000);r.state=await p.evaluate(()=>({ready:document.readyState,home:window.homeClockState?.ready,opening:document.body.dataset.openingComplete,transport:window.portfolioTransport187,files:[...document.scripts].map(s=>s.src).filter(Boolean)}));}catch(e){r.failure=e.message;}finally{r.seconds=(Date.now()-began)/1000;r.requests=[...rows.values()];await b.close();await fs.writeFile(out+'/'+variant+'.json',JSON.stringify(r,null,2));console.log(JSON.stringify({variant,seconds:r.seconds,failure:r.failure,state:r.state,pending:r.requests.filter(x=>!x.finished&&!x.error).map(x=>({url:x.url,status:x.status,protocol:x.protocol})),errors:r.errors}));}
}
