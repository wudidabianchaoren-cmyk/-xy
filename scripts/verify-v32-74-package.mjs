import assert from 'node:assert/strict';
import {createReadStream} from 'node:fs';
import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir,lstat,mkdir,copyFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
const dest='E:/codex/脑海宇宙作品集/当前作品集_V32.74',root=path.dirname(dest),finalize=process.argv.includes('--finalize');
const saved=JSON.parse(await readFile(dest+'/保存结果.json','utf8'));
if(finalize&&saved.complete&&saved.currentPackageRunPassed)throw Error('Completed archive is frozen; verification only');
const hash=async f=>{const h=createHash('sha256');for await(const b of createReadStream(f))h.update(b);return h.digest('hex');};
const result={version:'V32.74',date:new Date().toISOString(),errors:[],missing:[],external:[],tests:[],actualAudioListeningPerformed:false};
const records=JSON.parse(await readFile(dest+'/文件清单.json','utf8'));
for(const r of records){const f=path.resolve(dest,r.path);assert(f.startsWith(path.resolve(dest)+path.sep));assert.equal((await lstat(f)).size,r.bytes,r.path);assert.equal(await hash(f),r.sha256.toLowerCase(),r.path);}
result.manifestFilesChecked=records.length;result.tests.push('All copied file sizes and SHA256 match manifest');
assert.equal(await hash(root+'/当前作品集_V32.65/保存结果.json'),saved.previousArchiveSha256);
const local=JSON.parse(await readFile(dest+'/项目/.verify/v32-74-checks.json','utf8'));
for(const c of local.checks){assert(c.passed);assert.equal(await hash(dest+'/项目/'+c.file),c.evidenceSha256,c.file);}
for(const [f,h] of Object.entries(local.sourceHashes))assert.equal(await hash(dest+'/项目/'+f),h,f);
assert.equal(await hash(root+'/当前作品集_V32.73/保存结果.json'),saved.previousV73ArchiveSha256);
assert.equal(await hash(root+'/当前作品集_V32.72/保存结果.json'),saved.previousV72ArchiveSha256);
assert.equal(await hash(root+'/当前作品集_V32.70/保存结果.json'),saved.previousV70ArchiveSha256);assert.equal(await hash(root+'/当前作品集_V32.71/保存结果.json'),saved.previousV71ArchiveSha256);result.tests.push('All current local evidence and source hashes match; frozen V70 and V71 unchanged');
const code=`import runpy\nx=runpy.run_path(${JSON.stringify(dest+'/项目/serve-preview.py')})\ns=x['ThreadingHTTPServer'](('127.0.0.1',8032),x['PreviewHandler'])\nprint('PACKAGE_READY',flush=True)\ns.serve_forever()`;
const server=spawn('C:/Users/HP/AppData/Local/Programs/Python/Python313/python.exe',['-c',code],{windowsHide:true,stdio:['ignore','pipe','pipe']});
let browser;
try{
 await new Promise((resolve,reject)=>{let stderr='';const t=setTimeout(()=>reject(Error('Package server timed out '+stderr)),10000);server.stdout.on('data',d=>{if(d.toString().includes('PACKAGE_READY')){clearTimeout(t);resolve();}});server.stderr.on('data',d=>stderr+=d);server.on('exit',c=>{clearTimeout(t);reject(Error('Package server exited '+c+' '+stderr));});});
 const {chromium}=createRequire(dest+'/项目/node_modules/playwright/package.json')('playwright');
 browser=await chromium.launch({headless:true,args:['--enable-gpu','--use-angle=d3d11']});const page=await browser.newPage({viewport:{width:1920,height:960}});
 page.on('pageerror',e=>result.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)result.missing.push(r.url());});
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(/^https?:/.test(u.protocol)&&u.hostname!=='localhost'){result.external.push(u.href);return r.abort();}return r.continue();});
 await page.addInitScript(()=>{window.packageOpening={};window.addEventListener('v31:opening-started',()=>window.packageOpening.start=performance.now());window.addEventListener('v31:opening-complete',()=>{const v=document.querySelector('.prelude-opening-video'),q=v?.getVideoPlaybackQuality();window.packageOpening.end=performance.now();window.packageOpening.frames=q?.totalVideoFrames;window.packageOpening.dropped=q?.droppedVideoFrames;window.packageOpening.homeReady=window.homeClockState?.ready===true;window.packageOpening.homeLoad=window.homeClockState?.loadMilliseconds;});});
 await page.goto('http://localhost:8032/v31.html?v=32.74',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('.prelude-opening-video')?.currentTime>3,null,{timeout:60000});
 result.openingProgress=await page.evaluate(()=>({counter:document.querySelector('[data-opening-counter]').textContent,clock:document.querySelector('[data-opening-time]').textContent}));assert(result.openingProgress.counter.endsWith('%'));assert(!/20|\d\.\d/.test(result.openingProgress.clock));
 console.log('Independent package: opening playing');
 await page.waitForFunction(()=>window.homeClockState?.ready&&window.homeArchitectureState?.started,null,{timeout:180000});
 await page.waitForFunction(()=>window.packageOpening.end);result.opening=await page.evaluate(()=>window.packageOpening);assert(result.opening.homeReady);assert.equal(result.opening.frames,600);assert(result.opening.dropped/result.opening.frames<.03);assert((result.opening.end-result.opening.start)/1000<22);
 result.home=await page.evaluate(()=>({elapsed:window.homeClockState.elapsed,interactions:window.homeClockState.interactions,ready:window.homeClockState.ready}));assert(result.home.ready);assert(result.home.elapsed<6,'No interaction needed to start the home intro');
 await page.waitForFunction(()=>window.homeClockState.cameraLocked,null,{timeout:120000});
 assert.equal(await page.locator('.courtyard-place').count(),5);
 await page.locator('.courtyard-place').nth(2).focus();assert(await page.locator('.courtyard-card').isVisible());await page.keyboard.press('Escape');await page.waitForTimeout(250);assert(await page.locator('.courtyard-card').isHidden());
 result.tests.push('Complete opening then automatic six-shot home intro and five-place navigation');console.log('Independent package: home complete, checking clicked mythology');
 await page.evaluate(()=>window.__v31Lenis.scrollTo(document.getElementById('odysseyIntroduction'),{immediate:true,force:true}));await page.waitForTimeout(400);
 assert(!await page.evaluate(()=>!!window.odysseyState));assert(await page.locator('#odyssey').isHidden());await page.locator('.odyssey-painting-point').click();
 await page.waitForFunction(()=>window.odysseyState?.renderFrames>5,null,{timeout:180000});
 result.mythology=await page.evaluate(()=>({flight:window.odysseyState.flightDuration,boats:window.odysseyState.boatLengths,eye:window.odysseyState.giantEye,holds:window.odysseyState.holdDepths(),birds:window.odysseyState.birds}));assert.equal(result.mythology.flight,64);assert.equal(result.mythology.boats.length,4);assert.equal(result.mythology.eye.eyeCount,1);assert.equal(result.mythology.eye.continuousBody,true);assert.equal(result.mythology.eye.nativeBlender,true);assert.equal(result.mythology.eye.completeGarment,true);assert(result.mythology.holds.every(d=>d>.7));assert.equal(result.mythology.birds,11);
 await page.keyboard.press('Escape');await page.waitForTimeout(350);assert(await page.locator('#odyssey').isHidden());result.tests.push('Painting click opens 64s scene with four boats and connected giant; Escape returns');
 await page.evaluate(()=>window.__v31Lenis.scrollTo(document.getElementById('lifePurpose'),{immediate:true,force:true}));await page.waitForFunction(()=>window.lifePurposeState?.ready,null,{timeout:30000});
 await page.evaluate(()=>document.getElementById('lifePurposeVideo').play());
 await page.waitForFunction(()=>document.getElementById('lifePurposeVideo').readyState>=1,null,{timeout:30000});
 await page.evaluate(()=>{const v=document.getElementById('lifePurposeVideo');v.pause();v.currentTime=38.2;});await page.waitForFunction(()=>!document.getElementById('lifePurposeVideo').seeking&&document.getElementById('lifePurposeVideo').readyState>=2);
 result.film=await page.evaluate(()=>({duration:document.getElementById('lifePurposeVideo').duration,images:document.querySelectorAll('.life-process-grid img').length,last:document.querySelector('main > section:last-child').id}));assert.equal(result.film.duration,50);assert.equal(result.film.images,5);assert.equal(result.film.last,'portfolioEpilogue');assert.equal(await page.locator('.life-process-grid figure:visible').count(),5);assert.equal(await page.locator('[data-life-process-next]').count(),0);
 await page.locator('[data-life-music]').click();await page.waitForFunction(()=>!window.lifePurposeState.withMusic&&document.getElementById('lifePurposeVideo').readyState>=1);assert.equal(await page.evaluate(()=>document.getElementById('lifePurposeVideo').duration),50);
 const deck=page.locator('.life-process-grid');await page.evaluate(()=>window.__v31Lenis.scrollTo(document.querySelector('.life-making-workshop'),{immediate:true,force:true}));await page.waitForTimeout(350);await deck.click();await page.waitForTimeout(1000);assert.equal(await deck.getAttribute('aria-expanded'),'true');await deck.click();await page.waitForTimeout(1000);assert.equal(await deck.getAttribute('aria-expanded'),'false');await page.evaluate(()=>window.__v31Lenis.scrollTo(document.getElementById('portfolioEpilogue'),{immediate:true,force:true}));await page.waitForTimeout(350);assert.equal(await page.locator('.epilogue-body p').count(),3);result.tests.push('Retained 50s film/audio; five cards expand and retract; new final closing section');
assert.equal(await page.locator('.is-method').count(),0);assert.equal(await page.locator('.image-atlas img').count(),14);
assert.equal(await page.locator('.research-portal').count(),2);result.tests.push('Compact 14-image index and two separate reading/learning portals');
 for(const r of local.httpRanges){const response=await fetch('http://localhost:8032/'+r.file,{headers:{Range:'bytes=0-1023'}});assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),r.contentRange);assert.equal(await hash(dest+'/项目/'+r.file),r.sha256);}
 result.tests.push('Current encoded films serve HTTP206 and match verified production hashes');
 await page.evaluate(()=>window.__v31Lenis.scrollTo(document.getElementById('lifePurpose'),{immediate:true,force:true}));await page.waitForTimeout(300);
 if(finalize)await page.screenshot({path:dest+'/效果截图/封存包独立运行.png'});
await page.goto('http://localhost:8032/reading.html');await page.waitForFunction(()=>window.readingBookState?.loading===false);assert.equal(await page.locator('#pageThumbnails button').count(),26);await page.locator('#openBook').click();await page.waitForTimeout(700);await page.locator('#nextPage').click();await page.waitForFunction(()=>window.readingBookState.turns===1);await page.locator('#zoomPage').click();await page.waitForFunction(()=>document.getElementById('fullPageImage').complete);await page.locator('#readerClose').click();await page.goto('http://localhost:8032/learning.html');assert.equal(await page.title(),'学习 · 脑海宇宙');result.tests.push('Independent 26-page 3D book, curved page turn, full-page reader and white learning page');
 assert.equal(result.errors.length,0);assert.equal(result.external.length,0);assert.equal(result.missing.length,0);assert.equal(await hash(root+'/当前作品集_V32.65/保存结果.json'),saved.previousArchiveSha256);result.passed=true;
}catch(e){result.passed=false;result.failure=e.stack;process.exitCode=1;}finally{if(browser)await browser.close();server.kill();await new Promise(resolve=>{if(server.exitCode!==null||server.signalCode!==null)resolve();else server.once('exit',resolve);});}
if(finalize){
 await writeFile(dest+'/当前包运行检查.json',JSON.stringify(result,null,2));
 if(result.passed){
  const progressFile=path.join(saved.source,'.verify/v32-74/work-state.json');const progress=JSON.parse(await readFile(progressFile,'utf8'));Object.assign(progress,{completeLocal:true,eArchiveUpdated:true,independentPackageRunPassed:true,next:'V32.74 complete; await user feedback'});for(const f of [progressFile,dest+'/项目/.verify/v32-74/work-state.json'])await writeFile(f,JSON.stringify(progress,null,2));
  local.eArchiveUpdated=true;local.eArchivePackage=dest;local.eArchiveIndependentRunPassed=true;local.limitations=local.limitations.map(s=>s.startsWith('E V32.65 archive')?'E V32.65 remains frozen; V32.74 is independently verified in a new E package.':s);
  for(const f of [path.join(saved.source,'.verify/v32-74-checks.json'),dest+'/项目/.verify/v32-74-checks.json',dest+'/当前检查结果/v32-74-checks.json'])await writeFile(f,JSON.stringify(local,null,2));
  await copyFile(dest+'/当前包运行检查.json',path.join(saved.source,'.verify/v32-74-archive-results.json'));
  const next=[];async function walk(dir,rel=''){for(const e of await readdir(dir)){const r=rel?rel+'/'+e:e;if(r==='文件清单.json'||r==='保存结果.json')continue;const f=path.join(dir,e),s=await lstat(f);if(s.isDirectory())await walk(f,r);else next.push({path:r,bytes:s.size,sha256:await hash(f)});}}
  await walk(dest);await writeFile(dest+'/文件清单.json',JSON.stringify(next,null,2));
  for(const r of next)assert.equal(await hash(dest+'/'+r.path),r.sha256,r.path);
  const complete={...saved,complete:true,currentPackageRunPassed:true,saved:new Date().toISOString(),files:next.length,bytes:next.reduce((n,r)=>n+r.bytes,0),checks:local.checks.length,independentPackageChecks:result.tests.length,manifestSha256:await hash(dest+'/文件清单.json'),scope:'Current V32.74: black continuous evolution opening; native Blender MCP V20/vault shadows and moving forest light; horizontal envelope with falling rain; aligned giant and vegetated island/continental fog; square stacked cards; modest warm closing; separate 26-page 3D reading book and white learning page. Website, source, current media/assets, native files/proofs, checks and build caches. Old archives frozen.',actualAudioListeningPerformed:false};
  await writeFile(dest+'/保存结果.json',JSON.stringify(complete,null,2));
  const entry=await readFile(dest+'/接续说明.md','utf8')+'\n\n当前完整E接续包：'+dest+'。本包独立8032运行及逐文件SHA校验通过；保存结果complete/currentPackageRunPassed双true。旧包冻结，直接运行项目/serve-preview.py看效果，无需重渲染。\n';
  await writeFile(root+'/先读这里.md',entry);await writeFile(root+'/校验当前接续包_V32.74.mjs',"// Read-only file verification; does not alter the frozen package.\nimport {createReadStream} from 'node:fs';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';\nconst root=new URL('./当前作品集_V32.74/',import.meta.url),hash=async u=>{const h=createHash('sha256');for await(const b of createReadStream(u))h.update(b);return h.digest('hex');};\nconst saved=JSON.parse(await readFile(new URL('保存结果.json',root),'utf8'));if(!saved.complete||!saved.currentPackageRunPassed)throw Error('Incomplete archive');if(await hash(new URL('文件清单.json',root))!==saved.manifestSha256)throw Error('Manifest mismatch');const files=JSON.parse(await readFile(new URL('文件清单.json',root),'utf8'));for(const f of files)if(await hash(new URL(f.path,root))!==f.sha256)throw Error('Mismatch '+f.path);console.log(JSON.stringify({version:saved.version,files:files.length,passed:true}));\n");
  await writeFile(root+'/校验当前接续包.mjs',"// Current archive verification; old packages stay frozen.\nimport './校验当前接续包_V32.74.mjs';\n");
  console.log(JSON.stringify({complete:true,currentPackageRunPassed:true,files:complete.files,bytes:complete.bytes,package:dest}));
 }
}
console.log(JSON.stringify({passed:result.passed,tests:result.tests,errors:result.errors,missing:result.missing,failure:result.failure}));
