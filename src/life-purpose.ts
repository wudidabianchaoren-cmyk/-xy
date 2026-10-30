export {};
const film=document.getElementById('lifePurposeVideo') as HTMLVideoElement|null;
const host=document.getElementById('lifePurpose');
if(film&&host){
  const slides=Array.from(host.querySelectorAll<HTMLElement>('.life-process-grid>figure'));
  slides.forEach(slide=>{slide.hidden=false;slide.removeAttribute('aria-hidden');});
  const deck=host.querySelector<HTMLElement>('.life-process-grid')!;
  let expanded=false,selected=-1;
  const closeFocus=()=>{selected=-1;slides.forEach(s=>{s.classList.remove('is-selected','is-muted');s.setAttribute('aria-pressed','false');});deck.classList.remove('has-selected');};
  slides.forEach((slide,i)=>{slide.style.setProperty('--card-index',String(i));slide.style.setProperty('--card-offset',String(i-2));slide.style.setProperty('--card-angle',(i-2)*3+'deg');});
  const toggle=()=>{closeFocus();expanded=!expanded;deck.classList.toggle('is-expanded',expanded);deck.closest('.life-making-workshop')?.classList.toggle('deck-open',expanded);deck.setAttribute('aria-expanded',String(expanded));slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(!expanded&&i!==0));slide.tabIndex=expanded||i===0?0:-1;});if(expanded&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&innerWidth>700){slides.forEach((slide,i)=>{const end=`translate3d(${(i-2)*(innerWidth>1250?232:innerWidth*.18)}px,0,0) scale(${innerWidth>1250?.68:.52})`;slide.animate([{transform:'translate3d(0,0,0) rotate(0deg) scale(.82)'},{transform:`translate3d(${(i-2)*65}px,-24px,0) rotate(${(i-2)*9}deg) scale(.76)`,offset:.4},{transform:end}],{duration:850,delay:i*25,easing:'cubic-bezier(.22,1,.36,1)'});});}};
  const focusCard=(i:number)=>{if(!expanded){toggle();return;}if(selected===i){closeFocus();return;}selected=i;deck.classList.add('has-selected');slides.forEach((s,j)=>{s.classList.toggle('is-selected',j===i);s.classList.toggle('is-muted',j!==i);s.setAttribute('aria-pressed',String(j===i));});};
  deck.addEventListener('click',e=>{const i=slides.findIndex(s=>s.contains(e.target as Node));if(i>=0)focusCard(i);else if(selected>=0)closeFocus();else toggle();});
  deck.addEventListener('keydown',e=>{if(e.code==='Escape'){e.preventDefault();if(selected>=0)closeFocus();else if(expanded)toggle();}else if(e.code==='Space'||e.code==='Enter'){e.preventDefault();const i=slides.indexOf(e.target as HTMLElement);if(i>=0)focusCard(i);else toggle();}});
  slides.forEach((s,i)=>{s.tabIndex=0;s.setAttribute('role','button');s.setAttribute('aria-label','放大制作札记 '+(i+1));});
  const fold=document.createElement('button');fold.type='button';fold.className='life-deck-fold';fold.textContent='收起札记 ↗';fold.addEventListener('click',toggle);deck.after(fold);
  document.addEventListener('click',e=>{
    if(!expanded)return;
    const target=e.target as Node;
    // Focus -> spread -> stack are distinct transitions, including clicks outside the deck.
    if(selected>=0){e.preventDefault();e.stopPropagation();closeFocus();return;}
    if(!deck.contains(target)&&!fold.contains(target))toggle();
  },true);
  slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i!==0));slide.tabIndex=i===0?0:-1;});
  new IntersectionObserver(entries=>document.body.classList.toggle('is-life-purpose',entries[0].isIntersecting),{threshold:0}).observe(host);
  const files={music:'./assets/life-purpose/v32-72/life-purpose-with-music.mp4',plain:'./assets/life-purpose/v32-72/life-purpose-no-music.mp4'};
  film.poster='./assets/life-purpose/v32-72/poster.png';film.src=files.music;film.volume=.9;
  const button=host.querySelector<HTMLButtonElement>('[data-life-music]')!;
  const backgroundAudio=new Set<HTMLAudioElement>();let music=true;
  film.addEventListener('play',()=>{document.querySelectorAll('audio').forEach(a=>{if(!a.paused){backgroundAudio.add(a);a.pause();}});});
  const restoreAudio=()=>{for(const audio of backgroundAudio){if(!document.hidden)void audio.play().catch(()=>{});}backgroundAudio.clear();};
  film.addEventListener('pause',restoreAudio);film.addEventListener('ended',restoreAudio);
  button.addEventListener('click',()=>{const at=film.currentTime,resume=!film.paused;music=!music;film.pause();film.src=music?files.music:files.plain;button.textContent=music?'配乐：开启':'配乐：关闭';button.setAttribute('aria-pressed',String(music));film.addEventListener('loadedmetadata',()=>{film.currentTime=Math.min(at,film.duration||50);if(resume)void film.play().catch(()=>{});},{once:true});film.load();});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&!film.paused)film.pause();},{threshold:.05}).observe(film);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!film.paused)film.pause();});
  (window as Window&{lifePurposeState?:unknown}).lifePurposeState={ready:true,duration:50,pureJavaScriptSource:'motion/life-purpose-v2/life-film.js',get selectedCard(){return selected;},get processExpanded(){return expanded;},get withMusic(){return music;},get time(){return film.currentTime;}};
}
