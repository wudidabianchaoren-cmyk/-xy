/** One viewport at the workbench, with a fresh gesture required to leave it. */
export function installDeskBoundaryV158(section:HTMLElement){
 const w=window as any,state=w.deskBoundaryV158={docked:false,entries:0,exits:0,lastReason:'',holdUntil:0};let lastWheel=0,exitingUntil=0,idle=0;
 const blocked=()=>['directory-music-open','standalone-page-open','standalone-archive-open','portfolio-portal-open','works-orbit-open','is-project-leaving'].some(name=>document.body.classList.contains(name))||!!document.querySelector('dialog[open],.directory-notepad[style*="pointer-events: auto"]');
 // The room receives window capture listeners before its music dialog does.
 // Keep an overlay's closing wheel tail from becoming a new page-leave gesture.
 let overlayWasOpen=blocked();const overlayChanges=new MutationObserver(()=>{const open=blocked();if(overlayWasOpen&&!open)state.holdUntil=performance.now()+900;overlayWasOpen=open;});overlayChanges.observe(document.body,{attributes:true,attributeFilter:['class']});
 const top=()=>scrollY+section.getBoundingClientRect().top;
 const go=(y:number)=>{const l=w.__v31Lenis;l?.stop?.();l?.scrollTo?.(y,{immediate:true,force:true});window.scrollTo({top:y,behavior:'instant'});l?.start?.();};
 const dock=(reason:string)=>{go(top());state.docked=true;state.entries++;state.lastReason=reason;state.holdUntil=performance.now()+750;document.body.classList.add('directory-section-active');};
 const consume=(e:WheelEvent)=>{e.preventDefault();e.stopImmediatePropagation();};
 window.addEventListener('wheel',(e:WheelEvent)=>{const now=performance.now(),gap=now-lastWheel;lastWheel=now;if(blocked()){state.holdUntil=now+900;return;}if(Math.abs(e.deltaY)<Math.abs(e.deltaX)||Math.abs(e.deltaY)<2)return;const b=section.getBoundingClientRect(),h=innerHeight;if(now<exitingUntil){consume(e);return;}
  if(Math.abs(b.top)<3&&b.bottom>=h-3){if(!state.docked){state.docked=true;state.holdUntil=now+750;}consume(e);if(now<state.holdUntil||gap<170)return;state.docked=false;state.exits++;state.lastReason=e.deltaY>0?'fresh-wheel-next':'fresh-wheel-previous';exitingUntil=now+650;
   let target:Element|null=e.deltaY>0?section.nextElementSibling:section.previousElementSibling;while(target){const style=getComputedStyle(target);if(target.getBoundingClientRect().height>=10&&style.position!=='fixed'&&style.position!=='absolute'&&style.visibility!=='hidden'&&style.display!=='none')break;target=e.deltaY>0?target.nextElementSibling:target.previousElementSibling;}
   go(e.deltaY>0?(target?scrollY+target.getBoundingClientRect().top:top()+h):(target?Math.max(0,scrollY+target.getBoundingClientRect().bottom-h):Math.max(0,top()-h)));return;}
  state.docked=false;if(e.deltaY>0&&b.top>0&&b.top<Math.max(h*.72,Math.abs(e.deltaY)*1.3)){consume(e);dock('wheel-from-above');}else if(e.deltaY<0&&b.bottom<h&&b.bottom>h*.28){consume(e);dock('wheel-from-below');}
 },{capture:true,passive:false});
 window.addEventListener('scroll',()=>{clearTimeout(idle);if(blocked()||performance.now()<exitingUntil)return;idle=window.setTimeout(()=>{const b=section.getBoundingClientRect();if(Math.abs(b.top)>3&&Math.abs(b.top)<innerHeight*.40&&!blocked())dock('settled-scroll');},160);},{passive:true});
}
