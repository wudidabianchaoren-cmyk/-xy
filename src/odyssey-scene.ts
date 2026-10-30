import * as THREE from 'three';
import {Water} from 'three/addons/objects/Water.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {createOdysseyControlsV118} from './odyssey-controls-v118';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createOdysseyDepth} from './odyssey-world-depth';
import {SeaAtmosphere} from './odyssey-atmosphere-v118';
import {createSeaBirds,updateSeaBirds,rockyGiantMaterial,coastalRockMaterial,dressTorchBearer} from './odyssey-details';
import {createOdysseyStory,createGalleyCrew,updateGalleyCrew,createShipWake,updateShipWake} from './odyssey-story';
import {createReefIsland,erodedBoulderGeometry} from './odyssey-refinement';
import {nativeMythology} from './native-v20';
import {nativeMeshList,exportNativeInput,applyNativeRefinement} from './odyssey-native-bridge';
import {finishMythology} from './odyssey-finish-v95';
import {islandShallows} from './island-shallows';
import {finishMaterialRendering} from './odyssey-materials-v103';
import {refineOdysseyVisual} from './odyssey-visual-v118';
import {loadNativeIslandV106} from './odyssey-native-v106';
import {loadNativeWorldV118} from './odyssey-native-v118';

type MovingSail={mesh:THREE.Mesh<THREE.BufferGeometry,THREE.MeshStandardMaterial>;base:Float32Array;phase:number;freeEdge?:boolean};
type Vessel={root:THREE.Group;origin:THREE.Vector3;sails:MovingSail[];phase:number;crew:ReturnType<typeof createGalleyCrew>;wake:ReturnType<typeof createShipWake>};
const host=document.getElementById('odysseyScene');
if(host) {
  let started=false;
  const boot=()=>{if(started)return;started=true;void initialise(host).catch(error=>{host.classList.add('has-error');console.error('Odyssey scene could not load',error);});};
  if(host.closest<HTMLElement>('#odyssey')?.dataset.open==='true')boot();
  window.addEventListener('v31:odyssey-open',boot);
}
async function initialise(host:HTMLElement) {
  let inputReady=false;const preparationStarted=performance.now(),yieldWork=()=>new Promise<void>(resolve=>setTimeout(resolve,0));
  const canvas=host.querySelector<HTMLCanvasElement>('canvas')!;canvas.style.opacity='0';
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=1.0;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35.8,1,.2,12000);camera.position.set(27,15,60);
  const controls=createOdysseyControlsV118(camera,canvas);controls.target.set(-105,16,-130);controls.update();
  const light=new THREE.DirectionalLight(0xffcd86,3.25);light.position.set(-100,80,30);light.target.position.set(-12,8,-15);
  light.castShadow=true;light.shadow.mapSize.set(2048,2048);light.shadow.camera.left=-40;light.shadow.camera.right=40;
  // The broad island extends well beyond the ship-sized shadow volume.
  // Preserve the original sun direction and motion, include its forest and cliffs.
  light.shadow.mapSize.set(4096,4096);light.shadow.camera.left=-245;light.shadow.camera.right=245;
  light.shadow.camera.top=185;light.shadow.camera.bottom=-185;light.shadow.camera.near=-420;light.shadow.camera.far=700;light.shadow.bias=-.00016;light.shadow.normalBias=.035;
  const reflectedLight=new THREE.DirectionalLight(0xcbd1c6,.85);reflectedLight.position.set(-25,18,35);
  scene.add(light,light.target,reflectedLight,new THREE.HemisphereLight(0xb1bfc5,0x353020,.38));
  const pmrem=new THREE.PMREMGenerator(renderer);
  const hdr=await new RGBELoader().loadAsync('./assets/odyssey/venice_sunset_1k.hdr');
  hdr.mapping=THREE.EquirectangularReflectionMapping;
  scene.environment=pmrem.fromEquirectangular(hdr).texture;scene.environmentIntensity=.22;pmrem.dispose();
  // Only sky is sampled: the HDRI's city foreground never enters this sea.
  const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,
    uniforms:{map:{value:hdr},time:{value:0}},vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D map;uniform float time;varying vec3 direction;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
    float fbm(vec2 p){float r=0.,a=.5;for(int i=0;i<5;i++){r+=a*noise(p);p=p*2.03+vec2(13.1,7.3);a*=.5;}return r;}
    void main(){vec3 d=normalize(direction);vec2 uv=vec2(atan(d.z,d.x)/6.2831853+.5,.62+max(d.y,0.)*.34);
    vec3 photo=texture2D(map,uv).rgb;float glow=pow(max(dot(d,normalize(vec3(-45.,35.,-160.))),0.),32.);
    float horizon=pow(max(0.,1.-abs(d.y)),5.);
    vec3 clear=mix(vec3(.026,.058,.063),vec3(.73,.34,.075),horizon);clear+=vec3(1.3,.70,.18)*glow*3.9;
    vec2 drift=vec2(d.x*5.+d.z*2.+time*.006,d.y*12.);
    float cloud=fbm(drift+vec2(1.,3.))+fbm(drift*2.2)*.13;
    float mass=smoothstep(.39,.69,cloud),rim=smoothstep(.39,.51,cloud)*(1.-smoothstep(.51,.67,cloud));
    vec3 cloudColor=mix(vec3(.018,.033,.038),vec3(.28,.16,.065),horizon*.56+glow*.44);
    vec3 sky=mix(clear,cloudColor,mass*.93);sky+=vec3(.43,.22,.047)*rim*(glow+.11)*horizon;
    sky=mix(sky,photo*.28,.035);
    gl_FragColor=vec4(sky,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(11000,48,24),skyMaterial);scene.add(sky);
  const normal=await new THREE.TextureLoader().loadAsync('./assets/odyssey/waternormals.jpg');normal.wrapS=normal.wrapT=THREE.RepeatWrapping;
  const water=new Water(new THREE.PlaneGeometry(900,900,220,220),{textureWidth:768,textureHeight:768,waterNormals:normal,
    sunDirection:new THREE.Vector3(-45,45,-160).normalize(),sunColor:0xffc575,waterColor:0x082e2b,distortionScale:4.8,fog:false});
  water.rotation.x=-Math.PI/2;water.position.y=-.15;water.receiveShadow=true;
  water.material.vertexShader=water.material.vertexShader.replace('void main() {',`void main() {vec3 displaced=position;float waveDetail=1.-smoothstep(170.,700.,length(position.xy));displaced.z+=(.34*sin(position.x*.21+time*.75)+.18*sin(position.y*.33-time*.62)+.06*sin(position.x*.8+position.y*.6-time*1.1))*waveDetail;`)
    .replaceAll('vec4( position, 1.0 )','vec4( displaced, 1.0 )');
  water.material.fragmentShader=water.material.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, alpha );',
    `outgoingLight=mix(outgoingLight,waterColor*.42,.14+.22*smoothstep(-14.,25.,worldPosition.z));gl_FragColor=vec4(outgoingLight,alpha);`);
  water.material.fragmentShader=water.material.fragmentShader.replace('float rf0 = 0.3;','float rf0 = 0.045;')
    .replace('vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight','vec3( 0.012 ) + reflectionSample * 0.64 + reflectionSample * specularLight')
    .replace('sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',`float rippleVariance=max(length(fwidth(surfaceNormal)),.0);
      float seaDistance=length(worldToEye);surfaceNormal=normalize(mix(surfaceNormal,vec3(0.,1.,0.),smoothstep(80.,850.,seaDistance)*.78));
      float seaShininess=mix(42.,12.,clamp(rippleVariance*2.,0.,1.));
      sunLight(surfaceNormal,eyeDirection,seaShininess,.58,.5,diffuseLight,specularLight);`);
  water.material.fragmentShader=water.material.fragmentShader.replace('uniform sampler2D normalSampler;',`uniform sampler2D normalSampler;
    uniform vec4 vesselWakes[4];uniform vec2 vesselHeading[4];
    float vesselWake(vec2 position){float result=0.;for(int i=0;i<4;i++){
      vec2 delta=position-vesselWakes[i].xy;vec2 heading=vesselHeading[i];
      float along=dot(delta,heading),across=abs(dot(delta,vec2(-heading.y,heading.x)));
      float stern=vesselWakes[i].z*.43,run=along-stern;
      float envelope=smoothstep(-1.3,1.7,run)*(1.-smoothstep(6.,24.,run));
      float edge=vesselWakes[i].w*.31+max(run,0.)*.20;
      float thickness=.18+max(run,0.)*.027;
      result+=exp(-pow((across-edge)/thickness,2.))*envelope*.035;
    }return result;}`)
    .replace('gl_FragColor=vec4(outgoingLight,alpha);','outgoingLight+=vec3(.18,.22,.20)*vesselWake(worldPosition.xz);gl_FragColor=vec4(outgoingLight,alpha);');
  scene.add(water);
  const farPositions:number[]=[],farIndices:number[]=[],farUvs:number[]=[],edgeSegments=220;
  const radii=[450,550,850,1400,2500,6000,10000];
  for(const radius of radii)for(let edge=0;edge<4;edge++)for(let j=0;j<edgeSegments;j++){
    const t=-1+j/edgeSegments*2;const xy=[[1,t],[-t,1],[-1,-t],[t,-1]][edge];farPositions.push(xy[0]*radius,xy[1]*radius,0);farUvs.push(xy[0]*radius/900,xy[1]*radius/900);
  }
  const ringVertices=edgeSegments*4;
  for(let ring=0;ring<radii.length-1;ring++)for(let j=0;j<ringVertices;j++){
    const a=ring*ringVertices+j,b=ring*ringVertices+(j+1)%ringVertices,c=a+ringVertices,d=b+ringVertices;farIndices.push(a,c,b,b,c,d);
  }
  const farGeometry=new THREE.BufferGeometry();farGeometry.setAttribute('position',new THREE.Float32BufferAttribute(farPositions,3));farGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(farUvs,2));farGeometry.setIndex(farIndices);farGeometry.computeVertexNormals();
  const farOcean=new THREE.Mesh(farGeometry,water.material);farOcean.name='Continuous outer ocean to ten kilometres';farOcean.rotation.x=-Math.PI/2;farOcean.position.y=-.15;scene.add(farOcean);
  const reflectWater=water.onBeforeRender.bind(water);water.onBeforeRender=(...args)=>{farOcean.visible=false;reflectWater(...args);farOcean.visible=true;};
  const random=seeded(1829);
  const timberLoader=new THREE.TextureLoader();
  const linen=await timberLoader.loadAsync('./assets/odyssey/rough_linen/rough_linen_diff_1k.jpg');
  const linenNormal=await timberLoader.loadAsync('./assets/odyssey/rough_linen/rough_linen_nor_gl_1k.jpg');
  const linenRough=await timberLoader.loadAsync('./assets/odyssey/rough_linen/rough_linen_rough_1k.jpg');
  linen.colorSpace=THREE.SRGBColorSpace;
  for(const t of [linen,linenNormal,linenRough]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}
  const human=await new GLTFLoader().loadAsync('./assets/odyssey/ulysses-rigged.glb');
  const clothTime={value:0};
  const performers:{mixer:THREE.AnimationMixer;fire:THREE.Object3D;fireScale:THREE.Vector3;lamp:THREE.PointLight}[]=[];
  const timber=await timberLoader.loadAsync('./assets/odyssey/wood_planks/wood_planks_diff_1k.jpg');
  const timberNormal=await timberLoader.loadAsync('./assets/odyssey/wood_planks/wood_planks_nor_gl_1k.jpg');
  const timberRough=await timberLoader.loadAsync('./assets/odyssey/wood_planks/wood_planks_rough_1k.jpg');
  timber.colorSpace=THREE.SRGBColorSpace;
  for(const t of [timber,timberNormal,timberRough]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}
  const wood=new THREE.MeshStandardMaterial({map:timber,normalMap:timberNormal,normalScale:new THREE.Vector2(.88,.88),roughnessMap:timberRough,roughness:.90,color:0xbca17e,envMapIntensity:.45});
  const darkwood=wood.clone();darkwood.color.set(0x8c735b);
  const deckWood=wood.clone();
  for(const key of ['map','normalMap','roughnessMap'] as const){deckWood[key]=wood[key]!.clone();deckWood[key]!.repeat.set(.24,.40);}
  const hullWoods=Array.from({length:9},(_,index)=>{
    const material=wood.clone();material.color.multiplyScalar(.82+(index%4)*.055);material.side=THREE.DoubleSide;
    material.onBeforeCompile=shader=>{
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float timberHeight;')
        .replace('#include <begin_vertex>','#include <begin_vertex>\ntimberHeight=position.y;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float timberHeight;')
        .replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb*=mix(.48,1.,smoothstep(-.12,.68,timberHeight));')
        .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(.40,roughnessFactor,smoothstep(-.12,.68,timberHeight));');
    };
    material.customProgramCacheKey=()=> 'odyssey-aged-timber-v32-67';return material;
  });
  const brass=new THREE.MeshStandardMaterial({color:0xa07837,metalness:.84,roughness:.39});
  const rope=new THREE.MeshStandardMaterial({color:0xa99e7d,roughness:.93});
  const loader=new THREE.TextureLoader();
  const rockDiffuse=await loader.loadAsync('./assets/odyssey/rock_boulder_cracked_diff_1k.jpg');
  const rockNormal=await loader.loadAsync('./assets/odyssey/rock_boulder_cracked_nor_gl_1k.jpg');
  const rockRough=await loader.loadAsync('./assets/odyssey/rock_boulder_cracked_rough_1k.jpg');
  for(const t of [rockDiffuse,rockNormal,rockRough]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}
  rockDiffuse.colorSpace=THREE.SRGBColorSpace;
  const rock=coastalRockMaterial(rockDiffuse,rockNormal,rockRough);
  function mesh(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D,pos:THREE.Vector3|number[],name:string) {
    const m=new THREE.Mesh(geometry,material);m.name=name;m.position.copy(pos instanceof THREE.Vector3?pos:new THREE.Vector3(...pos as [number,number,number]));
    m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  function beam(a:THREE.Vector3,b:THREE.Vector3,r:number,material:THREE.Material,parent:THREE.Object3D,name='Rigging') {
    const v=b.clone().sub(a);const m=mesh(new THREE.CylinderGeometry(r,r,v.length(),8),material,parent,a.clone().add(b).multiplyScalar(.5),name);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;
  }
  const scannedCoast=(await new GLTFLoader().loadAsync('./assets/odyssey/coastal_cliff_02/coastal_cliff_02.web.gltf')).scene;
  scannedCoast.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;
    const m=o.material as THREE.MeshStandardMaterial;m.color.set(0xa5a58e);m.roughness=.92;m.normalScale.set(.62,.62);}});
  function coast(x:number,z:number,sx:number,sy:number,sz:number,angle:number){
    const o=scannedCoast.clone(true);o.name='Scanned sea-worn cliff and stratified ledges';
    o.position.set(x,-1.6,z);o.scale.set(sx,sy,sz);o.rotation.y=angle;scene.add(o);
  }
  coast(-100,-151,1.05,.75,1.25,.28);
  coast(69,-149,1.35,.64,1.45,-.55);coast(-120,-215,2.5,1.15,3.4,.45);
  // Former isolated foreground reef replaced by a continuous island.
  // V17 native geology replaces the former procedural island; its original position is retained.
  // Submerged fractured outcrops break the shoreline into believable layers.
  for(let i=0;i<18;i++) {
    const g=erodedBoulderGeometry(1,i*.37);const m=mesh(g,rock,scene,[-84+i*1.4,-.2,-44+Math.sin(i*.32)*13],'Wet fractured littoral rock');
    m.scale.set(2+random()*3,2+random()*4,1.4+random()*3);m.rotation.set(random()*.6,random()*3,random()*.6);
  }
  await yieldWork();
  const cyclops=await nativeMythology(scene,rock);
  const coastalDepth=islandShallows(scene,water.material);
  const worldDepth=createOdysseyDepth(scene);
  const repairedEye={continuousBody:true,...cyclops.stats};
  // The cliff is behind the figure, with a clear air gap around head, neck and shoulders.
  coast(-85,-170,.63,.56,1.1,0);coast(-43,-178,.62,.62,1.2,.2);
  const birds=createSeaBirds(scene);
  const story=createOdysseyStory(scene,rock,wood,linen,human.scene,cyclops);

  function makeSail(root:THREE.Group,corners:THREE.Vector3[],phase:number):MovingSail {
    const pos:number[]=[],uv:number[]=[],indices:number[]=[],rows=30;
    for(let i=0;i<=rows;i++)for(let j=0;j<=rows;j++) {
      const u=j/rows,v=i/rows;
      const lower=corners[0].clone().lerp(corners[1],u),upper=corners[3].clone().lerp(corners[2],u);
      const p=lower.lerp(upper,v);p.z+=.92*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
      p.y+=.18*Math.sin(Math.PI*u)*(1-v);
      p.z+=.026*Math.sin(u*Math.PI*18)*Math.sin(Math.PI*v)*Math.sin(Math.PI*u);
      pos.push(p.x,p.y,p.z);uv.push(u,v);
      if(i<rows&&j<rows){const a=i*(rows+1)+j,b=a+1,c=a+rows+1;indices.push(a,b,c,b,c+1,c);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    const mat=new THREE.MeshPhysicalMaterial({map:linen.clone(),normalMap:linenNormal.clone(),normalScale:new THREE.Vector2(.80,.80),roughnessMap:linenRough.clone(),roughness:.96,side:THREE.DoubleSide,color:0xd3c6a2,sheen:.16,sheenRoughness:.95,sheenColor:new THREE.Color(0xc4b48e)});
    for(const t of [mat.map,mat.normalMap,mat.roughnessMap])t!.repeat.set(5,7.6);
    mat.onBeforeCompile=shader=>{
      shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 sailUv;')
        .replace('#include <uv_vertex>','#include <uv_vertex>\nsailUv=uv;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 sailUv;')
        .replace('#include <roughnessmap_fragment>','float roughnessFactor=.86+.12*texture2D(roughnessMap,vRoughnessMapUv).g;')
        .replace('#include <map_fragment>',`#include <map_fragment>
          float seamDistance=abs(fract(sailUv.x*7.+.5)-.5);
          float seam=1.-smoothstep(.009,.021,seamDistance);
          float hem=1.-smoothstep(.009,.020,min(min(sailUv.x,1.-sailUv.x),min(sailUv.y,1.-sailUv.y)));
          float stitch=seam*(.5+.5*step(.55,fract(sailUv.y*160.)));
          diffuseColor.rgb*=1.-seam*.26-hem*.32-stitch*.12; diffuseColor.rgb*=.94+.06*sin(sailUv.x*70.)*sin(sailUv.y*110.);`);
    };
    mat.customProgramCacheKey=()=> 'odyssey-taut-heavy-woven-sail-v32-72';
    const m=mesh(g,mat,root,[0,0,0],'Wind-filled linen sail');return{mesh:m as MovingSail['mesh'],base:new Float32Array(pos),phase};
  }
  function vessel(x:number,z:number,scale:number,phase:number,variant=0):Vessel {
    const root=new THREE.Group();root.name=['Ulysses flagship','Ochre escort galley','Single-mast scout','Blue-sailed provision ship'][variant];root.userData.variant=variant;root.position.set(x,.18,z);root.scale.setScalar(scale);scene.add(root);
    const len=19,width=5.5,segments=64;
    for(let band=0;band<9;band++)for(const side of [-1,1]) {
      const positions:number[]=[],indices:number[]=[],uv:number[]=[];
      for(let j=0;j<=segments;j++)for(let edge=0;edge<2;edge++) {
        const u=j/segments,v=(band+edge*.97)/9;
        positions.push((u-.5)*len,-.65+v*2.15+Math.pow(Math.abs(u-.5)*2,5)*1.23,side*(width/2)*Math.pow(Math.sin(u*Math.PI),.63)*(.20+.80*Math.sin(v*Math.PI*.5)));
        uv.push(u*2.4+band*.137,(band%8+edge*.94)/8);
      }
      for(let j=0;j<segments;j++){const a=j*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
      mesh(g,hullWoods[band],root,[0,0,0],'Individually curved hull plank');
    }
    const outline=new THREE.Shape();outline.moveTo(-9.15,0);
    for(let j=0;j<=64;j++){const u=j/64;outline.lineTo((u-.5)*18.3,width*.48*Math.sin(u*Math.PI)**.65);}
    for(let j=64;j>=0;j--){const u=j/64;outline.lineTo((u-.5)*18.3,-width*.48*Math.sin(u*Math.PI)**.65);}
    outline.closePath();const hatch=new THREE.Path();hatch.moveTo(-4.25,-1.62);hatch.lineTo(-4.25,1.62);hatch.lineTo(4.4,1.62);hatch.lineTo(4.4,-1.62);hatch.closePath();outline.holes.push(hatch);
    const deck=mesh(new THREE.ExtrudeGeometry(outline,{depth:.14,bevelEnabled:true,bevelSize:.04,bevelThickness:.03,bevelSegments:2,steps:1}),deckWood,root,[0,1.5,0],'Solid timber deck with open hold');deck.rotation.x=-Math.PI/2;
    mesh(new THREE.BoxGeometry(13.8,.14,3.72),darkwood,root,[0,.26,0],'Recessed structural bilge floor');
    for(const side of [-1,1])mesh(new THREE.BoxGeometry(8.75,.23,.13),darkwood,root,[.075,1.58,side*1.69],'Thick open rowing-well coaming');
    for(const x of [-4.31,4.46])mesh(new THREE.BoxGeometry(.13,.23,3.49),darkwood,root,[x,1.58,0],'Hold end coaming');
    for(let rib=0;rib<13;rib++){
      const x=-6+rib,halfWidth=width*.44*Math.sin((x/18.3+.5)*Math.PI)**.65;
      const profile=[new THREE.Vector3(x,1.45,-halfWidth),new THREE.Vector3(x,.72,-halfWidth*.73),new THREE.Vector3(x,.38,0),new THREE.Vector3(x,.72,halfWidth*.73),new THREE.Vector3(x,1.45,halfWidth)];
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(profile),16,.055,6,false),darkwood,root,[0,0,0],'Interior bent timber frame');
    }
    for(const z of [-.33,.33])beam(new THREE.Vector3(3.79,.34,z),new THREE.Vector3(4.23,1.49,z),.046,wood,root,'Hold ladder stringer');
    for(let step=0;step<5;step++)mesh(new THREE.BoxGeometry(.11,.066,.68),wood,root,[3.84+step*.08,.47+step*.23,0],'Hold ladder step');
    for(const x of [-6.35,6.0])mesh(new THREE.BoxGeometry(.14,1.12,3.5),darkwood,root,[x,.93,0],'Interior watertight bulkhead');
    for(const side of [-1,1]) {
      const points=Array.from({length:65},(_,j)=>{const u=j/64;return new THREE.Vector3((u-.5)*19,1.65+Math.abs(u-.5)**4*17,side*width*.5*Math.sin(u*Math.PI)**.63);});
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.072,8,false),brass,root,[0,0,0],'Bronze hull rail');
    }
    for(let i=0;i<6;i++){const x=-3.65+i*1.36;mesh(new THREE.BoxGeometry(.28,.16,3.36),darkwood,root,[x,.75,0],'Recessed rowing bench');}
    for(const x of [-7.25,6.72])mesh(new THREE.BoxGeometry(2.22,.17,2.10),deckWood,root,[x,1.82,0],'Raised bow and stern working deck');
    // Separate port and starboard walkways leave the actual rowing well open to the eye.
    for(const side of [-1,1])for(let board=0;board<4;board++)mesh(new THREE.BoxGeometry(8.48,.055,.10),wood,root,[.08,1.67,side*(1.87+board*.14)],'Individual side-deck plank');
    const mastX=-.7;
    beam(new THREE.Vector3(mastX,.29,0),new THREE.Vector3(mastX,15.25,0),.095,wood,root,'Main timber mast');
    beam(new THREE.Vector3(-4.8,14.7,0),new THREE.Vector3(3.5,14.7,0),.071,wood,root,'Square-sail main yard');
    if(variant!==2){beam(new THREE.Vector3(3.8,.29,0),new THREE.Vector3(3.8,9.5,0),.07,wood,root,'After mast');
    beam(new THREE.Vector3(1.8,9.5,.04),new THREE.Vector3(5.8,9.5,.04),.048,wood,root,'After square yard');}
    const sails=[makeSail(root,[new THREE.Vector3(-3.7,5.2,0),new THREE.Vector3(2.5,5.2,0),new THREE.Vector3(3.2,14.7,0),new THREE.Vector3(-4.5,14.7,0)],phase),
      makeSail(root,[new THREE.Vector3(2.1,4.4,.1),new THREE.Vector3(5.5,4.4,.1),new THREE.Vector3(5.5,9.5,.1),new THREE.Vector3(2.1,9.5,.1)],phase+1)];
    if(variant===2){root.remove(sails[1].mesh);sails[1].mesh.geometry.dispose();sails[1].mesh.material.dispose();sails.splice(1,1);}
    if(variant>0){for(const sail of sails){sail.mesh.material=sail.mesh.material.clone();sail.mesh.material.color.set([0xffffff,0xb6a16e,0xc4bda5,0x80959b][variant]);const p=sail.mesh.geometry.attributes.position;for(let j=0;j<p.count;j++){const y=p.getY(j);p.setY(j,5.2+(y-5.2)*[1,.91,.76,.84][variant]);}p.needsUpdate=true;sail.mesh.geometry.computeVertexNormals();sail.base=new Float32Array(p.array);}}
    for(const side of [-1,1])for(const ax of [-5.4,-2.1,1.8,5.6])beam(new THREE.Vector3(mastX,13.5,0),new THREE.Vector3(ax,1.65,side*2.1),.025,rope,root,'Tensioned standing rigging');
    beam(new THREE.Vector3(-4.5,5.2,0),new THREE.Vector3(-6.0,1.80,0),.016,rope,root,'Sail foot sheet');
    const red=new THREE.MeshStandardMaterial({color:[0x8d281c,0x9c7440,0x626e52,0x446772][variant],roughness:.87,side:THREE.DoubleSide});
    const flag=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.46,12,3),red);flag.position.set(.25,15.3,.11);root.add(flag);
    sails.push({mesh:flag,base:new Float32Array(flag.geometry.attributes.position.array),phase:phase+2,freeEdge:true});
    if(variant===0){const hero=cloneSkeleton(human.scene);hero.name='Anatomically rigged linen-clothed torch bearer';hero.position.set(-7.17,1.94,.12);hero.rotation.y=-.55;hero.scale.setScalar(1.20);root.add(hero);
    dressTorchBearer(hero,linen,linenNormal,linenRough,clothTime);
    const mixer=new THREE.AnimationMixer(hero);
    for(const clip of human.animations){const motion=clip.clone();motion.tracks=motion.tracks.filter(t=>/head|spine01|upperarm01.?R/.test(t.name)&&t.name.endsWith('.quaternion'));mixer.clipAction(motion).play();}
    const fire=hero.getObjectByName('Living_torch_fire')||hero.getObjectByName('Living torch fire')||hero;
    const torch=new THREE.PointLight(0xffae53,18,6,2);scene.add(torch);performers.push({mixer,fire,fireScale:fire.scale.clone(),lamp:torch});}
    const prow=new THREE.CatmullRomCurve3([new THREE.Vector3(-9.1,1.7,0),new THREE.Vector3(-10.1,2.5,0),new THREE.Vector3(-10,3.7,0)]);
    mesh(new THREE.TubeGeometry(prow,20,.093,10,false),brass,root,[0,0,0],'Curved carved figurehead');
    if(variant>0){const h=[1,.91,.76,.84][variant];flag.position.y=5.2+(flag.position.y-5.2)*h;root.traverse(o=>{if(o instanceof THREE.Mesh&&/Main mast|Main square yard|After mast|After square yard|Tensioned standing rigging/.test(o.name)){const g=o.geometry.clone(),p=g.getAttribute('position');for(let j=0;j<p.count;j++){const y=p.getY(j)+o.position.y;if(y>5.2)p.setY(j,5.2+(y-5.2)*h-o.position.y);}g.computeVertexNormals();o.geometry=g;}});}
    // Static joinery is batched; moving cloth and skinned people remain independent.
    const parts=new Map<THREE.Material,THREE.Mesh[]>();
    for(const child of [...root.children])if(child instanceof THREE.Mesh&&!(child instanceof THREE.SkinnedMesh)&&!sails.some(s=>s.mesh===child)&&!Array.isArray(child.material)){
      const list=parts.get(child.material)??[];list.push(child);parts.set(child.material,list);
    }
    for(const [material,meshes] of parts){
      if(meshes.length<2)continue;
      const geometries=meshes.map(m=>{m.updateMatrix();return(m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone()).applyMatrix4(m.matrix);});
      const joined=mergeGeometries(geometries);if(!joined){geometries.forEach(g=>g.dispose());continue;}
      for(const m of meshes)root.remove(m);geometries.forEach(g=>g.dispose());mesh(joined,material,root,[0,0,0],'Batched solid hull and interior joinery');
    }
    const crew=createGalleyCrew(root,wood,linen,human.scene,phase,variant);
    if(variant>0){root.traverse(o=>{if(o instanceof THREE.Mesh&&!(o instanceof THREE.SkinnedMesh)&&o.name==='Batched solid hull and interior joinery'){const m=o.material;if(m instanceof THREE.MeshStandardMaterial){o.material=m.clone();(o.material as THREE.MeshStandardMaterial).color.multiply(new THREE.Color([0xffffff,0xd8c498,0x9c9281,0xb4a07d][variant]));}}});}
    const wake=createShipWake(scene,root,len,width);
    const origin=root.position.clone();return{root,origin,sails,phase,crew,wake};
  }
  const ships:Vessel[]=[];for(const [variant,spec] of [[-7,3,1.22,0],[42,-24,1.12,2.1],[-32,-10,1.08,3.2],[-10,-35,1.05,1.5]].entries()){ships.push(vessel(...spec as [number,number,number,number],variant));await yieldWork();}ships[1].root.rotation.y=-.42;ships[2].root.rotation.y=.28;
  water.material.uniforms.vesselWakes={value:ships.map(s=>s.wake.footprint)};water.material.uniforms.vesselHeading={value:ships.map(s=>s.wake.heading)};
  // Closed camera and gaze splines are time-driven; scrolling changes elevation gently, never hard-cuts.
  const flight=new THREE.CatmullRomCurve3([new THREE.Vector3(27,15,60),new THREE.Vector3(16,16,49),new THREE.Vector3(0,14,43),new THREE.Vector3(-8,15,59)],true,'centripetal');
  const gaze=new THREE.CatmullRomCurve3([new THREE.Vector3(-105,16,-130),new THREE.Vector3(-92,18,-121),new THREE.Vector3(-79,17,-112),new THREE.Vector3(-96,17,-122)],true,'centripetal');
  const target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:true,samples:4});target.depthTexture=new THREE.DepthTexture(1,1);
  const composer=new EffectComposer(renderer,target);
  composer.renderTarget2.depthTexture=new THREE.DepthTexture(1,1);composer.addPass(new RenderPass(scene,camera));
  const atmosphere=new SeaAtmosphere(camera);composer.addPass(atmosphere);
  const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.16,.35,1.18);composer.addPass(bloom);composer.addPass(new OutputPass());composer.addPass(new SMAAPass());
  let active=false,paused=false,last=performance.now(),time=0,scroll=0,smoothScroll=0,dragging=false,manualUntil=0;
  controls.addEventListener('start',()=>{dragging=true;});
  controls.addEventListener('end',()=>{dragging=false;manualUntil=Infinity;});
  let impulse=0;const pick=new THREE.Raycaster();let pointerStart=new THREE.Vector2();
  canvas.addEventListener('pointerdown',e=>pointerStart.set(e.clientX,e.clientY));
  canvas.addEventListener('pointerup',e=>{if(!inputReady)return;if(pointerStart.distanceTo(new THREE.Vector2(e.clientX,e.clientY))>5)return;
    const b=canvas.getBoundingClientRect();pick.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),camera);
    if(ships.some((_s,i)=>pick.ray.intersectsBox(clickBounds[i]))){impulse=1;state.interactions++;}});
  scene.updateMatrixWorld(true);const nativeMeshes=nativeMeshList(scene);
  const continentSurfaces=nativeMeshes.filter(o=>/^Closed continent /.test(o.name)).map(o=>({mesh:o,geometry:o.geometry,material:o.material}));
  // Native smart-project atlases are not compatible with the original human skin layout.
  const anatomyUV=new Map(nativeMeshes.filter(o=>/Uncut_anatomical_Human(body|ears|lips|fingernails|toenails)/.test(o.name)).map(o=>[o.userData.native84Key,o.geometry.clone()]));
  const nativeRefinement=await applyNativeRefinement(nativeMeshes,scene);await yieldWork();
  // Native export omitted the distant terrain's per-vertex mineral/bounce colours.
  // Keep the original closed volume and its varied surface rather than the flat white replacement.
  for(const saved of continentSurfaces){saved.mesh.geometry=saved.geometry;saved.mesh.material=saved.material;}
  const surfaceFinish=finishMythology(scene,rock,ships.map(s=>s.root));await yieldWork();
  const islandFinish=await loadNativeIslandV106(scene);await yieldWork();
  Object.assign(coastalDepth,islandShallows(scene,water.material));
  const materialFinish=await finishMaterialRendering(scene,ships.map(s=>s.root),anatomyUV);await yieldWork();
  const visual=await refineOdysseyVisual(scene,ships,camera,light);await yieldWork();
  const nativeWorldV118=await loadNativeWorldV118(scene,ships,visual.prepareMaterial);await yieldWork();
  const clickBounds=ships.map(ship=>new THREE.Box3().setFromObject(ship.root));
  islandFinish.giantCenter.copy(nativeWorldV118.giantCenter);
  Object.assign(visual.info,{version:106,island:{...islandFinish,giant:undefined,newMeshes:undefined,giantCenter:islandFinish.giantCenter.toArray()}});
  Object.assign(visual.info,{version:118,nativeWorld:nativeWorldV118.info,forest:{source:'Actual native masked Poly Haven scan forest',planted:620,visibleTrees:543,nearLeafTriangles:88336,maxNearTrees:16,far:'actual native full-tree render crossed cards'},shoreRocks:10,shorePebbles:0,flightRetained:false,sunDirectionRetained:false});
  for(const ship of ships)for(const sail of ship.sails)sail.base=new Float32Array(sail.mesh.geometry.getAttribute('position').array);
  const state={surfaceFinish,materialFinish,visualFinish:visual.info,nativeRefinement,prepareMode:'explicit-click',exportNative:()=>{const extra=visual.exportMeshes.filter(o=>o.parent);extra.forEach((o,i)=>o.userData.native84Key='native104_'+i);const exported=exportNativeInput(scene,camera,[...nativeMeshes,...extra]);exported.camera.target=controls.target.toArray();return exported;},exportInstances:()=>{const packs:any[]=[];scene.updateMatrixWorld(true);scene.traverse(o=>{if(!(o instanceof THREE.InstancedMesh)||!o.visible)return;let ancestor:THREE.Object3D|null=o,inVessel=false;while(ancestor){if(ancestor.userData.variant!==undefined)inVessel=true;ancestor=ancestor.parent;}if(!inVessel&&!/^V104|Naturally exposed|V95 fractured/.test(o.name))return;const prototype=o.clone();prototype.matrixWorld.identity();prototype.userData.native84Key='instance104_'+packs.length;const geometry=exportNativeInput(scene,camera,[prototype]).meshes[0],matrix=new THREE.Matrix4(),matrices:number[][]=[];for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrices.push(o.matrixWorld.clone().multiply(matrix).elements.slice());}const m=(Array.isArray(o.material)?o.material[0]:o.material) as THREE.MeshStandardMaterial;const imagePath=(t:THREE.Texture|null)=>{const im=t?.image;return typeof im?.src==='string'?new URL(im.src,location.href).pathname.slice(1):null;};packs.push({geometry,matrices,inVessel,materialName:m.name,alphaMap:imagePath(m.alphaMap),alphaTest:m.alphaTest});});return packs;},inputControls:controls.debug,ready:false,prepareMilliseconds:0,time:0,renderFrames:0,heartbeats:0,active:false,boats:ships.length,interactive:true,interactions:0,anatomicalHumans:performers.length,depthAwareVolumeFog:true,objects:0,camera:[0,0,0],cameraMode:'cinematic-flight',flightDuration:40,
    coastalDepth,fleetVariants:ships.map(s=>({name:s.root.name,variant:s.root.userData.variant,sails:s.sails.filter(a=>!a.freeEdge).length,crew:s.crew.people})),unmannedOars:0,mannedOars:ships.reduce((n,s)=>n+s.crew.rowers.length,0),crew:ships.reduce((n,s)=>n+s.crew.people,0),storyElements:story.labels,giantPose:story.giantPose,whiteWakeTubes:0,proceduralOpenSeaFoam:false,filteredWaterHighlights:true,flagshipLength:19*1.22,
    birds:birds.length,oceanRadius:10000,openHolds:4,boatLengths:ships.map(s=>19*s.root.scale.x),worldDepth:{continentalWidth:worldDepth.continentalWidth,distances:worldDepth.distances,rainDrops:worldDepth.rainDrops,aerosols:worldDepth.aerosols},giantSurface:'V118 recessed single eye, integrated lids/hair and continuous CC0 male anatomy',giantEye:repairedEye,anatomicalRowers:48,periodClothing:'linen tunics / wool mantles / leather belts and shoes / bronze fasteners',reefGeometry:'asymmetric stratified reef island and low broken littoral shelves',
    holdDepths:()=>ships.map(ship=>{ship.root.updateMatrixWorld(true);const origin=ship.root.localToWorld(new THREE.Vector3(1.07,3,.64)),below=ship.root.localToWorld(new THREE.Vector3(1.07,0,.64)),ray=new THREE.Raycaster(origin,below.sub(origin).normalize());const hit=ray.intersectObject(ship.root,true)[0];return hit?1.5-ship.root.worldToLocal(hit.point.clone()).y:0;}),
    projectBoats:()=>ships.map(ship=>{const p=ship.root.localToWorld(new THREE.Vector3(-1,1.76,0)).project(camera),b=canvas.getBoundingClientRect();return [b.left+(p.x+1)*b.width/2,b.top+(1-p.y)*b.height/2];}),
    projectBirds:()=>birds.map(bird=>{const p=bird.root.getWorldPosition(new THREE.Vector3()).project(camera),b=canvas.getBoundingClientRect();return {pixel:[b.left+(p.x+1)*b.width/2,b.top+(1-p.y)*b.height/2],depth:p.z,position:bird.root.position.toArray(),wingAngles:bird.wings.map(wing=>wing.rotation.z)};}),
    review:(seconds:number)=>{controls.resetInteraction();time=seconds;manualUntil=0;camera.position.copy(flight.getPoint((time%40)/40));controls.target.copy(gaze.getPoint((time%40)/40));updateSeaBirds(birds,time);controls.update();},
    reviewTreeBase:()=>{controls.resetInteraction();manualUntil=Infinity;const p=nativeWorldV118.treeBase;camera.position.copy(p).add(new THREE.Vector3(4,2.2,8));controls.target.copy(p).add(new THREE.Vector3(0,1,0));controls.update();},
    reviewCaptain:()=>{controls.resetInteraction();manualUntil=Infinity;const p=nativeWorldV118.captainHead;camera.position.copy(p).add(new THREE.Vector3(2.2,.5,2.2));controls.target.copy(p);controls.update();},
    reviewShore:()=>{controls.resetInteraction();manualUntil=Infinity;camera.position.set(-190,12,-53);controls.target.set(-157,12,-108);controls.update();},
    reviewGiantHead:()=>{controls.resetInteraction();manualUntil=Infinity;const p=islandFinish.giantCenter;camera.position.set(p.x+1,p.y+6.4,p.z+7);controls.target.copy(p).add(new THREE.Vector3(0,6.4,0));controls.update();},
    reviewGiant:()=>{controls.resetInteraction();manualUntil=Infinity;const p=islandFinish.giantCenter;camera.position.set(p.x+6,p.y+3,p.z+35);controls.target.copy(p).add(new THREE.Vector3(0,2,0));controls.update();},
    performanceInfo:()=>({render:{...renderer.info.render},memory:{...renderer.info.memory},programs:renderer.info.programs?.length}),
    inspectVisual:()=>{const meshes:any[]=[];scene.traverse(o=>{if(o instanceof THREE.Mesh)meshes.push({name:o.name,key:o.userData.native84Key,instanced:o instanceof THREE.InstancedMesh?o.count:0,visible:o.visible,materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>({name:m.name,type:m.type,color:(m as THREE.MeshStandardMaterial).color?.getHexString(),map:(m as THREE.MeshStandardMaterial).map?.name}))});});return meshes;},
    capture:()=>{composer.render();return canvas.toDataURL('image/png');}};scene.traverse(()=>state.objects++);
  (window as unknown as Record<string,unknown>).odysseyState=state;
  function resize(){renderer.setSize(host.clientWidth,host.clientHeight,false);composer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();visual.resize();}
  new ResizeObserver(resize).observe(host);resize();
  new IntersectionObserver(entries=>{active=entries[0].isIntersecting;}).observe(host);
  const pause=host.querySelector<HTMLButtonElement>('[data-odyssey-pause]')!;
  pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'继续场景':'暂停场景');pause.innerHTML=paused?'<i data-lucide="play"></i>':'<i data-lucide="pause"></i>';(window as any).lucide?.createIcons();});
  host.querySelector('[data-odyssey-reset]')!.addEventListener('click',()=>{controls.resetInteraction();time=0;manualUntil=0;camera.position.copy(flight.getPoint(0));controls.target.copy(gaze.getPoint(0));controls.update();});
  const section=host.closest('section')!;
  const openingBusy=()=>{
    const gate=document.getElementById('entryGate');
    return !!gate&&(!document.body.classList.contains('experience-entered')||!!(window as any).gsap?.isTweening(gate));
  };
  window.addEventListener('scroll',()=>{if(section.getAttribute('role')==='dialog'){scroll=0;return;}const r=section.getBoundingClientRect();scroll=THREE.MathUtils.clamp(-r.top/Math.max(1,section.offsetHeight-innerHeight),0,1);},{passive:true});
  function animate(now:number) {
    requestAnimationFrame(animate);const dt=Math.min(.50,(now-last)/1000);last=now;state.heartbeats++;
    // Sticky sections can receive stale observer entries during the site's smoothed scroll.
    if(!active){const r=host.getBoundingClientRect();active=r.bottom>0&&r.top<innerHeight;}
    if(section.hidden)active=false;state.active=active;if(!active || document.hidden || openingBusy())return;
    if(!paused)time+=dt;
    water.material.uniforms.time.value=time;skyMaterial.uniforms.time.value=time;
    atmosphere.uniforms.time.value=time;worldDepth.update(time);clothTime.value=time;impulse=Math.max(0,impulse-(paused?0:dt)*.6);
    for(const ship of ships) {
      ship.root.position.x=ship.origin.x+.19*Math.sin(time*.14+ship.phase);
      const x=ship.root.position.x,z=ship.root.position.z;
      const a=x*.21+time*.75,b=-z*.33-time*.62,c=x*.8-z*.6-time*1.1;
      ship.root.position.y=ship.origin.y+.34*Math.sin(a)+.18*Math.sin(b)+.06*Math.sin(c);
      // Match the same wave field used by Water's displaced vertices.
      ship.root.rotation.z=Math.atan(.34*.21*Math.cos(a)+.06*.8*Math.cos(c))*.75;
      ship.root.rotation.x=Math.atan(.18*.33*Math.cos(b)+.06*.6*Math.cos(c))*.60;
      updateGalleyCrew(ship.crew,time);updateShipWake(ship.wake,ship.root,time);
      for(const sail of ship.sails) {
        const p=sail.mesh.geometry.attributes.position;
        for(let i=0;i<p.count;i++){
          const y=sail.base[i*3+1],x=sail.base[i*3],uv=sail.mesh.geometry.attributes.uv;
          const tension=sail.freeEdge?(x+1.1)/2.2:Math.sin(Math.PI*uv.getX(i))*Math.sin(Math.PI*uv.getY(i));
          p.setZ(i,sail.base[i*3+2]+(.14+impulse*.16)*Math.sin(y*.77+x*.43-time*1.30+sail.phase)*tension+sail.base[i*3+2]*.035*Math.sin(time*.83+sail.phase)*tension);
        }
        p.needsUpdate=true;if(state.renderFrames%3===0)sail.mesh.geometry.computeVertexNormals();
      }
    }
    for(const p of performers){
      p.mixer.setTime(time);p.fire.scale.set(p.fireScale.x*(1.+.12*Math.sin(time*17.)),p.fireScale.y*(1.+.24*Math.sin(time*11.7)),p.fireScale.z*(1.+.10*Math.cos(time*13.)));
      p.fire.getWorldPosition(p.lamp.position);p.lamp.intensity=(18+5*Math.sin(time*11.7)+impulse*40);
    }
    nativeWorldV118.update(time,camera);updateSeaBirds(birds,time);
    story.update(time);
    // Keep the head and continuous body in one anatomical frame; no independent floating head sway.
    cyclops.update(time);
    smoothScroll=THREE.MathUtils.lerp(smoothScroll,scroll,1-Math.exp(-dt*2));
    if(!paused&&!dragging&&time>=manualUntil) {
      const t=(time%40)/40,position=flight.getPoint(t),target=gaze.getPoint(t);
      position.y+=smoothScroll*4;target.y+=smoothScroll*1.5;
      const blend=1-Math.exp(-dt*.75);camera.position.lerp(position,blend);controls.target.lerp(target,blend);
      state.cameraMode='cinematic-flight';
    }else if(dragging||time<manualUntil)state.cameraMode='manual-orbit';
    controls.update();visual.update(time);composer.render();
    state.time=time;state.renderFrames++;state.camera=camera.position.toArray();
    host.classList.add('is-ready');
  }
  renderer.setSize(16,16,false);composer.setSize(16,16);
  visual.update(0);
  await renderer.compileAsync(scene,camera);await yieldWork();
  const textures=new Set<THREE.Texture>();scene.traverseVisible(o=>{if(o instanceof THREE.Mesh){for(const m of (Array.isArray(o.material)?o.material:[o.material]))for(const v of Object.values(m))if(v instanceof THREE.Texture)textures.add(v);}});
  let uploaded=0;for(const texture of textures){renderer.initTexture(texture);if(++uploaded%3===0)await yieldWork();}
  composer.render();await yieldWork();resize();composer.render();
  state.prepareMilliseconds=performance.now()-preparationStarted;state.ready=true;inputReady=true;canvas.style.opacity='';host.classList.add('is-ready');last=performance.now();
  requestAnimationFrame(animate);
}
function seeded(seed:number){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};}
