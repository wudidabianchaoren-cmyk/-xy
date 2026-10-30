/* The courtyard track has one owner: the visible main courtyard. */
(()=>{'use strict';
 let audio,wanted=true,queued=false,blocked=true;
 function allowed(){
  if(document.hidden||!document.body?.classList.contains('experience-entered'))return false;
  if(document.body.matches('.portfolio-portal-open,.v31-index-open,.works-orbit-open,.standalone-archive-open,.is-project-active,.is-project-leaving,.memory-open,.directory-music-open,.odyssey-dialog-open,.is-sand-reading'))return false;
  if(document.querySelector('.personal-page.is-standalone-open,.hobby-page.is-standalone-open'))return false;
  const r=document.getElementById('voyage')?.getBoundingClientRect();
  return !!r&&r.top<innerHeight*.35&&r.bottom>innerHeight*.65;
 }
 window.portfolioHomeAudioAllowed=allowed;
 function sync(){queued=false;if(!audio)return;blocked=!allowed();
  if(blocked){audio.pause();audio.muted=true;}
  else if(!window.portfolioAudioFocus?.owner){audio.muted=audio.volume===0;if(wanted&&audio.paused)audio.play().catch(()=>{});}
  window.portfolioHomeAudioState={allowed:!blocked,wanted,paused:audio.paused};
 }
 const request=()=>{if(!queued){queued=true;requestAnimationFrame(sync);}};
 function start(){audio=document.getElementById('portfolioAudio');if(!audio)return;
  audio.autoplay=false;
  audio.addEventListener('play',()=>{if(!allowed()){audio.pause();audio.muted=true;}});
  document.getElementById('musicToggle')?.addEventListener('click',()=>{if(!allowed()){wanted=true;audio.pause();return;}wanted=!audio.paused;request();});
  new MutationObserver(request).observe(document.body,{attributes:true,attributeFilter:['class']});
  for(const e of ['scroll','resize','visibilitychange','v31:opening-complete','portfolio:audio-focus','portfolio:surface-return','v31:works-orbit-open','v31:works-orbit-close','v31:open-standalone'])addEventListener(e,request,{passive:true});
  document.addEventListener('pointerdown',request,{passive:true});document.addEventListener('click',request);sync();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
