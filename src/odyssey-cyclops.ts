import * as THREE from 'three';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export type CyclopsTextures={linen?:THREE.Texture;linenNormal?:THREE.Texture;linenRough?:THREE.Texture};
export type CyclopsOptions={position?:THREE.Vector3;scale?:number;posture?:'standing'|'reclining'|'grounded'};
const smooth=THREE.MathUtils.smoothstep;
const bell=(v:number,c:number,r:number)=>Math.exp(-(((v-c)/r)**2));
const skinNames=/^Human\.(body|nipple|lips|fingernails|toenails|ears)$/;

/** The original CC0 MakeHuman anatomy remains one complete head/neck/body, with baked poses.
 * No stone bust, sliced neck, proxy torso, live skeleton or extra asset download is used. */
export function createCyclops(source:THREE.Object3D,textures:CyclopsTextures={},options:CyclopsOptions={}){
  const anatomy=cloneSkeleton(source),joints=new Map<string,THREE.Bone>();
  anatomy.traverse(o=>{if(o instanceof THREE.Bone)joints.set(o.name.replace(/[^a-z0-9]/gi,'').toLowerCase(),o);});
  const bone=(name:string)=>joints.get(name.replace(/[^a-z0-9]/gi,'').toLowerCase());
  const aim=(name:string,end:string,direction:THREE.Vector3)=>{
    const a=bone(name),b=bone(end);if(!a||!b||!a.parent)throw Error('Cyclops anatomy joint missing: '+name);
    anatomy.updateMatrixWorld(true);const from=b.getWorldPosition(new THREE.Vector3()).sub(a.getWorldPosition(new THREE.Vector3())).normalize();
    const q=a.getWorldQuaternion(new THREE.Quaternion()),parent=a.parent.getWorldQuaternion(new THREE.Quaternion());
    a.quaternion.copy(parent.invert()).multiply(new THREE.Quaternion().setFromUnitVectors(from,direction.normalize())).multiply(q);
  };
  // A broad, supported stance, left hand open; the raised right palm sits clear of the face.
  aim('upperarm01.R','lowerarm01.R',new THREE.Vector3(-.83,.15,.22));
  aim('lowerarm01.R','wrist.R',new THREE.Vector3(-.27,.91,.24));
  aim('upperarm01.L','lowerarm01.L',new THREE.Vector3(.26,-.96,.09));
  aim('lowerarm01.L','wrist.L',new THREE.Vector3(.08,-.98,.14));
  if(options.posture==='reclining'){
    // The National Gallery describes a reclining shadow across the cliff, one knee raised.
    aim('upperarm01.L','lowerarm01.L',new THREE.Vector3(.70,.25,.22));
    aim('lowerarm01.L','wrist.L',new THREE.Vector3(-.48,.82,.18));
    aim('upperleg01.L','lowerleg01.L',new THREE.Vector3(-.36,-.55,.77));
    aim('lowerleg01.L','foot.L',new THREE.Vector3(.43,-.66,-.61));
    aim('upperleg01.R','lowerleg01.R',new THREE.Vector3(.07,-.99,.08));
    aim('lowerleg01.R','foot.R',new THREE.Vector3(.02,-.98,-.12));
  }
  if(options.posture==='grounded'){
    aim('upperarm01.R','lowerarm01.R',new THREE.Vector3(-.42,-.86,.26));
    aim('lowerarm01.R','wrist.R',new THREE.Vector3(-.14,-.96,.16));
    aim('upperarm01.L','lowerarm01.L',new THREE.Vector3(.22,-.97,.06));
    aim('lowerarm01.L','wrist.L',new THREE.Vector3(.10,-.99,.08));
    for(const side of ['L','R']){
      const direction=side==='L'?1:-1;
      aim('upperleg01.'+side,'lowerleg01.'+side,new THREE.Vector3(direction*.13,-.99,.01));
      aim('lowerleg01.'+side,'foot.'+side,new THREE.Vector3(direction*.035,-.999,-.018));
      // Feet follow the same forward direction as the chest and the single eye.
      aim('foot.'+side,'toe1-1.'+side,new THREE.Vector3(direction*.08,-.075,1));
    }
  }
  for(let finger=1;finger<=5;finger++)for(let part=1;part<=3;part++){
    const joint=bone(`finger${finger}-${part}.R`);if(joint)joint.rotateX(finger===1?.10:.23+part*.045);
  }
  const head=bone('head');if(head){head.rotateY(-.035);head.rotateX(.015);}
  anatomy.updateMatrixWorld(true);
  const root=new THREE.Group();root.name='Continuous flesh-and-wool anatomical island Cyclops';
  root.position.copy(options.position??new THREE.Vector3(-49,5,-111));root.scale.setScalar(options.scale??27);
  if(options.posture==='reclining')root.rotation.z=-1.18;
  const skinMeshes:THREE.SkinnedMesh[]=[];let main:THREE.SkinnedMesh|undefined;
  anatomy.traverse(o=>{
    if(!(o instanceof THREE.SkinnedMesh))return;
    const materials=Array.isArray(o.material)?o.material:[o.material];
    if(materials.some(m=>skinNames.test(m.name))){skinMeshes.push(o);if(materials.some(m=>m.name==='Human.body'))main=o;}
  });
  if(!main)throw Error('Complete CC0 Human.body is required to make the Cyclops');
  for(const mesh of skinMeshes)mesh.skeleton.update();
  const muscleSegments:{a:THREE.Vector3;b:THREE.Vector3;gain:number;radius:number}[]=[];
  for(const side of ['L','R'])for(const [start,end,gain,radius] of [
    ['upperarm01','lowerarm01',.20,.082],['lowerarm01','wrist',.11,.068],
    ['upperleg01','lowerleg01',.17,.125],['lowerleg01','foot',.12,.082]
  ] as const){
    const a=bone(`${start}.${side}`),b=bone(`${end}.${side}`);if(!a||!b)continue;
    const ai=main.skeleton.bones.indexOf(a),bi=main.skeleton.bones.indexOf(b);if(ai<0||bi<0)continue;
    muscleSegments.push({a:new THREE.Vector3().setFromMatrixPosition(main.skeleton.boneInverses[ai].clone().invert()),b:new THREE.Vector3().setFromMatrixPosition(main.skeleton.boneInverses[bi].clone().invert()),gain,radius});
  }
  const clock={value:0},materials=new Map<THREE.Material,THREE.Material>(),ownedGeometry:THREE.BufferGeometry[]=[];
  const refineSkin=(original:THREE.Material)=>{
    if(materials.has(original))return materials.get(original)!;
    const material=original.clone() as THREE.MeshStandardMaterial;
    material.color.set(0xead0b7);material.roughness=.77;material.metalness=0;material.envMapIntensity=.28;
    material.transparent=false;material.opacity=1;material.alphaTest=0;material.depthWrite=true;
    if(material.normalMap)material.normalScale.set(.30,.30);
    if(material instanceof THREE.MeshPhysicalMaterial){material.clearcoat=0;material.clearcoatRoughness=1;material.transmission=0;}
    material.onBeforeCompile=shader=>{
      shader.uniforms.cyclopsTime=clock;
      shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>
        attribute vec3 cyclopsRest;varying vec3 vCyclopsRest;uniform float cyclopsTime;`)
        .replace('#include <begin_vertex>',`#include <begin_vertex>
        vCyclopsRest=cyclopsRest;
        transformed.z+=.0015*sin(cyclopsTime*.65)*exp(-pow((cyclopsRest.y-1.24)/.17,2.))*exp(-pow(cyclopsRest.x/.25,4.));`);
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
        varying vec3 vCyclopsRest;
        float skinGrain(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}`)
        .replace('#include <map_fragment>',`#include <map_fragment>
        float faceFront=smoothstep(.094,.122,vCyclopsRest.z);
        float repair=faceFront*(1.-smoothstep(.065,.080,abs(vCyclopsRest.x)))
          *smoothstep(1.581,1.599,vCyclopsRest.y)*(1.-smoothstep(1.657,1.679,vCyclopsRest.y));
        // Erase the photographed paired eyebrows/eye texture while retaining the original skin elsewhere.
        vec3 repairedFlesh=vec3(.48,.335,.225)*(1.+(skinGrain(floor(vCyclopsRest*1800.))-.5)*.075);
        diffuseColor.rgb=mix(diffuseColor.rgb,repairedFlesh,repair);
        float stubble=faceFront*(1.-smoothstep(.061,.084,abs(vCyclopsRest.x)))
          *smoothstep(1.475,1.503,vCyclopsRest.y)*(1.-smoothstep(1.544,1.566,vCyclopsRest.y));
        diffuseColor.rgb*=1.-stubble*(.16+.09*skinGrain(floor(vCyclopsRest*950.)));
        diffuseColor.rgb*=.975+.025*skinGrain(floor(vCyclopsRest*1500.));`);
    };
    material.customProgramCacheKey=()=> 'continuous-flesh-cyclops-v32-70';materials.set(original,material);return material;
  };
  let repairedBoundaryLoops=0;
  for(const skin of skinMeshes){
    const geometry=skin.geometry.clone(),p=geometry.attributes.position;
    const rest=new Float32Array(p.count*3);
    for(let i=0;i<p.count;i++){
      const point=new THREE.Vector3().fromBufferAttribute(p,i);rest.set(point.toArray(),i*3);
      sculpt(point,muscleSegments);
      skin.applyBoneTransform(i,point);p.setXYZ(i,point.x,point.y,point.z);
    }
    // Cap the two source orbital openings with their existing boundary vertices, before adding one eye.
    if(skin===main)repairedBoundaryLoops+=capPairedEyeOpenings(geometry,rest);
    geometry.setAttribute('cyclopsRest',new THREE.Float32BufferAttribute(rest,3));
    geometry.deleteAttribute('skinIndex');geometry.deleteAttribute('skinWeight');geometry.applyMatrix4(skin.matrixWorld);geometry.computeVertexNormals();geometry.computeBoundingBox();
    const material=Array.isArray(skin.material)?skin.material.map(refineSkin):refineSkin(skin.material);
    const mesh=new THREE.Mesh(geometry,material);mesh.name='Uncut anatomical '+(Array.isArray(skin.material)?'skin':skin.material.name);
    // The retained sea shadow camera spans hundreds of metres. Its depth quantisation must not
    // turn smooth giant skin into striped shadow acne; anatomy still casts onto the island.
    mesh.castShadow=true;mesh.receiveShadow=false;root.add(mesh);ownedGeometry.push(geometry);
  }
  // All orbital pieces use the same skin transform as adjacent head vertices, never a separate head origin.
  const positions=main.geometry.attributes.position;let faceIndex=0,best=Infinity;
  for(let i=0;i<positions.count;i++){const d=(positions.getX(i))**2+(positions.getY(i)-1.616)**2+(positions.getZ(i)-.148)**2;if(d<best){best=d;faceIndex=i;}}
  const deformFace=(g:THREE.BufferGeometry)=>{const p=g.attributes.position;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);main!.applyBoneTransform(faceIndex,v);v.applyMatrix4(main!.matrixWorld);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();return g;};
  const add=(g:THREE.BufferGeometry,m:THREE.Material,name:string)=>{ownedGeometry.push(g);const o=new THREE.Mesh(g,m);o.name=name;o.castShadow=true;o.receiveShadow=!/eyeball|iris|pupil|eyelid/i.test(name);root.add(o);return o;};
  const shapedSphere=(center:number[],scale:number[],segments=48)=>new THREE.SphereGeometry(1,segments,24).scale(...scale as [number,number,number]).translate(...center as [number,number,number]);
  const eyeMaterial=new THREE.MeshPhysicalMaterial({color:0xc4bca7,roughness:.35,metalness:0,clearcoat:.18,clearcoatRoughness:.28,envMapIntensity:.30});
  const eye=add(deformFace(shapedSphere([0,1.616,.1465],[.0285,.0115,.0085])),eyeMaterial,'Only Cyclops eyeball, in the natural eye line');
  const irisMaterial=new THREE.MeshStandardMaterial({color:0x71553b,roughness:.5,envMapIntensity:.22});
  add(deformFace(shapedSphere([-.0015,1.616,.1551],[.0070,.0070,.0008],32)),irisMaterial,'One warm brown iris');
  const pupilMaterial=new THREE.MeshStandardMaterial({color:0x171814,roughness:.42,envMapIntensity:.12});
  add(deformFace(shapedSphere([-.0015,1.616,.1560],[.0034,.0034,.00055],24)),pupilMaterial,'One pupil');
  const originalFaceMaterial=(Array.isArray(main.material)?main.material:[main.material]).find(m=>m.name==='Human.body')!;
  const faceMaterial=refineSkin(originalFaceMaterial),lidMaterial=faceMaterial.clone(),sourceUV=main.geometry.attributes.uv;
  lidMaterial.onBeforeCompile=faceMaterial.onBeforeCompile;lidMaterial.customProgramCacheKey=faceMaterial.customProgramCacheKey;lidMaterial.side=THREE.DoubleSide;
  const facePoints:{x:number;y:number;z:number;index:number}[]=[];
  for(let i=0;i<positions.count;i++)if(positions.getZ(i)>.080&&Math.abs(positions.getX(i))<.091&&positions.getY(i)>1.57&&positions.getY(i)<1.68)facePoints.push({x:positions.getX(i),y:positions.getY(i),z:positions.getZ(i),index:i});
  const surfaceDepth=(x:number,y:number)=>{let weight=0,depth=0;for(const point of facePoints){const d=(point.x-x)**2+(point.y-y)**2;if(d>.0003)continue;const w=1/(d+.000001);weight+=w;depth+=point.z*w;}const p=new THREE.Vector3(x,y,weight?depth/weight:.140);sculpt(p,[]);return p.z;};
  // A thin, closed flesh support joins the eye margins to the already continuous head.
  // It seals the old deep orbital corners without a dark open gap or a tubular rim.
  const socket=shapedSphere([0,1.616,.141],[.0335,.0155,.011]),socketP=socket.attributes.position,socketUV:number[]=[];
  socket.setAttribute('cyclopsRest',new THREE.Float32BufferAttribute(Array.from(socketP.array),3));
  for(let i=0;i<socketP.count;i++){let nearest=facePoints[0],distance=Infinity;for(const point of facePoints){const d=(point.x-socketP.getX(i))**2+(point.y-socketP.getY(i))**2+(point.z-socketP.getZ(i))**2;if(d<distance){distance=d;nearest=point;}}socketUV.push(sourceUV.getX(nearest.index),sourceUV.getY(nearest.index));}
  socket.setAttribute('uv',new THREE.Float32BufferAttribute(socketUV,2));add(deformFace(socket),lidMaterial,'Closed skin eyelid socket support, following the continuous head');
  for(const upper of [true,false]){
    const points:number[]=[],uvs:number[]=[],indices:number[]=[],cols=80,rows=8;
    for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
      const a=col/cols*Math.PI,t=row/rows,c=Math.cos(a),s=Math.sin(a);
      const inner=new THREE.Vector3(.0288*c,1.616+(upper?.0105:-.0095)*s,.1474+(upper?.0028:.0041)*s);
      const outer=new THREE.Vector3(.033*c,1.616+(upper?.018:-.015)*s,0);outer.z=surfaceDepth(outer.x,outer.y)+.0004;
      const v=inner.lerp(outer,t);v.z=Math.max(v.z,surfaceDepth(v.x,v.y)+.0006*(1-t));points.push(v.x,v.y,v.z);let nearest=facePoints[0],distance=Infinity;
      for(const point of facePoints){const d=(point.x-v.x)**2+(point.y-v.y)**2+(point.z-v.z)**2;if(d<distance){distance=d;nearest=point;}}
      uvs.push(sourceUV.getX(nearest.index),sourceUV.getY(nearest.index));
      if(row<rows&&col<cols){const i=row*(cols+1)+col;if(upper)indices.push(i,i+cols+1,i+1,i+1,i+cols+1,i+cols+2);else indices.push(i,i+1,i+cols+1,i+1,i+cols+2,i+cols+1);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('cyclopsRest',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();
    add(deformFace(g),lidMaterial,upper?'Continuous upper eyelid flowing into the actual brow':'Lower eyelid flowing into the actual cheek');
  }
  // Retain the licensed, anatomical short-hair mesh; add restrained unevenness rather than stone beard tubes.
  anatomy.traverse(o=>{
    if(!(o instanceof THREE.SkinnedMesh))return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(m.name!=='Human.short01')return;
    o.skeleton.update();const g=o.geometry.clone(),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);v.y+=.006+Math.max(0,v.y-1.60)*.08;v.x*=1.05;v.z+=.002*Math.sin(v.x*181+v.y*97);o.applyBoneTransform(i,v);p.setXYZ(i,v.x,v.y,v.z);}
    g.deleteAttribute('skinIndex');g.deleteAttribute('skinWeight');g.applyMatrix4(o.matrixWorld);g.computeVertexNormals();
    const hair=m.clone() as THREE.MeshStandardMaterial;hair.color.set(0x564032);hair.roughness=.95;hair.metalness=0;hair.alphaTest=.38;hair.transparent=false;hair.depthWrite=true;if(hair instanceof THREE.MeshPhysicalMaterial)hair.clearcoat=0;
    add(g,hair,'Weathered natural hair follows the same head');materials.set(m,hair);
  });
  const wool=new THREE.MeshPhysicalMaterial({color:0xa99376,map:textures.linen??null,normalMap:textures.linenNormal??null,roughnessMap:textures.linenRough??null,normalScale:new THREE.Vector2(.22,.22),roughness:.98,sheen:.38,sheenRoughness:.94,sheenColor:new THREE.Color(0xb2a68c),side:THREE.DoubleSide,envMapIntensity:.15});
  const hide=new THREE.MeshStandardMaterial({color:0x7c6048,normalMap:textures.linenNormal??null,normalScale:new THREE.Vector2(.10,.10),roughness:.94,side:THREE.DoubleSide,envMapIntensity:.15});
  const leather=new THREE.MeshStandardMaterial({color:0x493021,roughness:.84,envMapIntensity:.14});
  const seam=new THREE.MeshStandardMaterial({color:0xb2a084,roughness:.98});
  add(wrapGeometry(false),wool,'Overlapping gathered wool waist wrap with asymmetric sewn hem');
  add(wrapGeometry(true),hide,'Weathered hide apron, loose overlap and shaped edges');
  const beltPoints:THREE.Vector3[]=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;beltPoints.push(new THREE.Vector3(Math.sin(a)*.185,1.052,Math.cos(a)*.137+.020));}
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beltPoints),120,.012,8,true),leather,'Substantial worn leather waist binding');
  const clasp=new THREE.BoxGeometry(.025,.035,.012).translate(-.043,1.051,.162);add(clasp,new THREE.MeshStandardMaterial({color:0x82653e,roughness:.65,metalness:.62}),'Small dull bronze waist clasp');
  const stitches:THREE.BufferGeometry[]=[];
  for(let i=0;i<30;i++){const t=i/29,y=1.025-.36*t,x=.053+.025*Math.sin(t*2.0),z=.167+.017*t;const a=new THREE.Vector3(x-.004,y+.004,z),b=new THREE.Vector3(x+.004,y-.004,z);stitches.push(new THREE.TubeGeometry(new THREE.LineCurve3(a,b),1,.0011,4,false));}
  const stitched=mergeGeometries(stitches);if(stitched)add(stitched,seam,'Actual sewn overlap stitches');stitches.forEach(g=>g.dispose());
  const rightHand=new THREE.Vector3(),leftHand=new THREE.Vector3();
  const handPoint=(side:string,out:THREE.Vector3)=>{const wrist=bone(`wrist.${side}`),knuckle=bone(`finger3-1.${side}`);if(!wrist)throw Error('Cyclops wrist missing');wrist.getWorldPosition(out);if(knuckle)out.lerp(knuckle.getWorldPosition(new THREE.Vector3()),.72);};
  handPoint('R',rightHand);handPoint('L',leftHand);
  const heldRockAnchor=new THREE.Group();heldRockAnchor.name='Raised open palm supports a rock away from the head';heldRockAnchor.position.copy(rightHand).add(new THREE.Vector3(0,.021,.017));root.add(heldRockAnchor);
  root.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(root),size=bounds.getSize(new THREE.Vector3());
  let vertices=0,triangles=0,drawCalls=0;root.traverse(o=>{if(o instanceof THREE.Mesh){vertices+=o.geometry.attributes.position.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;drawCalls+=Array.isArray(o.material)?o.material.length:1;}});
  const stats={source:'Existing MakeHuman MPFB2 CC0 anatomy / skin / hair, assets/odyssey/ulysses-rigged.glb',oneContinuousHeadNeckBody:true,pairedEyeMeshesRemoved:true,eyeCount:1,repairedBoundaryLoops,skinMeshes:skinMeshes.length,vertices,triangles,drawCalls,worldBounds:{min:bounds.min.toArray(),max:bounds.max.toArray(),size:size.toArray()},rightHandLocal:rightHand.toArray(),leftHandLocal:leftHand.toArray(),scale:root.scale.x,cloth:'Folded overlap wool waistwrap, worn hide apron, leather binding, physical stitches',liveSkeletons:0};
  root.userData.cyclops=stats;
  return{root,rightHand,leftHand,eye,heldRockAnchor,stats,update:(time:number)=>{clock.value=time;},dispose:()=>{ownedGeometry.forEach(g=>g.dispose());const owned=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>owned.add(m));});owned.forEach(m=>m.dispose());}};
}

function sculpt(p:THREE.Vector3,segments:{a:THREE.Vector3;b:THREE.Vector3;gain:number;radius:number}[]){
  const x=p.x,y=p.y,z=p.z;
  // Modest muscle volumes follow actual shoulder/arm/leg axes; hands and feet are unchanged.
  if(y>.15&&y<1.48){
    for(const segment of segments){const d=segment.b.clone().sub(segment.a),t=THREE.MathUtils.clamp(p.clone().sub(segment.a).dot(d)/d.lengthSq(),0,1),c=segment.a.clone().addScaledVector(d,t),radial=p.clone().sub(c),distance=radial.length();
      if(t>.03&&t<.98&&distance<segment.radius){const gain=segment.gain*Math.sin(t*Math.PI)**1.15*(1-smooth(distance,segment.radius*.78,segment.radius));p.addScaledVector(radial,gain);}}
    const trunk=bell(y,1.25,.20)*(1-smooth(Math.abs(x),.19,.30));p.x+=x*.10*trunk;
    if(z>0){const pec=bell(Math.abs(x),.095,.070)*bell(y,1.275,.085),abs=bell(x,0,.09)*bell(y,1.07,.14);p.z+=.028*pec+.007*abs;}
    p.z-=.012*bell(y,1.33,.11)*(1-smooth(Math.abs(x),.12,.24))*(1-smooth(z,-.07,.02));
  }
  if(y>1.49&&Math.abs(x)<.095){
    const jaw=bell(y,1.535,.045);p.x*=1+.06*jaw;
    if(z>.080){
      // Erase the complete paired orbital relief, including its deep corners, then sculpt
      // one smooth continuous brow/socket/bridge into the very same head surface.
      const repair=(1-smooth(Math.abs(x),.054,.075))*smooth(y,1.591,1.606)*(1-smooth(y,1.637,1.653))*smooth(z,.080,.105);
      const brow=.015*bell(x,0,.063)*bell(y,1.636,.010);
      const socket=.004*bell(x,0,.031)*bell(y,1.616,.011);
      const bridge=.013*bell(x,0,.016)*bell(y,1.590,.025);
      const surface=.144-.033*(x/.085)**2+brow-socket+bridge;
      p.z=THREE.MathUtils.lerp(p.z,surface,repair);
    }
  }
}

function capPairedEyeOpenings(g:THREE.BufferGeometry,rest:Float32Array){
  const old=Array.from(g.index?.array??Array.from({length:g.attributes.position.count},(_,i)=>i)),canonical=new Map<string,number>(),ids:number[]=[];
  for(let i=0;i<rest.length/3;i++){const key=`${Math.round(rest[i*3]*1e6)},${Math.round(rest[i*3+1]*1e6)},${Math.round(rest[i*3+2]*1e6)}`;if(!canonical.has(key))canonical.set(key,i);ids.push(canonical.get(key)!);}
  const edges=new Map<string,{a:number;b:number;count:number}>();
  for(let i=0;i<old.length;i+=3)for(let j=0;j<3;j++){const a=ids[old[i+j]],b=ids[old[i+(j+1)%3]],key=a<b?`${a}/${b}`:`${b}/${a}`,edge=edges.get(key);if(edge)edge.count++;else edges.set(key,{a,b,count:1});}
  const inEye=(i:number)=>Math.abs(rest[i*3])<.081&&rest[i*3+1]>1.587&&rest[i*3+1]<1.651&&rest[i*3+2]>.091;
  const boundaries=[...edges.values()].filter(e=>e.count===1&&inEye(e.a)&&inEye(e.b)),adjacency=new Map<number,number[]>();
  for(const e of boundaries){adjacency.set(e.a,[...(adjacency.get(e.a)??[]),e.b]);adjacency.set(e.b,[...(adjacency.get(e.b)??[]),e.a]);}
  const seen=new Set<number>();let capped=0;
  for(const start of adjacency.keys()){if(seen.has(start))continue;const loop=[start];let prev=-1,current=start;
    for(let limit=0;limit<200;limit++){seen.add(current);const next=(adjacency.get(current)??[]).find(n=>n!==prev);if(next===undefined)break;if(next===start){if(loop.length>=3){for(let j=1;j<loop.length-1;j++)old.push(loop[0],loop[j+1],loop[j]);capped++;}break;}if(seen.has(next))break;loop.push(next);prev=current;current=next;}
  }
  g.setIndex(old);return capped;
}

function wrapGeometry(apron:boolean){
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[],cols=apron?44:128,rows=22;
  for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
    const t=row/rows,u=col/cols,a=apron?(u-.5)*1.92:u*Math.PI*2.18-.18;
    const fold=(.012+.009*t)*Math.sin(a*13+.55)+.004*Math.sin(a*27-t*.5),rx=.173+.061*t+fold,rz=.126+.052*t+fold*.68;
    const hem=apron?.60+.10*Math.abs(u-.42)+.026*Math.sin(u*17):.67+.032*Math.sin(a*3)+.025*Math.sin(a+1.5);
    const y=1.042+(hem-1.042)*t+.006*Math.sin(a*12)*t;
    positions.push(Math.sin(a)*rx+(apron?.012:0),y,Math.cos(a)*rz+.023+(apron?.011:0));uvs.push(u*(apron?1.6:4),t*2.7);
    if(row<rows&&col<cols){const i=row*(cols+1)+col;indices.push(i,i+1,i+cols+1,i+1,i+cols+2,i+cols+1);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
