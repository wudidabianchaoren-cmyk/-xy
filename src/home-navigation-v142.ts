import * as THREE from 'three';
import {enterChapter} from './chapter-navigation';

/** Quiet wayfinding follows the architecture, and becomes available after the six-shot introduction. */
export function courtyardNavigation(surface:HTMLElement,canvas:HTMLCanvasElement,camera:THREE.Camera){
  const places=[
    {name:'阅读 · 书房',code:'READING ROOM',point:[-12.7,1.65,-6.3],title:'把喜欢的电影，翻成笔记',copy:'在书架旁停一会儿，翻开我的电影美学手稿。',links:[['进入阅读室','@reading']]},
    {name:'影像 · 档案馆',code:'IMAGE ARCHIVE',point:[-7.35,.45,-2.6],title:'沿着图像，回到作品',copy:'这里收集我的影像与视觉尝试，也留下它们形成的线索。',links:[['影像作品','imageChapters'],['提示词长成电影','lifePurpose']]},
    {name:'神话 · 远航',code:'MYTH & VOYAGE',point:[-4.75,.20,-2.35],title:'从画布走向海面',copy:'进入透纳的神话世界，换一个角度观看古老的故事。',links:[['三维神话','odysseyIntroduction']]},
    {name:'造境手记 · 入口',code:'THE LIVING ARCHIVE',point:[0,-.05,.1],title:'选择一条路，慢慢看',copy:'影像、粒子、阅读和学习，在这里相遇。',links:[['展览目录','@index'],['粒子与物质','sandNarrative']]},
    {name:'学习 · 光之回廊',code:'LEARNING CLOISTER',point:[7.85,.16,.24],title:'沿着好奇心继续学习',copy:'把看见的东西记下来，也给新的问题留一个位置。',links:[['学习札记','@learning']]}
  ];
  const root=document.createElement('nav');root.className='courtyard-wayfinding';root.setAttribute('aria-label','建筑中的展览入口');root.hidden=true;surface.append(root);
  const inscription=document.createElement('div');inscription.className='courtyard-inscription';inscription.innerHTML='造境手记<small>吴翔宇 · 影像与三维叙事</small>';surface.append(inscription);
  const hint=document.createElement('p');hint.className='courtyard-hint';hint.innerHTML='<span>THE LIVING ARCHIVE</span> 沿着建筑，进入作品';root.append(hint);
  const panel=document.createElement('aside');panel.className='courtyard-card';panel.hidden=true;panel.setAttribute('aria-label','展览入口');root.append(panel);
  let current=-1,closeTimer=0,openTimer=0,motion=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const close=()=>{if(current<0)return;current=-1;clearTimeout(closeTimer);clearTimeout(openTimer);const token=++motion;buttons.forEach(b=>b.setAttribute('aria-expanded','false'));panel.classList.remove('is-open');panel.getAnimations().forEach(a=>a.cancel());const a=panel.animate([{opacity:1,transform:'translateY(0) rotateX(0)'},{opacity:0,transform:'translateY(10px) rotateX(-4deg)'}],{duration:reduced?0:180,easing:'ease-in',fill:'forwards'});a.finished.then(()=>{if(token===motion)panel.hidden=true;}).catch(()=>{});};
  function navigate(id:string){close();if(id==='@reading'||id==='@learning'){try{sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}location.href=id==='@reading'?'./reading.html':'./learning.html';return;}if(id==='@index'){document.getElementById('indexTrigger')?.click();return;}const target=document.getElementById(id);if(!target)return;
    enterChapter(target,1.3);
  }
  function open(i:number){clearTimeout(closeTimer);clearTimeout(openTimer);if(i===current&&!panel.hidden)return;const token=++motion;current=i;const p=places[i];panel.getAnimations().forEach(a=>a.cancel());panel.replaceChildren();
    const image=document.createElement('img');image.className='courtyard-card-image';image.alt='';image.setAttribute('aria-hidden','true');
    const frame=document.createElement('canvas');frame.width=560;frame.height=216;const ctx=frame.getContext('2d');
    if(ctx){const focal=new THREE.Vector3(...p.point as [number,number,number]);focal.y+=i===3?3.5:1.5;focal.project(camera);const width=canvas.width*.25,height=width*216/560,x=(focal.x+1)*canvas.width*.5,y=(1-focal.y)*canvas.height*.5;ctx.drawImage(canvas,Math.max(0,Math.min(canvas.width-width,x-width/2)),Math.max(0,Math.min(canvas.height-height,y-height/2)),width,height,0,0,560,216);image.src=frame.toDataURL('image/jpeg',.85);panel.append(image);}
    const content=document.createElement('div');content.className='courtyard-card-content';panel.append(content);
    const code=document.createElement('small');code.textContent=String(i+1).padStart(2,'0')+' / '+p.code;const title=document.createElement('h3');title.textContent=p.title;const copy=document.createElement('p');copy.textContent=p.copy;content.append(code,title,copy);
    for(const [label,id] of p.links){const link=document.createElement('button');link.type='button';const name=document.createElement('span');name.textContent=label;const arrow=document.createElement('i');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(name,arrow);link.addEventListener('click',()=>navigate(id));content.append(link);}
    const dismiss=document.createElement('button');dismiss.type='button';dismiss.className='courtyard-card-close';dismiss.setAttribute('aria-label','收起入口卡片');dismiss.textContent='收起';dismiss.addEventListener('click',close);content.append(dismiss);
    panel.hidden=false;panel.classList.add('is-open');buttons.forEach((b,n)=>b.setAttribute('aria-expanded',String(n===i)));positionPanel();
    panel.animate([{opacity:0,transform:'translateY(42px) rotateX(-18deg) scale(.86)',filter:'blur(3px)'},{opacity:1,transform:'translateY(-5px) rotateX(2deg) scale(1.025)',filter:'blur(0px)',offset:.7},{opacity:1,transform:'translateY(0) rotateX(0) scale(1)',filter:'blur(0px)'}],{duration:reduced?0:620,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    Array.from(content.children).forEach((element,n)=>element.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:reduced?0:300,delay:reduced?0:70+n*35,fill:'both',easing:'ease-out'}));
  }
  const buttons=places.map((place,i)=>{const b=document.createElement('button');b.type='button';b.className='courtyard-place';b.setAttribute('aria-label',place.name+'：打开展览入口');b.setAttribute('aria-expanded','false');b.innerHTML='<i aria-hidden="true" data-symbol="'+['▤','▧','≈','◷','⌁'][i]+'"></i><span>'+place.name+'</span>';
    b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){clearTimeout(closeTimer);openTimer=window.setTimeout(()=>open(i),170);}});
    b.addEventListener('pointerleave',()=>{clearTimeout(openTimer);closeTimer=window.setTimeout(close,650);});b.addEventListener('focus',()=>open(i));
    b.addEventListener('click',e=>{e.stopPropagation();open(i);});b.addEventListener('dblclick',e=>e.stopPropagation());root.append(b);return b;});
  panel.addEventListener('pointerenter',()=>clearTimeout(closeTimer));panel.addEventListener('pointerleave',()=>{closeTimer=window.setTimeout(close,650);});
  root.addEventListener('keydown',e=>{if(e.code==='Space')e.stopPropagation();if(e.key==='Escape'){const i=current;if(i>=0)buttons[i].focus();close();e.stopPropagation();}});
  document.addEventListener('pointerdown',e=>{if(current>=0&&!root.contains(e.target as Node))close();});
  function positionPanel(){if(current<0)return;const b=buttons[current];const x=parseFloat(b.style.left),y=parseFloat(b.style.top);const width=Math.min(310,surface.clientWidth-32);panel.style.width=width+'px';panel.style.left=Math.max(16,Math.min(surface.clientWidth-width-16,x-width*.5))+'px';panel.style.top=Math.max(160,Math.min(surface.clientHeight-panel.offsetHeight-24,y-panel.offsetHeight-22))+'px';}
  const v=new THREE.Vector3();
  let previous='';
  return{update:(enabled:boolean)=>{v.set(5.8,9.25,-9.69).project(camera);const hidden=!enabled||Math.abs(v.x)>1||Math.abs(v.y)>1;if(inscription.hidden!==hidden)inscription.hidden=hidden;const key=v.x.toFixed(5)+','+v.y.toFixed(5)+','+canvas.clientWidth+','+canvas.clientHeight;if(previous!==key){previous=key;const c=canvas.getBoundingClientRect(),s=surface.getBoundingClientRect();inscription.style.left=(c.left-s.left+(v.x+1)*c.width*.5).toFixed(2)+'px';inscription.style.top=(c.top-s.top+(1-v.y)*c.height*.5).toFixed(2)+'px';}if(!enabled)close();},places:places.map(p=>({name:p.name,point:p.point,links:p.links})),open,close};
}
