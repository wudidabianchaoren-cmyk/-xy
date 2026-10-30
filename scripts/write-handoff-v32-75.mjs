import {readFile,writeFile} from 'node:fs/promises';
const current=`# 脑海宇宙 / CURRENT V32.75

2026-10-10。从完整 V32.74 增量。先读 HOME-VISUAL-ACCEPTANCE.md 和 .verify/v32-75-checks.json，启动现有网站看效果，不重建、不为查看效果重渲染。旧 E 完整包冻结。

预览：http://localhost:8031/v31.html?v=32.75
阅读：http://localhost:8031/reading.html
学习：http://localhost:8031/learning.html

1. 加载只替换拼贴配件：钻木取火/火塘、打制石器、木轮和早期星空观察。原人物、速度曲线、全部文字布局、英文百分比和短进度条保持；实际 Remotion 成片20秒/600帧/30fps。固定黑底，无书/笔/现代镜头/解剖图片。属于艺术化发现与创造叙事，不宣称科学演化年表。
2. 完整主页统一暖色石材尺度UV、近景微纹理、铜件反射、釉面与接触阴影，校正地面反射矩阵；保留后加建筑群、四湾实体回廊、41树森林、灯具、移动光和所有动作。近景仍用原始几何，远景仅减少2mm以内的细分误差；地面保留原始几何。静帧导出1600×900、原几何和4倍MSAA，运动使用SMAA，钟盘/人物特写另启2倍MSAA和4096主光阴影；珐琅增加过滤的物理微纹理，降低杂乱环境反射；41树保留原位置/枝叶动作，叶面补裂叶轮廓、叶脉与色泽层次。动态尺度最低0.9。几何预处理移到Web Worker后台线程，算法及2毫米上限不变，不阻塞已准备好的原始模型首帧；GPU队列限制在两帧以内，原六镜头一次、三窗原路径与一窗亮、单窗骑士、钟盘/铜钟/西楼灯、五导览不变。实际帧率与滚轮帧间隔见检查，不能称恒定60fps。
3. 粒子页在原20秒开场期间实际完成纹理/着色器/全尺寸画布预热；离屏不销毁GPU资源。信封平铺斜俯视，用纸面、折面和闭合侧壁的疏密与柔和边缘建立厚度，没有强制轮廓粒子线。所有雨滴/接触波纹/回弹着色器、其他六场景和正反滚动保持。
4. 实际通过Blender MCP新建原生V21岛屿，在保留V20岛体上布尔切出山洞，保存blend/GLB并回读0边界、0非流形边，实际范围约238×153米、高差约32米。网页地表按高度/坡度连续融合沙岸、湿岸、土与裸岩；沿岸低生植被、干灌丛、柏形树和原橄榄林分布于真实地面，补露出层岩。三层大陆是有岸坡/腹地/谷地/海底封面的完整网格，跨度26公里，中间无洞；远坡上方雾减轻、海面雾保持。完整巨人V20原生保持，原64秒运镜/灯光主源码、四船/48桨手/11鸟不变。新增植被为地中海环境的艺术解释，不把神话地点当作已确认地理事实。V21没有重新渲染Cycles，原V20证明与当前网页分开记录。
5. 五张方卡与旁边文字并列，展开为五张一排，点单张中等放大，再点回原位；点击收起札记回叠放。手机纵向，键盘可用。50秒影片和原两版声音SHA不变，原温暖结语保持。
6. 阅读页是直立单本书的暖灯胡桃木书龛，有厚封面/书脊/页块，书底不穿插。原稿26页全部保持，跨页按2/3、4/5…24/25配对；封面1与最后内容26各配内封留白，不把第26页误作封底。立体弯曲翻页、双页共同放大、页码/缩略图及下载原PDF保留。白底学习页保持。子页返回作品集跳过20秒加载和六镜头重播，按离开章节与屏内偏移恢复位置，处理页面重新排版后的高度变化。

本地检查及E封存独立记录。新完整包目标：E:/codex/脑海宇宙作品集/当前作品集_V32.75/，仅以其保存结果.json的complete/currentPackageRunPassed双true及逐文件SHA为完整保存依据。旧65/70/71/72/73/74不覆盖。

网页实际静帧/运动已检查；用户渲染图仍是最低质量参照，功能通过不能替代最终视觉评审，不宣称UE5、照片级或用户已验收。实测帧率不足24时须如实记录。原声音文件未改，不声称实际试听。四工具与账户边界见VIDEO-TOOLS-V32-72.md，ElevenLabs/Captions账户生成仍需登录，不冒称恢复旧账号。

Blender MCP来源：https://github.com/ahujasid/mcp-for-blender 。独立实例127.0.0.1:9877，调用脚本scripts/blender-mcp-v32-75.mjs，原生生成/审计脚本及调用证明已保存；复用E73 UV缓存和现有scripts/start-blender-mcp-v32-73.py。不要再次运行生成来预览。无C4D、未操作旧GUI。源码构建：node scripts/check-scenes.mjs / node scripts/build-scenes.mjs，复用现有E缓存。
`;
await writeFile('CURRENT-V32-75-RESUME.md',current);
await writeFile('blender/reference-architecture-v21/SESSION-STATE.md',`# CURRENT / V32.75 native V21 island

从V20原生岛屿增量，仅在独立实例127.0.0.1:9877通过社区Blender MCP execute_blender_code执行。没有覆盖V20或任何E旧包。

- inhabited-island.blend / .glb：海侧椭球布尔山洞，保留洞顶与原橄榄植被；封闭岛体和海岸。GLB只导出岛体及其原生植被，巨人仍使用原V20。
- readback-audit.json：实际Blender5.1.2回读14759顶点、14747面、0边界/非流形边；x/y范围238.44×153.22米，高度-5.97至25.98米。它是几何审计，不是Cycles渲染证明。
- island-native-audit.json为生产记录；实际调用见.verify/v32-75/mcp-production.json与mcp-readback-final.json。早期失败记录只用于溯源。
- 网页src/island-ground.ts连续融合高度/坡度材质，src/island-habitats.ts把植被和露出岩石放在实际地表；src/odyssey-terrain-solid.ts为三层26公里完整大陆；海雾在src/odyssey-atmosphere.ts按海面与高远坡区分。原64秒相机与光照主文件src/odyssey-scene.ts逐字保持。

无需为看效果重运行生成或Cycles渲染。当前V21未新增Cycles证明图，旧V20图片只证明其版本。实际当前网页截图/运动与核验见.verify/v32-75-checks.json；不把数值或建模通过当成用户视觉验收。
`);
for(const [file,title] of [['AGENTS.md','# 脑海宇宙项目接续入口'],['../AGENTS.md','# 脑海宇宙工作区入口'],['V31-CURRENT-HANDOFF.md','# CURRENT V32.75'],['ODYSSEY-CURRENT-HANDOFF.md','# CURRENT V32.75']]){
 const old=await readFile(file,'utf8');if(old.slice(0,150).includes('CURRENT V32.75'))continue;
 await writeFile(file,title+'\n\n## CURRENT V32.75 / 2026-10-10\n\n'+current+'\n\n以下记录为历史，不能覆盖本版。\n\n'+old);
}
const visual=await readFile('HOME-VISUAL-ACCEPTANCE.md','utf8');
if(!visual.includes('V32.75 本轮实施'))await writeFile('HOME-VISUAL-ACCEPTANCE.md',visual.replace('本次仅保存用户约定和已确认问题。当前网站与 V32.74 功能核验不改，不启动重建或重渲染。E 盘现有完整封存包保持冻结；后续实际作品集更新完成后，再按现有约定保存新版本完整包。','以上关于仅记录约定为V32.74历史状态。\n\n## V32.75 本轮实施\n\n现已增量校准完整网页的石材尺度、近景釉面/铜件、地面反射和侧翼材质，实际检查六镜头、回廊、树木与交互。新画面与具体限制见.verify/v32-75/visual-self-review.json及当前接续说明；不把功能/保存通过写成用户视觉验收。地面保留原始形制与几何，近景保持完整精度。E旧包仍冻结，新V32.75只有独立运行与SHA通过后才完整封存。'));
console.log('V32.75 handoffs written; archive flags remain controlled by independent verification.');
