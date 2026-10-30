import fs from 'node:fs/promises';
let html=await fs.readFile('v31.html','utf8');
html=html.replace(/    <button class="works-orbit-info-toggle"[\s\S]*?<\/button>\s*/,'');
html=html.replace('</head>','<link rel="stylesheet" href="./v32-90.css?v=32.90">\n</head>');
html=html.replace(/(v31-works-ring\.js|v31-motion\.js)\?v=[\d.]+/g,'$1?v=32.90');
html=html.replace('<small id="worksOrbitEnglish">OPENING TERRAIN</small>','<small id="worksOrbitEnglish">OPENING TERRAIN</small><p id="worksOrbitDescription" class="works-orbit-description"></p>');
await fs.writeFile('v31.html',html);
let ring=await fs.readFile('v31-works-ring.js','utf8');
ring=ring.replace('after-journey/cover.webp','after-journey/frame-05.webp').replaceAll('v=32.89','v=32.90');
ring=ring.replace('return width > 1800 ? .72 : .76;','return .90;');
ring=ring.replace('const cellW = 768;','const cellW = 1280;').replace('const cellH = 768;','const cellH = 600;');
ring=ring.replace('cardWidth = clamp(width * .225, 400, 450);','cardWidth = clamp(width * .38, 600, 760);').replace('cardHeight = cardWidth;','cardHeight = cardWidth * .46875;');
ring=ring.replace('clamp(cardWidth * .052, 13, 17)','4').replace('smoothstep(-4.5,-.8,surfaceD)','smoothstep(-1.2,-.2,surfaceD)').replace('vec3(.7,.735,.72)','vec3(.58,.49,.36)');
ring=ring.replace('bridgeAlpha*.96','bridgeAlpha*.42').replace('vec3(.004,.006,.005),vec3(.048,.054,.05)','vec3(.28,.23,.16),vec3(.38,.32,.23)');
ring=ring.replace('fields.english.textContent = work.english;','fields.english.textContent = work.english;\n      setText(document.getElementById("worksOrbitDescription"), ["熟悉的身影，走向另一片云海。", "从远山到身边，保存土地与日常的记忆。", "场景练习 · 光与空间", "场景练习 · 色彩与氛围", "场景练习 · 遗迹与想象"][index]);');
await fs.writeFile('v31-works-ring.js',ring);
let motion=await fs.readFile('v31-motion.js','utf8');
motion=motion.replace('WORKS / JOURNEY VISUAL ARCHIVE','WORKS / SELECTED PROJECTS').replace('十四张西游视觉场景组成一条可进入的影像航线。每张图拥有独立构图、色彩、动态设想与章节作用。','从影像项目到场景练习，看看画面如何成为故事。').replace('进入十四组作品','选择一件作品');
const diagrams=[
 '<svg viewBox="0 0 400 235" role="img" aria-label="前景、中景、后景三个深度层次"><path d="M30 192L365 55M34 208L371 92" stroke="currentColor" stroke-width="1" opacity=".3"/><path d="M56 71L156 91V190L56 167Z" fill="#c5aa78" fill-opacity=".30" stroke="currentColor"/><path d="M174 48L260 66V146L174 126Z" fill="#737b68" fill-opacity=".30" stroke="currentColor"/><path d="M292 28L348 42V100L292 87Z" fill="#bdb09b" fill-opacity=".30" stroke="currentColor"/><circle cx="331" cy="56" r="10" fill="#be9b59"/><text x="62" y="219">01 / FOREGROUND</text><text x="174" y="169">02 / MIDGROUND</text><text x="278" y="122">03 / BACKGROUND</text></svg>',
 '<svg viewBox="0 0 400 235" role="img" aria-label="行动、资产、镜头的三个制作步骤"><path d="M35 154C115 154 108 54 197 54S273 154 365 154" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="#ebe4d6" stroke="currentColor"><circle cx="44" cy="154" r="12"/><circle cx="198" cy="54" r="12"/><circle cx="357" cy="154" r="12"/></g><g fill="#b39661"><circle cx="44" cy="154" r="4"/><circle cx="198" cy="54" r="4"/><circle cx="357" cy="154" r="4"/></g><text x="24" y="198">ACTION</text><text x="174" y="96">ASSETS</text><text x="332" y="198">SHOTS</text><path d="M24 220H376" stroke="currentColor" opacity=".2"/></svg>',
 '<svg viewBox="0 0 400 235" role="img" aria-label="连续镜头共用角色、光线与色彩锚点"><g fill="none" stroke="currentColor"><rect x="30" y="57" width="104" height="115"/><rect x="148" y="57" width="104" height="115"/><rect x="266" y="57" width="104" height="115"/><path d="M30 135L77 93L113 116L134 102M148 135L200 93L231 115L252 102M266 135L315 93L350 116L370 102" opacity=".5"/><path d="M45 35H355" stroke-dasharray="3 6"/></g><g fill="#b39661"><circle cx="103" cy="80" r="9"/><circle cx="220" cy="80" r="9"/><circle cx="338" cy="80" r="9"/></g><text x="111" y="214">CONTINUITY / REVIEW</text></svg>'
];
const notes=[['先决定空间，再描述画面。','明确前、中、后景的尺度与遮挡。','光源需要有来处；镜头移动需要有目的。'],['先找到行动，再组织资产。','从故事的核心行动出发，整理场景与角色锚点。','镜头逐段验证，保留可复用的视觉约束。'],['连续性需要逐镜头检查。','对照人物、光向与色彩，辨认相邻镜头的差异。','记录镜头的修正，保留每次选择的依据。']];
const old='${promptItems.map((item, index) => `<section class="prompt-plate">\n              <figure data-note="${item.note}"><img src="${item.src}" data-full-src="${item.src}" alt="${item.label}" loading="lazy" decoding="async"></figure>\n              <div class="prompt-plate-caption"><small>${String(index + 1).padStart(2, "0")} / 03</small><h3>${item.label}</h3><p>${item.note}</p></div>\n            </section>`).join("")}';
const cards=notes.map((n,i)=>`<section class="prompt-plate method-note"><div class="method-visual">${diagrams[i]}</div><div class="prompt-plate-caption"><small>0${i+1} / METHOD</small><h3>${n[0]}</h3><p>${n[1]}</p><p>${n[2]}</p></div></section>`).join('');
if(!motion.includes(old))throw Error('Method template changed; inspect before replacement.');
motion=motion.replace(old,cards).replace('<h2>提示词结构实验</h2>','<h2>提示词与镜头笔记</h2>');
await fs.writeFile('v31-motion.js',motion);
for(const file of ['after-journey.html','rural-return.html']){
 let h=await fs.readFile(file,'utf8');h=h.replace(/after-journey\.js\?v=[\d.]+/g,'after-journey.js?v=32.90');
 if(file==='after-journey.html')h=h.replace(/<div class="gallery-progress"[\s\S]*?<\/div>/,'').replace('</head>','<link rel="stylesheet" href="./v32-90-gallery.css?v=32.90"></head>').replaceAll('v=32.88','v=32.90');
 await fs.writeFile(file,h);
}
console.log('V32.90 layout and local method notes updated.');
