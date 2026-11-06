(() => {
  'use strict';
  const states=new WeakMap();let parentVisible=parent===window;
  const state=video=>{let s=states.get(video);if(!s){s={audible:!video.muted,painted:false,pending:false};states.set(video,s);video.muted=true;video.removeAttribute('poster');video.style.opacity='0';}return s;};
  const paint=video=>{const s=state(video);if(s.pending||video.readyState<2)return;s.pending=true;
    const presented=()=>requestAnimationFrame(()=>{s.pending=false;s.painted=true;video.dataset.firstFramePainted195='true';video.style.opacity='1';
      if(parentVisible&&s.audible&&!video.paused)video.muted=false;
      document.dispatchEvent(new CustomEvent('portfolio:work-first-frame',{detail:{id:video.id}}));});
    if(video.requestVideoFrameCallback&&!video.paused)video.requestVideoFrameCallback(presented);else requestAnimationFrame(presented);
  };
  const inspect=node=>{if(!(node instanceof Element))return;for(const v of node.matches('video')?[node]:node.querySelectorAll('video'))state(v);};
  new MutationObserver(rows=>{for(const row of rows)for(const node of row.addedNodes)inspect(node);}).observe(document.documentElement,{childList:true,subtree:true});
  for(const type of ['play','playing','loadeddata','waiting'])document.addEventListener(type,event=>{const v=event.target;if(!(v instanceof HTMLVideoElement))return;const s=state(v);if(!s.painted||!parentVisible||type==='waiting')v.muted=true;if(type==='playing'||type==='loadeddata')paint(v);},true);
  addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='brain-universe:project-visible')return;parentVisible=true;for(const v of document.querySelectorAll('video')){const s=state(v);if(s.painted&&s.audible&&!v.paused)v.muted=false;}});
})();
