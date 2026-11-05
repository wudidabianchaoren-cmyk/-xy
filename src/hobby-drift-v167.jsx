import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import photography from '../assets/photography-v170/manifest.json';

// DriftWall, adapted from the complete React Bits component supplied by the user.
// The supplied photographs keep their original proportions and are grouped by color.
const photoItems=photography.items;
function DriftWall({items=photoItems,columns=5,tileHeight=132,gap=18,tilt=16,turn=-14,depth=120,speed=42,variance=.45,parallax=.6}){
 const root=useRef(null),plane=useRef(null),tracks=useRef([]),offsets=useRef([]),velocity=useRef([]),hover=useRef(-1),pointer=useRef({x:0,y:0}),damped=useRef({x:0,y:0});
 const [active,setActive]=useState(null),[height,setHeight]=useState(900),[selected,setSelected]=useState(null);const viewer=useRef(null);
 useEffect(()=>{if(selected){viewer.current?.showModal();hover.current=-2;}},[selected]);
 const columnItems=Array.from({length:columns},(_,c)=>items.filter(item=>item.column===c));
 const tileSize=item=>200/item.ratio;
 const meta=columnItems.map(col=>{const run=col.reduce((sum,item)=>sum+tileSize(item)+gap,0);return{height:run,copies:Math.max(3,Math.ceil(height*1.8/run)+1)}});
 const columnsKey=JSON.stringify(meta);
 useEffect(()=>{const observer=new ResizeObserver(([entry])=>setHeight(entry.contentRect.height||900));observer.observe(root.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{
  const page=document.getElementById('hobbyPage'),query=matchMedia('(prefers-reduced-motion: reduce)');let reduced=query.matches,visible=false,raf=0,last=0;
  offsets.current=meta.map((m,c)=>m.height*((c*.37)%1));velocity.current=meta.map(()=>0);
  const alive=()=>visible&&page.classList.contains('is-standalone-open')&&!document.hidden;
  const draw=ts=>{raf=0;if(!alive()){last=0;return}const dt=Math.min(.05,Math.max(0,ts-(last||ts))/1000);last=ts;
   const ease=1-Math.exp(-dt/.12),mx=reduced?0:pointer.current.x*parallax*8,my=reduced?0:-pointer.current.y*parallax*8;
   damped.current.x+=(mx-damped.current.x)*ease;damped.current.y+=(my-damped.current.y)*ease;
   plane.current.style.transform=`translate(-50%,-50%) scale(1.18) rotateX(${tilt+damped.current.y}deg) rotateY(${turn+damped.current.x}deg) translateZ(${-depth}px)`;
   for(let c=0;c<meta.length;c++){const factor=1+variance*((((c*.6180339887+.35)%1)*2)-1),target=reduced||viewer.current?.open||hover.current===c?0:speed*factor*(c%2?-1:1);velocity.current[c]+=(target-velocity.current[c])*(1-Math.exp(-dt/(target===0?.16:.28)));offsets.current[c]=((offsets.current[c]+velocity.current[c]*dt)%meta[c].height+meta[c].height)%meta[c].height;tracks.current[c].style.transform=`translate3d(0,${-offsets.current[c]}px,0)`;}
   window.hobbyDriftState={active:true,offsets:[...offsets.current],hoveredColumn:hover.current,reduced,frameAt:ts,imageCount:items.filter(x=>x.image).length,source:'React Bits DriftWall / user supplied source'};
   if(!reduced||Math.abs(damped.current.x)+Math.abs(damped.current.y)>.001)raf=requestAnimationFrame(draw);
  };
  const wake=()=>{document.body.classList.toggle('photography-reading',alive());if(alive()&&!raf)raf=requestAnimationFrame(draw);if(!alive()){cancelAnimationFrame(raf);raf=0;last=0;if(window.hobbyDriftState)window.hobbyDriftState.active=false;}};
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake()},{threshold:.03});intersection.observe(root.current);
  const state=new MutationObserver(wake);state.observe(page,{attributes:true,attributeFilter:['class']});
  const change=()=>{reduced=query.matches;wake()};query.addEventListener('change',change);document.addEventListener('visibilitychange',wake);page.addEventListener('pointermove',wake);
  return()=>{cancelAnimationFrame(raf);intersection.disconnect();state.disconnect();query.removeEventListener('change',change);document.removeEventListener('visibilitychange',wake);page.removeEventListener('pointermove',wake)};
 },[columnsKey,items,tilt,turn,depth,speed,variance,parallax]);
 const activate=(id,col)=>{setActive(id);hover.current=col;};const release=()=>{setActive(null);hover.current=-1;};
 return <><div className="photo-drift-wall" ref={root} role="group" aria-label="28 幅日常摄影，按色调分列" onPointerMove={e=>{const b=root.current.getBoundingClientRect();pointer.current={x:(e.clientX-b.left)/b.width-.5,y:(e.clientY-b.top)/b.height-.5};const tile=e.target.closest('[data-drift-id]');if(tile)activate(tile.dataset.driftId,Number(tile.dataset.col));else release()}} onPointerLeave={()=>{pointer.current={x:0,y:0};release()}}>
  <div className="photo-drift-plane" ref={plane}>{columnItems.map((col,c)=><div className="photo-drift-col" key={c}><div className="photo-drift-track" ref={el=>tracks.current[c]=el}>{Array.from({length:meta[c].copies},(_,copy)=>col.map((item,i)=>{const id=`${c}-${copy}-${i}`;return <figure className={'photo-drift-tile'+(active===id?' is-active':'')} data-drift-id={id} data-col={c} key={id} style={{'--photo-tile-color':item.color,height:tileSize(item)+'px',flexBasis:tileSize(item)+'px'}} tabIndex={copy===0?0:-1} role="button" aria-label={item.title+'，查看完整照片'} onClick={()=>setSelected(item)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(item)}}} onFocus={()=>activate(id,c)} onBlur={release}><span className="photo-drift-inner">{item.image?<img src={item.image} alt={item.title} width={item.width} height={item.height} loading="lazy" decoding="async" draggable={false}/>:<span className="photo-drift-empty">照片待加入</span>}</span></figure>}))}</div></div>)}</div>
 </div><dialog className="photo-viewer-v170" ref={viewer} onClose={()=>{setSelected(null);release()}} onClick={e=>{if(e.target===viewer.current)viewer.current.close()}}><button aria-label="关闭照片" onClick={()=>viewer.current.close()}>关闭 ×</button>{selected&&<img src={selected.full} width={selected.width} height={selected.height} alt={selected.title}/>}</dialog></>;
}
function Photography(){return <><header className="photo-heading"><h2 id="photoTitle">在日常里，<br/>收集光。</h2><p>这些照片记录着我对日常的留意。吸引我的，是一束光、一段色彩，或某个让我愿意停下来的瞬间。</p><p className="photo-purpose">把它们放进作品集，是想呈现影像创作之外的观察与感受。我希望保持好奇，积累真实的生活经验，再把这些细小的发现带回镜头与叙事。</p><small>28 幅摄影 · 五组色调</small></header><DriftWall/><footer className="photo-footer"><p>移入画框，让一列缓下来。点击，查看完整照片。</p></footer></>}
const page=document.getElementById('hobbyPage');if(page){let mounted=false;const mount=()=>{if(mounted)return;mounted=true;const host=document.getElementById('hobbyPhotographyMount')||document.createElement('section');host.id='hobbyPhotography';host.setAttribute('aria-label','日常摄影与漂移影像墙');if(!host.parentNode)page.append(host);createRoot(host).render(<Photography/>);};const observer=new MutationObserver(()=>{if(page.classList.contains('is-standalone-open')){mount();observer.disconnect();}});observer.observe(page,{attributes:true,attributeFilter:['class']});addEventListener('v31:open-standalone',event=>{if(event.detail?.target==='hobbyPage')mount();});if(page.classList.contains('is-standalone-open'))mount();}
