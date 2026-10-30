from pathlib import Path
P=Path(__file__).resolve().parents[1]
pages=['v31.html','directory.html','reading.html','learning.html','yangjian.html','mythology.html','after-journey.html','rural-return.html','mid-autumn.html','physical-universe.html','humid-southeast-asia.html']
for name in pages:
 f=P/name;s=f.read_text(encoding='utf-8')
 if 'finish-v137.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="./finish-v137.css?v=32.137"></head>')
 if 'navigation-v137.js' not in s:s=s.replace('</body>','<script src="./navigation-v137.js?v=32.137"></script></body>')
 if name=='reading.html':s=s.replace('reading-book-v135.js?v=32.135','reading-book-v137.js?v=32.137')
 if name=='v31.html':s=s.replace('v31-standalone.js?v=31.45','v31-standalone-v137.js?v=32.137')
 f.write_text(s,encoding='utf-8')
s=(P/'v31-standalone.js').read_text(encoding='utf-8').replace('  function open(target) {','  function performOpen(target) {').replace('  function close(page) {','  function performClose(page) {')
idx=s.index('  document.addEventListener("click"')
s=s[:idx]+'''  function open(target){if(window.portfolioTransition)void window.portfolioTransition(()=>performOpen(target));else performOpen(target);}
  function close(page){if(window.portfolioTransition&&!window.portfolioNavigation?.returning)void window.portfolioTransition(()=>performClose(page));else performClose(page);}
'''+s[idx:]
(P/'v31-standalone-v137.js').write_text(s,encoding='utf-8')
f=P/'src/directory-v137/app.tsx';s=f.read_text(encoding='utf-8').replace('version:136','version:137')
s=s.replace("location.href=['./v31.html?return=1&directory=works','./reading.html?v=32.122','./learning.html?v=32.127','./v31.html?return=1&directory=personal'][i]","const url=['./v31.html?return=1&directory=works','./reading.html?v=32.137','./learning.html?v=32.137','./v31.html?return=1&directory=personal'][i];if((window as any).portfolioNavigate)(window as any).portfolioNavigate(url);else location.href=url")
f.write_text(s,encoding='utf-8')
f=P/'src/reading-story-volumes.ts';s=f.read_text(encoding='utf-8').replace('location.assign(v.url);',"if((window as any).portfolioNavigate)(window as any).portfolioNavigate(v.url);else location.assign(v.url);");f.write_text(s,encoding='utf-8')
print('Shared entry/exit, bottom-return and twelve-card styles integrated into requested surfaces.')
