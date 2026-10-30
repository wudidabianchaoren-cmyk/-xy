/** Adapted from React Bits ClickSpark: same radial stroke/ease-out idea, on-demand frames only. */
export function archivePointerEffects(){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const canvas=document.createElement('canvas');canvas.className='archive-click-sparks';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d')!;let frame=0;let sparks:{x:number;y:number;a:number;t:number}[]=[];
 function size(){canvas.width=innerWidth;canvas.height=innerHeight;}size();window.addEventListener('resize',size);
 function paint(now:number){frame=0;ctx.clearRect(0,0,canvas.width,canvas.height);sparks=sparks.filter(s=>now-s.t<520);for(const s of sparks){const p=(now-s.t)/520,e=p*(2-p),d=e*25,l=9*(1-e);ctx.strokeStyle='#d2b477';ctx.globalAlpha=1-p;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(s.x+Math.cos(s.a)*d,s.y+Math.sin(s.a)*d);ctx.lineTo(s.x+Math.cos(s.a)*(d+l),s.y+Math.sin(s.a)*(d+l));ctx.stroke();}if(sparks.length)frame=requestAnimationFrame(paint);}
 const selector='button,a,.life-note-card,.image-chapter figure,.index-work';
 document.addEventListener('click',e=>{const item=(e.target as HTMLElement).closest(selector);if(!item||item.closest('#volumeSlider,#brightnessSlider'))return;const t=performance.now();for(let i=0;i<8;i++)sparks.push({x:e.clientX,y:e.clientY,a:i*Math.PI/4,t});if(!frame)frame=requestAnimationFrame(paint);},{capture:true});
 let previous:HTMLElement|null=null,pointerFrame=0,cx=0,cy=0;
 document.addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY;const item=(e.target as HTMLElement).closest<HTMLElement>('button:not(.home-secret-hit),.life-note-card,.image-chapter figure');if(previous!==item){previous?.classList.remove('archive-hover');previous=item;item?.classList.add('archive-hover');}if(!pointerFrame&&item)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=item.getBoundingClientRect();item.style.setProperty('--glow-x',((cx-r.x)/r.width*100).toFixed(1)+'%');item.style.setProperty('--glow-y',((cy-r.y)/r.height*100).toFixed(1)+'%');});},{passive:true});
 document.addEventListener('focusin',e=>(e.target as HTMLElement).closest('button')?.classList.add('archive-hover'));
 document.addEventListener('focusout',e=>(e.target as HTMLElement).closest('button')?.classList.remove('archive-hover'));
}
