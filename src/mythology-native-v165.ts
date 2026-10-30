import {Scene,PerspectiveCamera,Vector3,BufferGeometry,BufferAttribute,Mesh,MeshBasicMaterial,DoubleSide,Raycaster,Box3,MathUtils} from 'three';
import {MeshBVH,acceleratedRaycast} from 'three-mesh-bvh';
import {createDollyV166 as createOdysseyControlsV154} from './odyssey-dolly-v169';
import {nativeUESurface} from './ue-native-surface-v162';
import {cottageProcessEntry} from './odyssey-process-entry-v144';

const host=document.getElementById('odysseyScene')!,canvas=host.querySelector('canvas')!;
const state:any=(window as any).odysseyState={version:165,ready:false,frames:0,paused:false,renderer:'Unreal Engine 5.8.4 / native scene / lightweight navigation',islandAndVesselUnchanged:true,parallelRenderedScene:false};
const camera=new PerspectiveCamera(34,16/9,.15,5000),controls=createOdysseyControlsV154(camera,canvas),start=new Vector3(37,17,49),aim=new Vector3(-6,9,-16);
camera.position.copy(start);controls.target.copy(aim);controls.update();canvas.style.opacity='0';canvas.style.position='absolute';canvas.style.inset='0';canvas.style.zIndex='2';
let geometry:BufferGeometry,land:Mesh,processEntry:ReturnType<typeof cottageProcessEntry>|undefined,transition=0,fromP=start.clone(),fromT=aim.clone(),toP=start.clone(),toT=aim.clone(),raf=0,last=0;
const scene=new Scene(),ray=new Raycaster(),down=new Vector3(0,-1,0),move=new Vector3(),direction=new Vector3(),cottage=new Vector3(4,17.6987841,-46),cottageBox=new Box3(cottage.clone().add(new Vector3(-3,-.3,-2.6)),cottage.clone().add(new Vector3(3,5.2,2.6)));
(ray as any).firstHitOnly=true;state.cottage={position:cottage.toArray(),unchanged:true};state.controls=controls.debug;
const suspended=()=>document.hidden||document.body.classList.contains('portfolio-surface-suspended');
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);canvas.width=w;canvas.height=h;camera.aspect=w/h;camera.fov=2*Math.atan(Math.tan(34*Math.PI/360)*Math.min(1,(16/9)/camera.aspect))*180/Math.PI;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(host);resize();
const poses=[{p:start,t:aim},{p:new Vector3(29,11,40),t:new Vector3(1,3,8)},{p:new Vector3(21,22,13),t:new Vector3(-12,14,-34)},{p:cottage.clone().add(new Vector3(5.5,2.8,7.5)),t:cottage.clone().add(new Vector3(0,1.9,0))}];
function choose(index:number){controls.debug.minDistance=index===3?5:55;controls.debug.maxDistance=index===3?24:88;const pose=poses[index]||poses[0];fromP.copy(camera.position);fromT.copy(controls.target);toP.copy(pose.p);toT.copy(pose.t);transition=performance.now();state.viewIndex=index;state.cameraSettled=false;controls.resetInteraction();wake();}
function ground(x:number,z:number){if(!land)return-100;ray.set(new Vector3(x,150,z),down);ray.far=300;return ray.intersectObject(land,false)[0]?.point.y??-100;}
controls.setCollider((from,to)=>{move.copy(to);move.y=Math.max(move.y,.45,ground(move.x,move.z)+.85);direction.copy(move).sub(from);const distance=direction.length();if(land&&distance>.0001){ray.set(from,direction.normalize());ray.far=distance+.45;const hit=ray.intersectObject(land,false)[0];if(hit&&hit.distance<distance+.4)move.copy(from).addScaledVector(direction,Math.max(0,hit.distance-.5));}if(cottageBox.containsPoint(move)&&!cottageBox.containsPoint(from))move.copy(from);return move;});
function frame(now:number){raf=0;if(suspended()){last=now;return;}const dt=Math.min(.05,Math.max(0,(now-(last||now))/1000));last=now;
 if(transition){const k=Math.min(1,(now-transition)/720),u=k*k*(3-2*k);camera.position.lerpVectors(fromP,toP,u);controls.target.lerpVectors(fromT,toT,u);if(k>=1){transition=0;state.cameraSettled=true;}}
 controls.update();state.camera=camera.position.toArray();state.cameraTarget=controls.lookTarget.toArray();state.frames++;processEntry?.update();
 if(!state.paused||transition||controls.dragging)wake();
}
function wake(){if(!raf&&!suspended())raf=requestAnimationFrame(frame);}
controls.addEventListener('change',()=>{transition=0;state.cameraSettled=true;wake();});
state.nativeSurfaceChanged=(ready:boolean)=>{state.firstNativeFrameAt??=ready?performance.now():undefined;const waiting=document.querySelector<HTMLElement>('.odyssey-preparing');if(ready)waiting?.remove();else if(waiting&&document.querySelector('.ue-native-cover-v164'))waiting.hidden=true;};
state.inspectCamera=(p:number[],t:number[])=>{transition=0;camera.position.fromArray(p);controls.target.fromArray(t);controls.update();state.cameraSettled=true;wake();};state.view=choose;
state.setNight=(night:boolean)=>{state.nightMix=night?1:0;const button=document.querySelector<HTMLButtonElement>('[data-odyssey-night]')!;button.textContent=night?'切换白天':'切换夜晚';button.setAttribute('aria-pressed',String(night));void state.nativeController?.update();wake();};
state.capture=()=>{const video=state.nativeController?.layer.querySelector('video');if(!video?.videoWidth)return'';const image=document.createElement('canvas');image.width=video.videoWidth;image.height=video.videoHeight;image.getContext('2d')!.drawImage(video,0,0);return image.toDataURL('image/jpeg',.95);};
document.querySelector<HTMLButtonElement>('[data-odyssey-reset]')!.onclick=()=>choose(0);document.querySelector<HTMLButtonElement>('[data-odyssey-house]')!.onclick=()=>choose(3);
document.querySelector<HTMLButtonElement>('[data-odyssey-night]')!.onclick=()=>state.setNight(!state.nightMix);
document.querySelector<HTMLButtonElement>('[data-odyssey-pause]')!.onclick=e=>{state.paused=!state.paused;const button=e.currentTarget as HTMLElement;button.setAttribute('aria-pressed',String(state.paused));button.setAttribute('aria-label',state.paused?'继续场景':'暂停场景');button.querySelector('path')?.setAttribute('d',state.paused?'M8 5l11 7-11 7z':'M9 5v14M15 5v14');void state.nativeController?.update();wake();};
canvas.addEventListener('dblclick',()=>choose(0));
document.addEventListener('visibilitychange',wake);new MutationObserver(wake).observe(document.body,{attributes:true,attributeFilter:['class']});addEventListener('portfolio:child-return',()=>{controls.resetInteraction();wake();});

async function boot(){
 const native=await nativeUESurface(host,'myth',()=>({position:camera.position.toArray(),target:controls.lookTarget.toArray(),fov:34,night:!!state.nightMix,paused:state.paused,enabled:!suspended()}),state);state.nativeController=native;
 const response=await fetch('./assets/odyssey/native-v165/collision.bin.gz');if(!response.ok)throw Error('Coastal navigation data unavailable');const bytes=await new Response(response.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer(),header=new Uint32Array(bytes,0,2),positions=new Float32Array(bytes,8,header[0]*3),indices=new Uint32Array(bytes,8+header[0]*12,header[1]);
 geometry=new BufferGeometry();geometry.setAttribute('position',new BufferAttribute(positions,3));geometry.setIndex(new BufferAttribute(indices,1));(geometry as any).boundsTree=new MeshBVH(geometry,{indirect:true});
 land=new Mesh(geometry,new MeshBasicMaterial({side:DoubleSide}));land.raycast=acceleratedRaycast;land.updateMatrixWorld(true);scene.add(land);
 state.navigation={mode:'bounded forward/backward only',fixedDirection:true,source:'original island / no scene rebuild',triangles:indices.length/3};
 const hint=document.querySelector<HTMLElement>('.odyssey-hint');if(hint)hint.textContent='滚轮前后 · 上下拖动靠近或退远 · 左右轻拖环顾 · 双击复位';
 state.ready=true;state.readyAt=performance.now();state.cameraSettled=true;state.components={sea:true,ship:true,crew:true,island:true,trees:true,shrubs:true,shoreline:true};state.ships=1;state.giant=false;
 processEntry=cottageProcessEntry(scene,camera,canvas,cottage.toArray(),state);document.querySelector<HTMLButtonElement>('[data-odyssey-night]')!.disabled=false;
 const label=host.querySelector<HTMLElement>('.local-cove-renderer');if(label)label.textContent='本机实时海湾';dispatchEvent(new Event('portfolio:progress'));wake();
}
boot().catch(error=>{state.error=String(error);console.error(error);const text=document.querySelector('.odyssey-preparing p');if(text)text.textContent='海湾连接未完成，请重新连接';});
