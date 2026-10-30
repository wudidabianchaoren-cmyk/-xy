import fs from 'node:fs/promises';
for(const name of ['v31.html','src/scene-loader.ts']){
 const content=await fs.readFile(name,'utf8');await fs.writeFile(name,content.replaceAll('32.96','32.97'));
}
const note=`# CURRENT V32.97 / 刷新重新进入

预览：http://localhost:8031/v31.html?v=32.97

用户最新要求覆盖仅主页刷新重播的旧规则：每次普通刷新都从顶部重新播放原20秒加载影片，再播放16秒主页动画。刷新不恢复上一章节，不因已播放标记、return=1或减少动态偏好跳过。阅读/学习明确返回与浏览器历史返回仍使用原返回流程。

复用全部影片、模型、材质与页面内容。实时主页多重采样从四倍改为两倍，静帧采样保持原设置；加载期间预热原模型与粒子，不重新渲染影片。真实 Edge 自动测试检查完整入口自然播放、动画推进和完成、粒子章节刷新再次进入；具体长帧以检查 JSON 为准，不声称所有卡顿已经消除。

本轮起始实测额度：会话余7%，周余27%。不进行手机检查、不新增工具或生成素材。

旧 E96 完整包冻结；新 E97 必须独立 SHA 和浏览器运行通过，保存结果双 true 才称完整保存。
`;
await fs.writeFile('CURRENT-V32-97-RESUME.md',note);
const old=await fs.readFile('AGENTS.md','utf8');if(!old.startsWith('# CURRENT V32.97'))await fs.writeFile('AGENTS.md',note+'\n'+old);
let save=await fs.readFile('scripts/save-current-v32-96.mjs','utf8');
save=save.replaceAll('32.96','32.TEMP').replaceAll('32.95','32.96').replaceAll('32.TEMP','32.97').replaceAll('v32-96','v32-TEMP').replaceAll('v32-95','v32-96').replaceAll('v32-TEMP','v32-97');
save=save.replace(/const changed=\[[\s\S]*?\];/,`const changed=${JSON.stringify(['v31.html','v31-motion.js','src/home-world.ts','src/scene-loader.ts','scene-dist','AGENTS.md','CURRENT-V32-97-RESUME.md','scripts/prepare-v32-97.mjs','scripts/save-current-v32-97.mjs','scripts/verify-v32-97-package.mjs'])};`);
save=save.replace('source+\'/CURRENT-V32-96-RESUME.md\'','source+\'/CURRENT-V32-97-RESUME.md\'');
save=save.replace(/limitations:\[[\s\S]*?\]\};/,"limitations:['Occasional long frames remain; actual measurements are in web.performance.','Existing media, models and visual content were reused.']};");
await fs.writeFile('scripts/save-current-v32-97.mjs',save);
let verify=await fs.readFile('scripts/verify-v32-96-package.mjs','utf8');verify=verify.replaceAll('32.96','32.97').replaceAll('v32-96','v32-97');await fs.writeFile('scripts/verify-v32-97-package.mjs',verify);
await fs.mkdir('.verify/v32-97',{recursive:true});
