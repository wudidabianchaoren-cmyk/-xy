from pathlib import Path
import json

root = Path.cwd()
original = root.parent / 'cinematic-ai-archive-prototype'
evidence = root / '.verify/v32-191'

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

flow = read(evidence / 'formal-full/main-flow.json')
preview = read(evidence / 'preview-full/main-flow.json')
hashes = read(evidence / 'formal-hashes/result.json')
project = read(evidence / 'project-final.json')
music = read(evidence / 'formal-music/result.json')
collage = read(evidence / 'formal-edits/result.json')
gallery = read(evidence / 'gallery/result.json')
handoff = read(evidence / 'handoff/luminance.json')
myth = read(evidence / 'myth/result.json')
plan = read(evidence / 'cloudflare/asset-plan.json')
assert all([flow.get('pass'), preview.get('pass'), hashes['allHashesMatch'], music['pass'], collage['pass'], gallery['pass'], handoff['pass']]), 'Do not create a passing release record until required checks pass'

release = {
    'version': 191,
    'url': 'https://vvainex.click/',
    'alternateURL': 'https://www.vvainex.click/',
    'provider': 'Cloudflare Pages', 'project': 'xy',
    'applicationSource': '9e584849fa013beb310bfd9631eda3e3d7a76e2c',
    'previewURL': 'https://3b7f64dd.xy-crg.pages.dev',
    'production': {k: project['canonical_deployment'].get(k) for k in ['id', 'url', 'environment', 'latest_stage']},
    'previewFullFlowPass': preview.get('pass', False),
    'formalRuntimeSmokePass': flow.get('pass', False),
    'productionArtifactHashesVerified': hashes['allHashesMatch'],
    'hashesChecked': len(hashes['records']), 'range': hashes['range'],
    'formalEntry': flow.get('entry'),
    'formalLiveHomeMilliseconds': flow.get('liveEntry', {}).get('at'),
    'formalSteps': [{k: s.get(k) for k in ['name', 'pass', 'milliseconds', 'error']} for s in flow['steps']],
    'filmSamples': {k: v for k, v in flow.items() if k.startswith('films')},
    'sampledErrors': {k: flow.get(k) for k in ['errors', 'console', 'http', 'native']},
    'musicControlsPass': music['pass'], 'collageAndHeaderPass': collage['pass'],
    'galleryDelayedLaterImagesPass': gallery['pass'],
    'localCompositedHandoff': {k: handoff[k] for k in ['samples', 'blackFrames', 'pass']},
    'stagedFiles': len(plan['files']), 'stagedBytes': plan['bytes'],
    'annualTotalBudgetCNY': 20, 'purchases': False,
    'automaticGitProductionBuilds': False, 'domainOrDNSChangedThisTurn': False,
    'originalUEAndRawArtworkPreserved': True,
    'originalAuthoredMoviesPreserved': True,
    'qualityApproved': False, 'allRequirementsComplete': False,
    'limits': [
        'Preview is immediate original-scene imagery during preparation, not an already interactive 3D scene.',
        'First live scene preparation remains slow and varies with network and GPU; timings are recorded.',
        'Isolated local Iris Xe myth sample about 14.45 FPS; sustained smoothness requirement is not achieved.',
        'Fifty sampled local handoff frames contain no black frame; not proof of universal zero flicker.',
        'Browser renderer remains distinct from original UE; no native pixel identity or user acceptance claim.',
        'Normal Edge public checks use current workstation networking; not a full physical-interface or worldwide guarantee.'
    ]
}

qa = {
    'version': 191, 'formalFlow': release['formalSteps'],
    'formalPass': flow.get('pass', False), 'previewPass': preview.get('pass', False),
    'music': music, 'collage': collage, 'delayedGallery': gallery,
    'localHandoff': {k: handoff[k] for k in ['samples', 'blackFrames', 'minimumCentreBrightness', 'pass', 'scope']},
    'localMyth': myth,
    'earlierFailedGalleryTestPreservedIn': '.verify/v32-191/gallery.log',
    'firstFormalFocusedChecks': {
        'music': read(evidence / 'formal-music-initial/result.json'),
        'collage': read(evidence / 'formal-edits-initial/result.json'),
        'notes': 'First music sample clicked a disabled seek control before metadata existed; corrected test waits for enabled control. First collage navigation exceeded default30s DCL; retry uses60s. Initial failures retained, not a zero-wait claim.'
    },
    'failedExperimentsNotPublished': ['iframe opacity zero was reverted after slow assembly', 'flat turntable environment replaced with shaped studio reflections'],
    'inheritedV190NetworkLimitsPreserved': True
}

home_seconds = round(release['formalLiveHomeMilliseconds'] / 1000, 2)
myth_seconds = round(next(s['milliseconds'] for s in flow['steps'] if s['name'] == 'myth-entry') / 1000, 2)
current = f'''# V32.191 / 2026-11-05 / SCOPED CONTENT REPAIR PUBLISHED; PERFORMANCE STILL INCOMPLETE

Fixed URL https://vvainex.click/ (www retained). Production {release['production']['id']}; application 9e584849fa013beb310bfd9631eda3e3d7a76e2c. Same Cloudflare Pages xy / Free plan, no domain/DNS/provider/purchase changes. Automatic Git production builds remain disabled. Single agent, desktop only, annual TOTAL20CNY. Browser branch deploy/netlify-browser-v179 source; original main metadata only. Every Git invocation matching absolute safe.directory AND cwd.

Read deploy/cloudflare-v191-release.json and cloudflare-v191-qa.json. Preview12-step click flow pass={preview.get('pass', False)}; formal12-step pass={flow.get('pass', False)}; formal61 artifact hashes match={hashes['allHashesMatch']}, original MP4 Range206/512 bytes. Real flow includes original20+16s movies, reading/cinema/page-turn/shelf return, myth/day-night/return, desktopTV/notebook, five works/six films midpoint plus sustained samples and final retained LIVE home. Music mouse volume/native keyboard/seek/close pass={music['pass']}; collage header hide/restoration and ten-image load/centering pass={collage['pass']}.

Changes: preserve previous painted surface instead of black transition; original scene previews while live reading/myth prepare; persistent child-return handshake; GPU-completion fence for home handoff and final restored myth day lighting; mirror cache now includes light state. Collage symmetric perimeter/gather animation, original English and ten images preserved, header/author/volume/brightness/catalog hidden only in this section. Native accessible music ranges and mute/volume-up work; original Three turntable mesh improved with walnut/metal/bevel/shaped studio reflections, volume knob/progress arm. Both142 and152 glass galleries reveal first image before delayed later images, retain previous image while next decodes; actual work cover replaces black after authored shutter. Tiny original160x160 coast-depth raster byte verified, fallback original computation. Slight layered water tint, original island/ship/birds/fields retained. Depth prewarm drains response bodies. New derivatives only real assets/browser-v191; original art/raw/UE/junctions unchanged, no engine/native/driver/art production loops.

Controlled gallery later-image5s delay: before5441ms first image, after358ms, next control passed. Local actual composited home handoff50 frames: no sampled black frame. This does not mean all loading or FPS problems solved. Formal LIVE home{home_seconds}s including original36s; myth entry{myth_seconds}s. Local isolated Iris Xe myth14.45FPS, 6sec sample. First interactive3D still waits, exact live content is not replaced by previews. No instant-load/zero-stutter/allbugs/native1:1/worldwide/user-acceptance claim; qualityApproved=false, allRequirementsComplete=false. V190 physical-interface/full-flow failures remain historical evidence. Current normal Edge public checks are not a new VPN-off performance proof. Local and initial preview failures retained under .verify/v32-191.

Build: python scripts/browser-v179/build-release-v191.py; then stage-cloudflare-v191.py; cloudflare-hashes-v191.mjs after complete stage. Official incremental upload only changed hashes. Publish ONLY .verify/v32-191/cloudflare/site, project xy branch main, not raw/native repo. Modern/fallback namespace191 preserves immutable189/190 assets. No more provider/engine/quarantinedCLI/art/driver loops.
'''

deploy = f'''# 作品集局部修复 V32.191

固定网址：https://vvainex.click/ 。兼容入口：https://www.vvainex.click/ 。本轮继续使用原 Cloudflare Pages 项目 xy，没有改域名、DNS或开通付费服务。

正式发布：{release['production']['id']}。源代码：9e584849fa013beb310bfd9631eda3e3d7a76e2c。浏览器分支保存源码；原 main 只保存记录，自动 Git 构建保持关闭。

已修改：页面跳转保留已绘制画面，书架和神话使用原场景预览承接；首页和神话待 GPU 画面完成后交接，修正神话昼夜预热缓存；图片汇集恢复对称散布及聚散，只在该区隐藏页头、控制与目录；音乐音量/进度/静音/增大音量修复，Three.js 唱机材质与反光细化；两个玻璃墙脚本首图先显示，不再等待全部图片；作品封面承接影片解码；海水轻微增加近浅远深层次。原影片、原工程、场景与图片保留。

预览及正式站完整12步点击/六段视频中点和持续播放/返回检查通过；正式61项文件 SHA256 一致。音乐鼠标、键盘、进度和关闭、图片汇集隐藏与恢复检查通过。故意延迟后续玻璃墙图片5秒时，首图从约5.44秒降到0.36秒。首页交接本地采集50帧未采到黑帧。

仍有明确限制：正式首次 LIVE 首页约{home_seconds}秒（含原36秒开场），神话首次交互约{myth_seconds}秒；本机集成显卡神话短测约14.45FPS。预览是等待时的真实场景图片，不等于实时3D已经就绪，因此不能称全部性能目标完成、所有设备丝滑或全部问题消失。当前公网检查不替代全球线路及用户视觉验收。完整证据与历史失败保留在 deploy/cloudflare-v191-*.json 和 .verify/v32-191。
'''

for folder in [root, original]:
    (folder / 'deploy/cloudflare-v191-release.json').write_text(json.dumps(release, ensure_ascii=False, indent=2), encoding='utf-8')
    (folder / 'deploy/cloudflare-v191-qa.json').write_text(json.dumps(qa, ensure_ascii=False, indent=2), encoding='utf-8')
    (folder / 'CURRENT-V32-191-RESUME.md').write_text(current, encoding='utf-8')
    (folder / 'DEPLOY-CLOUDFLARE-REPAIR-V191.md').write_text(deploy, encoding='utf-8')
    p = folder / 'CURRENT-V32-185-RESUME.md'
    previous = p.read_text(encoding='utf-8')
    prefix = 'Latest release: read CURRENT-V32-191-RESUME.md first. Same vvainex.click; scoped repair published, live3D preparation/FPS requirements still incomplete.\n\n'
    if not previous.startswith(prefix):
        p.write_text(prefix + previous, encoding='utf-8')

heading = f'''# CURRENT V32.191 / 2026-11-05 / SCOPED REPAIR PUBLISHED
Read cinematic-ai-archive-prototype/CURRENT-V32-191-RESUME.md first. Same https://vvainex.click/ Cloudflare xy, production{release['production']['id']}, source9e58484. Preview+formal12-step/sixfilms and61SHA passed. Music mouse/key/seek and collage hide/centering pass; gallery delayed-images first5.44s->0.36s;50local handoff frames no sampled black frame. BUT formalLIVEhome{home_seconds}s/myth{myth_seconds}s and localIrisXe myth14.45FPS remain; qualityApproved=false, allRequirementsComplete=false. Original UE/art/media preserved, no DNS/provider/purchase changes. Singleagent/desktop, annualTOTAL20CNY, autoGitbuilds disabled; browserbranchsource/originalmainmetadata, matching absolute Git safe.directory+cwd. No native/engine/driver/art/quarantinedCLI loops. Do not claim allbugs/instant/zero-stutter/native1:1/worldwide/useracceptance. Read tracked cloudflare-v191 records.

---

'''
for p in [root.parent / 'AGENTS.md', root / 'AGENTS.md', original / 'AGENTS.md']:
    if p.exists():
        previous = p.read_text(encoding='utf-8')
        if not previous.startswith('# CURRENT V32.191'):
            p.write_text(heading + previous, encoding='utf-8')
print(json.dumps({'recorded': True, 'formalPass': flow.get('pass'), 'hashes': len(hashes['records']), 'remainingPerformanceDebt': True}))
