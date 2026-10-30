import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {CSM} from 'three/addons/csm/CSM.js';
import {coastalWoodland} from './odyssey-vegetation-v104';

type Sail={mesh:THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>;base:Float32Array;phase:number;freeEdge?:boolean};
type Ship={root:THREE.Group;sails:Sail[]};
const axis=new THREE.Vector3(0,1,0);
const rand=(seed:number)=>{let s=seed;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};};

/** All changes are applied after the native patch; none can be replaced by a late GLB. */
export async function refineOdysseyVisual(scene:THREE.Scene,ships:Ship[],camera:THREE.PerspectiveCamera,sun:THREE.DirectionalLight){
 const clock={value:0},random=rand(1041829),changes={sails:0,joineryParts:0,rivets:0,ropeRuns:0,canopyBatches:0,shoreRocks:0,shorePebbles:0,clothMaterials:0};
 const newMeshes:THREE.Mesh[]=[];
 const add=(parent:THREE.Object3D,g:THREE.BufferGeometry,m:THREE.Material,p=new THREE.Vector3(),name='V104 fitted structural detail')=>{const o=new THREE.Mesh(g,m);o.position.copy(p);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);newMeshes.push(o);return o;};
 const beam=(parent:THREE.Object3D,a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material,name:string)=>{const o=add(parent,new THREE.CylinderGeometry(r*.88,r,a.distanceTo(b),10),m,a.clone().add(b).multiplyScalar(.5),name);o.quaternion.setFromUnitVectors(axis,b.clone().sub(a).normalize());return o;};
 const batch=(parent:THREE.Group)=>{
  const groups=new Map<THREE.Material,THREE.Mesh[]>();for(const o of parent.children){if(o instanceof THREE.Mesh&&!Array.isArray(o.material)&&!(o instanceof THREE.InstancedMesh)){const list=groups.get(o.material)||[];list.push(o);groups.set(o.material,list);}}
  for(const [m,list]of groups){if(list.length<2)continue;const gs=list.map(o=>{o.updateMatrix();return(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrix);});const g=mergeGeometries(gs);if(!g)throw Error('V104 joinery geometry merge failed');for(const o of list){parent.remove(o);o.geometry.dispose();}gs.forEach(g=>g.dispose());add(parent,g,m,new THREE.Vector3(),'V104 continuous fitted ship joinery');}
 };
 const bronze=new THREE.MeshStandardMaterial({color:0x786446,metalness:.78,roughness:.56,envMapIntensity:.6});bronze.name='V104 worn bronze fasteners / restrained patina';
 const hemp=new THREE.MeshStandardMaterial({color:0x948366,roughness:.96,envMapIntensity:.4});hemp.name='V104 twisted hemp standing and running rigging';
 hemp.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 ropeLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\nropeLocal=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 ropeLocal;').replace('#include <map_fragment>','#include <map_fragment>\nfloat braid=.5+.5*sin(atan(ropeLocal.z,ropeLocal.x)*6.+ropeLocal.y*165.);diffuseColor.rgb*=.76+.24*braid;');};hemp.customProgramCacheKey=()=> 'v104-hemp-braid';

 // Restore an unambiguous rectangular cloth UV after the native smart-project UV.
 for(const [variant,ship]of ships.entries()){
  const root=ship.root,scaleY=[.72,.76,.78,.75][variant];
  root.traverse(o=>{
   if(!(o instanceof THREE.Mesh)||o instanceof THREE.SkinnedMesh||o instanceof THREE.InstancedMesh||ship.sails.some(s=>s.mesh===o))return;
   if(/Batched solid hull|Tensioned standing|Square-sail main|Main timber mast|Rigging/.test(o.name)){
    const g=o.geometry.clone(),p=g.getAttribute('position');for(let i=0;i<p.count;i++){const y=p.getY(i)+o.position.y;if(y>4.3){p.setY(i,4.3+(y-4.3)*scaleY-o.position.y);if(y>13.9)p.setX(i,p.getX(i)*1.27);}}p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();o.geometry=g;
   }
  });
  const details=new THREE.Group();details.name='V104 vessel-specific fitted frames and rigging';root.add(details);
  let wood:THREE.MeshStandardMaterial|undefined;root.traverse(o=>{if(!wood&&o instanceof THREE.Mesh&&!Array.isArray(o.material)&&/V103 real weathered ship timber/.test(o.material.name))wood=o.material as THREE.MeshStandardMaterial;});
  if(!wood)throw Error('V104 ship timber must already be prepared');
  const dark=wood.clone();dark.onBeforeCompile=wood.onBeforeCompile;dark.customProgramCacheKey=wood.customProgramCacheKey;dark.color.set(0xc2b6a0);dark.name='V104 darker end-grain framing';
  // Thick gunwales, separate wales, curved internal knees and fasteners give the hull mass.
  for(const side of [-1,1]){
   for(const level of [0,1]){const points=Array.from({length:65},(_,j)=>{const u=.025+j/64*.95;return new THREE.Vector3((u-.5)*19,1.55-level*.66+Math.abs(u-.5)**4*17,side*(2.74-level*.15)*Math.sin(u*Math.PI)**.63);});add(details,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),80,level?.095:.145,8,false),level?dark:wood,new THREE.Vector3(),'V104 thick continuous timber gunwale and strengthening wale');changes.joineryParts++;}
   for(let rib=0;rib<12;rib++){const x=-6.05+rib*1.04,w=2.62*Math.sin((x/19+.5)*Math.PI)**.63;beam(details,new THREE.Vector3(x,.52,side*(w-.5)),new THREE.Vector3(x,1.54,side*(w-.08)),.095,dark,'V104 substantial pegged hull knee');changes.joineryParts++;}
  }
  const pins=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,6,4),bronze,168),d=new THREE.Object3D();let pin=0;
  for(const side of [-1,1])for(let j=0;j<28;j++)for(let row=0;row<3;row++){const u=.08+j/27*.84,v=.45+row*.21;d.position.set((u-.5)*19,-.65+v*2.15+Math.pow(Math.abs(u-.5)*2,5)*1.23,side*2.75*Math.sin(u*Math.PI)**.63*(.2+.8*Math.sin(v*Math.PI*.5)));d.scale.set(1,.65,1);d.updateMatrix();pins.setMatrixAt(pin++,d.matrix);}pins.name='V104 bronze plank fasteners';pins.castShadow=pins.receiveShadow=true;details.add(pins);changes.rivets+=pin;
  // The old square gallery and unsupported brass bars are replaced by a shaped stern.
  if(variant===0){for(const o of [...root.children]){if(o instanceof THREE.InstancedMesh&&o.count===24&&o.geometry.type==='CylinderGeometry'||o instanceof THREE.Mesh&&o.geometry.type==='BoxGeometry'&&Math.abs(o.position.x-6.4)<.01&&Math.abs(o.position.y-2.12)<.01)o.visible=false;}
   const shape=new THREE.Shape();for(let i=0;i<=20;i++){const x=4.8+i/20*3.65,w=2.55*Math.sin((x/19+.5)*Math.PI)**.63;const y=w*.87;i?shape.lineTo(x,y):shape.moveTo(x,y);}for(let i=20;i>=0;i--){const x=4.8+i/20*3.65,w=2.55*Math.sin((x/19+.5)*Math.PI)**.63;shape.lineTo(x,-w*.87);}shape.closePath();
   const deck=add(details,new THREE.ExtrudeGeometry(shape,{depth:.17,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:2}),wood,new THREE.Vector3(0,2.0,0),'V104 stern platform fitted inside curved hull');deck.rotation.x=-Math.PI/2;
   for(const side of[-1,1]){const points=[];for(let i=0;i<10;i++){const x=4.92+i*.35,w=2.55*Math.sin((x/19+.5)*Math.PI)**.63*.87;beam(details,new THREE.Vector3(x,2.0,side*w),new THREE.Vector3(x,2.75,side*w),.047,dark,'V104 pegged stern baluster');points.push(new THREE.Vector3(x,2.75,side*w));}add(details,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.066,8),wood,new THREE.Vector3(),'V104 connected stern gallery handrail');}
   const helmsman=root.children.find(o=>/Stern helmsman/.test(o.name));if(helmsman)helmsman.position.y=2.17;
  }
  for(const [index,sail]of ship.sails.entries()){
   if(sail.freeEdge){sail.mesh.position.y=4.3+(sail.mesh.position.y-4.3)*scaleY;continue;}
   const main=index===0,w=main?[10.8,9.8,8.7,9.4][variant]:4.1,h=main?[7.65,6.9,6.0,6.6][variant]:3.6;
   const cx=main?-.7:3.8,bottom=main?3.9:3.3,top=bottom+h,z=main?.07:.22,cols=56,rows=46,positions:number[]=[],uvs:number[]=[],indices:number[]=[];
   for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
    const u=x/cols,v=y/rows,edge=Math.sin(Math.PI*u),vertical=Math.sin(Math.PI*v),envelope=Math.pow(Math.max(0,edge*vertical),.72);
    const breadth=w*(.84+.16*v),pressure=(main?1.6:.74)*envelope;
    const distance=Math.min(Math.hypot(u,v),Math.hypot(1-u,v),Math.hypot(u,1-v),Math.hypot(1-u,1-v));
    const folds=.105*Math.sin(u*42+v*9)*edge*vertical+.11*Math.sin(distance*65+u*3)*Math.exp(-distance*5)*edge;
    positions.push(cx+(u-.5)*breadth,bottom+v*h-.44*edge*(1-v)+.07*Math.sin(u*19)*vertical,z+pressure+folds+.15*vertical);
    uvs.push(u,v);if(x<cols&&y<rows){const a=y*(cols+1)+x,b=a+1,c=a+cols+1;indices.push(a,b,c,b,c+1,c);}
   }
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingSphere();sail.mesh.geometry=g;sail.base=new Float32Array(positions);
   const mat=sail.mesh.material as THREE.MeshPhysicalMaterial;mat.color.set([0xeee0be,0xd4be91,0xdcd0b5,0xa6b7b8][variant]);mat.sheen=.28;mat.sheenColor.set(0xffe7c4);mat.normalScale.set(.25,.25);mat.roughness=.92;
   for(const t of [mat.map,mat.normalMap,mat.roughnessMap])t?.repeat.set(w/.271,h/.271);
   mat.onBeforeCompile=s=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 wovenUv;').replace('#include <uv_vertex>','#include <uv_vertex>\nwovenUv=uv;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 wovenUv;')
     .replace('#include <map_fragment>',`#include <map_fragment>
      float dist=abs(fract(wovenUv.x*9.+.5)-.5),seam=1.-smoothstep(.006,.017,dist);
      float hem=1.-smoothstep(.008,.022,min(min(wovenUv.x,1.-wovenUv.x),min(wovenUv.y,1.-wovenUv.y)));
      float panel=floor(wovenUv.x*9.);diffuseColor.rgb*=.96+.035*sin(panel*4.71);
      float stains=.5+.5*sin(wovenUv.x*17.+sin(wovenUv.y*11.))*sin(wovenUv.y*23.+wovenUv.x*4.);
      diffuseColor.rgb*=vec3(1.10,1.015,.88)*(1.-.13*seam-.19*hem)*(.93+.07*stains);`)
     .replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
      vec3 warmSun=normalize(mat3(viewMatrix)*vec3(-33.,37.,-145.));
      float throughCloth=pow(max(dot(-normal,warmSun),0.),1.6)*.65;
      reflectedLight.indirectDiffuse+=diffuseColor.rgb*vec3(1.,.73,.43)*throughCloth;`);
   };mat.customProgramCacheKey=()=> 'v104-tensioned-thin-sewn-linen';mat.needsUpdate=true;
   beam(details,new THREE.Vector3(cx-w*.54,top+.05,z),new THREE.Vector3(cx+w*.54,top+.05,z),main?.12:.075,wood,'V104 tapered sail yard');
   for(const side of[-1,1]){
    const corner=new THREE.Vector3(cx+side*w*.42,bottom,z),deckPoint=new THREE.Vector3(side<0?-6.5:5.8,1.68,side*2.18),middle=corner.clone().lerp(deckPoint,.5);middle.y-=.14;
    add(details,new THREE.TubeGeometry(new THREE.CatmullRomCurve3([corner,middle,deckPoint]),18,.029,7),hemp,new THREE.Vector3(),'V104 sail corner sheet visibly anchored to deck');changes.ropeRuns++;
   }
   changes.sails++;
  }
  // Rope coils and spar lashings are real forms, rather than painted circular decals.
  for(const x of[-5.5,4.45])for(let i=0;i<4;i++){const o=add(details,new THREE.TorusGeometry(.19+i*.038,.018,6,28),hemp,new THREE.Vector3(x,1.74+i*.017,1.53),'V104 coiled hemp on side deck');o.rotation.x=Math.PI/2;}
  for(let i=0;i<5;i++){add(details,new THREE.TorusGeometry(.12,.014,6,20),hemp,new THREE.Vector3(-.7,4.8+i*.033,0),'V104 mast rope lashing').rotation.x=Math.PI/2;}
  batch(details);
 }

 // Give clothing its own material response, retain anatomy textures and rowing morphs.
 const clothSeen=new Set<THREE.Material>();for(const ship of ships)ship.root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
  const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(!(m instanceof THREE.MeshStandardMaterial)||clothSeen.has(m))continue;clothSeen.add(m);
   if(/tunic|mantle|linen|garment|hem/i.test(m.name)&&!/V103 27cm|V104/.test(m.name)){
    m.color.set(/mantle/i.test(m.name)?[0x675146,0x79684d,0x51615b,0x805c4d][ship.root.userData.variant]:[0xd5c4a2,0xc0af89,0xb7b79e,0xa4b7b0][ship.root.userData.variant]);m.roughness=.95;m.envMapIntensity=.65;
    const previousCloth=m.onBeforeCompile;m.onBeforeCompile=(s,r)=>{previousCloth.call(m,s,r);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 garmentPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\ngarmentPoint=position;');s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 garmentPoint;').replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
      float weave=sin(garmentPoint.x*490.)*sin(garmentPoint.y*410.+garmentPoint.z*200.);
      float h=weave*.0003+sin(garmentPoint.x*36.+garmentPoint.y*9.)*.0022;
      vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition),r1=cross(q1,normal),r2=cross(normal,q0);float det=dot(q0,r1);
      normal=normalize(abs(det)*normal-sign(det)*(dFdx(h)*r1+dFdy(h)*r2));`);};m.customProgramCacheKey=()=> 'v104-worn-crew-cloth';m.needsUpdate=true;changes.clothMaterials++;
   }
  }
 });

 const forest=await coastalWoodland(scene,clock);changes.canopyBatches=forest.prototypeParts;

 // Large-scale epidermal variation remains visible at the giant's scale, over the retained anatomy atlas.
 const skinSeen=new Set<THREE.Material>();scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(!(m instanceof THREE.MeshStandardMaterial)||skinSeen.has(m)||!/V103 original anatomical skin atlas/.test(m.name))continue;skinSeen.add(m);
  const prior=m.onBeforeCompile;m.roughness=.74;m.onBeforeCompile=(s,r)=>{prior.call(m,s,r);s.fragmentShader=s.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float pigment=.5+.5*sin(skinPoint.x*2.4+sin(skinPoint.z*4.3))*sin(skinPoint.y*3.7+sin(skinPoint.x*9.));
   float grime=.5+.5*sin(skinPoint.x*9.7+sin(skinPoint.z*5.6))*sin(skinPoint.y*7.1);
   diffuseColor.rgb*=mix(vec3(.77,.70,.62),vec3(1.02,.95,.87),pigment)*(.90+.10*grime);`);};m.customProgramCacheKey=()=> 'v104-weathered-anatomical-skin';m.needsUpdate=true;
 }});

 // Organic, smooth rock silhouettes at the shoreline replace visibly triangulated proxies.
 const rockGeometry=new THREE.SphereGeometry(1,28,18),rp=rockGeometry.getAttribute('position');for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),r=1+.13*Math.sin(x*8+z*4)*Math.cos(y*7)+.075*Math.sin(z*17-y*13);rp.setXYZ(i,x*r,y*r*(.85+.08*Math.sin(y*13)),z*r);}rockGeometry.computeVertexNormals();
 const terrain:THREE.Mesh[]=[];let rockMat:THREE.MeshStandardMaterial|undefined;scene.traverse(o=>{if(o instanceof THREE.Mesh&&!Array.isArray(o.material)&&/V103 sea-worn stone/.test(o.material.name))rockMat=o.material as THREE.MeshStandardMaterial;});scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;
  if(o.visible&&/^native84_(19|20|21|22)$/.test(o.userData.native84Key||''))terrain.push(o);
  if(/Naturally exposed limestone outcrops|eroded ridge boulder|fractured exposed ridge outcrops|littoral rock/i.test(o.name)){o.geometry=rockGeometry;if(rockMat)o.material=rockMat;}
 });
 if(terrain.length&&rockMat){
  scene.updateMatrixWorld(true);const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),d=new THREE.Object3D();(ray as any).firstHitOnly=true;
  scene.traverse(o=>{if(!(o instanceof THREE.InstancedMesh)||!/^Naturally exposed|V95 fractured/.test(o.name))return;
   if(!o.visible)return;const matrix=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();
   for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrix.decompose(p,q,s);ray.set(new THREE.Vector3(p.x,120,p.z),down);const centre=ray.intersectObjects(terrain,false)[0];if(!centre)continue;let support=centre.point.y;const coastal=support<8;const footprint=coastal?Array.from({length:12},(_,j)=>[Math.cos(j*Math.PI/6)*s.x*.98,Math.sin(j*Math.PI/6)*s.z*.98]):[];for(const [dx,dz]of footprint){ray.set(new THREE.Vector3(p.x+dx,120,p.z+dz),down);const hit=ray.intersectObjects(terrain,false)[0];if(hit)support=Math.min(support,hit.point.y);}p.y=support-s.y*(coastal?.38:.30);matrix.compose(p,q,s);o.setMatrixAt(i,matrix);}o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();
  });
  const shore=new THREE.InstancedMesh(rockGeometry,rockMat,74),pebbles=new THREE.InstancedMesh(new THREE.SphereGeometry(1,7,5),rockMat,240);let count=0,pc=0;
  for(let i=0;i<3600&&count<74;i++){
   const x=-207+random()*325,z=-241+random()*178;if(x> -132&&x<22)continue;ray.set(new THREE.Vector3(x,95,z),down);const hit=ray.intersectObjects(terrain,false)[0];if(!hit||hit.point.y<-.5||hit.point.y>6||Math.hypot(x+70,z+129)<15)continue;
   const size=.6+random()*2.5;d.position.copy(hit.point);d.position.y-=size*.34;d.rotation.set(random()*.4,random()*6.28,random()*.3);d.scale.set(size*(.9+random()*.5),size*(.32+random()*.3),size*.85);d.updateMatrix();shore.setMatrixAt(count++,d.matrix);
   for(let j=0;j<3&&pc<240;j++){d.position.set(hit.point.x+(random()-.5)*2.7,hit.point.y+.025,hit.point.z+(random()-.5)*2.7);d.rotation.set(random(),random()*6.28,random());const r=.04+random()*.13;d.scale.set(r*1.5,r*.52,r);d.updateMatrix();pebbles.setMatrixAt(pc++,d.matrix);}
  }
  shore.count=count;pebbles.count=pc;shore.name='V104 broken coastal bedrock and intertidal shelves';pebbles.name='V104 granular pebble transition';for(const o of[shore,pebbles]){o.castShadow=o.receiveShadow=true;o.computeBoundingSphere();scene.add(o);}changes.shoreRocks=count;changes.shorePebbles=pc;
 }

 // Fine near-ship shadows and a second island cascade share the unchanged sun direction.
 const direction=sun.target.position.clone().sub(sun.position).normalize();scene.remove(sun,sun.target);
 const csm=new CSM({camera,parent:scene,cascades:2,maxFar:430,mode:'custom',customSplitsCallback:(_n:number,_near:number,far:number,breaks:number[])=>{breaks.push(66/far,1);},shadowMapSize:2048,shadowBias:-.00003,lightDirection:direction,lightIntensity:3.5,lightMargin:220});csm.fade=true;
 for(const l of csm.lights){l.color.set(0xffe1b2);l.shadow.normalBias=.012;}
 const materials=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial)materials.add(m);});
 for(const m of materials){const previous=m.onBeforeCompile;csm.setupMaterial(m);const csmCompile=m.onBeforeCompile;m.onBeforeCompile=(shader,renderer)=>{previous.call(m,shader,renderer);csmCompile.call(m,shader,renderer);};m.needsUpdate=true;}
 const fill=scene.children.find(o=>o instanceof THREE.DirectionalLight&&!csm.lights.includes(o as THREE.DirectionalLight)) as THREE.DirectionalLight|undefined;if(fill){fill.color.set(0xb5ceda);fill.intensity=1.05;}
 const hemi=scene.children.find(o=>o instanceof THREE.HemisphereLight) as THREE.HemisphereLight|undefined;if(hemi){hemi.color.set(0xb8c7d9);hemi.groundColor.set(0x554639);hemi.intensity=.65;}
 scene.environmentIntensity=.5;
 return {prepareMaterial:(m:THREE.MeshStandardMaterial)=>{const prior=m.onBeforeCompile;csm.setupMaterial(m);const cascades=m.onBeforeCompile;m.onBeforeCompile=(shader,r)=>{prior.call(m,shader,r);cascades.call(m,shader,r);};},info:{version:104,...changes,forest:{source:forest.source,trees:forest.trees,prototypeTriangles:forest.prototypeTriangles,farLeafTriangles:forest.farLeafTriangles,lodDistance:forest.lodDistance},shadowCascades:2,nearShadowReach:66,sunDirectionRetained:true,seaShaderRetained:true,flightRetained:true},resize:()=>csm.updateFrustums(),update:(t:number)=>{clock.value=t;forest.updateLOD(camera);camera.updateMatrixWorld();csm.update();},exportMeshes:newMeshes};
}
