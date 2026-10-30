import fs from'node:fs/promises';
const summary=`# 脑海宇宙 / CURRENT V32.90

2026-10-12，从完整V32.89增量，仅电脑端。先读CURRENT-V32-90-RESUME.md。现有8031服务和用户Edge窗口保留，原标签页刷新即可更新，http://localhost:8031/v31.html?v=32.90 。字体/对齐演示 http://localhost:8031/design-review-v32-90.html ，六页及PDF。按用户要求全站字体、版心、重要场景顺序与粒子时长仅演示，等用户确认后才能全站实施；获授权的作品入口和方法笔记局部排版已实施。

作品入口改为暖纸/墨色/铜金，横幅图像、宋体项目标题、清晰说明与场景练习标记；实际删除黑色信息按钮。原轨道/展开/滚轮/拖动/转场/五作品数量不改，原相同控制器提高纹理和输出分辨率，连接线仅弱化颜色。西游两张相似橙色人物图替换为原稿冰崖与紫云，仍十二幅/六组、中央上下排列及上/下镜面。五份原图经过真正Real-ESRGAN x4plus超分，4x推理/2x网页交付，八幅2160px宽分镜；原稿SHA不变。生成式修复候选有细部变形，已排除，仅作检查留档，不接入网页。不把超分称原始高清细节恢复。

删除西游画廊竖进度条，进入画廊后自动观映：停留4800ms、下移2200ms、最后一组停住；离屏/后台暂停，滚轮和键盘接管，提供暂停/继续/重看。乡土仍四图两组、原手动方式。目录删除“十四组”过期说明；滑条与阅读进度改铜金，其他内容页色彩保持。三张密集方法图板改为三项可读HTML/SVG笔记，去掉没有依据的百分比；旧图板原文件保留、不再作为网页正文。

实际检查 .verify/v32-90/gallery-checks.json：六组正反/自动下移/离屏与手动暂停/十二图解码/五原稿SHA/镜面对齐/作品子页返回/目录/两种桌面排版/六页演示无溢出，错误与404为空。4秒1920×1080轨道交互短测约60.20FPS、P95约16.8ms；仅该设备短测，不承诺全站恒定帧率。原主页、加载、16秒开场、粒子、神话、影片、书籍及阅读/返回核心逻辑没有修改。v23.js仅获授权目录文字修改。

实际额度：起始session89%、weekly61%，实施检查时session75%、weekly58%。使用已有imagegen、HyperFrames入口/动画规范、FFmpeg、Playwright；按图片需求增加官方便携超分工具，不重新渲染认可主场景。先查额度、按重点安排、使用合适Skill、增量制作和真实画面核验继续适用。没有手机工作。

新完整包 E:/codex/脑海宇宙作品集/当前作品集_V32.90/ 以保存结果complete/currentPackageRunPassed双true、逐文件SHA与8032独立运行通过为完成。V32.89及以前冻结。功能通过不代替用户美术验收。玻璃保持现有CSS透视与反射图层，不冒称光线追踪。

以下记录为历史，不能覆盖V32.90。

`;
for(const f of['AGENTS.md','../AGENTS.md'])await fs.writeFile(f,summary+await fs.readFile(f,'utf8'));
await fs.writeFile('CURRENT-V32-90-RESUME.md',summary.replace(/以下记录为历史，不能覆盖V32.90。\s*$/,''));
await fs.writeFile('设计调整说明_V32.90.md',`# 本轮设计调整与待确认方案

本轮围绕作品入口、西游画廊与可读性进行增量修正，未改用户认可的建筑渲染、影片和重要实验场景。

## 已实施

1. 作品入口：暖纸底、铜金编号与细线，横幅全景图像，项目标题/英文名/简短说明分层。前三类场景在说明中标记为场景练习；五位置与轨道动向保留。删除实际黑色信息按钮。
2. 西游画廊：第11/12幅相似人物图替换为第1/3幅冰崖与紫云。十二幅数量保持，新增五原稿全部经过超分；八幅网页分镜宽2160px。生成式候选没有用于线上素材。
3. 自动观映：画廊大部分进入视野后，停留4.8秒再缓慢下移2.2秒，约35秒看完六组；最后停住、不强制跳到简介。滚轮/键盘可接管，离屏和后台停止计时。普通滚动进入与影片区“先看画面如何生长”进入均使用同一可见性逻辑。
4. 删除画廊右侧竖标记。保留底部简短页码、暂停/继续与重看，原手动反向回看可用。
5. 导览说明与实际作品一致，去掉十四组旧称。粉红滑条、红色阅读进度改铜金；原内容页的颜色与图像没有整体重调。
6. 方法图板整理成三个网页笔记：空间层次、行动与资产、镜头连续性。正文不再展示无依据百分比，原图板资产留档。

## 演示稿中的建议，等待用户评审

六页演示：design-review-v32-90.html；PDF：设计演示_V32.90.pdf。

中文宋体和英文Times负责大标题，微软雅黑负责正文/卡片，ArchiveMono负责编号；标题、正文和元信息各有固定字号范围。正文采用6vw边距与最大1450px的12列版心，大场景仍铺满屏幕。这套规则仅在演示稿中呈现，没有全站替换字体。

保留全部内容，以“正式作品→视觉实验→阅读与个人”区分观看层级；后三个场景条目明确是练习而非完整项目。七段粒子保留，可以进一步缩短段落之间的空走距离、加直接选择入口。此项涉及大量已完成内容，本轮没有修改顺序、时长或场景。

## 验证与边界

实际1920×1080、1600×900桌面画面和交互见.verify/v32-90/。功能检查通过，审美仍由用户观看评审。专用Real-ESRGAN算法改善模糊与压缩纹理，也可能推断微纹理；不能把结果声称为找回原始高分辨率母版。保留原件与处理记录，便于继续选择。

源工具：https://github.com/xinntao/Real-ESRGAN 。运行模型、GPU、尺寸和文件SHA在restored-v90/processing.json及.verify/v32-90/super-resolution-*.log。
`);
const shots=['works-1920','works-1600','gallery-1','gallery-2','gallery-3','gallery-4','gallery-5','gallery-6','gallery-auto-mid','methods-1920','methods-1600','directory-1920','deck-1','deck-2','deck-3','deck-4','deck-5','deck-6'];
await fs.writeFile('.verify/v32-90/visual-review.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>V32.90 实际桌面复核</title><style>body{background:#171d19;color:#eae3d6;margin:32px;font:15px sans-serif}a,figcaption{color:#b69b67}figure{margin:35px 0}img{width:100%;display:block}figcaption{margin-bottom:12px}</style><h1>V32.90 · 作品页与设计演示</h1><p><a href="../../design-review-v32-90.html">打开六页字体与排版演示</a> · 字体与核心内容层级等待用户评审。</p>'+shots.map(s=>`<figure><figcaption>${s} / 实际网页画面</figcaption><img src="./${s}.png" loading="lazy"></figure>`).join('')+'</html>');
