import './archive-effects.jsx';
import './scroll-collage';
// Apply the motion to the original directory; retain registered source in vendor.
const list=document.getElementById('indexList'),overlay=document.getElementById('indexOverlay');
if(list&&overlay){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const decorate=()=>{for(const [i,item] of [...list.querySelectorAll<HTMLElement>('.index-work')].entries()){const n=item.querySelector('.number');if(n)n.textContent=String(i+1).padStart(2,'0');const title=item.querySelector('.title')?.textContent?.trim(),meta=item.querySelector('.meta');const content=title==='学习'?'LEARNING / NOTES & PRACTICE<br>把读到的东西记下来，把新的想法试一试。':title==='阅读'?'READING / FILM AESTHETICS<br>翻开电影美学手稿，保留原来的图像与跨页设计。':null;if(meta&&content&&meta.innerHTML!==content)meta.innerHTML=content;}};
 const population=new MutationObserver(decorate);population.observe(list,{childList:true});decorate();
 let frame=0;const targets=new Map<HTMLElement,number>(),values=new Map<HTMLElement,{p:number,v:number}>();
 const items=()=>[...list.querySelectorAll<HTMLElement>('.index-work')];
 const animate=()=>{frame=0;let moving=false;for(const item of items()){const s=values.get(item)||{p:0,v:0},target=targets.get(item)||0;s.v=(s.v+(target-s.p)*.19)*.70;s.p+=s.v;values.set(item,s);item.style.setProperty('--dock-drop',(s.p*3.5).toFixed(3)+'px');item.style.setProperty('--dock-scale',(1+s.p*.018).toFixed(5));if(Math.abs(target-s.p)+Math.abs(s.v)>.001)moving=true;}if(moving&&overlay.classList.contains('v31-index-open'))frame=requestAnimationFrame(animate);};
 const update=(x:number,y:number)=>{if(reduced)return;for(const item of items()){const r=item.getBoundingClientRect(),d=Math.hypot(x-(r.left+r.width*.5),y-(r.top+r.height*.5));targets.set(item,Math.max(0,1-d/Math.max(122,r.width*.65)));}if(!frame)frame=requestAnimationFrame(animate);};
 list.addEventListener('pointermove',e=>update(e.clientX,e.clientY));list.addEventListener('pointerleave',()=>update(-10000,-10000));
 list.addEventListener('focusin',e=>{const item=(e.target as HTMLElement).closest<HTMLElement>('.index-work');if(item){const r=item.getBoundingClientRect();update(r.left+r.width*.5,r.top+r.height*.5);}});
}
