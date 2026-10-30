from pathlib import Path
P=Path(__file__).resolve().parents[1]
p=P/'mythology.html'
s=p.read_text(encoding='utf-8')
s=s.replace('</head>', '<link rel="stylesheet" href="./mythology-ue-v149.css?v=32.149"></head>')
s=s.replace('<p>正在走入晨雾</p>', '<p>正在走入暮光海湾</p><button type="button" data-ue-retry hidden>重新连接海湾</button>')
s=s.replace('<canvas class="odyssey-canvas" tabindex="0" role="img" aria-label="尤利西斯的归航海湾，海船、船员、岩岸与分层植被"></canvas>', '<div id="ueCove" tabindex="0" role="application" aria-label="尤利西斯归航海湾：左键拖动观察，滚轮靠近或远离"></div><span class="ue-cove-help">按住左键环顾 · 滚轮靠近与远离</span>')
s=s.replace('./scene-dist/mythology-compact-v146.js?v=32.148','./scene-dist/mythology-ue-v149.js?v=32.149')
p.write_text(s,encoding='utf-8')
p=P/'v31.html';s=p.read_text(encoding='utf-8').replace('v=32.148','v=32.149').replace('scene-dist/directory-v144/app.js?v=32.141','scene-dist/directory-v144/app.js?v=32.149');p.write_text(s,encoding='utf-8')
p=P/'navigation-v144.js';s=p.read_text(encoding='utf-8').replace("'32.144'","'32.149'").replace('mythology.html?v=32.144','mythology.html?v=32.149');p.write_text(s,encoding='utf-8')
print('V149 existing page and navigation integrated')
