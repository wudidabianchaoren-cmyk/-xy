import * as THREE from 'three';

/** A single structural wall with readable mineral relief, rather than raised tiles or polished plaster. */
export function finishStoneV144(scene:THREE.Scene,stone:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
 let treated=0;
 scene.traverse(o=>{
  if(!(o instanceof THREE.Mesh)||!o.name.startsWith('V143 central tower continuous'))return;
  const old=o.material as THREE.MeshStandardMaterial;
  const maps={map:stone.map.clone(),normalMap:stone.normalMap.clone(),roughnessMap:stone.roughnessMap.clone()};
  for(const t of Object.values(maps)){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.44,.44);t.anisotropy=8;t.needsUpdate=true;}
  const mat=new THREE.MeshStandardMaterial({name:'V144 weathered warm limestone / mineral relief',...maps,color:new THREE.Color(.64,.49,.31),roughness:.92,metalness:0,normalScale:new THREE.Vector2(.36,.36),envMapIntensity:.18});
  mat.onBeforeCompile=s=>{
   s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 stonePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nstonePosition=position;');
   s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 stonePosition;').replace('#include <map_fragment>',`#include <map_fragment>
    // Slow weathering follows the wall, never a grid of separate brick colours.
    float mineral=.5+.5*sin(stonePosition.x*2.1+sin(stonePosition.y*1.1)*1.7)*sin(stonePosition.y*1.4);
    diffuseColor.rgb*=mix(.87,1.08,mineral);
    float baseWeather=1.-smoothstep(.1,1.25,stonePosition.y);
    diffuseColor.rgb*=1.-baseWeather*.10;`);
  };
  mat.customProgramCacheKey=()=> 'v144-porous-limestone-not-ashlar';o.material=mat;old.dispose();treated++;
 });
 return{treated,finish:'continuous carved stone; photographic mineral normal and roughness; warm ochre-grey',raisedBrickTiles:false};
}
