import fs from 'node:fs/promises';
const summary=`# 脑海宇宙 V32.110 / 2026-10-15

本机：http://localhost:8031/v31.html?v=32.110；杨戬：http://localhost:8031/yangjian.html?v=32.110。
本轮只集中开场影片、开场文字/导航与整篇声音。复用现有原图，无新AI图像/付费音乐调用。12秒1600×900/30fps/360帧含AAC；杨戬与船放大为940/1280逻辑画宽（旧550），大面积动态河浪用原墨色水纹映射到起伏波面，远景慢移/呼吸变焦、云雾、雨、衣摆及发束独立运动；6.1秒闪电/6.32秒滚雷。实际检查发现线框泡沫太生硬和放大后衣料网格细缝，已改墨色水纹并扩展三角裁切消除缝；本轮3次针对性输出，不假称一次渲染。
开场删除目录、声音/自动阅读控制、进入故事按钮、滚动耳机提示与重复中央署名，只留左上题名、副题和返回箭头。点击画面启声，M静音；声音受浏览器手势限制，先静音自动播放。波浪/风雨立体声、木船摩擦、石金属冲击、低频滚雷与克制主题重新参数化制作，压缩器控制多轨冲击峰值，片内有声循环离屏暂停。不是实拍或真实3D布料模拟，未宣称用户视觉认可。
原正文/19幅主图/章间结构与三斧分段保留；15原作品文件SHA和主站非append HTML一致。核验.verify/v32-110/web-checks.json；素材/制作记录assets/yangjian-v110；原生motion/yangjian-v110。复用8031，不重建主页、神话、旧作品。先看实际网页，不重跑非幂等制作脚本。额度实际起始31%、渲染前25%；后续以工具为准。
保存采用对当前E109增量替换并独立校验后改为E110，避免再复制一整套8GB；替换前旧内容逐文件保留在小接续目录，旧完整E108仍保留（先前删除被自动审批拒绝，本轮不重试删除）。完成以保存结果.json双true、SHA和独立8032运行通过为准。没有本轮新公网地址。
`;
await fs.writeFile('CURRENT-V32-110-RESUME.md',summary);
for(const f of ['AGENTS.md','../AGENTS.md'])await fs.writeFile(f,summary+'\n---\n\n'+await fs.readFile(f,'utf8'));
const web=JSON.parse(await fs.readFile('.verify/v32-110/web-checks.json','utf8'));await fs.writeFile('.verify/v32-110-checks.json',JSON.stringify({version:'32.110',passed:web.passed,web,video:'assets/yangjian-v110/video/production.json',userVisualAcceptance:false,savedPackagePending:true},null,2));
