import * as THREE from 'three';

const WORKS=[
 {title:'让画面发生',src:'./assets/works/physical-universe-v103/film.mp4',poster:'./assets/works/covers-v137/code-films.webp'},
 {title:'后西游记',src:'./assets/works/after-journey/trailer-v32-92.mp4',poster:'./assets/works/after-journey/cover-v32-92.webp'},
 {title:'湖南卫视中秋之夜',src:'./assets/works/mid-autumn/mid-autumn-web.mp4',poster:'./assets/works/covers-v137/mid-autumn.webp'},
 {title:'乡土归途',src:'./assets/works/rural-return/film-sr-v32-92.mp4',poster:'./assets/works/covers-v137/rural.webp'},
 {title:'潮湿东南亚',src:'',poster:'./assets/works/humid-southeast-asia/cover.webp'}
];
const COVER='./assets/reading/cinema-aesthetics/cover-v32-79.png';
const GIANT='./blender/mythology-v32-118/cycles-final-1920.png';
const LEARNING='./assets/prompt-lab/prompt-structure.webp';
const PORTRAIT='./assets/wu-xiangyu-portrait.png';
const YANGJIAN='./assets/yangjian-v116/video/opening.mp4';
export type ReaderState={visible:boolean;auto:boolean;pageLabel:string;pagesLeft:number;pagesRight:number;canPrevious:boolean;canNext:boolean};
export async function createScreen(){
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1152;
 const ctx=canvas.getContext('2d',{alpha:false})!;ctx.scale(1.5,1.5);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 const average=new THREE.Color(.05,.09,.20);
 const status={category:0,work:0,book:0,page:0,auto:false,videoTime:0,reader:{visible:false,auto:false,pageLabel:'封面',pagesLeft:0,pagesRight:0,canPrevious:false,canNext:true} as ReaderState};
 const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.setAttribute('playsinline','');video.setAttribute('muted','');
 const videoTexture=new THREE.VideoTexture(video);videoTexture.colorSpace=THREE.SRGBColorSpace;videoTexture.minFilter=THREE.LinearFilter;videoTexture.magFilter=THREE.LinearFilter;videoTexture.generateMipmaps=false;
 const videoLayer={active:{value:0},scale:{value:new THREE.Vector2(1,1)},texture:{value:videoTexture}};
 const imageCache=new Map<string,HTMLImageElement>();const pending=new Map<string,Promise<HTMLImageElement|null>>();
 let active=true,disposed=false,dirty=true,currentVideo='',lastAdvance=-1,lastAverage=-1,lastT=0,welcomeUntil=1.0,pageChangedAt=-1,readerAuto=false,bootVisible=true;
 let readerListener:((state:ReaderState)=>void)|undefined,turn:{canvas:HTMLCanvasElement;direction:number}|null=null;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function isReader(){return status.category===1&&status.book===0;}
 function notifyReader(){const page=status.page;Object.assign(status.reader,{visible:isReader()&&powered,auto:readerAuto,pageLabel:page===0?'封面':`${page}–${page+1} / 26`,pagesLeft:page,pagesRight:page===0?0:page+1,canPrevious:page>0,canNext:page<25});readerListener?.({...status.reader});}
 function onReaderChange(listener:(state:ReaderState)=>void){readerListener=listener;notifyReader();}
 const scratch=document.createElement('canvas');scratch.width=24;scratch.height=18;const sample=scratch.getContext('2d',{willReadFrequently:true})!;
 function image(path:string){if(!pending.has(path)){const im=new Image();pending.set(path,new Promise(resolve=>{im.onload=()=>{imageCache.set(path,im);dirty=true;resolve(im)};im.onerror=()=>resolve(null);im.src=path}));}return imageCache.get(path);}
 function safePlay(){if(active&&powered&&!disposed)void video.play().catch(()=>{});}
 function loadVideo(path:string){if(path===currentVideo){safePlay();return;}video.pause();currentVideo=path;video.src=path;video.load();safePlay();}
 video.addEventListener('loadeddata',safePlay);
 function mediaForState(){
  if(status.category===0){image(WORKS[status.work].poster);if(WORKS[status.work].src)loadVideo(WORKS[status.work].src);else{video.pause();currentVideo='';video.removeAttribute('src');video.load();}}
  else if(status.category===1&&status.book===1){image('./assets/yangjian-v116/video/opening-poster.png');loadVideo(YANGJIAN);}
  else{video.pause();if(status.category===1){if(status.book===0){image(COVER);const p=Math.max(1,status.page);for(let i=Math.max(1,p-2);i<=Math.min(26,p+3);i++)image(pageURL(i));}else image(GIANT);}else image(status.category===2?LEARNING:PORTRAIT);}
 }
 function pageURL(p:number){return `./assets/reading/cinema-aesthetics/page-${String(p).padStart(3,'0')}.jpg`;}
 function reset(){dirty=true;videoLayer.active.value=0;lastAverage=-1;lastAdvance=lastT;welcomeUntil=0;mediaForState();notifyReader();}
 function select(i:number){status.category=Math.max(0,Math.min(3,i|0));status.page=0;readerAuto=false;turn=null;reset();}
 function book(i:number){status.category=1;status.book=((i|0)%3+3)%3;status.page=0;status.auto=false;readerAuto=false;turn=null;reset();}
 function work(i:number){status.category=0;status.work=((i|0)%WORKS.length+WORKS.length)%WORKS.length;readerAuto=false;turn=null;reset();}
 function turnPage(direction:number,manual=true){
  if(!isReader())return false;
  if(manual)readerAuto=false;
  const target=direction>0?(status.page===0?1:Math.min(25,status.page+2)):(status.page<=1?0:status.page-2);
  if(target===status.page){if(direction>0)readerAuto=false;notifyReader();return true;}
  if(!reducedMotion){const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;snapshot.getContext('2d')!.drawImage(canvas,0,0);turn={canvas:snapshot,direction};}else turn=null;
  pageChangedAt=lastT;status.page=target;reset();return true;
 }
 function readingAuto(on:boolean){if(!isReader())return;readerAuto=on&&status.page<25;status.auto=false;lastAdvance=lastT;notifyReader();}
 function hit(u:number,v:number){if(!isReader()||!powered||u<0||u>1||v<0||v>1)return false;return turnPage(u<.5?-1:1);}
 function previous(){if(isReader()){turnPage(-1);return;}if(status.category===0)work(status.work-1);else if(status.category===1)book(status.book-1);else select((status.category+3)%4);}
 function next(){
  if(status.category===0)work(status.work+1);
  else if(status.category===1){if(status.book===0)turnPage(1);else book((status.book+1)%3);}
  else select((status.category+1)%4);
 }
 function contain(source:CanvasImageSource,x:number,y:number,w:number,h:number){
  const s=source as HTMLImageElement&HTMLVideoElement;const iw=s.videoWidth||s.naturalWidth||0,ih=s.videoHeight||s.naturalHeight||0;if(!iw||!ih)return;
  const scale=Math.min(w/iw,h/ih);ctx.drawImage(source,x+(w-iw*scale)/2,y+(h-ih*scale)/2,iw*scale,ih*scale);
 }
 function osd(title:string,detail:string){
  ctx.save();ctx.fillStyle='rgba(4,9,15,.87)';ctx.fillRect(22,674,980,72);
  ctx.textBaseline='middle';ctx.font='600 32px "Microsoft YaHei", sans-serif';ctx.fillStyle='#d6e1dc';ctx.fillText(title,40,711,680);
  ctx.font='24px monospace';ctx.fillStyle='#aebeb9';ctx.textAlign='right';ctx.fillText(detail,982,711);ctx.restore();
 }
 function blueBoot(){ctx.fillStyle='#26399c';ctx.fillRect(0,0,1024,768);ctx.fillStyle='#e4e9ed';ctx.font='27px monospace';ctx.fillText('PLAY  ▶',48,68);ctx.font='600 32px "Microsoft YaHei", sans-serif';ctx.fillText('脑海宇宙',48,694);ctx.font='21px monospace';ctx.fillText('CH 01',884,68);}
 function cinemaSpread(){
  ctx.fillStyle='#1a1b18';ctx.fillRect(0,0,1024,768);
  if(status.page===0){const cover=image(COVER);if(cover)contain(cover,278,28,468,626);}
  else{
   ctx.save();ctx.shadowColor='#0008';ctx.shadowBlur=18;ctx.shadowOffsetY=10;ctx.fillStyle='#f0eee7';ctx.fillRect(32,30,960,622);ctx.restore();
   const left=image(pageURL(status.page)),right=image(pageURL(status.page+1));
   if(left)contain(left,42,36,466,610);if(right)contain(right,516,36,466,610);
   const gutter=ctx.createLinearGradient(494,0,530,0);gutter.addColorStop(0,'#0000');gutter.addColorStop(.5,'#26251f36');gutter.addColorStop(1,'#0000');ctx.fillStyle=gutter;ctx.fillRect(494,30,36,622);
  }
  if(turn){const p=Math.min(1,(lastT-pageChangedAt)/.52);if(p>=1)turn=null;else{
   // One hinged paper leaf; original page images keep their ratio throughout the turn.
   const direction=turn.direction,cos=Math.cos(p*Math.PI),width=Math.max(1,480*Math.abs(cos));ctx.save();ctx.beginPath();ctx.rect(32,28,960,628);ctx.clip();
   if(p<.5){const sx=direction>0?512:32,dx=direction>0?512:512-width;ctx.drawImage(turn.canvas,sx*1.5,30*1.5,480*1.5,622*1.5,dx,30,width,622);}
   else{const dx=direction>0?512-width:512;ctx.fillStyle='#e9e7df';ctx.fillRect(dx,30,width,622);const page=image(pageURL(direction>0?status.page:status.page+1));if(page){ctx.save();ctx.translate(dx,30);ctx.scale(width/480,1);contain(page,0,0,480,622);ctx.restore();}}
   ctx.fillStyle=`rgba(28,25,18,${Math.sin(p*Math.PI)*.24})`;ctx.fillRect(direction>0?(p<.5?512:512-width):(p<.5?512-width:512),30,width,622);ctx.restore();
  }}
  osd('电影美学',status.reader.pageLabel);
 }
 function sampleAverage(source:CanvasImageSource,t:number){lastAverage=t;sample.drawImage(source,0,0,24,18);const data=sample.getImageData(0,0,24,18).data;let r=0,g=0,b=0;for(let i=0;i<data.length;i+=4){r+=data[i];g+=data[i+1];b+=data[i+2];}const n=data.length/4*255;average.setRGB(r/n,g/n,b/n,THREE.SRGBColorSpace);}
 let powered=true;function power(on:boolean){dirty=true;powered=on;if(!on)videoLayer.active.value=0;if(on&&powered)mediaForState();else video.pause();notifyReader();}
 function update(t:number){if(!active||disposed)return;lastT=t;status.videoTime=Number.isFinite(video.currentTime)?video.currentTime:0;if(!powered){if(dirty){ctx.fillStyle='#020303';ctx.fillRect(0,0,1024,768);texture.needsUpdate=true;average.setRGB(.001,.001,.001);dirty=false;}return;}
  if(lastAdvance<0)lastAdvance=t;
  if(isReader()){if(readerAuto&&t-lastAdvance>4){turnPage(1,false);lastAdvance=t;}}else if(status.auto&&t-lastAdvance>16){next();lastAdvance=t;}
  const boot=t<welcomeUntil;if(boot!==bootVisible){bootVisible=boot;dirty=true;}
  const expectedVideo=status.category===0?WORKS[status.work].src:status.category===1&&status.book===1?YANGJIAN:'';
  const hasVideo=!boot&&!!expectedVideo&&currentVideo===expectedVideo&&video.readyState>=2&&video.videoWidth>0&&video.videoHeight>0;
  if(videoLayer.active.value!==(hasVideo?1:0)){videoLayer.active.value=hasVideo?1:0;dirty=true;}
  if(hasVideo){const fit=Math.min(1024/video.videoWidth,768/video.videoHeight);videoLayer.scale.value.set(video.videoWidth*fit/1024,video.videoHeight*fit/768);if(t-lastAverage>.5)sampleAverage(video,t);}
  const moving=!!turn||boot;
  if(!dirty&&!moving)return;
  dirty=false;
  ctx.fillStyle='#070b10';ctx.fillRect(0,0,1024,768);
  if(t<welcomeUntil)blueBoot();
  else if(status.category===0){const w=WORKS[status.work];if(!hasVideo){const poster=image(w.poster);if(poster)contain(poster,0,0,1024,768);}osd(w.title,w.src?`作品 ${String(status.work+1).padStart(2,'0')}`:'环境图集 · 影片剪辑中');}
  else if(status.category===1){
   if(status.book===0){
    cinemaSpread();
   }else if(status.book===1){if(!hasVideo){const im=image('./assets/yangjian-v116/video/opening-poster.png');if(im)contain(im,0,0,1024,768);}osd('劈山 · 杨戬救母','水墨影像');}
   else{const im=image(GIANT);if(im)contain(im,0,0,1024,768);osd('尤利西斯嘲弄波吕菲摩斯','本地 Cycles 场景');}
  }else{const im=image(status.category===2?LEARNING:PORTRAIT);if(im)contain(im,32,26,960,644);osd(status.category===2?'制作与观察':'吴翔宇',status.category===2?'学习笔记':'AI 影视创作者');}
  // No line raster: downsampling a dense grid against Chinese type creates moire that resembles corrupt text.
  if(!hasVideo&&t-lastAverage>.5)sampleAverage(canvas,t);
  texture.needsUpdate=true;
 }
 function setActive(on:boolean){active=on;if(on&&powered){dirty=true;mediaForState();}else{videoLayer.active.value=0;video.pause();}}
 function destroy(){disposed=true;active=false;readerListener=undefined;turn=null;videoLayer.active.value=0;video.pause();video.removeAttribute('src');video.load();texture.dispose();videoTexture.dispose();imageCache.clear();pending.clear();}
 await Promise.race([imageInitial(),new Promise<void>(r=>setTimeout(r,1200))]);mediaForState();
 async function imageInitial(){image(WORKS[0].poster);await pending.get(WORKS[0].poster);}
 return{texture,videoTexture,videoLayer,update,select,work,book,next,previous,readingAuto,onReaderChange,hit,power,auto(on:boolean){if(isReader())readingAuto(on);else{status.auto=on;lastAdvance=lastT;}},setActive,average,status,destroy};
}
