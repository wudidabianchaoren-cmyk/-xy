import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
/** Actual Blender geometry, with all dependent plants moved by old-to-new ground height. */
export async function replaceIslandSurface(scene:THREE.Scene){
 scene.updateMatrixWorld(true);const old:THREE.Mesh[]=[];
 scene.traverse(o=>{if(o instanceof THREE.Mesh&&/^native84_(19|20|21|22)$/.test(o.userData.native84Key||''))old.push(o);});
 if(old.length!==4)throw Error('V105 expected all four original island surface parts');
 const gltf=await new GLTFLoader().loadAsync('./blender/mythology-v32-105/island-geometry-v105.glb');gltf.scene.updateMatrixWorld(true);
 const mesh=old.find(o=>o.userData.native84Key==='native84_19')!;let source:THREE.Mesh|undefined;gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh)source=o;});
 if(!source)throw Error('V105 native continuous island missing');
 const g=source.geometry.clone().applyMatrix4(source.matrixWorld).applyMatrix4(mesh.matrixWorld.clone().invert());
 const coordinates=g.getAttribute('position'),uv=new Float32Array(coordinates.count*2),point=new THREE.Vector3();for(let i=0;i<coordinates.count;i++){point.fromBufferAttribute(coordinates,i).applyMatrix4(mesh.matrixWorld);uv[i*2]=point.x/2.2;uv[i*2+1]=point.z/2.2;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
 (g as any).boundsTree=new MeshBVH(g);const surface=new THREE.Mesh(g,mesh.material);surface.matrixAutoUpdate=false;surface.matrix.copy(mesh.matrix);surface.matrixWorld.copy(mesh.matrixWorld);surface.raycast=acceleratedRaycast;
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),matrix=new THREE.Matrix4(),world=new THREE.Matrix4(),p=new THREE.Vector3();(ray as any).firstHitOnly=true;
 const ground=(objects:THREE.Mesh[],x:number,z:number)=>{ray.set(new THREE.Vector3(x,120,z),down);return ray.intersectObjects(objects,false)[0]?.point.y;};let batches=0,shifted=0;
 scene.traverse(o=>{if(!(o instanceof THREE.InstancedMesh)||!/forest|canop|trunk|pine|oak|understory|leaf litter|branch|cypress|grounded meadow|Naturally exposed|V95 fractured/i.test(o.name))return;
  const inv=o.matrixWorld.clone().invert();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);world.multiplyMatrices(o.matrixWorld,matrix);p.setFromMatrixPosition(world);const a=ground(old,p.x,p.z),b=ground([surface],p.x,p.z);if(a===undefined||b===undefined)continue;p.y+=b-a;world.setPosition(p);matrix.multiplyMatrices(inv,world);o.setMatrixAt(i,matrix);shifted++;}o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();batches++;
 });
 const giant=scene.children.find(o=>/Native V20 complete/.test(o.name));if(giant){const a=ground(old,giant.position.x,giant.position.z),b=ground([surface],giant.position.x,giant.position.z);if(a!==undefined&&b!==undefined)giant.position.y+=b-a;}
 mesh.geometry=g;mesh.raycast=acceleratedRaycast;
 for(const o of old)if(o!==mesh){o.visible=false;o.userData.inactiveTerrain=true;}
 return {version:105,nativeGeometry:true,joinedSurfaceParts:4,shiftedDependentInstances:shifted,plantBatches:batches,vertices:g.getAttribute('position').count,source:'Blender V105 continuous lower island; original shore and cave retained'};
}
