from pathlib import Path
import json

root=Path.cwd(); original=root.parent/'cinematic-ai-archive-prototype'; v=root/'.verify/v32-192'
def read(path):
    raw=path.read_bytes()
    return json.loads(raw.decode('utf-16' if raw.startswith((b'\xff\xfe',b'\xfe\xff')) else 'utf-8-sig'))
physical=read(v/'formal-final-physical/main-flow.json')
normal=read(v/'formal-final-normal/main-flow.json')
hashes=read(v/'final-hashes/result.json')
project=read(v/'project-published-final.json')
personal=read(v/'personal-formal/result.json')
handoff=read(v/'work-handoff-final/result.json')
assert hashes['allHashesMatch'] and personal['pass'] and handoff['pass']
assert all(s['pass']for s in physical['steps']) and all(s['pass']for s in normal['steps'])
assert not normal['errors'] and not normal['http'] and not normal['native']
def summary(flow):
    return {'strictPass':flow.get('pass',False),'contentStepsPass':all(s['pass']for s in flow['steps']),
        'entryNavigation':flow.get('initialNavigation'),'liveHomeSeconds':round(flow['liveEntry']['at']/1000,3),
        'authoredOpening':flow.get('entry'),'steps':[{k:s.get(k)for k in ['name','pass','milliseconds','error']}for s in flow['steps']],
        'films':{k:value for k,value in flow.items()if k.startswith('films')},
        'sampledErrors':{k:flow.get(k,[])for k in ['errors','console','http','native']},
        'mythPreparation':flow.get('mythPreparation192'),'workTransitions':flow.get('workTransitions192')}
regional=read(v/'regional-final-results.json')
network={'version':192,'url':'https://vvainex.click/','DNS':read(v/'physical-dns.json'),
    'HTTP3Before':read(v/'http3-ui-before.json'),'HTTP3After':read(v/'http3-ui-after.json'),
    'HTTP2Unchanged':read(v/'http2-ui-before.json'),
    'physicalRouteProbes':read(v/'physical-routes-after-http3.json'),
    'regionalGET':[{'country':r['probe']['country'],'city':r['probe']['city'],'asn':r['probe']['asn'],'status':r['result'].get('statusCode'),'timings':r['result'].get('timings')}for r in regional['results']],
    'physicalFullFlow':summary(physical),'systemRoutesVPNDNSChanged':False,'physicalInterface':17,'physicalAddress':'10.49.64.1',
    'diagnosticTransport':'Loopback CONNECT8060 binds sockets to physical WLAN; TLS is not intercepted. This bypasses workstation Mihomo interface, not proof about all upstream networks.',
    'earlierBaselineDCLTimeoutSeconds':60,'first192PhysicalDCLTimeoutSeconds':60,
    'bulkPhysicalHashDidNotComplete':read(v/'physical-hashes-interrupted.json'),
    'PQCClientDiagnosticOnly':True,'ProductionTLSOrPQCSettingsChanged':False,
    'allDomesticOrInternationalRoutesGuaranteed':False,
    'references':['https://developers.cloudflare.com/speed/optimization/content/compression/','https://developers.cloudflare.com/speed/optimization/protocol/http2/','https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/geographic-traffic-routing/']}
plan=read(v/'cloudflare/asset-plan.json');htmlBytes=(v/'cloudflare/site/index.html').stat().st_size
release={'version':192,'date':'2026-11-06','url':'https://vvainex.click/','www':'https://www.vvainex.click/',
    'provider':'Cloudflare Pages','project':'xy','applicationSource':'e22594de8558fdbae771dbd79c27d158eeb670f8',
    'production':{k:project['canonical_deployment'].get(k)for k in ['id','url','environment','latest_stage']},
    'formalNormal':summary(normal),'formalPhysical':summary(physical),
    'artifactHashesMatch':hashes['allHashesMatch'],'artifactHashesChecked':len(hashes['records']),'originalMP4Range':hashes['range'],
    'HTMLBytesBefore':2178056,'HTMLBytesAfter':htmlBytes,'HTMLReductionPercent':round((1-htmlBytes/2178056)*100,2),
    'personalPass':personal['pass'],'desktopViewports':[x['viewport']for x in personal['views']],
    'portrait':{'original':{'width':1080,'height':1956,'preserved':True},'delivered':{'width':750,'height':1358,'bytes':145750,'file':'assets/browser-v192/portrait.webp'},'framing':'Complete image; CSS contain, no haircut crop'},
    'workHandoff':{'pass':handoff['pass'],'samples':len(handoff['samples']),'crossImageDissolveRemoved':True,'returnPass':handoff['returned']},
    'stagedFiles':len(plan['files']),'stagedBytes':plan['bytes'],'allOriginalUEArtworkMediaPreserved':True,
    'singleAgent':True,'desktopOnly':True,'annualTotalBudgetCNY':20,'paidResourcesPurchased':False,
    'automaticGitProductionBuilds':False,'DNSOrDomainProviderChanged':False,'HTTP3Disabled':True,'HTTP2StillOnFreePlan':True,
    'qualityApproved':False,'allRequirementsComplete':False,
    'limits':['Physical full content flow completed with fourteen ERR_HTTP2_PING_FAILED console messages and successful retries; strict physical smoke is false.',
        'Physical first shelf and myth still about68/70seconds. Selected regional GET200 responses are not a worldwide or permanent guarantee.',
        'Local isolated Iris Xe myth about14.94FPS remains. No 60FPS/zero-stutter/native1:1/user-acceptance claim.',
        'Opening/intro frame drops are recorded; six sampled work films have normal advancement, not universal zero rebuffering.']}
qa={'version':192,'personal':personal,'handoff':handoff,'localMyth':read(v/'myth-local/result.json'),
    'earlierLocalHandoffAssertionFailure':'local-delivery-final tested state before two-rAF acknowledgement; corrected wait checks actual current-frame acknowledgement.',
    'oldCrossImageOverlapVisibleIn':'local-final/work-handoff-0.png','repairedSamples':'work-handoff-final/0.png through4.png',
    'previewInitialPass':read(v/'preview-full/main-flow.json').get('pass'),
    'localFullBeforeFinalAtomicHandoffPass':read(v/'local-final/main-flow.json').get('pass'),
    'finalNormalPass':normal.get('pass',False),'finalPhysicalContentPass':all(s['pass']for s in physical['steps']),
    'finalPhysicalStrictPass':physical.get('pass',False),'allFinalHashesMatch':hashes['allHashesMatch'],
    'failedPrecompressedHTMLProbeNotReleased':True,'originalInputsUnchanged':True}
pid=release['production']['id']; ns=release['formalNormal']['liveHomeSeconds']; ps=release['formalPhysical']['liveHomeSeconds']
regionSummary='; '.join(str(x['asn'])+'/'+x['city']+'='+str(x['status'])+' in'+str(x['timings']['total'])+'ms'for x in network['regionalGET'])
text=f'''# V32.192 / 2026-11-06 / ENTRY AND PROFILE REPAIR PUBLISHED; PHYSICAL HTTP2 ERRORS REMAIN

Read this first. Fixed URL https://vvainex.click/ , www retained. Production {pid}; final application e22594de8558fdbae771dbd79c27d158eeb670f8. Same Cloudflare Pages xy and Free plan. No purchases, DNS/nameserver/domain/provider changes. HTTP3 switched On->Off through authorized normal Edge dashboard and verified. HTTP2 remains On and disabled for editing on Free; no upgrade. Annual TOTAL20CNY, single agent, desktop only. Browser branch source/original main metadata only, every Git invocation matching absolute safe.directory AND cwd. Original UE/art/media/junction inputs preserved.

HTML entry was2178056 bytes with no-transform disabling compression. Final HTML {htmlBytes} bytes; large shared scripts/styles are external content-addressed files with verified Brotli responses. Exact HTML/no-transform guard remains. Deferred site-refinements-v129.js and dynamically inserted heading-interaction-v157.js were observed pending while other resources completed; both are now inline after-parse modules, with the existing heading-loader marker preventing duplicate insertion. Removed head prefetch for the unused historical alternate courtyard; actual owner still requests original model and textures. Main network/renderer artwork are not replaced with a static site.

Myth independent coast maps/scans, cottage, foliage, sky and exact native probes download in parallel and attach in original order; full6 visibility fields and same geometry/material resolution remain. Work route has generation guards, a pending return button, opaque archive isolation and actual poster decode readiness. Frame review caught a cover/movie cross-dissolve that looked like projection intrusion; removed that dissolve and switch after composited frame readiness. Focused actual card/5screen samples/return passed, no transparent image overlap in sampled frames. Existing opening20+16seconds and works6films preserved.

Personal page uses supplied complete portrait750x1358/145750bytes, CSScontain, name/role/birth2005-03-05 on left, selected internship and two supplied projects on right, aligned full-width labelled contacts. No marketing slogan. Formal1920x1080 and1440x900 screenshots/overflow/framing/birth/contact/close pass; scoped style lint0FAIL/0WARN.

Final normal full12-step strict pass={normal.get('pass',False)}, {len(hashes['records'])} formal hashes match. Original MP4Range206/512bytes. Final physical-interface full12 content steps and6films midpoint/sustained/return PASSED, but STRICT physical smoke FALSE due14 ERR_HTTP2_PING_FAILED console messages followed by successful retries. No JS/HTTP/native errors sampled. Normal LIVEhome {ns}s, physical LIVEhome {ps}s, includes original36s. Physical first shelf68.12s and myth69.75s remain slow. Initial normal preview LIVEhome41.27s/myth25.30s is a different route and cannot be quoted as physical speed. Local isolated IrisXe myth14.94FPS remains. No allbugs/instant/zero-stutter/native1:1/worldwide/user-acceptance claim; qualityApproved=false, allRequirementsComplete=false.

DNS via physical WLAN gateway, AliDNS and DNSPod returned correct Cloudflare addresses. Final regional GET: {regionSummary}. All6 returned200; selected probes do not guarantee all routes. Physical route probes still include one HTTP timeout and one Pages-pool TLS timeout. Initial191 and first192 physical DCL60s failures, interrupted bulk physical hash, client-only PQ diagnostic and rejected compressed-HTML probe preserved under.verify/v32-192. No global VPN/DNS/route/security changes; CONNECT8060 is diagnostic only and bound to interface17/address10.49.64.1, no TLS interception. Do not claim all ISP routes are fixed.

Rebuild with scripts/browser-v179/build-release-v192.py; wait for completion, then stage-cloudflare-v192.py and cloudflare-hashes-v192.mjs; official incremental missing-hash upload. Publish ONLY.verify/v32-192/cloudflare/site to existing xy/main, never raw/native root. Modern/fallback192 files preserved; packed files are content-addressed, older published hashes retained. Read tracked deploy/cloudflare-v192-release.json, network.json and qa.json. No further provider/engine/native/driver/art/quarantinedCLI loops; this two-hour task is closing after final backup.
'''
deploy=f'''# 作品集入口、作品交接与个人介绍修复 V32.192

固定网址：https://vvainex.click/ 。正式发布：{pid}。源码：e22594de8558fdbae771dbd79c27d158eeb670f8。本轮继续使用原 Cloudflare Pages 免费项目，没有购买服务、改域名或 DNS；自动 Git 构建保持关闭。

首页 HTML 从2.18MB减到约{round(htmlBytes/1024)}KB，大脚本与样式独立压缩和缓存；保留原开场和画面。将阻塞初始化的装饰脚本并入页面，取消备用建筑提前下载。神话素材并行准备，原模型、纹理、六组可见性数据保留。取消作品封面与影片的透明叠加，首帧就绪后交接，并防止旧切换回调影响下一作品。

个人介绍改为姓名与经历为主，摘取简历中实习、两个主要项目和个人实践；出生日期2005年3月5日。头像完整显示，原照片保留。联系方式分栏对齐。两个电脑分辨率的排版、头像、文字、联系方式和关闭实测通过。

正式站正常网络12步严格检查通过={normal.get('pass',False)}；{len(hashes['records'])}项文件哈希一致。绕过本机 VPN 虚拟网卡的实体 Wi-Fi 流程完成了12步及六段影片中点/持续播放/返回，但记录到14条HTTP/2连接失败后重试恢复，因此严格无错误检查未通过。国内电信、联通、移动三个节点及美、德、新加坡GET均200。HTTP/3已关闭；免费套餐不能关闭HTTP/2，没有升级套餐。

仍未完成：实体线路书架和神话首次进入约68–70秒，存在网络连接重试；本机集成显卡神话短测约15FPS。域名注册在阿里云并不改变当前Cloudflare承载线路。不能称全部国内线路长期稳定、所有性能目标完成或用户已验收。详细数据与失败保留在deploy/cloudflare-v192-*.json和.verify/v32-192。
'''
for folder in [root,original]:
    for name,data in [('release',release),('network',network),('qa',qa)]:
        (folder/f'deploy/cloudflare-v192-{name}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    (folder/'CURRENT-V32-192-RESUME.md').write_text(text,encoding='utf-8')
    (folder/'DEPLOY-CLOUDFLARE-REPAIR-V192.md').write_text(deploy,encoding='utf-8')
    p=folder/'CURRENT-V32-185-RESUME.md';old=p.read_text(encoding='utf-8');prefix='Latest release: read CURRENT-V32-192-RESUME.md first. Same vvainex.click; physical12-step content flow passes, HTTP2 network errors and slow3D remain.\n\n'
    if not old.startswith(prefix):p.write_text(prefix+old,encoding='utf-8')
heading=f'''# CURRENT V32.192 / 2026-11-06 / CONTENT FLOW PASSES; HTTP2 RECOVERY/PERFORMANCE DEBT
Read cinematic-ai-archive-prototype/CURRENT-V32-192-RESUME.md first. Same vvainex.click Cloudflare xy, production{pid}, sourcee22594d. HTML2.18MB->{htmlBytes}bytes, compressed shared assets, inline polish, unused model prefetch removed, parallel exact myth assets, atomic work handoff, supplied full portrait and factual profile. Normal12-step strict={normal.get('pass',False)}, {len(hashes['records'])}SHA match, personal2desktop views/handoff5samples pass. Physical12steps/6films content pass BUT strictfalse14HTTP2PINGFAILED recovered; physicalLIVEhome{ps}s, shelf68s/myth70s, localIrisXe14.94FPS. HTTP3Off via normalUI; HTTP2On lockedFree. DNS/CN3carriers+US/DE/SG GET200, not universal stability. AnnualTOTAL20CNY/no purchases, singleagent/desktop, autoGitbuilds disabled; sourcebrowserbranch/mainmetadata, matching absolute Git safe.directory+cwd. OriginalUE/art/media preserved. No allbugs/zero-stutter/native1:1/instant/worldwide/useracceptance claim. No further provider/engine/native/driver/art/quarantinedCLI loops; finish backup.

---

'''
for p in [root.parent/'AGENTS.md',root/'AGENTS.md',original/'AGENTS.md']:
    if p.exists():
        old=p.read_text(encoding='utf-8')
        if not old.startswith('# CURRENT V32.192'):p.write_text(heading+old,encoding='utf-8')
print(json.dumps({'recorded':True,'normalStrict':normal.get('pass',False),'physicalContent':True,'physicalStrict':False,'hashes':len(hashes['records'])}))
