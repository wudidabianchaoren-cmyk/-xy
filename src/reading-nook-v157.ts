import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
/** Solid walnut cabinet with a single overhead practical and actual shadow casting. */
export function readingNook(scene:T.Scene,width=8.2){
 const root=new T.Group();root.name='V157 solid walnut book cabinet';scene.add(root);
 const loader=new T.TextureLoader(),map=loader.load('./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg'),normal=loader.load('./assets/odyssey/wood_planks/wood_planks_nor_gl_1k.jpg');map.colorSpace=T.SRGBColorSpace;for(const t of[map,normal]){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(1.15,1.1);t.anisotropy=8;}
 const wood=new T.MeshStandardMaterial({color:0x9b7450,map,normalMap:normal,normalScale:new T.Vector2(.18,.18),roughness:.45,envMapIntensity:.45}),back=new T.MeshStandardMaterial({color:0x43372b,roughness:.86}),brass=new T.MeshStandardMaterial({color:0xae8d42,metalness:.85,roughness:.32});
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material)=>{const o=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,.035),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 box(width+.20,.23,1.52,0,-.03,-.22,wood);box(width,.18,1.42,0,4.02,-.22,wood);box(width+.20,.12,1.51,0,4.16,-.22,wood);
 for(const sign of[-1,1]){box(.22,4.02,1.38,sign*(width/2-.09),2.02,-.22,wood);box(.045,3.87,.065,sign*(width/2-.23),2.02,.45,brass);box(.36,.17,1.5,sign*(width/2-.09),.10,-.22,wood);}
 box(width-.42,3.85,.17,0,2.04,-.91,back);box(width-.56,.085,1.25,0,.155,-.15,wood);
 // The only visible fixture is attached beneath the top board.
 box(2.25,.085,.24,0,3.89,.22,brass);box(2.04,.022,.16,0,3.835,.22,new T.MeshStandardMaterial({color:0xffd277,emissive:0xffb62d,emissiveIntensity:1.7}));
 RectAreaLightUniformsLib.init();const area=new T.RectAreaLight(0xffc24b,4.6,width-.9,.28);area.position.set(0,3.78,.65);area.lookAt(0,1.5,-.35);root.add(area);
 const key=new T.SpotLight(0xffc044,135,13,1.13,.52,2);key.position.set(0,3.78,1.0);key.target.position.set(0,1.15,-.4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.00015;key.shadow.normalBias=.012;key.shadow.radius=3;root.add(key,key.target);
 const ground=new T.Mesh(new T.PlaneGeometry(28,24),new T.ShadowMaterial({opacity:.26}));ground.rotation.x=-Math.PI/2;ground.position.y=-.18;ground.receiveShadow=true;scene.add(ground);
 void Promise.all([fetch('./assets/home/venice-prefiltered-cubeuv.json').then(r=>r.json()),fetch('./assets/home/venice-prefiltered-cubeuv.bin.gz').then(async r=>new Response(r.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())]).then(([m,b])=>{const t=new T.DataTexture(new Uint16Array(b),m.width,m.height,T.RGBAFormat,T.HalfFloatType);t.mapping=T.CubeUVReflectionMapping;t.minFilter=t.magFilter=T.LinearFilter;t.colorSpace=T.LinearSRGBColorSpace;t.needsUpdate=true;scene.environment=t;scene.environmentIntensity=.25;});
 return{root,update:(_t:number)=>{},lighting:{overhead:true,color:0xffc044,shadowMap:2048}};
}
