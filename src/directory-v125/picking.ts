import * as THREE from'three';
/** Nearest actual triangle wins, including noninteractive surfaces that block objects behind them. */
export function pickRoom(ray:THREE.Raycaster,roots:THREE.Object3D[]){
 const visible=(o:THREE.Object3D)=>{for(let n:THREE.Object3D|null=o;n;n=n.parent)if(!n.visible)return false;return true};
 for(const h of ray.intersectObjects(roots,true)){
  if(!visible(h.object))continue;
  let key='';for(let n:THREE.Object3D|null=h.object;n;n=n.parent){key=n.userData.key||n.userData.pickKey||'';if(key)break}
  return{key,distance:h.distance,object:h.object.name,point:h.point};
 }
 return{key:'',distance:Infinity,object:'',point:new THREE.Vector3()};
}
