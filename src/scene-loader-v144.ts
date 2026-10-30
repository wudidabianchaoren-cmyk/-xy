import {enterChapter} from './chapter-navigation';
document.querySelector('[data-epilogue-return]')?.addEventListener('click',e=>{e.preventDefault();const target=document.getElementById('voyage');if(target)enterChapter(target);});
const epilogue=document.getElementById('portfolioEpilogue');
if(epilogue)new IntersectionObserver(entries=>document.body.classList.toggle('is-epilogue',entries[0].isIntersecting),{threshold:.1}).observe(epilogue);
const indexList=document.getElementById('indexList');
if(indexList){const link=document.createElement('button');link.type='button';link.className='epilogue-index';link.textContent='结语 / 写给 AI 时代 ↗';indexList.after(link);link.addEventListener('click',()=>{document.getElementById('indexClose')?.click();setTimeout(()=>{const target=document.getElementById('portfolioEpilogue');if(target)enterChapter(target);},350);});}
type IdleWindow=Window&{requestIdleCallback?:(callback:()=>void,options:{timeout:number})=>number};
const idle=(callback:()=>void)=>{const w=window as IdleWindow;if(w.requestIdleCallback)w.requestIdleCallback(callback,{timeout:600});else setTimeout(callback,50);};
const home=document.querySelector<HTMLElement>('.home-rendered-architecture');
document.querySelectorAll<HTMLAnchorElement>('a[href="./reading.html"],a[href="./learning.html"]').forEach(a=>a.addEventListener('click',()=>{
 sessionStorage.setItem('brain-universe-return-y',String(scrollY));
 const anchor=a.closest<HTMLElement>('.research-board')??Array.from(document.querySelectorAll<HTMLElement>('main>section[id]')).find(s=>!s.hidden&&s.getBoundingClientRect().bottom>0&&s.getBoundingClientRect().top<innerHeight);
 if(anchor?.id)sessionStorage.setItem('brain-universe-return-anchor',JSON.stringify({id:anchor.id,offset:-anchor.getBoundingClientRect().top}));
}));
const prefetchHome=()=>{if(!home||(window as Window&{homeNativePreload?:Promise<unknown>}).homeNativePreload)return;{
  const pending=Promise.all([
    fetch('./blender/reference-architecture-v16/world-track.json').then(r=>{if(!r.ok)throw Error('Native track preload failed');return r.json();}),
    fetch('./blender/reference-architecture-v16/architecture-world.glb').then(r=>{if(!r.ok)throw Error('Native model preload failed');return r.arrayBuffer();})
  ]);
  pending.catch(()=>{});(window as Window&{homeNativePreload?:Promise<unknown>}).homeNativePreload=pending;
}};
// Let the entry film obtain its first buffer before the large native model competes for bandwidth.
prefetchHome();
let homeLoaded=false;
const loadHome=()=>{if(homeLoaded||!home)return;homeLoaded=true;idle(()=>{void import(/* @vite-ignore */ './home-world-v144.js?v=32.144').catch(e=>console.error('Homepage could not initialise',e));});};
const homeWhenVisible=()=>{
  if(!home)return;
  const observe=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observe.disconnect();loadHome();}},{rootMargin:'250px'});
  observe.observe(home);
};
// Use the entry's 20 seconds for geometry, texture uploads and shader preparation too.
// The home clock stays at zero until the opening completes.
loadHome();
// Child returns skip playback and only emit opening-complete. Cover that deferred boot too.
window.addEventListener('v31:opening-complete',()=>{prefetchHome();loadHome();},{once:true});
const observe=(target:HTMLElement|null,margin:string,load:()=>void)=>{if(!target)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();idle(load);}},{rootMargin:margin});observer.observe(target);};
let sandNear=false,sandLoaded=false;
const loadSand=()=>{if(sandLoaded)return;sandLoaded=true;window.removeEventListener('scroll',loadSand);idle(()=>{const script=document.createElement('script');script.src='./v31-sand-story.js?v=32.133';script.async=true;document.body.append(script);});};
// Prepare the next chapter during the entry film, after the home GPU warmup, rather than at its scroll boundary.
window.addEventListener('v85:home-intro-finished',()=>idle(loadSand),{once:true});
observe(document.getElementById('sandNarrative'),'900px',()=>{sandNear=true;loadSand();});window.addEventListener('scroll',()=>{const top=document.getElementById('sandNarrative')?.getBoundingClientRect().top;if(top!==undefined&&top<innerHeight*1.5)loadSand();},{passive:true});
// Story and mythology now live on the reading shelf; code films live in their work.
