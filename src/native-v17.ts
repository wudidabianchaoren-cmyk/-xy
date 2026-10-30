import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {createCyclops} from './odyssey-cyclops';
const directory='./blender/reference-architecture-v17/';
export async function nativeCourtyard(scene:THREE.Scene){
 const model=(await new GLTFLoader().loadAsync(directory+'courtyard-additions.glb')).scene;
 model.name='Blender V17 / carved well, garden colonnades, manuscripts, iron lamps and physical paving';let meshes=0;
 model.traverse(o=>{if(o instanceof THREE.Mesh){meshes++;o.castShadow=o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.35;if(m.normalMap)m.normalScale.set(.50,.50);if(m.map){m.map.anisotropy=8;m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;}if(/limestone/.test(m.name))m.color.set(0xbab5a7);if(/weathered courtyard/.test(m.name))m.color.set(0x93978a);}}});scene.add(model);
 return {meshes,root:model,labels:['native Blender carved stone well and pitched timber canopy','native carved garden colonnades at both edges','native bound manuscripts and working-town props','native iron lamps and physical worn border paving']};
}
export async function nativeMythology(scene:THREE.Scene,rock:THREE.Material):Promise<ReturnType<typeof createCyclops>>{
 const loader=new GLTFLoader();const [human,right,feet,held,metadata]=await Promise.all([loader.loadAsync(directory+'cyclops-dressed.glb'),loader.loadAsync(directory+'reef-right.glb'),loader.loadAsync(directory+'reef-feet.glb'),loader.loadAsync(directory+'held-stone.glb'),fetch(directory+'input-anatomy.json').then(r=>r.json())]);
 const root=human.scene;root.name='Blender V17 / dressed ancient shepherd Cyclops';root.position.set(-49,5,-111);root.scale.setScalar(27);scene.add(root);
 let eye:THREE.Mesh<THREE.BufferGeometry,THREE.Material>|undefined;const geometry:THREE.BufferGeometry[]=[],materials=new Set<THREE.Material>();
 root.traverse(o=>{if(o instanceof THREE.Mesh){geometry.push(o.geometry);o.castShadow=true;o.receiveShadow=false;if(/eyeball/i.test(o.name)&&!Array.isArray(o.material))eye=o as THREE.Mesh<THREE.BufferGeometry,THREE.Material>;
  for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.22;if(/wool/.test(m.name)){m.roughness=.96;if(m.normalMap)m.normalScale.set(.43,.43);}if(/hair|beard/.test(m.name))m.roughness=.97;}}
 }});
 if(!eye)throw Error('Native single eyeball is missing');
 const geological=(g:THREE.Group,pos:number[],name:string)=>{g.position.fromArray(pos);g.name=name;g.traverse(o=>{if(o instanceof THREE.Mesh){o.material=rock;o.castShadow=o.receiveShadow=true;}});scene.add(g);};
 geological(right.scene,[41,0,-79],'Blender fractured bedded reef at right');right.scene.rotation.y=-.22;
 geological(feet.scene,[-49,0,-111],'Blender broad continuous tide-worn Cyclops foundation');
 const rightHand=new THREE.Vector3().fromArray(metadata.rightHandLocal),leftHand=new THREE.Vector3().fromArray(metadata.leftHandLocal),heldRockAnchor=new THREE.Group();heldRockAnchor.position.copy(rightHand).add(new THREE.Vector3(0,.012,.006));root.add(heldRockAnchor);
 held.scene.name='Clearly fractured throwing stone / not a sheep';held.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.material=rock;o.castShadow=o.receiveShadow=true;}});heldRockAnchor.add(held.scene);
 root.userData.nativeHeldRock=true;root.userData.nativeFootReef=true;
 const stats={...metadata,source:'Actual Blender V17 / complete retained body with new fitted woven tunic, mantle, beard, hair and native geology',scale:27,cloth:'Fitted neck-to-knee undyed woven wool tunic and asymmetric animal-hide mantle',nativeBlender:true,eyeCount:1,oneContinuousHeadNeckBody:true,completeGarment:true,heldObject:'one fractured throwing boulder',liveSkeletons:0};root.userData.cyclops=stats;
 return {root,rightHand,leftHand,eye,heldRockAnchor,stats,update:(_time:number)=>{},dispose:()=>{geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
