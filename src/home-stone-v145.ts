import * as THREE from 'three';
import {TessellateModifier} from 'three/addons/modifiers/TessellateModifier.js';

const hash=(x:number,y:number)=>{const a=Math.sin(x*127.1+y*311.7)*43758.5453;return a-Math.floor(a);};
function noise(x:number,y:number){const a=Math.floor(x),b=Math.floor(y);let u=x-a,v=y-b;u=u*u*(3-2*u);v=v*v*(3-2*v);return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(a,b),hash(a+1,b),u),THREE.MathUtils.lerp(hash(a,b+1),hash(a+1,b+1),u),v);}

/** Connected stone, with millimetre relief and weathering tied to the building's exposure. */
export function finishStoneV145(scene:THREE.Scene,stone:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
 let treated=0,triangles=0;
 scene.traverse(o=>{
  if(!(o instanceof THREE.Mesh)||!o.name.startsWith('V143 central tower continuous'))return;
  const old=o.material as THREE.MeshStandardMaterial;
  const g=new TessellateModifier(.18,11).modify(o.geometry),p=g.getAttribute('position'),n=g.getAttribute('normal');
  for(let i=0;i<p.count;i++){
   if(n.getZ(i)<.8)continue;
   const x=p.getX(i),y=p.getY(i);
   const relief=(noise(x*3.8,y*3.8)-.5)*.010+(noise(x*14.7,y*14.7)-.5)*.0028;
   p.setZ(i,p.getZ(i)+relief);
  }
  g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();o.geometry=g;triangles+=p.count/3;
  const maps={map:stone.map.clone(),normalMap:stone.normalMap.clone(),roughnessMap:stone.roughnessMap.clone()};
  for(const t of Object.values(maps)){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.75,.75);t.anisotropy=8;t.needsUpdate=true;}
  const mat=new THREE.MeshStandardMaterial({name:'V145 exposed limestone / worn arris / rain washed surface',...maps,color:new THREE.Color(.57,.47,.34),roughness:.94,metalness:0,normalScale:new THREE.Vector2(.72,.72),envMapIntensity:.20});
  mat.onBeforeCompile=s=>{
   s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 stonePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nstonePosition=position;');
   s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
    varying vec3 stonePosition;
    float stoneHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float stoneNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(stoneHash(i),stoneHash(i+vec2(1,0)),f.x),mix(stoneHash(i+vec2(0,1)),stoneHash(i+vec2(1,1)),f.x),f.y);}
    float stoneFbm(vec2 p){return stoneNoise(p)*.58+stoneNoise(p*2.07+9.)*.28+stoneNoise(p*4.13+17.)*.14;}
    float stoneDamp(vec2 p){float base=(1.-smoothstep(.12,1.1,p.y))*(.35+.65*stoneFbm(p*2.));float runoff=stoneFbm(vec2(p.x*12.,p.y*.65));float streak=smoothstep(.52,.78,runoff);float belowWindow=(1.-smoothstep(6.05,7.3,p.y))*smoothstep(4.1,6.5,p.y);float underSill=exp(-pow((p.y-7.12)/.14,2.));return clamp(base*.55+streak*.23+belowWindow*streak*.22+underSill*.25,0.,.8);}`)
    .replace('#include <map_fragment>',`#include <map_fragment>
     vec2 sp=stonePosition.xy;float cloud=stoneFbm(sp*.82),salt=stoneFbm(sp*4.1);float damp=stoneDamp(sp);
     float luma=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=mix(vec3(luma),diffuseColor.rgb,.72);
     diffuseColor.rgb*=mix(.80,1.12,cloud);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.57,.61,.57),damp);
     float mineral=smoothstep(.62,.83,salt)*(1.-damp);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.10,1.10,1.07),mineral*.32);`)
    .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
     roughnessFactor=clamp(.80+roughnessFactor*.17+stoneFbm(stonePosition.xy*5.)*.045-stoneDamp(stonePosition.xy)*.08,.76,.99);`);
  };
  mat.customProgramCacheKey=()=> 'v145-exposed-weathered-stone-physical-relief';o.material=mat;old.dispose();treated++;
 });
 return{treated,triangles,reliefMillimetres:6.4,finish:'porous limestone with real surface displacement, mineral variation and sheltered/runoff/base weathering',raisedBrickTiles:false};
}
