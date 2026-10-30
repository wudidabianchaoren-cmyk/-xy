import {PerspectiveCamera, Vector3, Spherical, MathUtils} from 'three';

type Listener = () => void;
type EventName = 'start' | 'end' | 'change';

/** Small-input-safe replacement for this scene's distant-anchor OrbitControls.
 * No animation loop, inertia, zoom, pan or automatic flight ownership here.
 * The scene retains its cinematic time, target spline, pause and reset.
 */
export function createOdysseyControlsV118(camera:PerspectiveCamera, canvas:HTMLCanvasElement) {
  const target = new Vector3();
  const listeners:Record<EventName,Set<Listener>> = {start:new Set(),end:new Set(),change:new Set()};
  let pointer:number|null=null,armed=false,dragging=false;
  let downX=0,downY=0,lastX=0,lastY=0,yaw=0,pitch=0;
  let baseTheta=0,basePhi=0,radius=1;
  const anchor=new Vector3(),offset=new Vector3(),spherical=new Spherical();
  const oldTouchAction=canvas.style.touchAction;
  canvas.style.touchAction='none';
  const emit=(name:EventName)=>listeners[name].forEach(f=>f());
  const flags={enabled:true,enableRotate:true};
  const debug={version:118,deadZone:8,radiansPerPixel:.00024,dragging:false,
    acceptedDrags:0,ignoredClicks:0,completedDrags:0,cancelled:0,yaw:0,pitch:0,
    maximumYaw:.18,maximumPitch:.12,damping:false,pointer:null as number|null};

  function release(cancelled=false) {
    if(pointer===null)return;
    const id=pointer,wasDragging=dragging;
    pointer=null;armed=false;dragging=false;debug.dragging=false;debug.pointer=null;
    if(cancelled)debug.cancelled++;
    if(wasDragging){debug.completedDrags++;emit('end');}else debug.ignoredClicks++;
    try{if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);}catch{}
  }
  function onDown(e:PointerEvent) {
    if(!flags.enabled||!flags.enableRotate||pointer!==null||!e.isPrimary||e.button!==0)return;
    pointer=e.pointerId;debug.pointer=pointer;armed=true;dragging=false;
    downX=lastX=e.clientX;downY=lastY=e.clientY;yaw=pitch=0;
    try{canvas.setPointerCapture(e.pointerId);}catch{}
  }
  function onMove(e:PointerEvent) {
    if(pointer!==e.pointerId||!armed||!flags.enabled)return;
    if(e.pointerType==='mouse'&&e.buttons===0){release(true);return;}
    if(!dragging) {
      const dx=e.clientX-downX,dy=e.clientY-downY,distance=Math.hypot(dx,dy);
      if(distance<=debug.deadZone)return;
      // Consume the dead zone; crossing its edge never introduces a jump.
      lastX=downX+dx/distance*debug.deadZone;lastY=downY+dy/distance*debug.deadZone;
      anchor.copy(target);offset.copy(camera.position).sub(anchor);
      spherical.setFromVector3(offset);radius=Math.max(.001,spherical.radius);
      baseTheta=spherical.theta;basePhi=spherical.phi;
      dragging=true;debug.dragging=true;debug.acceptedDrags++;emit('start');
    }
    // A stale pointer jump cannot fling the camera in one event.
    const dx=MathUtils.clamp(e.clientX-lastX,-24,24),dy=MathUtils.clamp(e.clientY-lastY,-24,24);
    lastX=e.clientX;lastY=e.clientY;
    yaw=MathUtils.clamp(yaw-dx*debug.radiansPerPixel,-debug.maximumYaw,debug.maximumYaw);
    pitch=MathUtils.clamp(pitch-dy*.00020,-debug.maximumPitch,debug.maximumPitch);
    const maxPhi=Math.acos(MathUtils.clamp((3.5-anchor.y)/radius,-1,1));
    spherical.set(radius,MathUtils.clamp(basePhi+pitch,.35,Math.min(1.75,maxPhi)),baseTheta+yaw);
    offset.setFromSpherical(spherical);camera.position.copy(anchor).add(offset);
    target.copy(anchor);camera.lookAt(target);debug.yaw=yaw;debug.pitch=pitch;emit('change');
    if(e.cancelable)e.preventDefault();
  }
  function onUp(e:PointerEvent){if(e.pointerId===pointer)release(false);}
  function onCancel(e:PointerEvent){if(e.pointerId===pointer)release(true);}
  function onBlur(){release(true);}
  function onVisibility(){if(document.hidden)release(true);}
  canvas.addEventListener('pointerdown',onDown);
  canvas.addEventListener('pointermove',onMove,{passive:false});
  window.addEventListener('pointerup',onUp,true);
  window.addEventListener('pointercancel',onCancel,true);
  canvas.addEventListener('lostpointercapture',onCancel);
  window.addEventListener('blur',onBlur);
  document.addEventListener('visibilitychange',onVisibility);
  return {
    target,debug,
    get enabled(){return flags.enabled;},set enabled(v:boolean){flags.enabled=v;if(!v)release(true);},
    get enableRotate(){return flags.enableRotate;},set enableRotate(v:boolean){flags.enableRotate=v;if(!v)release(true);},
    get dragging(){return dragging;},
    addEventListener(name:EventName,f:Listener){listeners[name].add(f);},
    removeEventListener(name:EventName,f:Listener){listeners[name].delete(f);},
    // Called by the existing scene after its optional flight update. No state
    // changes or residual movement can occur on this method by itself.
    update(){camera.lookAt(target);return false;},
    resetInteraction(){release(true);yaw=pitch=0;debug.yaw=debug.pitch=0;},
    dispose(){release(true);canvas.style.touchAction=oldTouchAction;
      canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);
      window.removeEventListener('pointerup',onUp,true);window.removeEventListener('pointercancel',onCancel,true);
      canvas.removeEventListener('lostpointercapture',onCancel);window.removeEventListener('blur',onBlur);
      document.removeEventListener('visibilitychange',onVisibility);
      Object.values(listeners).forEach(s=>s.clear());},
  };
}
