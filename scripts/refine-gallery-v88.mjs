import fs from 'node:fs/promises';
let s=await fs.readFile('after-journey.js','utf8');
s=s.replace("const selected=[0,4,8,11],groups=[[0,1],[2,3]],folder='./assets/works/after-journey/';","const project=document.body.dataset.project||'after-journey',rural=project==='rural-return',selected=rural?[0,1,2,3]:[4,8,10,11],groups=[[0,1],[2,3]],folder='./assets/works/'+project+'/';");
s=s.replace("room.innerHTML=`<div class=\"glass-frame\"><div class=\"glass-wall\">${artwork}</div></div><div class=\"glass-plane glass-ceiling\"><div class=\"glass-underlay\">${artwork}</div>${artwork}</div><div class=\"glass-plane glass-floor\"><div class=\"glass-underlay\">${artwork}</div>${artwork}</div>`;",`room.innerHTML=\`<div class="glass-frame"><div class="glass-plane glass-ceiling">\$\{artwork\}</div><div class="glass-wall">\$\{artwork\}</div><div class="glass-plane glass-floor">\$\{artwork\}</div></div><div class="glass-reflection reflection-top">\$\{artwork\}</div><div class="glass-reflection reflection-bottom">\$\{artwork\}</div>\`;`);
s=s.replace('  stage.prepend(room);',`  stage.prepend(room);
  new ResizeObserver(()=>room.style.setProperty('--room-perspective',stage.clientHeight*1.666+'px')).observe(stage);`);
s=s.replace("['50% 50%','0% 80%','50% 50%','50% 50%'][groups[group][i]]","manifest.frames[selected[groups[group][i]]].position||'50% 50%'");
s=s.replace("document.querySelectorAll('a[href*=\"work=after-journey\"]')","document.querySelectorAll('a[href*=\"work=\"]')");
s=s.replace("  new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;}","  const filmElement=document.getElementById('projectFilm');new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)filmElement.pause();},{threshold:.05}).observe(filmElement);\n  new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;}");
await fs.writeFile('after-journey.js',s);
let css=await fs.readFile('after-journey.css','utf8');
// Retain the original film and notes design. Replace the accumulated gallery
// overrides with one coordinate system, measured from its actual viewport.
css=css.slice(0,css.indexOf('/* The central wall'));
css+=`\nhtml{scroll-snap-type:y mandatory;scroll-padding-top:72px}main>section{scroll-snap-align:start;scroll-snap-stop:always}
.project-header{height:72px;background:#080a0b}
.project-gallery{height:calc(100vh - 72px);min-height:0;padding:0;overflow:hidden}
.gallery-viewport{position:relative;height:100%;overflow:hidden;background:#030303}
.gallery-heading{top:20px;left:4vw;z-index:4;display:flex;align-items:baseline;gap:24px}.gallery-heading h2{font-size:15px;margin:0}.gallery-heading .eyebrow{font-size:8px}
.glass-stage{position:absolute;inset:0;height:100%;min-height:0;outline:none!important;cursor:auto}
.glass-room{position:absolute;inset:0;overflow:hidden;perspective:var(--room-perspective,1380px);perspective-origin:50% 50%;opacity:0;transition:opacity .45s;pointer-events:none}
.is-ready .glass-room{opacity:1}
.glass-frame{position:absolute;left:18%;top:20%;width:64%;height:60%;transform-style:preserve-3d}
.glass-wall{position:absolute;inset:0;overflow:hidden;background:#050505;transform:translateZ(.01px);backface-visibility:hidden}
.glass-artwork{position:absolute;inset:0;overflow:hidden}
.glass-pair{position:absolute;inset:0;display:grid;grid-template-columns:1fr;grid-template-rows:1fr 1fr;gap:0;will-change:transform}
.glass-outgoing{transform:translateY(0)}.glass-incoming{transform:translateY(-100%)}
.glass-room img{display:block;position:relative;inset:auto;width:100%;height:100%;min-width:0;min-height:0;object-fit:cover;transform:none;filter:none;opacity:1}
.glass-plane{position:absolute;left:0;width:100%;height:100%;overflow:hidden;border:0;box-shadow:none;backface-visibility:hidden;opacity:.30}
.glass-ceiling{bottom:100%;transform-origin:50% 100%;transform:rotateX(-88deg)}
.glass-floor{top:100%;transform-origin:50% 0%;transform:rotateX(88deg)}
.glass-plane .glass-artwork{transform:scaleY(-1);filter:blur(.65px) saturate(.8) brightness(.76)}
.glass-reflection{position:absolute;left:0;width:100%;height:20%;overflow:hidden;z-index:2;opacity:.82;mix-blend-mode:screen}
.reflection-top{top:0;clip-path:polygon(0 0,100% 0,82% 100%,18% 100%);mask-image:linear-gradient(to bottom,transparent,#0001 22%,#0008 66%,#000)}
.reflection-bottom{top:80%;clip-path:polygon(18% 0,82% 0,100% 100%,0 100%);mask-image:linear-gradient(to bottom,#000,#0008 34%,#0001 78%,transparent)}
.glass-reflection .glass-artwork{left:18%;width:64%;height:300%;transform:scaleY(-1);filter:blur(.65px) saturate(.88) brightness(1.15)}
.reflection-top .glass-artwork{top:-200%}.reflection-bottom .glass-artwork{top:0}
.glass-stage>img{opacity:0}.glass-loading{z-index:3}
.gallery-caption{left:4vw;right:4vw;bottom:24px;z-index:4;pointer-events:none;gap:24px}.gallery-caption h3{font-size:12px;letter-spacing:.08em}.gallery-caption .gallery-scroll-hint{margin-left:auto;font-size:8px;letter-spacing:.15em}.gallery-scroll-hint i{font-style:normal;font-size:17px;margin-left:13px}
.gallery-progress{position:absolute;right:4vw;top:50%;display:flex;flex-direction:column;gap:13px;transform:translateY(-50%);z-index:4}.gallery-progress i{display:block;width:2px;height:20px;background:#ffffff25;transition:background .2s,height .2s}.gallery-progress i.is-active{height:35px;background:#c6ad80}
.project-film-video{z-index:2}.film-shade{pointer-events:none}.film-heading{transition:opacity .25s;pointer-events:none}.film-heading.is-film-playing{opacity:0}.film-next{z-index:3}
.project-arrival{z-index:100}@media(prefers-reduced-motion:reduce){.glass-room{transition:none}}
`;
await fs.writeFile('after-journey.css',css);
let html=await fs.readFile('after-journey.html','utf8');
html=html.replaceAll('after-journey','rural-return').replaceAll('后西游记','乡土归途').replaceAll('AFTER THE JOURNEY','RURAL RETURN').replace('SELECTED WORK 01','SELECTED WORK 02');
html=html.replaceAll('frame-12.webp','poster.webp').replaceAll('frame-05.webp','frame-01.webp').replace('孙悟空踏云而行，远处是金色日光','田野、村落与山间的雾');
html=html.replace('熟悉的身影，走向另一片云海。','从远山的雾，到一个人的停留。').replace('影片即将放在这里','乡土影像 / 01:23').replace('FILM / COMING NEXT','FILM / RURAL RETURN');
html=html.replace(/<h2 id="aboutTitle">[\s\S]*?<div class="project-facts">/,`<h2 id="aboutTitle">从远山，<br>到身边。</h2><p>山间的雾、梯田和村落，留下故乡的距离；田野里的余晖与背影，让目光回到一个人的停留。我想保留土地上正在发生的生活，也记录变化中依然熟悉的感受。</p><p>这里把原短片和四幅画面放在一起：影片是结果，静帧记录对光线、环境和人物位置的尝试。最后一幅《走路上学》为视觉参考，原图署名保留。</p><div class="project-facts">`);
// Both projects share the same gallery implementation, not duplicate runtimes.
html=html.replace('./rural-return.css?v=32.88','./after-journey.css?v=32.88').replace('./rural-return.js?v=32.88','./after-journey.js?v=32.88');
await fs.writeFile('rural-return.html',html);
console.log('Aligned folded galleries and rural project written');
