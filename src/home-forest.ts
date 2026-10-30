import * as THREE from 'three';
import {courtyardPoint} from './home-restoration';

/** Instanced oak woodland, with curved lobed leaves and actual branch silhouettes. */
export function createArchiveForest(scene:THREE.Scene,timber:{map:THREE.Texture;normalMap:THREE.Texture;roughnessMap:THREE.Texture}){
  let seed=7019;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
  const positions:THREE.Vector3[]=[];
  for(let i=0;i<27;i++)positions.push(courtyardPoint(new THREE.Vector3(-25+i*1.88,0,-20-random()*7)));
  for(const side of [-1,1])for(let i=0;i<7;i++)positions.push(courtyardPoint(new THREE.Vector3(side*(17.5+random()*3.5),0,-1-i*2.3)));
  const bark=new THREE.MeshStandardMaterial({...timber,color:0x665440,roughness:.96,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:.28});
  // A softly lobed silhouette, midrib and veins replace the conspicuous six-sided leaf plates.
  // Keep the existing geometry/instances, so the same 41 trees retain their positions and motion.
  const leafCanvas=document.createElement('canvas');leafCanvas.width=256;leafCanvas.height=512;const paint=leafCanvas.getContext('2d')!;
  const outline=[[128,490],[109,425],[88,432],[93,394],[57,367],[76,342],[43,316],[69,298],[48,267],[75,242],[60,214],[88,192],[76,165],[104,147],[94,121],[116,93],[128,25]];
  paint.beginPath();outline.forEach(([x,y],i)=>i?paint.lineTo(x,y):paint.moveTo(x,y));for(let i=outline.length-2;i>0;i--)paint.lineTo(256-outline[i][0],outline[i][1]);paint.closePath();paint.save();paint.clip();
  const wash=paint.createLinearGradient(0,28,0,490);wash.addColorStop(0,'#becba5');wash.addColorStop(.55,'#a1b587');wash.addColorStop(1,'#748457');paint.fillStyle=wash;paint.fillRect(0,0,256,512);
  let pigmentSeed=16283;const pigment=()=>{pigmentSeed=(Math.imul(pigmentSeed,1664525)+1013904223)|0;return(pigmentSeed>>>0)/4294967296;};
  for(let i=0;i<900;i++){const x=pigment()*256,y=pigment()*512;paint.fillStyle=pigment()>.5?'rgba(239,239,184,.12)':'rgba(36,64,35,.10)';paint.fillRect(x,y,1.5+pigment()*3,1.5+pigment()*3);}
  paint.strokeStyle='rgba(230,231,161,.45)';paint.lineWidth=1.6;paint.beginPath();paint.moveTo(128,482);paint.bezierCurveTo(132,340,122,200,128,33);paint.stroke();
  for(let y=135;y<430;y+=42)for(const side of [-1,1]){paint.strokeStyle='rgba(213,226,169,.22)';paint.lineWidth=.8;paint.beginPath();paint.moveTo(128,y+40);paint.quadraticCurveTo(128+side*25,y+5,128+side*(y<200?39:67),y-12);paint.stroke();}paint.restore();
  const leafMap=new THREE.CanvasTexture(leafCanvas);leafMap.colorSpace=THREE.SRGBColorSpace;leafMap.anisotropy=8;
  const leaves=new THREE.MeshStandardMaterial({map:leafMap,color:0xb8c899,alphaTest:.38,alphaToCoverage:true,roughness:.88,side:THREE.DoubleSide,envMapIntensity:.10});
  const windTime={value:0};leaves.onBeforeCompile=shader=>{shader.uniforms.forestTime=windTime;shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float forestTime;').replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x+=.07*sin(forestTime*.7+instanceMatrix[3].x*.31+instanceMatrix[3].z*.23)*position.z;');};leaves.customProgramCacheKey=()=> 'oak-canopy-breeze-v70';
  const branchGeometry=new THREE.CylinderGeometry(.55,1,1,7,2),branches=new THREE.InstancedMesh(branchGeometry,bark,positions.length*13);
  const points=[0,0,0,-.28,.08,.32,-.32,.11,.7,0,.03,1,.32,.11,.7,.28,.08,.32],leafGeometry=new THREE.BufferGeometry();leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));leafGeometry.setAttribute('uv',new THREE.Float32BufferAttribute([.5,0,.0625,.32,0,.7,.5,1,1,.7,.9375,.32],2));leafGeometry.setIndex([0,1,5,1,2,5,2,4,5,2,3,4]);leafGeometry.computeVertexNormals();
  const foliage=new THREE.InstancedMesh(leafGeometry,leaves,positions.length*900),dummy=new THREE.Object3D();let bi=0,li=0;
  const basePositions:THREE.Vector3[]=[];
  const limb=(a:THREE.Vector3,b:THREE.Vector3,r:number)=>{dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());dummy.scale.set(r,a.distanceTo(b),r);dummy.updateMatrix();branches.setMatrixAt(bi++,dummy.matrix);};
  for(const [index,p] of positions.entries()){
    const height=6.2+random()*3.6,spread=3.8+random()*1.4;limb(p,p.clone().add(new THREE.Vector3(.1,height*.8,.1)),.30+random()*.2);
    const tips:THREE.Vector3[]=[];
    for(let j=0;j<12;j++){const a=j*2.4+index,h=height*(.49+random()*.35),tip=p.clone().add(new THREE.Vector3(Math.cos(a)*spread*(.55+random()*.5),h+1.4,Math.sin(a)*spread*.75));limb(p.clone().add(new THREE.Vector3(0,h*.77,0)),tip,.08+random()*.09);tips.push(tip);}
    for(let j=0;j<900;j++){const center=tips[j%12],a=random()*Math.PI*2,r=Math.sqrt(random())*1.55;dummy.position.copy(center).add(new THREE.Vector3(Math.cos(a)*r,(random()-.5)*1.7,Math.sin(a)*r*.8));basePositions.push(dummy.position.clone());dummy.rotation.set(random()*2.4,random()*Math.PI*2,random()*Math.PI);dummy.scale.setScalar(.18+random()*.14);dummy.updateMatrix();foliage.setMatrixAt(li,dummy.matrix);const crown=Math.max(0,Math.min(1,(dummy.position.y-height*.45)/(height*.6))),depthFade=p.z<-23?.70:1;foliage.setColorAt(li++,new THREE.Color().setHSL(.22+random()*.045,.22+random()*.13,(.13+random()*.065+crown*.08)*depthFade));}
  }
  branches.count=bi;foliage.count=li;branches.instanceMatrix.needsUpdate=foliage.instanceMatrix.needsUpdate=true;
  branches.name='Forty-one oaks: rooted trunks and branching silhouettes';foliage.name='Layered opaque oak foliage with individual curved leaves';branches.castShadow=branches.receiveShadow=true;foliage.receiveShadow=true;foliage.castShadow=false;branches.computeBoundingSphere();foliage.computeBoundingSphere();scene.add(branches,foliage);
  const fill=new THREE.HemisphereLight(0x8d9b94,0x181a13,.045);scene.add(fill);
  const woodlandRim=new THREE.DirectionalLight(0xa3b3a0,.075);woodlandRim.position.set(-12,18,-20);scene.add(woodlandRim);
  return{trees:positions.length,leaves:li,update:(t:number)=>{windTime.value=t;}};
}
