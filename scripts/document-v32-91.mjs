import fs from 'node:fs/promises';
const note=`# 脑海宇宙 / CURRENT V32.91

2026-10-12，从完整 V32.90 增量，仅电脑端。8031 原服务及用户 Edge 原标签页继续使用，刷新即可更新。预览 http://localhost:8031/v31.html?v=32.91 ，实际画面 http://localhost:8031/.verify/v32-91/visual-review.html 。旧 E V32.90 及以前冻结。先看当前网页，不为预览重渲染。

作品入口本轮修正的是开场构图：巨大的 WORKS 改为“精选影像”与紧凑英文层次，聚合中的主图放大，顶部信息从 10px 增至 12/14px。既有粒子聚合、展开、圆轨道方向、滚轮与拖动时序保留，五个位置保持；第三个场景占位替换为中秋之夜。

用户本轮固定要求：所有作品首屏只呈现视频（未供视频的西游保留背景图），不放标题条、章节导航、说明、占位文案、时间轴或原生播放器控件。只有固定返回箭头。实际视频进入即自动播放，离屏/后台暂停；浏览器禁止有声自动播放时静音回退，点视频可开启声音/暂停。玻璃画廊只放图像与反射，无标题、图注、按钮文字或竖进度条；滚动条隐藏但正常滚动保留。简介放在图像之后，不能覆盖画面。未来作品继续采用这条规则。

西游保留十二幅/六组，原四幅与上轮八幅真正超分图不重新生成，中央上下横幅及上下反射保留。自动停留 4800ms、下移 2200ms，滚轮接管及正反观看保留。乡土保留原视频与四图，补具体乡土叙事与制作说明，《走路上学》参考图仍区别于创作素材。

新增中秋作品：用户原 MP4 逐字节保留，另制 H.264/AAC、1920×1080、30fps、208.655 秒兼容播放副本，未裁剪影片；海报与两幅简介插图从实际影片提取。不加入玻璃画廊。公开资料核实《后西游记》2026.08.31 芒果 TV/湖南卫视黄金档首播及国内首部上星 AIGC 长剧；2026中秋之夜9月25日播出，双网实时收视第一属于整场晚会。没有编造满意度百分比或将晚会数据归到个人单段；VR/Seedance 2.5 工作流据用户创作说明，公开资料未用于补写个人岗位/全部剧集作者。

主页原三个发现保留，中央建筑新增第四个同样的呼吸光点“主页创作”。在原相机投影与出现时机内更新；同类遮罩/闪播转场进入独立图片构建页。三张用户 PNG 原件保留，白模仅制作去顶部说明条的网页副本，彩色和完整 Blender UI 图保留。中央两段图片及对齐反射，正文说明白模、材质/光线、原生场景和真实网页接入；没有重建/重渲染主页。子页打开时主页实时渲染暂停，返回继续原资源和位置，不重播开场；第四点与原三点持续可见。

“提示词与镜头笔记”三张原图板已恢复到 V32.89 的实际图片/点击查看结构，原位图 SHA 未改；只调整外部图注与两列/末张宽图的排版。上一轮简化 SVG 卡片移除。用户最新明确要求原图片不动，覆盖上一轮对图板替换的权限。全站字体演示仍未获确认，本轮不执行全站字体、页序或重要场景重排。

核验 .verify/v32-91/：项目页两个桌面尺寸、自动播放与离屏暂停、镜面边界、正反滚轮；主页第四点及三音盒、父页资源保留、作品返回、原图板恢复、五个位置、新作品自动播放。源码严格类型检查及媒体全片解码通过。检查通过不代表用户美术已验收；不称光线追踪、无条件自动有声或全站恒定帧率。性能数字见 flow-checks.json，按实际短测注明范围。

资源安排：复用 HyperFrames 既有动效规范、Three.js/WAAPI、Blender 原资产、FFmpeg 和 Playwright，未安装新工具、未调用图像生成/超分、未做手机工作。实际起始额度 session96% / weekly57%，实施后 checkpoint75% / 53%，后续以工具最新报告记录。

新完整包 E:/codex/脑海宇宙作品集/当前作品集_V32.91/ 必须以保存结果.json 的 complete/currentPackageRunPassed 双 true、逐文件 SHA 与 8032 独立运行通过表示完成。
`;
await fs.writeFile('CURRENT-V32-91-RESUME.md',note);
for(const file of ['AGENTS.md','../AGENTS.md']){const previous=await fs.readFile(file,'utf8');await fs.writeFile(file,note+'\n以下记录为历史，不能覆盖 V32.91。\n\n'+previous);}
await fs.writeFile('设计调整说明_V32.91.md',note+`
资料依据：
- 新华网导演专访：https://www3.xinhuanet.com/ent/20260909/e457206a59d34bd5b7ee1a39cdc3c508/c.html
- 湖南省广播电视局：https://gbdsj.hunan.gov.cn/gbdsj/xxgk/gzdt/hyxx/202609/t20260908_34059151.html
- 芒果 TV 中秋之夜：https://www.mgtv.com/h/905593.html
- 长沙晚报：https://www.icswb.com/h/153/20260927/997773.html
- 晚会官方收视反馈：https://www.sina.cn/news/detail/5347848352695726.html
- Seedance 2.5 官方发布：https://seed.bytedance.com/zh/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5
`);
const images=(await fs.readdir('.verify/v32-91')).filter(n=>n.endsWith('.png'));
await fs.writeFile('.verify/v32-91/visual-review.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>V32.91 实际桌面画面</title><style>body{background:#171c18;color:#e9e3d5;font:16px/1.7 sans-serif;margin:40px auto;max-width:1500px}img{width:100%;height:auto;display:block}figure{margin:36px 0}figcaption{margin:10px 0;font-size:14px}a{color:#c8ae77}</style><h1>V32.91 实际网页截图</h1><p>自动播放、镜面对齐和返回检查另见 JSON；画面仍需用户观看评审。</p><p><a href="../../v31.html?v=32.91">打开当前作品集</a></p>${images.map(n=>`<figure><figcaption>${n}</figcaption><a href="${n}"><img src="${n}" loading="lazy" alt="${n}"></a></figure>`).join('')}</html>`);
await fs.writeFile('.verify/v32-91/work-plan.json',JSON.stringify({desktopOnly:true,priority:['Clean visual project shells and correct works introduction','Add supplied gala film and fourth home creation hotspot','Restore exact original method boards','Browser verification and frozen complete archive'],quotaStart:{sessionRemainingPercent:96,weeklyRemainingPercent:57},checkpoint:{sessionRemainingPercent:75,weeklyRemainingPercent:53},reused:['HyperFrames existing motion guidance','Three.js and WAAPI','Accepted native Blender scene','FFmpeg','Playwright'],newToolsInstalled:false,newImageGeneration:false,newSuperResolution:false,newNativeRendering:false},null,2));
console.log('V32.91 records and actual screenshot review written.');
