import * as THREE from 'three';

const fract=(n:number)=>n-Math.floor(n),hash=(x:number,y:number,z:number)=>fract(Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453);
function noise(x:number,y:number,z:number){const i=Math.floor(x),j=Math.floor(y),k=Math.floor(z);let a=fract(x),b=fract(y),c=fract(z);a=a*a*(3-2*a);b=b*b*(3-2*b);c=c*c*(3-2*c);const mix=THREE.MathUtils.lerp;return mix(mix(mix(hash(i,j,k),hash(i+1,j,k),a),mix(hash(i,j+1,k),hash(i+1,j+1,k),a),b),mix(mix(hash(i,j,k+1),hash(i+1,j,k+1),a),mix(hash(i,j+1,k+1),hash(i+1,j+1,k+1),a),b),c);}

export function erodedBoulderGeometry(radius=1,seed=0){
  const g=new THREE.SphereGeometry(radius,48,32),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i)/radius,y=p.getY(i)/radius,z=p.getZ(i)/radius;const r=radius*(1+(noise(x*2.2+seed,y*2.2,z*2.2)-.5)*.43+(noise(x*6.1,y*6.1+seed,z*6.1)-.5)*.13+(noise(x*17,y*17,z*17+seed)-.5)*.035);p.setXYZ(i,x*r,y*r,z*r);}
  g.computeVertexNormals();return g;
}

/** Low, fractured littoral island: a solid landmass rather than a decorative bridge. */
export function createReefIsland(scene:THREE.Scene,stone:THREE.Material){
  const root=new THREE.Group();root.name='Weathered stratified reef island and broken shoreline';root.position.set(41,0,-79);root.rotation.y=-.22;scene.add(root);
  const levels=[[-4,11],[-.6,14],[.8,13.6],[2.1,12],[3.1,12.7],[4.2,10.5],[6,10.2],[7.4,9.5],[8.1,9.9],[10.1,7.1],[11.6,5.4],[13.1,2.6],[13.3,0]],segments=80;
  const positions:number[]=[],uvs:number[]=[],indices:number[]=[];
  for(let ring=0;ring<levels.length;ring++)for(let j=0;j<=segments;j++){
    const angle=j/segments*Math.PI*2,[height,width]=levels[ring],cx=Math.cos(angle),cz=Math.sin(angle);
    const irregular=1+(noise(cx*2.4+7,height*.13,cz*2.4)-.5)*.31+(noise(cx*8,height*.4,cz*8)-.5)*.08;
    const x=cx*width*irregular+height*.12,z=cz*width*.67*irregular;
    positions.push(x,height+(width>0?(noise(x*.24,11,z*.24)-.5)*.8:0),z);uvs.push(j/segments,ring/(levels.length-1));
    if(ring<levels.length-1&&j<segments){const a=ring*(segments+1)+j,b=a+segments+1;indices.push(a,b,a+1,a+1,b,b+1);}
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mass=new THREE.Mesh(geometry,stone);mass.castShadow=mass.receiveShadow=true;mass.name='Continuous asymmetric limestone with eroded bedding planes';root.add(mass);
  for(let i=0;i<9;i++){const a=i*2.399,g=erodedBoulderGeometry(1,22+i);const clast=new THREE.Mesh(g,stone);clast.position.set(Math.cos(a)*(11+i%3),-.4,Math.sin(a)*(7+i%2));clast.scale.set(2.2+i%3,1.1+i%2,1.7+i%3);clast.castShadow=clast.receiveShadow=true;root.add(clast);}
  return root;
}

/** Repair the face in its existing local coordinate frame; do not add another forehead stone. */
export function repairSingleEye(giant:THREE.Object3D,stone:THREE.Material){
  const oldEyeObjects:THREE.Object3D[]=[];
  giant.traverse(o=>{
    if(!(o instanceof THREE.Mesh))return;
    const oldMaterial=Array.isArray(o.material)?o.material[0]:o.material;
    if(/Single[ _]|weathered[ _]orbital/i.test(o.name)||/obsidian orbital/i.test(oldMaterial.name)){oldEyeObjects.push(o);return;}
    o.material=stone;o.castShadow=o.receiveShadow=true;
    const g=o.geometry.clone(),p=g.attributes.position;
    // Fill the obsolete two-eye cavities and old high forehead opening before carving one socket.
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      if(z<.10||Math.abs(x)>.09||y<.014||y>.12)continue;
      const twin=Math.exp(-Math.pow((Math.abs(x)-.033)/.024,2)-Math.pow((y-.039)/.019,2));
      const forehead=Math.exp(-Math.pow(x/.057,2)-Math.pow((y-.073)/.023,2));
      const fill=Math.min(1,Math.max(twin,forehead)*1.25),plane=.151-Math.pow(x/.10,2)*.018;
      let zz=THREE.MathUtils.lerp(z,Math.max(z,plane),fill);
      const r=Math.sqrt(Math.pow(x/.029,2)+Math.pow((y-.052)/.011,2));
      const socket=(1-THREE.MathUtils.smoothstep(r,.55,1.14))*.004;
      const brow=Math.exp(-Math.pow(x/.058,4)-Math.pow((y-.072)/.009,2))*.007;
      zz+=brow-socket;p.setXYZ(i,x,y,zz);
    }g.computeVertexNormals();o.geometry=g;
  });oldEyeObjects.forEach(o=>o.parent?.remove(o));
  const socketMaterial=new THREE.MeshStandardMaterial({color:0x625a45,roughness:.96});
  const socket=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),socketMaterial);socket.position.set(0,.052,.149);socket.scale.set(.027,.010,.004);socket.name='Restrained single socket under a natural brow';giant.add(socket);
  const ivory=new THREE.MeshStandardMaterial({color:0x8f9178,roughness:.69,envMapIntensity:.15});
  const eye=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),ivory);eye.position.set(0,.0515,.151);eye.scale.set(.021,.0068,.0035);eye.name='One proportioned Cyclops eye';giant.add(eye);
  const iris=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),new THREE.MeshStandardMaterial({color:0x665d39,roughness:.77}));iris.position.set(.002,.0517,.1545);iris.scale.set(.0054,.0054,.001);iris.name='Single dark iris';giant.add(iris);
  const pupil=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),new THREE.MeshStandardMaterial({color:0x28271f,roughness:.72}));pupil.position.set(.002,.0517,.1555);pupil.scale.set(.0023,.0027,.0006);pupil.name='Single pupil';giant.add(pupil);
  return{oldForeheadPartsRemoved:oldEyeObjects.length,eyeCount:1,eyeLocal:[0,.052,.151]};
}
