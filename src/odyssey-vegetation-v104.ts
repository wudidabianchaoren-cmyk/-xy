import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** Real coastal tree topology, UVs and leaf alpha; distributed at existing grounded positions. */
export async function coastalWoodland(scene:THREE.Scene,time:{value:number}){
 const model=(await new GLTFLoader().loadAsync('./assets/odyssey/vegetation-v104/island_tree_01/tree-web-v104.glb')).scene;
 const textureLoader=new THREE.TextureLoader(),[leafColor,leafAlpha]=await Promise.all([textureLoader.loadAsync('./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_diff_1k.jpg'),textureLoader.loadAsync('./assets/odyssey/vegetation-v104/island_tree_01/textures/island_tree_01_leaves_alpha_1k.png')]);leafColor.colorSpace=THREE.SRGBColorSpace;leafColor.flipY=leafAlpha.flipY=false;leafColor.anisotropy=leafAlpha.anisotropy=8;
 model.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),height=bounds.max.y-bounds.min.y;
 const source:THREE.Mesh[]=[];model.traverse(o=>{if(o instanceof THREE.Mesh)source.push(o);});
 const trunks:THREE.InstancedMesh[]=[];scene.traverse(o=>{if(o instanceof THREE.InstancedMesh&&o.name==='Mixed forest grounded trunks')trunks.push(o);});
 let trees=0,parts=0,triangles=0;const outputs:THREE.InstancedMesh[]=[];const lods:{near:THREE.InstancedMesh;far:THREE.InstancedMesh;matrices:THREE.Matrix4[]}[]=[];
 const material=(original:THREE.MeshStandardMaterial)=>{
  const m=original.clone(),leaves=/leaves/.test(m.name);m.transparent=false;m.opacity=1;m.depthWrite=true;m.alphaTest=leaves?.15:0;m.alphaToCoverage=leaves;m.side=leaves?THREE.DoubleSide:THREE.FrontSide;m.roughness=leaves?.88:.94;m.envMapIntensity=.55;
  if(leaves){m.map=leafColor;m.alphaMap=leafAlpha;m.emissiveMap=leafColor;m.emissive.set(0xc1d19e);m.emissiveIntensity=.32;}
  m.color.set(leaves?0xe3e8ce:0xf2e7d6);for(const t of [m.map,m.normalMap,m.roughnessMap])if(t)t.anisotropy=8;
  if(m.normalMap)m.normalScale.set(.6,.6);
  m.onBeforeCompile=s=>{
   s.uniforms.forestWind=time;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float forestWind;varying vec3 treePoint;')
    .replace('#include <begin_vertex>','#include <begin_vertex>\ntreePoint=position;transformed.x+=.006*sin(forestWind*.65+position.y*4.+position.z*8.)*smoothstep(.25,1.,position.y);');
   if(leaves)s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 treePoint;').replace('#include <alphatest_fragment>','diffuseColor.a=pow(diffuseColor.a,.60);\n#include <alphatest_fragment>').replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
    float topLeaf=smoothstep(.25,1.,treePoint.y);reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(.22,.28,.12)*topLeaf;`);
  };m.customProgramCacheKey=()=> 'v104-scanned-coastal-tree-'+(leaves?'leaves':'bark');return m;
 };
 for(const old of trunks){
  if(!old.visible)continue;
  const matrices:THREE.Matrix4[]=[];for(let i=0;i<old.count;i++){
   const a=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),scale=new THREE.Vector3();old.getMatrixAt(i,a);a.decompose(p,q,scale);if(scale.y<.01)continue;
   p.y-=scale.y*.5;const shorelineGrowth=THREE.MathUtils.smoothstep(p.y,4.,14.);const h=scale.y/.58*(.70+.26*shorelineGrowth+.12*Math.sin(i*1.61)),angle=(i*2.399)%6.283;
   const tree=new THREE.Object3D(),native=old.userData.v106Plants?.[i];tree.position.copy(native?new THREE.Vector3(native.x,native.y,native.z):p);tree.rotation.set(.025*Math.sin(i*1.7),native?.rotation??angle,.03*Math.cos(i*.7));if(native)tree.scale.set(native.height*native.width,native.height,native.height*native.width);else tree.scale.set(h*(.53+.07*Math.sin(i*3.7)),h,h*(.53+.06*Math.cos(i*2.3)));tree.updateMatrix();matrices.push(tree.matrix.clone());
  }
  for(const prototype of source){
   const g=prototype.geometry.clone().applyMatrix4(prototype.matrixWorld);g.translate(-center.x,-bounds.min.y,-center.z);g.scale(1/height,1/height,1/height);
   const m=Array.isArray(prototype.material)?prototype.material.map(m=>material(m as THREE.MeshStandardMaterial)):material(prototype.material as THREE.MeshStandardMaterial);
   const mesh=new THREE.InstancedMesh(g,m,matrices.length);for(let i=0;i<matrices.length;i++){mesh.setMatrixAt(i,matrices[i]);mesh.setColorAt(i,new THREE.Color().setRGB(.84+.13*((i*17%31)/31),.86+.12*((i*11%29)/29),.77+.19*((i*23%37)/37)));}
   mesh.name='V104 scanned coastal forest / '+(Array.isArray(m)?m[0].name:m.name);mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();old.parent!.add(mesh);outputs.push(mesh);parts++;triangles+=(g.index?g.index.count:g.getAttribute('position').count)/3;
   if(/leaves/.test(mesh.name)){
    const low=g.clone(),p=low.getAttribute('position');const index=low.index!;const selected=Array.from(index.array).slice(0,2400),vertices=new Set(selected);
    // A larger real leaf card keeps far-canopy coverage while reducing invisible fine triangles.
    for(let card=0;card<400;card++){const ids=[card*4,card*4+1,card*4+2,card*4+3],center=new THREE.Vector3();ids.forEach(i=>center.add(new THREE.Vector3().fromBufferAttribute(p,i)));center.multiplyScalar(.25);ids.forEach(i=>{const v=new THREE.Vector3().fromBufferAttribute(p,i).sub(center).multiplyScalar(1.85).add(center);p.setXYZ(i,v.x,v.y,v.z);});}
    low.setIndex(selected);low.computeVertexNormals();low.computeBoundingSphere();const far=new THREE.InstancedMesh(low,m,matrices.length);far.name=mesh.name+' / distant real leaf LOD';far.castShadow=far.receiveShadow=true;far.count=0;old.parent!.add(far);outputs.push(far);lods.push({near:mesh,far,matrices});parts++;
   }
  }trees+=matrices.length;
 }
 scene.traverse(o=>{if(/Dense evergreen oak crown|Mixed umbrella pine crown|Tall cypress canopy|Native Blender leaf detail|Mixed forest grounded trunks|Internal simplified forest shadow|^V104 closed inner/.test(o.name)||o instanceof THREE.InstancedMesh&&o.geometry.type==='CylinderGeometry'&&o.count>1000&&o.geometry.getAttribute('position').count<90&&!o.name.startsWith('V104'))o.visible=false;});
 let lastCamera=new THREE.Vector3(Infinity,Infinity,Infinity);const updateLOD=(camera:THREE.Camera)=>{if(lastCamera.distanceToSquared(camera.position)<9)return;lastCamera.copy(camera.position);for(const {near,far,matrices}of lods){let n=0,f=0;for(let i=0;i<matrices.length;i++){const matrix=matrices[i],distance=Math.hypot(matrix.elements[12]-camera.position.x,matrix.elements[14]-camera.position.z),target=distance<125?near:far,k=distance<125?n++:f++;target.setMatrixAt(k,matrix);target.setColorAt(k,new THREE.Color().setRGB(.84+.13*((i*17%31)/31),.86+.12*((i*11%29)/29),.77+.19*((i*23%37)/37)));}near.count=n;far.count=f;for(const o of[near,far]){o.instanceMatrix.needsUpdate=true;if(o.instanceColor)o.instanceColor.needsUpdate=true;o.computeBoundingSphere();}}};
 return{source:'Poly Haven island_tree_01 / CC0 / real branches, trunk, foliage and alpha',trees,prototypeParts:parts,prototypeTriangles:triangles,farLeafTriangles:800,lodDistance:125,updateLOD,outputs};
}
