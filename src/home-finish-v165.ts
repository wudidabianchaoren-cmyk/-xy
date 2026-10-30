import * as THREE from 'three';
/** Quiet mineral surfaces, luminous worked gold and depth in the retained woodland. */
export function finishCourtyardV165(scene:THREE.Scene){
 const seen=new Set<THREE.Material>();let stone=0,gold=0,leaves=0,floor=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(!(m instanceof THREE.MeshStandardMaterial)||seen.has(m))continue;seen.add(m);
  if(/limestone|masonry|ashlar|travertine|sandstone|eroded|mineral/i.test(m.name)&&!/charcoal|dark/i.test(m.name)){
   m.color.multiplyScalar(1.42);m.normalScale.multiplyScalar(.45);m.roughness=Math.min(m.roughness,.82);m.aoMapIntensity=Math.min(m.aoMapIntensity,.12);
   const before=m.onBeforeCompile,key=m.customProgramCacheKey();m.onBeforeCompile=(s,r)=>{before.call(m,s,r);s.fragmentShader=s.fragmentShader.replace('mix(.74,1.14,cloud)','mix(.92,1.04,cloud)').replace('vec3(.52,.57,.52),damp','vec3(.82,.84,.80),damp*.38').replace('mix(.88,1.08,block.z)','mix(.95,1.04,block.z)');};m.customProgramCacheKey=()=>key+'/V165-quiet-mineral';stone++;
  }else if(/chased pale|solar copper|silver chapter/i.test(m.name)){m.color.multiplyScalar(1.5);m.envMapIntensity=.65;gold++;
  }else if(/living oak canopy/i.test(m.name)){m.emissive.setRGB(.015,.022,.006);m.roughness=.84;leaves++;
  }else if(/honed silver marble/i.test(m.name)){m.color.setRGB(.11,.105,.084);m.normalScale.setScalar(.012);m.roughness=.19;m.envMapIntensity=.18;if(m instanceof THREE.MeshPhysicalMaterial){m.clearcoat=.18;m.clearcoatRoughness=.24;}floor++;}
 }});
 return{stone,gold,leaves,floor,geometryPreserved:true,grading:'warm yellow key / quiet neutral mineral / deep teal enamel / pale gold'};
}
