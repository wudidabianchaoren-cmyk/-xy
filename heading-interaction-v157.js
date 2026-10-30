/* Click feedback keeps the original text and all native heading/link actions. */
(()=>{
 if(window.headingInteractionV157)return;
 const state=window.headingInteractionV157={version:157,clicks:0,scriptConversion:false},active=new WeakMap();
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 function hit(target){const h=target?.closest?.('h1,h2,h3,.v31-main-copy,.v31-project-heading,.entry-title');return h&&parseFloat(getComputedStyle(h).fontSize)>=22&&!h.closest('[hidden],dialog:not([open])')?h:null;}
 function pulse(h,strong){active.get(h)?.cancel();const rect=h.getBoundingClientRect();if(!rect.width||!rect.height)return;const animation=h.animate(reduced?[{filter:'brightness(1)'},{filter:'brightness(1.22)'},{filter:'brightness(1)'}]:[{filter:'brightness(1)',transform:'translateY(0)'},{filter:'brightness(1.35)',transform:'translateY(-2px)',offset:.25},{filter:'brightness(1)',transform:'translateY(0)'}],{duration:strong?650:380,easing:'cubic-bezier(.16,1,.3,1)'});active.set(h,animation);
  if(!strong)return;state.clicks++;const mark=document.createElement('div');mark.className='heading-lock-v157';Object.assign(mark.style,{left:rect.left-9+'px',top:rect.top-5+'px',width:rect.width+18+'px',height:rect.height+10+'px'});mark.innerHTML='<i></i><i></i><i></i><i></i>';document.body.append(mark);mark.animate([{opacity:0,transform:'scale(1.045)'},{opacity:1,transform:'scale(1)',offset:.18},{opacity:0,transform:'scale(1.01)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'}).finished.catch(()=>{}).finally(()=>mark.remove());
 }
 const style=document.createElement('style');style.textContent='.heading-lock-v157{position:fixed;z-index:23000;pointer-events:none;color:#d9b56b}.heading-lock-v157 i{position:absolute;width:10px;height:8px;border-color:currentColor;border-style:solid}.heading-lock-v157 i:nth-child(1){left:0;top:0;border-width:1px 0 0 1px}.heading-lock-v157 i:nth-child(2){right:0;top:0;border-width:1px 1px 0 0}.heading-lock-v157 i:nth-child(3){right:0;bottom:0;border-width:0 1px 1px 0}.heading-lock-v157 i:nth-child(4){left:0;bottom:0;border-width:0 0 1px 1px}';document.head.append(style);
 document.addEventListener('click',e=>{const h=hit(e.target);if(h)pulse(h,true);},true);
 document.addEventListener('pointerover',e=>{const h=hit(e.target);if(h&&!h.contains(e.relatedTarget))pulse(h,false);},{passive:true});
})();
