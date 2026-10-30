import * as THREE from 'three';
/** Preserve the accepted clock tower; give the side buildings their own dressed surfaces. */
export function finishSecondaryArchitecture(scene:THREE.Scene,stoneTextures:THREE.Texture[]=[]){
 const copies=new Map<THREE.Material,THREE.MeshStandardMaterial>();let meshes=0;
 scene.updateMatrixWorld(true);
 scene.traverse(object=>{
  if(!(object instanceof THREE.Mesh)||object instanceof THREE.InstancedMesh)return;
  const original=Array.isArray(object.material)?object.material:[object.material];
  object.geometry.computeBoundingBox();
  const bounds=object.geometry.boundingBox!.clone().applyMatrix4(object.matrixWorld);
  if(bounds.min.x>-3.25&&bounds.max.x<3.25)return;
  let changed=false;
  const materials=original.map(m=>{
   if(!(m instanceof THREE.MeshStandardMaterial)||/marble|leaf|foliage|bark|joint|glass|emissive|velvet/i.test(m.name))return m;
   const stone=/limestone|travertine|sandstone|ashlar|masonry|plaster/i.test(m.name)||/stone|sandstone/.test(m.map?.name??'')||!!m.map&&stoneTextures.includes(m.map)||!m.map&&!!m.normalMap&&stoneTextures.includes(m.normalMap);
   const roof=/roof|slate|zinc|canopy/i.test(m.name);
   if(!stone&&!roof)return m;
   changed=true;
   if(copies.has(m))return copies.get(m)!;
   const next=m.clone();next.name=m.name+' / dressed secondary architecture';
   const base=m.onBeforeCompile,key=m.customProgramCacheKey();
   next.envMapIntensity=m.envMapIntensity;
   next.roughness=m.roughness;
   next.onBeforeCompile=(shader,renderer)=>{
    base(shader,renderer);
    {
     shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 dressedWorld;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\ndressedWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
     shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 dressedWorld;')
      .replace('#include <metalnessmap_fragment>',`float secondaryWeight=smoothstep(2.9,3.6,abs(dressedWorld.x));
       float dressedWet=(1.-smoothstep(.08,.80,dressedWorld.y))*.09;
       roughnessFactor=mix(roughnessFactor,clamp(roughnessFactor*${stone?'.66':'.70'}+.075-dressedWet,.32,.70),secondaryWeight);
       diffuseColor.rgb*=1.+secondaryWeight*.035;
       #include <metalnessmap_fragment>`)
      .replace('vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;','vec3 outgoingLight = totalDiffuse + totalSpecular*(1.+secondaryWeight*.28) + totalEmissiveRadiance;');
    }
   };
   next.customProgramCacheKey=()=>key+'-secondary-v32-77';copies.set(m,next);return next;
  });
  if(changed){object.material=Array.isArray(object.material)?materials:materials[0];meshes++;}
 });
 return{meshes,materials:copies.size,clockTowerPreserved:true,finish:'honed cut stone, mineral roughness and restrained damp plinths; satin roofs'};
}
