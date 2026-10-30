import {finishHomeV140} from './home-refinement-v140';
﻿import {applyNativeV23} from './home-native-v23';
import {applyNativeV24} from './home-native-v24';
import {refineClockFinish} from './home-clock-finish';
import {homeDiscoveries} from './home-discoveries-v141';
import {shadowNativeArea} from './home-native-area';
import {nativeDisplayPass} from './home-native-display';
import {architecturalCamera,loadArchitecturalCamera} from './home-camera-v23';
import {replaceCourtyardInscription} from './home-inscription';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import {HomeAntialiasedPass} from './home-antialiased-pass';
import {prepareDistanceDetail} from './home-distance-v138';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import {CachedCourtyardAO} from './home-cached-ao';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { createMedievalDetails } from './home-details';
import { courtyardPoint,refineNativeCourtyard,humanWindowSilhouette } from './home-restoration';
import {ageMasonry,courtyardAtmosphere,calibrateMasonryGeometry,finishClockEnamel} from './home-surfaces';
import {courtyardNavigation} from './home-navigation';
import {createArchiveForest} from './home-forest-v138';
import {courtyardSoftShadows} from './home-soft-shadows';
import {loadCourtyardCavities} from './home-cavities';
import {finishSecondaryArchitecture} from './home-secondary-materials';

type Pose={p:number[];q:number[];s:number[]};
type LightCue={p:number[];d:number[];energy:number;color:number[]};
type Cue={groups:Record<string,Pose>;lights:Record<string,LightCue>};
type Shot={position:number[];target:number[];lens:number;shot:string};
type Track={frames:Cue[];camera:{frames:Shot[]};nativeMeshes:number;nativeGroups:string[]};
const surface=document.querySelector<HTMLElement>('.home-rendered-architecture');
if(surface){
  const preparing=document.createElement('div');preparing.className='home-town-preparing';preparing.setAttribute('role','status');preparing.hidden=true;
  const preparePhases:{name:string;at:number}[]=[];const mark=(name:string)=>{preparePhases.push({name,at:performance.now()});preparing.style.setProperty('--town-progress',String(Math.min(1,preparePhases.length/10)));};mark('module start');
  const video=document.getElementById('homeArchitectureVideo') as HTMLVideoElement|null;
  if(video){video.pause();video.preload='none';video.hidden=true;}
  // This poster comes from this realtime renderer, with the same materials and light setup.
  // A Cycles proof is a useful reference, but must not masquerade as the live first frame.
  surface.style.backgroundImage='url("./assets/home/home-live-poster-v32-82.png")';surface.style.backgroundSize='cover';surface.style.backgroundPosition='center';
  const canvas=document.createElement('canvas');canvas.className='home-live-world';canvas.style.opacity='0';canvas.setAttribute('aria-hidden','true');surface.append(canvas);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:false,powerPreference:'high-performance'});
  mark('WebGL context ready');const startupGPUInfo=renderer.getContext().getExtension('WEBGL_debug_renderer_info');const gpuName=startupGPUInfo?renderer.getContext().getParameter(startupGPUInfo.UNMASKED_RENDERER_WEBGL):'';const integrated=/Intel|Iris|UHD|SwiftShader/i.test(gpuName);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1));renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=Math.pow(2,-.30);
  const lookControls={secondaryFillScale:.82,keyScale:.015,areaIntensity:1020/(5.5*5*Math.PI),reflectionGain:1,ambient:.24};
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.transmissionResolutionScale=.35;
  renderer.info.autoReset=false;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x050807);scene.fog=new THREE.FogExp2(0x0c1110,.014);scene.environmentIntensity=.07;
  const air=courtyardAtmosphere(scene);let updateDetails:((t:number)=>void)|undefined;
  const camera=new THREE.PerspectiveCamera(28.6,16/9,.5,110);
  const navigation=courtyardNavigation(surface,canvas,camera);
  const discoveries=homeDiscoveries(surface,canvas,camera);
  const sun=new THREE.SpotLight(0xffc181,630,95,1.12,.45,2);sun.position.set(-8,8,5);sun.target.position.set(0,3,-1);scene.add(sun,sun.target);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=.5;sun.shadow.camera.far=55;sun.shadow.bias=-.00005;sun.shadow.normalBias=.009;sun.shadow.radius=4;
  scene.add(new THREE.HemisphereLight(0xb4beb5,0x3a2512,.038));
  const forestLight=new THREE.SpotLight(0xffd19a,620,95,.52,.85,2);forestLight.position.set(-14,13,0);forestLight.target.position.set(-8,5,-20);scene.add(forestLight,forestLight.target);
  const rim=new THREE.DirectionalLight(0xb1c6c0,.045);rim.position.set(7,10,-7);scene.add(rim);
  RectAreaLightUniformsLib.init();const metalStrip=new THREE.RectAreaLight(0xffdab0,8,.65,3.8);scene.add(metalStrip);
  const masonryFill=new THREE.RectAreaLight(0xffd3a0,1.0,7,5);masonryFill.name="V124 / reciprocal warm architectural fill";masonryFill.position.set(-2,5,6);masonryFill.lookAt(0,4,0);scene.add(masonryFill);
  const reflectedWarmth=new THREE.RectAreaLight(0xe0ac6c,.25,10,1.3);reflectedWarmth.position.set(0,.55,3);reflectedWarmth.lookAt(0,3,-1);scene.add(reflectedWarmth);
  const nativeBroadKey=new THREE.RectAreaLight(new THREE.Color(1,.78,.52),10,5.5,5);nativeBroadKey.name='V24 / native-sized shadowed moving broad key';scene.add(nativeBroadKey);
  const nativeForestKey=new THREE.RectAreaLight(new THREE.Color(1,.88,.72),220/(25*Math.PI),5,5);nativeForestKey.name='V24 / native broad woodland light';scene.add(nativeForestKey);
  const inscriptionLight=new THREE.SpotLight(0xffe4b8,340,18,.65,.65,2);inscriptionLight.position.set(6.2,11.5,-4.8);inscriptionLight.target.position.set(6.0,9.15,-9.7);scene.add(inscriptionLight,inscriptionLight.target);
  const composer=new EffectComposer(renderer);composer.addPass(new HomeAntialiasedPass(scene,camera));const ao=new CachedCourtyardAO(scene,camera,800,450);ao.blendIntensity=1.15;ao.updateGtaoMaterial({radius:.44,distanceExponent:1.7,thickness:.7,scale:1,samples:8});composer.addPass(ao);
  const displayReady=nativeDisplayPass().then(({pass,meta})=>{composer.addPass(pass);composer.addPass(new SMAAPass());Object.assign(state,{blenderDisplay:meta});});
  const aa=new ShaderPass(FXAAShader); // MSAA already resolves edges; a second full-frame blur obscured engraved clock details.
  const reflector=new Reflector(new THREE.PlaneGeometry(64,80),{textureWidth:1024,textureHeight:576,clipBias:.0001,multisample:0});reflector.rotation.x=-Math.PI/2;reflector.position.y=.019;reflector.updateMatrixWorld(true);
  const floorMeshes:THREE.Mesh[]=[];let reflectionAt=-Infinity,shadowAt=-Infinity,aoGeometryAt=-Infinity,closeShadow=false;
  const previousReflection=new THREE.WebGLRenderTarget(1024,576,{type:THREE.HalfFloatType,depthBuffer:false});
  const currentReflection=new THREE.WebGLRenderTarget(1024,576,{type:THREE.HalfFloatType,depthBuffer:false});
  const reflectionProjection={value:new THREE.Matrix4()},previousProjection={value:new THREE.Matrix4()},reflectionBlend={value:1},reflectionStrength={value:1};
  const reflectionCopy=new FullScreenQuad(new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:currentReflection.texture}},vertexShader:'varying vec2 uvCopy;void main(){uvCopy=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D tDiffuse;varying vec2 uvCopy;void main(){gl_FragColor=texture2D(tDiffuse,uvCopy);}',depthTest:false,depthWrite:false}));
  const reflectionBlur=new FullScreenQuad(new THREE.ShaderMaterial({uniforms:{tDiffuse:{value:reflector.getRenderTarget().texture}},vertexShader:'varying vec2 uvCopy;void main(){uvCopy=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D tDiffuse;varying vec2 uvCopy;void main(){vec2 d=vec2(.00055);gl_FragColor=(texture2D(tDiffuse,uvCopy)*2.+texture2D(tDiffuse,uvCopy+d)+texture2D(tDiffuse,uvCopy-d)+texture2D(tDiffuse,uvCopy+vec2(d.x,-d.y))+texture2D(tDiffuse,uvCopy+vec2(-d.x,d.y)))/6.;}',depthTest:false,depthWrite:false}));
  const lights=new Map<string,THREE.PointLight>();const objects=new Map<string,THREE.Object3D>();const westLining:THREE.MeshStandardMaterial[]=[];const nativePractical:THREE.Light[]=[];
  const occupiedPractical=new THREE.PointLight(0xffb96e,0,5,2),occupiedFaceFill=new THREE.PointLight(0xffd8b1,0,5,2);scene.add(occupiedPractical,occupiedFaceFill);
  let track:Track,world:THREE.Group,ready=false,started=document.body.dataset.openingComplete==='true',visible=false,paused=false;
  let elapsed=0,last=performance.now(),intro=16,held=false,bellAngle=0,bellVelocity=0,westOn=false;
  let renderQuality=integrated?.92:1,qualityWindow=0,qualityFrames=0,staticCapture=false;
  let distanceDetail:Awaited<ReturnType<typeof prepareDistanceDetail>>|undefined;
  const gpu=renderer.getContext() as WebGL2RenderingContext;const gpuInfo=gpu.getExtension('WEBGL_debug_renderer_info');const discreteGPU=/NVIDIA|Radeon RX/.test(gpuInfo?gpu.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL):'');const frameFences:WebGLSync[]=[];let renderedAt=performance.now();
  let figureTarget=-1,touchFigure=-1;const figureTravel=[0,0],figureStrokes=[0,0];
  const dialOffset=[0,0],dialSpeed=[0,0];let hover=-1,drag=-1,lastAngle=0,activePointer=-1;
  const lookupCache=new Map<string,THREE.Object3D|undefined>();
  const lookup=(pattern:RegExp)=>{const key=pattern.source;if(!lookupCache.has(key))lookupCache.set(key,[...objects.entries()].find(([name])=>pattern.test(name))?.[1]);return lookupCache.get(key);};
  let animatedMechanisms:[string,THREE.Object3D][]=[];let dialInputAt=-Infinity;
  const state={gpu:gpuName,integrated,performancePolicy:"native quality adapts to actual GPU / cached shadow updates",ready:false,elapsed:0,shot:'wide',cameraLocked:false,camera:[0,0,0],interactions:0,heldFigures:false,westOn:false,westLightEnergy:0,bellAngle:0,dialAngles:[0,0],angles:[0,0,0],renderFrames:0,batches:0,drawCalls:0,triangles:0,planarMarbleReflection:true,loadMilliseconds:0,
    movingLightPosition:[0,0,0],secondaryLight:{position:[0,0,0],target:[0,0,0],intensity:1,color:'#ffd3a0',powerRatio:0,primarySide:'left',fillSide:'right',shadowMapsAdded:0},cloisterLightEnergy:[] as number[],liveLighting:'warm moving key and deep cool shadows',addedElements:[] as string[],windowLights:[0,0,0],occupiedWindow:-1,shadowSurface:'level native stone paving / matte polished edges',surfaceDetail:'2K wide / 4K close',materialCalibration:'metre-scale masonry; filtered near grain; honed bronze; local contact AO',preparePhases,figureTravel,figureStrokes,figureTarget:-1,renderQuality:1,
    distanceDetail:[] as {mesh:string;near:number;far:number;errorMetres:number}[],
    debugFloor:(reflection:boolean)=>{reflectionStrength.value=reflection?1:0;render(0);return canvas.toDataURL();},
    debugReflection:()=>{const target=new THREE.WebGLRenderTarget(768,512),old=renderer.getRenderTarget();const quad=new FullScreenQuad(new THREE.ShaderMaterial({uniforms:{map:{value:currentReflection.texture}},vertexShader:'varying vec2 p;void main(){p=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D map;varying vec2 p;void main(){vec3 c=texture2D(map,p).rgb;gl_FragColor=vec4(pow(c/(1.+c),vec3(.4545)),1.);}'}));renderer.setRenderTarget(target);quad.render(renderer);const bytes=new Uint8Array(768*512*4);renderer.readRenderTargetPixels(target,0,0,768,512,bytes);renderer.setRenderTarget(old);target.dispose();quad.dispose();const diagnostic=document.createElement('canvas');diagnostic.width=768;diagnostic.height=512;const ctx=diagnostic.getContext('2d')!,pixels=ctx.createImageData(768,512);for(let y=0;y<512;y++)pixels.data.set(bytes.subarray((511-y)*768*4,(512-y)*768*4),y*768*4);ctx.putImageData(pixels,0,0);return diagnostic.toDataURL();},
    capture:()=>captureHome(),
    gpuAudit:()=>{const e=gpu.getExtension("WEBGL_debug_renderer_info");const ls:{type:string;name:string;intensity:number;shadow:boolean}[]=[];scene.traverse(o=>{if(o instanceof THREE.Light)ls.push({type:o.type,name:o.name,intensity:o.intensity,shadow:o.castShadow});});return{renderer:e?gpu.getParameter(e.UNMASKED_RENDERER_WEBGL):"unknown",lights:ls};},
    pickAudit:(x:number,y:number)=>{const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(x,y),camera);return r.intersectObjects(scene.children,true).slice(0,6).map(h=>({name:h.object.name,parent:h.object.parent?.name,point:h.point.toArray(),face:h.faceIndex}));},
    renderAudit:()=>{const meshes:{name:string;materials:string[];visible:boolean;min:number[];max:number[]}[]=[];scene.updateMatrixWorld(true);scene.traverse(o=>{if(o instanceof THREE.Mesh&&/geometry|foliage|limestone|marble|paving|dial|gold|gilt|copper|chapter|rotor|oak/i.test(o.name)){const b=new THREE.Box3().setFromObject(o);meshes.push({name:o.name,materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>m.name),visible:o.visible,min:b.min.toArray(),max:b.max.toArray()});}});return{meshes,camera:camera.position.toArray(),matrix:reflector.matrixWorld.toArray(),mirrorCamera:reflector.camera.position.toArray(),mirrorProjection:reflector.camera.projectionMatrix.toArray(),reflectionProjection:reflectionProjection.value.toArray(),overridden:scene.overrideMaterial?.name};},
    exportCurrentHome:async()=>{const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');distanceDetail?.update(true);const root=new THREE.Scene();for(const child of scene.children){if(child instanceof THREE.Light||child instanceof THREE.Mesh&&child.material instanceof THREE.ShaderMaterial||child instanceof THREE.Points)continue;root.add(child.clone(true));}root.add(camera.clone());const buffer=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true,maxTextureSize:2048});const file=new FileReader();return await new Promise<string>((resolve,reject)=>{file.onload=()=>resolve(file.result as string);file.onerror=()=>reject(file.error);file.readAsDataURL(new Blob([buffer as ArrayBuffer],{type:'model/gltf-binary'}));});},
    snapshot:(time:number)=>{elapsed=time;intro=Math.min(time,16);return captureHome();},
    poses:()=>[...objects].filter(([name])=>/automaton|shutter|travelling archivist|temple hanging bell/.test(name)).map(([name,o])=>({name,p:o.position.toArray(),q:o.quaternion.toArray()})),
    project:(kind:string)=>{const p=kind==='upper'?new THREE.Vector3(-.15,5.45,-.1):kind==='lower'?new THREE.Vector3(-.15,1.77,-.1):kind==='knights'||kind==='knight-0'?new THREE.Vector3(-.84,7.52,-.2):kind==='knight-1'?new THREE.Vector3(.54,7.52,-.2):kind==='bell'?new THREE.Vector3(-4.75,4.38,-2.8):courtyardPoint(new THREE.Vector3(-8.1,2.97,-2.1));p.project(camera);const b=canvas.getBoundingClientRect();return [b.left+(p.x+1)*b.width/2,b.top+(1-p.y)*b.height/2];}};
  (window as unknown as Record<string,unknown>).homeClockState=state;
  Object.defineProperty(window,'homeArchitectureState',{configurable:true,get:()=>({started,formed:true,paused,time:elapsed,duration:16,loopMode:'intro-once-then-live-wide',nativeLoop:false,cameraLocked:intro>=16})});
  const loader=new THREE.TextureLoader(),textureReady:Promise<unknown>[]=[];
  const texture=(name:string,color=false)=>{let resolve:()=>void,reject:(e:unknown)=>void;textureReady.push(new Promise<void>((a,b)=>{resolve=a;reject=b;}));const t=loader.load('./assets/home/'+name,()=>resolve(),undefined,e=>reject(e));t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(color)t.colorSpace=THREE.SRGBColorSpace;return t;};
  const marble={map:texture('Marble012_diff_2k.jpg',true),roughnessMap:texture('Marble012_rough_2k.jpg'),normalMap:texture('Marble012_nor_gl_2k.jpg')};
  const stone={map:texture('sandstone_cracks_diff_2k.jpg',true),roughnessMap:texture('sandstone_cracks_rough_2k.jpg'),normalMap:texture('sandstone_cracks_nor_gl_2k.jpg')};
  const ashlar={map:texture('white_sandstone_blocks_02_diff_2k.jpg',true),roughnessMap:texture('white_sandstone_blocks_02_rough_2k.jpg'),normalMap:texture('white_sandstone_blocks_02_nor_gl_2k.jpg')};
  const closeAshlar={map:texture('white_sandstone_blocks_02_diff_4k.jpg',true),roughnessMap:texture('white_sandstone_blocks_02_rough_4k.jpg'),normalMap:texture('white_sandstone_blocks_02_nor_gl_4k.jpg')};
  const oakMaps={map:texture('../odyssey/wood_planks/wood_planks_diff_1k.jpg',true),normalMap:texture('../odyssey/wood_planks/wood_planks_nor_gl_1k.jpg'),roughnessMap:texture('../odyssey/wood_planks/wood_planks_rough_1k.jpg')};
  const detailedMaterials:THREE.MeshStandardMaterial[]=[];let highDetail=false;
  // Prefilter this retained HDR once at authoring time; entry no longer runs the PMREM render chain.
  const environmentReady=Promise.all([fetch('./assets/home/venice-prefiltered-cubeuv.json').then(r=>r.json()),fetch('./assets/home/venice-prefiltered-cubeuv.bin.gz').then(async r=>new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())]).then(([meta,data])=>{
    const environment=new THREE.DataTexture(new Uint16Array(data),meta.width,meta.height,THREE.RGBAFormat,THREE.HalfFloatType);environment.mapping=THREE.CubeUVReflectionMapping;environment.minFilter=environment.magFilter=THREE.LinearFilter;environment.colorSpace=THREE.LinearSRGBColorSpace;environment.generateMipmaps=false;environment.needsUpdate=true;scene.environment=environment;
  });
  const draco=new DRACOLoader().setDecoderPath('./assets/home/draco/').setWorkerLimit(Math.min(4,Math.max(1,(navigator.hardwareConcurrency??4)-2)));
  const loadingAt=performance.now();
  const modelLoader=new GLTFLoader().setDRACOLoader(draco);
  const preload=(window as Window&{homeNativePreload?:Promise<[Track,ArrayBuffer]>}).homeNativePreload;
  const native=preload?preload.then(async([data,buffer])=>[data,await modelLoader.parseAsync(buffer,'./blender/reference-architecture-v16/')] as const):Promise.all([fetch('./blender/reference-architecture-v16/world-track.json').then(r=>{if(!r.ok)throw Error('Native world track missing');return r.json() as Promise<Track>;}),modelLoader.loadAsync('./blender/reference-architecture-v16/architecture-world.glb')]);
  native.then(async([data,gltf])=>{
    mark('native decoded');track=data;world=gltf.scene;replaceCourtyardInscription(world);state.batches=track.nativeMeshes;await refineNativeCourtyard(world);mark('courtyard geometry prepared');
    const originalNames=new Map(track.nativeGroups.map(name=>[THREE.PropertyBinding.sanitizeNodeName(name),name]));
    world.traverse(o=>{
      objects.set(o.userData.nativeName??originalNames.get(o.name)??o.name,o);
      if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;
        for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){
          if(/background warm matrix|theatre backdrop/.test(m.name))o.castShadow=false;
          m.envMapIntensity=m.metalness>.75?1.2:.3;
          if(/honed silver marble/.test(m.name)){
            Object.assign(m,marble);m.color.setRGB(.24,.165,.090);m.roughness=.19;m.normalScale.set(.045,.045);m.envMapIntensity=.18;if(m instanceof THREE.MeshPhysicalMaterial){m.clearcoat=.45;m.clearcoatRoughness=.18;}floorMeshes.push(o);o.castShadow=false;
            m.onBeforeCompile=shader=>{
              shader.uniforms.courtyardReflection={value:currentReflection.texture};shader.uniforms.reflectProjection=reflectionProjection;
              shader.uniforms.previousReflection={value:previousReflection.texture};shader.uniforms.previousProjection=previousProjection;shader.uniforms.reflectionBlend=reflectionBlend;shader.uniforms.reflectionStrength=reflectionStrength;
              shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform mat4 reflectProjection,previousProjection;varying vec4 vStoneReflection,vPreviousReflection;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvStoneReflection=reflectProjection*modelMatrix*vec4(transformed,1.);vPreviousReflection=previousProjection*modelMatrix*vec4(transformed,1.);');
              shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D courtyardReflection,previousReflection;uniform float reflectionBlend,reflectionStrength;varying vec4 vStoneReflection,vPreviousReflection;')
                .replace('#include <opaque_fragment>',`vec2 reflectedUv=vStoneReflection.xy/vStoneReflection.w;
                  vec3 reflectedStone=texture2D(courtyardReflection,reflectedUv).rgb;
                  vec2 prevUv=vPreviousReflection.xy/vPreviousReflection.w;
                  vec3 oldStone=texture2D(previousReflection,prevUv).rgb;
                  reflectedStone=mix(oldStone,reflectedStone,reflectionBlend);
                  float validReflection=smoothstep(0.,.025,reflectedUv.x)*smoothstep(0.,.025,reflectedUv.y)*(1.-smoothstep(.975,1.,reflectedUv.x))*(1.-smoothstep(.975,1.,reflectedUv.y));
                  float stoneFresnel=.04+.96*pow(1.-clamp(dot(normal,geometryViewDir),0.,1.),5.);
                  float reflectedWeight=clamp(validReflection*reflectionStrength*stoneFresnel*(1.-roughnessFactor),0.,.85);
                  outgoingLight=mix(outgoingLight,reflectedStone,reflectedWeight);
                  #include <opaque_fragment>`);
            };m.customProgramCacheKey=()=> 'stable-honed-marble-v32-76';
          }
          else if(/quarried warm limestone|cut pale travertine/.test(m.name)){Object.assign(m,stone);m.color.setRGB(...(/travertine/.test(m.name)?[.68,.53,.32]:[.57,.43,.25]) as [number,number,number]);m.roughness=.65;m.normalScale.set(.15,.15);m.envMapIntensity=.30;
            m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','float roughnessFactor=.66+.18*texture2D(roughnessMap,vRoughnessMapUv).g;');};ageMasonry(m,.045);calibrateMasonryGeometry(o);}
          else if(/roof|folded blue zinc|oxidised copper canopy/.test(m.name)){m.color.setRGB(.034,.055,.066);m.roughness=.78;m.metalness=.22;m.envMapIntensity=.18;}
          else if(/gold|gilt|brass/.test(m.name)){m.roughness=.24;m.metalness=1;m.envMapIntensity=2.0;m.shadowSide=THREE.BackSide;}
          else if(/copper|bronze/.test(m.name)){m.roughness=.27;m.metalness=.95;m.envMapIntensity=1.35;}
          else if(/plate armour|satin steel/.test(m.name)){m.roughness=.29;m.metalness=1;}
          else if(/obsidian|polished charcoal/.test(m.name)){m.color.setRGB(.029,.026,.023);m.roughness=.3;m.metalness=.03;m.envMapIntensity=.12;}
          else if(/distant garden masonry/.test(m.name)){o.visible=false;}
          else if(/theatre backdrop|shadow theatre velvet/.test(m.name)){o.visible=false;}
          else if(/warm mineral slab joints/.test(m.name)){m.roughness=.95;}
          else if(/olive ash leaves|green leaf underside/.test(m.name)){m.color.setRGB(...(/underside/.test(m.name)?[.27,.32,.14]:[.16,.25,.085]) as [number,number,number]);m.roughness=.8;m.side=THREE.DoubleSide;m.envMapIntensity=.1;}
          if(m instanceof THREE.MeshPhysicalMaterial&&m.transmission>0){m.transmission=0;m.transparent=true;m.opacity=.18;m.depthWrite=false;m.roughness=.28;}
          if(/amber diffusion/.test(m.name))westLining.push(m);
          m.needsUpdate=true;
        }
      }
    });for(const [name,o]of objects)if(/stage.*archive.*title|stage.*engraved.*maker/i.test(name))o.visible=false;scene.add(world);
    // Curved dial faces retain their native colour and geometric engraving; only the enamel finish changes.
    const enamels=new Map<THREE.Material,THREE.MeshPhysicalMaterial>();
    world.traverse(o=>{if(o instanceof THREE.Mesh){const polish=(m:THREE.Material)=>{
      if(!(m instanceof THREE.MeshStandardMaterial)||!/cobalt vitreous|midnight blue lower/.test(m.name))return m;
      if(!enamels.has(m)){const enamel=new THREE.MeshPhysicalMaterial({color:m.color.clone().multiplyScalar(.67),metalness:.06,roughness:.24,clearcoat:.65,clearcoatRoughness:.19,envMapIntensity:.60});enamel.name=m.name+' / polished enamel';finishClockEnamel(enamel);enamels.set(m,enamel);}return enamels.get(m)!;
    };o.material=Array.isArray(o.material)?o.material.map(polish):polish(o.material);}});
    const westHuman=lookup(/west human shadow performer/);if(westHuman)humanWindowSilhouette(westHuman);
    const details=createMedievalDetails(scene,ashlar,oakMaps);const forest=createArchiveForest(scene,oakMaps);const nativeDetails=await (await import('./native-v20')).nativeCourtyard(scene);state.addedElements=[...details.labels,`${forest.trees} branching woodland oaks framing the archive`,...nativeDetails.labels];updateDetails=t=>{details.update(t);forest.update(t);nativeDetails.update(t);state.movingLightPosition=sun.position.toArray();state.cloisterLightEnergy=nativeDetails.lightEnergy();};
    const cavities=await loadCourtyardCavities();Object.assign(state,{nativeCavityShading:cavities.audit});
    const calibrated=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&!calibrated.has(m)){calibrated.add(m);if(m.map===ashlar.map){m.color.setRGB(.39,.285,.165);m.roughness=.64;m.normalScale.set(.23,.23);m.envMapIntensity=.24;ageMasonry(m,.05);}else if(/limestone|travertine|sandstone/i.test(m.name)&&!/dark|charcoal/.test(m.name)){m.color.setRGB(.42,.29,.145);m.roughness=.62;if(m.normalMap)m.normalScale.set(.20,.20);}if(!(o instanceof THREE.InstancedMesh)){cavities.apply(m);courtyardSoftShadows(m);}}});
    Object.assign(state,{secondaryArchitecture:finishSecondaryArchitecture(scene,[ashlar.map,ashlar.normalMap,stone.map,stone.normalMap])});
    state.addedElements.push(JSON.stringify(await applyNativeV23(scene,world,false).then(({replaced,calibrated,nativeRings,source})=>({replaced,calibrated,nativeRings,source}))));
    const nativeLook=await applyNativeV24(scene);Object.assign(state,{nativeLook:nativeLook.audit,clockFinish:refineClockFinish(scene),materialFinishV140:finishHomeV140(scene)});
    const nativeKey=nativeLook.look.lights.find(l=>l.name.includes('broad warm key'))!;
    const nativeFill=nativeLook.look.lights.find(l=>l.name.includes('dark-side detail'))!;
    // The fill stays warm and subordinate; native key colour and movement remain unchanged.
    masonryFill.color.set(0xffd3a0);masonryFill.intensity=1.0;
    scene.traverse(o=>{if(o instanceof THREE.Light&&o.position.x>5&&o.position.x<10&&o.position.y<4){o.userData.nativeEnergyScale=.35;nativePractical.push(o);}});
    sun.color.fromArray(nativeKey.color);
    const shadowedMaterials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&!shadowedMaterials.has(m)){shadowedMaterials.add(m);shadowNativeArea(m);}});
    Object.assign(state,{lookControls,setLook:(changes:Partial<typeof lookControls>&{exposure?:number})=>{Object.assign(lookControls,changes);if(changes.exposure!==undefined)renderer.toneMappingExposure=changes.exposure;scene.environmentIntensity=lookControls.ambient;reflectionStrength.value=lookControls.reflectionGain;render(0);},materialAudit:()=>{const materials=new Map<string,unknown>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial)materials.set(m.name,{color:m.color.toArray(),metal:m.metalness,rough:m.roughness,env:!!m.envMap,envIntensity:m.envMapIntensity,normal:m.normalScale.toArray(),baked:!!m.lightMap,UVs:Object.keys(o.geometry.attributes),visible:o.visible});});return [...materials];}});
    Object.assign(state,{nativeCamera:await loadArchitecturalCamera()});
    scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&m.map===ashlar.map&&!detailedMaterials.includes(m))detailedMaterials.push(m);});
    for(const [name,cue] of Object.entries(track.frames[0].lights)){
      if(!/window.*interior practical|window.*reflected face fill|west.*backlight|west moving interior lantern|temple.*lamp/.test(name))continue;
      const l=new THREE.PointLight(new THREE.Color().fromArray(cue.color),cue.energy*.13,5,2);l.position.fromArray(cue.p);if(!/window (\d)/.test(name))scene.add(l);lights.set(name,l);
    }
    const back=lights.get('V13 / west actual silhouette backlight');
    if(back){back.castShadow=true;back.shadow.mapSize.set(512,512);back.shadow.bias=-.001;back.shadow.normalBias=.008;back.distance=3;}
    draco.dispose();const wide=track.camera.frames[0];camera.position.fromArray(wide.position);camera.lookAt(new THREE.Vector3().fromArray(wide.target));
    await Promise.all([...textureReady,environmentReady,displayReady]);mark('textures and environment ready');
    scene.environment=nativeLook.probe;scene.environmentIntensity=lookControls.ambient;
    const warmTarget=new THREE.WebGLRenderTarget(16,16);renderer.setRenderTarget(warmTarget);
    // Compile for the scene-linear targets actually used by the composer and mirror.
    // Spread first uploads and auxiliary passes across frames while the native poster stays visible.
    const yieldFrame=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    const settleUpload=async()=>{if(gpu.isContextLost())throw Error('Homepage graphics context lost');const fence=gpu.fenceSync(gpu.SYNC_GPU_COMMANDS_COMPLETE,0);gpu.flush();await yieldFrame();if(fence){const until=performance.now()+800;while(gpu.clientWaitSync(fence,0,0)===gpu.TIMEOUT_EXPIRED&&performance.now()<until){if(gpu.isContextLost())throw Error('Homepage graphics context lost');await yieldFrame();}gpu.deleteSync(fence);}};
    // Shader creation itself can block the video compositor. Compile one representative
    // per material/vertex layout, yielding between programs instead of a scene-wide burst.
    // GPU preparation belongs to the opening gate, before the homepage is revealed.
    mark('entry film released shader preparation');
    const compiledLayouts=new Set<string>();
    const shaderCompilation:Promise<unknown>[]=[];
    const shaderMeshes:THREE.Mesh[]=[];scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.visible)shaderMeshes.push(o);});
    for(const mesh of shaderMeshes){
      const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
      const layout=materials.map(m=>m.uuid).join('/')+':'+Number(mesh instanceof THREE.InstancedMesh)+':'+Number(mesh instanceof THREE.SkinnedMesh);
      if(compiledLayouts.has(layout))continue;
      compiledLayouts.add(layout);shaderCompilation.push(renderer.compileAsync(mesh,camera,scene));if(shaderCompilation.length%6===0)await yieldFrame();
    }
    await Promise.all(shaderCompilation);
    mark('surface shaders compiled');
    // Driver texture uploads are synchronous even with compileAsync. Keep them out of the entry film.
    // GPU preparation belongs to the opening gate, before the homepage is revealed.
    mark('entry film released GPU uploads');
    const textureUploads=new Set<THREE.Texture>(Object.values(closeAshlar));
    scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const material of Array.isArray(o.material)?o.material:[o.material])for(const value of Object.values(material))if(value instanceof THREE.Texture)textureUploads.add(value);});
    let uploadIndex=0;for(const map of textureUploads){renderer.initTexture(map);if(++uploadIndex%4===0)await settleUpload();}await settleUpload();
    const meshes:THREE.Mesh[]=[];scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.visible)meshes.push(o);});
    const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.BackSide}),distance=new THREE.MeshDistanceMaterial({side:THREE.BackSide});
    for(const material of [depth,distance,ao.normalMaterial]){const proxy=new THREE.Mesh(meshes[0].geometry,material);await renderer.compileAsync(proxy,camera,scene);await yieldFrame();}
    for(const mesh of meshes){mesh.customDepthMaterial??=depth;mesh.customDistanceMaterial??=distance;}
    const warmVisible=meshes.map(o=>o.visible);
    try{
    for(const mesh of meshes)mesh.visible=false;
    renderer.setRenderTarget(warmTarget);
    // Upload batches without rebuilding a 2048px shadow map for every single mesh.
    renderer.shadowMap.needsUpdate=false;
    for(let i=0;i<meshes.length;i+=4){for(const mesh of meshes.slice(i,i+4))mesh.visible=true;renderer.render(scene,camera);for(const mesh of meshes.slice(i,i+4))mesh.visible=false;await settleUpload();}mark('colour buffers uploaded');
    scene.overrideMaterial=ao.normalMaterial;
    for(let i=0;i<meshes.length;i+=8){for(const mesh of meshes.slice(i,i+8))mesh.visible=true;renderer.render(scene,camera);for(const mesh of meshes.slice(i,i+8))mesh.visible=false;await settleUpload();}
    scene.overrideMaterial=null;renderer.setRenderTarget(null);warmTarget.dispose();mark('normal buffers uploaded');
    const quadScene=new THREE.Scene(),quadCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1),quadGeometry=new THREE.PlaneGeometry(2,2);
    await Promise.all([ao.gtaoMaterial,ao.pdMaterial,ao.copyMaterial,ao.blendMaterial,reflectionCopy.material,reflectionBlur.material,...composer.passes.filter(p=>p instanceof ShaderPass).map(p=>(p as ShaderPass).material)].map(material=>renderer.compileAsync(new THREE.Mesh(quadGeometry,material),quadCamera,quadScene)));
    quadGeometry.dispose();mark('postprocess shaders compiled');
    composer.setSize(16,16);ao.setSize(16,16);composer.render();await yieldFrame();
    }finally{scene.overrideMaterial=null;renderer.setRenderTarget(null);meshes.forEach((o,i)=>{o.visible=warmVisible[i];});}
    // Shader shadow defines stay fixed; only cached shadow contents and light energy change.
    // Submillimetre metal engraving is already represented by the native cavity volume.
    // Keep the silhouette/hand casters; don't redraw their coplanar tessellation in shadow maps.
    
    world.traverse(o=>{if(o instanceof THREE.Mesh&&o.geometry.index&&o.geometry.index.count>21000){const m=Array.isArray(o.material)?o.material[0]:o.material;if(m instanceof THREE.MeshStandardMaterial&&m.metalness>.6)o.castShadow=false;}});
    animatedMechanisms=[...objects].filter(([name])=>/upper automaton [01]$|hinged blue apostle shutter/.test(name));
    resize();ready=true;render(0);state.ready=true;state.loadMilliseconds=performance.now()-loadingAt;last=performance.now();canvas.style.opacity='1';mark('live frame revealed');preparing.remove();(state as any).captureDisplay=()=>{render(0);return canvas.toDataURL('image/jpeg',.94);};(window as any).portfolioBoot?.complete('home');
    // The first camera sequence uses the original geometry. Optional distant simplification
    // must not delay the ready first frame or the next chapter's GPU preparation.
    Object.assign(state,{distancePreparationThread:'worker',distancePreparationComplete:false});
    void prepareDistanceDetail(world).then(detail=>{distanceDetail=detail;state.distanceDetail=detail.audit;Object.assign(state,{distancePreparationComplete:true});if(!started)render(0);}).catch(error=>{Object.assign(state,{distancePreparationFailure:String(error)});});
  }).catch(error=>{console.error('Native homepage world failed',error);surface.dataset.mediaError='world-load';(window as any).portfolioBoot?.fail('home',error);});
  function captureHome(){staticCapture=true;try{(composer.passes[0] as HomeAntialiasedPass).setSamples(4);resize(1);render(0);return canvas.toDataURL();}finally{staticCapture=false;(composer.passes[0] as HomeAntialiasedPass).setSamples(2);resize();render(0);}}
  function resize(quality=renderQuality){aoGeometryAt=-Infinity;const w=surface!.clientWidth,h=surface!.clientHeight,scale=Math.max(w/1600,h/900),renderScale=Math.min(scale,integrated?1:1.25)*quality;renderer.setSize(Math.round(1600*renderScale),Math.round(900*renderScale),false);composer.setSize(Math.round(1600*renderScale),Math.round(900*renderScale));ao.setSize(Math.round(720*renderScale),Math.round(405*renderScale));aa.uniforms.resolution.value.set(1/(1600*renderScale),1/(900*renderScale));canvas.style.width=1600*scale+'px';canvas.style.height=900*scale+'px';canvas.style.left=(w-1600*scale)/2+'px';canvas.style.top=(h-900*scale)/2+'px';state.renderQuality=quality;}
  let observedW=0,observedH=0;new ResizeObserver(([e])=>{const w=Math.round(e.contentRect.width),h=Math.round(e.contentRect.height);if(w!==observedW||h!==observedH){observedW=w;observedH=h;resize();}}).observe(surface);resize();new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0}).observe(surface);
  const phaseAxis=new THREE.Vector3(0,0,-1);const tempQ=new THREE.Quaternion();
  function render(dt:number){
    if(!ready)return;
    const f=track.frames[Math.floor((elapsed%16)*24)%384],next=track.frames[(Math.floor((elapsed%16)*24)+1)%384],mix=elapsed*24%1;
    for(const [name,pose] of Object.entries(f.groups)){
      const o=objects.get(name);if(!o)continue;const n=next.groups[name];
      o.position.fromArray(pose.p).lerp(new THREE.Vector3().fromArray(n.p),mix);courtyardPoint(o.position);o.quaternion.fromArray(pose.q).slerp(tempQ.fromArray(n.q),mix);o.scale.fromArray(pose.s);if(pose.p[0]<-6.3)o.scale.multiplyScalar(.94);else if(pose.p[0]>4.35)o.scale.multiplyScalar(.95);
    }
    const shot=track.camera.frames[Math.min(383,Math.floor(intro*24))];
    // After the accepted final wide shot, only camera movement ends; the world clock never resets.
    const view=intro>=16?track.camera.frames[0]:shot;
    camera.position.fromArray(view.position);if(intro<16){const angle=shot.shot==='dials'?-1.1:shot.shot==='automata'?.65:shot.shot==='three-windows'?1.7:shot.shot==='west-shadow'?-1.5:0;camera.position.x+=angle*Math.sin(Math.PI*Math.min(1,intro/16));camera.position.y-=.23*Math.sin(intro*.8);}camera.lookAt(new THREE.Vector3().fromArray(view.target));camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(36/(2*view.lens*16/9)));camera.updateProjectionMatrix();
    state.shot=architecturalCamera(camera,intro,track.camera.frames[0]);state.cameraLocked=intro>=16;navigation.update(intro>=16);discoveries.update(intro>=16);
    // Keep the high sample count for captures; live motion needs room for scrolling and the shadow pass.
    if(!staticCapture)(composer.passes[0] as HomeAntialiasedPass).setSamples(integrated?2:4);
    const close=camera.position.distanceToSquared(new THREE.Vector3(0,4,0))<23*23;
    if(close!==closeShadow){sun.shadow.mapSize.set(close?2048:1536,close?2048:1536);sun.shadow.map?.dispose();sun.shadow.map=null;sun.shadow.needsUpdate=true;shadowAt=-Infinity;closeShadow=close;}
    distanceDetail?.update(close||staticCapture);
    ao.enabled=false; // Native baked contact occlusion stays; coarse screen AO crawled on moving clock engraving.
    if(close!==highDetail){const maps=close?closeAshlar:ashlar;for(const m of detailedMaterials)Object.assign(m,maps);highDetail=close;state.surfaceDetail=close?'4K close / anisotropic':'2K wide / mipmapped';}
    const key=f.lights['V10 / moving warm to cool key'];
    if(key){const n=next.lights['V10 / moving warm to cool key'];sun.position.fromArray(key.p).lerp(new THREE.Vector3().fromArray(n.p),mix);sun.target.position.copy(sun.position).addScaledVector(new THREE.Vector3().fromArray(key.d).lerp(new THREE.Vector3().fromArray(n.d),mix),10);sun.color.setRGB(1,.83,.63);sun.intensity=THREE.MathUtils.lerp(key.energy,n.energy,mix)*lookControls.keyScale;}
    sun.angle=1.12;sun.penumbra=.45;
    nativeBroadKey.position.copy(sun.position);nativeBroadKey.lookAt(sun.target.position);nativeBroadKey.intensity=lookControls.areaIntensity;
    // Mirror the native key across the courtyard: a broad, low-power warm bounce
    // shapes the unlit wing. Continuous motion avoids switches when the key crosses centre.
    const fillSide=THREE.MathUtils.clamp(sun.position.x/8.5,-1,1);
    masonryFill.position.set(-fillSide*7.8,6.0,5.4);
    const fillTarget=new THREE.Vector3(-fillSide*5.2,3.5,-1.5);
    masonryFill.lookAt(fillTarget);
    masonryFill.intensity=lookControls.secondaryFillScale*(.82+.18*Math.abs(fillSide));
    Object.assign(state.secondaryLight,{position:masonryFill.position.toArray(),target:fillTarget.toArray(),intensity:masonryFill.intensity,powerRatio:masonryFill.intensity*masonryFill.width*masonryFill.height/(nativeBroadKey.intensity*nativeBroadKey.width*nativeBroadKey.height),primarySide:fillSide<0?'left':'right',fillSide:fillSide<0?'right':'left'});
    forestLight.position.set(-15+29*(.5+.5*Math.sin(elapsed*.23)),12.5,1);forestLight.target.position.set(-12+24*(.5+.5*Math.sin(elapsed*.23)),5.2,-21);forestLight.intensity=0;
    nativeForestKey.position.copy(forestLight.position);nativeForestKey.lookAt(forestLight.target.position);nativeForestKey.intensity=(220+60*Math.sin(elapsed*.32))/(25*Math.PI);
    state.liveLighting='Neutral warm key / cooler subordinate bounce; restored oak canopy';
    const strip=f.lights['V13 / clock side reflection strip'];if(strip){metalStrip.position.fromArray(strip.p);metalStrip.color.fromArray(strip.color);metalStrip.intensity=strip.energy*.011;metalStrip.lookAt(metalStrip.position.clone().add(new THREE.Vector3().fromArray(strip.d)));}
    const actor=f.groups['V10 / travelling archivist'];const xs=[6.2,7.7,9.2];const occupied=actor?xs.findIndex(x=>Math.abs(actor.p[0]-x)<.36&&actor.p[2]>-1.55):-1;state.occupiedWindow=occupied;state.windowLights.fill(0);
    for(const [name,l] of lights){const cue=f.lights[name];courtyardPoint(l.position.fromArray(cue.p));l.color.fromArray(cue.color);l.intensity=cue.energy*.13;
      const match=/window (\d)/.exec(name);if(match){const i=Number(match[1]);const proximity=actor?Math.max(0,1-Math.abs(actor.p[0]-xs[i])/.36):0;l.intensity=i===occupied?(name.includes('face fill')?1.4:7.0)*THREE.MathUtils.smoothstep(proximity,0,.6):0;state.windowLights[i]=Math.max(state.windowLights[i],l.intensity);}
      if(name.includes('west'))l.intensity=westOn?cue.energy*.30:cue.energy*.018;}
    for(const [point,kind] of [[occupiedPractical,'interior practical'],[occupiedFaceFill,'reflected face fill']] as const){const source=[...lights.entries()].find(([name])=>name.includes('window '+occupied+' ')&&name.includes(kind))?.[1];point.intensity=source?.intensity??0;if(source){point.position.copy(source.position);point.color.copy(source.color);}}
    for(const m of westLining){m.emissiveIntensity=westOn?.32:.012;m.opacity=.50;}
    const solar=lookup(/LIVE.*calendar.*rotor/),lunar=lookup(/LIVE.*astronomical.*rotor/);
    for(const [i,o] of [lunar,solar].entries())if(o){
      dialSpeed[i]=THREE.MathUtils.damp(dialSpeed[i],hover===i?.24:0,6,dt);dialOffset[i]+=dialSpeed[i]*dt;
      const a=elapsed*(i===0?.014:-.019)+dialOffset[i];o.quaternion.setFromAxisAngle(phaseAxis,a);state.dialAngles[i]=a;
    }
    for(const [i,name] of ['hour','minute','seconds'].entries()){const o=lookup(new RegExp('live.*'+name+'.*hand'));if(o){const a=([36630,630,30][i]+elapsed)/[43200,3600,60][i]*Math.PI*2;o.quaternion.setFromAxisAngle(phaseAxis,a);state.angles[i]=a;}}
    // Seven chain engagements include short mechanical dwells; a click release never retracts a hovered figure.
    held=figureTarget>=0;state.figureTarget=figureTarget;
    for(let i=0;i<2;i++){
      figureTravel[i]=THREE.MathUtils.clamp(figureTravel[i]+(figureTarget===i?dt/2.2:-dt/1.7),0,1);
      const step=figureTravel[i]*7,index=Math.floor(step),fraction=step-index;
      figureStrokes[i]=Math.min(1,(index+THREE.MathUtils.smoothstep(fraction,.14,.87))/7);
    }
    for(const [name,o] of animatedMechanisms){
      const actor=/upper automaton ([01])$/.exec(name);
      if(actor){o.traverse(child=>{if(child instanceof THREE.Mesh){const ms=Array.isArray(child.material)?child.material:[child.material];for(const m of ms)if(m instanceof THREE.MeshStandardMaterial&&!m.userData.automatonReadable){const copy=m.clone();copy.emissive.set(0xb68a4d);copy.emissiveIntensity=.09;copy.userData.automatonReadable=true;child.material=copy;}}});const i=+actor[1],rest=track.frames[0].groups[name];o.position.z=THREE.MathUtils.lerp(rest.p[2],.34,THREE.MathUtils.smoothstep(figureStrokes[i],.22,1));}
      if(/hinged blue apostle shutter/.test(name)){const suffix=/\.(\d+)$/.exec(name),leaf=suffix?+suffix[1]:0,i=leaf>=2?1:0,rest=track.frames[0].groups[name];o.quaternion.fromArray(rest.q).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),(leaf%2?-1:1)*1.65*THREE.MathUtils.smoothstep(figureStrokes[i],0,.36)));}
    }
    const steps=Math.max(1,Math.ceil(dt*120)),step=dt/steps;
    for(let i=0;i<steps;i++){bellVelocity+=(-bellAngle*20-bellVelocity*3.8)*step;bellAngle+=bellVelocity*step;}
    const bell=lookup(/temple hanging bell/);if(bell)bell.rotateZ(bellAngle);
    // Light, casters and their visibility must belong to the same displayed frame.
    const shadowDirty=dt===0||elapsed-shadowAt>(integrated?.16:.065)||drag>=0||held||figureTravel.some(v=>v>0)||Math.abs(bellAngle)>.01;renderer.shadowMap.needsUpdate=shadowDirty;sun.shadow.needsUpdate=shadowDirty;if(shadowDirty)shadowAt=elapsed;
    const back=lights.get('V13 / west actual silhouette backlight');if(back)back.shadow.autoUpdate=false;if(back&&westOn&&elapsed%1<.15)back.shadow.needsUpdate=true;
    renderer.info.reset();
    const reflectionInterval=integrated?1/4:intro<16?1/8:1/6;
    if(elapsed-reflectionAt>reflectionInterval||dt===0){
      previousProjection.value.copy(reflectionProjection.value);
      const oldTarget=renderer.getRenderTarget();renderer.setRenderTarget(previousReflection);reflectionCopy.render(renderer);renderer.setRenderTarget(oldTarget);
      camera.updateMatrixWorld();for(const m of floorMeshes)m.visible=false;
      reflector.onBeforeRender(renderer,scene,camera,reflector.geometry,reflector.material as THREE.ShaderMaterial,world);
      // Reflector's matrix includes its own rotated plane. The native paving vertices are already
      // world-space; removing that extra transform keeps reflections under their real source.
      reflectionProjection.value.copy((reflector.material as THREE.ShaderMaterial).uniforms.textureMatrix.value).multiply(reflector.matrixWorld.clone().invert());
      const afterMirror=renderer.getRenderTarget();renderer.setRenderTarget(currentReflection);reflectionBlur.render(renderer);renderer.setRenderTarget(afterMirror);
      for(const m of floorMeshes)m.visible=true;reflectionAt=elapsed;
    }
    reflectionBlend.value=paused||dt===0?1:THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((elapsed-reflectionAt)/reflectionInterval,0,1),0,1);
    air.update(elapsed);updateDetails?.(elapsed);
    // Native practical intensities replace the oversized accumulated webpage fill.
    for(const o of nativePractical)o.intensity*=o.userData.nativeEnergyScale;
    // The retained Three version exposes this flag for its depth/normal prepass.
    // A fixed camera can reuse the complete occlusion between 2 Hz updates; lighting remains live.
    const refreshAo=(intro<16&&elapsed-aoGeometryAt>1/15)||dt===0||elapsed-aoGeometryAt>2||drag>=0||hover>=0||performance.now()-dialInputAt<250||held||figureTravel.some(v=>v>0)||Math.abs(bellAngle)>.01;
    (ao as unknown as {_renderGBuffer:boolean})._renderGBuffer=refreshAo;
    ao.refreshOcclusion=refreshAo;
    Object.assign(state,{shadowUpdateMode:'every-displayed-frame',shadowFrame:state.renderFrames+1,occlusionRefresh:refreshAo,dialOcclusionSynchronized:drag<0||refreshAo});
    if(refreshAo)aoGeometryAt=elapsed;
    state.elapsed=elapsed;state.camera=camera.position.toArray();state.heldFigures=held;state.westOn=westOn;state.westLightEnergy=[...lights].filter(([name])=>name.includes('west')).reduce((n,[,light])=>n+light.intensity,0);state.bellAngle=bellAngle;composer.render();state.renderFrames++;state.drawCalls=renderer.info.render.calls;state.triangles=renderer.info.render.triangles;
  }
  const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),.1),point=new THREE.Vector3();
  function hit(e:PointerEvent){const b=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),camera);
    if(!ray.ray.intersectPlane(plane,point))return '';
    if(Math.hypot(point.x+.15,point.y-5.45)<1.84)return 'upper';if(Math.hypot(point.x+.15,point.y-1.77)<1.36)return 'lower';
    if(point.y>7.14&&point.y<8.04){if(Math.abs(point.x+.84)<.29)return 'knight-0';if(Math.abs(point.x-.54)<.29)return 'knight-1';}
    ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),2.8),point);
    if(Math.abs(point.x+4.75)<.48&&Math.abs(point.y-4.4)<.7)return 'bell';
    ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),2.46),point);
    if(Math.abs(point.x+7.35)<.48&&point.y>2.25&&point.y<3.58)return 'west';return '';
  }
  canvas.addEventListener('pointerdown',e=>{if(!ready||e.button!==0)return;const h=hit(e);if(!h){if(e.pointerType!=='mouse'){touchFigure=-1;figureTarget=-1;}return;}e.stopPropagation();state.interactions++;
    if(h.startsWith('knight-')){const i=+h.slice(-1);if(e.pointerType==='mouse')figureTarget=i;else {touchFigure=touchFigure===i?-1:i;figureTarget=touchFigure;}return;}
    activePointer=e.pointerId;canvas.setPointerCapture(e.pointerId);
    if(h==='bell')bellVelocity+=2.4;else if(h==='west'){westOn=!westOn;state.westOn=westOn;}else {drag=h==='upper'?0:1;lastAngle=Math.atan2(point.x+.15,point.y-(drag===0?5.45:1.77));}
  });
  canvas.addEventListener('pointermove',e=>{const h=hit(e);hover=h==='upper'?0:h==='lower'?1:-1;canvas.style.cursor=drag>=0?'grabbing':hover>=0?'grab':h?'pointer':'';if(e.pointerType==='mouse')figureTarget=h.startsWith('knight-')?+h.slice(-1):-1;
    if(drag>=0&&e.pointerId===activePointer){ray.ray.intersectPlane(plane,point);const a=Math.atan2(point.x+.15,point.y-(drag===0?5.45:1.77));dialOffset[drag]+=Math.atan2(Math.sin(a-lastAngle),Math.cos(a-lastAngle));lastAngle=a;dialInputAt=performance.now();e.stopPropagation();}
  });
  function release(e:PointerEvent){if(activePointer!==e.pointerId)return;drag=-1;activePointer=-1;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',e=>{release(e);figureTarget=-1;touchFigure=-1;});canvas.addEventListener('lostpointercapture',release);canvas.addEventListener('pointerleave',()=>{hover=-1;figureTarget=touchFigure;});
  const restart=()=>{intro=16;paused=false;started=true;window.dispatchEvent(new Event('v85:home-intro-replay'));};
  surface.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();paused=!paused;}if(e.code==='Home'){e.preventDefault();restart();}});surface.addEventListener('dblclick',restart);
  window.addEventListener('v31:opening-complete',()=>{started=true;last=performance.now();},{once:true});
  let suspended=true,scrollAt=-Infinity,qualityStarted=performance.now(),particleEntering=false;
  const nextChapter=document.getElementById("sandNarrative");window.addEventListener("scroll",()=>{const r=nextChapter?.getBoundingClientRect();particleEntering=!!r&&r.top<innerHeight*.95&&r.bottom>innerHeight*.1;},{passive:true});
  window.addEventListener('wheel',()=>{scrollAt=performance.now();},{passive:true});
  function animate(now:number){
    requestAnimationFrame(animate);const wallDt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    if(!started&&document.body.dataset.openingComplete==='true')started=true;
    const inactive=!started||!visible||particleEntering||document.hidden||!ready||document.body.classList.contains('home-intro-playing')||document.body.classList.contains('is-sand-reading')||document.body.classList.contains('odyssey-dialog-open')||document.body.classList.contains('v31-index-open')||document.body.classList.contains('standalone-archive-open')||document.body.classList.contains('works-orbit-open')||document.body.classList.contains('is-project-active')||document.body.classList.contains('is-project-leaving')||document.body.classList.contains('memory-open')||document.body.classList.contains('portfolio-portal-open');
    if(inactive){suspended=true;qualityWindow=qualityFrames=0;qualityStarted=now;return;}
    if(suspended){qualityStarted=now;renderedAt=now;last=now;suspended=false;navigation.update(intro>=16);discoveries.update(intro>=16);}
    // During active wheel movement, leave time for layout and the next chapter; keep the same materials and shadows.
    if(now-scrollAt<160&&now-renderedAt<32)return;
    while(frameFences.length&&gpu.clientWaitSync(frameFences[0],0,0)!==gpu.TIMEOUT_EXPIRED)gpu.deleteSync(frameFences.shift()!);
    if(frameFences.length>=2)return;
    if(!paused){elapsed+=Math.min(.05,(now-renderedAt)/1000);intro=Math.min(16,intro+Math.min(.05,(now-renderedAt)/1000));qualityWindow=(now-qualityStarted)/1000;if(qualityWindow>3&&intro>=16&&scrollY<3&&now-scrollAt>500){const fps=qualityFrames/qualityWindow,next=!integrated?1:fps<25?Math.max(integrated?.85:.88,renderQuality-.08):fps>45?Math.min(1,renderQuality+.05):renderQuality;qualityWindow=qualityFrames=0;qualityStarted=now;if(next!==renderQuality){renderQuality=next;resize();}}}
    qualityFrames++;render(Math.min(.05,(now-renderedAt)/1000));renderedAt=now;const fence=gpu.fenceSync(gpu.SYNC_GPU_COMMANDS_COMPLETE,0);if(fence)frameFences.push(fence);gpu.flush();
  }  window.addEventListener('pageshow',()=>{last=performance.now();if(ready){const r=surface!.getBoundingClientRect();visible=r.bottom>0&&r.top<innerHeight;intro=16;navigation.update(true);discoveries.update(true);}});
  window.addEventListener('portfolio:surface-return',()=>{if(ready&&started){intro=16;navigation.update(true);discoveries.update(true);render(0);}});
  window.addEventListener('v85:home-intro-finished',()=>{intro=16;started=true;paused=false;last=performance.now();if(ready){navigation.update(true);discoveries.update(true);render(0);}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();Object.assign(state,{contextLost:true});for(const fence of frameFences)gpu.deleteSync(fence);frameFences.length=0;});
  canvas.addEventListener('webglcontextrestored',()=>{Object.assign(state,{contextLost:false});last=performance.now();if(ready){resize();render(0);navigation.update(true);discoveries.update(true);}});
  requestAnimationFrame(animate);document.addEventListener('visibilitychange',()=>{last=performance.now();});
}

