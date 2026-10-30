import fs from'node:fs/promises';
const note=`# 脑海宇宙 / CURRENT V32.92

2026-10-12，从完整 V32.91 增量，仅电脑端。继续使用用户当前 Edge 标签页与 8031 原服务，刷新即可更新。预览：http://localhost:8031/v31.html?v=32.92 。逐项实际画面：http://localhost:8031/.verify/v32-92/visual-review.html 。V32.91 及以前 E 包冻结。

作品入口的主标题明确为“作品”，界面标签、目录、提示和光标文字改为中文。大号宋体标题与较清楚的中文信息层级；保留原粒子聚合、展开、圆轨道、滚轮、拖动和进出时间线。封面面板调整为 16:9，图像等比完整装入，避免把正式海报的标题、边缘和底部信息裁掉。中秋作品正式标题为“湖南卫视中秋之夜”。五个作品位置及原两项场景练习保留。

两张用户正式海报通过 imagegen 保真清晰度增强，再复用 Real-ESRGAN x4plus 制成 3840 像素宽网页封面。原 JPEG、增强候选与实际网页副本分别保存；生成与超分不是原始高清母版恢复。不能为后续优化重复生成已认可的封面。

接入用户《后西游记预告》：H.264 视频和 AAC 音轨直接复制，只重封装为快速开始的 MP4。所有影片完整等比显示于 95vw/92vh 的黑色首屏内，上下黑边、略小画面，不裁剪、不拉伸、不改变内容时长。影片首屏与玻璃页继续只有返回箭头，无导航条、时间轴、描述或进度条；自动播放、后台与离屏暂停保持。浏览器限制有声自动播放时沿用静音回退，点击影片开启声音。

乡土使用本次新原片：1280×720、30fps、2492 帧、83.081 秒。全部帧经过 RealESRGAN_General_x4_v3 的 4 倍神经网络重建，再输出 1920×1080、30fps 的 H.264；原 AAC 音轨直接复制并比较哈希。现有 GPU 的 NVENC 驱动与 FFmpeg 不兼容，最终用 libx264 CRF18 编码，未修改驱动或重算超分。模型为 Upscayl 官方自定义模型库发布的通用模型，复用已有 NCNN 执行器，只补一个 2.4MB 模型，未安装新框架。超分增强不保证恢复原本不存在或丢失的细节。

西游简介分为剧集概况、播出成绩、制作方法、团队协作和热搜记录。依据湖南日报、新华网导演专访及制作流程报道写入芒果灵创、Seedance 2.0/2.5、角色与场景资产及真实团队分工；微博第10/17位注明为用户截图时刻的记录。剧集成绩不冒称个人独立成果，不加入未核实的满意度与效率宣传。

原主页渲染、四光点与设计开场、加载片、七粒子、神话、阅读、学习和三张原提示词/镜头图板不改。玻璃图片的原十二幅/六组与乡土四幅不改，仍中央上下横幅、上下反射、原自动下滑与正反滚轮。

实际核验：两个桌面尺寸下的作品排版、电影画幅、自动播放/暂停/返回、封面与镜面；全片解码、2492帧与音轨哈希；保留主页原画布、四光点及图板 SHA。原完整画面与运动不重新渲染来预览。测试通过不能代替用户美术验收，不称全站恒定60fps。

新完整包 E:/codex/脑海宇宙作品集/当前作品集_V32.92/ ，只有保存结果.json complete/currentPackageRunPassed 双 true、文件 SHA 和 8032 独立运行通过才代表完整封存。
`;
await fs.writeFile('CURRENT-V32-92-RESUME.md',note);await fs.writeFile('设计调整说明_V32.92.md',note);
for(const f of['AGENTS.md','../AGENTS.md']){const prev=await fs.readFile(f,'utf8');await fs.writeFile(f,note+'\n以下记录为历史，不能覆盖 V32.92。\n\n'+prev);}
let verify=await fs.readFile('../校验当前接续包_V32.91.mjs','utf8');await fs.writeFile('../校验当前接续包_V32.92.mjs',verify.replaceAll('V32.91','V32.92'));
const images=(await fs.readdir('.verify/v32-92')).filter(f=>f.endsWith('.png')&&!f.startsWith('achievement-')&&!f.startsWith('current-'));
await fs.writeFile('.verify/v32-92/visual-review.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>V32.92 实际桌面检查</title><style>body{background:#161c17;color:#e9e2d5;margin:40px auto;max-width:1500px;font:16px/1.7 sans-serif}a{color:#c0a773}img{display:block;width:100%;height:auto}figure{margin:35px 0}</style><h1>V32.92 实际网页画面</h1><p><a href="../../v31.html?v=32.92">当前作品集</a> · 两个桌面尺寸，影片与玻璃页面无额外文字；美术由用户评审。</p>'+images.map(f=>'<figure><figcaption>'+f+'</figcaption><a href="'+f+'"><img loading="lazy" src="'+f+'" alt="'+f+'"></a></figure>').join(''));
await fs.writeFile('.verify/v32-92/work-plan.json',JSON.stringify({desktopOnly:true,quotaStart:{sessionRemainingPercent:61,weeklyRemainingPercent:51},priorities:['Chinese works hierarchy and full formal covers','Supplied film and cinematic display preserving content','Whole rural video neural SR and original audio','Sourced detailed description','Browser checks and complete archive'],reused:['HyperFrames media workflow','imagegen','Real-ESRGAN NCNN executable','FFmpeg','Playwright','Original accepted native scene and motion'],newModelBytes:2435272,newFrameworkInstalled:false,newNativeRendering:false},null,2));console.log('V32.92 current records and review written.');
