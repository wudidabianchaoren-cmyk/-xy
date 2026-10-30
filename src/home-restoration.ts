import * as THREE from 'three';

// Bring the two wings into the clock's courtyard, without changing the six camera tracks.
export function courtyardPoint(p:THREE.Vector3){
  if(p.x<-6.3){p.x=-7.35+(p.x+8.1)*.91;p.y*=.94;p.z-=.36;}
  else if(p.x>4.35){p.x=4.35+(p.x-4.35)*.89;p.y*=.95;p.z-=.42;}
  return p;
}
export async function refineNativeCourtyard(world:THREE.Group){
  world.updateMatrixWorld(true);
  const meshes:THREE.Mesh[]=[];world.traverse(o=>{if(o instanceof THREE.Mesh&&!o.parent?.userData.nativeName&&(Array.isArray(o.material)?o.material:[o.material]).some(m=>/limestone|travertine|copper roof|architectural recess|charcoal stone|glazing|amber diffusion|temple dark timber|oxidised copper canopy/.test(m.name)))meshes.push(o);});
  const yieldTask=()=>new Promise<void>(resolve=>setTimeout(resolve,0));
  for(const o of meshes){
    // Static batches are in world coordinates. The rejected low arcade is removed by triangles,
    // rather than masking a new arcade over it and creating coplanar shimmer.
    const g=o.geometry.clone(),p=g.attributes.position,idx=g.index,kept:number[]=[];
    for(let i=0;i<(idx?.count??p.count);i+=3){
      const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;
      const x=(p.getX(a)+p.getX(b)+p.getX(c))/3,y=(p.getY(a)+p.getY(b)+p.getY(c))/3,z=(p.getZ(a)+p.getZ(b)+p.getZ(c))/3;
      const arcade=x>5.65&&x<9.7&&y<1.64&&y>-.05&&z>-.88&&z<.35;
      const pagoda=x>-5.9&&x<-3.6&&z<-1.65&&z>-4.8&&y>.25&&y<5.95;
      const westWing=x>-9.6&&x<-6.65&&z<-1.0&&z>-5.2&&y>.04&&y<5.7;
      const formerGardenPiers=z<-15.5&&z>-18.2&&y<5.4;
      if(!arcade&&!pagoda&&!westWing&&!formerGardenPiers)kept.push(a,b,c);
      if(i%18000===0)await yieldTask();
    }
    g.setIndex(kept);
    const q=new THREE.Vector3();for(let i=0;i<p.count;i++){q.fromBufferAttribute(p,i);if(q.y<8.28)courtyardPoint(q);p.setXYZ(i,q.x,q.y,q.z);if(i%8000===0)await yieldTask();}
    g.computeBoundingBox();g.computeBoundingSphere();o.geometry=g;
    await yieldTask();
  }
}
export function humanWindowSilhouette(parent:THREE.Object3D){
  parent.traverse(o=>{if(o instanceof THREE.Mesh)o.visible=false;});
  const s=new THREE.Shape();s.moveTo(-.25,.015);s.quadraticCurveTo(-.31,.24,-.17,.31);s.quadraticCurveTo(-.08,.35,-.075,.40);
  s.lineTo(-.09,.52);s.lineTo(-.012,.47);s.lineTo(.062,.53);s.lineTo(.08,.44);s.lineTo(.145,.409);s.lineTo(.10,.382);
  s.quadraticCurveTo(.02,.35,.034,.27);s.lineTo(.063,.038);s.lineTo(.115,.016);s.lineTo(.006,.016);s.lineTo(-.036,.225);
  s.quadraticCurveTo(-.085,.17,-.135,.034);s.lineTo(-.19,.015);s.closePath();
  const dark=new THREE.MeshStandardMaterial({color:0x16130f,roughness:.97,envMapIntensity:.06});
  const cat=new THREE.Group();cat.name='Recognisable perched cat with ears, paws and curled tail';cat.position.set(0,-.35,.39);cat.scale.setScalar(.80);
  const body=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.18,bevelEnabled:true,bevelSize:.014,bevelThickness:.012,bevelSegments:3}),dark);body.castShadow=true;cat.add(body);
  const tail=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.20,.10,.08),new THREE.Vector3(-.33,.18,.08),new THREE.Vector3(-.40,.42,.08),new THREE.Vector3(-.32,.52,.08),new THREE.Vector3(-.265,.43,.08)]),24,.030,8,false),dark);tail.castShadow=true;cat.add(tail);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.010,8,6),new THREE.MeshStandardMaterial({color:0xceb577,emissive:0x9b7141,emissiveIntensity:.15,roughness:.7}));eye.position.set(.071,.429,.198);cat.add(eye);parent.add(cat);return cat;
}
