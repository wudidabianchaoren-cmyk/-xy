import * as THREE from 'three';
import{mergeGeometries}from'three/addons/utils/BufferGeometryUtils.js';
/** Preserve every original mesh and light; separate honed masonry from worked gold. */
export function finishHomeV138(scene:THREE.Scene){
 const seen=new Set<THREE.Material>();let gold=0,stone=0;const calendar:any[]=[];scene.updateMatrixWorld(true);
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
  if((Array.isArray(o.material)?o.material:[o.material]).some(m=>/gold|gilt|copper|dial/.test(m.name))){const b=new THREE.Box3().setFromObject(o);calendar.push({name:o.name,min:b.min.toArray(),max:b.max.toArray()});}
  for(const m of Array.isArray(o.material)?o.material:[o.material]){
   if(!(m instanceof THREE.MeshStandardMaterial)||seen.has(m))continue;seen.add(m);
   if(/gold|gilt|brass|chased pale|solar copper|silver chapter/i.test(m.name)){
    m.metalness=.94;m.roughness=.34;m.envMapIntensity=1.30;
    if(!/silver/.test(m.name))m.color.setRGB(.76,.61,.36);
    m.normalScale.setScalar(.018);m.transparent=false;m.opacity=1;m.depthWrite=true;m.alphaTest=0;
    const old=m.onBeforeCompile,key=m.customProgramCacheKey(),back=/solar copper/.test(m.name);
    m.onBeforeCompile=(s,r)=>{old.call(m,s,r);
     s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 calendarWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\ncalendarWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
     s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 calendarWorld;').replace('#include <color_fragment>',`#include <color_fragment>
      float lowerFace=(1.-smoothstep(1.40,1.46,length(calendarWorld.xy-vec2(-.15,1.77))))*step(-.42,calendarWorld.z);
      diffuseColor.rgb=mix(diffuseColor.rgb,${back?'vec3(.070,.095,.089)':'vec3(.61,.53,.34)'},lowerFace);`);
    };m.customProgramCacheKey=()=>key+' / v138-dark-calendar-'+back;gold++;
   }else if(/limestone|travertine|sandstone/i.test(m.name)&&!/dark|charcoal/i.test(m.name)){
    m.color.setRGB(.57,.565,.53);m.roughness=.68;m.metalness=.015;m.envMapIntensity=.18;
    if(m.normalMap)m.normalScale.set(.08,.08);stone++;
   }
   m.needsUpdate=true;
  }
 });
 // Twelve small botanical relief medallions make the existing calendar recesses legible.
 const group=new THREE.Group();group.name='V138 twelve seasonal engraved medallions';
 const gilt=new THREE.MeshStandardMaterial({name:'V138 pale calendar relief',color:0xb1a582,metalness:.88,roughness:.43,envMapIntensity:.75});
 const enamel=new THREE.MeshStandardMaterial({name:'V138 calendar medallion dark patina',color:0x182c2a,metalness:.35,roughness:.50});
 for(let i=0;i<12;i++){
  const angle=Math.PI/2+i*Math.PI/6,x=-.15+Math.cos(angle)*.99,y=1.77+Math.sin(angle)*.99;
  const inset=new THREE.Mesh(new THREE.CircleGeometry(.110,32),enamel);inset.position.set(x,y,-.173);group.add(inset);
  const border=new THREE.Mesh(new THREE.TorusGeometry(.108,.006,5,40),gilt);border.position.set(x,y,-.159);group.add(border);
  for(let j=0;j<6;j++){const a=j*Math.PI/3;const petal=new THREE.Mesh(new THREE.TorusGeometry(.018,.004,4,12),gilt);petal.position.set(x+Math.cos(a)*.033,y+Math.sin(a)*.033,-.153);petal.scale.set(.65,1.25,1);petal.rotation.z=a-Math.PI/2;group.add(petal);}
  const boss=new THREE.Mesh(new THREE.SphereGeometry(.009,8,6),gilt);boss.position.set(x,y,-.145);group.add(boss);
 }
 const reliefParts=new Map<THREE.Material,THREE.BufferGeometry[]>();for(const child of [...group.children]){if(!(child instanceof THREE.Mesh))continue;child.updateMatrix();let g=child.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(child.matrix);const mat=child.material as THREE.Material;const list=reliefParts.get(mat)||[];list.push(g);reliefParts.set(mat,list);child.geometry.dispose();}group.clear();
 for(const[mat,parts]of reliefParts){const g=mergeGeometries(parts,false);if(g)group.add(new THREE.Mesh(g,mat));parts.forEach(g=>g.dispose());}scene.add(group);
 let rotor:THREE.Object3D|undefined;scene.traverse(o=>{if(/LIVE.*calendar.*rotor/i.test(o.name))rotor=o;});if(rotor)rotor.attach(group);
 return {goldMaterials:gold,stoneMaterials:stone,calendar,medallions:12,medallionBatches:2,medallionsFollowRotor:!!rotor,finish:'dark patinated calendar / pale relief; neutral honed masonry; restored canopy'};
}
