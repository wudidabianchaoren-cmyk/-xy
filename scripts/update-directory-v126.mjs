import fs from 'node:fs/promises';import assert from'node:assert/strict';
let r=(await fs.readFile('src/directory-v125/room.ts','utf8')).replace(/\r\n/g,'\n');
function replace(a,b){assert(r.includes(a),a.slice(0,100));r=r.replace(a,b)}
r=r.replaceAll('directory-v125','directory-v126');
r=r.replace(/^import\{(?:EffectComposer|RenderPass|UnrealBloomPass|OutputPass)\}.*\n/gm,'');
replace("import{createMedia}from'./media';", "import{createMedia}from'./media';import{createCalendar}from'./calendar';import{loadRoomEnvironment}from'./environment';");
replace('lamp:(on:boolean)=>void;', 'lamp:(on:boolean)=>void;reader?:(reader:any)=>void;');
replace('let prepared=false;', "let prepared=false;const started=performance.now(),captureRequested=new URLSearchParams(location.search).get('captureEnvironment')==='1';const preparation={started,readyAt:0,mode:captureRequested?'production-capture':'cached-reflections',runtimeCubeCaptures:0,shaderPrograms:0};const yieldTask=()=>new Promise<void>(resolve=>setTimeout(resolve,0));");
replace('const pmrem=new THREE.PMREMGenerator(renderer);', 'const pmrem=captureRequested?new THREE.PMREMGenerator(renderer):null;');
replace('const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.065,.35,1.25);composer.addPass(bloom);composer.addPass(new OutputPass());','// Render directly with native MSAA and the same AgX transform used during compilation.');
replace('composer.setSize(w,h);','');replace('composer.render();','renderer.render(scene,camera);');replace('composer.dispose();','');
replace('toneMapped:false}));tv.position','toneMapped:true}));tv.position');
replace('potColor,potNormal,potRough,props]', 'potColor,potNormal,potRough]');
replace(",gltf.loadAsync(base+'props-detail.glb')", '');
replace('scene.add(props.scene);scene.add(remote.scene);', 'scene.add(remote.scene);');
replace('const surfaces=await createSurfaces', 'screen.onReaderChange(events.reader??(()=>{}));\n const surfaces=await createSurfaces');
replace('const materials=surfaces.created;', "const calendar=createCalendar(scene,surfaces.micro('paper'));\n const materials=surfaces.created;");
replace("new THREE.HemisphereLight(0xa5aaa6,0x9e8062,.25)", "new THREE.HemisphereLight(0x99b1cd,0x71533c,.10)");
replace('new THREE.RectAreaLight(0xbccbd0,.42,2.8,1.45)', 'new THREE.RectAreaLight(0x9fb8d9,.22,2.8,1.45)');
replace('new THREE.PointLight(0xffc68b,1.0,3.8,2)', 'new THREE.PointLight(0xffbb7c,1.8,3.8,2)');
replace('scene.add(bulbLight);camera.layers.enable(1);', "scene.add(bulbLight);const lampArea=new THREE.RectAreaLight(0xffc18b,2.8,.22,.13);lampArea.position.set(-1.02,1.32,.02);lampArea.lookAt(-.88,.76,.28);scene.add(lampArea);camera.layers.enable(1);");
replace("tv.position.set(-.25,1.27,.213);", "tv.name='CRT live screen';tv.position.set(-.25,1.27,.213);");
replace("scene.add(tv);tv.userData.pickKey='tv';", `scene.add(tv);
 const tvMaterial=tv.material as THREE.MeshPhysicalMaterial;tvMaterial.customProgramCacheKey=()=> 'CRT-direct-video-v126';
 tvMaterial.onBeforeCompile=shader=>{Object.assign(shader.uniforms,{roomVideo:screen.videoLayer.texture,roomVideoActive:screen.videoLayer.active,roomVideoScale:screen.videoLayer.scale});shader.fragmentShader='uniform sampler2D roomVideo;uniform float roomVideoActive;uniform vec2 roomVideoScale;\\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',[
 'if(roomVideoActive>.5){',
 'vec2 screenUV=vEmissiveMapUv;vec2 videoUV=(screenUV-.5)/roomVideoScale+.5;',
 'vec3 videoColor=vec3(.002);if(all(greaterThanEqual(videoUV,vec2(0.)))&&all(lessThanEqual(videoUV,vec2(1.))))videoColor=sRGBTransferEOTF(texture2D(roomVideo,videoUV)).rgb;',
 'if(screenUV.x>=.021484375&&screenUV.x<=.978515625&&screenUV.y>=.0286458333&&screenUV.y<=.1223958333)videoColor=texture2D(emissiveMap,screenUV).rgb;',
 'totalEmissiveRadiance*=videoColor;',
 '}else{',
 '#include <emissivemap_fragment>',
 '}'
 ].join('\\n'));};tv.userData.pickKey='tv';`);
replace('const status={windowPane', 'const status={preparation,calendar:calendar.status,reader:screen.status.reader,windowPane');
replace('calendar:true,headphones:true','calendarObject:true,headphones:true');
replace("function paperOpen(open:boolean){if(noteOpen===open)return;", "function paperOpen(open:boolean){if(open&&fortune.status.open){fortune.close(elapsed);events.fortune?.(false)}if(noteOpen===open)return;");
replace("let down:{x:number;y:number;yaw:number}|null=null,pressed:{key:string;point:THREE.Vector3}|null=null,dragged=false;", "let down:{x:number;y:number;yaw:number}|null=null,pressed:{key:string;point:THREE.Vector3;uv?:THREE.Vector2}|null=null,dragged=false,lastHoverCheck=-Infinity;");
replace('const h=hit(e);hoverKey=h.key;', 'const now=performance.now();if(now-lastHoverCheck<45)return;lastHoverCheck=now;const h=hit(e);hoverKey=h.key;');
replace('action(h.key,h.point);};', "if(h.key==='tv'&&viewMode==='tv'&&screen.status.reader.visible){const q=tv.worldToLocal(h.point.clone());if(Math.abs(q.x)<=.277&&Math.abs(q.y)<=.202&&screen.hit(q.x/.55+.5,q.y/.40+.5))return}action(h.key,h.point);};");
replace('pressed={key:h.key,point:h.point.clone()};', 'pressed={key:h.key,point:h.point.clone(),uv:h.uv?.clone()};');
replace("targetCamera.set(.58,1.17,1.10);desiredLook.set(.60,.89,.18);", "targetCamera.set(.55,1.23,1.18);desiredLook.set(.55,1.00,.10);");
replace("targetCamera.set(-.25,1.30,mobile()?1.80:1.13);", "targetCamera.set(-.25,1.30,screen.status.reader.visible?(mobile()?1.34:.96):(mobile()?1.80:1.13));");
replace('bulbLight.intensity=1.0*lightState.lamp.value;', 'bulbLight.intensity=1.8*lightState.lamp.value;lampArea.intensity=2.8*lightState.lamp.value;');
replace('lampOn?1.03:1.22', 'lampOn?1.03:1.10');
replace('scene.environment=lampOn?envLit:envDark;', 'scene.environment=envLit;calendar.update();');
replace('const reflected=new Set<THREE.Material>();', 'const envBlend={dark:{value:null as THREE.Texture|null},level:lightState.lamp};const reflected=new Set<THREE.Material>();');
replace('roomReflections(m);', 'roomReflections(m,envBlend);');
const a=r.indexOf(' const envIntensity=scene.environmentIntensity;'),b=r.indexOf('\n return{status,',a);assert(a>0&&b>a);
r=r.slice(0,a)+` const envIntensity=scene.environmentIntensity;scene.environment=null;scene.environmentRotation.y=0;
 await yieldTask();
 if(captureRequested){
  for(const on of[true,false]){lightState.lamp.value=on?1:0;bulbLight.intensity=on?1.8:0;lampArea.intensity=on?2.8:0;bulb.visible=on;
   const cube=new THREE.WebGLCubeRenderTarget(64,{type:THREE.HalfFloatType});const captureCamera=new THREE.CubeCamera(.025,50,cube);captureCamera.position.set(.1,1.35,.55);
   await renderer.compileAsync(scene,captureCamera);await yieldTask();captureCamera.update(renderer,scene);preparation.runtimeCubeCaptures++;const map=pmrem!.fromCubemap(cube.texture);reflectionTargets.push(map);const probe=await LightProbeGenerator.fromCubeRenderTarget(renderer,cube);cube.dispose();probe.intensity=0;scene.add(probe);probes.push(probe);await yieldTask();
  }
  envLit=reflectionTargets[0].texture;envDark=reflectionTargets[1].texture;
 }else{const cached=await loadRoomEnvironment(base);envLit=cached.entries[0].texture;envDark=cached.entries[1].texture;for(const entry of cached.entries){scene.add(entry.probe);probes.push(entry.probe);}}
 envBlend.dark.value=envDark;scene.environment=envLit;scene.environmentIntensity=envIntensity;lightState.lamp.value=1;bulbLight.intensity=1.8;lampArea.intensity=2.8;bulb.visible=true;probes[0].intensity=.72;
 events.progress(94);const textureSet=new Set<THREE.Texture>([off,lampAtlas,tvAtlas,city,normalAtlas,woodNormal,woodRough,woodColor,linenNormal,linenRough,potColor,potNormal,potRough,envLit,envDark]);scene.traverse(o=>{if(!(o instanceof THREE.Mesh||o instanceof THREE.Points||o instanceof THREE.LineSegments||o instanceof THREE.Sprite))return;for(const mat of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(mat))if(value instanceof THREE.Texture)textureSet.add(value);if(mat instanceof THREE.ShaderMaterial)for(const uniform of Object.values(mat.uniforms))if(uniform.value instanceof THREE.Texture)textureSet.add(uniform.value);}});
 for(const texture of textureSet){if(texture instanceof THREE.VideoTexture)continue;renderer.initTexture(texture);await yieldTask();}await renderer.compileAsync(scene,camera);await yieldTask();
 renderer.render(scene,camera);await yieldTask();renderer.render(scene,camera);await yieldTask();
 preparation.readyAt=performance.now();preparation.shaderPrograms=renderer.info.programs?.length??0;prepared=true;events.progress(100);resume();
 async function exportEnvironment(){if(!captureRequested)throw Error('Only production capture owns render targets');const entries=[];for(let i=0;i<reflectionTargets.length;i++){const target=reflectionTargets[i],pixels=new Uint16Array(target.width*target.height*4);await renderer.readRenderTargetPixelsAsync(target,0,0,target.width,target.height,pixels);entries.push({width:target.width,height:target.height,data:Array.from(pixels),sh:probes[i].sh.toArray()});}return entries;}
`+r.slice(b);
replace('return{status,select,action,', 'return{status,exportEnvironment,readingPrev:()=>screen.previous(),readingNext:()=>screen.next(),readingAuto:(on:boolean)=>screen.readingAuto(on),select,action,');
replace('fortune.destroy();surfaces.destroy();', 'fortune.destroy();calendar.destroy();halo.geometry.dispose();haloMat.dispose();surfaces.destroy();');
replace('pmrem.dispose();', 'pmrem?.dispose();if(!captureRequested){envLit.dispose();envDark.dispose();}');
const insertAt=r.indexOf(" const{books,bookStarts,tapes,tapeStarts}=");assert(insertAt>0);
r=r.slice(0,insertAt)+` const haloMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{level:{value:1}},vertexShader:'varying vec2 tex;void main(){tex=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 tex;uniform float level;void main(){vec2 q=abs(tex-.5)-vec2(.44,.43);float edge=length(max(q,0.))+min(max(q.x,q.y),0.);float glow=exp(-pow(edge/.035,2.))*.26*level;gl_FragColor=vec4(.92,.73,.40,glow);}' });
 const halo=new THREE.Mesh(new THREE.PlaneGeometry(.70,.50),haloMat);halo.name='Directory journal / quiet discoverability light';halo.position.copy(paperRest);halo.position.y-=.0003;halo.quaternion.copy(paperQ);scene.add(halo);
`+r.slice(insertAt);
replace('glow.visible=false;\n  for(let i=0;i<books.length;i++)', "halo.visible=!noteOpen&&viewMode==='desk'&&!fortune.status.open;haloMat.uniforms.level.value=reduced?1:.86+.14*Math.sin(elapsed*.8);glow.visible=false;\n  for(let i=0;i<books.length;i++)");
await fs.writeFile('src/directory-v126/room.ts',r);
let m=await fs.readFile('src/directory-v125/media.ts','utf8');m=m.replace('g.position.set(.27 + i * .23, .89, .18);', 'g.position.set(.42 + (i % 2) * .24, i < 2 ? .89 : 1.10, i < 2 ? .25 : -.005);');await fs.writeFile('src/directory-v126/media.ts',m);
const build=await fs.readFile('scripts/build-directory-v125.mjs','utf8');await fs.writeFile('scripts/build-directory-v126.mjs',build.replaceAll('v125','v126').replaceAll('V125','V126'));
console.log('V126 room integrated; original scene and portfolio assets untouched.');
