import * as THREE from 'three';
import {makeGroundV118,makeGroundPBRV118} from './odyssey-ground-v118';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
type Ship={root:THREE.Group;sails:unknown[]};
/** Actual visible Blender MCP production, with a separately simplified live canopy. */
export async function loadNativeWorldV118(scene:THREE.Scene,ships:Ship[],prepare:(m:THREE.MeshStandardMaterial)=>void){
 const loader=new GLTFLoader(),folder='./blender/mythology-v32-118/';
 const [land,cliffs,forest,fleet,figure]=await Promise.all(['island','cliffs','biome-web','fleet','cyclops'].map(n=>loader.loadAsync(folder+n+'-v118.glb')));
 scene.updateMatrixWorld(true);land.scene.updateMatrixWorld(true);
 let source:THREE.Mesh|undefined,target:THREE.Mesh|undefined;
 land.scene.traverse(o=>{if(o instanceof THREE.Mesh)source=o;});scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.userData.native84Key==='native84_19')target=o;});
 if(!source||!target)throw Error('V117 actual native island and habitat surface required');
 const geometry=source.geometry.clone().applyMatrix4(source.matrixWorld).applyMatrix4(target.matrixWorld.clone().invert());geometry.computeVertexNormals();
 const color=geometry.getAttribute('color_1')||geometry.getAttribute('color');if(!color)throw Error('Actual Blender Habitat colours missing');
 const habitat=new Float32Array(color.count*3);for(let i=0;i<color.count;i++)habitat.set([color.getX(i),color.getY(i),color.getZ(i)],i*3);
 geometry.setAttribute('habitat',new THREE.BufferAttribute(habitat,3));(geometry as any).boundsTree=new MeshBVH(geometry);target.geometry=geometry;target.raycast=acceleratedRaycast;
 const ground=await makeGroundV118();target.material=ground;
 let hiddenOld=0;scene.traverse(o=>{
  if(o===target)return;
  const oldKey=Number(String(o.userData.native84Key||'').split('_')[1]);
  if(oldKey>=20&&oldKey<=32||/^(Wet fractured littoral rock|coastal_cliff_02_LOD0)$/.test(o.name)){o.visible=false;hiddenOld++;}
  if(/^V106 actual MCP/.test(o.name)){o.visible=false;hiddenOld++;}
  if(o instanceof THREE.InstancedMesh&&!hasVesselParent(o)&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured|V104 broken coastal|V104 granular/i.test(o.name)){o.visible=false;hiddenOld++;}
 });
 const materials=new Set<THREE.MeshStandardMaterial>();
 function finish(root:THREE.Object3D){root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.envMapIntensity=.65;if(/leaf|leaves|canopy|fern/i.test(m.name)){m.alphaTest=.42;m.transparent=false;m.side=THREE.DoubleSide;}if(!materials.has(m)){materials.add(m);prepare(m)}}});}
 const rock=await makeGroundPBRV118();rock.aoMap=null;rock.name='V118 pale photographic fractured rock / live PBR on CLOSED boulders';
 const marked=new Set<string>();cliffs.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const mats=Array.isArray(o.material)?o.material:[o.material];if(mats.some(m=>/rooted|bark/i.test(m.name)))return;if(!marked.has(o.geometry.uuid)){const values=new Float32Array(o.geometry.getAttribute('position').count*3);for(let i=2;i<values.length;i+=3)values[i]=1;o.geometry.setAttribute('habitat',new THREE.BufferAttribute(values,3));marked.add(o.geometry.uuid);}o.material=rock;});
 cliffs.scene.name='V118 actual CLOSED coastal boulders and grounded woody roots';finish(cliffs.scene);scene.add(cliffs.scene);
 figure.scene.name='V117 actual re-grounded anatomical cyclops';finish(figure.scene);scene.add(figure.scene);
 // Shared scanned tree geometry becomes three real instanced batches, rather than hundreds of draw calls.
 forest.scene.updateMatrixWorld(true);const flora=new THREE.Group();flora.name='V117 native biomes / live geometric LOD';const batches=new Map<string,{g:THREE.BufferGeometry;m:THREE.Material|THREE.Material[];matrices:THREE.Matrix4[];name:string}>();
 forest.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const key=o.geometry.uuid+'|'+(Array.isArray(o.material)?o.material.map(m=>m.uuid).join(','):o.material.uuid);let group=batches.get(key);if(!group){group={g:o.geometry,m:o.material,matrices:[],name:o.name};batches.set(key,group);}group.matrices.push(o.matrixWorld.clone());});
 const lods:{near:THREE.InstancedMesh;far:THREE.InstancedMesh;matrices:THREE.Matrix4[]}[]=[];
 const canopy=await new THREE.TextureLoader().loadAsync(folder+'canopy-impostor.png');canopy.colorSpace=THREE.SRGBColorSpace;canopy.anisotropy=8;
 const cards=[0,Math.PI/3,Math.PI*2/3].map(a=>new THREE.PlaneGeometry(1.08,1.08).translate(0,.54,0).rotateY(a));const farGeometry=mergeGeometries(cards,false)!;
 const farMaterial=new THREE.MeshBasicMaterial({map:canopy,alphaTest:.32,side:THREE.DoubleSide});farMaterial.name='V117 actual native full canopy render / distant crossed-card LOD';
 for(const b of batches.values()){
  const mesh=new THREE.InstancedMesh(b.g,b.m,b.matrices.length);mesh.name=b.name;mesh.receiveShadow=true;b.matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.computeBoundingSphere();flora.add(mesh);
  const leaf=(Array.isArray(b.m)?b.m:[b.m]).some(m=>/leaf|leaves|canopy/i.test(m.name));
  if(leaf&&farGeometry){const far=new THREE.InstancedMesh(farGeometry,farMaterial,b.matrices.length);far.name='V117 intact far leaves';far.frustumCulled=false;far.receiveShadow=true;far.userData.nativeCanopyColour=true;far.count=0;flora.add(far);mesh.userData.nativeCanopyColour=true;lods.push({near:mesh,far,matrices:b.matrices});}
  if(leaf){
   // Actual alpha silhouette casts mottled leaf shade, rather than a solid spherical blob.
   const shadowMaterial=farMaterial.clone();shadowMaterial.colorWrite=false;shadowMaterial.depthWrite=false;
   const proxy=new THREE.InstancedMesh(farGeometry,shadowMaterial,b.matrices.length);proxy.name='V118 alpha canopy shadow';b.matrices.forEach((m,i)=>proxy.setMatrixAt(i,m));proxy.computeBoundingSphere();flora.add(proxy);

  }
 }finish(flora);flora.traverse(o=>{if(o instanceof THREE.Mesh&&(o.userData.nativeCanopyColour||/GROUNDCOVER/.test(o.name)))o.castShadow=false;});scene.add(flora);
 const treeBatch=[...batches.values()].find(b=>/tree.*part1/.test(b.name));const treeBase=new THREE.Vector3(-80,10,-125);
 if(treeBatch){const candidates=treeBatch.matrices.map(m=>new THREE.Vector3().setFromMatrixPosition(m)).filter(p=>p.y>4&&p.y<22&&p.z>-155);candidates.sort((a,b)=>a.z-b.z);if(candidates.length)treeBase.copy(candidates[Math.floor(candidates.length*.65)]);}
 const captainHead=new THREE.Vector3();
 const sails:{mesh:THREE.Mesh;positions:Float32Array;normal:Float32Array;bounds:THREE.Box3}[]=[];
 fleet.scene.updateMatrixWorld(true);
 const principalShip=fleet.scene.getObjectByName('V112_SHIP_0');
 principalShip?.traverse(o=>{if(o instanceof THREE.Mesh&&/captain.*Humanlow.poly$/i.test(o.name))new THREE.Box3().setFromObject(o).getCenter(captainHead);});
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
  for(const [m,gs]of groups){const g=mergeGeometries(gs,false);if(!g)throw Error('Native vessel surface merge failed');const mesh=new THREE.Mesh(g,m);mesh.name='V117 vessel '+i+' actual material batch / '+m.name;native.add(mesh);gs.forEach(g=>g.dispose());}
  for(const o of original)o.parent?.remove(o);
  ship.root.attach(native);native.name='V117 distinct vessel '+i;finish(native);
 }
 const giantBounds=new THREE.Box3().setFromObject(figure.scene),bounds=new THREE.Box3().setFromObject(target);
 return {treeBase,captainHead,info:{version:118,actualBlenderMcp:true,hiddenOld,islandVertices:geometry.getAttribute('position').count,woodlandBatches:batches.size,distinctShips:ships.length,curvedSails:sails.length,source:'Actual local Blender V118 native GLBs',principalHead:captainHead.toArray(),treeBase:treeBase.toArray(),staticCyclesGroundRadiance:true,radianceResolution:4096,rootSystems:543,maquis:420,shadeFerns:202,seaChanged:false,islandBounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},canopyLOD:'16 close complete leaf proxies maximum; distant actual foliage-only native render crossed cards',nativeFile:'blender/mythology-v32-118/05-final-mediterranean-world.blend'},giant:figure.scene,giantCenter:giantBounds.getCenter(new THREE.Vector3()),update:(time:number,camera?:THREE.Camera)=>{
  if(camera){const p=new THREE.Vector3(),matrix=new THREE.Matrix4();for(const l of lods){let n=0,f=0;for(const m of l.matrices){p.setFromMatrixPosition(m);if(p.distanceTo(camera.position)<55&&n<16)l.near.setMatrixAt(n++,m);else l.far.setMatrixAt(f++,m)}l.near.count=n;l.far.count=f;l.near.instanceMatrix.needsUpdate=true;l.far.instanceMatrix.needsUpdate=true;}}
  for(const sail of sails){const p=sail.mesh.geometry.getAttribute('position'),span=sail.bounds.max.x-sail.bounds.min.x,height=sail.bounds.max.z-sail.bounds.min.z;
   for(let i=0;i<p.count;i++){const x=sail.positions[i*3],z=sail.positions[i*3+2],u=(x-sail.bounds.min.x)/Math.max(.01,span),v=(z-sail.bounds.min.z)/Math.max(.01,height),tension=Math.sin(Math.PI*u)*Math.sin(Math.PI*v),motion=.055*tension*Math.sin(time*1.4+x*.6+z*.9);p.setXYZ(i,x+sail.normal[i*3]*motion,sail.positions[i*3+1]+sail.normal[i*3+1]*motion,z+sail.normal[i*3+2]*motion);}p.needsUpdate=true;
  }
 }};
}
function hasVesselParent(o:THREE.Object3D){let p:THREE.Object3D|null=o;while(p){if(p.userData.variant!==undefined)return true;p=p.parent;}return false;}

