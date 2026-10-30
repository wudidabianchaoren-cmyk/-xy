import fs from 'node:fs/promises';
const arrow=`<a id="returnWorks" class="project-return-arrow" data-project-return href="./v31.html?v=32.91&amp;return=1&amp;work=PROJECT" aria-label="返回作品"><svg viewBox="0 0 40 28" aria-hidden="true"><path d="M35 14H5M16 3 5 14l11 11"/></svg></a>`;
for(const project of ['after-journey','rural-return']){
 let html=await fs.readFile(project+'.html','utf8');
 html=html.replace(/<header class="project-header">[\s\S]*?<\/header>/,arrow.replace('PROJECT',project));
 html=html.replace(/<div class="film-shade"><\/div>[\s\S]*?<\/section>/,'</section>');
 html=html.replace('aria-labelledby="projectTitle"','aria-label="'+(project==='after-journey'?'后西游记影片':'乡土归途影片')+'"');
 html=html.replace(' controls playsinline preload="none"',' autoplay playsinline preload="metadata"');
 html=html.replace(/    <div class="gallery-heading">[^\n]*\n/,'');
 html=html.replace(/    <div class="gallery-caption">[^\n]*\n/,'');
 html=html.replace(/    <div class="gallery-progress"[^\n]*\n/,'');
 html=html.replace(/      <div class="glass-loading"[^\n]*\n/,'');
 html=html.replace(/<a href="\.\/v31\.html[^>]*class="about-return">[\s\S]*?<\/a>/,'');
 html=html.replace(/32\.(?:88|90)/g,'32.91').replace('</head>','<link rel="stylesheet" href="./v32-91-project.css?v=32.91"></head>');
 html=html.replace('<script src="./after-journey.js','<script src="./work-project.js?v=32.91"></script>\n<script src="./after-journey.js');
 if(project==='after-journey'){
  html=html.replace(/<h2 id="aboutTitle">[\s\S]*?<\/div><\/section>/,`<h2 id="aboutTitle">从神魔想象，<br>到上星荧屏。</h2><p>《后西游记》改编自同名神魔小说，以少年孙小圣的冒险延续西游世界。2026 年 8 月 31 日，剧集上线芒果 TV，并登陆湖南卫视黄金档，成为国内首部上星播出的 AIGC 长剧。</p><p>长篇 AI 影像的制作，不止于生成一张漂亮的画面。角色形象、场景尺度、光线方向与情绪衔接，需要在连续镜头中反复判断。这一组画面呈现冰崖、云海、宫阙与山川的视觉构建，展示作品中的空间想象与光影组织。</p><div class="project-facts"><span>作品形式<small>AIGC 长剧 / 场景影像</small></span><span>首播<small>2026.08.31</small></span><span>播出平台<small>湖南卫视 / 芒果 TV</small></span></div><p class="project-source-note">剧集背景与首播信息参考 <a href="https://www3.xinhuanet.com/ent/20260909/e457206a59d34bd5b7ee1a39cdc3c508/c.html" target="_blank" rel="noopener">新华网 · 导演专访</a>。本页展示所提供的场景画面，影片待后续补入。</p></div></section>`);
 }else{
  html=html.replace(/<h2 id="aboutTitle">[\s\S]*?<\/div><\/section>/,`<h2 id="aboutTitle">土地的距离，<br>日常的温度。</h2><p>《乡土归途》围绕山地村落、田野与人的停留组织影像。远山和雾气建立空间的距离，树下的背影与夕照把视线带回日常；环境与人物不再是分开的素材，而是同一段乡土记忆的组成。</p><p>制作从场景与光线的选择开始，再用人物位置、镜头节奏和剪辑衔接保持观看的连贯。影片之后的四幅画面，呈现远景、环境与人物关系的变化。</p><div class="project-facts"><span>作品形式<small>AI 影像 / 乡土叙事</small></span><span>视觉线索<small>山地 · 村落 · 田野</small></span><span>展示内容<small>短片与四幅画面</small></span></div><p class="project-source-note">最后一幅《走路上学》图片作为视觉参考，保留原片名与署名，区别于本页 AI 创作画面。</p></div></section>`);
  html=html.replace('alt="冰崖之间的身影"','alt="山间村落与梯田的晨雾"');
 }
 await fs.writeFile(project+'.html',html);
}
let home=await fs.readFile('home-creation.html','utf8');
home=home.replace('data-gallery-mode="manual"','data-gallery-autoplay="false"').replace(/        <div class="gallery-caption">[^\n]*\n/,'').replace(/          <div class="glass-loading"[^\n]*\n/,'');
await fs.writeFile('home-creation.html',home);
let motion=await fs.readFile('v31-motion.js','utf8');
const original=await fs.readFile('E:/codex/脑海宇宙作品集/当前作品集_V32.89/项目/v31-motion.js','utf8');
const board=original.match(/<div class="prompt-research-grid">([\s\S]*?)\n          <\/div>/);
if(!board)throw Error('Original method boards not found');
motion=motion.replace(/<div class="prompt-research-grid">[\s\S]*?\n          <\/div>/,board[0]);
await fs.writeFile('v31-motion.js',motion);
let ring=await fs.readFile('v31-works-ring.js','utf8');
ring=ring.replace(/    \["\\u4e91[^\n]+/,`    ["中秋之夜", "MID-AUTUMN NIGHT", "VIRTUAL STAGE", "VR / AI VIDEO", "./assets/works/mid-autumn/poster.webp", "./mid-autumn.html?v=32.91"],`);
ring=ring.replace('cardWidth * .37, cardHeight * .37','cardWidth * .55, cardHeight * .55');
ring=ring.replace('const condensedScale = .92 + (.34 - .92) * state.launch','const condensedScale = 1.1 + (.34 - 1.1) * state.launch');
ring=ring.replace('"熟悉的身影，走向另一片云海。"','"上星 AIGC 长剧中的场景与影像构建。"').replace('"场景练习 · 光与空间"','"真实表演与虚拟角色，共同构成中秋舞台。"');
ring=ring.replace(/32\.(?:88|90)/g,'32.91');
await fs.writeFile('v31-works-ring.js',ring);
let entry=await fs.readFile('v31.html','utf8');
entry=entry.replace('<span>WORKS</span><small>SELECTED VISUAL FIELDS</small>','<small>SELECTED WORKS / 2026</small><span>精选影像</span><em>Image. Space. Motion.</em>');
entry=entry.replace(/(src="\.\/(?:v31-motion\.js|v31-works-ring\.js|scene-dist\/scene-loader\.js)\?v=)[^"]+/g,'$132.91');
entry=entry.replace('</head>','<link rel="stylesheet" href="./v32-91.css?v=32.91"></head>').replace('</body>','<script src="./home-creation-launch.js?v=32.91"></script>\n</body>');
await fs.writeFile('v31.html',entry);
console.log('V32.91 project shells, work slot, intro and original method boards updated.');
