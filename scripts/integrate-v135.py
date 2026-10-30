from pathlib import Path
import shutil,re
r=Path(__file__).resolve().parents[1];before=r/'.verify/v32-135/before'
for name in ['src/reading-book.ts','src/reading-story-volumes.ts','v31-works-ring-v131.js']:
 dest=before/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(r/name,dest)
source=r/'src/directory-v132';target=r/'src/directory-v135'
if not target.exists():shutil.copytree(source,target)
ring=(r/'v31-works-ring-v131.js').read_text(encoding='utf-8')
ring=ring.replace('const COUNT = 6;','const COUNT = 5;')
ring=ring.replace('    ["暖竹光径", "场景创作", "光影研究", "数字图像 · 氛围练习", "./assets/works/orbit-previews/bamboo-sun-path.webp"],\n','')
ring=ring.replace('    ["鹤洞遗骨", "场景创作", "遗迹与想象", "数字图像 · 空间练习", "./assets/works/orbit-previews/crane-cave-skull.webp"]','    ["潮湿东南亚", "环保公益短片", "越南 · 水环境", "AI 影像 · 塑料袋的旅程", "./assets/works/humid-southeast-asia/cover.webp", "./humid-southeast-asia.html?v=32.135"]')
ring=ring.replace('"场景练习 · 色彩与氛围", "场景练习 · 遗迹与想象"','"代码构建运动、材质与影像叙事。", "以越南为背景，沿着一只塑料袋看见水环境的处境。"')
ring=ring.replace("'mid-autumn','physical-universe']","'mid-autumn','physical-universe','humid-southeast-asia']")
(r/'v31-works-ring-v135.js').write_text(ring,encoding='utf-8')
for name in ['v31.html','directory.html']:
 p=r/name;text=p.read_text(encoding='utf-8').replace('directory-v132/app.css?v=32.132','directory-v135/app.css?v=32.135').replace('directory-v132/app.js?v=32.132','directory-v135/app.js?v=32.135')
 if name=='v31.html':text=text.replace('v31-works-ring-v131.js?v=32.131','v31-works-ring-v135.js?v=32.135').replace('六项作品','五项作品')
 p.write_text(text,encoding='utf-8')
p=target/'media.ts';s=p.read_text(encoding='utf-8');s=s.replace("'#ced5bd'","'#ced5bd', '#b9c8af'")
s=s.replace('g.position.set(1.02 + i * .10,','g.position.set(1.02 + [2,0,1][i] * .10,')
s=s.replace("'中秋之夜', '乡土归途'];","'中秋之夜', '乡土归途', '潮湿东南亚'];")
s=s.replace("'./assets/works/rural-return/poster.webp'].map","'./assets/works/rural-return/poster.webp', './assets/works/humid-southeast-asia/cover.webp'].map")
s=s.replace('i < 4; i++','i < names.length; i++')
s=s.replace("g.position.set(.42 + (i % 2) * .24, i < 2 ? .89 : 1.10, i < 2 ? .25 : -.005);","g.position.set(i===4?.90:.42 + (i % 2) * .24, i===4||i < 2 ? .89 : 1.10, i===4||i < 2 ? .25 : -.005);")
p.write_text(s,encoding='utf-8')
p=target/'screen.ts';s=p.read_text(encoding='utf-8').replace("poster:'./assets/works/rural-return/poster.webp'}","poster:'./assets/works/rural-return/poster.webp'},\n {title:'潮湿东南亚',src:'',poster:'./assets/works/humid-southeast-asia/cover.webp'}")
s=s.replace('image(WORKS[status.work].poster);loadVideo(WORKS[status.work].src);',"image(WORKS[status.work].poster);if(WORKS[status.work].src)loadVideo(WORKS[status.work].src);else{video.pause();currentVideo='';video.removeAttribute('src');video.load();}")
s=s.replace("osd(w.title,`作品 ${String(status.work+1).padStart(2,'0')}`)","osd(w.title,w.src?`作品 ${String(status.work+1).padStart(2,'0')}`:'环境图集 · 影片剪辑中')")
p.write_text(s,encoding='utf-8')
p=target/'room.ts';s=p.read_text(encoding='utf-8').replace("tape3:'乡土归途 · CD 放映'","tape3:'乡土归途 · CD 放映',tape4:'潮湿东南亚 · 环境图集'")
s=s.replace('const status={windowFinish:',"const status={workTitles:['让画面发生','后西游记','中秋之夜','乡土归途','潮湿东南亚'],bookShelfOrder:['杨戬救母','尤利西斯','电影美学'],windowFinish:")
p.write_text(s,encoding='utf-8')
p=target/'app.tsx';s=p.read_text(encoding='utf-8').replace("['tape3','乡土归途'],","['tape3','乡土归途'],['tape4','潮湿东南亚'],").replace("['book0','电影美学'],['book1','杨戬救母'],['book2','尤利西斯']","['book1','杨戬救母'],['book2','尤利西斯'],['book0','电影美学']").replace('version:132','version:135');p.write_text(s,encoding='utf-8')
# Preserve book identities and actions; move only physical slots on the standalone shelf too.
p=r/'src/reading-story-volumes.ts';s=p.read_text(encoding='utf-8').replace("center:0},{id:'odyssey'","center:-2.66},{id:'odyssey'").replace('center:2.66}];','center:0}];');p.write_text(s,encoding='utf-8')
p=r/'src/reading-book.ts';s=p.read_text(encoding='utf-8').replace('=-2.66-W/2','=2.66-W/2').replace(':-2.66-W/2',':2.66-W/2').replace('bookEntrances:[{id:"cinema",title:"电影美学"},...shelfVolumes]','bookEntrances:[...shelfVolumes,{id:"cinema",title:"电影美学"}]');p.write_text(s,encoding='utf-8')
p=r/'reading.html';s=p.read_text(encoding='utf-8');s=s.replace('<button type="button" data-shelf-book="cinema">电影美学</button>','');s=s.replace('尤利西斯 · 三维神话</a>','尤利西斯 · 三维神话</a><button type="button" data-shelf-book="cinema">电影美学</button>');s=s.replace('三本立体书：电影美学、杨戬劈山救母、尤利西斯嘲弄波吕菲摩斯','三本立体书：杨戬劈山救母、尤利西斯嘲弄波吕菲摩斯、电影美学');s=s.replace('scene-dist/reading-book.js?v=32.113','scene-dist/reading-book-v135.js?v=32.135');p.write_text(s,encoding='utf-8')
# Separate stable browser profile, no extensions or Vulkan, no changes to daily Edge.
p=r.parent/'portfolio-launcher.pyw';s=p.read_text(encoding='utf-8-sig').replace('portfolio-gpu-preview','portfolio-preview-stable-v135').replace('"--use-angle=vulkan",','"--use-angle=d3d11", "--disable-extensions", "--disable-background-mode",').replace('"backend": "ANGLE Vulkan"','"backend": "ANGLE D3D11 stable preview / extensions disabled"');p.write_text(s,encoding='utf-8')
print('Integrated work, fifth CD, physical book order, and stable preview launcher.')
