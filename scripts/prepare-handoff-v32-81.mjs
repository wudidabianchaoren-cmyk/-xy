import fs from 'node:fs/promises';
const resume=`# 脑海宇宙 / CURRENT V32.81

2026-10-11。从完整 V32.80 增量，本轮仅修正主页 Blender 到网页的渲染接入。预览：http://localhost:8031/v31.html?v=32.81 。对照：http://localhost:8031/.verify/v32-81/visual-review.html 。先启动现有网站，不为查看效果重渲染。

实际完整原生 V24 沿用 V23，保存所有建筑、森林、原相机动作。先经 Blender MCP 检查，随后在独立 Blender 5.1.2 CUDA 后台进程完成三组 Cycles AO 与间接漫反射烘焙，16 samples、2048/1024/1024 atlas；新 UV2 和对应几何一起导出。交互上下文最初无法进入正确编辑模式，已改用后台烘焙；最终通过 MCP 从保存文件回读确认三组双UV与完整37541网格。不是只保存证明图。

网页读取真正连接到 Principled 的纹理乘数与基础颜色，避免把未接入的默认0.8色值当成材质颜色。真实三组间接光和AO已接到实时石墙、石檐及深回廊；保留持续变化的直接光与动态阴影。读取当前庭院的实际 Cycles 全景反射，替代外部天空环境；原生5.5×5米主面积光沿原路径移动，复用实时主光遮挡。原生 AgX/None/-0.30EV 显示转换经实际 Blender image.save_render 导出并在网页执行，删除原额外调色。金属恢复接收阴影；地面1536×864反射、低模糊及能量混合，去过量提亮；回廊灯具改向内照明，限制叠加补光。移除已经被新模型覆盖的V23石材重复加载。

保持六镜头16秒仅首次、原三窗路径与一窗亮、链条骑士、钟盘/钟针/铜钟/西楼灯、五建筑导航和41树；动态材质及动作仍使用实时3D。原20秒加载片、七粒子、原64秒神话与四船、影片声音、五卡片、26页书籍、阅读学习与返回逻辑不改。

实际核验见 .verify/v32-81-checks.json：同机位静帧、实际连续运镜、交互、准备时长与帧率，及原资源SHA。原生Cycles、网页截图分别标记；完整封存或功能通过不等于用户视觉验收，也不称离线与实时逐像素相同。静态间接光为参考光照的烘焙，移动直接光与遮挡仍实时计算。

新包：E:/codex/脑海宇宙作品集/当前作品集_V32.81/ 。保存结果 complete/currentPackageRunPassed 双true、逐文件SHA及独立运行才代表完整保存。V32.80及以前包冻结。

长期总纲：每次先查额度、核对已安装Skill/插件；集中资源到用户指定重点，复用认可素材与原生文件，不无目的下载、重建或重渲染。此次额度起始会话余29%，实施后里程碑余14%，留出必要验收与封存；实际消耗由工具报告记录，不推测账户额度。
`;
await fs.writeFile('CURRENT-V32-81-RESUME.md',resume);
for(const file of ['AGENTS.md','../AGENTS.md']){const old=await fs.readFile(file,'utf8');await fs.writeFile(file,resume+'\n\n以下记录为历史，不能覆盖 V32.81。\n\n'+old);}
await fs.writeFile('blender/reference-architecture-v24/SESSION-STATE.md',resume+'\n原生增量文件：current-complete-courtyard.blend、baked-architecture.glb、bake-audit.json、look-calibration.json、display-transform.*、reflection-probe.*、matched-wide-cycles.png、final-native-audit.json。运行脚本 scripts/*v24.py。已完成，不重复烘焙或重算证明图。GUI/MCP工作实例9877保留，旧用户GUI与C4D不动。\n');
await fs.appendFile('HOME-VISUAL-ACCEPTANCE.md','\n\n## V32.81 渲染接入修复\n\n本轮读取实际连接的Blender材质因子，接入三组真实Cycles AO/间接光、庭院反射环境与原生AgX显示转换；宽主光使用动态遮挡，回廊光改向内照明。保留当前完整元素、原动作和其他页。网页同机位与实际运镜证据见.verify/v32-81；不以封存或原生图代替网页验收。\n');
const html=`<!doctype html><html lang="zh"><meta charset="utf-8"><title>V32.81 主页渲染对照</title><style>body{margin:0;padding:28px;background:#111410;color:#d4cbb8;font:16px/1.6 system-ui}h1{font-size:23px}section{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0}img{width:100%;height:auto;border:1px solid #393c30}a{color:#e0bd72}p{max-width:950px}@media(max-width:900px){section{grid-template-columns:1fr}}</style><h1>当前完整庭院 · V32.81</h1><p>材质节点、三组 Cycles 烘焙、庭院反射与原生色彩转换已接入实时网页。下方分别标记实际输出；光线继续移动，正常运行画面的时刻会变化。</p><p><a href="../../v31.html?v=32.81">打开完整作品集</a></p><section><figure><img src="../../assets/home/home-live-poster-v32-80.png"><figcaption>上版网页 V32.80 · 同机位基线</figcaption></figure><figure><img src="../../assets/home/home-live-poster-v32-81.png"><figcaption>本版网页 V32.81 · 同机位、完整分辨率</figcaption></figure><figure><img src="../../blender/reference-architecture-v24/matched-wide-cycles.png"><figcaption>实际 Blender Cycles · 同机位参考</figcaption></figure><figure><img src="home-clock-close.png"><figcaption>本版实际网页 · 运镜近景</figcaption></figure></section><p>实际连续播放采样：</p><section>${[0,4,8,12,17].map(t=>'<figure><img src="motion-'+t+'.png"><figcaption>实际播放约 '+t+' 秒，动态光与镜头持续计算</figcaption></figure>').join('')}</section></html>`;
await fs.writeFile('.verify/v32-81/visual-review.html',html);
let save=await fs.readFile('scripts/save-current-v32-80.mjs','utf8');save=save.replaceAll('32.80','32.81').replaceAll('v32-80','v32-81').replaceAll('V32.80','V32.81').replaceAll('V32.79','V32.80').replaceAll('v32-79','v32-80').replaceAll('reference-architecture-v23','reference-architecture-v24').replaceAll('-v23','-v24');
for(const [a,b]of [['v32-81.css','v32-80.css'],['loading-study-v32-81.mp4','loading-study-v32-80.mp4'],['opening-poster-v32-81.png','opening-poster-v32-80.png'],['motion/remotion-v32-81','motion/remotion-v32-80'],['V32-81/threeui-runtime','V32-80/threeui-runtime'],['build-dock-v32-81.mjs','build-dock-v32-80.mjs']])save=save.replaceAll(a,b);
await fs.writeFile('scripts/save-current-v32-81.mjs',save);
let verify=await fs.readFile('scripts/verify-v32-80-package.mjs','utf8');verify=verify.replaceAll('32.80','32.81').replaceAll('v32-80','v32-81').replaceAll('V32.80','V32.81');verify=verify.replace("await run('.verify/v32-81/check-runtime.mjs');","await run('.verify/v32-81/check-runtime.mjs');await run('.verify/v32-81/check-home.mjs');");await fs.writeFile('scripts/verify-v32-81-package.mjs',verify);
await fs.writeFile('scripts/open-current-v32-81.mjs',(await fs.readFile('scripts/open-current-v32-80.mjs','utf8')).replaceAll('32.80','32.81'));
console.log('V32.81 handoff and archive scripts prepared');
