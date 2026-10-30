import fs from 'node:fs/promises';
const dir='.verify/v32-159',read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const layout=await read(dir+'/layout-check.json'),boundary=await read(dir+'/room/boundary-fixed-check.json'),room=await read(dir+'/room-light-final.json'),myth=await read(dir+'/myth/final.json'),production=await read(dir+'/production-final.json'),detector=await read(dir+'/impeccable-detect.json');
const aggregate={checkedAt:new Date().toISOString(),scope:'desktop only / requested loading, first entry collage, workbench and mythology; not whole-site regression',passed:layout.passed&&boundary.passed&&room.passed&&myth.passed&&production.actualUEComplete,groups:{loadingAndCollage:layout.passed,workbenchBoundary:boundary.passed,workbenchLampAndUE:room.passed,mythology:myth.passed,actualUERoom:production.actualUEComplete},jsHTTPReportedErrors:[...layout.errors,...layout.http,...boundary.errors,...room.errors,...room.http,...myth.errors,...myth.http],performance:{totalEntryMilliseconds:layout.intro.at,originalLoadingFilmSeconds:20,originalCourtyardIntroSeconds:16,firstFrameCapture:layout.intro.capture,longestTaskMilliseconds:Math.max(...layout.performance.longTasks.map(x=>x.duration)),coldWaitNotEliminated:true},impeccable:{primary:detector.filter(x=>!x.advisory).length,advisory:detector.filter(x=>x.advisory).length},limitations:['interactive browser geometry remains Three.js','UE viewport color reflection contribution is not absolute incident radiance','first preparation long task remains; not zero stutter','rock/coast joins and close-up vegetation/crew still need art work','not user art approval, mobile/full-site testing, full E backup or public deployment']};
await fs.writeFile(dir+'/validation-final.json',JSON.stringify(aggregate,null,2));
const resume=`# CURRENT 造境手记 V32.159 / 2026-10-27

本轮13:42:12开始，用户三小时硬截止16:42；15:45停止新增制作后收束，提前展示结果。只电脑端指定范围；复用8031 Python PID8612、既有UE5.8.4工程，不安装、不全站/手机巡检、不启新代理。主站 http://127.0.0.1:8031/v31.html?v=32.159 ，对照 http://127.0.0.1:8031/.verify/v32-159/visual-review.html 。

## 本轮已实现

- 开场恢复右侧真实百分比与短进度线；ThoughtLine/计时/阶段列表排在右下，和原影片左侧标题平衡。只改包装排版，用户组件动效不改；原20秒影片、原16秒480帧入场与首段.76缩放保留。完整自然播放通过。refinements-v159.css；src/home-thought-line-v158.*保留。
- 用户截图的workFlow缺图/标题越界：十图先有HTML实体，使用既有小预览，接近400px时启动真实解码；控制器幂等、字体就绪及pageshow重排，标题始终在舞台中央并限制边界。三阶段10/43/77%均十图解码、标题不越1920宽。原截图的精确错位没有在新冷开稳定复现，不虚构唯一根因。
- 保留V158取消隐藏海湾抢GPU的修复；实际首开没有隐藏myth iframe。庭院已渲染首帧改为加载期间canvas.toBlob异步捕获，原16秒播放器复用同一真实图，交接处不再主动同步重渲染/toDataURL。修正过一次displayReady同名遮蔽导致初始化失败，最终自然完整播放通过；失败不是交付状态。src/home-world-v146.ts / home-designed-intro.jsx / scene-loader-v146.ts，正式bundle query159。
- 工作台台灯主光/弱冷窗光：曝光.87，弱化房间烘焙底光、取消新增顶射灯；保留原Cycles三路及实物交互。仅桌前一张工作凳，移除右休闲椅/脚凳；左书统一落在搁板、托盘与纸本贴合支撑；右柜改闭合平文件抽屉，贴墙原画保留。实体硬木地板266块、18mm厚，六批合并、正确木纹与交错拼缝。src/directory-v141/room-world-v159.ts / room-v143.ts / surfaces.ts / screen.ts。
- UE房间上轮未完成项已真实续做：当前完整GLB 81,574,336字节/307导出mesh/237154三角，实际UE导入305 StaticMesh；Three垂直37°→UE水平61.491421°。窗内使用原许可Berlin夜景双面unlit卡片，正确UVs输入、垂直方向与窗框遮挡。真实1280×720小样和六向512EXR均完成，无脚本errors；未修改原Cove地图。正式脚本 scripts/ue-room-v159-final-current.py，证据 .verify/v32-159/ue-room-final/viewport-env.json。
- 本次UE房间EXR离线预滤波为336×256 CubeUV；网页灯亮反射采用75%原房间+25%对应UE颜色反射，校准平均亮度，保留关灯原反射及原生漫反射。assets/ue-v159/room-mix-ue5-cubeuv.* / environment-v159.ts。最终实际网页ueRoom.ready=true、台灯开关通过。它是实际UE反射加工，浏览器几何/导航依然Three.js，不能称整个网页UE实时渲染。
- 神话移除V149 83605片密草，恢复原V148贴地低草4605顶点；保留小实体海鸥、原暖金天空/雾、无白圈海岸。原V134 CUDA Cycles 4096辐射图按原UV恢复到原有效平缓岛面，交付2048RGBE、不做额外tone mapping；陡壁/新岩岸仍原live PBR，避免无旧UV部分黑块。根部固定低幅草风、原海水起伏与昼夜保留。src/mythology-local-v159.ts / coast-v159.ts，资源 assets/odyssey/restored-v159/；正式offline/SW/manifest159共49资源。

## 最终实际验证

validation-final.json passed=${aggregate.passed}；本轮指定流程JS/HTTP报告错误${aggregate.jsHTTPReportedErrors.length}。loading/layout-check.json（实际文件layout-check.json）自然20秒影片→16秒ended及三处拼贴；room/boundary-fixed-check.json五项真实滚轮/耳机/个人返回；room-light-final.json台灯开关/一凳/UE实际启用；myth/final.json十七项含小海鸥、同波场海岸、操作、昼夜、暂停/后台停绘、真实断网重载移动。不是全站全通过。Impeccable只扫本轮相关源，0主要/3色板建议；用户既有浅金不强改。

## 明确保留的限制与下次顺序

1. 当前冷开到16秒入场结束约${(layout.intro.at/1000).toFixed(1)}秒，其中20秒加载影片+16秒原动画共36秒；额外首帧准备仍有等待，最长主线程任务${(aggregate.performance.longestTaskMilliseconds/1000).toFixed(3)}秒，没有称零卡顿。下一次若继续性能，只针对首次完整颜色/阴影帧准备采样，不重做全站/资产或缩短用户保留动画。异步图捕获正常，但不能把整体卡顿称已根治。
2. UE完整网页交互迁移/稳定串流没有完成；本轮完成的是房间实际重打光小样及反射资源回接，钟楼/海湾仍沿V158各自UE反射贡献。颜色probe含曝光/后处理、六向有GI接缝，不作为全景背景或物理绝对HDR；本轮仅25%混合、未改漫反射。
3. 写实美术仍有限：侧柜程序造型、原岛岩岸交接/局部坡面与树叶近景、船员手脸/动作仍需细修；不称照片级/影视级/用户美术验收。原船/岛/14人和其它作品保留。
4. 未做全站或手机检查、完整E159包/全量SHA/公网部署。只保存本轮源码、构建产物、局部备份与证据；production-final.json有关键资产SHA。
5. 不为看效果重跑制作。先看本文件、validation-final.json与visual-review，再按用户新范围继续。当前已无本轮UE进程。

## 失败和额度记录

保留旧UE黑窗、过近镜头、倒置夜景的中间图；它们不出现在最终成果对照。曾四向完成后因等待审图超过脚本360秒退出，补两向诊断后，最终按修好的同一光照/窗材质对最新托盘位置一次完整六向重收，正式以ue-room-final为准。神话恢复曾把旧UV套到新岩壁而出现黑块，已限制到原有效平缓UV表面。manifest曾误指不存在159CSS/清单，最终49资源断网实测通过。

一次包含动态command.py执行入口的工具批次被自动策略以blocked by policy拒绝；未执行该动态方案，改为固定可审脚本后实际运行通过。没有绕过拒绝。REA当次只被动读取本机页面，摘要 .verify/v32-159/rea-current-evidence.json；沿用已有参考分析，不冒称拿到作者私有源工程。

额度快的已知原因是此前多代理和重复长上下文/调试/复测会增加模型调用；我无法读取账户剩余额度或每项扣费比例。本轮单代理、只做指定局部、复用资产和服务；UE本地计算时间不等于模型额度的扣费比例，不给虚假账单数字。
`;
await fs.writeFile('CURRENT-V32-159-RESUME.md',resume);await fs.writeFile(dir+'/完成情况.md',resume);
const brief=`# CURRENT 造境手记 V32.159 / 2026-10-27\n\n先读 cinematic-ai-archive-prototype/CURRENT-V32-159-RESUME.md（项目内同名）。仅电脑端指定范围、复用8031。右侧加载百分比/排版恢复，原20秒影片与16秒入场保留；十图解码/标题边界与异步首帧实际通过。台灯暖光冷窗、单凳/实体266块木地板/左右柜支撑修正；实际UE305网格、61.491°FOV/窗内UV修复、小样六向EXR完整成功，25%同房UE反射回接，网页仍Three.js。神话原低草/原有效UV岛面恢复，49资源离线及17项通过；桌面边界/耳机/个人返回通过。本轮指定JS/HTTP错0，首帧仍约1.6秒长任务，不称零卡顿/整页UE/写实验收。13:42开始，15:45停新增收束，16:42硬截止前展示。失败、未完成与下一步见记录，不重跑制作/全站。\n\n---\n\n`;
for(const p of ['AGENTS.md','../AGENTS.md','V31-CURRENT-HANDOFF.md','BLENDER-CURRENT-HANDOFF.md','ODYSSEY-CURRENT-HANDOFF.md']){const s=await fs.readFile(p,'utf8');if(!s.startsWith('# CURRENT 造境手记 V32.159'))await fs.writeFile(p,brief+s);}
await fs.appendFile(dir+'/SESSION-2026-10-27.md',`\n\n最终收束：${new Date().toISOString()}；见validation-final.json、完成情况.md和CURRENT-V32-159-RESUME.md。本轮正式结果${aggregate.passed?'局部通过':'存在失败'}。未消除冷开长任务，网页仍Three.js+对应UE反射贡献。\n`);
const items=[['加载动画排版与真实百分比','loading-layout-final.png','原影片与ThoughtLine动效保留，恢复右侧百分比和短进度条。'],['拼贴中段','collage-43.png','十张图真实解码，标题位于可视区域。'],['实际网页：台灯开启','room-desk-final.png','台灯暖光、较弱窗光，原桌面作品和操作保留。'],['实际网页：台灯关闭','room-lamp-off.png','同一真实开关操作，关灯反射和冷窗保留。'],['向下看：实体硬木地板与唯一工作凳','room-floor-final.png','266块有厚度的实体木板，18mm厚，非虚空平面。'],['左侧：搁板支撑与创作板','room-left-final.png','托盘、书籍和纸本按真实支撑面放置。'],['右侧：平文件柜与贴墙图','room-right-final.png','第二张椅子和脚凳已移除。'],['UE5原生实际小样（单独展示）','ue-room-final/room-hero.png','UE5.8.4真实原生viewport；修正FOV和窗内UV。网页使用其25%颜色反射贡献，页面依然为Three.js交互。'],['神话：恢复低草与岛面','myth/myth-day-final.png','原低矮草、原有效UV烘焙岛面，陡壁和近岸保留live PBR。'],['神话：夜间小屋','myth/myth-night-final.png','实际昼夜切换，保持原小屋近看；不称照片级。']];
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>造境手记 V32.159 · 实际效果</title><style>body{margin:0;padding:48px 6vw;background:#f2eee7;color:#302f29;font:16px/1.7 system-ui}main{max-width:1500px;margin:auto}h1{font-size:38px;font-weight:500}h2{font-size:23px;font-weight:500;margin:42px 0 8px}p{max-width:1000px}img{width:100%;height:auto;display:block;background:#282822}a{color:#6a4d28}figcaption{margin:12px 0 24px}figure{margin:0}nav{display:flex;gap:24px;flex-wrap:wrap}</style><main><h1>造境手记 V32.159</h1><p>以下为本轮真实浏览器截图和独立UE小样。指定局部检查通过；首次准备仍有约1.6秒长任务，网页交互场景仍为Three.js。原20秒影片与16秒入场保留。</p><nav><a href="/v31.html?v=32.159">进入主站</a><a href="/directory.html?v=32.159">查看工作台</a><a href="/mythology.html?v=32.159">查看神话</a><a href="validation-final.json">实际检查JSON</a></nav>${items.map(([title,img,copy])=>`<section><h2>${title}</h2><figure><a href="${img}"><img loading="lazy" src="${img}" alt="${title}"></a><figcaption>${copy}</figcaption></figure></section>`).join('')}<p>本轮仅电脑端与指定页面；未做全站、移动端、完整E盘备份或公网发布。原始脚本、失败记录、资产来源和未完成事项见CURRENT-V32-159-RESUME.md。</p></main></html>`;
await fs.writeFile(dir+'/visual-review.html',html);
console.log(JSON.stringify({passed:aggregate.passed,errors:aggregate.jsHTTPReportedErrors.length,totalSeconds:layout.intro.at/1000,scope:aggregate.groups}));
