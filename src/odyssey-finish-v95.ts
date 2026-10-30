import * as THREE from 'three';
import {islandGround} from './island-ground';
import {erodedBoulderGeometry} from './odyssey-refinement';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
export function finishMythology(scene:THREE.Scene,rock:THREE.MeshStandardMaterial,boats:THREE.Group[]){
 const terrain:THREE.Mesh[]=[];
 scene.updateMatrixWorld(true);
 scene.traverse(o=>{if(o instanceof THREE.Mesh&&/^native84_(19|20|21|22)$/.test(o.userData.native84Key||'')){
  o.material=islandGround(rock);o.receiveShadow=true;terrain.push(o);
  (o.geometry as any).boundsTree=new MeshBVH(o.geometry);o.raycast=acceleratedRaycast;
 }});
 const ray=new THREE.Raycaster(),matrix=new THREE.Matrix4(),pos=new THREE.Vector3(),inverse=new THREE.Matrix4();
 (ray as any).firstHitOnly=true;
 const ground=(x:number,z:number)=>{ray.set(new THREE.Vector3(x,120,z),new THREE.Vector3(0,-1,0));return ray.intersectObjects(terrain,false)[0];};
 // Move complete vertical plant groups together, with the same native ridge field.
 const lift=(x:number,z:number)=>27*Math.exp(-(((x+107)/66)**2)-((-z-178)/45)**2)+18*Math.exp(-(((x+12)/42)**2)-((-z-183)/36)**2);
 const plants:THREE.InstancedMesh[]=[];scene.traverse(o=>{if(o instanceof THREE.InstancedMesh&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress/i.test(o.name))plants.push(o);});
 for(const plant of plants){inverse.copy(plant.matrixWorld).invert();for(let i=0;i<plant.count;i++){plant.getMatrixAt(i,matrix);pos.setFromMatrixPosition(matrix).applyMatrix4(plant.matrixWorld);if(pos.x>100||pos.z> -45||pos.z< -250)continue;
  const hit=ground(pos.x,pos.z);if(!hit)continue;
  // Ground-following offset is evaluated at the original terrain support, not leaf height.
  let lo=0,hi=hit.point.y;const amount=lift(pos.x,pos.z);for(let q=0;q<18;q++){const mid=(lo+hi)/2;if(mid+amount*THREE.MathUtils.smoothstep(mid,7,20)>hit.point.y)hi=mid;else lo=mid;}const t=THREE.MathUtils.smoothstep((lo+hi)/2,7,20);
  if(hit.point.y>35 || (hit.point.y>18 && Math.sin(pos.x*.043)+Math.cos(pos.z*.051)>.85)){matrix.scale(new THREE.Vector3(0,0,0));plant.setMatrixAt(i,matrix);continue;}
  pos.y+=lift(pos.x,pos.z)*t;pos.applyMatrix4(inverse);matrix.setPosition(pos);plant.setMatrixAt(i,matrix);
 }plant.instanceMatrix.needsUpdate=true;plant.computeBoundingSphere();}
 // One instanced mesh supplies the missing low, connected grass stratum.
 const vertices:number[]=[],colors:number[]=[];let seed=9511;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let b=0;b<11;b++){const a=random()*Math.PI*2,r=random()*.7,x=Math.cos(a)*r,z=Math.sin(a)*r,h=.28+random()*.58,w=.045+random()*.045;vertices.push(x-w,0,z,x+w,0,z,x+Math.cos(a)*.18,h,z+Math.sin(a)*.18);for(let j=0;j<3;j++)colors.push(j===2?.48:.13,j===2?.47:.20,j===2?.19:.065);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();
 const grass=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,side:THREE.DoubleSide,envMapIntensity:.25}),4200);grass.name='V95 grounded meadow / instanced grass';const d=new THREE.Object3D();let count=0;
 for(let i=0;i<6800&&count<4200;i++){const x=-192+random()*267,z=-225+random()*165;if(Math.sin(x*.065)+Math.cos(z*.073)<-.45)continue;const hit=ground(x,z);if(!hit||hit.point.y<4||hit.point.y>34||Math.abs(hit.point.x+70)<15&&Math.abs(hit.point.z+129)<19)continue;d.position.copy(hit.point);d.rotation.set(0,random()*6.28,0);d.scale.setScalar(.8+random()*1.6);d.updateMatrix();grass.setMatrixAt(count++,d.matrix);}grass.count=count;grass.receiveShadow=true;grass.computeBoundingSphere();scene.add(grass);
 const outcrops=new THREE.InstancedMesh(erodedBoulderGeometry(),rock,260);let rockCount=0;
 for(let i=0;i<950&&rockCount<260;i++){const x=-188+random()*225,z=-223+random()*118,hit=ground(x,z);if(!hit||hit.point.y<23)continue;d.position.copy(hit.point);d.position.y-=.6;d.rotation.set(random()*.35,random()*6.28,random()*.3);const scale=2+random()*3.8;d.scale.set(scale,scale*(.55+random()*.65),scale*.8);d.updateMatrix();outcrops.setMatrixAt(rockCount++,d.matrix);}outcrops.count=rockCount;outcrops.name='V95 fractured exposed ridge outcrops';outcrops.castShadow=outcrops.receiveShadow=true;outcrops.computeBoundingSphere();scene.add(outcrops);
 // The flagship has its own elevated stern gallery and closely spaced structural railwork.
 const hero=boats[0],oak=new THREE.MeshStandardMaterial({color:0x624126,roughness:.73,metalness:0,map:(hero.children.find(o=>o instanceof THREE.Mesh && (o.material as THREE.MeshStandardMaterial).map) as THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>)?.material.map||null}),bronze=new THREE.MeshStandardMaterial({color:0xb49a5a,roughness:.39,metalness:.78});
 const rail=new THREE.InstancedMesh(new THREE.CylinderGeometry(.045,.052,1,7),bronze,24);let k=0;
 for(const side of[-1,1])for(let j=0;j<12;j++){const x=4.7+j*.31;d.position.set(x,2.55,side*(1.9-(x-4.7)*.25));d.rotation.set(0,0,0);d.scale.set(1,.95,1);d.updateMatrix();rail.setMatrixAt(k++,d.matrix);}rail.castShadow=true;hero.add(rail);
 const stern=new THREE.Mesh(new THREE.BoxGeometry(3.9,.22,3.25),oak);stern.position.set(6.4,2.12,0);stern.castShadow=stern.receiveShadow=true;hero.add(stern);
 hero.scale.multiplyScalar(1.12);boats[2].scale.z*=.82;boats[3].scale.z*=1.12;
 return{nativeVersion:95,layeredTerrainMeshes:terrain.length,grassTufts:count,groundedPlantBatches:plants.length,heroLength:19*hero.scale.x};
}
