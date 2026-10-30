import fs from 'node:fs/promises';
const resume=`# 脑海宇宙 / CURRENT V32.82

2026-10-11。从完整 V32.81 增量。先启动现有网站，不为看效果重渲染。预览：http://localhost:8031/v31.html?v=32.82 。逐项画面：http://localhost:8031/.verify/v32-82/visual-review.html 。

用户已认可 V32.81 主页面总体渲染，本轮不重新改变环境光、原生V24烘焙或整体色彩。实际 Blender 5.1.2 后台修改钟盘几何，六条细环减为四条，保存独立原生V25钟盘补丁及GLB；网页接入真实新几何。局部铜/金色金属的粗糙度和反射微调，银色刻字环提高可读性。全部建筑导览文字标签移除，MIND UNIVERSE两行铭文保留；原六镜头、三窗路径、一窗亮、钟针、骑士、铜钟和左窗交互保留。

实际 Remotion 20秒/600帧/30fps；原黑底、人物进化、英文百分比、短进度条、原节奏和全部发现素材保留。中段分为独立的火、石器、陶器三个停留区间，同一主要位置上一张完全退场后再进入下一张。人物、文字、主图和小图有独立空间；结尾标题微缩，线段向中心收束，约19.1至19.92秒完整淡出。新成片 assets/loading-study/loading-study-v32-82.mp4；新源 motion/loading-study-v82/opening.js 和 motion/remotion-v32-82/。无需重算已完成片。

目录只保留原作品/阅读/学习/爱好/介绍列表，取消另加的ThreeUI Dock导航。借鉴Sable的玻璃形状和轻弹簧，作用于原目录卡片；弹出有克制的过冲回弹，悬停微微下落与扩大。标题和说明分行，连续编号；阅读学习仍为独立子页面。目录打开时隐藏背景控件及阅读进度，手机允许目录自然滚动。原注册ThreeUI文件未更改，保存以供参考；最新用户明确要求借鉴原动效，不继续同时挂载两个导航。

第七粒子删除信封实体和折痕粒子，保留向下雨滴、接触弹溅；无实体地面，只有轻微的椭圆波纹和渐隐水面感。雨在停留时仍下落。其他六个粒子、原动作和滚动保留。白底「图像，是想法的第一种形状」完整滚动段移到粒子之后、神话介绍之前，正反滚动保持。

岛屿使用现有真实裂岩PBR图像，修正三个投影轴的法线方向，粗糙度图实际参与材质；潮湿岸石、细沙、层岩和林地表面分别处理。原太阳方向/运镜不变，实时阴影范围扩大覆盖大岛与森林，4096阴影图。没有宣称重新在Blender渲染了整片岛屿。岛屿/巨人原形体、四船比例、64秒运镜、48桨手、11鸟、1010混合树、远景大陆与雾保持。原50秒影片、声音、五卡片、26页PDF、阅读学习、返回状态和其余页保持。

核验 .verify/v32-82-checks.json：实际20秒播放/刷新/阅读返回、原目录悬停和键盘、手机、正反滚动、原主页交互、神话三个原机位、雨水两帧及移动布局。原生钟盘和网页画面分别标记；测试通过不替代用户视觉评审。

新完整包 E:/codex/脑海宇宙作品集/当前作品集_V32.82/；保存结果complete/currentPackageRunPassed双true、逐文件SHA和独立运行才能称完成。V32.81及以前冻结。

长期总纲继续适用：先查额度和可用Skill，集中到用户重点；本轮复用Remotion、Blender、原生资产和构建缓存，不重复下载工具，不从头重建。起始工具报告周额度余18%，中途余17%；后续按工具当前报告安排必要验收与封存，不推测账户额度。
`;
await fs.writeFile('CURRENT-V32-82-RESUME.md',resume);for(const f of ['AGENTS.md','../AGENTS.md'])await fs.writeFile(f,resume+'\n\n以下记录为历史，不能覆盖 V32.82。\n\n'+await fs.readFile(f,'utf8'));
await fs.writeFile('blender/reference-architecture-v25/SESSION-STATE.md',resume+'\nV25仅是当前钟盘的原生增量补丁。完整庭院仍为V24。脚本scripts/refine-clocks-v25.py已实际执行，不为查看效果重复运行。\n');
await fs.appendFile('HOME-VISUAL-ACCEPTANCE.md','\n\n## V32.82 最新用户范围\n用户认可V32.81主体渲染；只局部改善双钟盘，删全部建筑导览标签。信封删去，改为空白背景上的雨滴波纹。目录为单一原列表加借鉴动效；图像流移动到粒子后、神话前。其他既有视觉约定与内容继续适用。\n');
let save=await fs.readFile('scripts/save-current-v32-81.mjs','utf8');save=save.replaceAll('32.81','32.82').replaceAll('v32-81','v32-82').replace("previous=root+'/当前作品集_V32.80'","previous=root+'/当前作品集_V32.81'");
save=save.replace("'v32-80.css','CURRENT","'v32-80.css','v32-82.css','CURRENT").replace("'blender/reference-architecture-v24'","'blender/reference-architecture-v24','blender/reference-architecture-v25'").replaceAll('loading-study-v32-80.mp4','loading-study-v32-82.mp4').replaceAll('opening-poster-v32-80.png','opening-poster-v32-82.png').replace("'motion/remotion-v32-80'","'motion/remotion-v32-82','motion/loading-study-v82'").replace("f.includes('-v24')","f.includes('-v24')||f.includes('-v25')");
await fs.writeFile('scripts/save-current-v32-82.mjs',save);
let verify=await fs.readFile('scripts/verify-v32-81-package.mjs','utf8');verify=verify.replaceAll('32.81','32.82').replaceAll('v32-81','v32-82').replace("await run('.verify/v32-82/check-home.mjs');","await run('.verify/v32-82/check-home.mjs');await run('.verify/v32-82/check-visual.mjs');").replace('Exact Sable','Original spring directory');await fs.writeFile('scripts/verify-v32-82-package.mjs',verify);
await fs.writeFile('scripts/open-current-v32-82.mjs',(await fs.readFile('scripts/open-current-v32-81.mjs','utf8')).replaceAll('32.81','32.82'));
const images=[['home-wide.png','完整主页 · 保持认可光影'],['clocks-close.png','双钟盘 · 真实几何减环与局部金属'],['directory.png','单一原目录'],['directory-mobile.png','手机目录'],['rain-a.png','雨滴与空白水面'],['rain-b.png','持续雨滴与波纹'],['island-16.png','原神话机位 · 16秒'],['island-32.png','原神话机位 · 32秒'],['island-50.png','原神话机位 · 50秒'],['opening-8.7.png','发现阶段 · 人物与主图分开'],['opening-11.6.png','石器阶段 · 独立停留'],['opening-14.7.png','构建阶段 · 主次拼贴'],['opening-18.7.png','结尾停留'],['opening-19.5.png','结尾微缩淡出'],['opening-19.99.png','结尾完全退场']];
await fs.writeFile('.verify/v32-82/visual-review.html','<!doctype html><html lang="zh"><meta charset="utf-8"><title>V32.82 逐项画面</title><style>body{background:#141812;color:#d6ceba;font:16px/1.5 system-ui;padding:28px;margin:0}h1{font-size:24px}a{color:#d8b76c}main{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{width:100%;max-height:640px;object-fit:contain;background:#090b08}figcaption{padding-top:8px}@media(max-width:700px){main{grid-template-columns:1fr}}</style><h1>V32.82 · 实际画面与时序</h1><p><a href="../../v31.html?v=32.82">打开完整作品集</a> · 页面与机位均为当前真实网页；加载片另列实际源动画帧，成片20秒播放已验证。</p><main>'+images.map(([f,t])=>'<figure><img src="'+f+'"><figcaption>'+t+'</figcaption></figure>').join('')+'</main></html>');
console.log('Current V32.82 handoff prepared');
