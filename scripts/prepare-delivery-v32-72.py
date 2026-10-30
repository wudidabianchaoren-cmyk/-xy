from pathlib import Path
import json,shutil
r=Path(__file__).resolve().parents[1]
text='''# 脑海宇宙当前接续 V32.72 / 2026-10-09

从完整 V32.71 增量继续。预览 http://localhost:8031/v31.html?v=32.72 。现有8031服务保留，不重建原V16，不重渲染旧建筑影片或操作旧Blender GUI。先读本文件、.verify/v32-72-checks.json 与 blender/reference-architecture-v18/SESSION-STATE.md。

本轮内容：
- 开场保持20秒，由实际安装的 Remotion 4.0.534 输出600帧。19段剪辑、15幅刻版图像，变速曲线、负片闪切、遮罩、光楔和递归画框。真实查看12.151秒参考的全段抽帧；未把参考影片作为作品素材。源码 motion/loading-study-v3、motion/remotion-v32-72。
- 主页真实 Blender 5.1.2 V18 增量原生工程与 CPU Cycles 证明；移除散置马车、旧井/槽/独立长凳，以墙边石座及同风格灯具代替。网页暗冷环境、暖色移动主光、回廊实灯和扫光；41棵树降低并成组。保留六镜头一次，仅微调各景别观察角度；钟盘、链条骑士、铜钟、原三窗路径/单窗亮、五处导览保持。
- 信封有新生成参考图；只改第七场的封口、袋体厚度和粒子密度。其他六场、时序及交互保持，源码比较和七场回归有证据。
- 名画中央光点5→8px。国家美术馆说明确认波里菲摩斯存在且横卧崖顶；原生人物改斜卧、完整身体和单眼、贴体毛织短袍，移除额外头发块。移除未完成感的人工洞/平台，改连续侵蚀斜岩；绷紧帆面、织纹、缝线与微小风振。原64秒镜头/光照代码、四船、48桨手、11鸟保持。
- 末页标题“一句提示词，让代码长成电影。”：用留意、关心、修补和相聚解释从语言到叙事、代码到运动的实验。修正椅子的座面透视、四腿连接与横撑，仅重绘33–40秒168帧再接回50秒影片；原两套混音WAV逐字节保持。五张制作图仍同显。

四工具：HyperFrames 0.8.143、Remotion 4.0.534、ElevenLabs CLI 1.4.0/SDK2.71.0 已下载到 E:/Brain-Universe-assets/V32-72/video-tools/。官方 HyperFrames、Remotion、ElevenLabs 技能安装在工作区根 .agents/skills/。Captions 官方 @mintlify/mcp 运行文件已下载并安装到同目录 captions-mcp，实际 MCP 工具发现通过，但目前官方配置仅提供文档 search，不能冒充已连接视频生成 API。配置模板 .verify/v32-72/captions-mcp-config.json；没有自动改其他编辑器账户。ElevenLabs/Captions 云端生成需当前用户登录/API授权；旧账号授权未视为恢复，也未实际调用收费生成。工具、来源及版本记录 .verify/v32-72/video-tools-status.json、VIDEO-TOOLS-V32-72.md。

美术为风格化三维重释，不声称UE5、照片级或参考片/电影人物1:1。Cycles 原生静帧和实际网页实时画面分别留证。首次GPU准备仍需要时间；实际帧率、开场掉帧、交互与响应以 checks 为准。没有实际音频试听，仅检查媒体与原混音完整性。

每次更新必须新增E完整包，不覆盖旧包。目标 E:/codex/脑海宇宙作品集/当前作品集_V32.72/；只有其 保存结果.json 的 complete/currentPackageRunPassed 双true、文件清单SHA一致并独立运行通过，才算完整保存。V32.71/V32.70/V32.65及其他旧完整包冻结。封存后仅为看效果运行 项目/serve-preview.py，打开v31.html，无需渲染。所有当前源码、素材、原生、过程、来源、核验及必要构建缓存随包保存。
'''
(r/'CURRENT-V32-72-RESUME.md').write_text(text,'utf8')
native='''# Native V18 / CURRENT V32.72

Retained V16 and V17 files are frozen. Incremental architecture-v18.blend and courtyard-additions.glb; original castle/camera assets remain the base. CPU Cycles still courtyard-cycles-v18.png is native proof, separate from the full realtime website screenshots. Native reclining figure and garment: polyphemus-reclining.blend/glb and actual polyphemus-cycles-v18.png. Continuous sloping geology: natural-cliff.blend/glb. Entry points scripts/native-v32-72.py, refine-native-person-v32-72.py, refine-native-cliff-v32-72.py and .verify/export-v72-input.mjs/ts. Do not rerun native-v32-72.py merely to preview: it is the initial build followed by both refinement passes; current complete assets already exist. The original 64s light/camera splines and four boats are preserved. Native style is not photographic character likeness. Current delivery and tests: CURRENT-V32-72-RESUME.md and .verify/v32-72-checks.json. E delivery status is determined only by its two saved true flags.
'''
(r/'blender/reference-architecture-v18/SESSION-STATE.md').write_text(native,'utf8')
heading='''## CURRENT V32.72 / 2026-10-09

先读 cinematic-ai-archive-prototype/CURRENT-V32-72-RESUME.md 与 .verify/v32-72-checks.json。从完整V32.71增量；实际Remotion20秒/19段/15图，Blender原生V18/CPU Cycles与暗暖移动主光、回廊实灯、低簇41树；去马车/散置井槽。只改信封形体密度；光点微增、张紧织纹帆、斜卧单眼完整巨人及连续斜岩，原64秒镜头/灯光/四船保持。末页新代码电影标题和正确四脚椅，仅补33–40秒，50秒与原音频保持。保留六镜头一次/三窗原动作一窗亮/原交互/五导览/原地面/其他六粒子及其他页。四工具下载在E:/Brain-Universe-assets/V32-72/video-tools；Captions官方MCP仅文档search，ElevenLabs/Captions生成授权待用户登录，不冒充旧账号恢复。E新完整包V32.72以保存结果双true及独立运行/SHA为准；所有旧包冻结。无C4D、无旧GUI操作，不重渲染看效果。下方历史不覆盖本版。

'''
for f in [r.parent/'AGENTS.md',r/'AGENTS.md']:
 s=f.read_text('utf8');n=s.index('\n');f.write_text(s[:n+1]+'\n'+heading+s[n+1:],'utf8')
for f in ['V31-CURRENT-HANDOFF.md','ODYSSEY-CURRENT-HANDOFF.md']:
 p=r/f;p.write_text('# CURRENT V32.72\n\n先读 CURRENT-V32-72-RESUME.md、.verify/v32-72-checks.json 与 blender/reference-architecture-v18/SESSION-STATE.md。从V32.71增量，旧记录不覆盖本版；E交付仅以新包双true及独立校验为准。\n\n'+p.read_text('utf8'),'utf8')
provenance={'newAtlas':{'generator':'OpenAI built-in imagegen','file':'expanded-scientific-atlas.png','sourceId':'exec-531ce2a0-82ab-418c-a299-8174c3251305','brief':'Nine independent scientific copperplate plates: anatomical eye, fern/root, nautilus, prism, clock gears, insect wing, armillary sphere, microscope, hand tendons. Ivory linework on charcoal with muted brass, 3x3 atlas, no writing.'},'envelope':{'generator':'OpenAI built-in imagegen','file':'assets/sand-story/envelope-volume-v32-72.png','sourceId':'exec-55c6d103-eb09-4bce-a1fb-2a7e9a2a131f','brief':'Complete closed ivory paper envelope, rectangular body, overlapping triangular flap and visible paper-edge thickness. Geometry reference; generated transparency was requested but final raster is only used as a guide.'},'reference':'User-supplied video reviewed via .verify/v32-72/reference-contact.jpg; 12.151066s. Borrow editing methods, not footage. Original six V71 engraving assets retained alongside nine new plates.'}
(r/'assets/loading-study/v32-72/PROVENANCE.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),'utf8')
(r/'VIDEO-TOOLS-V32-72.md').write_text('''# 四工具本地接续

安装目录：E:/Brain-Universe-assets/V32-72/video-tools/。旧账号聊天和云端授权不会因为本地项目存在而自动恢复。实际状态请读 .verify/v32-72/video-tools-status.json。

- HyperFrames：官方 https://github.com/heygen-com/hyperframes，0.8.143；CLI help通过；官方三套技能在工作区根 .agents/skills。
- Remotion：官方 https://www.remotion.dev/docs/ai/skills，4.0.534；本轮真正用renderer输出600帧开场，来源 motion/remotion-v32-72、motion/loading-study-v3。
- ElevenLabs：https://github.com/elevenlabs/cli；CLI1.4.0和SDK2.71.0，官方TTS/音效/音乐技能已安装。CLI可运行；未实际认证生成。使用私密本机登录或环境变量，不把密钥发进聊天。安装不能证明旧账号授权恢复。
- Captions：https://captions.ai/help/ 为当前官方入口；旧文档 https://help.captions.ai/api-reference/mcp 描述 @mintlify/mcp。当前安装该官方运行时与captions配置，stdio MCP工具发现通过，返回search。它提供文档查询，不能声称已调用剪辑/生成API。视频生成需另行登录并确认官方API权限。模板 .verify/v32-72/captions-mcp-config.json，不自动修改其他编辑器配置。

视频工具及下载在E盘；其npm锁文件和官方技能随当前包保存。网站观看使用已编码影片，不要求账号登录或重渲染。重建视频先按锁文件恢复工具缓存。当前音频保持旧混音，没有伪称本轮ElevenLabs新声音或实际听感验收。
''','utf8')
for f in ['package.json','package-lock.json']:
 d=r/'motion/remotion-v32-72/toolchain-lock';d.mkdir(exist_ok=True);shutil.copy2(Path('E:/Brain-Universe-assets/V32-72/video-tools')/f,d/f)
# Adapt the already-reviewed current-package copy and independent run workflow.
s=(r/'scripts/save-current-v32-71.mjs').read_text('utf8').replace('v32-71','v32-72').replace('V32.71','V32.72')
s=s.replace('/life-purpose\\/v32-(?!70)','/life-purpose\\/v32-(?!70|72)').replace('(?:v32-(?!71)|loading-study-v32-(?!71)|opening-poster-v32-(?!71))','(?:v32-(?!71|72)|loading-study-v32-(?!72)|opening-poster-v32-(?!72))').replace('home-live-poster-v32-(?!71)','home-live-poster-v32-(?!72)')
s=s.replace("const pending={previousV70ArchiveSha256:oldV70Hash", "const oldV71Hash=await hash(root+'/当前作品集_V32.71/保存结果.json');\nconst pending={previousV71ArchiveSha256:oldV71Hash,previousV70ArchiveSha256:oldV70Hash")
marker="await add(path.join(source,'blender/reference-architecture-v17')"
i=s.index(marker)
s=s[:i]+"await add(path.join(source,'blender/reference-architecture-v18'),'项目/blender/reference-architecture-v18',r=>!r.endsWith('.blend1'));\nawait local('VIDEO-TOOLS-V32-72.md');\nfor(const f of await readdir('scripts'))if(f.includes('v32-72'))await local('scripts/'+f);\nfor(const f of ['hyperframes','hyperframes-animation','hyperframes-cli','remotion-best-practices','text-to-speech','sound-effects','music'])await add(path.join(source,'../.agents/skills',f),'安装技能/'+f);\n"+s[i:]
s=s.replace("for(const f of ['export-v71-input.mjs','export-v71-input.ts','prepare-v32-72-tests.mjs','create-v32-72-archive-tools.mjs','finalise-v32-72.mjs'])await local('.verify/'+f);", "for(const f of ['export-v72-input.mjs','export-v72-input.ts','finalise-v32-72.mjs','protected-v32-72.mjs','run-v32-72-regressions.mjs'])await local('.verify/'+f);\nawait add(path.join(source,'.verify/life-film-v32-72'),'项目/.verify/life-film-v32-72');")
s=s.replace("if(await hash(oldArchive)!==oldHash)","if(await hash(root+'/当前作品集_V32.71/保存结果.json')!==oldV71Hash)throw Error('Frozen V71 changed');\nif(await hash(oldArchive)!==oldHash)")
(r/'scripts/save-current-v32-72.mjs').write_text(s,'utf8')
v=(r/'scripts/verify-v32-71-package.mjs').read_text('utf8').replace('v32-71','v32-72').replace('V32.71','V32.72').replace('32.71','32.72')
v=v.replace("result.tests.push('All current local evidence and source hashes match; frozen V70 unchanged');", "assert.equal(await hash(root+'/当前作品集_V32.71/保存结果.json'),saved.previousV71ArchiveSha256);result.tests.push('All current local evidence and source hashes match; frozen V70 and V71 unchanged');")
v=v.replace("native V17 and retained V16", "native V18 and retained V16/V17")
(r/'scripts/verify-v32-72-package.mjs').write_text(v,'utf8')
print('Current handoffs, tool records, provenance and new archive workflow prepared; completion still awaits current checks and independent package run.')
