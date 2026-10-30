import {chromium} from 'playwright';
import {createInterface} from 'node:readline';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('.verify/v32-75',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-gpu','--use-angle=d3d11']});
const page=await browser.newPage({viewport:{width:1600,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
globalThis.page=page;globalThis.browser=browser;globalThis.errors=errors;globalThis.writeFile=writeFile;
console.log('Visual browser ready; send one JSON code string per line.');
for await(const line of createInterface({input:process.stdin})){try{const result=await new Function('return (async()=>{'+JSON.parse(line)+'})()')();console.log(JSON.stringify({result,errors}));}catch(e){console.log(JSON.stringify({error:e.message,errors}));}}
await browser.close();
