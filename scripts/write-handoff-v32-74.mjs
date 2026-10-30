import {readFile,writeFile} from 'node:fs/promises';
const current=`# 脑海宇宙 / CURRENT V32.74

2026-10-10。从完整 V32.73 增量。先启动现有网站，不从头重建，不为查看效果重渲染。

预览：http://localhost:8031/v31.html?v=32.74
阅读：http://localhost:8031/reading.html
学习：http://localhost:8031/learning.html

1. 实际 Remotion 20 秒、600 帧、30 fps。保留认可的英文百分比及短进度条、原进化人物和变速节奏；删除草、眼球/神经手解剖和旧天球仪，改为书、画笔、镜头与建筑的连续线稿。黑底不变，轨迹增加并加粗。主页模块、纹理、原生模型与 GPU 准备从开场期间开始，影片结束才开始原六镜头；实测是否在20秒内完成见当前检查，不能凭静图声称无等待。
2. 实际通过社区 Blender MCP 在 Blender 5.1.2 新原生 V20 增补四湾深拱顶、后墙、贴墙手稿书架、柱基和灯具，保存原生、增量 GLB 及 CPU Cycles 渲染证明。网页增加回廊投射阴影/稀疏尘光、森林暖色扫光、风吹叶片和窗灯微动，修整石材与地面。原六镜头仅开场一次、三窗原动作一窗亮、链条单窗骑士、钟盘/铜钟/西楼灯、五导览、41树及原地面保持。固定视角复用AO和反射，阴影分频更新；慢设备动态渲染尺度最低0.8，静帧导出保持1600×900，材质/灯光/几何同源。实测性能如实记录。
3. 信封改为平铺地面、斜俯视的闭合厚度粒子体，纸面/折痕/侧壁密度有主次。雨滴向下打到纸面，波纹和轻回弹保留；其他六粒子、原交互和正反滚动不变。
4. 新原生完整单眼巨人，上下身及脚尖方向一致、手臂自然放低，无球；新缝合领口、短袖、带不规则褶皱的亚麻短袍与披肩。岛屿约220×144米，有连续岸线、层岩、海湾、草与真实枝叶的低橄榄树林；移除旧白圆台和岸边八个白点。三层13公里宽远景大陆、深度海雾、细雨与浮尘；原64秒镜头和光照源码、四船、48桨手、11鸟保持。原生人物和岛屿各保存新的实际CPU Cycles证明图。
5. 五张过程图为端正方卡叠放，可从边缘看到下面四张；点击/键盘展开，再次收回。文字与图像完整，手机纵向展开。原50秒影片与两版音频SHA保持。
6. 结语改为温暖克制的第一人称：“跟上变化，也留住自己的感受。”说学习工具、反复观察和把想法做完整；不宣称超出实际成果的能力。
7. 阅读、学习改为独立URL子页面，目录删除实验/关于。学习白底占位。阅读为书架上的真实Three.js立体书、厚封面/书脊/页块/弯曲翻页，可翻页、输入页码、看26页缩略图、清晰阅读和下载原稿。用户实际提供的是PDF：电影美学书籍的完成.pdf，26页图像版；全部整页提取，保留每页原图片/文字与排版，不伪称收到PPTX。

必读 .verify/v32-74-checks.json 和 blender/reference-architecture-v20/SESSION-STATE.md。当前本地完成与E封存分开记录；新包目标 E:/codex/脑海宇宙作品集/当前作品集_V32.74/，以其保存结果.json 的 complete/currentPackageRunPassed 双true、独立运行及逐文件SHA为完成依据。旧V32.65/70/71/72/73包冻结。

原生Cycles证明与网页实时截图是两种独立证据；不称UE5或照片级验收，新美术仍需用户观看评审。首次GPU准备仍有成本，当前机器负载和动态渲染尺度会影响帧率。保留原电影声音，未声称实际试听。四工具与账户边界见 VIDEO-TOOLS-V32-72.md；ElevenLabs/Captions生成仍需用户登录，不冒称旧账号恢复。

Blender MCP来源：https://github.com/ahujasid/mcp-for-blender 。独立实例127.0.0.1:9877，当前调用脚本scripts/blender-mcp-v32-74.mjs，UV缓存复用E:/Brain-Universe-assets/V32-73/uv-cache。无C4D调用，不操作旧GUI；不要为看效果重新运行原生生成或渲染。源码构建复用E缓存：node scripts/check-scenes.mjs / node scripts/build-scenes.mjs。
`;
await writeFile('CURRENT-V32-74-RESUME.md',current);
const native=`# CURRENT / V32.74 native V20

实际通过社区mcp-for-blender的execute_blender_code连接独立Blender 5.1.2。冻结V16/V18/V19未覆盖；V20为新命名文件，保留原模型与接受的动作。

- architecture-v20.blend：从完整V19增量，四湾完整拱顶、后壁、贴墙书架/手稿、柱基与灯具。courtyard-depth.glb只导出新增内容，网页叠加原V18/V19；不需要重建底层建筑。
- courtyard-cycles-v20.png：实际CPU Cycles 1600×900、64samples、AgX。原生保留的树/屋与网页额外的41树/两侧房屋层不同，因此不能把这张证明当成全网站最终截图。网页海报来自同一实时渲染器。
- polyphemus-v20.blend/.glb：保留MPFB来源的完整解剖身体与单眼；重新对齐脚尖，新合缝领口、短袖、褶皱短袍、披肩及皮带。无手中球体。polyphemus-cycles-v20.png为实际CPU Cycles 1200×1200、64samples。
- inhabited-island.blend/.glb：220×144米连续不规则海岸、地表颜色平滑融合、实拍石材PBR、低橄榄树真实枝叶/草。支持高度由地表函数实际计算。GLB只导出岛屿与植被，原生证明场景追加最终巨人。inhabited-island-cycles-v20.png为实际CPU Cycles 1440×900、48samples。

所有文件与证明图由audit-native-v32-74.py通过MCP最终回读；native-production-audit.json记录尺寸、设备、网格、打包图像与证明SHA。实际调用在.verify/v32-74/mcp-*.json，生成/修正脚本scripts/*v32-74*.py。网页实时还有完整海面、船、原64秒光照运镜、远景大陆与空间雾，它们不等于独立原生证明场景。

直接打开当前网站看效果；不要为预览重渲染或再次运行生成脚本。最终本地核验见.verify/v32-74-checks.json，E新包以保存结果双true为准。保留旧包与旧原生；不称UE5/1:1或美术已经用户验收。
`;
await writeFile('blender/reference-architecture-v20/SESSION-STATE.md',native);
for(const [file,title] of [['AGENTS.md','# 脑海宇宙项目接续入口'],['../AGENTS.md','# 脑海宇宙工作区入口'],['V31-CURRENT-HANDOFF.md','# CURRENT V32.74'],['ODYSSEY-CURRENT-HANDOFF.md','# CURRENT V32.74']]){
 const old=await readFile(file,'utf8');if(old.slice(0,100).includes('CURRENT V32.74'))continue;
 await writeFile(file,title+'\n\n## CURRENT V32.74 / 2026-10-10\n\n'+current+'\n\n以下记录为历史，不能覆盖本版。\n\n'+old);
}
console.log('V32.74 current handoffs written; archive completion remains controlled by verification.');
