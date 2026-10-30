import * as THREE from 'three';
import {loadRoomEnvironment} from './environment';

/** The current room's actual UE viewport contribution, prepared offline. */
export async function loadRoomEnvironmentV160(base:string){
 const cached=await loadRoomEnvironment(base);
 try{
  const folder='./assets/ue-v160/';
  const [meta,response]=await Promise.all([
   fetch(folder+'room-mix-ue5-cubeuv.json').then(r=>{if(!r.ok)throw Error('UE room metadata unavailable');return r.json();}),
   fetch(folder+'room-mix-ue5-cubeuv.bin.gz')
  ]);
  const native=cached.meta.states[0];
  if(!response.ok||meta.revision!==THREE.REVISION||meta.width!==native.width||meta.height!==native.height)throw Error('Incompatible UE room reflection');
  const data=await new Response(response.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if(data.byteLength!==meta.width*meta.height*8)throw Error('Incomplete UE room reflection');
  const texture=new THREE.DataTexture(new Uint16Array(data),meta.width,meta.height,THREE.RGBAFormat,THREE.HalfFloatType);
  texture.name='Current studio / UE5 viewport and native room reflection';texture.mapping=THREE.CubeUVReflectionMapping;texture.colorSpace=THREE.LinearSRGBColorSpace;
  texture.magFilter=texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.flipY=false;texture.needsUpdate=true;
  cached.entries[0].texture.dispose();cached.entries[0].texture=texture;
  Object.assign(cached.meta,{ueV160:{ready:true,engine:meta.engine,source:meta.source,nativeWeight:meta.nativeWeight,ueWeight:meta.ueWeight,horizontalFOV:61.4914211891162,insideNightMaterialCorrected:true,runtimePMREM:false}});
 }catch(error){Object.assign(cached.meta,{ueV160:{ready:false,error:String(error)}});}
 return cached;
}
