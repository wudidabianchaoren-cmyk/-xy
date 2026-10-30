import fs from 'node:fs/promises';import assert from 'node:assert/strict';
for(const f of ['home-checks.json','visual-checks.json','feature-checks.json','runtime-checks.json','opening-production.json'])assert(JSON.parse(await fs.readFile('.verify/v32-83/'+f,'utf8')).passed,f);
const resume=`# 脑海宇宙 / CURRENT V32.83

2026-10-11。从完整 V32.82 增量，电脑端网页；不安排手机适配或手机检查。先启动现有网站，不为看效果重渲染。
预览：http://localhost:8031/v31.html?v=32.83 。逐项实际画面：http://localhost:8031/.verify/v32-83/visual-review.html 。

1. 加载片按工具形态重排：木钻竖直，石斧斜向，木轮正向，石器与陶器各有主图/辅图留白；清除石器图集里相邻火焰残片。全部原素材、人物、英文百分比、短进度条、黑底、原速度曲线和收束结尾保留。实际 Remotion 输出20秒/600帧/30fps：assets/loading-study/loading-study-v32-83.mp4；新源 motion/loading-study-v83 与 motion/remotion-v32-83。无需再次输出已完成片。
2. 主页保留已认可原生V24间接光/显示转换、V25钟盘和整体材质色彩，没有重新原生渲染。移动主光、投影与遮挡逐显示帧同步；近景钟盘拖动以及释放后的短时间强制更新接触遮蔽，清掉旧位置遮挡缓存。原六镜头、三窗路径一窗亮、骑士、铜钟、西楼灯与钟针保持。对象查找缓存，避免每帧遍历完整物件表；目录、作品环轨、子页及离屏期间暂停主页GPU绘制。鼠标光轨空闲时停止画布绘制，旧舞台粒子/激光离屏不再绘制。
3. 建筑三处新发现：左书房门打开电影手稿并进入阅读；钟亭基座打开C/E/G三音乐匣；右回廊拱门打开可拖动光之窗并进入图像滚动段。平时无常驻文字标签，悬停显示小黄铜菱形；点击空白或Escape关闭。原有交互保持。
4. 原目录布局/玻璃轻弹簧保持；作品仍进入原作品环轨，个人爱好/介绍仍是独立覆盖页，阅读学习仍为独立HTML。入口由同一短淡入淡出衔接；代码电影按钮直接在遮罩覆盖下定位，绝不滚过中间长页面。移除旧环轨对目录指针的抢先拦截，没有删除作品环轨内容。
5. 白底三段图像滚动文字改为英文，原十图、位置、缩放淡出、正反滚动保持；乡土视频保留，原两页静图合为一页主图+黄昏小图和两段温暖札记，留出固定顶栏空间。
6. 原近景旗舰保持23.18米与原火炬人物；其他三船约21.28/20.52/19.95米，分别使用赭色双帆、单桅侦察船、蓝帆补给船。帆、旗、桅杆/索具高度、木色、陶罐/木桶载荷和船员姿态/衣色/身形分开；48桨手保持，只保留旗舰火炬人物，避免四个相同主角。岛屿原形体和1010株混合森林保持：裂岩PBR沿用，增加沙地颗粒/沉积色差与细凹凸；森林远处叶粒纹理按像素过滤，削减高频闪点；浅水依据实际低岸线顶点生成距离纹理，非圆形色圈。原64秒摄影机/太阳、巨人、远景大陆、11鸟均保持。本轮是网页实时材质更新，没有声称重新Blender渲染整片岛屿。

统一性：暗暖小镇与纸白展厅作为不同展览空间保留，通过共同字体层级、页边距、黄铜小字/细线与直接页面衔接建立联系；乡土页用同样的留白和影像札记语气，不把作品的独立配色全部抹平。详见全站视觉检查_V32.83.md。

实际桌面检查：1600×900、1440×1080、1920×1080；加载成片/刷新、阅读返回、目录入口、三处建筑交互、原主页交互、正反滚动、乡土合并页与原神话机位。主页两次短测约52–60FPS、神话约57FPS，本机RTX4060；滚动抽样150帧，p95约19.6ms、最大24.1ms、无50ms长任务。不是所有设备恒定帧率承诺，首次GPU准备仍有成本。音乐匣通过实际点击和AudioContext验证；没有冒称本轮完整试听旧影片声音。

核验：.verify/v32-83-checks.json 。新完整包 E:/codex/脑海宇宙作品集/当前作品集_V32.83/；只有保存结果.json complete/currentPackageRunPassed双true、逐文件SHA及独立运行通过才称保存完成。V32.82及以前冻结。功能通过不代替用户美术验收。

长期总纲：每次先查真实额度，核对现有Skill/插件；按用户重点分配，复用已认可资产和构建缓存，不无目的下载、重建或反复渲染。此次沿用Remotion与既有Three.js/Blender资产，正式加载片只输出一次；检查只面向桌面。起始工具报告会话/周余100/100%，中途余71/95%，以后按当前实际工具读数安排。
`;
await fs.writeFile('CURRENT-V32-83-RESUME.md',resume);
for(const f of ['../AGENTS.md','AGENTS.md']){const old=await fs.readFile(f,'utf8'),marker=old.indexOf('# 脑海宇宙 / CURRENT V32.82');if(marker<0)throw Error('Unexpected current record '+f);await fs.writeFile(f,old.slice(0,marker)+resume+'\n\n以下记录为历史，不能覆盖 V32.83。\n\n'+old.slice(marker));}
const notes=`# 桌面视觉检查 V32.83

主页面偏暗暖、粒子与图像段偏纸白，这种变化可以保留，分别对应进入空间、观察细节和观看影像。分散感主要来自每页留白尺度、说明语气与入口衔接不一致；把所有背景改成同色会削弱各作品的内容。

已执行：沿用原作品集字体；白底三段英文使用与开场一致的衬线语汇；章节小字采用克制黄铜色，图文共用桌面侧边留白。乡土两页合为一页，主图与黄昏小图建立远近记忆的承接，精简文字；主图顶端避开固定音量/亮度控件。目录通过短淡入淡出直接露出目标，长页自然滚动保留。主页不再重复渲染已认可材质。

建筑交互方案与实际执行：书房门→手稿页/阅读室；钟亭基座→可演奏三音乐匣；回廊拱门→可移动光之窗/图像展厅。无额外常驻导览标签。已有钟盘、骑士、窗灯和铜钟保持。

检查实际截图：乡土页两幅图/文字无遮挡、英文三段中心构图、目录说明分行、三个建筑弹窗、原三神话机位、加载片主辅图。仅桌面，不检查手机。原神话森林在极近镜头仍有实时叶片几何的限制，不能称离线电影渲染或照片级。

技术参考为官方来源：[Three.js动态阴影](https://threejs.org/docs/pages/LightShadow.html)、[官方拾取说明](https://threejs.org/manual/pages/picking.html)、[官方交互示例](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_interactive_cubes.html)。用于同步阴影与投影热点，不复制第三方品牌或安装新插件。

效率安排：复用现有两张图集，仅改其布局与裁切；Remotion成片一次输出。复用认可的主页原生烘焙与岛屿PBR；定位现存事件拦截后统一入口。桌面真实操作、帧率与独立包运行检查保留，功能通过不等于用户视觉验收。
`;
await fs.writeFile('全站视觉检查_V32.83.md',notes);
const images=[['home-final.png','主页 · 原认可渲染保留'],['clock-drag.png','上钟盘 · 实际拖动中'],['clock-released.png','上钟盘 · 释放后'],['discovery-manuscript.png','书房门 · 电影手稿'],['discovery-music.png','钟亭基座 · 三音乐匣'],['discovery-light.png','回廊拱门 · 可移动光之窗'],['directory.png','原目录 · 布局保留'],['english-collage.png','英文图像段 · 原正反滚动'],['rural-memory.png','乡土归途 · 视频后仅一页影像札记'],['island-16.png','神话 · 原16秒机位'],['island-32.png','神话 · 原32秒机位'],['island-50.png','神话 · 旗舰与不同随行船'],['opening-8.7.png','加载片 · 木钻/石斧的主次'],['opening-11.6.png','加载片 · 石器/收获的主次'],['opening-14.7.png','加载片 · 陶器/织机与纹饰'],['opening-19.5.png','加载片 · 原收束退场保留']];
await fs.writeFile('.verify/v32-83/visual-review.html','<!doctype html><html lang="zh"><meta charset="utf-8"><title>V32.83 桌面实际画面</title><style>body{background:#141812;color:#d6ceba;font:16px/1.5 system-ui;padding:28px;margin:0}a{color:#d8b76c}main{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{width:100%;max-height:640px;object-fit:contain;background:#090b08}figcaption{padding-top:8px}</style><h1>V32.83 · 桌面实际画面</h1><p><a href="../../v31.html?v=32.83">打开完整作品集</a> · 当前网页截图，加载片列实际源动画帧；实际MP4播放另有核验。本轮没有重渲染主页或宣称新Blender岛屿。</p><main>'+images.map(([f,t])=>'<figure><img src="'+f+'"><figcaption>'+t+'</figcaption></figure>').join('')+'</main></html>');
let save=await fs.readFile('scripts/save-current-v32-82.mjs','utf8');save=save.replaceAll('32.82','32.83').replaceAll('v32-82','v32-83').replaceAll('study-v82','study-v83').replace("previous=root+'/当前作品集_V32.81'","previous=root+'/当前作品集_V32.82'").replace("'src'])","'src','全站视觉检查_V32.83.md'])");save=save.replace('本轮两钟盘局部原生修改记录在scripts/refine-clocks-v25.py','V25原生钟盘及V24烘焙复用，本轮没有再次原生建模或渲染');await fs.writeFile('scripts/save-current-v32-83.mjs',save);
let verify=await fs.readFile('scripts/verify-v32-82-package.mjs','utf8');verify=verify.replaceAll('32.82','32.83').replaceAll('v32-82','v32-83').replace("await run('.verify/v32-83/check-home.mjs');","await run('.verify/v32-83/check-home.mjs');await run('.verify/v32-83/check-features.mjs');").replace('dock/mobile/reversible-scroll','dock/desktop discoveries/direct jump/reversible-scroll');verify=verify.replace('trees:window.odysseyState.giantEye.habitats.additionalWoodlandTrees','trees:window.odysseyState.giantEye.habitats.additionalWoodlandTrees,fleet:window.odysseyState.fleetVariants,shallows:window.odysseyState.coastalDepth,manned:window.odysseyState.mannedOars');verify=verify.replace('assert.equal(result.myth.boats.length,4);',"assert.equal(result.myth.boats.length,4);assert.deepEqual(result.myth.fleet.map(s=>s.sails),[2,2,1,2]);assert.equal(result.myth.manned,48);assert(result.myth.shallows.shoreSamples>100);assert.equal(new Set(result.myth.fleet.map(s=>s.name)).size,4);");await fs.writeFile('scripts/verify-v32-83-package.mjs',verify);
await fs.writeFile('scripts/open-current-v32-83.mjs',(await fs.readFile('scripts/open-current-v32-82.mjs','utf8')).replaceAll('32.82','32.83'));
console.log('V32.83 desktop handoff and package scripts prepared');
