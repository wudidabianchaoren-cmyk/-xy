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
})();
