import * as THREE from 'three';
/** Non-sexual mythological figure: continuous anatomy, exposed weathered skin and a single eye. */
export function refineCyclops(root:THREE.Group){
 let atlas:THREE.Texture|null=null;root.traverse(o=>{if(o instanceof THREE.Mesh){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&m.name==='Human.body.001'&&m.map)atlas=m.map;}});
 const skin=new THREE.MeshStandardMaterial({map:atlas,color:0xa69a8a,roughness:.72,envMapIntensity:.24});
 skin.name='V32.78 / weathered bare skin with pores, creases and uneven pigmentation';
 skin.onBeforeCompile=s=>{
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 giantPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\ngiantPosition=position;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   varying vec3 giantPosition;
   float gn(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   float gnoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(gn(i),gn(i+vec3(1,0,0)),f.x),mix(gn(i+vec3(0,1,0)),gn(i+vec3(1,1,0)),f.x),f.y),mix(mix(gn(i+vec3(0,0,1)),gn(i+vec3(1,0,1)),f.x),mix(gn(i+vec3(0,1,1)),gn(i+vec3(1,1,1)),f.x),f.y),f.z);}`)
   .replace('#include <map_fragment>',`#include <map_fragment>
    float patches=gnoise(giantPosition*36.);float pores=gnoise(giantPosition*580.);
    float crease=pow(.5+.5*sin(giantPosition.y*520.+gnoise(giantPosition*80.)*9.),12.);
    float face=smoothstep(1.45,1.56,giantPosition.y);
    diffuseColor.rgb*=.77+patches*.31;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.73,.65,.59),crease*face*.18);`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    float heightDetail=(pores-.5)*.0015+crease*face*.003;
    vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition),r1=cross(q1,normal),r2=cross(normal,q0);float det=dot(q0,r1);
    normal=normalize(abs(det)*normal-sign(det)*(dFdx(heightDetail)*r1+dFdy(heightDetail)*r2));`)
   .replace('#include <roughnessmap_fragment>','float roughnessFactor=clamp(.61+patches*.22+pores*.08,.60,.91);');
 };
 skin.customProgramCacheKey=()=> 'weathered-bare-cyclops-v32-78';let removed=0,bodyMeshes=0;
 root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const mats=Array.isArray(o.material)?o.material:[o.material];
  if(mats.some(m=>/tunic|mantle|belt|Human.short01/i.test(m.name))){o.visible=false;removed++;return;}
  for(const m of mats)if(m instanceof THREE.MeshStandardMaterial&&m.name==='Material_6'){m.color.set(0x95866e);m.roughness=.46;}
  if(mats.some(m=>/shepherd skin/i.test(m.name))){o.material=skin;o.receiveShadow=true;bodyMeshes++;}
 });
 return{removedGarmentAndHairMeshes:removed,bodyMeshes,skin,clothing:false,surface:'Uneven earthy skin, fine pores and facial creases; no outfit or held object'};
}
