from pathlib import Path
from PIL import Image,ImageOps,ImageEnhance,ImageDraw,ImageFont
import json,shutil,re
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-137';B=V/'before';B.mkdir(parents=True,exist_ok=True)
targets=['v31.html','mythology.html','directory.html','reading.html','learning.html','yangjian.html','after-journey.html','rural-return.html','mid-autumn.html','physical-universe.html','humid-southeast-asia.html','v31-standalone.js','src/reading-book.ts','src/reading-story-volumes.ts']
for name in targets:
 f=P/name;t=B/name
 if f.exists() and not t.exists():t.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,t)
# Covers use actual material from each work, not a generic icon or an invented still.
C=P/'assets/works/covers-v137';C.mkdir(exist_ok=True)
def save(im,name):im.save(C/name,'WEBP',quality=96,method=6)
im=Image.open(P/'assets/works/rural-return/frame-02.webp').convert('RGB');im=ImageEnhance.Brightness(im).enhance(1.12);im=ImageEnhance.Contrast(im).enhance(1.035);save(ImageOps.fit(im,(1920,1080),method=Image.Resampling.LANCZOS),'rural.webp')
im=Image.open(P/'assets/works/mid-autumn/cover-v32-92.webp').convert('RGB');save(ImageOps.fit(im,(2560,1440),method=Image.Resampling.LANCZOS,centering=(.5,.36)),'mid-autumn.webp')
im=Image.new('RGB',(2400,1350),(239,241,232));left=Image.open(P/'assets/works/physical-universe-v103/frame-07.webp').convert('RGB');left.thumbnail((1430,900));im.paste(left,(70,(1350-left.height)//2));right=Image.open(P/'assets/life-purpose/v32-72/poster.png').convert('RGB');right=ImageOps.fit(right,(790,1350),method=Image.Resampling.LANCZOS,centering=(.66,.43));im.paste(right,(1610,0));d=ImageDraw.Draw(im);font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',29);d.text((80,1210),'01  图形与物理手感',font=font,fill=(62,76,69));d.text((1640,1210),'02  手绘与叙事',font=font,fill=(62,62,47));save(im,'code-films.webp')
# 11 authored collages + one composition of the 8 source elements = the original 12 slots.
source=json.loads((P/'assets/hobby-kid-v132/collection.json').read_text(encoding='utf-8'))['items'];collages=[x for x in source if x['group']=='collage'];elements=[x for x in source if x['group']=='elements']
H=P/'assets/hobby-orbit-v137';H.mkdir(exist_ok=True);items=[]
for i,item in enumerate(collages):
 canvas=Image.new('RGB',(2048,1152),(248,247,244));pic=Image.open(P/item['src'].removeprefix('./')).convert('RGB');pic.thumbnail((1984,1088),Image.Resampling.LANCZOS);canvas.paste(pic,((2048-pic.width)//2,(1152-pic.height)//2));canvas.save(H/f'{i+1:02}.webp',quality=95,method=6)
 items.append(dict(en='Kaito Kid / '+str(i+1).zfill(2),cn=item['title'],note='怪盗基德 · 视觉拼贴收藏',english='Kaito Kid — a personal study of graphic composition, framing and visual storytelling.',thumb=f'./assets/hobby-orbit-v137/{i+1:02}-thumb.webp',src=f'./assets/hobby-orbit-v137/{i+1:02}.webp',width=2048,height=1152,kid=True))
canvas=Image.new('RGB',(2560,1440),(248,247,244))
for i,item in enumerate(elements):
 pic=Image.open(P/item['src'].removeprefix('./')).convert('RGB');pic=ImageOps.contain(pic,(608,660),Image.Resampling.LANCZOS);x=(i%4)*640+(640-pic.width)//2;y=(i//4)*720+(720-pic.height)//2;canvas.paste(pic,(x,y))
canvas.save(H/'12.webp',quality=95,method=6)
items.append(dict(en='Kaito Kid / Elements',cn='扑克、线条与色块',note='八幅原始图形元素的组合',english='Eight original graphic elements from the same collection.',thumb='./assets/hobby-orbit-v137/12-thumb.webp',src='./assets/hobby-orbit-v137/12.webp',width=2560,height=1440,kid=True))
for i in range(12):
 im=Image.open(H/f'{i+1:02}.webp');im.thumbnail((480,270));im.save(H/f'{i+1:02}-thumb.webp',quality=92)
(H/'manifest.json').write_text(json.dumps({'items':items,'sourceImages':len(source),'orbitCards':12,'placeholderImages':0},ensure_ascii=False,indent=2),encoding='utf-8')
s=(P/'v31-hobby-v136.js').read_text(encoding='utf-8');start=s.index('  const items = [');end=s.index('  const sizes =',start)
s=s[:start]+'  const items = '+json.dumps(items,ensure_ascii=False,separators=(',',':'))+';\n  const angles=items.map((_,i)=>-90+i*30);\n  const orbitOrder=items.map((_,i)=>i);\n'+s[end:]
s=s.replace('items[itemIndex].kid?[48,48*items[itemIndex].height/items[itemIndex].width]:sizes[itemIndex%sizes.length]','[88,49.5]')
s=s.replace('scene by','scene by')
(P/'v31-hobby-v137.js').write_text(s,encoding='utf-8')
# Clock fine meshes must never become the generic distant mesh simplification.
s=(P/'src/home-distance-detail.ts').read_text(encoding='utf-8');s=s.replace("!/marble/i.test(o.name)","!/marble/i.test(o.name)&&!(Array.isArray(o.material)?o.material:[o.material]).some(m=>/gold|gilt|brass|bronze|silver|clock|chapter/i.test(m.name))")
(P/'src/home-distance-v137.ts').write_text(s,encoding='utf-8')
s=(P/'src/home-world-v133.ts').read_text(encoding='utf-8').replace("from './home-distance-detail'","from './home-distance-v137'")
s="import {finishHomeV137} from './home-finish-v137';\n"+s
s=s.replace('clockFinish:refineClockFinish(scene)','clockFinish:refineClockFinish(scene),materialFinishV137:finishHomeV137(scene)')
s=s.replace('renderQuality=integrated?.72:1','renderQuality=integrated?.92:1').replace('integrated?.55:.75','integrated?.85:.88').replace('integrated?.85:1','1')
s=s.replace('setSamples(integrated?0:2)','setSamples(2)')
(P/'src/home-world-v137.ts').write_text(s,encoding='utf-8')
s=(P/'src/scene-loader-v133.ts').read_text(encoding='utf-8').replace('./home-world-v133.js?v=32.133','./home-world-v137.js?v=32.137');(P/'src/scene-loader-v137.ts').write_text(s,encoding='utf-8')
# Refit the existing sea world; retain original sky, water and vegetation implementation.
s=(P/'src/mythology-compact-v134.ts').read_text(encoding='utf-8').replace('version:134','version:137').replace('blender/mythology-v32-134/compact-cove-lighting.blend','blender/mythology-v32-137/armed-crew-and-ship.blend').replace("'./assets/odyssey/compact-v133/hero-ship.glb'","'./assets/odyssey/refit-v137/armed-ship.glb'")
s=s.replace('soilPhoto.colorSpace=', '''const lowerShore=(h:number)=>h-.65*(1-THREE.MathUtils.smoothstep(h,-.3,.75));
 heightData.heights=heightData.heights.map(lowerShore);
 land.scene.updateMatrixWorld(true);land.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const p=o.geometry.getAttribute('position'),q=new THREE.Vector3(),inv=o.matrixWorld.clone().invert();for(let i=0;i<p.count;i++){q.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);q.y=lowerShore(q.y);q.applyMatrix4(inv);p.setXYZ(i,q.x,q.y,q.z);}p.needsUpdate=true;o.geometry.computeVertexNormals();});
 state.shorelineFix='terrain extends beneath troughs; wet-foot irradiance no longer crushed to black';
 soilPhoto.colorSpace=''')
s=s.replace('mix(.38,1.,smoothstep(-.25,1.1,h))','mix(.86,1.,smoothstep(-.65,1.2,h))')
# Physical grain follows the long hull axis; wet timber is darker and less rough at the waterline.
s=s.replace("if(/sail|linen/i.test(mat.name)){",'''if(/weathered oak|timber|hemp/i.test(mat.name)&&!/linen|sail/i.test(mat.name)){
    mat.roughness=.64;mat.envMapIntensity=.85;
    const oldHook=mat.onBeforeCompile;
    mat.onBeforeCompile=(s,r)=>{oldHook.call(mat,s,r);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\\nvarying vec3 shipPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\\nshipPoint=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\\nvarying vec3 shipPoint;').replace('#include <color_fragment>',`#include <color_fragment>
      float grain=sin(shipPoint.x*3.+sin(shipPoint.z*42.)*.2+shipPoint.y*39.);float wet=1.-smoothstep(-.15,.60,shipPoint.y);diffuseColor.rgb*=mix(.92,1.06,grain*.5+.5)*mix(1.,.60,wet);`).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
      roughnessFactor=mix(roughnessFactor,.34,1.-smoothstep(-.15,.60,shipPoint.y));`);};mat.customProgramCacheKey=()=> 'v137-longitudinal-timber-and-wet-foot';
   }
   if(/armor|bronze bowl|armor edges/i.test(mat.name)){mat.metalness=.9;mat.roughness=.30;mat.envMapIntensity=1.1;}
   if(/sail|linen/i.test(mat.name)){''')
s=s.replace('boat.position.y=Math.sin(time*.68)*.055;boat.rotation.z=Math.sin(time*.41)*.002;',"boat.position.y=.105*Math.sin(time*.45)+.045*Math.sin(time*.37+.8);boat.rotation.z=.0035*Math.cos(time*.45);boat.rotation.x=.002*Math.sin(time*.37);")
s=s.replace('state.components={','state.crewRefit={actors:14,armor:true,source:\'actual local Blender GLB\'};state.components={')
(P/'src/mythology-compact-v137.ts').write_text(s,encoding='utf-8')
# Work covers: fill authored canvas rather than inserting black bars around it.
s=(P/'v31-works-ring-v135.js').read_text(encoding='utf-8').replace('./assets/works/rural-return/cover.webp','./assets/works/covers-v137/rural.webp').replace('./assets/works/mid-autumn/cover-v32-92.webp','./assets/works/covers-v137/mid-autumn.webp').replace('./assets/works/physical-universe-v103/cover.webp','./assets/works/covers-v137/code-films.webp').replace('const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);','const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);')
(P/'v31-works-ring-v137.js').write_text(s,encoding='utf-8')
shutil.copytree(P/'src/directory-v136',P/'src/directory-v137',dirs_exist_ok=True)
f=P/'src/directory-v137/media.ts';s=f.read_text(encoding='utf-8').replace('./assets/works/rural-return/cover.webp','./assets/works/covers-v137/rural.webp').replace('./assets/works/mid-autumn/cover-v32-92.webp','./assets/works/covers-v137/mid-autumn.webp').replace('./assets/works/physical-universe-v103/cover.webp','./assets/works/covers-v137/code-films.webp');f.write_text(s,encoding='utf-8')
for name in ['v31.html','directory.html']:
 f=P/name;s=f.read_text(encoding='utf-8').replace('v31-hobby-v136.js?v=32.136','v31-hobby-v137.js?v=32.137').replace('v31-works-ring-v135.js?v=32.135','v31-works-ring-v137.js?v=32.137').replace('scene-loader-v133.js?v=32.133','scene-loader-v137.js?v=32.137').replace('directory-v136/app','directory-v137/app').replace('app.js?v=32.136','app.js?v=32.137').replace('app.css?v=32.136','app.css?v=32.137');f.write_text(s,encoding='utf-8')
f=P/'mythology.html';s=f.read_text(encoding='utf-8').replace('mythology-compact-v134.js?v=32.134','mythology-compact-v137.js?v=32.137');f.write_text(s,encoding='utf-8')
print('Prepared V137 covers, twelve real hobby cards, clock/stone quality and submerged shoreline; new scene sources saved.')
