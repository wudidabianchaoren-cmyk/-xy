import {foliageDepthPrepass} from './foliage-depth-v185';
import {applyLeafRadiance186} from './native-leaf-radiance-v186';
import {graphicsRecovery} from './graphics-recovery-v185';
import {displaySMAA} from './display-aa-v185';
import {sortedFoliage} from './sorted-foliage-v183';
import {foliageCulling} from './foliage-culling-v185';
import {combineAnimatedSkins} from './skin-batching-v185';
import {cacheWaterReflection} from './water-reflection-v185';
import {staticShadowCache} from './static-shadow-cache-v183';
import {batchRigidParts,mergeSkinnedParts,sceneRenderInventory} from './draw-batching-v183';
import {frameProfile} from './frame-profile-v183';
import {attachBakedLightingV179,preloadNativeLighting186} from './directory-v141/baked-lighting-v179';
import {captureLightingV179} from './directory-v141/capture-lighting-v179';
import{nativeUESurface}from'./ue-native-surface-v162';
import{coastalAirV161}from'./coastal-air-v161';
import{attachUEIslandV161}from'./ue-island-v161';
import{cottageProcessEntry}from'./odyssey-process-entry-v144';
import{sailWind,foliageWind,dayNight}from'./odyssey-weather-v161';
import {shipWaterExclusion} from './ship-water-exclusion-v143';
import{coastalMeadowV161}from'./coastal-meadow-v161';
import{stoneCottageV161}from'./stone-cottage-v161';
import {coastV161} from './coast-v161';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
import * as THREE from 'three';
import {installTextureNetworkRetry} from './texture-network-retry-v182';
installTextureNetworkRetry(THREE);
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';

import {Water} from 'three/addons/objects/Water.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createDollyV166 as createOdysseyControlsV154} from './odyssey-dolly-v169';
import {coastalLifeV158,seaGridV155} from './coastal-life-v158';
import {attachUECoveReflectionV158} from './ue-cove-reflection-v158';

const host=document.getElementById('odysseyScene')!,canvas=host.querySelector('canvas')!;
const nativeFieldManifest187=new URLSearchParams(location.search).get('legacyDepth187')==='1'?'./assets/browser-v179/myth-field/manifest.json':'./assets/browser-v186/depth-fields/manifest.json';
 const state:any={version:164,ready:false,frames:0,giant:false,ships:1,scope:'compact coastal cove',native:'blender/mythology-v32-146/rigged-fleet-v148.blend',renderer:new URLSearchParams(location.search).get('renderer')==='web'?'explicit web authoring view':'native UE viewport connecting',paused:new URLSearchParams(location.search).get('freezeScene')==='1'};
(window as any).odysseyState=state;
const help=host.querySelector<HTMLElement>('.local-cove-help');if(help)help.textContent='左键环顾 · 右键平移 · 滚轮前后 · 双击岸上靠近';
canvas.setAttribute('aria-label','实时海湾：左键环顾，右键或Shift拖动平移，滚轮移动，双击岸上靠近；WASD移动，Q和E升降');

async function boot(){
 const usePostAA=new URLSearchParams(location.search).has('postAA185'),renderer=new THREE.WebGLRenderer({canvas,antialias:!usePostAA,powerPreference:'high-performance'});const postAA=usePostAA?displaySMAA(renderer):null;
 const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
 state.gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'';
 const integrated=/Intel|Iris|UHD|SwiftShader/i.test(state.gpu);state.integrated=integrated;
 renderer.setPixelRatio(Math.min(devicePixelRatio,integrated?1:1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
 const windTime={value:0};const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xd6ddd5,.00155);
 const camera=new THREE.PerspectiveCamera(34,1,.15,5000),controls=createOdysseyControlsV154(camera,canvas);
 const start=new THREE.Vector3(37,17,49),aim=new THREE.Vector3(-6,9,-16);
 camera.position.copy(start);controls.target.copy(aim);controls.update();
 camera.aspect=host.clientWidth/Math.max(1,host.clientHeight);camera.updateProjectionMatrix();const bakeCapture=new URLSearchParams(location.search).get('bakeCapture')==='myth',nativeRequired=bakeCapture||new URLSearchParams(location.search).get('renderer')!=='web';canvas.style.opacity=nativeRequired?'0':'1';state.nativeSurfaceChanged=(ready:boolean)=>{canvas.style.opacity=nativeRequired?'0':state.ready?'1':'0';if(ready){const loading=host.querySelector<HTMLElement>('.odyssey-preparing');if(loading)loading.hidden=true;state.firstNativeFrameAt??=performance.now();}};
 if(nativeRequired)void nativeUESurface(host,'myth',()=>({position:camera.position.toArray(),target:controls.lookTarget.toArray(),fov:camera.fov,night:(state.nightMix??0)>.5,paused:state.paused}),state).then(api=>{state.nativeController=api;state.renderer='Unreal Engine 5.8.4 complete live viewport / original controls and collision';}).catch(e=>{state.nativeFallback=String(e)});
 const earlyControl=()=>{if(state.ready)return;if(!document.hidden)controls.update();requestAnimationFrame(earlyControl);};requestAnimationFrame(earlyControl);
 const fieldNetworkReady=!nativeRequired&&new URLSearchParams(location.search).get('nativeLightfield')==='1'?preloadNativeLighting186(nativeFieldManifest187).then(pack=>Promise.all([...pack.parts.values()])):Promise.resolve();fieldNetworkReady.catch(()=>{});

 const sunDirection=new THREE.Vector3(-83,42,45).normalize();
 const sun=new THREE.DirectionalLight(new THREE.Color().setRGB(1,.69,.36),9.5);sun.target.position.set(-7,8,-20);sun.position.copy(sun.target.position).addScaledVector(sunDirection,120);
 sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);sun.shadow.radius=2;
 Object.assign(sun.shadow.camera,{left:-60,right:60,top:58,bottom:-58,near:1,far:230});sun.shadow.normalBias=.015;sun.shadow.bias=-.00004;
 const coastalAmbient=new THREE.HemisphereLight(0xe2cbaa,0x5b503d,.08);scene.add(sun,sun.target,coastalAmbient);
 const sunBounce=new THREE.DirectionalLight(0xd4e6ed,.06);sunBounce.name='V158 golden hour sea-bounce';sunBounce.position.set(45,55,75);sunBounce.target.position.set(-6,5,-20);scene.add(sunBounce,sunBounce.target);
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder),textures=new THREE.TextureLoader(),folder='./assets/odyssey/compact-v134/';
 const [land,ship,vegetation,placements,hdr,normal,heightData,grass,newCrew,crewProduction]=await Promise.all([
  loader.loadAsync('./assets/odyssey/refit-v148/island-bridged-web-c.glb'),loader.loadAsync('./assets/odyssey/crew-v163/vessel-coherent.glb'),loader.loadAsync(folder+'vegetation.glb'),
  fetch('./assets/odyssey/refit-v148/vegetation-grounded-c.json').then(r=>r.json()),new RGBELoader().loadAsync('./assets/odyssey/venice_sunset_1k.hdr'),textures.loadAsync('./assets/odyssey/waternormals.jpg'),fetch(folder+'height.json').then(r=>r.json()),loader.loadAsync('./assets/odyssey/refit-v148/grass-grounded-c.glb'),loader.loadAsync('./assets/odyssey/crew-v162/medieval-rowers.glb'),fetch('./assets/odyssey/refit-v141/production.json').then(r=>r.json())
 ]);
 if((window as any).PORTFOLIO_PREWARMING186){await fieldNetworkReady;state.assetsPrepared=true;state.assetsPreparedAt=performance.now();if((window as any).PORTFOLIO_PREWARMING186)await new Promise<void>(resolve=>addEventListener('portfolio:prewarm-activated',()=>resolve(),{once:true}));}
 const lowerShore=(h:number)=>h-.65*(1-THREE.MathUtils.smoothstep(h,-.3,.75));
 heightData.heights=heightData.heights.map(lowerShore);
 land.scene.updateMatrixWorld(true);land.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const p=o.geometry.getAttribute('position'),q=new THREE.Vector3(),inv=o.matrixWorld.clone().invert();for(let i=0;i<p.count;i++){q.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);q.y=lowerShore(q.y);q.applyMatrix4(inv);p.setXYZ(i,q.x,q.y,q.z);}p.needsUpdate=true;o.geometry.computeVertexNormals();});
 // Remove the old regular height-field corrugation only on the low sandy apron.
 // Bedrock, upper terrain and the island footprint remain the original mesh.
 land.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const g=o.geometry,p=g.getAttribute('position'),idx=g.index;if(!idx)return;
  const adjacent=Array.from({length:p.count},()=>new Set<number>());
  for(let i=0;i<idx.count;i+=3){const a=idx.getX(i),b=idx.getX(i+1),c=idx.getX(i+2);adjacent[a].add(b).add(c);adjacent[b].add(a).add(c);adjacent[c].add(a).add(b);}
  for(let pass=0;pass<12;pass++){const next=new Float32Array(p.count);for(let i=0;i<p.count;i++){const h=p.getY(i);let sum=0;for(const n of adjacent[i])sum+=p.getY(n);const w=THREE.MathUtils.smoothstep(h,-.2,.6)*(1-THREE.MathUtils.smoothstep(h,2.5,4.));next[i]=THREE.MathUtils.lerp(h,sum/(adjacent[i].size||1),w*.5);}for(let i=0;i<p.count;i++)p.setY(i,next[i]);}
  p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();});
 state.shorelineFix='terrain extends beneath troughs; original shoreline retained; shared-wave wet sand and broken low-contrast wash replace isobath outline';
 const pmrem=new THREE.PMREMGenerator(renderer);hdr.mapping=THREE.EquirectangularReflectionMapping;
 scene.environment=pmrem.fromEquirectangular(hdr).texture;scene.environmentIntensity=.45;pmrem.dispose();

 // Restore the incumbent maritime sky: real HDR upper sky plus restrained drifting clouds.
 const skyClock={value:0},seaSun=sunDirection.clone();
 const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{map:{value:hdr},time:skyClock,sun:{value:seaSun}},
 vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D map;uniform float time;uniform vec3 sun;varying vec3 direction;
 float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=noise(p)*a;p=p*2.03+vec2(13.1,7.3);a*=.5;}return v;}
 void main(){vec3 d=normalize(direction);float h=pow(max(0.,1.-abs(d.y)),13.);float g=pow(max(dot(d,sun),0.),32.);
 // Same source HDR and lower-hemisphere clamp as UE EveningSky.
 vec3 nativeDirection=normalize(vec3(d.x,max(d.y,length(d.xz)*.38),d.z));
 vec2 nativeUV=vec2(atan(nativeDirection.z,nativeDirection.x)/6.28318530718+.5,asin(clamp(nativeDirection.y,-1.,1.))/3.14159265359+.5);
 float mass=0.;vec3 sky=texture2D(map,nativeUV).rgb*.7;gl_FragColor=vec4(sky,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
const skyDome=new THREE.Mesh(new THREE.SphereGeometry(2400,48,24),skyMaterial);skyDome.userData.nativeLightingSurface=true;skyDome.userData.nativeLightingExcluded=true;scene.add(skyDome);

 // Original island silhouette is retained; the new terrain uses actual material albedo.
 scene.add(land.scene);
 await coastV161(scene,land.scene,loader,state);
 let grassVertices=0;grass.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const g=o.geometry,p=g.getAttribute('position');grassVertices+=p.count;const m=new THREE.MeshStandardMaterial({color:0x83905b,roughness:.96,envMapIntensity:.55,side:THREE.DoubleSide});o.material=m;o.receiveShadow=true;o.castShadow=false;
 const parent=Array.from({length:p.count},(_,i)=>i),find=(n:number):number=>parent[n]===n?n:parent[n]=find(parent[n]);const ids=g.index;
 for(let j=0;j<(ids?.count??p.count);j+=3){const a=ids?ids.getX(j):j;for(let k=1;k<3;k++){const b=ids?ids.getX(j+k):j+k;parent[find(b)]=find(a);}}
 const lows=new Map<number,number>();for(let i=0;i<p.count;i++){const root=find(i);lows.set(root,Math.min(lows.get(root)??Infinity,p.getY(i)));}const weights=new Float32Array(p.count);for(let i=0;i<p.count;i++)weights[i]=THREE.MathUtils.clamp((p.getY(i)-lows.get(find(i))!)/.30,0,1);g.setAttribute('coastalBend',new THREE.BufferAttribute(weights,1));
 m.onBeforeCompile=shader=>{shader.uniforms.coastalWind=clock;shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float coastalBend;uniform float coastalWind;').replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x+=sin(position.z*.7+coastalWind*.6+position.x*.4)*.035*coastalBend;transformed.z+=cos(coastalWind*.43+position.x)*.022*coastalBend;');};m.customProgramCacheKey=()=> 'v159-native-low-tussock-rooted-breeze';});scene.add(grass.scene);state.coastalGrass={source:'V148 original low grounded coastal tussocks',vertices:grassVertices,denseMeadowRemoved:true,rootedBreeze:true};

 ship.scene.updateMatrixWorld(true);
 const groups=new Map<THREE.Material,THREE.BufferGeometry[]>(),animatedMaterials=new Set<THREE.Material>();
 ship.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;if(/oar[_\s]+shaft/i.test(o.name)){state.replacedOarShafts=(state.replacedOarShafts||0)+1;return;}const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.length!==1)return;
  let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();for(const key of ['position','normal','uv']){const attr=g.getAttribute(key);if(attr){const values=new Float32Array(attr.count*attr.itemSize);for(let i=0;i<attr.count;i++)for(let j=0;j<attr.itemSize;j++)values[i*attr.itemSize+j]=attr.getComponent(i,j);g.setAttribute(key,new THREE.BufferAttribute(values,attr.itemSize));}}g.applyMatrix4(o.matrixWorld);
  for(const name of Object.keys(g.attributes))if(!['position','normal','uv'].includes(name))g.deleteAttribute(name);
  if(!g.getAttribute('uv'))g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
  
  if(/linen sail|sailcloth/i.test(mats[0].name)){
   const uv=g.getAttribute('uv');let loX=Infinity,loY=Infinity,hiX=-Infinity,hiY=-Infinity;for(let i=0;i<uv.count;i++){loX=Math.min(loX,uv.getX(i));hiX=Math.max(hiX,uv.getX(i));loY=Math.min(loY,uv.getY(i));hiY=Math.max(hiY,uv.getY(i));}
   const coords=new Float32Array(uv.count*2);for(let i=0;i<uv.count;i++){coords[i*2]=(uv.getX(i)-loX)/(hiX-loX||1);coords[i*2+1]=(uv.getY(i)-loY)/(hiY-loY||1);}g.setAttribute('sailWindUV',new THREE.BufferAttribute(coords,2));state.sailWindPieces=(state.sailWindPieces||0)+1;
  }
  const list=groups.get(mats[0])||[];list.push(g);groups.set(mats[0],list);
 });
 const boat=new THREE.Group(),clock={value:0},floatPivot=new THREE.Vector3(0,0,8),rotatedPivot=new THREE.Vector3();let boatTriangles=0,heave=0;
 boat.userData.nativeLightingExcluded=true;
 const seaHeight=(x:number,z:number,t:number)=>.13*Math.sin(t*.04)+.16*Math.sin((x-z)*.1485-t*.45)+.09*Math.sin((x+z)*.233-t*.372);
 for(const [mat,parts]of groups){const geometry=mergeGeometries(parts,false);if(!geometry)continue;const mesh=new THREE.Mesh(geometry,mat);
  mesh.castShadow=true;mesh.receiveShadow=true;boat.add(mesh);boatTriangles+=geometry.attributes.position.count/3;parts.forEach(g=>g.dispose());
  
  if(mat instanceof THREE.MeshStandardMaterial){if(mat.metalness<.5)mat.roughness=Math.max(.76,mat.roughness);mat.envMapIntensity=.42;
   for(const t of [mat.map,mat.normalMap,mat.roughnessMap])if(t)t.anisotropy=8;
   if(/weathered oak|timber|hemp|sawn oak/i.test(mat.name)&&!/linen|sail/i.test(mat.name)){
    mat.roughness=.83;mat.envMapIntensity=.32;mat.metalness=0;if(mat.normalMap)mat.normalScale.setScalar(.28);
    const oldHook=mat.onBeforeCompile;
    mat.onBeforeCompile=(s,r)=>{oldHook.call(mat,s,r);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 shipPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\nshipPoint=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 shipPoint;').replace('#include <color_fragment>',`#include <color_fragment>
      float wet=1.-smoothstep(-.15,.60,shipPoint.y);diffuseColor.rgb*=mix(1.,.66,wet);`).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
      roughnessFactor=mix(max(.72,roughnessFactor),.49,1.-smoothstep(-.15,.60,shipPoint.y));`);};mat.customProgramCacheKey=()=> 'v138-longitudinal-timber-and-wet-foot';
   }
   if(/Anatomically_fitted|tunic dye|Oatmeal|Pleated_woven/i.test(mat.name)){mat.color.setRGB(.36,.32,.24);mat.roughness=.88;}
   if(/Scarlet|mantle/i.test(mat.name)){mat.color.setRGB(.29,.065,.04);mat.roughness=.88;}
   
   if(/armor|bronze bowl|armor edges/i.test(mat.name)){if(!/linen|leather/.test(mat.name)){mat.metalness=.82;mat.roughness=.46;mat.envMapIntensity=.72;}}
   if(/linen sail|sailcloth/i.test(mat.name)){mat.color.multiply(new THREE.Color(0xffefd3));sailWind(mat,windTime);const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});sailWind(depth as any,windTime);mesh.customDepthMaterial=depth;}
  }
 }
 boat.add(newCrew.scene);const crewMixer=new THREE.AnimationMixer(newCrew.scene);for(const clip of newCrew.animations)crewMixer.clipAction(clip).play();newCrew.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.55;for(const t of[m.map,m.normalMap,m.roughnessMap])if(t)t.anisotropy=8;}}}});state.riggedCrew={actors:14,animations:newCrew.animations.length,source:'V162 medieval mail / CC0 anatomical hands / retained 14 rigs',bytes:15063752};const mergedCrew=mergeSkinnedParts(newCrew.scene);state.crewSkinBatching=mergedCrew.audit;const crewBatches=batchRigidParts(newCrew.scene,boat,renderer,'original crew armour and equipment');state.crewDrawBatching=crewBatches.audit;scene.add(boat);state.boatBatches=groups.size;state.boatTriangles=boatTriangles;
 // V161 physical stone house is shared by web and native UE export.
 const cottageRoot=await stoneCottageV161(state);scene.add(cottageRoot);const cottageMeshes=cottageRoot.children as THREE.Mesh[];
 // Use the actual rendered island triangles for placement. The old sampled height field
 // is a water-depth proxy and is not precise enough to ground an architectural object.
 land.scene.updateMatrixWorld(true);const groundRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 // The higher-detail coast needs the same exact triangle queries without
 // scanning its entire mesh for every cottage-site sample.
 land.scene.traverse(o=>{if(o instanceof THREE.Mesh){(o.geometry as any).boundsTree=new MeshBVH(o.geometry,{indirect:true});o.raycast=acceleratedRaycast;}});
 (groundRay as any).firstHitOnly=true;state.terrainQueries='exact triangles / BVH';
 const terrainAt=(x:number,z:number)=>{groundRay.set(new THREE.Vector3(x,150,z),down);return groundRay.intersectObject(land.scene,true)[0]?.point.y??-100;};
 state.terrainSample=[-4,-10,-16,-22].map(z=>({z,h:[-30,-15,0,15,30].map(x=>[x,terrainAt(x,z)])}));const candidates:any[]=[];for(let x=-18;x<=20;x+=2)for(let z=-28;z>=-56;z-=2){const heights=[[-2.7,-2.2],[2.7,-2.2],[-2.7,2.2],[2.7,2.2],[0,0]].map(([dx,dz])=>terrainAt(x+dx,z+dz));const lo=Math.min(...heights),hi=Math.max(...heights);const treeDistance=Math.min(...placements.filter((p:any)=>p.scale[0]>3.2).map((p:any)=>Math.hypot(p.position[0]-x,p.position[2]-z)));if(lo>6&&hi-lo<1.65&&treeDistance>4.8)candidates.push({x,z,heights,lo,hi,treeDistance,score:(hi-lo)*6+Math.abs(x-8)*.05+Math.abs(z+38)*.04});}
 candidates.sort((a,b)=>a.score-b.score);const site=candidates[0];if(!site)throw Error('No grounded clear cottage site found');
 cottageRoot.position.set(site.x,site.hi-.10,site.z);
 const meadow=coastalMeadowV161(land.scene,clock,[site.x,site.hi,site.z],state);scene.add(meadow);
 state.cottage={native:'assets/odyssey/refit-v161/island-craft.glb / same physical geometry',batches:cottageMeshes.length,grounded:true,terrainSource:'actual rendered island triangle raycast',position:[site.x,site.hi-.10,site.z],site,translation:cottageRoot.position.toArray(),design:'aged rubble limestone / deep openings / forged iron / weathered barrel tiles'};


 // Real leaf geometry, with a second whole-leaf budget for small shrubs.
 const leafColor=await textures.loadAsync('./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_diff_1k.png');
 const leafAlpha=await textures.loadAsync('./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_alpha_1k.png');
 leafColor.colorSpace=THREE.SRGBColorSpace;leafColor.flipY=leafAlpha.flipY=false;
 vegetation.scene.updateMatrixWorld(true);const foliageMeshes:THREE.InstancedMesh[]=[];
 const leafStats:any[]=[];
 vegetation.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const match=/prototype[ _](\d)/.exec(o.name);if(!match)return;
  const index=+match[1],all=placements.filter((p:any)=>p.prototype===index);
  const source=o.geometry.clone().applyMatrix4(o.matrixWorld),material=(o.material as THREE.MeshStandardMaterial).clone();
  if(index===2){
   const position=source.getAttribute('position'),indices=source.index;
   if(indices){for(let k=0;k<indices.count;k+=6){const unique=[...new Set(Array.from({length:6},(_,j)=>indices.getX(k+j)))];const center=new THREE.Vector3();unique.forEach(i=>center.add(new THREE.Vector3().fromBufferAttribute(position,i)));center.multiplyScalar(1/unique.length);for(const i of unique){const p=new THREE.Vector3().fromBufferAttribute(position,i).sub(center).multiplyScalar(2.2).add(center);position.setXYZ(i,p.x,p.y,p.z);}}}
   position.needsUpdate=true;source.computeBoundingSphere();
  }
  material.side=THREE.DoubleSide;material.roughness=.87;material.envMapIntensity=.50;
  if(index===2){material.map=leafColor;material.alphaMap=leafAlpha;material.alphaTest=.32;material.alphaToCoverage=true;material.transparent=false;material.depthWrite=true;material.opacity=1;material.color.setRGB(1.10,1.15,.93);material.normalMap=null;material.roughnessMap=null;material.metalnessMap=null;material.metalness=0;material.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>','outgoingLight+=diffuseColor.rgb*.045;\n#include <opaque_fragment>');};material.customProgramCacheKey=()=> 'v134-leaf-translucency';}
  foliageWind(material,windTime,index);
  for(const t of [material.map,material.normalMap,material.alphaMap])if(t)t.anisotropy=8;
  const batches=index===2?[all.filter((p:any)=>p.scale[0]>3.2),all.filter((p:any)=>p.scale[0]<=3.2)]:[all];
  batches.forEach((positions:any[],kind:number)=>{
   let geometry=source;
   if(index===2&&kind===1){geometry=source.clone();const indices=source.index?.array||Array.from({length:source.attributes.position.count},(_,i)=>i),trim:number[]=[];
    for(let tri=0;tri<indices.length/3;tri++)if(Math.floor(tri/2)%2===0)trim.push(indices[tri*3],indices[tri*3+1],indices[tri*3+2]);
    geometry.setIndex(trim);geometry.computeBoundingSphere();
   }
   const instances=new THREE.InstancedMesh(geometry,material,positions.length),matrix=new THREE.Matrix4(),q=new THREE.Quaternion();
   positions.forEach((p:any,i:number)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),p.angle);matrix.compose(new THREE.Vector3(...p.position),q,new THREE.Vector3(...p.scale));instances.setMatrixAt(i,matrix);});
   instances.castShadow=true;instances.receiveShadow=true;instances.computeBoundingSphere();scene.add(instances);foliageMeshes.push(instances);
   if(index===2)leafStats.push({instances:positions.length,trianglesPerInstance:geometry.index?geometry.index.count/3:geometry.attributes.position.count/3});
  });
 });
 state.foliageBatches=foliageMeshes.length;state.leaves=leafStats;state.trees=34;state.shrubs=98;

 normal.wrapS=normal.wrapT=THREE.RepeatWrapping;
 const water=new Water(seaGridV155(),{textureWidth:512,textureHeight:512,waterNormals:normal,sunDirection:seaSun,sunColor:0xffc575,waterColor:0x062e2b,distortionScale:.65,fog:true});
 water.userData.coastalWater=true;water.userData.nativeLightingExcluded=true;water.rotation.x=-Math.PI/2;water.position.y=-.15;water.receiveShadow=true;
 water.material.vertexShader=water.material.vertexShader.replace('void main() {',`void main() {vec3 displaced=position;float waveDetail=1.-smoothstep(180.,450.,length(position.xy));displaced.z+=(.13*sin(time*.0666667)+.16*sin((position.x+position.y)*.1485-time*.75)+.09*sin((position.x-position.y)*.233-time*.62))*waveDetail;`).replaceAll('vec4( position, 1.0 )','vec4( displaced, 1.0 )');
 water.material.uniforms.size.value=1.6;
 water.material.fragmentShader=water.material.fragmentShader.replace('vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );','vec3 geometricSeaNormal=normalize(cross(dFdx(worldPosition.xyz),dFdy(worldPosition.xyz)));if(geometricSeaNormal.y<0.)geometricSeaNormal=-geometricSeaNormal;vec3 surfaceNormal=normalize(geometricSeaNormal+vec3(noise.x*.055,0.,noise.y*.055));');
 water.material.fragmentShader=water.material.fragmentShader.replace('sunColor * diffuseLight * 0.3','sunColor * diffuseLight * 0.10').replace('float rf0 = 0.3;','float rf0 = 0.045;')
 .replace('vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight','vec3( 0.012 ) + reflectionSample * 0.70 + reflectionSample * specularLight')
 .replace('sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',`float rippleVariance=max(length(fwidth(surfaceNormal)),.0);float seaDistance=length(worldToEye);surfaceNormal=normalize(mix(surfaceNormal,vec3(0.,1.,0.),smoothstep(80.,850.,seaDistance)*.30));float seaShininess=mix(120.,80.,clamp(rippleVariance*2.,0.,1.));sunLight(surfaceNormal,eyeDirection,seaShininess,1.65,.5,diffuseLight,specularLight);`);
 const solidScans=scene.children.filter(o=>o.name.startsWith('V146 embedded photogrammetric coast'));for(const root of solidScans)root.traverse(o=>{if(o instanceof THREE.Mesh){if(!(o.geometry as any).boundsTree)(o.geometry as any).boundsTree=new MeshBVH(o.geometry,{indirect:true});o.raycast=acceleratedRaycast;}});
 const beachHeightAt=(x:number,z:number)=>{const landY=terrainAt(x,z);groundRay.set(new THREE.Vector3(x,150,z),down);return Math.max(landY,groundRay.intersectObjects(solidScans,true)[0]?.point.y??-100);};
 const depthSize=160,data=new Uint8Array(depthSize*depthSize*4),bedHeights=new Float32Array(depthSize*depthSize);
 for(let y=0;y<depthSize;y++)for(let x=0;x<depthSize;x++){const h=beachHeightAt(-56+x/(depthSize-1)*103,4-y/(depthSize-1)*90),v=Math.round(THREE.MathUtils.clamp((h+6)/40,0,1)*65535),i=(y*depthSize+x)*4;bedHeights[y*depthSize+x]=h;data[i]=v>>8;data[i+1]=v&255;data[i+3]=255;}
 // A below-sea pocket enclosed by dry land is not ocean. Flood only cells connected to the outer sea.
 const connected=new Uint8Array(depthSize*depthSize),queue:number[]=[];const admit=(i:number)=>{if(i<0||i>=connected.length||connected[i]||bedHeights[i]>.36)return;connected[i]=1;queue.push(i);};for(let i=0;i<depthSize;i++){admit(i);admit((depthSize-1)*depthSize+i);admit(i*depthSize);admit(i*depthSize+depthSize-1);}for(let k=0;k<queue.length;k++){const i=queue[k],x=i%depthSize;admit(i-depthSize);admit(i+depthSize);if(x)admit(i-1);if(x<depthSize-1)admit(i+1);}let excludedPockets=0;for(let i=0;i<connected.length;i++){data[i*4+2]=connected[i]?255:0;if(!connected[i]&&bedHeights[i]<.36)excludedPockets++;}
 const map=new THREE.DataTexture(data,depthSize,depthSize);map.needsUpdate=true;map.minFilter=map.magFilter=THREE.LinearFilter;state.shoreDepth={source:'actual current island and scanned shore triangles',samples:depthSize*depthSize,bits:16,seaConnectivity:true,excludedPockets};
 water.material.uniforms.coastHeight={value:map};
 water.material.fragmentShader=water.material.fragmentShader.replace('uniform sampler2D normalSampler;','uniform sampler2D normalSampler;uniform sampler2D coastHeight;')
 .replace('gl_FragColor = vec4( outgoingLight, alpha );',`vec2 shoreUV=vec2((worldPosition.x+56.)/103.,(-worldPosition.z+4.)/90.);
 float noisePattern=.5+.5*sin(worldPosition.x*1.37+sin(worldPosition.z*.79)*2.+time*.8);
 if(all(greaterThan(shoreUV,vec2(0.)))&&all(lessThan(shoreUV,vec2(1.)))){vec3 coastSample=texture2D(coastHeight,shoreUV).rgb;vec2 packedBed=coastSample.rg;float bed=dot(packedBed,vec2(256.,1.))/257.*40.-6.;float tide=.13*sin(time*.0666667);if(coastSample.b<.5||bed>worldPosition.y-.015)discard;float depth=max(.0,-.15+tide-bed);
 float shallow=1.-smoothstep(.18,3.2,depth);outgoingLight=mix(outgoingLight,vec3(.018,.075,.066)+outgoingLight*.62,shallow*.16);
 // Sparse wind-broken wash. No bright isobath/shoreline outline is drawn.
 vec2 washUV=worldPosition.xz;float washPatch=texture2D(normalSampler,washUV*.071+vec2(time*.008,-time*.006)).g;float grain=texture2D(normalSampler,washUV*.31-vec2(time*.021,time*.012)).b;
 float runup=.5+.5*sin(time*1.08-depth*2.0+washPatch*5.8+sin(washUV.x*.12+washUV.y*.17));float wash=smoothstep(.87,.995,runup)*(1.-smoothstep(.20,1.65,depth))*smoothstep(.04,.22,depth);wash*=smoothstep(.60,.82,washPatch)*smoothstep(.43,.71,grain);
 vec3 aerated=outgoingLight*.72+vec3(.16,.18,.155);outgoingLight=mix(outgoingLight,aerated,wash*.30);}
 outgoingLight=mix(outgoingLight,waterColor*.58,.16);gl_FragColor=vec4(outgoingLight,alpha);`);
 const hullWater=shipWaterExclusion(water,boat);
 let lastMirror=-Infinity;const reflect=water.onBeforeRender.bind(water);
 water.onBeforeRender=(...args)=>{if(performance.now()-lastMirror>(integrated?120:16)){lastMirror=performance.now();reflect(...args);}};scene.add(water);

 
 cottageRoot.updateMatrixWorld(true);const cottageBox=new THREE.Box3().setFromObject(cottageRoot).expandByScalar(.4);const collisionRay=new THREE.Raycaster(),testMove=new THREE.Vector3(),testDir=new THREE.Vector3();(collisionRay as any).firstHitOnly=true;
 controls.setCollider((from,to)=>{testMove.copy(to);const ground=terrainAt(to.x,to.z);testMove.y=Math.max(testMove.y,ground+.85,.45);testDir.copy(testMove).sub(from);const distance=testDir.length();if(distance>0){collisionRay.set(from,testDir.normalize());collisionRay.far=distance+.45;const hit=collisionRay.intersectObject(land.scene,true)[0];if(hit&&hit.distance<distance+.4)testMove.copy(from).addScaledVector(testDir,Math.max(0,hit.distance-.5));}if(cottageBox.containsPoint(testMove)&&!cottageBox.containsPoint(from))testMove.copy(from);return testMove;});state.navigation={mode:'free-look / pan / dolly',minimumOrbitRadius:0,groundCollision:true,cottageCollision:true};
 state.worldExplore={doubleClickApproach:true,keyboard:'W A S D / Q E',pan:true};
 const processEntry=cottageProcessEntry(scene,camera,canvas,state.cottage.position,state);
 const beforeLife=new Set(scene.children);const life=await coastalLifeV158(scene,loader,clock,state,camera);for(const object of scene.children)if(!beforeLife.has(object))object.userData.nativeLightingExcluded=true;
 const ueReflection=await attachUECoveReflectionV158(water,boat,state);
 const ueIsland=await attachUEIslandV161([land.scene,cottageRoot,meadow],state);state.updateUEReflection=(night:number)=>{ueReflection.update(night);ueIsland.update(night);};
 const weather=dayNight(scene,renderer,sun,coastalAmbient,skyMaterial,water,boat,state.cottage.position,state);const air=coastalAirV161(scene,sun,windTime,state);
 let combinedCrew:ReturnType<typeof combineAnimatedSkins>|null=null;if(!nativeRequired&&!new URLSearchParams(location.search).has('skipCrew185')){try{combinedCrew=combineAnimatedSkins(newCrew.scene);state.combinedCrew=combinedCrew.audit;}catch(error){state.combinedCrewFailure=String(error);}}
 if(!nativeRequired&&!new URLSearchParams(location.search).has('skipReflection185'))cacheWaterReflection(renderer,scene,water,[boat,...life.birds],state);
 const cc=crewProduction.actors[0].corseletCenter;const captainAnchor=new THREE.Vector3(cc[0]-1,cc[2]+.38,-cc[1]+5.5);state.captainAnchor=captainAnchor.toArray();state.boatBounds=new THREE.Box3().setFromObject(boat).getCenter(new THREE.Vector3()).toArray();
 const poses=[{p:start,t:aim},{p:new THREE.Vector3(29,11,40),t:new THREE.Vector3(1,3,8)},{p:new THREE.Vector3(21,22,13),t:new THREE.Vector3(-12,14,-34)},{p:new THREE.Vector3(site.x+5.5,site.hi+2.7,site.z+7.5),t:new THREE.Vector3(site.x,site.hi+1.8,site.z)},{p:captainAnchor.clone().add(new THREE.Vector3(-3.3,1.5,4.5)),t:captainAnchor.clone()}];
 let dirty=true,pose=0,transition=0,fromP=start.clone(),fromT=aim.clone();controls.addEventListener('change',()=>{dirty=true;wake();});
 function choose(i:number){controls.debug.minDistance=i===3?5:55;controls.debug.maxDistance=i===3?24:88;dirty=true;lastMirror=-Infinity;pose=i;state.viewIndex=i;fromP.copy(camera.position);fromT.copy(controls.target);transition=performance.now();controls.resetInteraction();wake();document.querySelectorAll('[data-coast-view]').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}
 document.querySelectorAll<HTMLButtonElement>('[data-coast-view]').forEach((b,i)=>b.onclick=()=>choose(i));
 canvas.addEventListener('dblclick',e=>{const b=canvas.getBoundingClientRect(),r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),camera);if(r.intersectObject(cottageRoot,true).length)choose(3);else if(r.intersectObject(boat,true).length)choose(1);else{const hit=r.intersectObject(land.scene,true)[0];if(hit){const direction=hit.point.clone().sub(camera.position).normalize(),destination=hit.point.clone().addScaledVector(direction,-4);destination.y=Math.max(destination.y,terrainAt(destination.x,destination.z)+1.7);poses.push({p:destination,t:hit.point.clone().add(new THREE.Vector3(0,1,0))});choose(poses.length-1);}}});
 document.querySelector<HTMLButtonElement>('[data-odyssey-reset]')!.onclick=()=>choose(0);document.querySelector<HTMLButtonElement>('[data-odyssey-house]')!.onclick=()=>choose(3);
 document.querySelector<HTMLButtonElement>('[data-odyssey-pause]')!.onclick=e=>{state.paused=!state.paused;dirty=true;const button=e.currentTarget as HTMLElement;button.setAttribute('aria-pressed',String(state.paused));button.setAttribute('aria-label',state.paused?'继续场景':'暂停场景');button.querySelector('svg')?.setAttribute('viewBox','0 0 24 24');button.querySelector('path')?.setAttribute('d',state.paused?'M8 5l11 7-11 7z':'M9 5v14M15 5v14');wake();};
 controls.addEventListener('start',()=>transition=0);
 let zoomEndAt=0;
 function resize(){dirty=true;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();wake();}
 new ResizeObserver(resize).observe(host);resize();
 let nativeLighting:Awaited<ReturnType<typeof attachBakedLightingV179>>|null=null,leafRadiance:Awaited<ReturnType<typeof applyLeafRadiance186>>|null=null;
 if(!nativeRequired&&new URLSearchParams(location.search).get('nativeLightfield')==='1'){
  const [daySky,nightSky]=await Promise.all(['day','night'].map(mode=>textures.loadAsync('./assets/browser-v179/myth-field/sky-'+mode+'.png')));for(const texture of [daySky,nightSky]){texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=false;texture.minFilter=texture.magFilter=THREE.LinearFilter;}
  skyMaterial.uniforms.nativeDaySky={value:daySky};skyMaterial.uniforms.nativeNightSky={value:nightSky};
  // Keep the sea as real moving water with a live planar reflection. A
  // perspective photograph on this plane leaves rectangular projection seams.
  water.material.uniforms.nativeDaySky={value:daySky};water.material.uniforms.nativeNightSky={value:nightSky};water.material.uniforms.nativeSeaNight=skyMaterial.uniforms.nightFactor;
  water.material.fragmentShader='uniform sampler2D nativeDaySky,nativeNightSky;uniform float nativeSeaNight;\n'+water.material.fragmentShader;
  const waterEnd=water.material.fragmentShader.lastIndexOf('}');
  water.material.fragmentShader=water.material.fragmentShader.slice(0,waterEnd)+`
   float seaLuminance=dot(gl_FragColor.rgb,vec3(.2126,.7152,.0722));
   vec3 maritimeTint=seaLuminance*vec3(.38,1.10,1.12);
   vec3 seaColour=mix(gl_FragColor.rgb,maritimeTint,.65*(1.-nativeSeaNight));
   vec3 horizonLinear=mix(texture2D(nativeDaySky,vec2(0.,.5)).rgb,texture2D(nativeNightSky,vec2(0.,.5)).rgb,nativeSeaNight);
   vec3 horizonColour=linearToOutputTexel(vec4(horizonLinear,1.)).rgb;
   float seaHaze=1.-exp(-pow(length(cameraPosition-worldPosition.xyz)/850.,1.35));
   gl_FragColor.rgb=mix(seaColour,horizonColour,seaHaze);
  `+water.material.fragmentShader.slice(waterEnd);water.material.needsUpdate=true;
  skyMaterial.fragmentShader=`uniform sampler2D nativeDaySky,nativeNightSky;uniform float nightFactor;varying vec3 direction;void main(){vec3 d=normalize(direction);vec2 uv=vec2(clamp(d.y/.25,0.,1.),.5);gl_FragColor=vec4(mix(texture2D(nativeDaySky,uv).rgb,texture2D(nativeNightSky,uv).rgb,nightFactor),1.);\n#include <colorspace_fragment>\n}`;skyMaterial.needsUpdate=true;
  if(new URLSearchParams(location.search).has('leafLambert185')){const converted=new Map<THREE.Material,THREE.Material>();for(const o of[...foliageMeshes,meadow]){const old=o.material as THREE.MeshStandardMaterial;let m=converted.get(old);if(!m){m=new THREE.MeshLambertMaterial({color:old.color,emissive:old.emissive,emissiveIntensity:old.emissiveIntensity,vertexColors:old.vertexColors,map:old.map,alphaMap:old.alphaMap,alphaTest:old.alphaTest,side:old.side,transparent:old.transparent,opacity:old.opacity});m.name=old.name;m.alphaToCoverage=old.alphaToCoverage;m.onBeforeCompile=old.onBeforeCompile;m.customProgramCacheKey=old.customProgramCacheKey;converted.set(old,m);}o.material=m;}state.leafDiffuseVertexLighting=true;}
  nativeLighting=await attachBakedLightingV179(scene,nativeFieldManifest187,state,renderer);nativeLighting.update(camera,1);
  if(new URLSearchParams(location.search).has('nativeLeafRadiance186'))try{leafRadiance=await applyLeafRadiance186(foliageMeshes,state);}catch(error){state.leafRadianceError=String(error);}
 }
 if(!nativeRequired){await renderer.compileAsync(scene,camera);renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);}

 state.renderInventory=sceneRenderInventory(scene);const foliageCull=!nativeRequired&&!new URLSearchParams(location.search).has('skipCulling185')?foliageCulling(foliageMeshes,renderer,camera,state):null;const foliageOrder=!nativeRequired?sortedFoliage(foliageMeshes,camera,state):null;const shadowCache=!nativeRequired&&new URLSearchParams(location.search).get('staticShadows')!=='0'?staticShadowCache(renderer,scene,sun,boat,state):null;shadowCache?.prepare(camera);const foliageDepth=!nativeRequired&&new URLSearchParams(location.search).has('prepass185')?foliageDepthPrepass(renderer,scene,camera,state):null;await foliageDepth?.prepare();state.ready=true;document.querySelector<HTMLButtonElement>('[data-odyssey-night]')?.removeAttribute('disabled');document.querySelector('.odyssey-preparing')?.remove();canvas.style.opacity=nativeRequired?'0':'1';
 if(new URLSearchParams(location.search).has('performanceAudit'))state.auditObjects={T:THREE,scene,water,boat,renderer,camera,foliageMeshes};
 const profile=frameProfile(renderer,state);let last=performance.now(),lastRender=0,time=0,shadowAt=-Infinity,frameHandle=0;const deltaFrames:number[]=[];
 function wake(){if(!state.ready||frameHandle||document.hidden||document.body.classList.contains('portfolio-surface-suspended'))return;frameHandle=requestAnimationFrame(render);state.scheduled=true;}
 function render(now:number){frameHandle=0;state.scheduled=false;if(document.hidden||document.body.classList.contains('portfolio-surface-suspended')){last=now;return;}if(state.paused&&!transition&&!controls.dragging&&!dirty&&!weather.changing)return;const frameStarted=profile.begin();
  dirty=false;const wallDelta=THREE.MathUtils.clamp((now-last)/1000,0,.25),dt=Math.min(wallDelta,.1);last=now;if(!state.paused)time+=wallDelta;
  if(!state.paused)crewMixer.update(dt);windTime.value=time;weather.update(dt,time);if(state.nativeGroundNight)state.nativeGroundNight.value=state.nightMix||0;clock.value=time;skyClock.value=time;life.update(time);state.coastClock.value=time;state.waterTime=time;heave=THREE.MathUtils.damp(heave,seaHeight(-1,13.5,time),1.8,dt);const pitch=THREE.MathUtils.clamp((seaHeight(6,13.5,time)-seaHeight(-8,13.5,time))/14,-.022,.022),roll=THREE.MathUtils.clamp(-(seaHeight(-1,15,time)-seaHeight(-1,12,time))/3,-.026,.026);boat.rotation.z=THREE.MathUtils.damp(boat.rotation.z,pitch,1.6,dt);boat.rotation.x=THREE.MathUtils.damp(boat.rotation.x,roll,1.6,dt);boat.position.copy(floatPivot).sub(rotatedPivot.copy(floatPivot).applyQuaternion(boat.quaternion));boat.position.y+=heave;hullWater.update();mergedCrew.update();combinedCrew?.update();crewBatches.update();state.buoyancy={heave,roll:boat.rotation.x,pitch:boat.rotation.z,source:'same sea wave sampled at bow/stern and port/starboard; damped around waterline pivot'};water.material.uniforms.time.value=time*.6;
  if(transition){const u=THREE.MathUtils.smoothstep((now-transition)/1200,0,1);camera.position.lerpVectors(fromP,poses[pose].p,u);controls.target.lerpVectors(fromT,poses[pose].t,u);if(u>=1)transition=0;}
  controls.update();foliageCull?.before();foliageOrder?.update();state.cameraTarget=controls.lookTarget.toArray();state.cameraSettled=!transition;processEntry.update();renderer.shadowMap.needsUpdate=!state.paused||weather.changing;if(renderer.shadowMap.needsUpdate)shadowAt=time;state.shadowPolicy='4096 PCF / synchronized animated shadows';
  shadowCache?.use(weather.changing);air.update(state.nightMix??0);nativeLighting?.update(camera,1-(state.nightMix??0));leafRadiance?.update(state.nightMix||0);if(!nativeRequired){const draw=()=>{if(postAA)postAA.render(scene,camera,()=>foliageCull?.after(now));else renderer.render(scene,camera);};if(foliageDepth)foliageDepth.render(draw);else draw();}canvas.style.opacity=nativeRequired?'0':'1';state.frames++;state.calls=renderer.info.render.calls;state.triangles=renderer.info.render.triangles;state.camera=camera.position.toArray();profile.end(frameStarted);if(!postAA)foliageCull?.after(now);
  if(lastRender)deltaFrames.push(now-lastRender);if(deltaFrames.length>120)deltaFrames.shift();state.fps=1000/(deltaFrames.reduce((a,b)=>a+b,0)/deltaFrames.length);lastRender=now;
  if(!state.paused||transition||controls.dragging||dirty||weather.changing)wake();
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameHandle);frameHandle=0;state.scheduled=false;}else{last=performance.now();dirty=true;wake();}});
 new MutationObserver(()=>{if(document.body.classList.contains('portfolio-surface-suspended')){cancelAnimationFrame(frameHandle);frameHandle=0;state.scheduled=false;}else{last=performance.now();dirty=true;wake();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.querySelector('[data-odyssey-night]')?.addEventListener('click',()=>{dirty=true;wake();});wake();
 if(!nativeRequired)graphicsRecovery(renderer,host,state,async()=>{await renderer.compileAsync(scene,camera);shadowCache?.prepare(camera);renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);last=performance.now();dirty=true;wake();},'./assets/native-v167/myth.jpg','Preparing the cove…');
 if(bakeCapture)state.exportNativeBake=()=>captureLightingV179(renderer,scene,camera,state.nativeController?.layer.querySelector('video'),'myth');
 state.exportCraft=async()=>{const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');const out=new THREE.Group();out.add(cottageRoot.clone(true));const mg=new THREE.Group();mg.name='V161 physical coastal grasses';const matrix=new THREE.Matrix4();const parts:THREE.BufferGeometry[]=[];for(let i=0;i<meadow.count;i++){meadow.getMatrixAt(i,matrix);const g=meadow.geometry.clone().applyMatrix4(matrix);const color=g.getAttribute('color'),tint=new THREE.Color();meadow.getColorAt(i,tint);for(let j=0;j<color.count;j++)color.setXYZ(j,color.getX(j)*tint.r,color.getY(j)*tint.g,color.getZ(j)*tint.b);parts.push(g);}const g=mergeGeometries(parts,false)!;parts.forEach(p=>p.dispose());const m=(meadow.material as THREE.MeshStandardMaterial).clone();m.onBeforeCompile=()=>{};mg.add(new THREE.Mesh(g,m));out.add(mg);out.updateMatrixWorld(true);const binary=await new GLTFExporter().parseAsync(out,{binary:true,onlyVisible:true}) as ArrayBuffer;return binary;};
 state.browserMigration={qualityApproved:false,originalPreserved:true,sourceHDR:'same Venice sunset HDR as UE',nativeKey:[1,.69,.36],nativeSun:9.5,displayCalibration:'ACES pilot / comparison required'};state.inspectLighting=()=>({sun:{intensity:sun.intensity,color:sun.color.getHexString(),position:sun.position.toArray()},ambient:coastalAmbient.intensity,environment:scene.environmentIntensity,exposure:renderer.toneMappingExposure,sky:skyMaterial.fragmentShader});state.materials=()=>{const out:any[]=[];scene.traverse(o=>{if(o instanceof THREE.Mesh)out.push({name:o.name,mat:(o.material as any).name,type:(o.material as any).type,color:(o.material as any).color?.getHexString(),triangles:o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3});});return out;};
 state.inspectCamera=(p:number[],t:number[])=>{transition=0;pose=3;state.viewIndex=3;camera.position.fromArray(p);controls.target.fromArray(t);controls.update();dirty=true;wake();};state.capture=()=>{renderer.render(scene,camera);return canvas.toDataURL();};state.view=choose;
 window.addEventListener('portfolio:child-return',()=>{zoomEndAt=0;last=performance.now();dirty=true;controls.resetInteraction();wake();});
 state.crewRefit={actors:14,armor:true,source:'actual local Blender GLB',independentBreathing:true,closedFootwear:true,animatedMaterials:animatedMaterials.size,stages:'actual native reassembly'};state.components={sea:true,ship:true,crew:true,island:true,trees:foliageMeshes.length>0,shrubs:foliageMeshes.length>0,shoreline:true};state.readyAt=performance.now();window.dispatchEvent(new Event("portfolio:progress"));
}
boot().catch(error=>{state.error=String(error);console.error(error);const p=document.querySelector('.odyssey-preparing p');if(p)p.textContent='场景准备未完成，请刷新重试';});


