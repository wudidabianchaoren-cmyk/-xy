const section=document.querySelector<HTMLElement>('#workFlow.scroll-collage');
if(section&&!section.dataset.collageReady){
 const copy=[...section.querySelectorAll<HTMLElement>('h2')],host=section.querySelector('.scroll-collage-images')!;
 const pictures=[1,2,3,4,5,6,8,9,10,11].map(i=>`./assets/atmosphere-v172/atmosphere-${String(i).padStart(2,'0')}.webp`);
 // Proportions and trajectories measured from the live reference's expertise section.
 const layouts=[[.06,.21,.155],[.25,.21,.155],[.44,.21,.155],[.63,.21,.155],[.82,.21,.155],[.06,.75,.155],[.25,.75,.155],[.44,.75,.155],[.63,.75,.155],[.82,.75,.155]];
 host.replaceChildren();const existing:HTMLImageElement[]=[];const cards=pictures.map((src,i)=>{const img=existing[i]??document.createElement('img');img.src=src;img.alt='';img.loading='lazy';const [x,y,w]=layouts[i];img.style.cssText=`left:${x*100}%;top:${y*100}%;width:${w*100}%;height:auto;aspect-ratio:16/9;object-fit:cover;filter:saturate(.86) contrast(1.025);`;host.append(img);return img;});
 const clamp=(n:number)=>Math.max(0,Math.min(1,n));const ease=(a:number,b:number,t:number)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};let active=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const state={version:177,progress:0,text:0,reversible:true,imageCount:cards.length,frameAspectRatio:'16/9'};(window as any).scrollCollageState=state;
 function draw(){const rect=section!.getBoundingClientRect();const p=clamp(-rect.top/(rect.height-innerHeight));state.progress=p;
  copy.forEach((el,i)=>{const start=i*.32,u=clamp((p-start)/.32),enter=i===0?1:ease(start-.14,start+.035,p),exit=i===2?ease(.91,1,p):ease(start+.19,start+.32,p);const scale=1-.40*ease(start,start+.23,p);const y=(1-enter)*innerHeight*.27-exit*innerHeight*.18;el.style.transform=`translate(-50%,-50%) translateY(${y}px) scale(${scale})`;el.style.opacity=String(enter*(1-exit));});
  state.text=Math.min(2,Math.floor(p/.32));
  cards.forEach((img,i)=>{const stagger=ease(-.035+i*.009,.30+i*.009,p),end=ease(.90,1,p),[x,y]=layouts[i],dx=x>.5?1:-1,dy=y<.5?-1:1;img.style.opacity=String(stagger*(1-end*.5));img.style.transform=`translate(${(reduced?0:dx*(1-stagger)*18)}px,${(reduced?0:dy*(1-stagger)*18-end*12)}px) scale(1)`;});
 }
 const observer=new IntersectionObserver(([e])=>{active=e.isIntersecting;if(active){for(const image of cards){image.loading='eager';void image.decode().then(draw).catch(()=>{});}draw();}},{rootMargin:'400px'});observer.observe(section);
 window.addEventListener('scroll',()=>{if(active)draw();},{passive:true});window.addEventListener('resize',draw);draw();section.dataset.collageReady='177';window.addEventListener('pageshow',draw);document.fonts.ready.then(draw);
}
