import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
let gallery=await fs.readFile('home-creation-gallery-v103.js','utf8');
gallery=gallery.replace("(() => {\n  'use strict';\n  if(document.body.dataset.project!=='home-creation')return;\n  const gallery=document.getElementById('gallery'),stage=document.getElementById('glassStage');\n  const film=document.getElementById('film'),about=document.getElementById('about');",`function initializeGallery(gallery){
  const stage=gallery.querySelector('.glass-stage');
  const film=document.getElementById(gallery.dataset.before),about=document.getElementById(gallery.dataset.after);`);
gallery=gallery.replace('const state=window.homeGalleryState=window.afterJourneyState={','const state=window.codeFilmsState.galleries[gallery.id]={');
gallery=gallery.replace("version:'32.103'","version:'32.114'").replace('frames:6,views:3','frames:0,views:0').replace('sourceIndices:[0,5,2,1,3,4]','sourceIndices:[]');
gallery=gallery.replace('window.homeGalleryBoundary=state;',"if(gallery.id==='gallery')window.afterJourneyState=state;");
gallery=gallery.replace('new URL(document.body.dataset.galleryManifest,location.href)','new URL(gallery.dataset.glassManifest,location.href)');
gallery=gallery.replace(/    \/\/ The first four process images[\s\S]*?    let sum=0;anchors=\[0\];/,'    let sum=0;anchors=[0];');
gallery=gallery.replace('i<heights.length-2','i<heights.length');
gallery=gallery.replace('state.row=row;state.index=state.position>=state.maximum-.5?2:state.position>=heights[0]+heights[1]-.5?1:0;','state.row=row;state.index=row;');
gallery=gallery.replace("throw Error('Home gallery manifest unavailable')","throw Error('Code film gallery manifest unavailable')");
gallery=gallery.replace('const indices=manifest.views.flat();state.sourceIndices=indices;state.frames=indices.length;state.views=manifest.views.length;','const indices=manifest.views?.flat()??manifest.gallerySelection??manifest.frames.map((_,i)=>i);state.sourceIndices=indices;state.frames=indices.length;state.views=indices.length;');
gallery=gallery.replace("copy.alt='';copy.style.setProperty", "copy.alt=image.alt;copy.style.setProperty");
gallery=gallery.replace("image.decoding='async';image.src=src;","image.decoding='async';image.alt=item.subject||'';image.src=src;");
gallery=gallery.replace(/\}\)\(\);\s*$/,'}');
assert(gallery.startsWith('function initializeGallery'));assert(!gallery.includes('homeGallery'));
const video=`(() => {
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
`;
await fs.writeFile('code-films-v114.js',video+gallery+"\ndocument.querySelectorAll('[data-glass-manifest]').forEach(initializeGallery);\n})();\n");
console.log('Two independently bounded natural-aspect glass galleries and mutually exclusive video playback.');
