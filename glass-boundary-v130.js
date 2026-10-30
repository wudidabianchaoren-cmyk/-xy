/* One scroll owner for the five existing glass galleries. Visual renderers stay local. */
(() => {
  'use strict';
  const galleries=[...document.querySelectorAll('.project-gallery')].map(node=>({
    node,stage:node.querySelector('.glass-stage'),
    previous:document.getElementById(node.dataset.before||'film'),next:document.getElementById(node.dataset.after||'about'),
    lastInput:0,lastStep:0,direction:0,enteredAt:0
  })).filter(g=>g.stage&&g.previous&&g.next);
  if(!galleries.length)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const report=window.glassGalleryBoundary={version:'32.130',galleries:{},owns:node=>galleries.some(g=>g.node===node)};
  galleries.forEach(g=>report.galleries[g.node.id]={entries:0,steps:0,exits:0});
  document.documentElement.style.scrollSnapType='none';
  let active=null,transit=null,lastWheel=0,touch=null;
  const top=g=>g.node.offsetTop;
  const adapter=g=>(window.codeFilmsState?.galleries[g.node.id]||window.afterJourneyState)?.boundary;
  const pinned=g=>Math.abs(scrollY-top(g))<18;
  function candidate(direction,delta=0){
    if(active&&pinned(active))return active;
    for(const g of galleries){
      if(pinned(g))return g;
      if(direction>0&&scrollY<top(g)-1&&scrollY>=g.previous.offsetTop-16)return g;
      if(direction<0&&scrollY>top(g)+1&&scrollY<=g.next.offsetTop+60)return g;
      if(direction>0&&scrollY<top(g)&&scrollY+Math.abs(delta)>=top(g))return g;
      if(direction<0&&scrollY>top(g)&&scrollY-Math.abs(delta)<=top(g))return g;
    }
    return null;
  }
  function enter(g,direction,now){
    active=g;g.enteredAt=now;g.lastStep=now;g.lastInput=now;g.direction=direction;
    report.galleries[g.node.id].entries++;
    window.scrollTo({top:top(g),behavior:'instant'});
    adapter(g)?.enter(direction);
    g.stage.focus({preventScroll:true});
  }
  function leave(g,direction,now){
    const destination=direction>0?g.next:g.previous;
    active=null;report.galleries[g.node.id].exits++;
    transit={target:destination.offsetTop,releaseAt:now+400,deadline:now+1800};
    window.scrollTo({top:transit.target,behavior:reduced.matches?'instant':'smooth'});
    // Move keyboard focus without moving the destination again.
    destination.setAttribute('tabindex','-1');destination.focus({preventScroll:true});
  }
  function input(direction,delta,now,fresh){
    if(transit){
      if(now<transit.deadline&&(Math.abs(scrollY-transit.target)>5||now<transit.releaseAt||!fresh))return true;
      transit=null;
    }
    const g=candidate(direction,delta);if(!g)return false;
    if(active!==g||!pinned(g)){enter(g,direction,now);return true;}
    const control=adapter(g),state=window.codeFilmsState?.galleries[g.node.id]||window.afterJourneyState;
    if(!control?.ready()){
      // Failed media cannot leave a visitor permanently trapped.
      if(state?.error||now-g.enteredAt>8000)leave(g,direction,now);
      return true;
    }
    if(!control.settled())return true;
    const edge=direction>0?control.atEnd():control.atStart();
    if(edge){if(fresh&&now-g.lastStep>250)leave(g,direction,now);return true;}
    if(fresh||now-g.lastStep>500){
      control.advance(direction);g.lastStep=now;
      report.galleries[g.node.id].steps++;
    }
    return true;
  }
  window.addEventListener('wheel',event=>{
    if(event.ctrlKey||event.metaKey||Math.abs(event.deltaY)<1)return;
    const now=performance.now(),direction=Math.sign(event.deltaY),delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
    const g=active,fresh=now-lastWheel>220||g&&g.direction!==direction;
    lastWheel=now;if(g)g.direction=direction;
    if(input(direction,delta,now,fresh)){event.preventDefault();event.stopImmediatePropagation();}
  },{capture:true,passive:false});
  window.addEventListener('keydown',event=>{
    if(event.ctrlKey||event.metaKey||event.altKey||event.target.closest?.('input,textarea,select,button,a,[contenteditable="true"]'))return;
    const down=['ArrowDown','PageDown','End'].includes(event.key)||event.key===' '&&!event.shiftKey;
    const up=['ArrowUp','PageUp','Home'].includes(event.key)||event.key===' '&&event.shiftKey;
    if((down||up)&&input(down?1:-1,innerHeight,performance.now(),!event.repeat)){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  window.addEventListener('touchstart',event=>{
    if(event.touches.length!==1)return;const t=event.touches[0];touch={x:t.clientX,y:t.clientY,lastY:t.clientY,handled:false};
  },{capture:true,passive:true});
  window.addEventListener('touchmove',event=>{
    if(!touch||event.touches.length!==1)return;const t=event.touches[0],dy=touch.y-t.clientY;
    if(Math.abs(dy)<14||Math.abs(dy)<Math.abs(touch.x-t.clientX))return;
    if(active||candidate(Math.sign(dy),dy)){
      event.preventDefault();event.stopImmediatePropagation();
      if(!touch.handled){input(Math.sign(dy),dy,performance.now(),true);touch.handled=true;}
    }
    touch.lastY=t.clientY;
  },{capture:true,passive:false});
  window.addEventListener('touchend',()=>{touch=null;},{capture:true,passive:true});
  window.addEventListener('touchcancel',()=>{touch=null;},{capture:true,passive:true});
  window.addEventListener('scroll',()=>{
    if(active&&!transit&&!pinned(active))window.scrollTo({top:top(active),behavior:'instant'});
  },{passive:true});
  window.addEventListener('pageshow',()=>{lastWheel=0;transit=null;});
})();
