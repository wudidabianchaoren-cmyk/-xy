import * as THREE from 'three';
import {MeshBVH, acceleratedRaycast} from 'three-mesh-bvh';

// Keep the exact terrain triangles and the original placement rays. Only their
// spatial lookup changes; indirect mode preserves the authored index order.
export function accelerateIslandPlacement(root:THREE.Object3D){
 root.traverse(o=>{if(o instanceof THREE.Mesh && !(o instanceof THREE.InstancedMesh) && /V21.*solid.*inhabited/i.test(o.name+' '+o.parent?.name)){
  if(!o.geometry.boundsTree)o.geometry.boundsTree=new MeshBVH(o.geometry,{indirect:true});
  o.raycast=acceleratedRaycast;
 }});
}
