/** A short magnetic arrival, preserving one complete room without a hard page jump. */
export function installDeskBoundaryV160(section:HTMLElement){
 const w=window as any,state=w.deskBoundaryV158={docked:false,entries:0,exits:0,lastReason:'',holdUntil:0,mode:'soft-arrival-v160',transitioning:false};let lastWheel=0,exitingUntil=0,idle=0,generation=0,settleUntil=0;
 const blocked=()=>['directory-music-open','standalone-page-open','standalone-archive-open','portfolio-portal-open','works-orbit-open','is-project-leaving'].some(n=>document.body.classList.contains(n))||!!document.querySelector('dialog[open],.directory-notepad[style*="pointer-events: auto"]');
 let overlayWasOpen=blocked();new MutationObserver(()=>{const open=blocked();if(overlayWasOpen&&!open)state.holdUntil=performance.now()+700;overlayWasOpen=open;}).observe(document.body,{attributes:true,attributeFilter:['class']});
 const top=()=>scrollY+section.getBoundingClientRect().top;
 function go(y:number,duration=.38){const token=++generation,start=scrollY,d=duration*1000,began=performance.now();state.transitioning=true;settleUntil=began+d+80;const l=w.__v31Lenis;l?.stop?.();const tick=()=>{if(token!==generation)return;const u=Math.min(1,(performance.now()-began)/d),ease=1-Math.pow(1-u,4),pos=start+(y-start)*ease;l?.scrollTo?.(pos,{immediate:true,force:true});scrollTo(0,pos);if(u<1)requestAnimationFrame(tick);else{state.transitioning=false;l?.start?.();}};requestAnimationFrame(tick);}
 const consume=(e:WheelEvent)=>{e.preventDefault();e.stopImmediatePropagation();};
 const dock=(reason:string)=>{go(top());state.docked=true;state.entries++;state.lastReason=reason;state.holdUntil=performance.now()+420;document.body.classList.add('directory-section-active');};
 window.addEventListener('wheel',(e:WheelEvent)=>{const now=performance.now(),gap=now-lastWheel;lastWheel=now;if(blocked()){state.holdUntil=now+700;return;}if(Math.abs(e.deltaY)<Math.abs(e.deltaX)||Math.abs(e.deltaY)<2)return;if(state.transitioning||now<exitingUntil){consume(e);return;}const b=section.getBoundingClientRect(),h=innerHeight;
  if(Math.abs(b.top)<3&&b.bottom>=h-3){if(!state.docked){state.docked=true;state.holdUntil=now+300;}consume(e);if(now<state.holdUntil||gap<115)return;state.docked=false;state.exits++;state.lastReason=e.deltaY>0?'fresh-wheel-next':'fresh-wheel-previous';exitingUntil=now+440;
   let target=e.deltaY>0?section.nextElementSibling:section.previousElementSibling;while(target){const s=getComputedStyle(target);if(target.getBoundingClientRect().height>=10&&s.position!=='fixed'&&s.position!=='absolute'&&s.visibility!=='hidden'&&s.display!=='none')break;target=e.deltaY>0?target.nextElementSibling:target.previousElementSibling;}
   go(e.deltaY>0?(target?scrollY+target.getBoundingClientRect().top:top()+h):(target?Math.max(0,scrollY+target.getBoundingClientRect().bottom-h):Math.max(0,top()-h)),.42);return;
  }
  state.docked=false;const reach=Math.min(h*.36,Math.max(100,Math.abs(e.deltaY)*.72));if(e.deltaY>0&&b.top>0&&b.top<reach){consume(e);dock('wheel-from-above');}else if(e.deltaY<0&&b.bottom<h&&h-b.bottom<reach){consume(e);dock('wheel-from-below');}
 },{capture:true,passive:false});
 window.addEventListener('scroll',()=>{clearTimeout(idle);if(blocked()||performance.now()<Math.max(exitingUntil,settleUntil))return;idle=setTimeout(()=>{const b=section.getBoundingClientRect();if(Math.abs(b.top)>3&&Math.abs(b.top)<innerHeight*.42&&!blocked())dock('settled-scroll');},130);},{passive:true});
}
