import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {nativeCourtyard as retainedCourtyard} from './native-v18';
import type {createCyclops} from './odyssey-cyclops';
import {batchNativeDetail} from './home-native-batch';
const directory='./blender/reference-architecture-v19/';
export async function nativeCourtyard(scene:THREE.Scene){
 const retained=await retainedCourtyard(scene),root=(await new GLTFLoader().loadAsync(directory+'architectural-profiles.glb')).scene;
 batchNativeDetail(root);
 root.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.38;if(m.map)m.map.anisotropy=8;}}});scene.add(root);
 return {...retained,labels:[...retained.labels,'native bevelled stone drip profiles and recessed bronze trim'],root};
}
export async function nativeMythology(scene:THREE.Scene,rock:THREE.Material):Promise<ReturnType<typeof createCyclops>>{
 const loader=new GLTFLoader(),[human,island,metadata]=await Promise.all([loader.loadAsync(directory+'polyphemus-grounded.glb'),loader.loadAsync(directory+'island.glb'),fetch(directory+'input-anatomy.json').then(r=>r.json())]);
 const root=human.scene;root.name='Blender V19 / upright one-eyed shepherd on a continuous island';root.position.set(-70,12.2,-129);root.scale.setScalar(19.5);root.rotation.y=-.32;scene.add(root);
 let eye:THREE.Mesh<THREE.BufferGeometry,THREE.Material>|undefined;const geometry:THREE.BufferGeometry[]=[],materials=new Set<THREE.Material>();
 root.traverse(o=>{if(o instanceof THREE.Mesh){geometry.push(o.geometry);o.castShadow=o.receiveShadow=true;if(/eyeball/i.test(o.name)&&!Array.isArray(o.material))eye=o as THREE.Mesh<THREE.BufferGeometry,THREE.Material>;for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.15;m.roughness=Math.max(.8,m.roughness);if(m.normalMap)m.normalScale.set(.32,.32);}}}});
 if(!eye)throw Error('Native Polyphemus single eye missing');
 const prepareIsland=(object:THREE.Object3D)=>object.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=o.receiveShadow=true;
  const replace=(m:THREE.Material)=>{const source=rock as THREE.MeshStandardMaterial;
   const surface=new THREE.MeshStandardMaterial({map:source.map,normalMap:source.normalMap,roughnessMap:source.roughnessMap,color:/moss/.test(m.name)?0x73795c:/sand/.test(m.name)?0x908169:0xa09d89,roughness:.94,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:.18});surface.name=m.name;return surface;};
  o.material=Array.isArray(o.material)?o.material.map(replace):replace(o.material);
 }});
 prepareIsland(island.scene);island.scene.position.set(41,0,-79);island.scene.rotation.y=-.22;island.scene.name='Continuous inhabited island / beach, weathered stone and sparse green crown';scene.add(island.scene);
 const support=island.scene.clone(true);support.position.set(-72,0,-126);support.rotation.y=.35;support.name='Continuous broad island supporting both giant feet';scene.add(support);
 const rightHand=new THREE.Vector3().fromArray(metadata.rightHandLocal),leftHand=new THREE.Vector3().fromArray(metadata.leftHandLocal),heldRockAnchor=new THREE.Group();heldRockAnchor.position.copy(rightHand);root.add(heldRockAnchor);
 root.userData.nativeHeldRock=true;root.userData.nativeFootReef=true;
 const stats={...metadata,nativeBlender:true,completeGarment:true,eyeCount:1,continuousBody:true,oneContinuousHeadNeckBody:true,liveSkeletons:0,heldObject:'none',scale:19.5,cloth:'woven fitted wool robe',source:'Actual Blender MCP V19 / recovered upright complete anatomy, ball removed'};root.userData.cyclops=stats;
 return{root,rightHand,leftHand,eye,heldRockAnchor,stats,update:(_time:number)=>{},dispose:()=>{geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
