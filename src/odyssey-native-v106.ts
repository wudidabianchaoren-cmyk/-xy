import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
type Plant={x:number;y:number;z:number;height:number;width:number;rotation:number};
/** Geometry actually made via the visible Blender MCP, shared with the native scene. */
export async function loadNativeIslandV106(scene:THREE.Scene){
 const loader=new GLTFLoader(),folder='./blender/mythology-v32-106/';
 const [land,figure,cover,manifest]=await Promise.all([loader.loadAsync(folder+'island-geometry-v106.glb'),loader.loadAsync(folder+'cyclops-male-v106.glb'),loader.loadAsync(folder+'groundcover-v106.glb'),fetch(folder+'woodland-placement.json').then(r=>{if(!r.ok)throw Error('V106 woodland manifest missing');return r.json() as Promise<{trees:Plant[]}>;})]);
 scene.updateMatrixWorld(true);land.scene.updateMatrixWorld(true);let source:THREE.Mesh|undefined,target:THREE.Mesh|undefined;
 land.scene.traverse(o=>{if(o instanceof THREE.Mesh)source=o;});scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.userData.native84Key==='native84_19')target=o;});
 if(!source||!target)throw Error('Native V106 island or original surface missing');
 const geometry=source.geometry.clone().applyMatrix4(source.matrixWorld).applyMatrix4(target.matrixWorld.clone().invert());geometry.computeVertexNormals();
 const p=geometry.getAttribute('position'),uv=new Float32Array(p.count*2),habitat=new Float32Array(p.count*3),point=new THREE.Vector3(),normal=new THREE.Vector3(),normalMatrix=new THREE.Matrix3().getNormalMatrix(target.matrixWorld),normals=geometry.getAttribute('normal');
 for(let i=0;i<p.count;i++){
  point.fromBufferAttribute(p,i).applyMatrix4(target.matrixWorld);normal.fromBufferAttribute(normals,i).applyMatrix3(normalMatrix).normalize();uv[i*2]=point.x/2;uv[i*2+1]=point.z/2;
  const angle=Math.atan2((-point.z-145)/103,(point.x+65)/164),distance=Math.abs(Math.atan2(Math.sin(angle+Math.PI/2),Math.cos(angle+Math.PI/2))),bay=1-THREE.MathUtils.smoothstep(distance,.28,.74);
  const sand=bay*(1-THREE.MathUtils.smoothstep(point.y,1.6,4.3))*THREE.MathUtils.smoothstep(normal.y,.70,.94),grass=THREE.MathUtils.smoothstep(point.y,4.5,9.5)*(1-sand)*THREE.MathUtils.smoothstep(normal.y,.65,.92);habitat.set([sand,grass,Math.max(0,1-sand-grass)],i*3);
 }
 geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.setAttribute('habitat',new THREE.BufferAttribute(habitat,3));(geometry as any).boundsTree=new MeshBVH(geometry);target.geometry=geometry;target.raycast=acceleratedRaycast;
 let removedBatches=0;scene.traverse(o=>{
  if(o instanceof THREE.Mesh){const key=o.userData.native84Key||'';if(/^native84_(20|21|22|23|24|25)$/.test(key)){o.visible=false;o.userData.inactiveTerrain=true;}}
  if(o instanceof THREE.InstancedMesh&&/forest|crown|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured/i.test(o.name)&&!o.userData.variant){o.visible=false;removedBatches++;}
 });
 const oldGiant=scene.children.find(o=>/Native V20 complete/.test(o.name));if(oldGiant)oldGiant.visible=false;
 // This source is consumed by the existing photographed tree renderer, with exact native positions.
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.17,1,6),new THREE.MeshStandardMaterial({color:0x403627}),manifest.trees.length),d=new THREE.Object3D();trunks.name='Mixed forest grounded trunks';trunks.userData.v106Plants=manifest.trees;
 for(let i=0;i<manifest.trees.length;i++){const t=manifest.trees[i];d.position.set(t.x,t.y+t.height*.29,t.z);d.rotation.set(0,t.rotation,0);d.scale.set(t.width,t.height*.58,t.width);d.updateMatrix();trunks.setMatrixAt(i,d.matrix);}trunks.computeBoundingSphere();scene.add(trunks);
 const atlas=await new THREE.TextureLoader().loadAsync('./assets/odyssey/pbr-v103/skin-atlas.png');atlas.colorSpace=THREE.SRGBColorSpace;atlas.flipY=false;atlas.anisotropy=8;
 const skin=new THREE.MeshPhysicalMaterial({map:atlas,color:0xc9b49e,roughness:.76,envMapIntensity:.65,specularIntensity:.25,side:THREE.DoubleSide});skin.name='V106 reshaped male cyclops / original skin photograph and pores';
 skin.onBeforeCompile=s=>{
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 maleSkin;').replace('#include <begin_vertex>','#include <begin_vertex>\nmaleSkin=position;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 maleSkin;').replace('#include <map_fragment>',`#include <map_fragment>
   float pigment=.5+.5*sin(maleSkin.x*29.+sin(maleSkin.z*37.))*sin(maleSkin.y*43.);diffuseColor.rgb*=mix(vec3(.82,.78,.71),vec3(1.02,.98,.92),pigment);`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   float relief=sin(maleSkin.x*2300.+sin(maleSkin.z*1770.))*sin(maleSkin.y*1930.)*.000032;
   vec3 a=dFdx(-vViewPosition),b=dFdy(-vViewPosition),c=cross(b,normal),d=cross(normal,a);float dt=dot(a,c);normal=normalize(abs(dt)*normal-sign(dt)*(dFdx(relief)*c+dFdy(relief)*d));`);
 };skin.customProgramCacheKey=()=> 'v106-actual-male-anatomy-skin';
 const giant=figure.scene;giant.name='V106 actual MCP male cyclops';giant.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=o.receiveShadow=true;if(!/pupil|iris|eyeball|beard|facial hair/i.test(o.name)){o.material=skin;}else for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial)m.envMapIntensity=.45;}});scene.add(giant);
 cover.scene.name='V106 actual MCP curved coastal ground cover';cover.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.receiveShadow=true;o.castShadow=false;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){m.side=THREE.DoubleSide;m.envMapIntensity=.8;m.roughness=.95;}}});scene.add(cover.scene);
 const bounds=new THREE.Box3().setFromObject(target),giantBounds=new THREE.Box3().setFromObject(giant);return{version:106,actualBlenderMcpGeometry:true,vertices:p.count,worldBounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},trees:manifest.trees.length,removedOldBatches:removedBatches,giantCenter:giantBounds.getCenter(new THREE.Vector3()),giantHeight:giantBounds.max.y-giantBounds.min.y,giant,newMeshes:[...cover.scene.children,...giant.children].filter(o=>o instanceof THREE.Mesh) as THREE.Mesh[]};
}
