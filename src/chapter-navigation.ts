/** Reveal the destination, never the intervening chapters of the long page. */
let sequence=0;
export async function enterChapter(target:HTMLElement,_duration=1.2){
 if(target.dataset.researchEntry){window.dispatchEvent(new CustomEvent('v31:research-open',{detail:target.id}));target=target.closest<HTMLElement>('.research-board')??target;}
 return revealDestination(()=>{const smooth=(window as any).__v31Lenis;smooth?.resize?.();smooth?.start?.();if(smooth)smooth.scrollTo(target,{immediate:true,force:true});else window.scrollTo({top:target.getBoundingClientRect().top+scrollY,behavior:'instant'});window.dispatchEvent(new CustomEvent('v31:chapter-arrived',{detail:target.id}));});
}
async function revealDestination(change:()=>void){
 const token=++sequence,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let cover=document.getElementById('chapterJumpCover');if(!cover){cover=document.createElement('div');cover.id='chapterJumpCover';cover.setAttribute('aria-hidden','true');document.body.append(cover);}
 cover.hidden=false;cover.style.background='#0e1613';cover.getAnimations().forEach(a=>a.cancel());
 await cover.animate([{opacity:0},{opacity:1}],{duration:reduced?0:140,fill:'forwards',easing:'ease-out'}).finished.catch(()=>{});if(token!==sequence)return;
 change();
 await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));if(token!==sequence)return;
 await cover.animate([{opacity:1},{opacity:0}],{duration:reduced?0:220,fill:'forwards',easing:'ease-out'}).finished.catch(()=>{});if(token===sequence)cover.hidden=true;
}
window.addEventListener('v31:chapter-jump',e=>{const target=document.getElementById((e as CustomEvent<string>).detail);if(target)void enterChapter(target);});
window.addEventListener('v31:directory-open',e=>{const d=(e as CustomEvent<{kind:string;source:HTMLElement}>).detail;void revealDestination(()=>{if(d.kind==='works')(window as any).openWorksOrbitArchive?.(d.source);else window.dispatchEvent(new CustomEvent('v31:open-standalone',{detail:{target:d.kind}}));});});
