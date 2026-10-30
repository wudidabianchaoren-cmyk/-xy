import fs from 'node:fs/promises';
const resume=`# 脑海宇宙 / CURRENT V32.84

2026-10-11。从完整V32.83增量，仅电脑端浏览器。先启动现有8031网站，不为看效果重新渲染。
预览：http://localhost:8031/v31.html?v=32.84 。实际网页与原生流程对照：http://localhost:8031/.verify/v32-84/visual-review.html 。

1. 本轮重点为神话页。实际Blender 5.1.2后台从当前完整网页导出253组对象：船体接缝/12毫米倒角、七片亚麻帆的张力褶皱、人体毛孔法线、连续岛体海岸/沙粒/林地分层材质，以及三层大陆更宽缓的山脊与分支谷地。独立AO UV，8个岛体真实Cycles 2048接触遮蔽烘焙；保留米制PBR UV。材质中明确连接原有色泽乘数，保留四船差异。原生文件blender/mythology-v32-84/mythology-refined.blend、refined-world.glb、forest-crowns.glb；白膜及材质Cycles图用于记录原生步骤。网页实际接回242组几何/253组材质/8组AO，11组活动骨骼保留原实时变形；1832簇原生叶片细节补入原1010株密林。原岛屿/山洞、四艘不同船与48桨手、单眼裸露15米巨人、原64秒运镜与太阳方向、海面和11鸟保持。原生流程图与网页最终画面分别标记，不能用前者冒充网页。
2. 远处大陆去掉高频连续鼓包，增加缓坡、转折及岩面；加强既有24步深度体积雾/大气层次。神话重型几何、纹理上传与着色器编译改在明确点击“驶入晨雾”之后开始，介绍页仅网络预取。岛体射线以BVH加速，保持原始三角面及落地射线，不用减少森林换流畅。首次仍需准备，实际时间见new-effects-checks.json；滚动介绍段不再触发神话GPU初始化。
3. 主页面原生V24烘焙/AgX转换、V25钟盘及已认可的暗暖渲染全部沿用。三处发现用小暖光点与克制扩散环明确标识：左书房门→电影手稿/阅读；钟亭→三音乐匣；右回廊→光之窗。原六镜头改为16秒内钟楼低仰视、书房与铜钟、回廊、上钟盘、全景，避免左右摆幅露出场景边缘；六原生相机保存到blender/home-camera-v32-84/。上窗骑士少量暖色自发光提升可读性，不改变原三窗路径/单窗亮、钟针与原交互。
4. 实际逐帧查看用户加载参考，学习长停留/短转换/再次停留及结尾图形归拢的方法，不照搬素材。新增同风格六格透明刻版图集：骨针纺织、纹陶、云纹铜铃、玉璧、水轮、擒纵机构。旧素材保留，石斧只在自己的区间出现一次；各主辅图错位独立进出，原文字留白保留。结尾六片图形收成拱门，再随既有标题淡出。实际Remotion20秒/600帧/30fps，正式影片只输出一次：assets/loading-study/loading-study-v32-84.mp4。原黑底、进化人物、英文百分比、短进度条与变速时间线保留。新源motion/loading-study-v84与motion/remotion-v32-84，无需重新输出。
5. 两份用户React Bits源码保存在vendor/react-bits：BorderGlow原源码/样式用于原目录与按钮的克制黄铜发光边缘，不再追加第二个目录；ElasticSlider保留弹性运动，增加原音量/亮度的状态桥与默认图标替换，不引入无必要Chakra依赖。原音量0–100、亮度60–115、键盘/滚轮/双击复位/保存及音频接口保持。阅读/学习按钮沿用同一动效。
6. 实际读取React Bits官方HalftoneReveal源码与许可证，用于按需打开的电影手稿预览；关闭立即释放独立WebGL画布。参考Remocn TV Power Off方法，为神话返回增加320毫秒收束退场，不更改20秒加载片的退出逻辑。来源、授权和适配差异见全站视觉检查_V32.84.md。

仅桌面实际核验：加载实际成片/刷新、首次主页16秒镜头/静帧、原交互及新光点、原目录跳转与弹簧、两个弹性滑条、半调手稿、七粒子雨水、英文正反图像流、乡土合并页、五卡片、26页书籍与返回位置、神话三个原机位/48桨手/退出和滚动性能。实测帧率及准备时间见.verify/v32-84-checks.json，不宣称全设备恒定60FPS。功能通过不等于用户美术验收。

保存约定：新完整包E:/codex/脑海宇宙作品集/当前作品集_V32.84/，保存结果.json complete/currentPackageRunPassed双true、文件SHA及8032独立运行通过才算完整保存。V32.83及以前冻结。
长期总纲：先读当前状态和实际额度，评估已有Skill/插件，集中到用户重点；复用已认可资产和缓存，避免无目的安装/重建/反复输出，不安排手机检查。本轮沿用Remotion和Blender，补充一次图集，仅新增所需motion与BVH依赖；实际起始会话/周余59/94%，中途34/90%，以当前工具读数更新，不推测账户额度。
`;
await fs.writeFile('CURRENT-V32-84-RESUME.md',resume);
for(const f of ['../AGENTS.md','AGENTS.md']){const old=await fs.readFile(f,'utf8'),marker=old.indexOf('# 脑海宇宙 / CURRENT V32.83');if(marker<0)throw Error('Unexpected current record '+f);await fs.writeFile(f,old.slice(0,marker)+resume+'\n\n以下记录为历史，不能覆盖 V32.84。\n\n'+old.slice(marker));}
await fs.writeFile('blender/mythology-v32-84/SESSION-STATE.md',`# V32.84 实际原生流程\n\n实际Blender5.1.2后台原生/白膜/材质/Cycles接触遮蔽步骤，由scripts/refine-mythology-v32-84.py、bake-mythology-v32-84.py、finalize-native-materials-v32-84.py记录。输入.verify/v32-84/native-input.json是V32.83完整网页世界的实际世界坐标几何。当前37541对象主页GUI没有被改成神话场景。\n\n网页保留原实时骨骼、帆布风动、海面与64秒摄影机。原生流程图用于检验建模与材质；网页截图用于验证交付，不将两种渲染称为逐像素相同。只用已有文件查看，无需重新烘焙或生成。\n`);
const notes=`# 桌面视觉检查 V32.84

主页面认可的暗暖石材、庭院反射保持；白色粒子/图像展厅保留纸白，以原字体层级、黄铜细节和相同控件串联。只在真实交互位置加光点，没有重新挂满建筑文字。六镜头强调钟楼、书房铜钟、回廊和活动上钟盘，没有延续露出场景边缘的大幅摇摆。

神话检查同时看船体、帆布、人物、岛屿与远景，不只看一个局部。实际Blender白膜/材质/Cycles AO文件与真实网页分别保存；网页接入实际新几何和纹理，原实时人物/风动保持。海岸岩面细节、沙地颗粒、林地色泽分层；大陆采用更宽缓山脊和分支谷地，增加深度雾。森林仍有实时叶片的近景限制，不宣称离线电影画质。初次点击会等待资源与GPU准备，介绍滚动期间不会启动重场景。

加载参考本地MP4实际采样24帧并观察12.151秒完整结构。学习“观察停留—快速转换—再次停留”和图形归拢，增加6个一致刻版意象，保留全部既有发现素材/20秒/黑底/人物与文字。新素材不挤占左侧正文；石斧去重复，同一主要位置退场后交接。结尾收成拱门与首页形成关联。

[BorderGlow](https://www.reactbits.dev/components/border-glow)与[ElasticSlider](https://www.reactbits.dev/components/elastic-slider)：先完整读取用户附件。BorderGlow源码/样式保留，挂载到原控件；ElasticSlider只增加原控制状态桥、替换未必安装的默认图标，保留作者弹性算法。完整附件、提取源码、适配源码保存vendor/react-bits。新增motion缓存；React仍统一用既有视频缓存版本，避免重复React实例。
[HalftoneReveal官方源码](https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/HalftoneReveal/HalftoneReveal.jsx)及其许可证保存同目录。只在电影手稿弹窗按需使用，关闭即释放，避免常驻第二套全屏GPU。Remocn[TV Power Off](https://remocn.dev/docs/effects/tv-power-off)用于学习收束退场，320ms CSS神话关闭动效为本工程适配，不称安装了其完整原组件。
[three-mesh-bvh官方说明](https://github.com/gkjohnson/three-mesh-bvh)：精确三角面射线加速用于植被落地，不改原形体与森林数量。新增依赖目的明确，没有重复下载已有工具。

实际桌面1600×900、1440×1080、1920×1080检查涵盖文字/目录/弹窗/图像、真实鼠标和键盘操作、影片刷新/阅读返回、原64秒三个机位、静帧与帧率、滚动帧间隔。结果以.verify/v32-84-checks.json为准，美术仍由用户观看评审。原50秒电影/声音/26页原PDF/七粒子源码与乡土合并页保持。
`;
await fs.writeFile('全站视觉检查_V32.84.md',notes);
const images=[['home-hotspots-and-sliders.png','网页主页 · 三处微光交互与弹性滑条'],['motion-0.png','网页16秒开场 · 钟楼仰视'],['motion-4.png','网页开场 · 书房与铜钟'],['motion-8.png','网页开场 · 光之回廊'],['motion-12.png','网页开场 · 上钟盘'],['home-final.png','网页主页 · 原认可材质与全景'],['manuscript-halftone.png','网页书房发现 · 按需半调显影'],['directory-glow.png','网页原目录 · 光边交互'],['myth-final-16.png','网页神话 · 原16秒机位与海岸/密林'],['myth-final-32.png','网页神话 · 原32秒机位与大陆深度'],['myth-final-50.png','网页神话 · 原50秒机位与船体/帆布/船员'],['../../blender/mythology-v32-84/native-white-cycles.png','Blender原生白膜 · 仅原生步骤证明'],['../../blender/mythology-v32-84/native-material-cycles.png','Blender原生Cycles材质 · 不冒充网页最终画面'],['opening-8.7.png','加载源动画 · 火与骨针的主次'],['opening-10.35.png','加载源动画 · 火/铜铃退场与石器交接'],['opening-11.6.png','加载源动画 · 石器与收获'],['opening-14.7.png','加载源动画 · 陶器与纹饰/织机'],['opening-18.7.png','加载源动画 · 图形归拢拱门'],['opening-19.5.png','加载源动画 · 收束淡出'],['delivered-opening-11.6.png','实际20秒成片解码帧'],['rain-a.png','网页第七粒子 · 无实体雨滴/波纹'],['english-collage.png','网页英文图像流 · 原正反滚动'],['rural-memory.png','网页乡土归途 · 原合并影像札记']];
await fs.writeFile('.verify/v32-84/visual-review.html','<!doctype html><html lang="zh"><meta charset="utf-8"><title>V32.84 桌面实际画面</title><style>body{background:#141812;color:#d6ceba;font:16px/1.5 system-ui;padding:28px;margin:0}a{color:#d8b76c}main{display:grid;grid-template-columns:1fr 1fr;gap:24px}figure{margin:0}img{width:100%;max-height:640px;object-fit:contain;background:#090b08}figcaption{padding-top:8px}</style><h1>V32.84 · 桌面实际画面</h1><p><a href="../../v31.html?v=32.84">打开完整作品集</a> · 原生Blender步骤证明与实际网页分别标记，加载源帧与真实MP4解码帧分别标记。</p><main>'+images.map(([f,t])=>'<figure><img src="'+f+'"><figcaption>'+t+'</figcaption></figure>').join('')+'</main></html>');
await fs.writeFile('scripts/open-current-v32-84.mjs',(await fs.readFile('scripts/open-current-v32-83.mjs','utf8')).replaceAll('32.83','32.84'));
console.log('V32.84 desktop records and review prepared');
