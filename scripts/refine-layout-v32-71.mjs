import {readFile,writeFile} from 'node:fs/promises';
let html=await readFile('v31.html','utf8'),motion=await readFile('v31-motion.js','utf8');
if(!html.includes('data-compact-research="v32-71"')){
 const old=html.match(/<div class="research-journal">[\s\S]*?<\/div>\s*<\/article>\s*<\/section>/)?.[0];
 if(!old)throw Error('Current research journal boundary not found');
 const about=html.match(/<nav class="about-archive-portals"[\s\S]*?<\/nav>/)?.[0]??'';
 const entries=[
  ['reading','01 / READING','让阅读进入画面','从电影语言、神话与视觉理论中，提取景别、人物关系和留白。把想法带进作品，再用画面回看问题。','./assets/journey/previews/journey-mountain-valley.webp','画面与叙事的观察','电影语言 · 视觉叙事 · 影像历史'],
  ['learning','02 / PRACTICE','在制作里学习','通过建模、物理材质与镜头测试，把工具变成具体的叙事选择。右侧是本次原生 Blender 场景的真实渲染。','./blender/reference-architecture-v17/courtyard-cycles-wide.png','本次原生场景的 Blender Cycles 渲染','空间 · 材质 · 镜头'],
  ['experiment','03 / EXPERIMENT','保留有用的试验','把形体、布料和光照分别检查，再放回完整镜头。每一次修正都为主体和故事服务。','./blender/reference-architecture-v17/cyclops-cycles-costume.png','本次独眼巨人服装的原生渲染','形体 · 织物 · 光影'],
  ['about','04 / ABOUT','吴翔宇 · 视觉与影像','从观察、采集到生成与重组，探索传统叙事在数字空间里的表达。作品、兴趣与履历各有独立入口。','./assets/wu-xiangyu-portrait.png','吴翔宇肖像','观察 · 创作 · 继续']
 ];
 const journal='<div class="research-journal">'+entries.map(([id,number,title,copy,img,alt,tags],i)=>`<article class="research-entry" id="research-${id}" data-research-entry="${id}" role="tabpanel" aria-labelledby="research-tab-${id}"${i?' hidden':''}><div class="research-entry-body"><small>${number}</small><h3>${title}</h3><p>${copy}</p><span class="research-tags">${tags}</span>${id==='about'?about:''}</div><figure class="research-study-image"><img src="${img}" alt="${alt}" loading="lazy" decoding="async"></figure></article>`).join('')+'</div>\n      </article>\n    </section>';
 html=html.replace(old,journal).replace('class="image-chapter research-board is-lab"','class="image-chapter research-board is-lab" data-compact-research="v32-71"');
 html=html.replace(/<article class="image-chapter is-method">[\s\S]*?<\/article>/,'').replace(/<article class="image-chapter is-lab is-reverse">[\s\S]*?待编辑灰白页面[\s\S]*?<\/article>/,'');
 html=html.replace('翻阅五张制作札记，看看每一个小答案如何走进画面。','五张小札记，记录故事、素材、动作、声音与最后的收束。').replace(/<div class="life-making-controls">[\s\S]*?<\/div>/,'');
 html=html.replace(/<figure hidden><img loading="lazy" decoding="async" src="\.\/assets\/life-purpose/g,'<figure><img loading="lazy" decoding="async" src="./assets/life-purpose');
 html=html.replace('<div class="life-process-grid" role="region" aria-label="制作札记" tabindex="0">','<div class="life-process-grid" role="region" aria-label="五张制作札记同时展示">');
 for(const [id] of entries)html=html.replace(`data-research-target="research-${id}" tabindex="0" role="button"`,`id="research-tab-${id}" data-research-target="research-${id}" tabindex="${id==='reading'?0:-1}" role="tab" aria-selected="${id==='reading'}"`);
 html=html.replace('<div class="research-grid">','<div class="research-grid" role="tablist" aria-label="创作笔记">');
 motion=motion.replace(/        <article class="image-chapter is-method" data-group="method">[\s\S]*?<\/article>/,'');
 motion=motion.replace('<h2>图像星图</h2>','<h2>作品索引</h2>').replace('十四张图不再作为静态缩略图堆放，而是按世界、天宫、竹林、洞穴、雪原和赤云的节奏被组织成横向流动的视觉索引。','从山野到天宫，按空间与情绪浏览。点击图像，进入作品。');
 const start=motion.indexOf('  function initResearchJournal() {'),end=motion.indexOf('  function initExhibition() {',start);if(start<0||end<0)throw Error('Research behaviour boundary missing');
 motion=motion.slice(0,start)+`  function initResearchJournal() {
    const board=document.querySelector('[data-compact-research]');
    const cards=[...document.querySelectorAll('[data-research-target]')],entries=[...document.querySelectorAll('[data-research-entry]')];
    if(!board||!cards.length)return;
    function select(id){
      if(!entries.some(e=>e.id===id))return;
      cards.forEach(c=>{const active=c.dataset.researchTarget===id;c.classList.toggle('is-active',active);c.setAttribute('aria-selected',String(active));c.tabIndex=active?0:-1;});
      entries.forEach(e=>{e.hidden=e.id!==id;});
      const panel=document.getElementById(id);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
      window.__v31Lenis?.resize?.();
    }
    cards.forEach((card,i)=>{
      card.addEventListener('click',()=>select(card.dataset.researchTarget));
      card.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();select(card.dataset.researchTarget);}if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?cards.length-1:(i+(event.key==='ArrowRight'?1:cards.length-1))%cards.length;select(cards[n].dataset.researchTarget);cards[n].focus();}});
    });
    window.addEventListener('v31:research-open',e=>select(e.detail));
    document.addEventListener('click',e=>{const id=e.target.closest?.('[data-index-target]')?.dataset.indexTarget;if(id?.startsWith('research-'))select(id);},true);
    select('research-reading');
  }

`+motion.slice(end);
}
html=html.replace('v31-final.css?v=32.70','v31-final.css?v=32.71');motion=motion.replaceAll('loading-study-v32-70.mp4?v=32.70','loading-study-v32-71.mp4?v=32.71').replaceAll('opening-poster-v32-70.png','opening-poster-v32-71.png');
await writeFile('v31.html',html);await writeFile('v31-motion.js',motion);
await writeFile('src/loading-study.ts',"// Current 20s entry is authored in motion/loading-study-v2/opening.js and exported once.\n// The obsolete end-page study has been removed; do not fetch prior portfolio pictures.\nexport {};\n");
console.log('V32.71 compact layouts and new entry film integrated.');
