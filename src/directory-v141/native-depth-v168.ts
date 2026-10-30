import * as THREE from 'three';

/** Preserve the original occluding triangles in one static, position-only draw. */
export function nativeDepthV168(root:THREE.Object3D,material:THREE.Material){
 root.updateWorldMatrix(true,true);
 const sources:THREE.Mesh[]=[];let vertices=0;
 root.traverseVisible(object=>{
  if(!(object instanceof THREE.Mesh))return;
  const materials=Array.isArray(object.material)?object.material:[object.material];
  if(materials.every(m=>m.transparent||/glass|screen/i.test(m.name)))return;
  sources.push(object);vertices+=object.geometry.index?.count??object.geometry.getAttribute('position').count;
 });
 const positions=new Float32Array(vertices*3),point=new THREE.Vector3();let offset=0;
 for(const object of sources){
  const geometry=object.geometry,position=geometry.getAttribute('position'),index=geometry.index;
  for(let i=0,count=index?.count??position.count;i<count;i++){
   point.fromBufferAttribute(position,index?index.getX(i):i).applyMatrix4(object.matrixWorld);
   positions[offset++]=point.x;positions[offset++]=point.y;positions[offset++]=point.z;
  }
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.computeBoundingSphere();
 const mesh=new THREE.Mesh(geometry,material);mesh.name='Original room depth / one static draw';mesh.matrixAutoUpdate=false;
 return{mesh,status:{sourceMeshes:sources.length,depthDrawCalls:1,triangles:vertices/3,originalTrianglesPreserved:true}};
}
