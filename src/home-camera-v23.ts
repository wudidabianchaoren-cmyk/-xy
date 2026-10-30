import * as THREE from 'three';
let keys=[
 {t:0,p:[-.45,1.25,5.8],g:[0,7.8,-1],f:68},
 {t:3.2,p:[-1.25,1.60,7.2],g:[-2.1,5.6,-1.1],f:62},
 {t:5.8,p:[-3.6,2.0,9.3],g:[-5.8,3.2,-3.0],f:58},
 {t:8.5,p:[3.5,1.85,8.8],g:[7.15,3.2,-1.0],f:56},
 {t:11.5,p:[1.3,4.2,10.8],g:[.0,5.5,-.4],f:52},
 {t:16,p:[0,5.2,24],g:[0,4.2,-2],f:40}
];
export async function loadArchitecturalCamera(){
 const response=await fetch('./blender/home-camera-v32-84/camera-v84.json');
 if(!response.ok)throw new Error('Blender V32.84 camera source missing');
 const source=await response.json();keys=source.keys;
 if(keys.length!==6||keys.at(-1)?.t!==16)throw new Error('Invalid native camera track');
 return {source:'Blender V32.84 / camera-v84.json',keys:keys.length,duration:16};
}
/** Six authored looks in one continuous ground-level architectural visit. */
export function architecturalCamera(camera:THREE.PerspectiveCamera,t:number,wide:{position:number[];target:number[];lens:number}){
 const last=keys.at(-1)!;last.p=wide.position;last.g=wide.target;last.f=THREE.MathUtils.radToDeg(2*Math.atan(36/(2*wide.lens*16/9)));
 const segment=Math.max(0,keys.findIndex((k,i)=>i<keys.length-1&&t>=k.t&&t<keys[i+1].t));
 const a=t>=16?last:keys[segment],b=t>=16?last:keys[segment+1];let u=THREE.MathUtils.clamp((t-a.t)/Math.max(.01,b.t-a.t),0,1);u=u*u*(3-2*u);
 camera.position.fromArray(a.p).lerp(new THREE.Vector3().fromArray(b.p),u);camera.lookAt(new THREE.Vector3().fromArray(a.g).lerp(new THREE.Vector3().fromArray(b.g),u));camera.fov=THREE.MathUtils.lerp(a.f,b.f,u);camera.updateProjectionMatrix();
 return t>=16?'fixed-wide':['tower-low-angle','tower-turn-left','west-bell-and-stone','cloister-turn-right','clock-and-figure','courtyard-reveal'][segment];
}
