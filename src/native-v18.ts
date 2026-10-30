import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {createCyclops} from './odyssey-cyclops';
import {batchNativeDetail} from './home-native-batch';
const directory='./blender/reference-architecture-v18/';
export async function nativeCourtyard(scene:THREE.Scene){
 const root=(await new GLTFLoader().loadAsync(directory+'courtyard-additions.glb')).scene;
 root.updateMatrixWorld(true);const unsupported:THREE.Object3D[]=[];root.traverse(o=>{if(o instanceof THREE.Mesh){const center=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());if(Math.abs(center.x)>10.3&&center.z>-4.5)unsupported.push(o);}});unsupported.forEach(o=>o.removeFromParent());
 batchNativeDetail(root);root.name='Blender V18 / architectural stone benches, cloister lanterns and carved window surrounds';
 let meshes=0;root.traverse(o=>{if(o instanceof THREE.Mesh){meshes++;o.castShadow=o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.24;if(m.normalMap)m.normalScale.set(.65,.65);if(m.map)m.map.anisotropy=8;}}});scene.add(root);
 const lights:THREE.PointLight[]=[];
 for(const [x,y,z] of [[5.55,1.60,.1],[6.65,1.63,.1],[7.75,1.63,.1],[8.85,1.60,.1],[-7.5,2.2,-1.5]]){
  const l=new THREE.PointLight(0xffb968,10,x>5?2.4:4.3,2);l.position.set(x,y,x>5?-.65:z);l.name='Archive cloister warm practical pool';scene.add(l);lights.push(l);
 }
 const sweep=new THREE.SpotLight(0xffd498,95,6,.52,.65,2);sweep.position.set(7.2,1.8,-.45);sweep.target.position.set(7.2,.2,-1.45);scene.add(sweep,sweep.target);
 return{meshes,root,labels:['native carved stone benches attached to the guild walls','native matching Gothic lanterns and manuscript reliefs','native courtyard trim with consistent limestone PBR'],update:(time:number)=>{for(const [i,l] of lights.entries())l.intensity=9.5+2.2*Math.sin(time*.61-i*.55);sweep.target.position.x=7.1+1.8*Math.sin(time*.27);sweep.intensity=85+15*Math.sin(time*.36);},lightEnergy:()=>lights.map(l=>l.intensity)};
}
export async function nativeMythology(scene:THREE.Scene,rock:THREE.Material):Promise<ReturnType<typeof createCyclops>>{
 const loader=new GLTFLoader();const [human,reef,metadata]=await Promise.all([loader.loadAsync(directory+'polyphemus-reclining.glb'),loader.loadAsync(directory+'natural-cliff.glb'),fetch(directory+'input-anatomy.json').then(r=>r.json())]);
 const root=human.scene;root.name='Blender V18 / reclining Polyphemus silhouette along the cliff';root.position.set(-83,23,-133);root.scale.setScalar(24);root.rotation.y=-.12;scene.add(root);
 let eye:THREE.Mesh<THREE.BufferGeometry,THREE.Material>|undefined;const geometry:THREE.BufferGeometry[]=[],materials=new Set<THREE.Material>();
 root.traverse(o=>{if(o instanceof THREE.Mesh){geometry.push(o.geometry);o.castShadow=true;o.receiveShadow=false;if(/eyeball/i.test(o.name)&&!Array.isArray(o.material))eye=o as THREE.Mesh<THREE.BufferGeometry,THREE.Material>;for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.16;m.roughness=Math.max(.83,m.roughness);}}}});
 if(!eye)throw Error('Native Polyphemus single eye missing');
 reef.scene.position.set(-83,-1,-133);reef.scene.scale.y=.42;reef.scene.name='Native low irregular sea ledge connecting the scanned strata';reef.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.material=rock;o.castShadow=o.receiveShadow=true;}});scene.add(reef.scene);
 const rightHand=new THREE.Vector3().fromArray(metadata.rightHandLocal),leftHand=new THREE.Vector3().fromArray(metadata.leftHandLocal),heldRockAnchor=new THREE.Group();heldRockAnchor.position.copy(rightHand);root.add(heldRockAnchor);
 root.userData.nativeHeldRock=true;root.userData.nativeFootReef=true;
 const stats={...metadata,nativeBlender:true,completeGarment:true,eyeCount:1,oneContinuousHeadNeckBody:true,liveSkeletons:0,heldObject:'fractured stone gripped by reclining figure',scale:24,cloth:'woven short wool robe and shoulder mantle',source:'Native Blender V18 using complete MPFB2 anatomy; reclining silhouette follows National Gallery painting description'};
 root.userData.cyclops=stats;
 return{root,rightHand,leftHand,eye,heldRockAnchor,stats,update:(_time:number)=>{},dispose:()=>{geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
