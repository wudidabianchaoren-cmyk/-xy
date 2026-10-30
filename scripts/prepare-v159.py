from pathlib import Path
import shutil
p=Path(__file__).resolve().parents[1];out=p/'.verify/v32-159/before';out.mkdir(parents=True,exist_ok=True)
files=['v31.html','directory.html','mythology.html','src/scroll-collage.ts','src/home-thought-line-v158.css','src/directory-v141/room-v143.ts','src/directory-v141/room-world-v158.ts','src/directory-v141/surfaces.ts','src/mythology-local-v158.ts']
for f in files:
 t=out/f;t.parent.mkdir(parents=True,exist_ok=True)
 if not t.exists():shutil.copy2(p/f,t)
# Keep the film, its imagery and all Remotion choreography unchanged.
css='''/* V159: composition only. The original film and ThoughtLine motion remain. */
#countdownPrelude .opening-progress{left:auto!important;right:6.8%!important;bottom:6.5%!important;transform:none!important;width:360px!important;max-width:30vw!important;padding:0!important}
#countdownPrelude .thought-line-v158-host{width:100%;max-width:none;min-height:158px;margin:0;text-align:left}
#countdownPrelude .opening-progress-meta{display:flex!important;position:absolute;right:0;top:-3px;margin:0;justify-content:flex-end;width:76px;font-size:21px;line-height:1.2;font-weight:500;font-variant-numeric:tabular-nums;color:#e4d2ae;letter-spacing:.02em}
#countdownPrelude .opening-progress-meta [data-opening-phase]{display:none!important}
#countdownPrelude .opening-progress-track{display:block!important;position:absolute;bottom:-9px;left:0;width:100%;height:2px;background:#bca37632;overflow:hidden}
#countdownPrelude .opening-progress-track i{display:block;width:100%;height:100%;transform-origin:0 50%;background:#cdb27d}
#countdownPrelude .opening-progress-footer{display:none!important}
/* Stable first paint, even before the small collage controller is ready. */
#workFlow .scroll-collage-copy{position:absolute;inset:0;pointer-events:none}
#workFlow .scroll-collage-copy h2{left:50%!important;top:50%!important;max-width:calc(100% - 120px)!important;width:76vw!important;transform:translate(-50%,-50%);overflow-wrap:normal}
#workFlow:not([data-collage-ready]) .scroll-collage-copy h2:first-child{opacity:1}
#workFlow .scroll-collage-stage{contain:paint}
#workFlow:not([data-collage-ready]) .scroll-collage-images img{opacity:.32;transform:none}
'''
(p/'refinements-v159.css').write_text(css,encoding='utf-8')
s=(p/'src/scroll-collage.ts').read_text(encoding='utf-8').replace('if(section){',"if(section&&!section.dataset.collageReady){")
s=s.replace("const cards=pictures.map((src,i)=>{const img=document.createElement('img');img.src='./assets/journey/'+src;", "const existing=[...host.querySelectorAll<HTMLImageElement>('img')];const cards=pictures.map((src,i)=>{const img=existing[i]??document.createElement('img');img.src='./assets/journey/previews/'+src.replace(/\\.(png|jpg)$/i,'.webp');")
s=s.replace("ease(.17+i*.012,.46+i*.012,p)","ease(-.035+i*.009,.30+i*.009,p)")
s=s.replace("window.addEventListener('resize',draw);draw();","window.addEventListener('resize',draw);draw();section.dataset.collageReady='159';window.addEventListener('pageshow',draw);document.fonts.ready.then(draw);")
(p/'src/scroll-collage.ts').write_text(s,encoding='utf-8')
# Add static images for progressive rendering; same assets and arrangement.
h=(p/'v31.html').read_text(encoding='utf-8')
pics=['journey-mountain-valley','cloud-stairway-02','forest-dusk-red-01','bamboo-sun-path','crane-cave-skull','journey-mountain-valley','cloud-stairway-02','forest-dusk-red-02','bamboo-sun-path','crane-cave-skull'];layouts=[[-.04,.19,.17,.32],[.42,.14,.075,.16],[.73,.10,.105,.17],[.88,.48,.17,.40],[.13,.58,.115,.29],[.43,.87,.115,.22],[.67,.80,.18,.25],[.15,.04,.15,.24],[.49,-.02,.11,.08],[.15,.87,.06,.13]]
imgs=''.join(f'<img loading="lazy" decoding="async" src="./assets/journey/previews/{name}.webp" alt="" style="left:{v[0]*100}%;top:{v[1]*100}%;width:{v[2]*100}%;height:{v[3]*100}%">'for name,v in zip(pics,layouts))
h=h.replace('<div class="scroll-collage-images" aria-hidden="true"></div>','<div class="scroll-collage-images" aria-hidden="true">'+imgs+'</div>')
h=h.replace('</head>','<link rel="stylesheet" href="./refinements-v159.css?v=32.159"></head>')
h=h.replace('scene-dist/dock/exhibition-dock.js?v=32.86','scene-dist/dock/exhibition-dock-v159.js?v=32.159').replace('app.js?v=32.158','app.js?v=32.159').replace('app.css?v=32.158','app.css?v=32.159')
(p/'v31.html').write_text(h,encoding='utf-8')
h=(p/'directory.html').read_text(encoding='utf-8').replace('v=32.158','v=32.159');(p/'directory.html').write_text(h,encoding='utf-8')
# Room: one supported work stool, proper storage and a real thick plank floor.
s=(p/'src/directory-v141/room-world-v158.ts').read_text(encoding='utf-8').replace("import {RoundedBoxGeometry}","import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';\nimport {RoundedBoxGeometry}")
s=s.replace('roomWorldV158','roomWorldV159').replace('V158 extended studio / stool shelving lounge and floor','V159 studio / one work stool / solid oak floor')
a=s.index(' const floorMap=');b=s.index(' const wall=',a)
s=s[:a]+''' const floorBase=new T.Mesh(new T.BoxGeometry(8.35,.08,7.2),new T.MeshStandardMaterial({color:0x33271f,roughness:.95}));floorBase.position.set(0,-.034,.45);floorBase.receiveShadow=true;root.add(floorBase);
 const planks:T.BufferGeometry[][]=Array.from({length:6},()=>[]);let boardCount=0;
 for(let row=0;row<42;row++){const x=-4.1+row*.195;for(let j=-1;j<7;j++){const z=-2.5+j*1.22+(row%3)*.39,start=Math.max(-3.1,z),end=Math.min(4.0,z+1.216);if(end-start<.08)continue;const g=new T.BoxGeometry(.191,.018,end-start),pos=g.getAttribute('position'),uv=g.getAttribute('uv');g.translate(x,.016,(start+end)/2);for(let k=0;k<pos.count;k++)uv.setXY(k,pos.getX(k)*.48+(row%5)*.11,pos.getZ(k)*.57);planks[(row*7+j+7)%6].push(g);boardCount++;}}
 for(let i=0;i<6;i++){const m=new T.MeshPhysicalMaterial({map:woodColor,normalMap:woodNormal,roughnessMap:woodRough,color:new T.Color().setHSL(.086,.23,.53+i*.008),roughness:.54+i*.016,normalScale:new T.Vector2(.19,.19),clearcoat:.065,clearcoatRoughness:.48});const floor=new T.Mesh(mergeGeometries(planks[i]),m);floor.name='Solid oak staggered floor boards '+i;floor.receiveShadow=true;root.add(floor);for(const g of planks[i])g.dispose();}
''' +s[b:]
s=s.replace('for(const side of[-1,1])for(let i=0;i<9;i++)','for(const side of[-1])for(let i=0;i<9;i++)').replace('y=.14+(i%3)*.015','y=.119')
a=s.index(' // A small CD receiver');b=s.index(' // One warm high practical',a)
s=s[:a]+''' // Supported sketch pads on the left; closed flat-file drawers on the right.
 for(let i=0;i<3;i++)box(.40,.026,.28,-2.88,leftH+.051+i*.027,-.71,paper,.003);
 for(const [y,h]of[[.365,.45],[.92,.49]]){box(1.09,h,.045,2.92,y,-.53,wood,.009);box(.30,.018,.035,2.92,y+.08,-.495,metal,.006);}
''' +s[b:]
a=s.index(' const key=new T.SpotLight');b=s.index(' return{',a)
s=s[:a]+''' const lampBounce=new T.RectAreaLight(0xffcf91,.82,1.3,.85);lampBounce.position.set(-.92,1.35,.06);lampBounce.lookAt(.9,.65,-.35);root.add(lampBounce);
''' +s[b:]
s=s.replace('objects:count,','objects:count,boardCount,chairCount:1,physicalPlankThickness:.018,setLampLevel:(v:number)=>{lampBounce.intensity=.82*v;},').replace('cdReceiver:true,keyboard:true','cdReceiver:false,keyboard:false').replace('lounge:true','lounge:false').replace('shadowLight:true','shadowLight:false')
(p/'src/directory-v141/room-world-v159.ts').write_text(s,encoding='utf-8')
s=(p/'src/directory-v141/room-v143.ts').read_text(encoding='utf-8').replace("roomWorldV158}from'./room-world-v158'","roomWorldV159}from'./room-world-v159'").replace('roomWorldV158(scene','roomWorldV159(scene').replace('V158 extended studio / stool shelving lounge and floor','V159 studio / one work stool / solid oak floor')
s=s.replace('renderer.toneMappingExposure=1.13','renderer.toneMappingExposure=.87').replace("lampOn?1.13:1.16","lampOn?.87:.94").replace('THREE.HemisphereLight(0x99b1cd,0x71533c,.10)','THREE.HemisphereLight(0x99b1cd,0x71533c,.065)')
s=s.replace('bulbLight.position.set(-1.0,1.36,.02);scene.add(bulbLight);','bulbLight.position.set(-1.0,1.36,.02);bulbLight.castShadow=true;bulbLight.shadow.mapSize.set(512,512);bulbLight.shadow.normalBias=.008;bulbLight.shadow.bias=-.0002;scene.add(bulbLight);')
s=s.replace('bulb.visible=lightState.lamp.value>.1;','bulb.visible=lightState.lamp.value>.1;roomWorld.setLampLevel(lightState.lamp.value);')
(p/'src/directory-v141/room-v143.ts').write_text(s,encoding='utf-8')
s=(p/'src/directory-v141/surfaces.ts').read_text(encoding='utf-8').replace("${inputs.scale('room-off', 2).toFixed(3)}+","${inputs.scale('room-off', 2).toFixed(3)}*.58+").replace('baked*vec3(1.06,1.02,.94)','baked*vec3(.96,.92,.84)')
(p/'src/directory-v141/surfaces.ts').write_text(s,encoding='utf-8')
print('V159 loading layout, progressive collage and room source prepared; original films untouched.')
