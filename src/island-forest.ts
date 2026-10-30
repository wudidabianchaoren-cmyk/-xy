import * as THREE from 'three';
/** Closed mixed canopy: rounded evergreen oak, umbrella pine, tall cypress, varied at grove scale. */
export function denseIslandForest(root:THREE.Group,surface:THREE.Mesh[],center:THREE.Vector3,extent:THREE.Vector3){
 let seed=78041;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
 const geometry=new THREE.IcosahedronGeometry(1,1),pos=geometry.getAttribute('position');
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),s=1+.055*Math.sin(x*12+z*9)*Math.cos(y*13);pos.setXYZ(i,x*s,y*s,z*s);}const baseP:number[]=[],baseN:number[]=[];
 // Small overlapping leaf sprays fill the crown instead of isolated identical diamonds.
 const leafUV:number[]=[];
 for(let i=0;i<90;i++){const a=rnd()*Math.PI*2,y=rnd()*2-1,r=Math.sqrt(1-y*y),point=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r).multiplyScalar(.35+rnd()*.58),tangent=new THREE.Vector3(-Math.sin(a),0,Math.cos(a)).multiplyScalar(.15+rnd()*.06),up=new THREE.Vector3().crossVectors(point,tangent).normalize().multiplyScalar(.10),corners=[point.clone().sub(tangent).sub(up),point.clone().sub(tangent).add(up),point.clone().add(tangent).add(up),point.clone().add(tangent).sub(up)],uv=[[0,0],[0,1],[1,1],[1,0]];for(const k of [0,1,2,0,2,3]){const v=corners[k];baseP.push(v.x,v.y,v.z);baseN.push(point.x,point.y,point.z);leafUV.push(...uv[k]);}}
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(baseP,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(baseN,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(leafUV,2));
 const leafCanvas=document.createElement('canvas');leafCanvas.width=128;leafCanvas.height=96;const paint=leafCanvas.getContext('2d')!;const tint=paint.createLinearGradient(15,48,112,48);tint.addColorStop(0,'#738057');tint.addColorStop(.45,'#abb886');tint.addColorStop(1,'#5b7245');paint.fillStyle=tint;paint.beginPath();paint.moveTo(5,48);paint.bezierCurveTo(38,8,90,5,123,48);paint.bezierCurveTo(90,92,38,88,5,48);paint.fill();paint.strokeStyle='#dae0a97a';paint.lineWidth=1;paint.beginPath();paint.moveTo(7,48);paint.lineTo(121,48);paint.stroke();for(let x=28;x<110;x+=14){paint.beginPath();paint.moveTo(x-8,48);paint.lineTo(x+10,24);paint.moveTo(x-8,48);paint.lineTo(x+10,72);paint.stroke();}const leafMap=new THREE.CanvasTexture(leafCanvas);leafMap.colorSpace=THREE.SRGBColorSpace;leafMap.anisotropy=4;
 // Foliage surface carries small leaf-scale modulation without expensive transparent cards.
 const foliage=(color:number)=>{const m=new THREE.MeshStandardMaterial({map:leafMap,alphaTest:.4,alphaToCoverage:true,color,roughness:.95,envMapIntensity:.16,side:THREE.DoubleSide});m.onBeforeCompile=s=>{
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 canopyPosition;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\ncanopyPosition=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 canopyPosition;').replace('#include <map_fragment>','#include <map_fragment>\nfloat leafGrain=.5+.5*sin(canopyPosition.x*31.+sin(canopyPosition.z*19.))*sin(canopyPosition.y*34.+canopyPosition.z*23.);float grainFade=1.-smoothstep(.07,.35,length(fwidth(canopyPosition)));diffuseColor.rgb*=.82+.12*mix(.5,leafGrain,grainFade);');
 };m.customProgramCacheKey=()=> 'dense-leaf-canopy-v83';return m;};
 const oak=new THREE.InstancedMesh(geometry,foliage(0x475735),10000),pine=new THREE.InstancedMesh(geometry,foliage(0x526742),5000),cypress=new THREE.InstancedMesh(geometry,foliage(0x33452a),2000);
 const bark=new THREE.TextureLoader().load('./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg');bark.colorSpace=THREE.SRGBColorSpace;bark.wrapS=bark.wrapT=THREE.RepeatWrapping;bark.repeat.set(2,5);bark.anisotropy=4;
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.14,.28,1,8),new THREE.MeshStandardMaterial({map:bark,color:0x62563f,roughness:.95}),2600);
 const branches=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.15,1,5),trunks.material,7800);let branchCount=0;
 const shadowMaterial=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});const shadowCanopy=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),shadowMaterial,2600);shadowCanopy.name='Internal simplified forest shadow volumes';
 let trees=0,oc=0,pc=0,cc=0,oakTrees=0,pineTrees=0,cypressTrees=0;const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),d=new THREE.Object3D();
 const coverGeometry=new THREE.BufferGeometry();for(const name of ['position','normal','uv']){const a=geometry.getAttribute(name);coverGeometry.setAttribute(name,new THREE.BufferAttribute(a.array.slice(0,108*a.itemSize),a.itemSize));}const undergrowth=new THREE.InstancedMesh(coverGeometry,foliage(0x617145),7800);let undergrowthCount=0;
 const spacing=3.6;
 for(let gx=-extent.x*.45;gx<extent.x*.45;gx+=spacing)for(let gz=-extent.z*.45;gz<extent.z*.45;gz+=spacing){
  if(trees>=2600)continue;const x=center.x+gx+(rnd()-.5)*spacing*.75,z=center.z+gz+(rnd()-.5)*spacing*.75;
  // Preserve the sea-facing cave approach and sandy coves beneath the dense inland canopy.
  if(Math.hypot(x+70,z+129)<9||(z>-114&&Math.abs(x+72)<9)||(z>-155&&Math.abs(x+103.6)<7))continue;
  ray.set(new THREE.Vector3(x,95,z),down);const hit=ray.intersectObjects(surface,false)[0];if(!hit?.face||hit.point.y<5.5||hit.point.y>39||hit.face.normal.y<.47)continue;
  const h=hit.point.y,choice=rnd(),kind=choice<.62?0:choice<.9?1:2,height=kind===2?13+rnd()*5:kind===1?11+rnd()*5:9+rnd()*5;
  for(let k=0;k<3;k++){d.position.set(x+(rnd()-.5)*3,h+.4+rnd()*.5,z+(rnd()-.5)*3);d.rotation.set(0,rnd()*6.28,0);d.scale.set(1.2+rnd(),.6+rnd()*.7,1.2+rnd());d.updateMatrix();undergrowth.setMatrixAt(undergrowthCount++,d.matrix);}
  d.position.set(x,h+height*.29,z);d.rotation.set((rnd()-.5)*.10,rnd()*6.28,(rnd()-.5)*.10);d.scale.set(1.05+rnd()*.7,height*.58,1.05+rnd()*.7);d.updateMatrix();trunks.setMatrixAt(trees++,d.matrix);
  d.position.set(x,h+height*.75,z);d.scale.set(kind===2?1.2:4.,kind===2?4.:2.8,kind===2?1.2:4.);d.updateMatrix();shadowCanopy.setMatrixAt(trees-1,d.matrix);
  if(kind===0)oakTrees++;else if(kind===1)pineTrees++;else cypressTrees++;
  const crown=kind===0?oak:kind===1?pine:cypress;
  for(let k=0;k<(kind===2?3:4);k++){
   const a=k*2.4+rnd(),r=kind===2?.15:1.5+rnd();d.position.set(x+Math.cos(a)*r,h+height*(kind===2?.45+k*.18:.65+rnd()*.16),z+Math.sin(a)*r);
   if(k<3&&kind!==2){const tip=d.position.clone(),base=new THREE.Vector3(x,h+height*.48,z);d.position.copy(base).add(tip).multiplyScalar(.5);d.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tip.clone().sub(base).normalize());d.scale.set(1.6,tip.distanceTo(base),1.6);d.updateMatrix();branches.setMatrixAt(branchCount++,d.matrix);d.position.copy(tip);}
   d.rotation.set((rnd()-.5)*.12,a,(rnd()-.5)*.12);
   const width=kind===2?1.5+rnd()*.4:3.8+rnd()*1.4;
   d.scale.set(width,kind===2?3.6:kind===1?1.7+rnd()*.7:3.+rnd()*.8,width*(.85+rnd()*.2));d.updateMatrix();
   const idx=kind===0?oc++:kind===1?pc++:cc++;crown.setMatrixAt(idx,d.matrix);crown.setColorAt(idx,new THREE.Color().setRGB(.72+rnd()*.25,.75+rnd()*.25,.64+rnd()*.25));
  }
 }
 oak.count=oc;pine.count=pc;cypress.count=cc;trunks.count=trees;
 undergrowth.count=undergrowthCount;undergrowth.name='Grounded forest understory and leaf litter';undergrowth.receiveShadow=true;undergrowth.computeBoundingSphere();root.add(undergrowth);
 branches.count=branchCount;branches.castShadow=false;branches.receiveShadow=true;branches.computeBoundingSphere();root.add(branches);
 shadowCanopy.count=trees;shadowCanopy.castShadow=true;shadowCanopy.computeBoundingSphere();root.add(shadowCanopy);
 for(const m of [oak,pine,cypress,trunks]){m.castShadow=m===trunks;m.receiveShadow=true;m.computeBoundingSphere();root.add(m);}
 oak.name='Dense evergreen oak crown masses';pine.name='Mixed umbrella pine crown masses';cypress.name='Tall cypress canopy spires';trunks.name='Mixed forest grounded trunks';
 return{additionalWoodlandTrees:trees,woodlandLeafClusters:oc+pc+cc,treeTypes:{evergreenOak:oakTrees,umbrellaPine:pineTrees,cypress:cypressTrees},canopySpacing:spacing};
}
