import * as THREE from 'three';

/** Preserve the closed native shore and carved cave; erode the upper terrain into separate ridges. */
export function articulateIsland(island:THREE.Group){
 island.updateWorldMatrix(true,true);const box=new THREE.Box3().setFromObject(island),center=box.getCenter(new THREE.Vector3());
 let vertices=0;
 island.traverse(o=>{if(!(o instanceof THREE.Mesh)||!/V21.*solid.*inhabited/i.test(o.name+' '+o.parent?.name))return;
  o.geometry=o.geometry.clone();const p=o.geometry.getAttribute('position'),world=new THREE.Vector3(),inverse=o.matrixWorld.clone().invert();
  for(let i=0;i<p.count;i++){
   world.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);const x=world.x-center.x,z=world.z-center.z;
   // Keep the tidal shelves and cave mouth exactly where they were modelled.
   const upper=THREE.MathUtils.smoothstep(world.y,8,18);
   const rearRidge=11.4*Math.exp(-(((x+48)/64)**2)-(((z+25)/30)**2));
   const eastRidge=9.8*Math.exp(-(((x-57)/44)**2)-(((z+6)/36)**2));
   const saddle=-6.6*Math.exp(-((x/29)**2)-(((z+5)/47)**2));
   const erosion=.55*Math.sin(x*.13+z*.07)*Math.sin(z*.19);
   world.y+=upper*(rearRidge+eastRidge+saddle+erosion);world.applyMatrix4(inverse);p.setXYZ(i,world.x,world.y,world.z);vertices++;
  }p.needsUpdate=true;o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
 });
 island.updateWorldMatrix(true,true);const bounds=new THREE.Box3().setFromObject(island);return{vertices,width:bounds.max.x-bounds.min.x,depth:bounds.max.z-bounds.min.z,height:bounds.max.y-bounds.min.y};
}
