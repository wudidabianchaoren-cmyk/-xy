/**
 * AnimatedContent / Magnet mechanisms adapted for the existing DOM.
 * React Bits, Copyright (c) 2026 David Haz, MIT + Commons Clause.
 * Frozen source and full license: vendor/react-bits-v129/.
 * No React/GSAP runtime added; existing 3D and gallery animation owners stay intact.
 */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const state = window.portfolioRefinements = {version:'32.129', reveals:0, activeSprings:0};
  const running = new Set();
  // One short entrance per editorial group, never an endless float or scroll scrub.
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      if (reduced.matches) continue;
      const animation = entry.target.animate([
        {opacity:.35, transform:'translateY(18px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:580, easing:'cubic-bezier(.16,1,.3,1)'});
      running.add(animation); state.reveals++;
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    }
  }, {threshold:.12});
  document.querySelectorAll('.project-about>.about-label,.project-about>.about-copy').forEach(n => observer.observe(n));

  const resets = [];
  // A maximum 3px displacement on a few controls. Their parent hit target stays still.
  document.querySelectorAll('.project-return-arrow svg,#openBook,.original').forEach(node => {
    const hit = node.closest('.project-return-arrow') || node;
    let rect, x=0, y=0, vx=0, vy=0, tx=0, ty=0, frame=0, last=0;
    function stop() {
      cancelAnimationFrame(frame); if(frame) state.activeSprings--;
      frame=0;last=0;x=y=vx=vy=tx=ty=0;
      node.style.removeProperty('translate');node.classList.remove('v129-magnet-active');
    }
    function draw(now) {
      const dt=Math.min((now-last)/1000||.016,.032);last=now;
      vx+=(170*(tx-x)-22*vx)*dt;vy+=(170*(ty-y)-22*vy)*dt;
      x+=vx*dt;y+=vy*dt;
      node.style.translate=`${x.toFixed(3)}px ${y.toFixed(3)}px`;
      if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(vx)+Math.abs(vy)<.025) {
        state.activeSprings--;frame=0;last=0;
        if(tx===0&&ty===0) {node.style.removeProperty('translate');node.classList.remove('v129-magnet-active');}
        return;
      }
      frame=requestAnimationFrame(draw);
    }
    function start(){if(!frame){state.activeSprings++;last=0;frame=requestAnimationFrame(draw);}}
    hit.addEventListener('pointerenter',()=>{rect=hit.getBoundingClientRect();});
    hit.addEventListener('pointermove',event=>{
      if(reduced.matches||!fine.matches||event.pointerType!=='mouse')return;
      rect ||= hit.getBoundingClientRect();
      const dx=(event.clientX-rect.left-rect.width/2)/8,dy=(event.clientY-rect.top-rect.height/2)/8;
      const length=Math.hypot(dx,dy),scale=length>3?3/length:1;
      tx=dx*scale;ty=dy*scale;node.classList.add('v129-magnet-active');start();
    },{passive:true});
    hit.addEventListener('pointerleave',()=>{rect=null;tx=ty=0;if(!reduced.matches&&fine.matches)start();else stop();});
    hit.addEventListener('blur',stop);resets.push(stop);
  });
  reduced.addEventListener('change',()=>{if(reduced.matches){running.forEach(a=>a.cancel());resets.forEach(f=>f());}});
  fine.addEventListener('change',()=>{if(!fine.matches)resets.forEach(f=>f());});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)resets.forEach(f=>f());});
  window.addEventListener('pagehide',()=>{observer.disconnect();running.forEach(a=>a.cancel());resets.forEach(f=>f());});
})();
