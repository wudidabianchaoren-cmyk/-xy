import * as THREE from 'three';
/** Small physical shelf objects and one warm practical with real book shadows. */
export function shelfProps(root:THREE.Group){
 const brass=new THREE.MeshStandardMaterial({color:0x9c8053,metalness:.78,roughness:.42});
 const fabric=new THREE.MeshStandardMaterial({color:0xbda980,roughness:.86,side:THREE.DoubleSide});
 const paper=new THREE.MeshStandardMaterial({color:0xd9d0b9,roughness:.96});
 const group=new THREE.Group();group.name='V155 physical paper pencil and pendant';root.add(group);
 const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number)=>{const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.castShadow=object.receiveShadow=true;group.add(object);return object;};
 for(let i=0;i<3;i++){const sheet=mesh(new THREE.BoxGeometry(.62,.018,.42),paper,-3.58,.225+i*.019,.43);sheet.rotation.y=-.12+i*.06;}
 const pencil=mesh(new THREE.CylinderGeometry(.018,.018,.72,8),new THREE.MeshStandardMaterial({color:0x4b5144,roughness:.8}),.9,.245,.48);pencil.rotation.z=Math.PI/2;pencil.rotation.y=.20;
 const point=mesh(new THREE.ConeGeometry(.018,.12,8),new THREE.MeshStandardMaterial({color:0x9d8060,roughness:.94}),1.32,.245,.39);point.rotation.z=-Math.PI/2;
 return {objects:5,warmPractical:0,shadowLights:0,shadowMap:1024,bookShadows:true};
}
