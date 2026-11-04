import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {courtyardSoftShadows} from './home-soft-shadows';
type NativeMaterial={name:string;base:number[];roughness:number;metalness:number;normalStrength:number|null};
type NativeLight={name:string;energy:number;color:number[];position:number[];direction:number[];width:number;height:number};
type Look={materials:NativeMaterial[];lights:NativeLight[];exposureEV:number;source:string};
const directory='./blender/reference-architecture-v24/';
const normalized=(name:string)=>name.replace(/ \/ web PBR| \/ polished enamel| \/ dressed secondary architecture/g,'');
const meshKey=(name:string)=>name.replace(/geometry/g,'batch').replace(/[^a-zA-Z0-9]/g,'');
const nativeLookReady=Promise.all([
 fetch(directory+'look-calibration.json').then(r=>r.json() as Promise<Look>),
 fetch(directory+'bake-audit.json').then(r=>r.json() as Promise<{layers:{name:string;ao:string;indirect:string;size:number;uvChannel:number}[];seconds:number}>),
 new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(directory+'baked-architecture.glb'),
 Promise.all([
  fetch('./assets/home/native-v24-prefiltered-v158.json').then(r=>{if(!r.ok)throw Error('Courtyard reflection metadata missing');return r.json() as Promise<{width:number;height:number}>;}),
  fetch('./assets/home/native-v24-prefiltered-v158.bin.gz').then(r=>{if(!r.ok)throw Error('Courtyard reflection data missing');return new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();})
 ])
]).then(async([look,audit,patch,[probeMeta,probeBuffer]])=>{
 const loader=new THREE.TextureLoader();const layers=await Promise.all(audit.layers.map(async layer=>({layer,ao:await loader.loadAsync(directory+layer.ao),buffer:await fetch(directory+layer.indirect).then(r=>new Response(r.body!.pipeThrough(new DecompressionStream('deflate'))).arrayBuffer())})));
 return{look,audit,patch,probeMeta,probeBuffer,layers};
});
nativeLookReady.catch(()=>{});
/** Connected Blender BSDF factors, two independent Cycles bake layers and matching UVs.
 * Moving direct light and all actors remain live; no rendered picture is used as geometry.
 */
export async function applyNativeV24(scene:THREE.Scene){
 const {look,audit,patch,probeMeta,probeBuffer,layers}=await nativeLookReady;
 const nativeMaterials=new Map(look.materials.map(m=>[normalized(m.name),m]));let calibrated=0,shadowReceivers=0;
 const probe=new THREE.DataTexture(new Uint16Array(probeBuffer),probeMeta.width,probeMeta.height,THREE.RGBAFormat,THREE.HalfFloatType);probe.mapping=THREE.CubeUVReflectionMapping;probe.minFilter=probe.magFilter=THREE.LinearFilter;probe.generateMipmaps=false;probe.colorSpace=THREE.LinearSRGBColorSpace;probe.needsUpdate=true;
 let metalProbe=probe,ueMetalReflection:{enabled:boolean;weight?:number;source?:string;materials:number;error?:string}={enabled:false,materials:0};
 try{
  const [meta,data]=await Promise.all([fetch('./assets/ue-v159/clock-mix-ue5-cubeuv.json').then(r=>{if(!r.ok)throw Error('Clock UE reflection metadata missing');return r.json();}),fetch('./assets/ue-v159/clock-mix-ue5-cubeuv.bin.gz').then(r=>{if(!r.ok)throw Error('Clock UE reflection data missing');return new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();})]);
  if(data.byteLength!==meta.width*meta.height*8)throw Error('Clock UE reflection size mismatch');
  metalProbe=new THREE.DataTexture(new Uint16Array(data),meta.width,meta.height,THREE.RGBAFormat,THREE.HalfFloatType);metalProbe.mapping=THREE.CubeUVReflectionMapping;metalProbe.minFilter=metalProbe.magFilter=THREE.LinearFilter;metalProbe.generateMipmaps=false;metalProbe.colorSpace=THREE.LinearSRGBColorSpace;metalProbe.needsUpdate=true;
  ueMetalReflection={enabled:true,weight:meta.ueWeight,source:meta.source,materials:0};
 }catch(error){ueMetalReflection.error=String(error);}
 const done=new Set<THREE.Material>();
 scene.traverse(o=>{if(o instanceof THREE.Mesh){
  const materials=Array.isArray(o.material)?o.material:[o.material];
  for(const m of materials){
   if(!(m instanceof THREE.MeshStandardMaterial))continue;
   if(/gold|gilt|brass|bronze|copper|silver chapter/.test(m.name)){o.receiveShadow=true;shadowReceivers++;}
   if(done.has(m))continue;done.add(m);const c=nativeMaterials.get(normalized(m.name));if(!c)continue;
   m.color.fromArray(c.base);m.roughness=c.roughness;m.metalness=c.metalness;
   if(m.normalMap&&c.normalStrength!==null)m.normalScale.setScalar(c.normalStrength);
   // Separate metal illumination from the unrelated Venice sunset environment.
   if(m.metalness>.6){m.envMap=metalProbe;m.envMapIntensity=1.15;ueMetalReflection.materials++;}else m.envMapIntensity=.12;
   if(m instanceof THREE.MeshPhysicalMaterial&&/enamel/.test(m.name)){m.clearcoat=.18;m.clearcoatRoughness=.32;}
   m.needsUpdate=true;calibrated++;
  }
 }});
 const layerByName=new Map(audit.layers.map(l=>[meshKey(l.name),l]));const nativeMeshes:THREE.Mesh[]=[];
 patch.scene.traverse(o=>{if(o instanceof THREE.Mesh)nativeMeshes.push(o);});
 const keys=new Set(nativeMeshes.map(o=>meshKey(o.name)));let hidden=0;
 scene.traverse(o=>{if(o instanceof THREE.Mesh&&keys.has(meshKey(o.name))&&o.visible){o.visible=false;hidden++;}});
 await Promise.all(nativeMeshes.map(async o=>{
  const layer=layerByName.get(meshKey(o.name));if(!layer)throw Error('Native bake UV correspondence missing: '+o.name);
  const {ao,buffer}=layers.find(l=>l.layer.name===layer.name)!;
  ao.colorSpace=THREE.NoColorSpace;ao.channel=1;ao.flipY=false;ao.anisotropy=4;
  const gi=new THREE.DataTexture(new Uint16Array(buffer),layer.size,layer.size,THREE.RGBAFormat,THREE.HalfFloatType);
  gi.colorSpace=THREE.LinearSRGBColorSpace;gi.channel=1;gi.flipY=false;gi.minFilter=gi.magFilter=THREE.LinearFilter;gi.needsUpdate=true;
  for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){
   if(m.map)m.map.anisotropy=8;if(m.normalMap)m.normalMap.anisotropy=8;
   m.aoMap=ao;m.aoMapIntensity=.25;m.lightMap=gi;m.lightMapIntensity=1;m.envMapIntensity=.07;
   const previous=m.onBeforeCompile;
   m.onBeforeCompile=(s,r)=>{previous(s,r);s.fragmentShader=s.fragmentShader.replace('#include <aomap_fragment>',`#include <aomap_fragment>
    float nativeContact=texture2D(aoMap,vAoMapUv).r;
    reflectedLight.directDiffuse*=mix(.8,1.,sqrt(nativeContact));`);};
   m.customProgramCacheKey=()=> 'native-cycles-ao-indirect-v24';courtyardSoftShadows(m);m.needsUpdate=true;
  }
  o.castShadow=o.receiveShadow=true;o.userData.nativeBakeLayer=layer.name;
 }));
 scene.add(patch.scene);
 return{look,probe,patch:patch.scene,audit:{source:look.source,calibrated,shadowReceivers,hidden,bakedMeshes:nativeMeshes.length,bakeSeconds:audit.seconds,engine:'Actual Blender Cycles AO + scene-linear indirect irradiance',dynamicDirectLightBaked:false,reflectionProbe:'V24 original radiance / offline prefiltered V158',runtimePMREM:false,ueMetalReflection}};
}
