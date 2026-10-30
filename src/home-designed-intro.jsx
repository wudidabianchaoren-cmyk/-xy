import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {CourtyardAwakens} from '../motion/home-intro-v88/Scene.jsx';
const surface=document.querySelector('.home-rendered-architecture');
if(surface){
 const host=document.createElement('div');host.className='home-designed-intro';host.hidden=true;host.style.contain='layout paint style';host.style.isolation='isolate';surface.append(host);
 const closeSrc='./blender/home-intro-v32-88/clock-close-cycles.png';
 const closeImage=new Image();closeImage.decoding='async';closeImage.src=closeSrc;const closeReady=closeImage.decode().catch(()=>{});
 let root=null,player=null,checking=0,running=false,generation=0,watchdog=0,lastProgress=0,retries=0,paintPromise=null,resolvePaint=null,skipCurrentEntry=false;
 const state=window.homeDesignedIntroState={active:false,frame:0,duration:16,framework:'Remotion Player',finished:false,handoff:'same live camera and cover-fit',preparing:false,firstFrameReady:false};
 function paintReady(mode){state.firstFrameReady=mode==='painted';state.firstFrameReadyAt=performance.now();state.handoffMode=mode;resolvePaint?.({mode,at:state.firstFrameReadyAt});resolvePaint=null;window.dispatchEvent(new CustomEvent('v151:home-intro-ready',{detail:{mode,at:state.firstFrameReadyAt}}));}
 function awaitPaint(token){const tick=()=>new Promise(resolve=>requestAnimationFrame(resolve));const check=async()=>{if(token!==generation||!running)return;const images=[...host.querySelectorAll('img')];if(host.querySelector('svg')&&images.length&&images.every(image=>image.complete&&image.naturalWidth>0)){await Promise.all(images.map(image=>image.decode().catch(()=>{})));for(const frame of[1,2,0]){if(token!==generation||!running)return;player?.seekTo(frame);await tick();await tick();}state.compositorWarmed=true;state.warmedFrames=[1,2,0];if(token===generation&&running)paintReady('painted');}else requestAnimationFrame(check);};requestAnimationFrame(check);}
 function fit(){const {width:w,height:h}=surface.getBoundingClientRect(),scale=Math.max(w/1600,h/900);Object.assign(host.style,{width:1600*scale+'px',height:900*scale+'px',left:(w-1600*scale)/2+'px',top:(h-900*scale)/2+'px',right:'auto',bottom:'auto'});}
 new ResizeObserver(fit).observe(surface);fit();
 function end(reason='ended'){generation++;clearInterval(watchdog);clearTimeout(checking);running=false;state.active=false;state.preparing=false;state.finished=true;state.endReason=typeof reason==='string'?reason:'ended';if(resolvePaint)paintReady('failed');host.hidden=true;document.body.classList.remove('home-intro-playing','home-intro-settling');try{sessionStorage.setItem('brain-universe-home-intro-seen','1');}catch{}document.body.dataset.homeIntroReplay='false';player?.pause();const old=root;root=null;player=null;setTimeout(()=>old?.unmount(),100);window.dispatchEvent(new Event('v85:home-intro-finished'));}
 class IntroBoundary extends React.Component{componentDidCatch(error){state.error=String(error);end('player-error');}render(){return this.props.children;}}
 async function start(){
   if(running||state.finished)return;running=true;state.preparing=true;state.finished=false;state.firstFrameReady=false;state.error=null;state.frame=0;paintPromise=new Promise(resolve=>{resolvePaint=resolve;});retries=0;lastProgress=performance.now();const token=++generation;
   document.body.classList.add('home-intro-playing');
   // Freeze and capture the actual live camera, so the end of the composition
   // reveals the same geometry and lighting rather than a different poster.
   let wideSrc='./assets/home/home-live-poster-v32-84.png';
   try{wideSrc=(window.homeClockState?.prepareDisplayCapture?await window.homeClockState.prepareDisplayCapture():window.homeClockState?.captureDisplay?.())||wideSrc;}catch(error){state.captureError=String(error);}
   try{await Promise.race([Promise.all([closeReady,new Promise(resolve=>{const img=new Image();img.decoding='async';img.src=wideSrc;img.decode().then(resolve,resolve);})]),new Promise(resolve=>setTimeout(resolve,4000))]);}catch{}
   if(token!==generation)return;
   state.preparing=false;state.active=true;state.finished=false;state.frame=0;state.startedAt=performance.now();host.hidden=false;fit();
   const mount=(from=0)=>{root=createRoot(host);root.render(<IntroBoundary><Player component={CourtyardAwakens} inputProps={{wideSrc,closeSrc}} durationInFrames={480} fps={30} compositionWidth={1600} compositionHeight={900} initialFrame={from} autoPlay={document.body.dataset.openingHandoffPending!=='true'} controls={false} loop={false} style={{width:'100%',height:'100%'}} ref={p=>{if(!p)return;player=p;p.addEventListener('ended',end);p.addEventListener('error',e=>{state.error=String(e.detail);end('player-error');});p.addEventListener('frameupdate',e=>{if(e.detail.frame!==state.frame)lastProgress=performance.now();const settling=e.detail.frame>=420,wasSettling=state.frame>=420;state.frame=e.detail.frame;if(settling!==wasSettling)document.body.classList.toggle('home-intro-settling',settling);});}}/></IntroBoundary>);};mount();awaitPaint(token);lastProgress=performance.now();
   clearInterval(watchdog);watchdog=setInterval(()=>{if(document.hidden){lastProgress=performance.now();return;}if(!running||token!==generation)return;if(performance.now()-state.startedAt>30000){end('total-playback-timeout');return;}const stalled=performance.now()-lastProgress;if(stalled>4000&&!retries){retries++;state.recoveryCount=retries;const old=root;root=null;player=null;old?.unmount();host.replaceChildren();mount(state.frame);lastProgress=performance.now();}else if(stalled>9000)end('playback-timeout');},1000);
 }
 function shouldSkip(){const replay=document.body.dataset.homeIntroReplay==='true';let seen=false;try{seen=sessionStorage.getItem('brain-universe-home-intro-seen')==='1';}catch{}return skipCurrentEntry||document.body.dataset.skipCurrentEntryIntro==='true'||(!replay&&(document.body.dataset.returnedFromChild==='true'||seen||matchMedia('(prefers-reduced-motion:reduce)').matches));}
 function prepare(){clearTimeout(checking);if(shouldSkip()){state.finished=true;return;}if(document.body.dataset.openingComplete==='true'&&window.homeClockState?.ready)void start().catch(error=>{state.error=String(error);end('startup-error');});else checking=setTimeout(prepare,150);}
 state.prepareForOpening=()=>{clearTimeout(checking);if(shouldSkip()){state.finished=true;return Promise.resolve({mode:'skipped',at:performance.now()});}if(!running)void start().catch(error=>{state.error=String(error);end('startup-error');});return paintPromise;};
 state.cancelOpeningPreparation=()=>{skipCurrentEntry=true;end('entry-prepare-timeout');};
 window.addEventListener('v85:home-intro-replay',()=>{clearTimeout(checking);if(window.homeClockState?.ready)void start().catch(error=>{state.error=String(error);end('startup-error');});});
 window.addEventListener('v31:opening-complete',()=>{if(running&&state.firstFrameReady){state.startedAt=performance.now();lastProgress=performance.now();player?.play();}else prepare();});window.addEventListener('pageshow',e=>{if(e.persisted)end();});prepare();
 state.review=async frame=>{if(!running)await start();setTimeout(()=>{player?.pause();player?.seekTo(frame);},150);};state.resume=()=>player?.play();state.end=end;
}
