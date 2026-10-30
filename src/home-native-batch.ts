import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
/** Batch only static added architecture; the accepted animated actors remain separate. */
export function batchNativeDetail(root:THREE.Group){
 root.updateMatrixWorld(true);const parts=new Map<THREE.Material,THREE.BufferGeometry[]>();
 root.traverse(o=>{if(o instanceof THREE.Mesh&&!Array.isArray(o.material)){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);for(const attribute of Object.keys(g.attributes))if(!['position','normal','uv'].includes(attribute))g.deleteAttribute(attribute);if(!g.attributes.normal)g.computeVertexNormals();if(!g.attributes.uv)g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const p=parts.get(o.material)??[];p.push(g.index?g.toNonIndexed():g);parts.set(o.material,p);}});
 root.clear();for(const [material,geometries]of parts){const combined=mergeGeometries(geometries);if(!combined)throw Error('Static native courtyard batching failed');const mesh=new THREE.Mesh(combined,material);mesh.name=material.name+' / static native material batch';mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);geometries.forEach(g=>g.dispose());}
 return root;
}
