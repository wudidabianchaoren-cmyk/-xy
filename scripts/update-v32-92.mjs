import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const replace=(text,a,b)=>{assert(text.includes(a),'Missing '+a);return text.replaceAll(a,b);};
let ring=await fs.readFile('v31-works-ring.js','utf8');
const start=ring.indexOf('  const works = ['),end=ring.indexOf('  ].map',start);
ring=ring.slice(0,start)+`  const works = [
    ["后西游记", "人工智能长剧", "神话叙事", "长剧 · 场景与影像构建", "./assets/works/after-journey/cover-v32-92.webp", "./after-journey.html?v=32.92"],
    ["乡土归途", "乡土影像", "土地与记忆", "短片 · 环境与人物", "./assets/works/rural-return/cover.webp", "./rural-return.html?v=32.92"],
    ["湖南卫视中秋之夜", "虚拟现实舞台", "中秋舞台", "虚拟现实 · 人工智能影像", "./assets/works/mid-autumn/cover-v32-92.webp", "./mid-autumn.html?v=32.92"],
    ["暖竹光径", "场景创作", "光影研究", "数字图像 · 氛围练习", "./assets/works/orbit-previews/bamboo-sun-path.webp"],
    ["鹤洞遗骨", "场景创作", "遗迹与想象", "数字图像 · 空间练习", "./assets/works/orbit-previews/crane-cave-skull.webp"]
`+ring.slice(end);
ring=replace(ring,'cardWidth = clamp(width * .38, 600, 760);','cardWidth = clamp(width * .40, 640, 800);');ring=replace(ring,'cardHeight = cardWidth * .46875;','cardHeight = cardWidth * .5625;');ring=replace(ring,'const cellH = 600;','const cellH = 720;');
ring=replace(ring,'const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);','const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);');
ring=replace(ring,'    const sw = w / scale;\n    const sh = h / scale;\n    context.drawImage(image, (image.naturalWidth - sw) * .5, (image.naturalHeight - sh) * .5, sw, sh, x, y, w, h);','    const sw = image.naturalWidth * scale, sh = image.naturalHeight * scale;\n    context.fillStyle = "#10110f";context.fillRect(x,y,w,h);\n    context.drawImage(image, x+(w-sw)*.5, y+(h-sh)*.5, sw, sh);');
for(const[a,b]of Object.entries({'FIELD NOTE / ':'作品资料 / ','ARCHIVE IN ORBIT':'滚动切换作品','SAMPLING IMAGE / ASCII':'画面凝聚','IMAGE CONDENSED':'形态成像','COMPRESSING SOURCE':'影像展开','UNFURLING VISCOUS FILM':'空间展开','FORMING ORBIT':'作品入场','ENTERING SELECTED FIELD':'进入作品','FOLDING IMAGE FIELD':'返回脑海宇宙','上星 AIGC 长剧中的场景与影像构建。':'上星长剧的神话世界与影像构建。'}))ring=ring.replaceAll(a,b);
await fs.writeFile('v31-works-ring.js',ring);
let html=await fs.readFile('v31.html','utf8');const hs=html.indexOf('  <section class="works-orbit-archive"'),he=html.indexOf('\n  <div class="fallback"',hs);let works=html.slice(hs,he);
for(const[a,b]of Object.entries({'SELECTED WORKS / 2026':'作品选集 · 2026','精选影像':'作品','Image. Space. Motion.':'影像 · 空间 · 想象','MIND UNIVERSE':'脑海宇宙','WU XIANGYU':'吴翔宇','INDEX':'作品目录','云岭开境':'后西游记','OPENING TERRAIN':'人工智能长剧','WORLD BUILDING':'神话叙事','AIGC / DIGITAL IMAGE':'长剧 · 场景与影像构建','FIELD NOTE / 01':'作品资料 / 01','>TYPE<':'>类型<','>MEDIUM<':'>创作形式<','>YEAR<':'>年份<','>SCROLL<':'>滚动<','>DRAG<':'>拖动<','>HOVER<':'>悬停<','FORMING IMAGE FIELD':'作品入场','SCROLL / DRAG':'滚动 / 拖动','INERTIA / SNAP':'切换作品','COMPLETE INDEX':'作品目录','05 VISUAL FIELDS':'五项作品'}))works=works.replaceAll(a,b);
html=html.slice(0,hs)+works+html.slice(he);html=html.replaceAll('v=32.91','v=32.92');html=replace(html,'<link rel="stylesheet" href="./v32-91.css?v=32.92">','<link rel="stylesheet" href="./v32-91.css?v=32.92"><link rel="stylesheet" href="./v32-92.css?v=32.92">');await fs.writeFile('v31.html',html);
for(const file of['after-journey.html','rural-return.html','mid-autumn.html']){let s=await fs.readFile(file,'utf8');s=s.replaceAll('v=32.91','v=32.92').replace('</head>','<link rel="stylesheet" href="./v32-92-project.css?v=32.92"></head>');if(file==='after-journey.html'){s=s.replaceAll('./assets/works/after-journey/frame-12.webp','./assets/works/after-journey/cover-v32-92.webp').replace('孙悟空踏云而行，远处是金色日光','后西游记第一季花果山篇官方海报');s=s.replace(' hidden></video>',' data-src="./assets/works/after-journey/trailer-v32-92.mp4"></video>');s=s.replace(/<section id="about"[\s\S]*?<\/section>/,await fs.readFile('.verify/v32-92/about-after.html','utf8'));}
if(file==='rural-return.html'){s=s.replace(' hidden></video>',' data-src="./assets/works/rural-return/film-sr-v32-92.mp4"></video>').replace('03 / PROJECT NOTES','作品简介').replace('RURAL RETURN','短片 · 土地与记忆').replace('AI 影像','人工智能影像');}
if(file==='mid-autumn.html'){s=s.replaceAll('中秋晚会','湖南卫视中秋之夜').replaceAll('./assets/works/mid-autumn/poster.webp','./assets/works/mid-autumn/cover-v32-92.webp').replace('PROJECT NOTES / MID-AUTUMN GALA','作品简介').replace('VIRTUAL STAGE / AI VISUALS','虚拟现实 · 人工智能影像').replace('01 / LIVE STAGE','01 / 真实舞台').replace('02 / VIRTUAL CHARACTERS','02 / 虚拟角色').replaceAll('VR 虚拟场景与 AI 视频','虚拟现实场景与人工智能视频').replaceAll('VR / Seedance','虚拟现实 / Seedance');}
await fs.writeFile(file,s);}
console.log('Works UI, image geometry, film shells and project descriptions updated.');
