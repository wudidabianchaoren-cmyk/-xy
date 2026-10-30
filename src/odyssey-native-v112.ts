import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
type Ship={root:THREE.Group;sails:unknown[]};
/** Actual visible Blender MCP production, with a separately simplified live canopy. */
export async function loadNativeWorldV112(scene:THREE.Scene,ships:Ship[],prepare:(m:THREE.MeshStandardMaterial)=>void){
 const loader=new GLTFLoader(),folder='./blender/mythology-v32-112/';
 const [land,cliffs,forest,fleet,figure]=await Promise.all(['island','cliffs','biome-web','fleet','cyclops'].map(n=>loader.loadAsync(folder+n+'-v112.glb')));
 scene.updateMatrixWorld(true);land.scene.updateMatrixWorld(true);
 let source:THREE.Mesh|undefined,target:THREE.Mesh|undefined;
 land.scene.traverse(o=>{if(o instanceof THREE.Mesh)source=o;});scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.userData.native84Key==='native84_19')target=o;});
 if(!source||!target)throw Error('V112 actual native island and habitat surface required');
 const geometry=source.geometry.clone().applyMatrix4(source.matrixWorld).applyMatrix4(target.matrixWorld.clone().invert());geometry.computeVertexNormals();
 const color=geometry.getAttribute('color_1')||geometry.getAttribute('color');if(!color)throw Error('Actual Blender Habitat colours missing');
 const habitat=new Float32Array(color.count*3);for(let i=0;i<color.count;i++)habitat.set([color.getX(i),color.getY(i),color.getZ(i)],i*3);
 geometry.setAttribute('habitat',new THREE.BufferAttribute(habitat,3));(geometry as any).boundsTree=new MeshBVH(geometry);target.geometry=geometry;target.raycast=acceleratedRaycast;
 const ground=(Array.isArray(target.material)?target.material[0]:target.material) as THREE.MeshStandardMaterial;
 const prior=ground.onBeforeCompile;ground.onBeforeCompile=(shader,r)=>{prior.call(ground,shader,r);shader.fragmentShader=shader.fragmentShader.replace('pbrWorld/13.','pbrWorld/6.5').replace('vec3(1.85,1.72,1.53)','vec3(1.10,1.10,1.02)').replace('vec3(.75,1.05,.60)','vec3(.65,.79,.55)');};ground.customProgramCacheKey=()=> 'v112-actual-native-habitats';ground.needsUpdate=true;
 let hiddenOld=0;scene.traverse(o=>{
  if(o===target)return;
  const oldKey=Number(String(o.userData.native84Key||'').split('_')[1]);
  if(oldKey>=20&&oldKey<=32||/^(Wet fractured littoral rock|coastal_cliff_02_LOD0)$/.test(o.name)){o.visible=false;hiddenOld++;}
  if(/^V106 actual MCP/.test(o.name)){o.visible=false;hiddenOld++;}
  if(o instanceof THREE.InstancedMesh&&!hasVesselParent(o)&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured|V104 broken coastal|V104 granular/i.test(o.name)){o.visible=false;hiddenOld++;}
 });
 const materials=new Set<THREE.MeshStandardMaterial>();
 function finish(root:THREE.Object3D){root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.85;if(!materials.has(m)){materials.add(m);prepare(m);if(/linen|hemp/i.test(m.name)){const previous=m.onBeforeCompile;m.onBeforeCompile=(s,r)=>{previous.call(m,s,r);s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat flax=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=vec3(flax*1.20,flax*1.09,flax*.89);');};m.customProgramCacheKey=()=> 'v112-neutral-photographed-flax-'+m.uuid;m.needsUpdate=true;}}}});}
 cliffs.scene.name='V112 actual scanned limestone headlands';finish(cliffs.scene);scene.add(cliffs.scene);
 figure.scene.name='V112 actual re-grounded anatomical cyclops';finish(figure.scene);scene.add(figure.scene);
 // Shared scanned tree geometry becomes three real instanced batches, rather than hundreds of draw calls.
 forest.scene.updateMatrixWorld(true);const flora=new THREE.Group();flora.name='V112 native biomes / live geometric LOD';const batches=new Map<string,{g:THREE.BufferGeometry;m:THREE.Material|THREE.Material[];matrices:THREE.Matrix4[];name:string}>();
 forest.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const key=o.geometry.uuid+'|'+(Array.isArray(o.material)?o.material.map(m=>m.uuid).join(','):o.material.uuid);let group=batches.get(key);if(!group){group={g:o.geometry,m:o.material,matrices:[],name:o.name};batches.set(key,group);}group.matrices.push(o.matrixWorld.clone());});
 for(const b of batches.values()){
  const mesh=new THREE.InstancedMesh(b.g,b.m,b.matrices.length);mesh.name=b.name;mesh.receiveShadow=true;b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.computeBoundingSphere();flora.add(mesh);
  const leaf=(Array.isArray(b.m)?b.m:[b.m]).some(m=>/leaves/i.test(m.name));
  if(leaf){
   // Distant canopy shadows use a low polygon volume; leaf cards keep their full colour pass.
   b.g.computeBoundingBox();const box=b.g.boundingBox!,center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()).multiplyScalar(.43),local=new THREE.Matrix4().compose(center,new THREE.Quaternion(),size);
   const proxy=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,7),new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),b.matrices.length);proxy.name='V112 canopy shadow volume';b.matrices.forEach((m,i)=>proxy.setMatrixAt(i,m.clone().multiply(local)));proxy.computeBoundingSphere();flora.add(proxy);mesh.userData.nativeCanopyColour=true;
  }
 }finish(flora);flora.traverse(o=>{if(o instanceof THREE.Mesh&&(o.userData.nativeCanopyColour||/GROUNDCOVER/.test(o.name)))o.castShadow=false;});scene.add(flora);
 const sails:{mesh:THREE.Mesh;positions:Float32Array;normal:Float32Array;bounds:THREE.Box3}[]=[];
 fleet.scene.updateMatrixWorld(true);
 for(let i=0;i<ships.length;i++){
  const native=fleet.scene.getObjectByName('V112_SHIP_'+i);if(!native)throw Error('Missing distinct native vessel '+i);
  const ship=ships[i];for(const child of ship.root.children)child.visible=false;ship.sails.length=0;
  const inverse=native.matrixWorld.clone().invert(),groups=new Map<THREE.Material,THREE.BufferGeometry[]>(),original:THREE.Mesh[]=[];
  native.traverse(o=>{
   if(!(o instanceof THREE.Mesh))return;
   if(o.userData.role==='sail'){
    const g=o.geometry.clone();g.computeBoundingBox();o.geometry=g;
    sails.push({mesh:o,positions:new Float32Array(g.getAttribute('position').array),normal:new Float32Array(g.getAttribute('normal').array),bounds:g.boundingBox!.clone()});return;
   }
   const mats=Array.isArray(o.material)?o.material:[o.material];
   // Exported editable sources normally have one material per actual plank/body part.
   if(mats.length!==1)return;
   const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
   for(const name of Object.keys(g.attributes))if(!['position','normal','uv'].includes(name))g.deleteAttribute(name);
   if(!g.getAttribute('uv'))g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(g.getAttribute('position').count*2),2));
   const list=groups.get(mats[0])||[];list.push(g);groups.set(mats[0],list);original.push(o);
  });
  for(const [m,gs]of groups){const g=mergeGeometries(gs,false);if(!g)throw Error('Native vessel surface merge failed');const mesh=new THREE.Mesh(g,m);mesh.name='V112 vessel '+i+' actual material batch / '+m.name;native.add(mesh);gs.forEach(g=>g.dispose());}
  for(const o of original)o.parent?.remove(o);
  ship.root.attach(native);native.name='V112 distinct vessel '+i;finish(native);
 }
 const giantBounds=new THREE.Box3().setFromObject(figure.scene),bounds=new THREE.Box3().setFromObject(target);
 return {info:{version:112,actualBlenderMcp:true,hiddenOld,islandVertices:geometry.getAttribute('position').count,woodlandBatches:batches.size,distinctShips:ships.length,curvedSails:sails.length,source:'Actual local Blender V112 native GLBs',seaChanged:false,islandBounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},nativeFile:'blender/mythology-v32-112/05-complete-native-world.blend'},giant:figure.scene,giantCenter:giantBounds.getCenter(new THREE.Vector3()),update:(time:number)=>{
  for(const sail of sails){const p=sail.mesh.geometry.getAttribute('position'),span=sail.bounds.max.x-sail.bounds.min.x,height=sail.bounds.max.z-sail.bounds.min.z;
   for(let i=0;i<p.count;i++){const x=sail.positions[i*3],z=sail.positions[i*3+2],u=(x-sail.bounds.min.x)/Math.max(.01,span),v=(z-sail.bounds.min.z)/Math.max(.01,height),tension=Math.sin(Math.PI*u)*Math.sin(Math.PI*v),motion=.055*tension*Math.sin(time*1.4+x*.6+z*.9);p.setXYZ(i,x+sail.normal[i*3]*motion,sail.positions[i*3+1]+sail.normal[i*3+1]*motion,z+sail.normal[i*3+2]*motion);}p.needsUpdate=true;
  }
 }};
}
function hasVesselParent(o:THREE.Object3D){let p:THREE.Object3D|null=o;while(p){if(p.userData.variant!==undefined)return true;p=p.parent;}return false;}
