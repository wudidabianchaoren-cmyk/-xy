(() => {
  'use strict';
  let frame=null,veil=null,opener=null,token=0;
  const state=window.homeCreationState={active:false,opens:0,returns:0};
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function close(){
    if(!frame)return;
    ++token;frame.remove();frame=null;veil?.remove();veil=null;
    document.body.classList.remove('is-project-leaving','is-project-active');
    state.active=false;state.returns++;window.dispatchEvent(new Event('portfolio:surface-return'));
    try{const saved=JSON.parse(sessionStorage.getItem('brain-universe-work-return')||'null');if(saved?.kind==='home-creation'){saved.active=false;sessionStorage.setItem('brain-universe-work-return',JSON.stringify(saved));}}catch{}
    window.__v31Lenis?.start?.();opener?.focus?.({preventScroll:true});
  }
  function open(push=true){
    if(frame)return;
    const current=++token;opener=document.querySelector('[data-discovery="creation"]');state.active=true;state.opens++;
    const url=new URL(location.href);url.searchParams.set('v','32.141');url.searchParams.set('return','1');url.searchParams.delete('work');
    try{sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));sessionStorage.setItem('brain-universe-work-return',JSON.stringify({active:true,kind:'home-creation',scroll:scrollY,href:url.pathname+url.search+url.hash}));}catch{}
    window.__v31Lenis?.stop?.();document.body.classList.add('is-project-leaving');
    veil=document.createElement('div');veil.className='works-project-transition';veil.setAttribute('aria-hidden','true');veil.innerHTML='<i class="project-shutter top"></i><i class="project-shutter bottom"></i>';document.body.append(veil);
    frame=document.createElement('iframe');frame.id='homeCreationFrame';frame.className='work-project-frame';frame.title='中世纪西欧庭院构建全流程';frame.src='./home-creation.html?v=32.141&embedded=1';
    let loaded=false,closed=false;
    const reveal=()=>{if(current!==token||!frame||!loaded||!closed)return;document.body.classList.add('is-project-active');frame.classList.add('is-visible');const film=frame.contentDocument?.getElementById('projectFilm');if(film?.readyState)film.currentTime=0;frame.contentWindow?.postMessage({type:'brain-universe:project-visible'},location.origin);frame.focus();const cover=veil;cover.animate([{opacity:1},{opacity:0}],{duration:reduced?1:300,fill:'forwards'}).finished.then(()=>{cover.remove();if(veil===cover)veil=null;});};
    frame.addEventListener('load',()=>{loaded=true;reveal();},{once:true});document.body.append(frame);
    if(push)history.pushState({brainHomeCreation:true},'',new URL('./v31.html?v=32.152',location.href));
    setTimeout(()=>{closed=true;reveal();},reduced?100:820);
  }
  window.addEventListener('v91:home-creation-open',()=>open());
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===frame?.contentWindow&&event.data?.type==='brain-universe:work-return'){history.replaceState(null,'',new URL('./v31.html?v=32.152',location.href));close();}});
  window.addEventListener('popstate',event=>{if(event.state?.brainHomeCreation)open(false);else close();});
  window.addEventListener('pagehide',()=>{veil?.remove();});
})();
