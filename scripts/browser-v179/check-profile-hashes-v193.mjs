import{chromium}from'../../node_modules/playwright/index.mjs';
import fs from'node:fs/promises';import{createHash}from'node:crypto';
const origin=process.env.CF_QA_ORIGIN||'https://vvainex.click',out=process.env.CF_QA_HASH_OUTPUT||'.verify/v32-193/formal-hashes',stage=process.env.CF_QA_STAGE||'.verify/v32-193/site';
const previous=JSON.parse(await fs.readFile('.verify/v32-192/formal-hashes-normal/result.json','utf8'));
const retry=process.env.CF_QA_HASH_RETRY?JSON.parse(await fs.readFile(process.env.CF_QA_HASH_RETRY,'utf8')):null;
const paths=process.env.CF_QA_CHANGED_ONLY==='1'?['index.html','v31.html','scene-dist/browser-v192/home-world-v146.js','browser-runtime-v180.js']:retry?retry.records.filter(r=>!r.match).map(r=>r.path):[...new Set(['index.html','v31.html',...previous.records.map(r=>r.path)])];
await fs.mkdir(out,{recursive:true});const b=await chromium.launch({channel:'msedge',headless:true}),p=await b.newPage(),r={origin,errors:[],records:[]};
try{
 await p.addInitScript(()=>{window.__profileAuditFetch=window.fetch.bind(window);});
 const response=await p.goto(origin+'/learning.html',{waitUntil:'domcontentloaded',timeout:60000});r.browserStatus=response.status();
 r.records=await p.evaluate(async paths=>{const q=[...paths],rows=[];await Promise.all([0,1,2].map(async()=>{while(q.length){const path=q.shift();try{const res=await window.__profileAuditFetch('/'+(path==='index.html'?'':path),{signal:AbortSignal.timeout(120000)}),bytes=await res.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');rows.push({path,status:res.status,SHA256:hash});}catch(e){rows.push({path,error:String(e)});}}}));return rows;},paths);
 if(retry){r.recoveredFrom=process.env.CF_QA_HASH_RETRY;r.records.push(...retry.records.filter(x=>x.match));}
 for(const row of r.records){row.expectedSHA256=createHash('sha256').update(await fs.readFile(stage+'/'+row.path)).digest('hex');row.match=row.status===200&&row.expectedSHA256===row.SHA256;}
 r.allHashesMatch=r.records.every(x=>x.match)&&r.browserStatus===200;
}catch(e){r.failure=e.stack;r.allHashesMatch=false;}finally{await b.close();await fs.writeFile(out+'/result.json',JSON.stringify(r,null,2));console.log(JSON.stringify({origin,pass:r.allHashesMatch,checked:r.records.length,failed:r.records.filter(x=>!x.match),failure:r.failure}));}
