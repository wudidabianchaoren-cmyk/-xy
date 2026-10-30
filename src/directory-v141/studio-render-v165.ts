import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {CachedCourtyardAO} from '../home-cached-ao';
/** Stable contact depth for the room; the light and source video remain live. */
export function studioRenderV165(renderer:THREE.WebGLRenderer,scene:THREE.Scene,camera:THREE.PerspectiveCamera){
 const target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:4}),composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));
 const ao=new CachedCourtyardAO(scene,camera,800,450);ao.blendIntensity=.38;ao.updateGtaoMaterial({radius:.18,distanceExponent:1.6,thickness:.15,scale:1,samples:8});composer.addPass(ao);composer.addPass(new OutputPass());
 let previous='',lastUpdate=-Infinity;
 return{resize(w:number,h:number){composer.setSize(w,h);ao.setSize(Math.round(w*.5),Math.round(h*.5));previous='';},render(time:number,moving:boolean){
  const pose=[...camera.position.toArray(),...camera.quaternion.toArray(),camera.fov].map(v=>Math.round(v*10000)).join('/');ao.refreshOcclusion=(pose!==previous||moving)&&time-lastUpdate>.08;
  if(ao.refreshOcclusion){previous=pose;lastUpdate=time;}composer.render();
 },dispose(){ao.dispose();composer.dispose();}};
}
