import * as THREE from 'three';

const WORKS=[
 {title:'让画面发生',src:'./assets/works/physical-universe-v103/film.mp4',poster:'./assets/works/physical-universe-v103/cover.webp'},
 {title:'后西游记',src:'./assets/works/after-journey/trailer-v32-92.mp4',poster:'./assets/works/after-journey/cover-v32-92.webp'},
 {title:'湖南卫视中秋之夜',src:'./assets/works/mid-autumn/mid-autumn-web.mp4',poster:'./assets/works/mid-autumn/cover-v32-92.webp'},
 {title:'乡土归途',src:'./assets/works/rural-return/film-sr-v32-92.mp4',poster:'./assets/works/rural-return/poster.webp'}
];
const COVER='./assets/reading/cinema-aesthetics/cover-v32-79.png';
const GIANT='./blender/mythology-v32-118/cycles-final-1920.png';
const LEARNING='./assets/prompt-lab/prompt-structure.webp';
const PORTRAIT='./assets/wu-xiangyu-portrait.png';
const YANGJIAN='./assets/yangjian-v116/video/opening.mp4';
export async function createScreen(){
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1152;
 const ctx=canvas.getContext('2d',{alpha:false})!;ctx.scale(1.5,1.5);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;
 const average=new THREE.Color(.05,.09,.20);
 const status={category:0,work:0,book:0,page:0,auto:false,videoTime:0};
 const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='auto';video.setAttribute('playsinline','');video.setAttribute('muted','');
 const imageCache=new Map<string,HTMLImageElement>();const pending=new Map<string,Promise<HTMLImageElement|null>>();
 let active=true,disposed=false,currentVideo='',lastAdvance=-1,lastAverage=-1,lastT=0,welcomeUntil=1.0,pageChangedAt=0;
 const scratch=document.createElement('canvas');scratch.width=24;scratch.height=18;const sample=scratch.getContext('2d',{willReadFrequently:true})!;
 function image(path:string){if(!pending.has(path)){const im=new Image();pending.set(path,new Promise(resolve=>{im.onload=()=>{imageCache.set(path,im);resolve(im)};im.onerror=()=>resolve(null);im.src=path}));}return imageCache.get(path);}
 function safePlay(){if(active&&powered&&!disposed)void video.play().catch(()=>{});}
 function loadVideo(path:string){if(path===currentVideo){safePlay();return;}video.pause();currentVideo=path;video.src=path;video.load();safePlay();}
 video.addEventListener('loadeddata',safePlay);
 function mediaForState(){
  if(status.category===0){image(WORKS[status.work].poster);loadVideo(WORKS[status.work].src);}
  else if(status.category===1&&status.book===1){image('./assets/yangjian-v116/video/opening-poster.png');loadVideo(YANGJIAN);}
  else{video.pause();if(status.category===1){if(status.book===0){image(COVER);const p=Math.max(1,status.page);image(pageURL(p));if(p<26)image(pageURL(p+1));}else image(GIANT);}else image(status.category===2?LEARNING:PORTRAIT);}
 }
 function pageURL(p:number){return `./assets/reading/cinema-aesthetics/page-${String(p).padStart(3,'0')}.jpg`;}
 function reset(){pageChangedAt=lastT;lastAdvance=lastT;welcomeUntil=0;mediaForState();}
 function select(i:number){status.category=Math.max(0,Math.min(3,i|0));status.page=0;reset();}
 function book(i:number){status.category=1;status.book=((i|0)%3+3)%3;status.page=0;reset();}
 function work(i:number){status.category=0;status.work=((i|0)%WORKS.length+WORKS.length)%WORKS.length;reset();}
 function next(){
  if(status.category===0)work(status.work+1);
  else if(status.category===1){if(status.book===0){status.page=status.page===0?1:status.page+1;if(status.page>26)status.page=0;reset();}else book((status.book+1)%3);}
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
 let powered=true;function power(on:boolean){powered=on;if(on&&powered)mediaForState();else video.pause();}
 function update(t:number){if(!active||disposed)return;lastT=t;if(!powered){ctx.fillStyle='#020303';ctx.fillRect(0,0,1024,768);texture.needsUpdate=true;average.setRGB(.001,.001,.001);return;}
  if(lastAdvance<0)lastAdvance=t;
  if((status.auto||status.category===1&&status.book===0)&&t-lastAdvance>(status.category===1&&status.book===0?5:16)){next();lastAdvance=t;}
  ctx.fillStyle='#070b10';ctx.fillRect(0,0,1024,768);
  if(t<welcomeUntil)blueBoot();
  else if(status.category===0){const w=WORKS[status.work];if(video.readyState>=2&&currentVideo===w.src)contain(video,0,0,1024,768);else{const poster=image(w.poster);if(poster)contain(poster,0,0,1024,768);}osd(w.title,`作品 ${String(status.work+1).padStart(2,'0')}`);}
  else if(status.category===1){
   if(status.book===0){
    ctx.fillStyle='#141412';ctx.fillRect(0,0,1024,768);
    if(status.page===0){const cover=image(COVER);if(cover)contain(cover,34,22,956,648);}
    else{const a=image(pageURL(status.page));if(a)contain(a,60,16,904,638);}
    osd('电影美学',status.page===0?'封面':`${status.page} / 26`);
   }else if(status.book===1){if(video.readyState>=2&&currentVideo===YANGJIAN)contain(video,0,0,1024,768);else{const im=image('./assets/yangjian-v116/video/opening-poster.png');if(im)contain(im,0,0,1024,768);}osd('劈山 · 杨戬救母','水墨影像');}
   else{const im=image(GIANT);if(im)contain(im,0,0,1024,768);osd('尤利西斯嘲弄波吕菲摩斯','本地 Cycles 场景');}
  }else{const im=image(status.category===2?LEARNING:PORTRAIT);if(im)contain(im,32,26,960,644);osd(status.category===2?'制作与观察':'吴翔宇',status.category===2?'学习笔记':'AI 影视创作者');}
  // No line raster: downsampling a dense grid against Chinese type creates moire that resembles corrupt text.
  status.videoTime=Number.isFinite(video.currentTime)?video.currentTime:0;
  if(t-lastAverage>.5){lastAverage=t;sample.drawImage(canvas,0,0,24,18);const data=sample.getImageData(0,0,24,18).data;let r=0,g=0,b=0;for(let i=0;i<data.length;i+=4){r+=data[i];g+=data[i+1];b+=data[i+2];}const n=data.length/4*255;average.setRGB(r/n,g/n,b/n,THREE.SRGBColorSpace);}
  texture.needsUpdate=true;
 }
 function setActive(on:boolean){active=on;if(on&&powered)mediaForState();else video.pause();}
 function destroy(){disposed=true;active=false;video.pause();video.removeAttribute('src');video.load();texture.dispose();imageCache.clear();pending.clear();}
 await Promise.race([imageInitial(),new Promise<void>(r=>setTimeout(r,1200))]);mediaForState();
 async function imageInitial(){image(WORKS[0].poster);await pending.get(WORKS[0].poster);}
 return{texture,update,select,work,book,next,power,auto(on:boolean){status.auto=on;lastAdvance=lastT;},setActive,average,status,destroy};
}
