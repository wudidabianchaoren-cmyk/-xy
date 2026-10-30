import fs from 'node:fs/promises';
const read=p=>fs.readFile(p,'utf8'),write=(p,s)=>fs.writeFile(p,s,'utf8');
await fs.mkdir('motion/home-intro-v88',{recursive:true});
let s=await read('motion/home-intro-v85/Scene.jsx');
s=s.replace("{assetBase='./'}","{assetBase='./',wideSrc,closeSrc}")
 .replace("poster=assetBase+'assets/home/home-live-poster-v32-84.png'","poster=wideSrc||assetBase+'assets/home/home-live-poster-v32-84.png',close=closeSrc||assetBase+'blender/home-intro-v32-88/clock-close-cycles.png'")
 .replace("src={poster} style={{...image,scale:2.65,transformOrigin:'49% 40%'}}","src={close} style={{...image,scale:v(0,3,1.025,1),transformOrigin:'50% 50%'}}")
 .replace('opacity:v(14.5,16,1,0)','opacity:v(14.6,15.8,1,0)');
await write('motion/home-intro-v88/Scene.jsx',s);
s=await read('v31-motion.js');
s=s.replace("  const reducedMotion =",`  // Decide replay from the position before a reload, never from the newly reset scroll.
  try { const nav=performance.getEntriesByType('navigation')[0];
    if(nav?.type==='reload'&&sessionStorage.getItem('brain-universe-last-view')==='home'&&!new URLSearchParams(location.search).has('return'))document.body.dataset.homeIntroReplay='true';
  }catch{}
  const reducedMotion =`);
s=s.replace("sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}}});",`sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));const home=document.querySelector('.home-rendered-architecture')?.getBoundingClientRect();const isHome=home&&home.bottom>innerHeight*.55&&home.top<innerHeight*.25&&!document.body.classList.contains('works-orbit-open')&&!document.body.classList.contains('is-project-active');sessionStorage.setItem('brain-universe-last-view',isHome?'home':'other');}catch{}}});`);
s=s.replace(/      const ruralProject = `[\s\S]*?\n      `;\r?\n/,'').replace('        ${ruralProject}\n','').replace('        ${ruralProject}\r\n','');
await write('v31-motion.js',s);
s=await read('v31-works-ring.js');
s=s.replace('"./after-journey.html?v=32.87"','"./after-journey.html?v=32.88"');
s=s.replace(/    \["\\u96fe\\u5bab\\u6b8b\\u5f71"[^\n]+/, '    ["乡土归途", "RURAL RETURN", "LANDSCAPE / MEMORY", "AIGC / FILM STUDY", "./assets/works/rural-return/cover.webp", "./rural-return.html?v=32.88"],');
s=s.replace(/  const projectButton=document.createElement\('button'\);[\s\S]*?archive.appendChild\(projectButton\);\r?\n/,'');
s=s.replace(/    projectButton.hidden=[^\n]+\r?\n/g,'').replace('projectButton.focus({preventScroll:true})','closeButton.focus({preventScroll:true})');
s=s.replace("url.searchParams.set('v','32.87');url.searchParams.set('return','1');url.searchParams.set('work','after-journey');","url.searchParams.set('v','32.88');url.searchParams.set('return','1');url.searchParams.set('work',new URL(work.href,location.href).pathname.split('/').pop().replace('.html',''));");
s=s.replace("projectFrame.title='后西游记 · 独立作品页'","projectFrame.title=work.title+' · 独立作品页'").replace("{brainWork:'after-journey'}","{brainWork:url.searchParams.get('work')}");
s=s.replace(/  projectButton.addEventListener[^\n]+\r?\n/,'');
s=s.replace(/  window.addEventListener\('popstate',[^\n]+/,`  window.addEventListener('popstate',()=>{const i=works.findIndex(w=>w.href&&location.pathname.endsWith(new URL(w.href,location.href).pathname));if(i<0){if(projectFrame)finishProjectReturn();}else if(!projectFrame){if(!opened)open(null,{index:i});rotation=-i*STEP;updateInfo(i,true);openProject(false);}});`);
s=s.replace("explicit=url.searchParams.get('work')==='after-journey'","explicit=['after-journey','rural-return'].includes(url.searchParams.get('work'))");
// STEP is the existing ring increment; retain the existing rotation sign and state API.
s=s.replace('rotation=-i*STEP','rotation=-i*(Math.PI*2/COUNT)');
await write('v31-works-ring.js',s);
s=await read('v31-sand-story.js');
s=s.replace('      opacity[particle] = density < cutoff ? 0 : clamp(.5 + Math.pow(density, .68) * .5);',`      opacity[particle] = density < cutoff ? 0 : clamp(.5 + Math.pow(density, .68) * .5);
      // Remove only the thin protruding corner above the lens hood. Keep the
      // seeded positions and all other camera particles exactly as sampled.
      if(sceneIndex===1&&uvX>.704&&uvX<.720&&uvY>.205&&uvY<.236){
        const hoodTop=.250-(uvX-.635)*.38;
        if(uvY<hoodTop){opacity[particle]=0;densityValues[particle]=0;}
      }`);
await write('v31-sand-story.js',s);
s=await read('src/scene-loader.ts');s=s.replace('v31-sand-story.js?v=32.75','v31-sand-story.js?v=32.88');await write('src/scene-loader.ts',s);
s=await read('v31.html');
s=s.replace(/(v31-motion\.js|v31-works-ring\.js|scene-dist\/scene-loader\.js|scene-dist\/dock\/home-designed-intro\.js)\?v=32\.\d+/g,'$1?v=32.88');
// Remove the initial rural placeholders too; the main archive is hydrated below.
s=s.replace(/<article class="image-chapter[^\"]*" data-group="rural"[\s\S]*?<\/article>/g,'');
await write('v31.html',s);
s=await read('after-journey.html');s=s.replaceAll('32.87','32.88').replace('<body>','<body data-project="after-journey">').replace('frame-01.webp','frame-05.webp');await write('after-journey.html',s);
await fs.copyFile('scripts/build-dock-v32-85.mjs','scripts/build-dock-v32-88.mjs');
console.log('V32.88 incremental source updates written');
