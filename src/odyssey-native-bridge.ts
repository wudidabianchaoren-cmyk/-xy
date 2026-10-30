import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export function nativeMeshList(scene:THREE.Scene){
 const list:THREE.Mesh[]=[];
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh)||o instanceof THREE.InstancedMesh)return;
  let p:THREE.Object3D|null=o,selected=false;
  while(p){if(/flagship|galley|scout|provision ship|Native V20 complete|Blender V20.*inhabited|Secondary green headland|Native V21|Closed continent/i.test(p.name))selected=true;p=p.parent;}
  if(selected&&!((Array.isArray(o.material)?o.material:[o.material]).some(m=>m instanceof THREE.ShaderMaterial))){o.userData.native84Key='native84_'+list.length;list.push(o);}
 });return list;
}
export function exportNativeInput(scene:THREE.Scene,camera:THREE.PerspectiveCamera,list:THREE.Mesh[]){
 scene.updateMatrixWorld(true);
 const v=new THREE.Vector3(),meshes=list.map(o=>{
  const g=o.geometry,p=g.getAttribute('position'),vertices:number[]=[];
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);if(o instanceof THREE.SkinnedMesh)o.applyBoneTransform(i,v);v.applyMatrix4(o.matrixWorld);vertices.push(...v.toArray());}
  const m=(Array.isArray(o.material)?o.material[0]:o.material) as THREE.MeshStandardMaterial;
  const imagePath=(t:THREE.Texture|null)=>{const im=t?.image;return typeof im?.src==='string'?new URL(im.src,location.href).pathname.slice(1):null;};
  return {key:o.userData.native84Key,name:o.name,visible:o.visible,skinned:o instanceof THREE.SkinnedMesh,vertices,index:g.index?Array.from(g.index.array):null,uv:g.getAttribute('uv')?Array.from(g.getAttribute('uv').array):null,color:m.color?.toArray()??[.3,.3,.3],roughness:m.roughness,metalness:m.metalness,map:imagePath(m.map),normalMap:imagePath(m.normalMap),roughnessMap:imagePath(m.roughnessMap),groups:g.groups};
 });
 const trees:any[]=[];scene.traverse(o=>{if(o instanceof THREE.InstancedMesh&&/forest|canop|trunk|pine|oak/i.test(o.name)){const matrices:number[][]=[];const m=new THREE.Matrix4();for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);matrices.push(o.matrixWorld.clone().multiply(m).elements);}trees.push({name:o.name,matrices});}});
 return {source:'V32.83 actual current expanded world geometry',coordinateSystem:'Three.js right-handed Y-up',meshes,trees,camera:{position:camera.position.toArray(),target:[-29,27,-85],fov:camera.fov},sun:{position:[-45,45,-160],target:[-12,8,-15]}};
}
export async function applyNativeRefinement(list:THREE.Mesh[],scene:THREE.Scene){
 const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
 const patch=(await new GLTFLoader().loadAsync('./blender/mythology-v32-95/refined-world.glb')).scene;
 patch.updateMatrixWorld(true);const byKey=new Map(list.map(o=>[o.userData.native84Key,o]));let geometry=0,materials=0;
 const groups=new Map<string,THREE.Mesh[]>();patch.traverse(o=>{if(!(o instanceof THREE.Mesh))return;let node:THREE.Object3D|null=o,key:string|undefined;while(node&&!key){key=/native84_\d+/.exec(node.name)?.[0];node=node.parent;}if(key){const a=groups.get(key)??[];a.push(o);groups.set(key,a);}});
 for(const [key,meshes]of groups){const original=byKey.get(key);if(!original)continue;
  const gs=meshes.map(o=>o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(original.matrixWorld.clone().invert()));
  if(!(original instanceof THREE.SkinnedMesh)){const g=gs.length===1?gs[0]:mergeGeometries(gs,true);if(g){original.geometry=g;geometry++;}}
  const ms=meshes.flatMap(o=>Array.isArray(o.material)?o.material:[o.material]);
  for(const m of ms){if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.22;if(m.aoMap)m.aoMapIntensity=.65;for(const t of [m.map,m.normalMap,m.roughnessMap,m.metalnessMap,m.aoMap])if(t){t.anisotropy=8;t.needsUpdate=true;}m.side=THREE.DoubleSide;}}
  if(!/Wind-filled linen sail/.test(original.name)&&!(original instanceof THREE.SkinnedMesh))original.material=ms.length===1?ms[0]:ms;materials++;
 }
 const forest=(await new GLTFLoader().loadAsync('./blender/mythology-v32-84/forest-crowns.glb')).scene;forest.updateMatrixWorld(true);let forestClusters=0;
 const prototypes:THREE.Mesh[]=[];forest.traverse(o=>{if(o instanceof THREE.Mesh)prototypes.push(o);});
 scene.traverse(o=>{if(!(o instanceof THREE.InstancedMesh)||!/Dense evergreen oak crown|Mixed umbrella pine crown/.test(o.name))return;const p=prototypes.find(p=>p.name.includes(o.name.includes('oak')?'oak':'pine'));if(!p)return;
  const g=p.geometry.clone().applyMatrix4(p.matrixWorld),m=(Array.isArray(p.material)?p.material[0]:p.material) as THREE.MeshStandardMaterial;m.side=THREE.DoubleSide;m.transparent=false;m.alphaTest=.35;m.alphaToCoverage=true;m.roughness=.94;m.envMapIntensity=.19;if(m.map)m.map.anisotropy=8;
  const detail=new THREE.InstancedMesh(g,m,Math.ceil(o.count/2)),matrix=new THREE.Matrix4();for(let i=0;i<detail.count;i++){o.getMatrixAt(i*2,matrix);detail.setMatrixAt(i,matrix);}detail.name='Native Blender leaf detail / '+o.name;detail.receiveShadow=true;detail.castShadow=false;o.parent?.add(detail);forestClusters+=detail.count;
 });
 const aoMaterials=list.filter(o=>(Array.isArray(o.material)?o.material:[o.material]).some(m=>m instanceof THREE.MeshStandardMaterial&&m.aoMap)).length;
 const fleet=(await new GLTFLoader().loadAsync('./blender/mythology-v32-85/fleet-details.glb')).scene;fleet.updateMatrixWorld(true);const boatRoots:THREE.Object3D[]=[];scene.traverse(o=>{if(o.userData.variant!==undefined&&o.name.match(/flagship|galley|scout|provision ship/))boatRoots.push(o);});let fleetDetails=0;
 const extras:THREE.Mesh[]=[];fleet.traverse(o=>{if(o instanceof THREE.Mesh)extras.push(o);});for(const o of extras){const variant=o.name.includes('escort')?1:o.name.includes('scout')?2:3,root=boatRoots.find(r=>r.userData.variant===variant);if(!root)continue;const g=o.geometry.clone().applyMatrix4(o.matrixWorld).applyMatrix4(root.matrixWorld.clone().invert()),detail=new THREE.Mesh(g,o.material);detail.name=o.name;detail.castShadow=detail.receiveShadow=true;root.add(detail);fleetDetails++;}
 return {source:'Blender 5.1.2 / V32.95 native ridges and layered PBR',geometry,materials,aoMaterials,forestClusters,fleetDetails};
}
