import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const surface=document.querySelector<HTMLElement>('.home-rendered-architecture');
const video=document.getElementById('homeArchitectureVideo') as HTMLVideoElement|null;
if(surface && video) {
  const cinematic=video.querySelector('source')?.src.includes('architecture-v14') ?? false;
  const fullFacade=cinematic||(video.querySelector('source')?.src.includes('architecture-v13') ?? false);
  type ShotFrame={position:number[];target:number[];lens:number;light:number[];lightEnergy:number;lightColor:number[];shot:string};
  let track:ShotFrame[]=[];const rotors:THREE.Object3D[]=[];
  const offsets=[0,0],targets=[0,0];
  let presentedTime=0;
  if('requestVideoFrameCallback' in video){const present=(_now:number,frame:VideoFrameCallbackMetadata)=>{presentedTime=frame.mediaTime;video.requestVideoFrameCallback(present);};video.requestVideoFrameCallback(present);}
  const canvas=document.createElement('canvas');canvas.className='home-live-clock';canvas.setAttribute('aria-hidden','true');surface.append(canvas);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.shadowMap.enabled=fullFacade;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
  renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=.73;
  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=new RoomEnvironment();
  const env=pmrem.fromScene(environment,.04);scene.environment=env.texture;environment.dispose();pmrem.dispose();
  const camera=new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2*Math.atan(36/(2*39.5*(16/9)))),16/9,.1,180);
  const sun=new THREE.DirectionalLight(0xffc38b,2.2);sun.position.set(-7.6,8,3.4);sun.target.position.set(0,2.8,-.8);scene.add(sun,sun.target);
  if(fullFacade){sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-4.8;sun.shadow.camera.right=4.8;
    sun.shadow.camera.top=4.8;sun.shadow.camera.bottom=-4.8;sun.shadow.camera.far=30;sun.shadow.bias=-.0001;}
  scene.add(new THREE.HemisphereLight(0xecc99c,0x25160d,.65));
  const depth=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:true,side:THREE.DoubleSide});
  const hands: THREE.Object3D[]=[];let ready=false,visible=false,elapsed=0,last=performance.now();
  const starts=fullFacade?[36630,630,30]:[42902,3302,2];
  const config=[{name:'hour',period:43200,start:starts[0]},{name:'minute',period:3600,start:starts[1]},{name:'seconds',period:60,start:starts[2]}];
  if(cinematic)fetch('./blender/reference-architecture-v14/camera-track.json').then(r=>r.json()).then(data=>{track=data.frames;}).catch(console.error);
  new GLTFLoader().load('./blender/reference-architecture-'+(cinematic?'v14':fullFacade?'v13':'v12')+'/clock-rig.glb',gltf=>{
    const receivers:THREE.Mesh[]=[];
    gltf.scene.traverse(o=>{
      if(o instanceof THREE.Mesh && o.name.startsWith('OCCLUDER')) {
        if(/atmospheric.*volume/.test(o.name))o.visible=false;
        else {o.material=depth;o.renderOrder=-10;if(fullFacade)receivers.push(o);}
      }
      const i=config.findIndex(c=>new RegExp('live.*'+c.name+'.*hand').test(o.name));
      if(i>=0)hands[i]=o;
      if(/LIVE.*astronomical.*rotor/.test(o.name))rotors[0]=o;
      if(/LIVE.*calendar.*rotor/.test(o.name))rotors[1]=o;
      if(o instanceof THREE.Mesh&&!o.name.startsWith('OCCLUDER')) {
        o.castShadow=fullFacade;o.receiveShadow=fullFacade;
        for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial){
          // glTF omits Blender's procedural roughness nodes; restore their PBR constants.
          if(/chased pale gold/.test(m.name))m.roughness=.27;
          else if(/brushed silver/.test(m.name))m.roughness=.26;
          else if(/dark patinated bronze/.test(m.name))m.roughness=.37;
          else if(/midnight blue/.test(m.name))m.roughness=.31;
          m.envMapIntensity=m.metalness>.8?.85:.30;
        }
      }
    });
    if(fullFacade) {
      const shade=new THREE.ShadowMaterial({color:0x171310,opacity:.28,side:THREE.DoubleSide,depthWrite:false,depthFunc:THREE.EqualDepth});
      for(const o of receivers){const r=new THREE.Mesh(o.geometry,shade);r.name='Live hand shadow receiver';r.position.copy(o.position);r.quaternion.copy(o.quaternion);r.scale.copy(o.scale);r.receiveShadow=true;o.parent!.add(r);}
    }
    scene.add(gltf.scene);ready=hands.filter(Boolean).length===3&&(!cinematic||rotors.filter(Boolean).length===2);
  },undefined,error=>{canvas.remove();console.error('Native clock rig could not load',error);});
  function resize() {
    const width=surface!.clientWidth,height=surface!.clientHeight;
    const scale=Math.max(width/1600,height/900),rw=1600*scale,rh=900*scale;
    renderer.setSize(rw,rh,false);canvas.style.width=rw+'px';canvas.style.height=rh+'px';
    canvas.style.left=(width-rw)/2+'px';canvas.style.top=(height-rh)/2+'px';
  }
  new ResizeObserver(resize).observe(surface);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0}).observe(surface);
  const state={ready:false,elapsed:0,periods:[43200,3600,60],initialTime:fullFacade?'10:10:30':'11:55:02',physicalHandShadows:fullFacade,angles:[0,0,0],dialAngles:[0,0],interactiveDials:cinematic,interactions:0,shot:'wide',renderFrames:0,
    capture:()=>{renderer.render(scene,camera);return canvas.toDataURL('image/png');},
    snapshot:(time:number,filmTime:number)=>{renderClock(time,filmTime);return canvas.toDataURL('image/png');},
    projectDials:()=>[5.2,1.86].map(y=>{const p=new THREE.Vector3(-.15,y,-.1).project(camera),b=canvas.getBoundingClientRect();return [b.left+(p.x+1)*b.width/2,b.top+(1-p.y)*b.height/2];})};
  (window as unknown as Record<string,unknown>).homeClockState=state;
  const axis=new THREE.Vector3(0,0,-1);
  function renderClock(time:number,filmTime:number) {
    // Blender Z-up maps to Three Y-up; source camera movement is preserved.
    const phase=filmTime/16*Math.PI*2;
    sun.position.set(-7.5+.8*Math.sin(phase),6.1+.38*Math.cos(phase),4.5);
    sun.intensity=2.2*(1+150/1250*Math.sin(phase));sun.color.setRGB(1,.78+.045*Math.sin(phase),.57+.07*Math.sin(phase));
    camera.position.set(3.8+.26*Math.sin(phase),6.2+.05*Math.sin(phase),26.5-.14*Math.cos(phase));
    camera.lookAt(.1,4,-1);
    if(cinematic&&track.length){
      const f=track[Math.min(383,Math.floor(filmTime*24))];
      camera.position.fromArray(f.position);camera.lookAt(new THREE.Vector3().fromArray(f.target));
      camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(36/(2*f.lens*(16/9))));camera.updateProjectionMatrix();
      sun.position.fromArray(f.light);sun.intensity=2.2*f.lightEnergy/950;sun.color.fromArray(f.lightColor);state.shot=f.shot;
      for(let i=0;i<2;i++){const a=(i===0?.28*Math.sin(phase):.38*Math.sin(phase-.45))+offsets[i];rotors[i].quaternion.setFromAxisAngle(axis,a);state.dialAngles[i]=a;}
    }
    for(let i=0;i<3;i++) {
      const a=(config[i].start+time)/config[i].period*Math.PI*2;
      hands[i].quaternion.setFromAxisAngle(axis,a);state.angles[i]=a;
    }
    renderer.render(scene,camera);
  }
  if(cinematic){
    canvas.style.pointerEvents='auto';canvas.style.touchAction='pan-y';
    const ray=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),.10),point=new THREE.Vector3();
    const hit=(e:PointerEvent)=>{const b=canvas.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),camera);
      if(!ray.ray.intersectPlane(plane,point))return -1;
      for(let i=0;i<2;i++)if(Math.hypot(point.x+.15,point.y-(i===0?5.20:1.86))<(i===0?1.82:1.48))return i;return -1;};
    let dial=-1,lastAngle=0,moved=false,resume=false;
    canvas.addEventListener('pointerdown',e=>{dial=hit(e);if(dial<0)return;e.stopPropagation();canvas.setPointerCapture(e.pointerId);resume=!video!.paused;video!.pause();moved=false;lastAngle=Math.atan2(point.x+.15,point.y-(dial===0?5.2:1.86));});
    canvas.addEventListener('pointermove',e=>{if(dial<0){canvas.style.cursor=hit(e)>=0?'grab':'';return;}e.stopPropagation();hit(e);const a=Math.atan2(point.x+.15,point.y-(dial===0?5.2:1.86));const delta=Math.atan2(Math.sin(a-lastAngle),Math.cos(a-lastAngle));targets[dial]+=delta;offsets[dial]=targets[dial];lastAngle=a;if(Math.abs(delta)>.002)moved=true;canvas.style.cursor='grabbing';});
    const end=(e:PointerEvent)=>{if(dial<0)return;e.stopPropagation();if(!moved)targets[dial]+=Math.PI/(dial===0?12:6);state.interactions++;dial=-1;canvas.style.cursor='grab';if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(resume)void video!.play();};
    canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
    canvas.addEventListener('dblclick',e=>{if(hit(e as PointerEvent)<0)return;e.stopPropagation();targets.fill(0);state.interactions++;});
  }
  function frame(now:number) {
    requestAnimationFrame(frame);const dt=Math.max(0,(now-last)/1000);last=now;
    if(!visible || document.hidden || !ready || video!.readyState<2||(cinematic&&!track.length))return;
    for(let i=0;i<2;i++)offsets[i]=THREE.MathUtils.damp(offsets[i],targets[i],9,dt);
    if(!video!.paused)elapsed+=dt;
    renderClock(elapsed,cinematic?presentedTime:video!.currentTime);state.ready=true;state.elapsed=elapsed;state.renderFrames++;
  }
  document.addEventListener('visibilitychange',()=>{last=performance.now();});
  requestAnimationFrame(frame);
}
