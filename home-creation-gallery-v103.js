(() => {
  'use strict';
  if(document.body.dataset.project!=='home-creation')return;
  const gallery=document.getElementById('gallery'),stage=document.getElementById('glassStage');
  const film=document.getElementById('film'),about=document.getElementById('about');
  if(!gallery||!stage||!film||!about)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const state=window.homeGalleryState=window.afterJourneyState={
    version:'32.103',ready:false,renderer:'CSS full-width natural-aspect synchronized glass',
    frames:6,views:3,index:0,row:0,visible:false,animating:false,direction:0,
    position:0,target:0,maximum:0,autoEnabled:!reduced,autoAdvances:0,
    autoDwell:3300,autoDuration:2600,manualResume:5500,renders:0,
    sourceIndices:[0,5,2,1,3,4],entries:0,wheelEvents:0,manualChanges:0
  };
  window.homeGalleryBoundary=state;
  const url=new URL(document.body.dataset.galleryManifest,location.href);
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
    const width=frame.clientWidth,height=frame.clientHeight;
    heights=sequence.map(image=>width*image.naturalHeight/image.naturalWidth);
    const total=heights.reduce((sum,value)=>sum+value,0);
    state.maximum=Math.max(0,total-height);
    // The first four process images retain their full height. At the end the
    // two 3:1 collages occupy the familiar pair, without a change of image width.
    let sum=0;anchors=[0];
    for(let i=0;i<heights.length-2;i++){sum+=heights[i];anchors.push(Math.min(sum,state.maximum));}
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
    state.row=row;state.index=state.position>=state.maximum-.5?2:state.position>=heights[0]+heights[1]-.5?1:0;
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
  fetch(url).then(response=>{if(!response.ok)throw Error('Home gallery manifest unavailable');return response.json();}).then(async manifest=>{
    const indices=manifest.views.flat();state.sourceIndices=indices;state.frames=indices.length;state.views=manifest.views.length;
    const cache=new Map();sequence=await Promise.all(indices.map(index=>{
      const item=manifest.frames[index],src=new URL(item.image||item.src,url).href;
      if(!cache.has(src)){const image=new Image();image.decoding='async';image.src=src;cache.set(src,image.decode().then(()=>image));}
      return cache.get(src);
    }));
    state.textureCount=cache.size;
    tracks.forEach(track=>sequence.forEach(image=>{
      const copy=image.cloneNode();copy.alt='';copy.style.setProperty('--frame-ratio',`${image.naturalWidth}/${image.naturalHeight}`);track.append(copy);
    }));
    state.ready=true;layout();stage.classList.add('is-ready');if(aligned())activate();
  }).catch(error=>{state.error=error.message;console.error(error);});
  window.addEventListener('pagehide',deactivate);
  window.addEventListener('pageshow',()=>{if(state.ready&&aligned())activate();});
})();
