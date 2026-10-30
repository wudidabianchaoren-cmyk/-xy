import * as THREE from 'three';
import type {createCyclops} from './odyssey-cyclops';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {erodedBoulderGeometry} from './odyssey-refinement';

type Rower={x:number;side:number;phase:number;build:number;};
type Crew={rowers:Rower[];people:number;figures:{mesh:THREE.InstancedMesh;rows:number[];pose:THREE.Mesh}[];shafts:THREE.InstancedMesh;blades:THREE.InstancedMesh};
const sphere=new THREE.SphereGeometry(1,18,12);
const limb=new THREE.CylinderGeometry(1,1,1,8);
const unit=new THREE.Object3D();
function put(parent:THREE.Object3D,g:THREE.BufferGeometry,m:THREE.Material,p:number[],s:number[]=[1,1,1],name='Solid narrative detail'){
  const object=new THREE.Mesh(g,m);object.position.fromArray(p);object.scale.fromArray(s);object.castShadow=object.receiveShadow=true;object.name=name;parent.add(object);return object;
}
function ellipsoid(parent:THREE.Object3D,m:THREE.Material,p:number[],s:number[],name:string){return put(parent,sphere,m,p,s,name);}
function cylinder(parent:THREE.Object3D,m:THREE.Material,a:THREE.Vector3,b:THREE.Vector3,r:number,name:string){const v=b.clone().sub(a),o=put(parent,limb,m,a.clone().add(b).multiplyScalar(.5).toArray(),[r,v.length(),r],name);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return o;}
function batch(parent:THREE.Object3D){
  const groups=new Map<THREE.Material,THREE.Mesh[]>();
  for(const o of [...parent.children])if(o instanceof THREE.Mesh&&!Array.isArray(o.material)&&!(o instanceof THREE.InstancedMesh)&&!(o instanceof THREE.SkinnedMesh)){const group=groups.get(o.material)??[];group.push(o);groups.set(o.material,group);}
  for(const [material,meshes] of groups){if(meshes.length<2)continue;const geometries=meshes.map(o=>{o.updateMatrix();return (o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrix);});const joined=mergeGeometries(geometries);if(!joined)throw Error('Story geometry batch failed');meshes.forEach(o=>parent.remove(o));geometries.forEach(g=>g.dispose());put(parent,joined,material,[0,0,0],[1,1,1],'Batched narrative sculpture and equipment');}
}
function sheep(parent:THREE.Object3D,x:number,y:number,z:number,scale:number,wool:THREE.Material,dark:THREE.Material){
  ellipsoid(parent,wool,[x,y+.52*scale,z],[.54*scale,.40*scale,.26*scale],'Sheep fleece');
  ellipsoid(parent,dark,[x-.49*scale,y+.63*scale,z],[.20*scale,.24*scale,.14*scale],'Sheep face');
  for(const a of [-.32,.29])for(const side of [-1,1])cylinder(parent,dark,new THREE.Vector3(x+a*scale,y+.35*scale,z+side*.16*scale),new THREE.Vector3(x+a*scale,y+.025,z+side*.16*scale),.035*scale,'Sheep leg');
  for(const side of [-1,1])ellipsoid(parent,wool,[x-.48*scale,y+.82*scale,z+side*.18*scale],[.10*scale,.045*scale,.085*scale],'Sheep folded ear');
}

// The core human model is retained. Additional stationary sailors are posed and baked into
// shared meshes, rather than allocating another skinned rig and draw calls per crew member.
function sailor(source:THREE.Object3D,linen:THREE.Texture,stern:boolean,seatedSide=0,strokeOffset=0){
  const human=cloneSkeleton(source),bones=new Map<string,THREE.Bone>();
  human.traverse(o=>{if(o instanceof THREE.Bone)bones.set(o.name,o);if(/torch|wick/i.test(o.name))o.visible=false;});
  const aim=(name:string,child:string,direction:THREE.Vector3)=>{const a=bones.get(THREE.PropertyBinding.sanitizeNodeName(name)),b=bones.get(THREE.PropertyBinding.sanitizeNodeName(child));if(!a||!b||!a.parent)throw Error('Sailor pose joint missing: '+name);human.updateMatrixWorld(true);const delta=b.getWorldPosition(new THREE.Vector3()).sub(a.getWorldPosition(new THREE.Vector3())).normalize(),turn=new THREE.Quaternion().setFromUnitVectors(delta,direction.normalize()),q=a.getWorldQuaternion(new THREE.Quaternion()),parent=a.parent.getWorldQuaternion(new THREE.Quaternion());a.quaternion.copy(parent.invert()).multiply(turn).multiply(q);};
  aim('upperarm01.R','lowerarm01.R',new THREE.Vector3(stern?.45:-.34,-.70,.35));aim('lowerarm01.R','wrist.R',new THREE.Vector3(.12,-.25,.70));
  aim('upperarm01.L','lowerarm01.L',new THREE.Vector3(-.25,-.74,.33));aim('lowerarm01.L','wrist.L',new THREE.Vector3(-.12,-.43,.5));
  if(seatedSide){
    for(const side of ['L','R']){aim(`upperleg01.${side}`,`lowerleg01.${side}`,new THREE.Vector3(side==='L'?-.16:.16,-.045,.98));aim(`lowerleg01.${side}`,`foot.${side}`,new THREE.Vector3(0,-.99,.04));
      aim(`upperarm01.${side}`,`lowerarm01.${side}`,new THREE.Vector3(-seatedSide*.70,-.38,.23+strokeOffset*.55));aim(`lowerarm01.${side}`,`wrist.${side}`,new THREE.Vector3(-seatedSide*.72,-.19,.43+strokeOffset*.7));}
  }
  const head=bones.get('head');if(head)head.rotateY(stern?-.30:.7);
  human.updateMatrixWorld(true);human.traverse(o=>{if(o instanceof THREE.SkinnedMesh)o.skeleton.update();});
  const result=new THREE.Group(),materials=new Map<THREE.Material,THREE.Material>();
  human.traverse(o=>{
    if(!(o instanceof THREE.Mesh)||!o.visible)return;for(let p:THREE.Object3D|null=o.parent;p&&p!==human;p=p.parent)if(!p.visible)return;
    const geometry=o.geometry.clone(),positions=geometry.attributes.position;
    if(o instanceof THREE.SkinnedMesh){for(let i=0;i<positions.count;i++){const p=new THREE.Vector3().fromBufferAttribute(positions,i);o.applyBoneTransform(i,p);positions.setXYZ(i,p.x,p.y,p.z);}geometry.deleteAttribute('skinIndex');geometry.deleteAttribute('skinWeight');geometry.computeVertexNormals();}
    geometry.applyMatrix4(o.matrixWorld);
    const refine=(original:THREE.Material)=>{if(materials.has(original))return materials.get(original)!;const m=original.clone();if(m instanceof THREE.MeshStandardMaterial){m.roughness=.91;
      if(/tunic|linen|hem/.test(m.name)){m.map=linen;m.color.set(stern?0xb2a081:0xd2c7ad);m.roughness=.94;}
      if(/mantle/.test(m.name)){m.map=linen;m.color.set(stern?0x714737:0x8a3c2d);m.roughness=.98;}
      if(/leather/.test(m.name)){m.color.set(0x4d3020);m.roughness=.83;}
      if(/^Human\.(body|nipple|lips|fingernails|toenails|ears)/.test(m.name)){m.transparent=false;m.depthWrite=true;m.alphaTest=0;m.color.set(0xc5a886);m.roughness=.81;}
      else if(/^Human\./.test(m.name)){m.alphaTest=.35;m.depthWrite=true;}
      if(m instanceof THREE.MeshPhysicalMaterial){m.transmission=0;m.clearcoat=0;}}
      materials.set(original,m);return m;};
    const mesh=new THREE.Mesh(geometry,Array.isArray(o.material)?o.material.map(refine):refine(o.material));mesh.castShadow=mesh.receiveShadow=true;result.add(mesh);
  });
  return result;
}
const seatedCache=new WeakMap<THREE.Object3D,Map<number,THREE.Mesh[]>>();
function seatedFigures(source:THREE.Object3D,linen:THREE.Texture,side:number){
  let cache=seatedCache.get(source);if(!cache){cache=new Map();seatedCache.set(source,cache);}if(cache.has(side))return cache.get(side)!;
  const center=sailor(source,linen,false,side,0),forward=sailor(source,linen,false,side,.85),back=sailor(source,linen,false,side,-.85);
  const meshes=center.children.filter(o=>o instanceof THREE.Mesh) as THREE.Mesh[];
  meshes.forEach((m,i)=>{const a=forward.children[i] as THREE.Mesh,b=back.children[i] as THREE.Mesh;m.geometry.morphAttributes.position=[a.geometry.attributes.position.clone(),b.geometry.attributes.position.clone()];m.geometry.morphAttributes.normal=[a.geometry.attributes.normal.clone(),b.geometry.attributes.normal.clone()];m.updateMorphTargets();});
  cache.set(side,meshes);return meshes;
}

export function createGalleyCrew(ship:THREE.Group,wood:THREE.Material,linen:THREE.Texture,source:THREE.Object3D,phase:number,variant=0):Crew{
  const staticParts=new THREE.Group();ship.add(staticParts);
  const hair=new THREE.MeshStandardMaterial({color:0x29211c,roughness:.94}),wool=new THREE.MeshStandardMaterial({color:0xbeb8a1,roughness:1});
  const rowers:Rower[]=[];
  for(let row=0;row<6;row++)for(const side of [-1,1]){
    const x=-3.65+row*1.36,z=side*.95;rowers.push({x,side,phase:phase+row*(.10+variant*.025)+(variant?side*.13:0),build:variant?(.94+((row+variant*2)%4)*.025):1});
  }
  // Cargo stays below the raised foredeck and in the open well, not across its opening.
  const clay=new THREE.MeshStandardMaterial({color:0x865137,roughness:.93});
  for(let i=0;i<(variant===2?2:variant===3?8:5);i++){
    const x=-5.25+(i%2)*.47,z=-.53+Math.floor(i/2)*.43;
    const profile=[new THREE.Vector2(.04,0),new THREE.Vector2(.22,.16),new THREE.Vector2(.25,.40),new THREE.Vector2(.14,.59),new THREE.Vector2(.10,.64),new THREE.Vector2(.115,.68)];
    put(staticParts,new THREE.LatheGeometry(profile,20),clay,[x,.35,z],[1,1,1],'Storage amphora');
    for(const side of [-1,1])put(staticParts,new THREE.TorusGeometry(.10,.022,6,16,Math.PI),clay,[x+side*.14,.88,z],[1,1,1],'Amphora loop handle').rotation.z=side*Math.PI/2;
  }
  if(variant<2){sheep(staticParts,5.04,.35,-.52,.78,wool,hair);sheep(staticParts,5.1,.35,.41,.72,wool,hair);}
  if(variant===3)for(let j=0;j<3;j++)put(staticParts,new THREE.CylinderGeometry(.31,.34,.64,12),wood,[5.2,.67,-.8+j*.8],[1,1,1],'Provision barrels');
  const steersman=sailor(source,linen,true);steersman.name='Stern helmsman operating paired steering oars';steersman.position.set(6.65,1.95,.2);steersman.rotation.y=-Math.PI/2;ship.add(steersman);
  const companion=sailor(source,linen,false);companion.name=variant?'Escort lookout watching the coast':'Companion looking back to warn Ulysses';companion.position.set(-6.02,1.71,variant===2?-.9:1.28);companion.rotation.y=variant?[-.3,.35,-1.2,.65][variant]:2.0;ship.add(companion);
  if(variant>0)for(const figure of [companion,steersman])figure.traverse(o=>{if(o instanceof THREE.Mesh){const copy=(m:THREE.Material)=>{const n=m.clone();if(n instanceof THREE.MeshStandardMaterial){if(/tunic|linen|mantle/.test(n.name))n.color.set([0xffffff,0x9a8760,0x74877c,0x9b6953][variant]);if(/^Human\.body/.test(n.name))n.color.multiplyScalar(.83+variant*.035);}return n;};o.material=Array.isArray(o.material)?o.material.map(copy):copy(o.material);}});
  for(const side of [-1,1]){
    const a=new THREE.Vector3(7.05,2.44,side*.4),b=new THREE.Vector3(8.15,-.45,side*2.70);cylinder(staticParts,wood,a,b,.063,'Stern steering sweep');
    const blade=put(staticParts,new THREE.BoxGeometry(.31,1.35,.085),wood,b.toArray());blade.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());
  }
  batch(staticParts);
  const figures:Crew['figures']=[];
  for(const side of [-1,1]){const rows=rowers.map((r,i)=>r.side===side?i:-1).filter(i=>i>=0);for(const pose of seatedFigures(source,linen,side)){
    const instanced=new THREE.InstancedMesh(pose.geometry,pose.material,rows.length);instanced.name='Anatomical seated sailor / linen tunic, wool mantle, leather belt and shoes';instanced.frustumCulled=false;instanced.castShadow=instanced.receiveShadow=true;instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if(variant>0){const clone=(m:THREE.Material)=>{const c=m.clone();if(c instanceof THREE.MeshStandardMaterial&&/mantle/.test(c.name))c.color.set([0xffffff,0x796342,0x536964,0x805346][variant]);return c;};instanced.material=Array.isArray(pose.material)?pose.material.map(clone):clone(pose.material);}
    const m=Array.isArray(pose.material)?pose.material[0]:pose.material;if(/tunic|linen|hem/.test(m.name))rows.forEach((row,i)=>instanced.setColorAt(i,new THREE.Color([0xcfc4ab,0xa18b68,0xb0a58d,0x8c7057][(row+variant)%4])));
    ship.add(instanced);figures.push({mesh:instanced,rows,pose});
  }}
  const shafts=new THREE.InstancedMesh(limb,wood,rowers.length),blades=new THREE.InstancedMesh(new THREE.BoxGeometry(.31,1.00,.065),wood,rowers.length);
  for(const instanced of [shafts,blades]){instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);instanced.castShadow=instanced.receiveShadow=true;instanced.frustumCulled=false;ship.add(instanced);}
  const result={rowers,people:rowers.length+2,figures,shafts,blades};updateGalleyCrew(result,0);return result;
}
function instanceBeam(mesh:THREE.InstancedMesh,index:number,a:THREE.Vector3,b:THREE.Vector3,radius:number){const v=b.clone().sub(a);unit.position.copy(a).add(b).multiplyScalar(.5);unit.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());unit.scale.set(radius,v.length(),radius);unit.updateMatrix();mesh.setMatrixAt(index,unit.matrix);}
export function updateGalleyCrew(crew:Crew,time:number){
  crew.rowers.forEach((row,index)=>{
    const stroke=time*1.35+row.phase,sweep=Math.sin(stroke)*.58,dip=.20*Math.cos(stroke);
    const handle=new THREE.Vector3(row.x+sweep,1.07,row.side*1.57),tip=new THREE.Vector3(row.x-sweep*2.45,.12+dip,row.side*5.18);
    instanceBeam(crew.shafts,index,handle,tip,.044);
    unit.position.copy(tip);unit.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tip.clone().sub(handle).normalize());unit.scale.set(1,1,1);unit.updateMatrix();crew.blades.setMatrixAt(index,unit.matrix);
  });
  for(const group of crew.figures){group.rows.forEach((rowIndex,i)=>{const row=crew.rowers[rowIndex],swing=Math.sin(time*1.35+row.phase);unit.position.set(row.x,.07,row.side*.95);unit.rotation.set(0,Math.PI/2,-.055*swing);unit.scale.set(row.build,row.build,1);unit.updateMatrix();group.mesh.setMatrixAt(i,unit.matrix);group.pose.morphTargetInfluences![0]=Math.max(0,swing);group.pose.morphTargetInfluences![1]=Math.max(0,-swing);group.mesh.setMorphAt(i,group.pose);});group.mesh.instanceMatrix.needsUpdate=true;if(group.mesh.morphTexture)group.mesh.morphTexture.needsUpdate=true;}
  for(const mesh of [crew.shafts,crew.blades])mesh.instanceMatrix.needsUpdate=true;
}

// No geometry is used for a wake. These uniforms shade the water surface itself, so
// the wake cannot dangle under a hull, intersect a deck, or remain behind a moved ship.
export function createShipWake(_scene:THREE.Scene,ship:THREE.Group,length:number,width:number){return{footprint:new THREE.Vector4(ship.position.x,ship.position.z,length*ship.scale.x,width*ship.scale.z),heading:new THREE.Vector2(1,0)};}
export function updateShipWake(wake:ReturnType<typeof createShipWake>,ship:THREE.Group,_time:number){wake.footprint.x=ship.position.x;wake.footprint.y=ship.position.z;wake.heading.set(Math.cos(ship.rotation.y),-Math.sin(ship.rotation.y));}

export function createOdysseyStory(scene:THREE.Scene,rock:THREE.Material,_wood:THREE.Material,_linen:THREE.Texture,source:THREE.Object3D,cyclops:ReturnType<typeof createCyclops>){
  const shore=new THREE.Group();shore.name='Polyphemus island / cave, flock and discarded stake';scene.add(shore);
  const dark=new THREE.MeshStandardMaterial({color:0x111710,roughness:1}),wool=new THREE.MeshStandardMaterial({color:0x9f9b85,roughness:1}),wood=new THREE.MeshStandardMaterial({color:0x28251a,roughness:.94});
  // The inhabited native island supplies the whole shore. The obsolete circular
  // proxy shelf and its unsupported eight sheep have been removed.
  const body=cyclops.root;body.updateMatrixWorld(true);
  if(!body.userData.nativeHeldRock){const stone=new THREE.Mesh(erodedBoulderGeometry(.062,8),rock);stone.scale.set(1.12,.9,1.1);stone.castShadow=stone.receiveShadow=true;stone.name='Weathered stone gripped above the island';cyclops.heldRockAnchor.add(stone);}
  if(!body.userData.nativeFootReef){const landing=erodedBoulderGeometry(1,31);put(shore,landing,rock,[-49,-.15,-111],[17,5.5,12],'Continuous island terrace beneath both Cyclops feet');}
  // Rocks thrown toward the retreating fleet establish the story in the intermediate views.
  for(const [x,z,size] of [[-31,-59,3.7],[-13,-72,2.9],[39,-94,2.5]]){const g=erodedBoulderGeometry(1,x*.41);put(shore,g,rock,[x,.6,z],[size,size*.8,size*1.2],'Fractured hurled rock in the escape channel');}
  batch(shore);
  const fish=new THREE.Group();fish.name='Turner flying fish near the escaping bow';scene.add(fish);
  const silver=new THREE.MeshStandardMaterial({color:0x82988b,metalness:.22,roughness:.46});
  const fins=new THREE.MeshStandardMaterial({color:0x8d9d88,roughness:.77,side:THREE.DoubleSide});
  const flights:{root:THREE.Group;phase:number}[]=[];
  for(let i=0;i<7;i++){
    const root=new THREE.Group();fish.add(root);ellipsoid(root,silver,[0,0,0],[.31,.055,.069],'Flying fish body');
    for(const side of [-1,1]){const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([-.06,0,side*.02,-.19,.015,side*.37,.09,.012,side*.11],3));geometry.computeVertexNormals();put(root,geometry,fins,[0,0,0]);}flights.push({root,phase:i*.8});
  }
  return{labels:['open galley rowing wells and visible crews','amphorae and rescued sheep','paired stern steering sweeps','natural eroded island shelf and flock','upright Polyphemus on a continuous island','fractured rocks in the escape channel','Turner flying fish'],giantPose:()=>({body:body.position.toArray(),hand:body.localToWorld(cyclops.rightHand.clone()).toArray()}),update:(time:number)=>{flights.forEach((f,i)=>{const t=time*.45+f.phase;f.root.position.set(-19+Math.sin(t)*2.7-i*.5,.30+Math.max(0,Math.sin(t*1.7))*1.2,7+i*.62);f.root.rotation.set(0,.24,-.20*Math.cos(t*1.7));});}};
}
