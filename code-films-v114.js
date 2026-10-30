(() => {
 'use strict';
 const state=window.codeFilmsState={version:'32.114',galleries:{},films:[],returned:false};
 const videos=[...document.querySelectorAll('.project-film-video')];
 let disposed=false;
 const records=videos.map(video=>{
  const item={id:video.id,visible:false,playing:false,mutedFallback:false,loaded:false,userPaused:false};state.films.push(item);
  video.controls=false;video.playsInline=true;video.volume=.9;
  let pending=false;
  const load=()=>{if(item.loaded)return;video.src=video.dataset.src;item.loaded=true;video.load();};
  const play=async()=>{
   if(pending||disposed||document.hidden||!item.visible||item.userPaused||video.ended)return;
   load();pending=true;
   for(const other of videos)if(other!==video)other.pause();
   try{await video.play();}catch{
    if(item.visible&&!disposed&&!document.hidden){video.muted=true;item.mutedFallback=true;try{await video.play();}catch{}}
   }finally{pending=false;if(!item.visible||disposed||document.hidden)video.pause();}
  };
  video.addEventListener('play',()=>{item.playing=true;if(!item.visible||disposed||document.hidden)video.pause();});
  video.addEventListener('pause',()=>item.playing=false);
  video.addEventListener('click',()=>{
   if(video.muted&&item.mutedFallback){video.muted=false;item.mutedFallback=false;item.userPaused=false;void play();}
   else if(video.paused){item.userPaused=false;if(video.ended)video.currentTime=0;void play();}
   else{item.userPaused=true;video.pause();}
  });
  new IntersectionObserver(entries=>{
   item.visible=entries[0].intersectionRatio>=.55;
   if(item.visible)void play();else video.pause();
  },{threshold:[0,.55]}).observe(video.closest('.project-film'));
  return{item,video,play};
 });
 document.addEventListener('visibilitychange',()=>{records.forEach(r=>{if(document.hidden)r.video.pause();else void r.play();});});
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='brain-universe:project-visible')return;
  records.forEach(r=>void r.play());
 });
 document.querySelectorAll('[data-project-return]').forEach(link=>link.addEventListener('click',event=>{
  state.returned=true;disposed=true;videos.forEach(v=>v.pause());
  if(window.parent!==window){event.preventDefault();window.parent.postMessage({type:'brain-universe:work-return'},location.origin);return;}
  let context;try{context=JSON.parse(sessionStorage.getItem('brain-universe-work-return')||'null');}catch{}
  if(context?.active&&context.href){event.preventDefault();location.href=context.href;}
 }));
 window.addEventListener('pagehide',()=>{disposed=true;videos.forEach(v=>v.pause());});
 window.addEventListener('pageshow',()=>{disposed=false;records.forEach(r=>void r.play());});
function initializeGallery(gallery){
  const stage=gallery.querySelector('.glass-stage');
  const film=document.getElementById(gallery.dataset.before),about=document.getElementById(gallery.dataset.after);
  if(!gallery||!stage||!film||!about)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const state=window.codeFilmsState.galleries[gallery.id]={
    version:'32.114',ready:false,renderer:'CSS full-width natural-aspect synchronized glass',
    frames:0,views:0,index:0,row:0,visible:false,animating:false,direction:0,
    position:0,target:0,maximum:0,autoEnabled:!reduced,autoAdvances:0,
    autoDwell:3300,autoDuration:2600,manualResume:5500,renders:0,
    sourceIndices:[],entries:0,wheelEvents:0,manualChanges:0
  };
  if(gallery.id==='gallery')window.afterJourneyState=state;
  const url=new URL(gallery.dataset.glassManifest,location.href);
  const room=document.createElement('div');room.className='glass-room';room.setAttribute('aria-hidden','true');
  const artwork='<div class="glass-artwork"><div class="glass-track"></div></div>';
  room.innerHTML=`<div class="glass-frame"><div class="glass-plane glass-ceiling">${artwork}</div><div class="glass-wall">${artwork}</div><div class="glass-plane glass-floor">${artwork}</div></div><div class="glass-reflection reflection-top">${artwork}</div><div class="glass-reflection reflection-bottom">${artwork}</div>`;
  stage.prepend(room);
  const tracks=[...room.querySelectorAll('.glass-track')];
  let sequence=[],heights=[],anchors=[],last=0,raf=0,active=false,painted=null;
  let manualAt=-Infinity,nextAuto=Infinity,auto=null,arriving=false,departing=false,departureTarget=0;
  let lastWheel=-Infinity,edgeWheel=0,lastDirection=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const galleryTop=()=>gallery.offsetTop;
  const aligned=()=>Math.abs(scrollY-galleryTop())<14;
  function layout(){
    if(!sequence.length)return;
    const frame=room.querySelector('.glass-frame');
    const width=frame.clientWidth;
    // Phone: one complete frame plus context, rather than seven tiny frames at once.
    room.style.setProperty('--mobile-wall-height',Math.round(width*sequence[0].naturalHeight/sequence[0].naturalWidth*1.5)+'px');
    const height=frame.clientHeight;
    heights=sequence.map(image=>width*image.naturalHeight/image.naturalWidth);
    const total=heights.reduce((sum,value)=>sum+value,0);
    state.maximum=Math.max(0,total-height);
    let sum=0;anchors=[0];
    for(let i=0;i<heights.length;i++){sum+=heights[i];anchors.push(Math.min(sum,state.maximum));}
    anchors.push(state.maximum);anchors=[...new Set(anchors)];
    state.position=clamp(state.position,0,state.maximum);state.target=clamp(state.target,0,state.maximum);
    room.style.setProperty('--room-perspective',stage.clientHeight*1.666+'px');
    state.imageWidth=width;state.wallHeight=height;state.imageHeights=[...heights];
    draw(true);
  }
  function draw(force=false){
    const value=-state.position;
    state.animating=Math.abs(state.target-state.position)>.35||!!auto;
    if(!force&&painted===value)return;
    painted=value;
    tracks.forEach(track=>{track.style.transform=`translate3d(0,${value}px,0)`;});
    let row=0;while(row<anchors.length-1&&state.position>=anchors[row+1]-.5)row++;
    state.row=row;state.index=row;
    state.progress=state.maximum?state.position/state.maximum:0;
    state.renders++;
  }
  function schedule(now=performance.now()){nextAuto=now+state.autoDwell;}
  function run(now){
    if(!active||!state.ready){raf=0;last=0;return;}
    const dt=last?Math.min(now-last,48):16;last=now;
    if(auto){
      const p=clamp((now-auto.started)/state.autoDuration,0,1),smooth=p*p*(3-2*p);
      state.target=auto.from+(auto.to-auto.from)*smooth;state.position=state.target;
      if(p===1){auto=null;state.autoAdvances++;schedule(now);}
    }else{
      state.position+=(state.target-state.position)*(1-Math.exp(-dt/74));
      if(Math.abs(state.target-state.position)<.08)state.position=state.target;
      if(state.autoEnabled&&!document.hidden&&now-manualAt>=state.manualResume&&now>=nextAuto&&state.target<state.maximum-.5){
        const next=anchors.find(value=>value>state.target+8)??state.maximum;
        auto={from:state.position,to:next,started:now};state.direction=1;
      }
    }
    draw();raf=requestAnimationFrame(run);
  }
  function activate(){
    if(active)return;active=true;state.visible=true;state.entries++;schedule();
    if(!raf)raf=requestAnimationFrame(run);
  }
  function deactivate(){active=false;state.visible=false;auto=null;cancelAnimationFrame(raf);raf=0;last=0;}
  function enter(direction){
    arriving=true;departing=false;auto=null;edgeWheel=0;
    if(direction>0)state.position=state.target=0;else state.position=state.target=state.maximum;
    draw();window.scrollTo({top:galleryTop(),behavior:'instant'});arriving=false;activate();
  }
  function leave(direction){
    departing=true;deactivate();auto=null;edgeWheel=0;
    departureTarget=direction>0?about.offsetTop:film.offsetTop;
    window.scrollTo({top:departureTarget,behavior:reduced?'instant':'smooth'});
  }
  function manual(delta,now){
    auto=null;manualAt=now;nextAuto=now+state.manualResume;
    const direction=Math.sign(delta),fresh=now-lastWheel>230||direction!==lastDirection;
    lastWheel=now;lastDirection=direction;
    const atEdge=direction>0?state.target>=state.maximum-.5:state.target<=.5;
    // A fresh gesture at a completed edge leaves the gallery. Inertia belonging
    // to the gesture that reached an edge is never allowed to skip the images.
    if(atEdge&&fresh&&Math.abs(state.position-state.target)<8){edgeWheel+=Math.abs(delta);if(edgeWheel>=75){leave(direction);return;}}
    else edgeWheel=0;
    // A large mouse notch can advance within one image, but cannot consume the
    // entire process strip. Small trackpad deltas retain their exact direction.
    const distance=clamp(delta,-state.wallHeight*.52,state.wallHeight*.52)*1.35;
    if(direction!==state.direction)state.target=state.position;
    state.direction=direction;state.target=clamp(state.target+distance,0,state.maximum);
    state.manualChanges++;if(reduced){state.position=state.target;draw();}
  }
  window.addEventListener('wheel',event=>{
    if(event.ctrlKey||!state.ready)return;
    const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    if(Math.abs(delta)<1)return;
    const direction=Math.sign(delta),top=galleryTop();
    if(departing){
      if(Math.abs(scrollY-departureTarget)<16)departing=false;
      else {event.preventDefault();event.stopImmediatePropagation();return;}
    }
    if(aligned()||arriving){event.preventDefault();event.stopImmediatePropagation();state.wheelEvents++;activate();manual(delta,performance.now());return;}
    const crossesFromFilm=direction>0&&scrollY<top&&scrollY+delta>=top-24;
    const crossesFromAbout=direction<0&&scrollY>top&&scrollY+delta<=top+24;
    if(crossesFromFilm||crossesFromAbout){event.preventDefault();event.stopImmediatePropagation();enter(direction);lastWheel=performance.now();lastDirection=direction;}
  },{capture:true,passive:false});
  window.addEventListener('scroll',()=>{
    if(departing&&Math.abs(scrollY-departureTarget)<14)departing=false;
    if(aligned()&&!departing)activate();else if(active)deactivate();
  },{passive:true});
  stage.addEventListener('keydown',event=>{
    if(['ArrowDown','ArrowUp','PageDown','PageUp'].includes(event.key)){
      event.preventDefault();manual((['ArrowDown','PageDown'].includes(event.key)?1:-1)*(event.key.startsWith('Page')?450:160),performance.now());
    }else if(event.key===' '){event.preventDefault();state.autoEnabled=!state.autoEnabled;auto=null;schedule();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)deactivate();else if(aligned())activate();});
  new ResizeObserver(layout).observe(stage);
  fetch(url).then(response=>{if(!response.ok)throw Error('Code film gallery manifest unavailable');return response.json();}).then(async manifest=>{
    const indices=manifest.views?.flat()??manifest.gallerySelection??manifest.frames.map((_,i)=>i);state.sourceIndices=indices;state.frames=indices.length;state.views=indices.length;
    const cache=new Map();sequence=await Promise.all(indices.map(index=>{
      const item=manifest.frames[index],src=new URL(item.image||item.src,url).href;
      if(!cache.has(src)){const image=new Image();image.decoding='async';image.alt=item.subject||'';image.src=src;cache.set(src,image.decode().then(()=>image));}
      return cache.get(src);
    }));
    state.textureCount=cache.size;
    tracks.forEach(track=>sequence.forEach(image=>{
      const copy=image.cloneNode();copy.alt=image.alt;copy.style.setProperty('--frame-ratio',`${image.naturalWidth}/${image.naturalHeight}`);track.append(copy);
    }));
    state.ready=true;layout();stage.classList.add('is-ready');if(aligned())activate();
  }).catch(error=>{state.error=error.message;console.error(error);});
  window.addEventListener('pagehide',deactivate);
  window.addEventListener('pageshow',()=>{if(state.ready&&aligned())activate();});
}
document.querySelectorAll('[data-glass-manifest]').forEach(initializeGallery);
})();
