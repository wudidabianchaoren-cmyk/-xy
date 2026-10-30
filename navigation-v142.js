(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const priorMyth=(()=>{try{return JSON.parse(sessionStorage.getItem('odyssey-process-return')||'null')}catch{return null}})();if(location.pathname.endsWith('/mythology-process.html')&&priorMyth?.href){sessionStorage.setItem('portfolio-last-surface',JSON.stringify({href:priorMyth.href,scroll:0,main:false}));}
 const mainDocument=!!document.getElementById('countdownPrelude')||!!(document.getElementById('voyage')&&document.getElementById('hobbyPage'));
 const state=window.portfolioNavigation={version:142,transitions:0,returns:0,bottomReady:false,returning:false};
 const curtain=document.createElement('div');curtain.className='portfolio-curtain-v138';curtain.setAttribute('aria-hidden','true');document.body.append(curtain);
 let busy=false,hold=0,bottomSince=0,lastSurface=null,bottomReached=false,ignoreWheelUntil=performance.now()+1200;
 const animate=(frames,duration)=>curtain.animate(frames,{duration:reduced?1:duration,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished.catch(()=>{});
 const cover=()=>animate([{opacity:0,clipPath:'inset(49.9% 0 49.9% 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],220);
 const reveal=()=>animate([{opacity:1,clipPath:'inset(0 0 0 0)'},{opacity:0,clipPath:'inset(49.9% 0 49.9% 0)'}],380);
 function remember(){
  const main=mainDocument;
  const context={href:location.href,scroll:scrollY,main,at:Date.now()};
  try{sessionStorage.setItem('portfolio-last-surface',JSON.stringify(context));if(main)sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}
 }
 window.addEventListener('pagehide',remember);
 let transitionTail=Promise.resolve();
 window.portfolioTransition=(action,options={})=>{const run=async()=>{busy=true;state.transitions++;curtain.style.pointerEvents='auto';await cover();try{await action();}finally{if(!options.hold){await reveal();busy=false;curtain.style.pointerEvents='none';}}return true;};const next=transitionTail.then(run,run);transitionTail=next.catch(()=>{});return next;};
 function settleHome(reason){if(!mainDocument)return;const intro=window.homeDesignedIntroState;state.surfaceRecovery={reason,introActive:!!intro?.active,introPreparing:!!intro?.preparing,introFinished:!!intro?.finished,rootHidden:document.querySelector('.home-discoveries')?.hidden,classes:document.body.className};if(intro&&!intro.finished)intro.end('leaving-surface');window.dispatchEvent(new Event('portfolio:surface-return'));}
 for(const event of ['v31:works-orbit-open','v31:archive-open','v91:home-creation-open'])window.addEventListener(event,()=>settleHome(event));
 for(const event of ['v31:works-orbit-close','v31:archive-close'])window.addEventListener(event,()=>settleHome(event));
 const versioned=href=>{const u=new URL(href,location.href);if(u.origin===location.origin&&/\/(v31|reading|learning|yangjian|mythology|after-journey|rural-return|mid-autumn|physical-universe|humid-southeast-asia)\.html$/.test(u.pathname))u.searchParams.set('v','32.142');return u.href;};
 const portalChild=window.parent!==window&&new URLSearchParams(location.search).has('portal');
 let portal=null,portalFrame=null,portalStack=[],portalScroll=0,portalFocus=null;
 const portalURL=href=>{const u=new URL(versioned(href));u.searchParams.set('portal','1');return u.href;};
 function resumeSurface(){ignoreWheelUntil=performance.now()+1500;hold=0;bottomSince=0;bottomReached=false;state.bottomReady=false;window.dispatchEvent(new Event('portfolio:child-return'));window.dispatchEvent(new Event('portfolio:surface-return'));window.dispatchEvent(new Event('resize'));}
 async function openPortal(href){settleHome('portal-open');
  if(new URL(href,location.href).pathname.endsWith('/v31.html'))return closePortal();
  const target=portalURL(href);if(portalStack.at(-1)?.href===target)return;
  if(!portal){remember();portalScroll=scrollY;portalFocus=document.activeElement;portal=document.createElement('section');portal.className='portfolio-child-portal';portal.setAttribute('role','dialog');portal.setAttribute('aria-label','作品内容');document.body.append(portal);document.body.classList.add('portfolio-portal-open');window.portfolioAudioFocus?.claim('portal',null);}
  if(portalFrame){portalFrame.hidden=true;portalFrame.inert=true;portalFrame.setAttribute('aria-hidden','true');portalFrame.contentWindow?.postMessage({type:'portfolio:surface-suspend'},location.origin);}
  const frame=document.createElement('iframe');frame.title='作品内容';frame.allow='autoplay; fullscreen';frame.dataset.portalDepth=String(portalStack.length+1);portal.append(frame);portalFrame=frame;portalStack.push({href:target,frame});state.portalDepth=portalStack.length;
  await new Promise(resolve=>{const timer=setTimeout(resolve,1400);frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});frame.src=target;});
 }
 async function closePortal(){if(!portal)return;for(const entry of portalStack)entry.frame.src='about:blank';portal.remove();portal=null;portalFrame=null;portalStack=[];state.portalDepth=0;window.portfolioAudioFocus?.release('portal');document.body.classList.remove('portfolio-portal-open');scrollTo(0,portalScroll);portalFocus?.focus?.({preventScroll:true});resumeSurface();}
 async function popPortal(){if(portalStack.length<=1)return closePortal();const old=portalStack.pop();old.frame.src='about:blank';old.frame.remove();const prior=portalStack.at(-1);portalFrame=prior.frame;portalFrame.hidden=false;portalFrame.inert=false;portalFrame.removeAttribute('aria-hidden');state.portalDepth=portalStack.length;portalFrame.contentWindow?.postMessage({type:'portfolio:child-return'},location.origin);}
 window.addEventListener('message',event=>{if(event.origin!==location.origin)return;
  if(event.data?.type==='portfolio:surface-suspend'&&event.source===parent){document.body.classList.add('portfolio-surface-suspended');window.dispatchEvent(new Event('portfolio:surface-suspend'));return;}
  if(event.data?.type==='portfolio:child-return'&&event.source===parent){document.body.classList.remove('portfolio-surface-suspended');resumeSurface();return;}
  if(event.source!==portalFrame?.contentWindow)return;const source=event.source;
  if(event.data?.type==='portfolio:portal-navigate')void window.portfolioTransition(()=>source===portalFrame?.contentWindow?openPortal(event.data.href):undefined);
  if(event.data?.type==='portfolio:portal-return')void window.portfolioTransition(()=>source===portalFrame?.contentWindow?popPortal():undefined);
 });
 window.portfolioNavigate=href=>{if(portalChild){parent.postMessage({type:'portfolio:portal-navigate',href:versioned(href)},location.origin);return true;}const u=new URL(href,location.href);if(u.origin===location.origin&&/\/(reading|learning|yangjian|mythology|mythology-process)\.html$/.test(u.pathname)){void window.portfolioTransition(()=>openPortal(u.href));return true;}remember();void window.portfolioTransition(()=>location.assign(versioned(href)),{hold:true});return true;};
 window.addEventListener('keydown',event=>{if(event.key==='Escape'&&(portal||portalChild)&&!document.querySelector('dialog[open]')){event.preventDefault();event.stopImmediatePropagation();if(portal)void window.portfolioTransition(popPortal);else window.portfolioReturn();}},{capture:true});
 window.portfolioReturn=()=>{
  if(state.returning||busy)return;if(portal){void window.portfolioTransition(popPortal);return;}if(window.readingBookState?.opened){ignoreWheelUntil=performance.now()+1600;hold=0;void window.portfolioTransition(()=>window.readingBookState.closeBook());return;}state.returning=true;state.returns++;
  const local=portalChild||window.parent!==window||document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open');
  void window.portfolioTransition(()=>{
   if(portalChild){if(location.pathname.endsWith('/mythology-process.html')&&priorMyth)sessionStorage.setItem('odyssey-process-return',JSON.stringify({...priorMyth,returning:true}));window.parent.postMessage({type:'portfolio:portal-return'},location.origin);return;}if(window.parent!==window){window.parent.postMessage({type:'brain-universe:work-return'},location.origin);return;}
   const open=document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open');
   if(open){open.querySelector('.standalone-close')?.click();return;}
   let prior;try{prior=JSON.parse(sessionStorage.getItem('portfolio-last-surface')||'null');}catch{}
   if(location.pathname.endsWith('/mythology-process.html')){location.assign(versioned(priorMyth?.href||'./mythology.html'));return;}
   if(location.pathname.endsWith('/mythology.html')){location.assign(versioned('./reading.html'));return;}
   let href=prior?.href;
   if(!href||new URL(href,location.href).pathname===location.pathname)href=document.querySelector('[data-project-return],.reading-header a,.learning-header a')?.href;
   if(!href&&location.pathname.endsWith('/mythology.html'))href='./reading.html?v=32.142';
   location.assign(versioned(href||'./v31.html?return=1&v=32.142'));
  },{hold:!local}).finally(()=>{state.returning=false;});
 };
 // Conventional page links get the same short closing cue. Existing orbit/book handlers keep ownership.
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const back=event.target.closest('[data-project-return],[data-odyssey-close],.reading-header a,.learning-header a,[data-yj-return]');
  if(back){event.preventDefault();event.stopImmediatePropagation();window.portfolioReturn();return;}
  const link=event.target.closest('a[href]');if(!link||link.download||link.target==='_blank'||link.closest('[data-open-standalone]'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.pathname===location.pathname)return;
  event.preventDefault();event.stopImmediatePropagation();window.portfolioNavigate(url.href);
 },true);
 function surface(){
  if(document.querySelector('dialog[open]')||document.body.classList.contains('hobby-modal-open'))return null;
  return document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open')||(!mainDocument?document.scrollingElement:null);
 }
 function observeEnd(){
  const node=surface();if(node!==lastSurface){lastSurface=node;bottomReached=false;bottomSince=0;}
  if(!node)return;
  const max=node.scrollHeight-node.clientHeight,shortPersonal=node.id==='personalPage'&&max<=64,atEnd=(max>64&&node.scrollTop>=max-4)||shortPersonal;
  if(atEnd&&!bottomReached){bottomSince=performance.now();bottomReached=true;}
  if(!atEnd){bottomReached=false;bottomSince=0;hold=0;}
  state.bottomReady=atEnd&&performance.now()-bottomSince>650;
 }
 document.addEventListener('scroll',observeEnd,{capture:true,passive:true});
 window.addEventListener('wheel',event=>{
  if(performance.now()<ignoreWheelUntil)return;observeEnd();if(event.deltaY<=0){hold=0;return;}
  // Let the final view be read. A further downward gesture returns without scrolling back to the top.
  const book=window.readingBookState,lastBook=book?.opened&&book.currentPage>=book.pageCount-1;
  if(book?.opened&&!lastBook)return;if(!state.bottomReady&&!lastBook)return;
  if(event.target.closest('input,textarea,select,#pageThumbnails')||document.querySelector('dialog[open]'))return;
  hold+=Math.min(180,event.deltaY);if(hold>=70){event.preventDefault();event.stopImmediatePropagation();hold=0;window.portfolioReturn();}
 },{capture:true,passive:false});
 window.addEventListener('portfolio:child-return',()=>{ignoreWheelUntil=performance.now()+1600;hold=0;bottomReached=false;bottomSince=0;state.bottomReady=false;});
 window.addEventListener('pageshow',()=>{ignoreWheelUntil=performance.now()+1200;state.returning=false;busy=false;curtain.style.pointerEvents='none';void reveal();});
 if(!mainDocument)void reveal();
 // One controller for the actual scrolling surface, including independent child documents.
 let bar=document.getElementById('portfolioProgress');if(!bar){bar=document.createElement('aside');bar.id='portfolioProgress';bar.className='portfolio-progress';bar.innerHTML='<span>进度</span><i><b id="portfolioProgressBar"></b></i><span id="portfolioProgressPercent">00%</span>';document.body.append(bar);}
 bar.tabIndex=0;bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','阅读进度');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');
 const fill=bar.querySelector('b'),label=bar.querySelector('span'),percent=bar.querySelector('span:last-child');let scheduled=false;
 function sync(){scheduled=false;const node=document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open')||document.scrollingElement;let max=node.scrollHeight-node.clientHeight,value=max>0?node.scrollTop/max:0;let title='进度';
  if(window.readingBookState?.opened){value=Math.min(1,(readingBookState.currentPage-1)/25);max=25;title='页码';}
  if(window.odysseyState?.ready){value=odysseyState.zoomProgress||0;max=1;title='视野';}
  const darkWorld=[...document.querySelectorAll('#voyage,.archive-directory,.project-film,.project-gallery,#odysseyScene')].some(n=>{const r=n.getBoundingClientRect();return r.top<innerHeight*.5&&r.bottom>innerHeight*.5;});bar.dataset.tone=darkWorld||document.body.dataset.tone==='dark'||document.getElementById('bookStage')?'dark':'light';
  bar.hidden=max<2&&max!==1;label.textContent=title;bar.dataset.surface=node.id||'document';value=Math.min(1,Math.max(0,value));fill.style.transform=`scaleY(${value})`;percent.textContent=String(Math.round(value*100)).padStart(2,'0')+'%';bar.setAttribute('aria-valuenow',String(Math.round(value*100)));bar.setAttribute('aria-label',title+' '+Math.round(value*100)+'%');
 }
 const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(sync);}};
 document.addEventListener('scroll',request,{capture:true,passive:true});addEventListener('resize',request,{passive:true});addEventListener('portfolio:progress',request);addEventListener('v31:archive-open',request);addEventListener('v31:archive-close',request);document.addEventListener('click',()=>{request();setTimeout(request,1300);});new ResizeObserver(request).observe(document.body);new MutationObserver(request).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
})();
