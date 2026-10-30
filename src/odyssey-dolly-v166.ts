import{PerspectiveCamera,Vector3}from'three';
/** A fixed viewing corridor: wheel and vertical drag only move forward/back. */
export function createDollyV166(camera:PerspectiveCamera,canvas:HTMLCanvasElement){
 const target=new Vector3(),events={start:new Set<()=>void>(),end:new Set<()=>void>(),change:new Set<()=>void>()},direction=new Vector3();let pending=0,last=0,id=-1,y=0,enabled=true;const debug={version:166,mode:'fixed direction / bounded forward and backward',wheelMoves:0,acceptedDrags:0,dragging:false,minDistance:55,maxDistance:88,lateralMotion:false};
 const emit=(name:keyof typeof events)=>events[name].forEach(f=>f());
 const release=()=>{if(id>=0&&canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);id=-1;debug.dragging=false;};
 canvas.addEventListener('pointerdown',e=>{if(!enabled||e.button!==0)return;id=e.pointerId;y=e.clientY;canvas.setPointerCapture(id);canvas.focus({preventScroll:true});});
 canvas.addEventListener('pointermove',e=>{if(id!==e.pointerId||!enabled)return;const dy=e.clientY-y;y=e.clientY;if(Math.abs(dy)<1)return;debug.dragging=true;debug.acceptedDrags++;pending=Math.max(-8,Math.min(8,pending+dy*.035));emit('change');e.preventDefault();});
 canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('wheel',e=>{if(!enabled)return;e.preventDefault();pending=Math.max(-8,Math.min(8,pending-e.deltaY*.012));debug.wheelMoves++;emit('change');},{passive:false});
 canvas.addEventListener('keydown',e=>{if(['ArrowUp','w','ArrowDown','s'].includes(e.key)){pending+=['w','ArrowUp'].includes(e.key)?1:-1;e.preventDefault();emit('change');}});
 return{target,debug,get dragging(){return debug.dragging||Math.abs(pending)>.002},get enabled(){return enabled},set enabled(v:boolean){enabled=v},addEventListener(name:keyof typeof events,f:()=>void){events[name].add(f)},setCollider(_f:unknown){},resetInteraction(){pending=0;release();},update(){const now=performance.now(),dt=Math.min(.05,(now-(last||now))/1000);last=now;if(Math.abs(pending)>.002&&enabled){const distance=camera.position.distanceTo(target),step=pending*(1-Math.exp(-dt*12));pending-=step;direction.subVectors(camera.position,target).normalize();camera.position.copy(target).addScaledVector(direction,Math.max(debug.minDistance,Math.min(debug.maxDistance,distance-step)));emit('change');}camera.lookAt(target);camera.updateMatrixWorld();},dispose(){release();}};
}
