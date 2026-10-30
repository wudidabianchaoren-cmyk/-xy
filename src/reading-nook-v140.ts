import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
/** A fitted display alcove for one upright book, with a lit recess and a measured supporting shelf. */
export function readingNook(scene:THREE.Scene,width=3.9){
 const root=new THREE.Group();root.name='A single-book walnut alcove with warm practical lighting';scene.add(root);
 const loader=new THREE.TextureLoader();const woodMap=loader.load('./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg');woodMap.colorSpace=THREE.SRGBColorSpace;woodMap.wrapS=woodMap.wrapT=THREE.RepeatWrapping;woodMap.repeat.set(.9,1.5);woodMap.anisotropy=8;
 const normal=loader.load('./assets/odyssey/wood_planks/wood_planks_nor_gl_1k.jpg');normal.wrapS=normal.wrapT=THREE.RepeatWrapping;normal.repeat.copy(woodMap.repeat);
 const wood=new THREE.MeshStandardMaterial({map:woodMap,normalMap:normal,normalScale:new THREE.Vector2(.16,.16),color:0x866447,roughness:.48,envMapIntensity:.35});
 const stone=new THREE.MeshStandardMaterial({color:0x302e28,roughness:.75}),brass=new THREE.MeshStandardMaterial({color:0xb89951,metalness:1,roughness:.24,envMapIntensity:1.7});
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material)=>{const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,.035),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;};
 box(width,.14,1.05,0,.04,-.17,wood);box(width,.18,1.02,0,4.02,-.17,wood);
 for(const side of [-1,1]){box(.16,4.02,1.03,side*(width/2-.07),2.02,-.17,wood);box(.035,3.8,.024,side*(width/2-.17),2.02,.37,brass);}
 box(width-.28,3.84,.16,0,2.05,-.68,stone);box(width-.65,.085,.49,0,.152,.015,wood);
 // A pale inset diffuses the practical; it is behind the supported book, with no intersecting boards.
 box(width-.33,3.72,.035,0,2.05,-.574,new THREE.MeshStandardMaterial({color:0x534936,roughness:.92}));
 RectAreaLightUniformsLib.init();const lamp=new THREE.RectAreaLight(0xffe8c6,22,width-.65,.58);lamp.position.set(0,3.82,1.30);lamp.lookAt(0,1.7,.32);root.add(lamp);
 box(width-.9,.024,.03,0,3.89,.18,new THREE.MeshStandardMaterial({color:0xe8bb72,emissive:0xffc278,emissiveIntensity:.55}));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.24}));floor.rotation.x=-Math.PI/2;floor.position.y=-.12;floor.receiveShadow=true;scene.add(floor);
 const motesGeometry=new THREE.BufferGeometry();motesGeometry.setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:180},(_,i)=>i%3===0?Math.sin(i*17.2)*2.7:i%3===1?.6+(i%31)/31*3.5:Math.sin(i*2.4)*2.2),3));
 const time={value:0};const motes=new THREE.Points(motesGeometry,new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time},vertexShader:'uniform float time;varying float a;void main(){vec3 p=position;p.y+=.05*sin(time*.3+p.x*3.);vec4 v=modelViewMatrix*vec4(p,1.);gl_PointSize=clamp(8./max(1.,-v.z),.6,1.4);a=.08+.08*sin(p.x*7.+time*.6);gl_Position=projectionMatrix*v;}',fragmentShader:'varying float a;void main(){gl_FragColor=vec4(.86,.72,.42,a*(1.-smoothstep(.15,.5,length(gl_PointCoord-.5))));}'}));root.add(motes);
 void Promise.all([fetch('./assets/home/venice-prefiltered-cubeuv.json').then(r=>r.json()),fetch('./assets/home/venice-prefiltered-cubeuv.bin.gz').then(async r=>new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())]).then(([m,b])=>{const t=new THREE.DataTexture(new Uint16Array(b),m.width,m.height,THREE.RGBAFormat,THREE.HalfFloatType);t.mapping=THREE.CubeUVReflectionMapping;t.minFilter=t.magFilter=THREE.LinearFilter;t.colorSpace=THREE.LinearSRGBColorSpace;t.needsUpdate=true;scene.environment=t;scene.environmentIntensity=.3;});
 return {root,update:(t:number)=>{time.value=t;lamp.intensity=22;}};
}
