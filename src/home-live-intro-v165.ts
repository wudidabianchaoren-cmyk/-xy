/** The architectural visit and resting view share one camera, world and display transform. */
export function liveCourtyardIntroV165(){
 const w=window as any;
 const state=w.homeDesignedIntroState={version:165,active:false,frame:0,duration:16,framework:'Three.js / original continuous architectural camera',finished:false,preparing:false,firstFrameReady:false,sourceFrames:480,renderedMaster:false,handoff:'one live world / no image or renderer swap',playbackGaps:[] as number[],presentationDelays:[] as any[]};
 let prepared:Promise<any>|null=null,running=false,startAt=0,raf=0,previousAt=0;
 const skip=()=>document.body.dataset.returnedFromChild==='true'||document.body.dataset.skipCurrentEntryIntro==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hold=(e:WheelEvent)=>{if(state.active&&!state.finished)e.preventDefault();};addEventListener('wheel',hold,{passive:false,capture:true});
 function end(reason='ended'){
  if(state.finished)return;cancelAnimationFrame(raf);running=false;state.active=false;state.preparing=false;state.finished=true;state.frame=479;state.endReason=reason;state.endedAt=performance.now();
  document.body.classList.remove('home-intro-playing','home-intro-settling');document.body.dataset.homeIntroReplay='false';removeEventListener('wheel',hold,true);
  w.homeClockState?.renderIntroPose?.(16);sessionStorage.setItem('brain-universe-home-intro-seen','1');
  state.backgroundGPUReleased=true;dispatchEvent(new Event('v163:background-gpu-release'));dispatchEvent(new Event('v85:home-intro-finished'));
 }
 function tick(now:number){
  if(!running||state.finished)return;
  const seconds=Math.min(16,(now-startAt)/1000);state.frame=Math.min(479,Math.floor(seconds*30));
  if(previousAt){const gap=now-previousAt;state.playbackGaps.push(gap);if(gap>100)state.presentationDelays.push({frame:state.frame,delta:gap});}previousAt=now;
  if(seconds>=16){end();return;}raf=requestAnimationFrame(tick);
 }
 async function prepare(){
  if(skip()){end('return-or-reduced-motion');return{mode:'skipped'};}
  if(prepared)return prepared;
  state.preparing=true;prepared=(async()=>{
   const until=performance.now()+60000;while(!w.homeClockState?.ready){if(performance.now()>until)throw Error('Courtyard preparation timed out');await new Promise(r=>setTimeout(r,30));}
   if(w.homeClockState.nativeController){while(!w.homeClockState.nativeUE?.ready){if(performance.now()>until)throw Error('Courtyard stream preparation timed out');await new Promise(r=>setTimeout(r,30));}state.framework='Unreal Engine 5.8.4 / original continuous architectural camera';}
   w.homeClockState.renderIntroPose(0);if(w.homeClockState.nativeController?.waitForView)state.handoffPose=await w.homeClockState.nativeController.waitForView();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
   state.preparing=false;state.firstFrameReady=true;state.firstFrameReadyAt=performance.now();state.compositorWarmed=true;
   dispatchEvent(new CustomEvent('v151:home-intro-ready',{detail:{mode:'painted',at:state.firstFrameReadyAt}}));return{mode:'painted',at:state.firstFrameReadyAt};
  })();return prepared;
 }
 async function play(){if(running||state.finished)return;try{await prepare();if(state.finished)return;running=true;state.active=true;state.startedAt=startAt=performance.now();previousAt=0;document.body.classList.add('home-intro-playing');raf=requestAnimationFrame(tick);}catch(e){state.error=String(e);end('preparation-error');}}
 state.waitForMedia=()=>Promise.resolve();state.prepareForOpening=prepare;state.cancelOpeningPreparation=()=>end('entry-prepare-timeout');state.end=end;
 state.review=(frame:number)=>{cancelAnimationFrame(raf);running=false;state.active=true;state.finished=false;state.frame=Math.max(0,Math.min(479,frame));w.homeClockState?.renderIntroPose?.(state.frame/30);};
 state.resume=()=>{if(state.finished)return;running=true;startAt=performance.now()-state.frame/30*1000;raf=requestAnimationFrame(tick);};
 addEventListener('v31:opening-complete',()=>void play(),{once:true});addEventListener('pageshow',e=>{if(e.persisted)end('restored');});
 if(document.body.dataset.openingComplete==='true')void play();
 return state;
}
