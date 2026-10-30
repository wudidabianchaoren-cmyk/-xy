import{cottageProcessEntry}from'./odyssey-process-entry-v143';
import{sailWind,foliageWind,dayNight}from'./odyssey-weather-v142';
import{crewAttributes,animateCrewMaterial}from'./crew-motion-v142';
import {shipWaterExclusion} from './ship-water-exclusion-v143';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';

import {Water} from 'three/addons/objects/Water.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createOdysseyControlsV118} from './odyssey-controls-v118';
import {makeGroundPBRV118} from './odyssey-ground-v118';

const host=document.getElementById('odysseyScene')!,canvas=host.querySelector('canvas')!;
const state:any={version:143,ready:false,frames:0,giant:false,ships:1,scope:'compact coastal cove',native:'blender/mythology-v32-142/fitted-crew-and-ship.blend',renderer:'Three.js / actual CUDA diffuse GI / full individual leaves',paused:false};
(window as any).odysseyState=state;

async function boot(){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');
 state.gpu=ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'';
 const integrated=/Intel|Iris|UHD|SwiftShader/i.test(state.gpu);state.integrated=integrated;
 renderer.setPixelRatio(Math.min(devicePixelRatio,integrated?1:1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=1.0;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
 const windTime={value:0};const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xb4a58b,.0013);
 const camera=new THREE.PerspectiveCamera(34,1,.15,5000),controls=createOdysseyControlsV118(camera,canvas);
 const start=new THREE.Vector3(37,17,49),aim=new THREE.Vector3(-6,9,-16);
 camera.position.copy(start);controls.target.copy(aim);controls.update();
 const sunDirection=new THREE.Vector3(-.76,.56,.32).normalize();
 const sun=new THREE.DirectionalLight(0xffe2c2,2.8);sun.target.position.set(-7,8,-20);sun.position.copy(sun.target.position).addScaledVector(sunDirection,120);
 sun.castShadow=true;sun.shadow.mapSize.set(integrated?2048:4096,integrated?2048:4096);
 Object.assign(sun.shadow.camera,{left:-60,right:60,top:58,bottom:-58,near:1,far:230});sun.shadow.normalBias=.022;sun.shadow.bias=-.00008;
 const coastalAmbient=new THREE.HemisphereLight(0xa7bac5,0x3d382b,.50);scene.add(sun,sun.target,coastalAmbient);
 const loader=new GLTFLoader(),textures=new THREE.TextureLoader(),folder='./assets/odyssey/compact-v134/';
 const [land,rocks,ship,vegetation,placements,hdr,normal,heightData,islandRadiance,rockRadiance,closedCliffs,grass,rockPBR,soilPhoto]=await Promise.all([
  loader.loadAsync(folder+'island.glb'),loader.loadAsync(folder+'rocks.glb'),loader.loadAsync('./assets/odyssey/refit-v143/armed-ship.glb'),loader.loadAsync(folder+'vegetation.glb'),
  fetch(folder+'vegetation.json').then(r=>r.json()),new RGBELoader().loadAsync('./assets/odyssey/venice_sunset_1k.hdr'),textures.loadAsync('./assets/odyssey/waternormals.jpg'),fetch(folder+'height.json').then(r=>r.json()),
  new RGBELoader().loadAsync('./assets/odyssey/lightmaps-v143/island-radiance.hdr'),new RGBELoader().loadAsync('./assets/odyssey/lightmaps-v143/rocks-radiance.hdr'),
  loader.loadAsync('./blender/mythology-v32-118/cliffs-v118.glb'),loader.loadAsync(folder+'grass.glb'),makeGroundPBRV118(),textures.loadAsync('./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg')
 ]);
 const lowerShore=(h:number)=>h-.65*(1-THREE.MathUtils.smoothstep(h,-.3,.75));
 heightData.heights=heightData.heights.map(lowerShore);
 land.scene.updateMatrixWorld(true);land.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const p=o.geometry.getAttribute('position'),q=new THREE.Vector3(),inv=o.matrixWorld.clone().invert();for(let i=0;i<p.count;i++){q.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);q.y=lowerShore(q.y);q.applyMatrix4(inv);p.setXYZ(i,q.x,q.y,q.z);}p.needsUpdate=true;o.geometry.computeVertexNormals();});
 state.shorelineFix='terrain extends beneath troughs; wet-foot irradiance no longer crushed to black';
 soilPhoto.colorSpace=THREE.SRGBColorSpace;soilPhoto.wrapS=soilPhoto.wrapT=THREE.RepeatWrapping;soilPhoto.anisotropy=8;
 const crewProduction=await fetch('./assets/odyssey/refit-v143/production.json').then(r=>r.json());
 const wovenNormal=await textures.loadAsync('./assets/odyssey/rough_linen/rough_linen_nor_gl_1k.jpg');wovenNormal.flipY=false;wovenNormal.wrapS=wovenNormal.wrapT=THREE.RepeatWrapping;wovenNormal.repeat.set(5,5);wovenNormal.anisotropy=8;
 const pmrem=new THREE.PMREMGenerator(renderer);hdr.mapping=THREE.EquirectangularReflectionMapping;
 scene.environment=pmrem.fromEquirectangular(hdr).texture;scene.environmentIntensity=.28;pmrem.dispose();

 // Restore the incumbent maritime sky: real HDR upper sky plus restrained drifting clouds.
 const skyClock={value:0},seaSun=new THREE.Vector3(-45,35,-160).normalize();
 const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{map:{value:hdr},time:skyClock,sun:{value:seaSun}},
 vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D map;uniform float time;uniform vec3 sun;varying vec3 direction;
 float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=noise(p)*a;p=p*2.03+vec2(13.1,7.3);a*=.5;}return v;}
 void main(){vec3 d=normalize(direction);float h=pow(max(0.,1.-abs(d.y)),5.);float g=pow(max(dot(d,sun),0.),32.);
 vec3 top=vec3(.026,.058,.063),horizon=vec3(.73,.34,.075);vec3 clear=mix(top,horizon,h);clear+=vec3(1.3,.70,.18)*g*3.2;
 vec2 drift=vec2(d.x*4.+d.z*2.+time*.003,d.y*10.);float cloud=fbm(drift+vec2(1.,3.))+fbm(drift*2.2)*.13;
 float mass=smoothstep(.44,.73,cloud),rim=smoothstep(.42,.52,cloud)*(1.-smoothstep(.52,.69,cloud));
 vec3 clouds=mix(vec3(.018,.033,.038),vec3(.28,.16,.065),h*.56+g*.44);vec3 sky=mix(clear,clouds,mass*.84);sky+=vec3(.43,.22,.047)*rim*(g+.11)*h;
 vec2 uv=vec2(atan(d.z,d.x)/6.2831853+.5,.62+max(d.y,0.)*.34);sky=mix(sky,texture2D(map,uv).rgb*.28,.035);
 gl_FragColor=vec4(sky,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 scene.add(new THREE.Mesh(new THREE.SphereGeometry(2400,48,24),skyMaterial));

 // The linear-light native diffuse bake includes grounded vegetation and GI, not a screenshot plane.
 let bakeMeshes=0;
 for(const root of [land.scene,rocks.scene]){
  root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
   const radiance=root===land.scene?islandRadiance:rockRadiance;
   radiance.anisotropy=8;radiance.colorSpace=THREE.LinearSRGBColorSpace;radiance.flipY=false;radiance.repeat.y=1;radiance.offset.y=0;
   radiance.channel=root===land.scene?1:0;radiance.generateMipmaps=true;radiance.minFilter=THREE.LinearMipmapLinearFilter;
   const material=new THREE.MeshBasicMaterial({map:radiance,color:root===land.scene?0xebebe4:0xc0c6c5,fog:true});
   if(root===land.scene){material.onBeforeCompile=s=>{s.uniforms.soilPhoto={value:soilPhoto};
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCoastWorld;varying vec3 vCoastNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvCoastWorld=(modelMatrix*vec4(transformed,1.)).xyz;vCoastNormal=normalize(mat3(modelMatrix)*normal);');
    s.fragmentShader=s.fragmentShader.replace('texture2D( map, vMapUv )','texture2D( map, vMapUv, 1.2 )').replace('#include <common>','#include <common>\nuniform sampler2D soilPhoto;varying vec3 vCoastWorld;varying vec3 vCoastNormal;').replace('#include <map_fragment>',`#include <map_fragment>
    float h=vCoastWorld.y;float slope=1.-abs(normalize(vCoastNormal).y);
    float variation=.5+.5*sin(vCoastWorld.x*.17+sin(vCoastWorld.z*.21)*2.5);
    float soil=smoothstep(3.,7.,h)*(1.-smoothstep(.25,.62,slope))*(.65+.35*variation);
    float soilDetail=clamp(dot(texture2D(soilPhoto,vCoastWorld.xz*.28).rgb,vec3(.2126,.7152,.0722))*3.2,.82,1.12);
    diffuseColor.rgb*=mix(vec3(.65,.70,.68),vec3(.23,.31,.15)*soilDetail,soil*.84);
    diffuseColor.rgb*=mix(.78,1.,smoothstep(-.65,1.2,h));float sandMask=(1.-smoothstep(1.0,2.3,h))*(1.-smoothstep(.20,.55,slope));float luma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.39,.40,.35)+diffuseColor.rgb*.18,sandMask*.58);float rockCalm=smoothstep(.3,.75,slope);diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(luma),diffuseColor.rgb,.45),rockCalm*.45);`);
   };material.customProgramCacheKey=()=> 'v142-quiet-native-irradiance-biome';}
   o.material=material;o.castShadow=true;o.receiveShadow=false;bakeMeshes++;
  });scene.add(root);
 }
 state.nativeBakedSurfaces=bakeMeshes;state.islandRadianceResolution=2048;
 // Closed incumbent boulders, with the original photographic PBR and world-space grain.
 rockPBR.aoMap=null;const rockCompile=rockPBR.onBeforeCompile;
 rockPBR.onBeforeCompile=(s,r)=>{rockCompile.call(rockPBR,s,r);s.fragmentShader=s.fragmentShader.replace('vec3(3.8,3.7,3.25)','vec3(2.4,2.4,2.2)');};rockPBR.customProgramCacheKey=()=> 'v134-closed-coastal-rock';
 function rockGeometry(g:THREE.BufferGeometry){const geometry=g.clone(),habitat=new Float32Array(geometry.attributes.position.count*3);for(let i=2;i<habitat.length;i+=3)habitat[i]=1;geometry.setAttribute('habitat',new THREE.BufferAttribute(habitat,3));return geometry;}
 let prototype:THREE.Mesh|undefined;closedCliffs.scene.traverse(o=>{if(!prototype&&o instanceof THREE.Mesh&&/closed[ _]coastal[ _]boulder/.test(o.name))prototype=o;});
 if(prototype){const base=rockGeometry(prototype.geometry);base.computeBoundingBox();const center=base.boundingBox!.getCenter(new THREE.Vector3()),extent=base.boundingBox!.getSize(new THREE.Vector3());base.translate(-center.x,-center.y,-center.z);
 for(const [i,[x,y,z,w,h,d]]of [[-27,.7,-22,6.8,5.5,4.7],[-16,.3,-15,6.2,4.3,4.4],[5,0,-18,5,3.4,3.9],[20,.2,-31,6.2,5.5,4.4],[-35,-.5,-34,7.8,6,6],[27,-.3,-42,6,4.5,5]].entries()){
  const cliff=new THREE.Mesh(base,rockPBR);cliff.position.set(x,y,z);cliff.rotation.y=i*.71;cliff.scale.set(w/extent.x,h/extent.y,d/extent.z);cliff.castShadow=cliff.receiveShadow=true;scene.add(cliff);
 }}
 state.closedCoastalBoulders=6;
 grass.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const m=new THREE.MeshStandardMaterial({color:0x6d7443,roughness:.96,side:THREE.DoubleSide});o.material=m;o.receiveShadow=true;o.castShadow=false;});scene.add(grass.scene);state.coastalGrass=true;

 ship.scene.updateMatrixWorld(true);
 const groups=new Map<THREE.Material,THREE.BufferGeometry[]>(),animatedMaterials=new Set<THREE.Material>();
 ship.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.length!==1)return;
  let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);
  for(const name of Object.keys(g.attributes))if(!['position','normal','uv'].includes(name))g.deleteAttribute(name);
  if(!g.getAttribute('uv'))g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));
  if(crewAttributes(g,o,crewProduction.actors))animatedMaterials.add(mats[0]);
  if(/linen sail|sailcloth/i.test(mats[0].name)){
   const uv=g.getAttribute('uv');let loX=Infinity,loY=Infinity,hiX=-Infinity,hiY=-Infinity;for(let i=0;i<uv.count;i++){loX=Math.min(loX,uv.getX(i));hiX=Math.max(hiX,uv.getX(i));loY=Math.min(loY,uv.getY(i));hiY=Math.max(hiY,uv.getY(i));}
   const coords=new Float32Array(uv.count*2);for(let i=0;i<uv.count;i++){coords[i*2]=(uv.getX(i)-loX)/(hiX-loX||1);coords[i*2+1]=(uv.getY(i)-loY)/(hiY-loY||1);}g.setAttribute('sailWindUV',new THREE.BufferAttribute(coords,2));state.sailWindPieces=(state.sailWindPieces||0)+1;
  }
  const list=groups.get(mats[0])||[];list.push(g);groups.set(mats[0],list);
 });
 const boat=new THREE.Group(),clock={value:0},floatPivot=new THREE.Vector3(0,0,8),rotatedPivot=new THREE.Vector3();let boatTriangles=0,heave=0;
 const seaHeight=(x:number,z:number,t:number)=>.16*Math.sin((x-z)*.1485-t*.45)+.09*Math.sin((x+z)*.233-t*.372);
 for(const [mat,parts]of groups){const geometry=mergeGeometries(parts,false);if(!geometry)continue;const mesh=new THREE.Mesh(geometry,mat);
  mesh.castShadow=true;mesh.receiveShadow=true;boat.add(mesh);boatTriangles+=geometry.attributes.position.count/3;parts.forEach(g=>g.dispose());
  if(animatedMaterials.has(mat)){animateCrewMaterial(mat,windTime);const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking});animateCrewMaterial(depth,windTime);mesh.customDepthMaterial=depth;}
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
   if(/V142 wool|V142 quilted flax/.test(mat.name)){mat.normalMap=wovenNormal;mat.normalScale.set(.14,.14);mat.roughness=.94;mat.envMapIntensity=.24;}
   if(/armor|bronze bowl|armor edges/i.test(mat.name)){if(!/linen|leather/.test(mat.name)){mat.metalness=.82;mat.roughness=.46;mat.envMapIntensity=.72;}}
   if(/linen sail|sailcloth/i.test(mat.name)){mat.color.multiply(new THREE.Color(0xffefd3));sailWind(mat,windTime);const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});depth.onBeforeCompile=(shader:any)=>{shader.uniforms.windTime=windTime;shader.vertexShader=shader.vertexShader.replace("#include <common>","#include <common>\nuniform float windTime;attribute vec2 sailWindUV;").replace("#include <begin_vertex>","#include <begin_vertex>\nfloat pin=pow(max(0.,sin(sailWindUV.x*3.14159265)),.8)*max(0.,sin(sailWindUV.y*3.14159265));transformed+=vec3(.7071,0.,.7071)*pin*(1.20*(1.05+.24*sin(windTime*.63)+.10*sin(windTime*1.19))+.035*sin(windTime*2.1+position.y*2.2+position.x*.7));transformed.y-=pin*.025*(1.+sin(windTime*.63));");};mesh.customDepthMaterial=depth;}
  }
 }
 scene.add(boat);state.boatBatches=groups.size;state.boatTriangles=boatTriangles;
 // A small native stone cottage occupies a sampled existing clearing; the main island is preserved.
 const cottage=await loader.loadAsync('./assets/odyssey/refit-v138/coastal-cottage.glb');
 cottage.scene.updateMatrixWorld(true);const houseGroups=new Map<THREE.Material,THREE.BufferGeometry[]>();
 cottage.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const m=Array.isArray(o.material)?o.material[0]:o.material;let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);for(const n of Object.keys(g.attributes))if(!['position','normal','uv'].includes(n))g.deleteAttribute(n);if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const all=houseGroups.get(m)||[];all.push(g);houseGroups.set(m,all);});
 const cottageMeshes:THREE.Mesh[]=[],cottageRoot=new THREE.Group();scene.add(cottageRoot);
 const wallDetail=await textures.loadAsync('./assets/odyssey/rock_boulder_cracked_diff_1k.jpg');wallDetail.colorSpace=THREE.SRGBColorSpace;wallDetail.wrapS=wallDetail.wrapT=THREE.RepeatWrapping;wallDetail.anisotropy=8;
 for(const[m,all]of houseGroups){const g=mergeGeometries(all,false);if(!g)continue;const mesh=new THREE.Mesh(g,m);mesh.castShadow=mesh.receiveShadow=true;cottageRoot.add(mesh);cottageMeshes.push(mesh);all.forEach(g=>g.dispose());
  if(m instanceof THREE.MeshStandardMaterial&&/limestone|limewash/i.test(m.name)){m.roughness=.94;m.envMapIntensity=.16;m.onBeforeCompile=s=>{s.uniforms.cottageStone={value:wallDetail};s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 houseP;').replace('#include <begin_vertex>','#include <begin_vertex>\nhouseP=(modelMatrix*vec4(transformed,1.)).xyz;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D cottageStone;varying vec3 houseP;').replace('#include <color_fragment>',`#include <color_fragment>
   vec3 weather=texture2D(cottageStone,(houseP.xy+houseP.zy)*.63).rgb;float relief=dot(weather,vec3(.2126,.7152,.0722));diffuseColor.rgb*=mix(.69,1.15,clamp(relief*2.,0.,1.));`);};m.customProgramCacheKey=()=> 'v138-weathered-lime-stone';}
 }
 // Use the actual rendered island triangles for placement. The old sampled height field
 // is a water-depth proxy and is not precise enough to ground an architectural object.
 land.scene.updateMatrixWorld(true);const groundRay=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);
 const terrainAt=(x:number,z:number)=>{groundRay.set(new THREE.Vector3(x,150,z),down);return groundRay.intersectObject(land.scene,true)[0]?.point.y??-100;};
 const candidates:any[]=[];for(let x=-18;x<=20;x+=2)for(let z=-28;z>=-56;z-=2){const heights=[[-2.7,-2.2],[2.7,-2.2],[-2.7,2.2],[2.7,2.2],[0,0]].map(([dx,dz])=>terrainAt(x+dx,z+dz));const lo=Math.min(...heights),hi=Math.max(...heights);const treeDistance=Math.min(...placements.filter((p:any)=>p.scale[0]>3.2).map((p:any)=>Math.hypot(p.position[0]-x,p.position[2]-z)));if(lo>6&&hi-lo<1.65&&treeDistance>4.8)candidates.push({x,z,heights,lo,hi,treeDistance,score:(hi-lo)*6+Math.abs(x-8)*.05+Math.abs(z+38)*.04});}
 candidates.sort((a,b)=>a.score-b.score);const site=candidates[0];if(!site)throw Error('No grounded clear cottage site found');
 const houseMeta=await fetch('./assets/odyssey/refit-v138/house.json').then(r=>r.json());cottageRoot.position.set(site.x-houseMeta.position[0],site.hi-.10-houseMeta.position[1],site.z-houseMeta.position[2]);
 state.cottage={native:'blender/mythology-v32-138/coastal-cottage.blend',batches:cottageMeshes.length,grounded:true,terrainSource:'actual rendered island triangle raycast',position:[site.x,site.hi-.10,site.z],site,translation:cottageRoot.position.toArray(),design:'limestone / oak / individually curved clay tiles'};


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
  if(index===2){material.map=leafColor;material.alphaMap=leafAlpha;material.alphaTest=.32;material.alphaToCoverage=true;material.transparent=false;material.depthWrite=true;material.opacity=1;material.color.setRGB(1.15,1.25,1.02);material.normalMap=null;material.roughnessMap=null;material.metalnessMap=null;material.metalness=0;material.onBeforeCompile=s=>{s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>','outgoingLight+=diffuseColor.rgb*.12;\n#include <opaque_fragment>');};material.customProgramCacheKey=()=> 'v134-leaf-translucency';}
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
 const water=new Water(new THREE.PlaneGeometry(6000,6000,240,240),{textureWidth:integrated?512:1024,textureHeight:integrated?512:1024,waterNormals:normal,sunDirection:seaSun,sunColor:0xffc575,waterColor:0x062e2b,distortionScale:4.2,fog:true});
 water.rotation.x=-Math.PI/2;water.position.y=-.15;water.receiveShadow=true;
 water.material.vertexShader=water.material.vertexShader.replace('void main() {',`void main() {vec3 displaced=position;float waveDetail=1.-smoothstep(180.,450.,length(position.xy));displaced.z+=(.16*sin((position.x+position.y)*.1485-time*.75)+.09*sin((position.x-position.y)*.233-time*.62))*waveDetail;`).replaceAll('vec4( position, 1.0 )','vec4( displaced, 1.0 )');
 water.material.fragmentShader=water.material.fragmentShader.replace('float rf0 = 0.3;','float rf0 = 0.045;')
 .replace('vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight','vec3( 0.012 ) + reflectionSample * 0.70 + reflectionSample * specularLight')
 .replace('sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',`float rippleVariance=max(length(fwidth(surfaceNormal)),.0);float seaDistance=length(worldToEye);surfaceNormal=normalize(mix(surfaceNormal,vec3(0.,1.,0.),smoothstep(80.,850.,seaDistance)*.78));float seaShininess=mix(42.,12.,clamp(rippleVariance*2.,0.,1.));sunLight(surfaceNormal,eyeDirection,seaShininess,.58,.5,diffuseLight,specularLight);`);
 const data=new Uint8Array(heightData.heights.length*4);heightData.heights.forEach((h:number,i:number)=>{data[i*4]=THREE.MathUtils.clamp((h+6)/40*255,0,255);data[i*4+3]=255;});
 const map=new THREE.DataTexture(data,heightData.size,heightData.size);map.needsUpdate=true;map.minFilter=map.magFilter=THREE.LinearFilter;
 water.material.uniforms.coastHeight={value:map};
 water.material.fragmentShader=water.material.fragmentShader.replace('uniform sampler2D normalSampler;','uniform sampler2D normalSampler;uniform sampler2D coastHeight;')
 .replace('gl_FragColor = vec4( outgoingLight, alpha );',`vec2 shoreUV=vec2((worldPosition.x+56.)/103.,(-worldPosition.z+4.)/90.);
 float noisePattern=.5+.5*sin(worldPosition.x*1.37+sin(worldPosition.z*.79)*2.+time*.8);
 if(all(greaterThan(shoreUV,vec2(0.)))&&all(lessThan(shoreUV,vec2(1.)))){float bed=texture2D(coastHeight,shoreUV).r*40.-6.;float depth=max(.0,-.15-bed);
 float shallow=1.-smoothstep(.25,4.0,depth);outgoingLight=mix(outgoingLight,vec3(.025,.16,.13)+outgoingLight*.5,shallow*.28);
 float foam=(1.-smoothstep(.03,.55,depth))*smoothstep(.35,.88,noisePattern);outgoingLight=mix(outgoingLight,vec3(.54,.59,.49),foam*.38);}
 outgoingLight=mix(outgoingLight,waterColor*.58,.34);gl_FragColor=vec4(outgoingLight,alpha);`);
 const hullWater=shipWaterExclusion(water,boat);
 let lastMirror=-Infinity;const reflect=water.onBeforeRender.bind(water);
 water.onBeforeRender=(...args)=>{if(performance.now()-lastMirror>(integrated?180:65)){lastMirror=performance.now();reflect(...args);}};scene.add(water);

 const processEntry=cottageProcessEntry(scene,camera,canvas,state.cottage.position,state);
 const weather=dayNight(scene,renderer,sun,coastalAmbient,skyMaterial,water,boat,state.cottage.position,state);
 const captainAnchor=new THREE.Vector3();ship.scene.traverse(o=>{if(/captain.*base003$/.test(o.name))o.getWorldPosition(captainAnchor);});captainAnchor.add(new THREE.Vector3(-1,.95,5.5));state.captainAnchor=captainAnchor.toArray();state.boatBounds=new THREE.Box3().setFromObject(boat).getCenter(new THREE.Vector3()).toArray();
 const poses=[{p:start,t:aim},{p:new THREE.Vector3(29,11,40),t:new THREE.Vector3(1,3,8)},{p:new THREE.Vector3(21,22,13),t:new THREE.Vector3(-12,14,-34)},{p:new THREE.Vector3(site.x+10,site.hi+7,site.z+16),t:new THREE.Vector3(site.x,site.hi+1.8,site.z)},{p:captainAnchor.clone().add(new THREE.Vector3(-3.3,1.5,4.5)),t:captainAnchor.clone()}];
 let dirty=true,pose=0,transition=0,fromP=start.clone(),fromT=aim.clone();controls.addEventListener('change',()=>dirty=true);
 function choose(i:number){dirty=true;lastMirror=-Infinity;pose=i;state.viewIndex=i;fromP.copy(camera.position);fromT.copy(controls.target);transition=performance.now();controls.resetInteraction();document.querySelectorAll('[data-coast-view]').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}
 document.querySelectorAll<HTMLButtonElement>('[data-coast-view]').forEach((b,i)=>b.onclick=()=>choose(i));
 document.querySelector<HTMLButtonElement>('[data-odyssey-reset]')!.onclick=()=>choose(0);
 document.querySelector<HTMLButtonElement>('[data-odyssey-pause]')!.onclick=e=>{state.paused=!state.paused;dirty=true;const button=e.currentTarget as HTMLElement;button.setAttribute('aria-pressed',String(state.paused));button.setAttribute('aria-label',state.paused?'继续场景':'暂停场景');button.querySelector('svg')?.setAttribute('viewBox','0 0 24 24');button.querySelector('path')?.setAttribute('d',state.paused?'M8 5l11 7-11 7z':'M9 5v14M15 5v14');};
 controls.addEventListener('start',()=>transition=0);
 let zoomEndAt=0;
 canvas.addEventListener('wheel',e=>{e.preventDefault();const offset=camera.position.clone().sub(controls.target),distance=offset.length(),limit=pose===0?155:85,next=THREE.MathUtils.clamp(distance*Math.exp(e.deltaY*.00035),pose===0?75:18,limit);
  if(e.deltaY>0&&distance>=limit-.01){if(!zoomEndAt)zoomEndAt=performance.now();else if(performance.now()-zoomEndAt>650)(window as any).portfolioReturn?.();}else zoomEndAt=0;
  state.zoomEndReady=!!zoomEndAt;state.zoomProgress=(next-(pose===0?75:18))/(limit-(pose===0?75:18));window.dispatchEvent(new Event("portfolio:progress"));offset.multiplyScalar(next/distance);camera.position.copy(controls.target).add(offset);controls.update();dirty=true;transition=0;},{passive:false});
 function resize(){dirty=true;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(host);resize();
 await renderer.compileAsync(scene,camera);renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
 state.ready=true;document.querySelector<HTMLButtonElement>('[data-odyssey-night]')?.removeAttribute('disabled');document.querySelector('.odyssey-preparing')?.remove();canvas.style.opacity='1';
 let last=performance.now(),lastRender=0,time=0,shadowAt=-Infinity;const deltaFrames:number[]=[];
 function render(now:number){requestAnimationFrame(render);if(document.hidden||document.body.classList.contains('portfolio-surface-suspended')){last=now;return;}if(state.paused&&!transition&&!controls.dragging&&!dirty&&!weather.changing)return;if(now-lastRender<(integrated?30:16))return;
  dirty=false;const dt=THREE.MathUtils.clamp((now-last)/1000,0,.05);last=now;if(!state.paused)time+=dt;
  windTime.value=time;weather.update(dt,time);clock.value=time;skyClock.value=time;heave=THREE.MathUtils.damp(heave,seaHeight(-1,13.5,time),1.8,dt);const pitch=THREE.MathUtils.clamp((seaHeight(6,13.5,time)-seaHeight(-8,13.5,time))/14,-.022,.022),roll=THREE.MathUtils.clamp(-(seaHeight(-1,15,time)-seaHeight(-1,12,time))/3,-.026,.026);boat.rotation.z=THREE.MathUtils.damp(boat.rotation.z,pitch,1.6,dt);boat.rotation.x=THREE.MathUtils.damp(boat.rotation.x,roll,1.6,dt);boat.position.copy(floatPivot).sub(rotatedPivot.copy(floatPivot).applyQuaternion(boat.quaternion));boat.position.x-=1;boat.position.y+=heave;boat.position.z+=5.5;hullWater.update();state.buoyancy={heave,roll:boat.rotation.x,pitch:boat.rotation.z,source:'same sea wave sampled at bow/stern and port/starboard; damped around waterline pivot'};water.material.uniforms.time.value=time*.6;
  if(transition){const u=THREE.MathUtils.smoothstep((now-transition)/1200,0,1);camera.position.lerpVectors(fromP,poses[pose].p,u);controls.target.lerpVectors(fromT,poses[pose].t,u);if(u>=1)transition=0;}
  controls.update();state.cameraTarget=controls.target.toArray();state.cameraSettled=!transition;processEntry.update();if(time-shadowAt>.25){renderer.shadowMap.needsUpdate=true;shadowAt=time;}
  renderer.info.reset();renderer.render(scene,camera);state.frames++;state.calls=renderer.info.render.calls;state.triangles=renderer.info.render.triangles;state.camera=camera.position.toArray();
  if(lastRender)deltaFrames.push(now-lastRender);if(deltaFrames.length>120)deltaFrames.shift();state.fps=1000/(deltaFrames.reduce((a,b)=>a+b,0)/deltaFrames.length);lastRender=now;
 }
 requestAnimationFrame(render);
 state.inspectCamera=(p:number[],t:number[])=>{transition=0;pose=3;state.viewIndex=3;camera.position.fromArray(p);controls.target.fromArray(t);controls.update();dirty=true;};state.capture=()=>{renderer.render(scene,camera);return canvas.toDataURL();};state.view=choose;
 window.addEventListener('portfolio:child-return',()=>{zoomEndAt=0;last=performance.now();dirty=true;controls.resetInteraction();});
 state.crewRefit={actors:14,armor:true,source:'actual local Blender GLB',independentBreathing:true,closedFootwear:true,animatedMaterials:animatedMaterials.size,stages:'actual native reassembly'};state.components={sea:true,ship:true,crew:true,island:true,trees:foliageMeshes.length>0,shrubs:foliageMeshes.length>0,shoreline:true};state.readyAt=performance.now();window.dispatchEvent(new Event("portfolio:progress"));
}
boot().catch(error=>{state.error=String(error);console.error(error);const p=document.querySelector('.odyssey-preparing p');if(p)p.textContent='场景准备未完成，请刷新重试';});
