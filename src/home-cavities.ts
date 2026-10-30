import * as THREE from 'three';

/** Native geometry visibility, sampled in metres. This supplements moving direct light. */
export async function loadCourtyardCavities(){
 const directory='./blender/reference-architecture-v22/';
 const [meta,bytes]=await Promise.all([fetch(directory+'courtyard-cavity-volume.json').then(r=>{if(!r.ok)throw Error('Native cavity metadata missing');return r.json();}),fetch(directory+'courtyard-cavity-volume.bin').then(r=>{if(!r.ok)throw Error('Native cavity volume missing');return r.arrayBuffer();})]);
 const texture=new THREE.Data3DTexture(new Uint8Array(bytes),...meta.dimensions as [number,number,number]);texture.format=THREE.RedFormat;texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.unpackAlignment=1;texture.needsUpdate=true;
 const minimum=new THREE.Vector3().fromArray(meta.minimum),extent=new THREE.Vector3().fromArray(meta.maximum).sub(minimum);
 const apply=(material:THREE.Material)=>{const previous=material.onBeforeCompile,key=material.customProgramCacheKey();material.onBeforeCompile=(shader,renderer)=>{
  previous(shader,renderer);shader.uniforms.nativeCavityVolume={value:texture};shader.uniforms.nativeCavityMinimum={value:minimum};shader.uniforms.nativeCavityExtent={value:extent};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 nativeCavityPosition,nativeCavityNormal;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nnativeCavityPosition=(modelMatrix*vec4(transformed,1.)).xyz;nativeCavityNormal=normalize(mat3(modelMatrix)*objectNormal);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 nativeCavityPosition,nativeCavityNormal;uniform highp sampler3D nativeCavityVolume;uniform vec3 nativeCavityMinimum,nativeCavityExtent;').replace('#include <aomap_fragment>',`#include <aomap_fragment>
   vec3 cavityUv=(nativeCavityPosition+normalize(nativeCavityNormal)*.32-nativeCavityMinimum)/nativeCavityExtent;
   float nativeCavity=texture(nativeCavityVolume,clamp(cavityUv,vec3(.001),vec3(.999))).r;
   if(any(lessThan(cavityUv,vec3(0.)))||any(greaterThan(cavityUv,vec3(1.))))nativeCavity=1.;
   reflectedLight.indirectDiffuse*=nativeCavity;reflectedLight.indirectSpecular*=.85+.15*nativeCavity;
   reflectedLight.directDiffuse*=.85+.15*nativeCavity;`);
 };material.customProgramCacheKey=()=>key+' / native-cavity-volume-v76';material.needsUpdate=true;};
 return{apply,audit:{...meta,bytes:bytes.byteLength}};
}
