import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
type Calibration={materials:{name:string;roughness:number;metalness:number;base:number[]}[]};
const retainedDetailReady=Promise.all([fetch('./blender/reference-architecture-v23/material-calibration.json').then(r=>r.json() as Promise<Calibration>),new GLTFLoader().loadAsync('./blender/reference-architecture-v25/clock-engraving.glb')]);
retainedDetailReady.catch(()=>{});
/** Geometry and material factors produced in the saved complete Blender V23 scene. */
export async function applyNativeV23(scene:THREE.Scene,world:THREE.Group,stonePatch=true){
 const dir='./blender/reference-architecture-v23/';
 const [patch,[calibration,engraving]]=await Promise.all([stonePatch?new GLTFLoader().loadAsync(dir+'dressed-stone.glb'):Promise.resolve({scene:new THREE.Group()}),retainedDetailReady]);
 const replacement=/^V16__quarried_warm_limestone_batch$|^V16__cut_pale_travertine_arris_batch$/;
 const sourceMaterials=new Map<string,THREE.Material>();let replaced=0,calibrated=0;
 world.traverse(o=>{if(o instanceof THREE.Mesh){for(const m of Array.isArray(o.material)?o.material:[o.material])sourceMaterials.set(m.name,m);if(stonePatch&&replacement.test(o.name)){o.visible=false;replaced++;}}});
 patch.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=o.receiveShadow=true;const m=Array.isArray(o.material)?o.material[0]:o.material;const name=m.name.replace(' / web PBR','');const retained=sourceMaterials.get(name);if(retained)o.material=retained;}});
 scene.add(patch.scene);
 const cleanName=(name:string)=>name.replace(/geometry/g,'batch').replace(/[^a-zA-Z0-9]/g,'');const engravedMeshes=new Map<string,THREE.Mesh>();engraving.scene.traverse(o=>{if(o instanceof THREE.Mesh)engravedMeshes.set(cleanName(o.name),o);});
 let nativeRings=0;world.traverse(o=>{if(o instanceof THREE.Mesh){const replacement=engravedMeshes.get(cleanName(o.name));if(replacement){o.geometry=replacement.geometry;nativeRings++;}}});
 const done=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(m instanceof THREE.MeshStandardMaterial&&/gold|gilt|brass|silver chapter|bronze|solar copper/.test(m.name))o.receiveShadow=true;
  if(!(m instanceof THREE.MeshStandardMaterial)||done.has(m))continue;done.add(m);
  const c=calibration.materials.find(c=>c.name===m.name.replace(' / web PBR','').replace(' / polished enamel',''));if(!c)continue;
  if(/gold|gilt|brass|silver chapter|bronze|solar copper/.test(m.name)){m.roughness=c.roughness;m.metalness=c.metalness;m.envMapIntensity=.58;o.receiveShadow=true;if(m instanceof THREE.MeshPhysicalMaterial)m.clearcoat=0;calibrated++;}
  else if(/limestone|travertine|sandstone|ashlar/.test(m.name)){m.roughness=c.roughness;if(m.normalMap)m.normalScale.set(.085,.085);calibrated++;}
  else if(/cobalt vitreous|midnight blue lower/.test(m.name)){m.roughness=c.roughness;m.envMapIntensity=.30;if(m instanceof THREE.MeshPhysicalMaterial){m.clearcoat=.18;m.clearcoatRoughness=.32;}calibrated++;}
 }});
 return{replaced,calibrated,nativeRings,source:'Actual Blender V23 applied bevel, native engraving width and BSDF calibration',patch:patch.scene};
}
