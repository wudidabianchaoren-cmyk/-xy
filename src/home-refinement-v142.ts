import * as THREE from 'three';
import{finishHomeV138}from'./home-finish-v138';
export function finishHomeV142(scene:THREE.Scene){
 const original=new Map<THREE.Material,THREE.Color>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial)original.set(m,m.color.clone());});
 const inherited=finishHomeV138(scene),done=new Set<THREE.Material>();let metals=0,masonry=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(!(m instanceof THREE.MeshStandardMaterial)||done.has(m))continue;done.add(m);
  if(/gold|gilt|brass|chased pale|solar copper|silver chapter/i.test(m.name)){
   m.roughness=Math.max(m.roughness,.46);m.envMapIntensity=.82;m.normalScale.setScalar(.004);m.polygonOffset=true;m.polygonOffsetFactor=-.35;m.polygonOffsetUnits=-1;if(!/silver/.test(m.name))m.color.setRGB(.63,.47,.23);
   const old=m.onBeforeCompile,key=m.customProgramCacheKey();m.onBeforeCompile=(s,r)=>{old.call(m,s,r);s.fragmentShader=s.fragmentShader.replace('vec3(.61,.53,.34)','vec3(.47,.30,.10)').replace(/if\s*\(frustumTest\s*&&\s*shadowRadius\s*>\s*3\.9\)\s*return\s*mix\(1\.,courtyardPenumbra\(shadowMap,shadowCoord.xy,shadowCoord.z,shadowMapSize\),shadowIntensity\);/g,'');};m.customProgramCacheKey=()=>key+'/v140-stable-metal-PCF';metals++;
  }else if(/cobalt vitreous|midnight blue lower/i.test(m.name)){
   m.polygonOffset=true;m.polygonOffsetFactor=1;m.polygonOffsetUnits=1;m.normalScale.setScalar(.015);m.roughness=Math.max(.34,m.roughness);
  }else if(/limestone|travertine|sandstone/i.test(m.name)&&!/dark|charcoal/i.test(m.name)){
   const c=original.get(m);if(c)m.color.copy(c);m.normalScale.setScalar(.014);m.roughness=.8;m.envMapIntensity=.18;m.aoMapIntensity=.08;m.roughnessMap=null;
   const old=m.onBeforeCompile,key=m.customProgramCacheKey();m.onBeforeCompile=(s,r)=>{old.call(m,s,r);s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    #ifdef USE_MAP
    vec3 stoneSample=texture2D(map,vMapUv).rgb;float blockShade=dot(stoneSample,vec3(.2126,.7152,.0722));diffuseColor.rgb*=mix(1.30,1.,smoothstep(.02,.32,blockShade));
    #endif`);s.fragmentShader=s.fragmentShader.replace('diffuseColor *= sampledDiffuseColor;','sampledDiffuseColor.rgb=mix(vec3(.71,.695,.65),sampledDiffuseColor.rgb,.38);diffuseColor *= sampledDiffuseColor;').replace('*.085*grainVisibility','*.018*grainVisibility').replace('footDamp*.15','footDamp*.08');};m.customProgramCacheKey=()=>key+'/v142-quiet-honed-stone';masonry++;
  }
  m.needsUpdate=true;
 }});
 let filteredProfiles=0;scene.updateMatrixWorld(true);scene.traverse(o=>{if(!(o instanceof THREE.Mesh)||!o.visible)return;const materials=Array.isArray(o.material)?o.material:[o.material];if(!materials.some(m=>/chased pale|solar copper|silver chapter/i.test(m.name)))return;const box=new THREE.Box3().setFromObject(o),size=box.getSize(new THREE.Vector3());if(size.z>.42||size.x<1.4||box.min.x< -2.8||box.max.x>2.6||box.max.y>7.8)return;const g=o.geometry.clone(),p=g.getAttribute('position'),n=g.getAttribute('normal');if(!n)return;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*.0035,p.getY(i)+n.getY(i)*.0035,p.getZ(i)+n.getZ(i)*.0035);g.computeBoundingBox();g.computeBoundingSphere();o.geometry=g;filteredProfiles++;});
 return{...inherited,metals,masonry,filteredProfiles,profileExpansionMetres:.0035,antiFlicker:'layer depth bias, filtered metal highlights, slightly thicker engraved profiles and regular PCF',palette:'restored original native warm limestone / deep teal enamel'};
}
