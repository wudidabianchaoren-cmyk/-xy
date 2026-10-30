(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const state=window.portfolioNavigation={version:137,transitions:0,returns:0,bottomReady:false,returning:false};
 const curtain=document.createElement('div');curtain.className='portfolio-curtain-v137';curtain.setAttribute('aria-hidden','true');document.body.append(curtain);
 let busy=false,hold=0,bottomSince=0,lastSurface=null,bottomReached=false;
 const animate=(frames,duration)=>curtain.animate(frames,{duration:reduced?1:duration,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}).finished.catch(()=>{});
 const cover=()=>animate([{opacity:0,clipPath:'inset(49.9% 0 49.9% 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}],180);
 const reveal=()=>animate([{opacity:1,clipPath:'inset(0 0 0 0)'},{opacity:0,clipPath:'inset(49.9% 0 49.9% 0)'}],300);
 function remember(){
  const main=!!document.getElementById('countdownPrelude');
  const context={href:location.href,scroll:scrollY,main,at:Date.now()};
  try{sessionStorage.setItem('portfolio-last-surface',JSON.stringify(context));if(main)sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}
 }
 window.addEventListener('pagehide',remember);
 window.portfolioTransition=async action=>{if(busy)return false;busy=true;state.transitions++;curtain.style.pointerEvents='auto';await cover();try{await action();}finally{await reveal();busy=false;curtain.style.pointerEvents='none';}return true;};
 const versioned=href=>{const u=new URL(href,location.href);if(u.origin===location.origin&&/\/(v31|reading|learning|yangjian|mythology|after-journey|rural-return|mid-autumn|physical-universe|humid-southeast-asia)\.html$/.test(u.pathname))u.searchParams.set('v','32.137');return u.href;};
 window.portfolioNavigate=href=>{remember();void window.portfolioTransition(()=>location.assign(versioned(href)));return true;};
 window.portfolioReturn=()=>{
  if(state.returning||busy)return;state.returning=true;state.returns++;
  void window.portfolioTransition(()=>{
   if(window.parent!==window){window.parent.postMessage({type:'brain-universe:work-return'},location.origin);return;}
   const open=document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open');
   if(open){open.querySelector('.standalone-close')?.click();return;}
   let prior;try{prior=JSON.parse(sessionStorage.getItem('portfolio-last-surface')||'null');}catch{}
   const ref=document.referrer&&new URL(document.referrer);
   if(ref?.origin===location.origin&&history.length>1){history.back();return;}
   let href=prior?.href;
   if(!href||new URL(href,location.href).pathname===location.pathname)href=document.querySelector('[data-project-return],.reading-header a,.learning-header a')?.href;
   if(!href&&location.pathname.endsWith('/mythology.html'))href='./reading.html?v=32.137';
   location.assign(versioned(href||'./v31.html?return=1&v=32.137'));
  }).finally(()=>{state.returning=false;});
 };
 // Conventional page links get the same short closing cue. Existing orbit/book handlers keep ownership.
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const back=event.target.closest('[data-project-return],[data-odyssey-close],.reading-header a,.learning-header a');
  if(back){event.preventDefault();event.stopImmediatePropagation();window.portfolioReturn();return;}
  const link=event.target.closest('a[href]');if(!link||link.download||link.target==='_blank'||link.closest('[data-open-standalone],[data-shelf-book]')||link.hasAttribute('data-shelf-book'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.pathname===location.pathname)return;
  event.preventDefault();event.stopImmediatePropagation();window.portfolioNavigate(url.href);
 },true);
 function surface(){
  if(document.querySelector('dialog[open]')||document.body.classList.contains('hobby-modal-open'))return null;
  return document.querySelector('.hobby-page.is-standalone-open,.personal-page.is-standalone-open')||(!document.getElementById('countdownPrelude')?document.scrollingElement:null);
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
  observeEnd();if(event.deltaY<=0){hold=0;return;}
  // Let the final view be read. A further downward gesture returns without scrolling back to the top.
  const book=window.readingBookState,lastBook=book?.opened&&book.currentPage>=book.pageCount-1;
  if(!state.bottomReady&&!lastBook)return;
  if(event.target.closest('input,textarea,select')||document.querySelector('dialog[open]'))return;
  hold+=Math.min(180,event.deltaY);if(hold>=70){event.preventDefault();hold=0;window.portfolioReturn();}
 },{capture:true,passive:false});
 window.addEventListener('pageshow',()=>{state.returning=false;busy=false;curtain.style.pointerEvents='none';void reveal();});
 if(!document.getElementById('countdownPrelude'))void reveal();
 const bar=document.getElementById('portfolioProgress');if(bar){bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');const label=bar.querySelector('span');if(label)label.textContent='进度';const sync=()=>bar.setAttribute('aria-valuenow',String(Math.round(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100)));addEventListener('scroll',sync,{passive:true});sync();}
})();
