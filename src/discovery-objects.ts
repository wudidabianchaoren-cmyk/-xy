import * as THREE from 'three';
/** Reuse one context; animate only an open cabinet and release its model resources on close. */
let sharedRenderer:THREE.WebGLRenderer|undefined;
export function discoveryObject(host:HTMLElement,kind:'theatre'|'glass'){
 const renderer=sharedRenderer??=new THREE.WebGLRenderer({alpha:false,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(308,218);renderer.setClearColor(0x0b1412);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;
 host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label',kind==='theatre'?'拖动观看立体透视剧场':'移动滑条，让光穿过厚玻璃与铜框');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,308/218,.1,50),group=new THREE.Group();scene.add(group);
 const metal=new THREE.MeshStandardMaterial({color:0xb59150,metalness:.85,roughness:.34}),wood=new THREE.MeshStandardMaterial({color:0x29271e,roughness:.74}),dark=new THREE.MeshStandardMaterial({color:0x293e3a,roughness:.56}),bright=new THREE.MeshStandardMaterial({color:0xdcab64,metalness:.55,roughness:.3});
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,m:THREE.Material,parent=group)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const floor=box(0,-.9,-.1,4,.13,3.4,wood),top=box(0,1.45,-1,3.3,.10,.13,metal);void floor;void top;
 const light=new THREE.SpotLight(0xffc879,80,12,.65,.7,2);light.position.set(-2,3,2);light.target.position.set(0,0,-.7);light.castShadow=true;light.shadow.mapSize.set(512,512);scene.add(light,light.target,new THREE.HemisphereLight(0x9bbfbd,0x171209,.95));
 let control=.5,drag=false,px=0,angle=0,turn=0;
 const begin=(e:PointerEvent)=>{drag=true;px=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);};
 const move=(e:PointerEvent)=>{if(drag){angle=THREE.MathUtils.clamp(angle+(e.clientX-px)*.01,-.8,.8);px=e.clientX;}};
 const stop=()=>{drag=false;};
 if(kind==='theatre'){
  for(let i=0;i<6;i++){const s=1-i*.10,z=1.1-i*.58;for(const x of[-1.45,1.45])box(x*s,.24,z,.10,2.15*s,.13,metal);box(0,1.28*s,z,2.95*s,.10,.13,metal);const ring=new THREE.Mesh(new THREE.TorusGeometry(.66*s,.018,8,64),i%2?bright:metal);ring.position.set(.22*i/6,.12,z);group.add(ring);}
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,2),bright);orb.position.set(0,.14,-1.6);group.add(orb);
  box(0,-.17,-2.3,2.5,1.7,.12,dark);camera.position.set(.1,1,6.7);
  renderer.domElement.addEventListener('pointerdown',begin);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',stop);renderer.domElement.addEventListener('pointercancel',stop);
 }else{
  const glass=new THREE.MeshPhysicalMaterial({color:0x94baac,metalness:0,roughness:.12,transmission:.88,thickness:.18,ior:1.48,transparent:true,opacity:.72,envMapIntensity:1.2,clearcoat:1,side:THREE.DoubleSide});
  for(const x of[-.96,0,.96]){box(x,.15,0,.07,2.4,.2,metal);for(let j=0;j<3;j++){const pane=box(x+.43,-.58+j*.72,-.025,.79,.64,.16,glass);pane.rotation.y=(j%2?-.13:.13);}}
  for(const y of[-.96,-.25,.46,1.18])box(.43,y,0,2.9,.055,.2,metal);
  const beam=new THREE.Mesh(new THREE.ConeGeometry(.6,3.1,32,1,true),new THREE.MeshBasicMaterial({color:0xffc777,transparent:true,opacity:.065,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));beam.position.set(.25,.15,.45);beam.rotation.z=-.62;group.add(beam);
  camera.position.set(3.9,1.7,5.5);
 }
 camera.lookAt(.15,.18,-.3);
 let raf=0,frame=0;const paint=()=>{raf=requestAnimationFrame(paint);if(document.hidden||frame++%2)return;turn+=(angle-turn)*.12;if(kind==='theatre')group.rotation.y=turn;else{light.position.x=-3+control*6;light.position.z=2.5;light.color.setHSL(.09-control*.025,.72,.75);group.rotation.y=(control-.5)*.18;}renderer.render(scene,camera);};paint();
 return{set:(v:number)=>control=v,dispose:()=>{cancelAnimationFrame(raf);renderer.domElement.removeEventListener('pointerdown',begin);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',stop);renderer.domElement.removeEventListener('pointercancel',stop);const gs=new Set<THREE.BufferGeometry>(),ms=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());light.dispose();renderer.renderLists.dispose();renderer.domElement.remove();}};
}
