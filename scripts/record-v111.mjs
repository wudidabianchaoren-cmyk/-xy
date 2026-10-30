import fs from 'node:fs/promises';
let s=await fs.readFile('yangjian.js','utf8');s=s.replace('const rows=[{},{memory:', 'const rows=[{memory:.06},{memory:');await fs.writeFile('yangjian.js',s);
const checks=JSON.parse(await fs.readFile('.verify/v32-111/checks.json','utf8'));await fs.writeFile('.verify/v32-111-checks.json',JSON.stringify({version:'32.111',passed:checks.passed,checks,source:'assets/yangjian-v111/audio/SOURCE.json',packagePending:true,userVisualAcceptance:false},null,2));
const note=`# CURRENT V32.111 / 2026-10-15

本机故事：http://localhost:8031/yangjian.html?v=32.111；主站：/v31.html?v=32.111。
用户额度17%时授权优先雨雷/开篇/往下的视频衔接，不大量重新作图。保留V110图像与H264视频流，不新视觉渲染；只重封装录音音轨，新增固定共享视频背景延续整个第一章并随阅读位置推进视角、缩放和渐暗，至第二章前淡出/停止。原19图及剧情不删，不改变原作品其它章节。

实际REA：自有无头Edge9344，target56148D049E89EFA639CAE9E321F18BDE；list ev_ff366468090d48d3b3b2a2df67e116e00174fd72c7398cfa8c0db76e308aecba；inspect ev_4295eede8a20a82635a85ca3974034cefcf8787f9acd7db5658d95aa498c01a0 / ev_751c011a754746727280ec18e0a3e390f59d6ace92a0fa225f979f93f102325f；完整证据.verify/v32-111/reference/rea-evidence.json。主动点击/8次滚轮由Playwright执行，22开篇状态与24滚动状态分别保存，不冒称被动REA进行了点击。复用已保存Atmos/Lightning/Maps源码：位置淡入×淡出、屏幕闪白与低量雷事件、背景持续播放，与切换普通图片不是同一机制。本轮针对声音和前段，只复测开篇及1800px；六章主线/四支线复用V107–109证据，不重跑全部。

声音：下载Caesar实地录制Rain and thunder，作者公开领域授权，原始226945字节Ogg及SHA/链接保留assets/yangjian-v111/audio/SOURCE.json。单独Rain.ogg及转码MP3曾429；没有假称这些下载成功，实际使用已成功Ogg。从低能量3秒雨声段制作柔化接点的24秒循环；3.3s起5.2秒真实滚雷用于6.32s事件。常驻声音和主题减量，约0.8–1秒渐变、4.6秒退出等待；开场低量主题不断流，闪白6.1s与片内雷声6.32s绑定。不是参考网站音频复用。

实际默认Edge测试：直接首次打开autoAudioStatus=requires-gesture，但静音视频自动运行；从真正同源链接点击进入autoAudioStatus=running且muted=false，无需二次点击。不能绕过首次访问浏览器的声音政策，不修改浏览器全局策略。700ms AudioContext超时退出避免自动启声卡死；点击/键盘可恢复，M静音。阶段记录与图.verify/v32-111/checks.json。滚动桥及第一章电影持续播放、不重置时间，视角矩阵随滚动变化，整屏闪白峰0.43、离屏暂停、0JS错/0HTTP错。

下次待改：第三/四/六/八章尚没有各自独立的连续水墨影片；全故事人物/镜头动作的艺术节奏未重做；木船摩擦、脚步、鸟和部分斧音仍是V110参数音，需继续改为实录/精细混音；原始雷雨录音质量受19秒旧录音限制，未进行真实耳机音响试听；自动有声独立首次访问受浏览器政策限制，站内入口已通过。优先在同一真实网页比较，勿为看效果再次生成/渲染。

完整保存仍采用从当前E110增量修改、保留被替换文件的小源记录、SHA和8032独立运行通过后改E111，不再复制整套8GB。E108因先前删除政策拒绝保留，本轮不重试。技术检查不代表用户美术验收。额度工具本轮早期14%/周20%，后续按实际工具报告。
`;
await fs.writeFile('CURRENT-V32-111-RESUME.md',note);for(const f of ['AGENTS.md','../AGENTS.md'])await fs.writeFile(f,note+'\n---\n\n'+await fs.readFile(f,'utf8'));
let close=await fs.readFile('.verify/v32-109/reference/close-owned-reference.mjs','utf8');close=close.replace('4427857A327F0FD5D69954755E398F60','56148D049E89EFA639CAE9E321F18BDE');await fs.writeFile('.verify/v32-111/reference/close-owned-reference.mjs',close);
let update=await fs.readFile('scripts/update-archive-v110.mjs','utf8');update=update.replaceAll('v32-110','v32-111').replaceAll('V32.110','V32.111').replaceAll('32.110','32.111').replaceAll('CURRENT-V32-110','CURRENT-V32-111').replaceAll('yangjian-v110','yangjian-v111').replaceAll('V32.109','V32.110').replaceAll('v110','v111');update=update.replace("'motion/yangjian-v111',",'');
await fs.writeFile('scripts/update-archive-v111.mjs',update);
let finish=await fs.readFile('scripts/final-record-v110.mjs','utf8');finish=finish.replaceAll('v32-110','v32-111').replaceAll('V32.110','V32.111').replaceAll('32.110','32.111').replaceAll('v110','v111').replaceAll('V32.109','V32.110');await fs.writeFile('scripts/final-record-v111.mjs',finish);
