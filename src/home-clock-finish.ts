import * as THREE from 'three';
/** Local metal refinement; the accepted courtyard light and color pipeline remain intact. */
export function refineClockFinish(scene:THREE.Scene){
 const seen=new Set<THREE.Material>();let metals=0,chapters=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(!(m instanceof THREE.MeshStandardMaterial)||seen.has(m))continue;seen.add(m);
  if(/chased pale gold bronze|burnished solar copper|machined silver chapter/.test(m.name)){
   m.roughness=/silver/.test(m.name)?.36:.34;m.metalness=.94;m.envMapIntensity*=1.24;
   if(/silver/.test(m.name)){m.color.setRGB(.70,.67,.53);chapters++;}metals++;
  }
 }});return{metals,chapters,source:'Local honed bronze and legible metal chapter marks / retained native reflection'};
}
