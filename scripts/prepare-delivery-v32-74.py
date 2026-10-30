from pathlib import Path
P=Path(__file__).resolve().parents[1]
p=P/'scripts/verify-css-assets-v32-73.py';s=p.read_text(encoding='utf8').replace('v32-73','v32-74').replace("['v32-74.css',","['reading.css','v32-73.css','v32-74.css',");(P/'scripts/verify-css-assets-v32-74.py').write_text(s,encoding='utf8')
s=(P/'scripts/save-current-v32-73.mjs').read_text(encoding='utf8').replace('v32-73','v32-74').replace('V32.73','V32.74').replace('remotion-v32-74','remotion-v32-74')
s=s.replace("'v32-74.css','v31-personal.js'","'v32-73.css','v32-74.css','reading.html','reading.css','learning.html','v31-personal.js'")
s=s.replace("await local('VIDEO-TOOLS-V32-72.md');","await add(path.join(source,'blender/reference-architecture-v20'),'项目/blender/reference-architecture-v20',r=>!r.endsWith('.blend1'));\nawait local('VIDEO-TOOLS-V32-72.md');")
s=s.replace("if(f.includes('v32-74')||","if(f.includes('v32-74')||f.includes('v32-73')||")
s=s.replace("await local('c4d/hybrid-study/three.module.js');","await add(path.join(source,'../视觉学习与验收方法.md'),'视觉学习与验收方法.md');\nawait local('.verify/verify-reading-v32-74.mjs');\nawait local('c4d/hybrid-study/three.module.js');")
s=s.replace("const oldV71Hash=await hash(root+'/当前作品集_V32.71/保存结果.json');","const oldV71Hash=await hash(root+'/当前作品集_V32.71/保存结果.json');\nconst oldV73Hash=await hash(root+'/当前作品集_V32.73/保存结果.json');")
s=s.replace('const pending={','const pending={previousV73ArchiveSha256:oldV73Hash,')
s=s.replace("if(await hash(oldArchive)!==oldHash)","if(await hash(root+'/当前作品集_V32.73/保存结果.json')!==oldV73Hash)throw Error('Frozen V73 changed');\nif(await hash(oldArchive)!==oldHash)")
s=s.replace("['export-v74-input.mjs','export-v74-input.ts','finalise-v32-74.mjs'","['export-v74-input.mjs','export-v74-input.ts','finalise-v32-74.mjs'")
(P/'scripts/save-current-v32-74.mjs').write_text(s,encoding='utf8')
s=(P/'scripts/verify-v32-73-package.mjs').read_text(encoding='utf8').replace('v32-73','v32-74').replace('V32.73','V32.74')
s=s.replace("assert.equal(await hash(root+'/当前作品集_V32.72/保存结果.json'),saved.previousV72ArchiveSha256);","assert.equal(await hash(root+'/当前作品集_V32.73/保存结果.json'),saved.previousV73ArchiveSha256);\nassert.equal(await hash(root+'/当前作品集_V32.72/保存结果.json'),saved.previousV72ArchiveSha256);")
s=s.replace("result.opening=await page.evaluate(()=>window.packageOpening);","await page.waitForFunction(()=>window.packageOpening.end);result.opening=await page.evaluate(()=>window.packageOpening);assert(result.opening.homeReady);")
s=s.replace("frames:q?.totalVideoFrames,dropped:q?.droppedVideoFrames", "frames:q?.totalVideoFrames,dropped:q?.droppedVideoFrames,homeReady:window.homeClockState?.ready")
a=s.index("await page.evaluate(()=>window.__v31Lenis.scrollTo(document.querySelector('[data-compact-research]')");b=s.index(' for(const r of local.httpRanges)',a)
s=s[:a]+"assert.equal(await page.locator('.research-portal').count(),2);result.tests.push('Compact 14-image index and two separate reading/learning portals');\n"+s[b:]
needle=" assert.equal(result.errors.length,0);assert.equal(result.external.length,0);"
book="""await page.goto('http://localhost:8032/reading.html');await page.waitForFunction(()=>window.readingBookState?.loading===false);assert.equal(await page.locator('#pageThumbnails button').count(),26);await page.locator('#openBook').click();await page.waitForTimeout(700);await page.locator('#nextPage').click();await page.waitForFunction(()=>window.readingBookState.turns===1);await page.locator('#zoomPage').click();await page.waitForFunction(()=>document.getElementById('fullPageImage').complete);await page.locator('#readerClose').click();await page.goto('http://localhost:8032/learning.html');assert.equal(await page.title(),'学习 · 脑海宇宙');result.tests.push('Independent 26-page 3D book, curved page turn, full-page reader and white learning page');
"""
s=s.replace(needle,book+needle)
s=s.replace('native Blender MCP V19/materials; volumetric envelope with rain; supported giant/islands/continental fog; five animated cards; final AI-era closing section.','native Blender MCP V20/vault shadows and moving forest light; horizontal envelope with falling rain; aligned giant and vegetated island/continental fog; square stacked cards; modest warm closing; separate 26-page 3D reading book and white learning page.')
(P/'scripts/verify-v32-74-package.mjs').write_text(s,encoding='utf8')
print('Prepared new V32.74 archive scripts, including both stylesheets, independent reading pages and frozen V73 verification.')
