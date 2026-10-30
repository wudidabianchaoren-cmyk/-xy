import * as THREE from 'three';
/** Preserve every original mesh and light; separate honed masonry from worked gold. */
export function finishHomeV137(scene:THREE.Scene){
 const seen=new Set<THREE.Material>();let gold=0,stone=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
  for(const m of Array.isArray(o.material)?o.material:[o.material]){
   if(!(m instanceof THREE.MeshStandardMaterial)||seen.has(m))continue;seen.add(m);
   if(/gold|gilt|brass|chased pale|solar copper|silver chapter/i.test(m.name)){
    m.metalness=.98;m.roughness=/chapter/.test(m.name)?.28:.25;m.envMapIntensity=1.65;
    if(!/silver/.test(m.name))m.color.setRGB(.84,.59,.23);
    m.normalScale.setScalar(.045);m.transparent=false;m.opacity=1;m.depthWrite=true;m.alphaTest=0;gold++;
   }else if(/limestone|travertine|sandstone/i.test(m.name)&&!/dark|charcoal/i.test(m.name)){
    m.color.setRGB(.61,.575,.50);m.roughness=.61;m.metalness=.015;m.envMapIntensity=.18;
    if(m.normalMap)m.normalScale.set(.105,.105);stone++;
   }
   m.needsUpdate=true;
  }
 });return {goldMaterials:gold,stoneMaterials:stone,finish:'continuous gold geometry; honed warm-grey masonry; incumbent lighting retained'};
}
