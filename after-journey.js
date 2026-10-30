(() => {
  'use strict';
  const gallery=document.getElementById('gallery'),stage=document.getElementById('glassStage');
  if(!gallery||!stage)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const project=document.body.dataset.project||'after-journey',rural=project==='rural-return';
  const manifestURL=new URL(document.body.dataset.galleryManifest||'./assets/works/'+project+'/manifest.json',location.href);
  let selected=rural?[0,1,2,3]:[4,8,10,11],groups=[[0,1],[2,3]];
  const state=window.afterJourneyState={ready:false,index:0,frames:4,views:2,sourceIndices:selected,visible:false,renders:0,textureCount:4,renderer:'CSS seamless folded gallery',animating:false,direction:0,duration:720};
  const room=document.createElement('div');room.className='glass-room';room.setAttribute('aria-hidden','true');
  const artwork='<div class="glass-artwork"><div class="glass-pair glass-outgoing"><img alt=""><img alt=""></div><div class="glass-pair glass-incoming"><img alt=""><img alt=""></div></div>';
  room.innerHTML=`<div class="glass-frame"><div class="glass-plane glass-ceiling">${artwork}</div><div class="glass-wall">${artwork}</div><div class="glass-plane glass-floor">${artwork}</div></div><div class="glass-reflection reflection-top">${artwork}</div><div class="glass-reflection reflection-bottom">${artwork}</div>`;
  stage.prepend(room);
  new ResizeObserver(()=>room.style.setProperty('--room-perspective',stage.clientHeight*1.666+'px')).observe(stage);
  const outgoing=[...room.querySelectorAll('.glass-outgoing')],incoming=[...room.querySelectorAll('.glass-incoming')];
  let manifest,frames,index=0,releaseUntil=0,generation=0;const animations=new Set();
  let autoTimer=0,autoEnabled=!rural&&!reduced&&document.body.dataset.galleryAutoplay!=='false',autoVisible=false;
  Object.assign(state,{autoEnabled,autoAdvances:0,autoDwell:4800,autoDuration:2200});
  function scheduleAuto(){
    clearTimeout(autoTimer);state.autoEnabled=autoEnabled;
    if(!autoEnabled||!autoVisible||document.hidden||!state.ready||state.animating||index>=groups.length-1)return;
    autoTimer=setTimeout(()=>{if(autoEnabled&&autoVisible&&!document.hidden)void step(1,true);},state.autoDwell);
  }
  function pauseAuto(){autoEnabled=false;clearTimeout(autoTimer);state.autoEnabled=false;}
  function fill(elements,group){elements.forEach(element=>{element.dataset.group=String(group);[...element.children].forEach((image,i)=>{const frame=manifest.frames[selected[groups[group][i]]];image.src=frames[groups[group][i]].src;image.style.objectPosition=frame.position||'50% 50%';image.style.objectFit=frame.fit||'cover';});});}
  async function step(direction,automatic=false){
    if(!state.ready||state.animating)return;
    clearTimeout(autoTimer);
    const next=index+direction;
    if(next<0||next>=groups.length){releaseUntil=performance.now()+850;const target=direction>0?document.getElementById('about'):document.getElementById('film');if(target)window.scrollTo({top:target.offsetTop,behavior:reduced?'instant':'smooth'});return;}
    const token=++generation;state.animating=true;state.direction=direction;state.renders++;fill(incoming,next);
    const duration=reduced?1:automatic?state.autoDuration:720,easing=automatic?'cubic-bezier(.45,0,.25,1)':'cubic-bezier(.22,1,.36,1)';
    const active=[...outgoing.map(element=>element.animate([{transform:'translateY(0)'},{transform:`translateY(${direction*100}%)`}],{duration,easing,fill:'forwards'})),...incoming.map(element=>element.animate([{transform:`translateY(${-direction*100}%)`},{transform:'translateY(0)'}],{duration,easing,fill:'forwards'}))];
    active.forEach(animation=>animations.add(animation));await Promise.all(active.map(animation=>animation.finished.catch(()=>{})));
    if(token!==generation)return;
    index=next;fill(outgoing,index);active.forEach(animation=>{animation.cancel();animations.delete(animation);});state.animating=false;state.renders++;state.index=index;if(automatic)state.autoAdvances++;scheduleAuto();
  }
  function aligned(){return Math.abs(scrollY-gallery.offsetTop)<12;}
  window.addEventListener('wheel',event=>{
    if(event.ctrlKey||!state.ready||performance.now()<releaseUntil)return;
    if(project==='home-creation'&&!aligned()){
      const distance=gallery.offsetTop-scrollY;
      if((event.deltaY>0&&distance>0&&distance<innerHeight*.75)||(event.deltaY<0&&distance<0&&distance>-innerHeight*.6)){
        event.preventDefault();pauseAuto();window.scrollTo({top:gallery.offsetTop,behavior:'instant'});return;
      }
      return;
    }
    if(!aligned())return;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);if(Math.abs(delta)<2)return;
    event.preventDefault();pauseAuto();if(!state.animating)void step(Math.sign(delta));
  },{passive:false});
  stage.addEventListener('pointerdown',pauseAuto);
  stage.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp'].includes(event.key)){event.preventDefault();pauseAuto();void step(event.key==='ArrowDown'||event.key==='PageDown'?1:-1);}else if(event.key===' '){event.preventDefault();autoEnabled=!autoEnabled;scheduleAuto();}});
  fetch(manifestURL).then(response=>{if(!response.ok)throw Error('Gallery manifest unavailable');return response.json();}).then(async data=>{
    manifest=data;
    if(data.views){selected=data.views.flat();groups=data.views.map((_,i)=>[i*2,i*2+1]);}
    else if(data.gallerySelection){selected=[...data.gallerySelection];groups=Array.from({length:selected.length/2},(_,i)=>[i*2,i*2+1]);}
    Object.assign(state,{frames:selected.length,views:groups.length,textureCount:new Set(selected).size,sourceIndices:selected});
    const cache=new Map();frames=await Promise.all(selected.map(i=>{const frame=data.frames[i],src=new URL(frame.image||frame.src,manifestURL).href;if(!cache.has(src)){const image=new Image();image.decoding='async';image.src=src;cache.set(src,image.decode().then(()=>image));}return cache.get(src);}));
    fill(outgoing,0);fill(incoming,Math.min(1,groups.length-1));state.ready=true;stage.classList.add('is-ready');document.getElementById('glassLoading')?.remove();state.renders++;scheduleAuto();
  }).catch(error=>{state.error=error.message;console.error(error);});
  document.addEventListener('visibilitychange',scheduleAuto);
  new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;autoVisible=entries[0].intersectionRatio>=.68;scheduleAuto();},{threshold:[0,.01,.68]}).observe(stage);
  window.addEventListener('pagehide',()=>{clearTimeout(autoTimer);generation++;animations.forEach(animation=>animation.cancel());animations.clear();state.animating=false;if(frames)fill(outgoing,index);});
  window.addEventListener('pageshow',scheduleAuto);
})();
