import * as T from 'three';

/** Preserve the full-resolution static shadow, then draw only moving casters over it. */
export function staticShadowCache(renderer:T.WebGLRenderer,scene:T.Scene,light:T.DirectionalLight,dynamicRoot:T.Object3D,state:any){
 const staticCasters:T.Mesh[]=[],dynamicCasters:T.Mesh[]=[];
 scene.traverse(o=>{if(!(o instanceof T.Mesh)||!o.castShadow)return;let moving=false;for(let p:T.Object3D|null=o;p;p=p.parent)if(p===dynamicRoot)moving=true;(moving?dynamicCasters:staticCasters).push(o);});
 const textures=new Map<string,T.FramebufferTexture>(),quadScene=new T.Scene(),quadCamera=new T.Camera();
 const material=new T.ShaderMaterial({uniforms:{cached:{value:null}},depthTest:true,depthWrite:true,depthFunc:T.AlwaysDepth,blending:T.NoBlending,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D cached;varying vec2 vUv;\n#include <packing>\nvoid main(){vec4 packed=texture2D(cached,vUv);gl_FragColor=packed;gl_FragDepth=unpackRGBAToDepth(packed);}'});
 const geometry=new T.PlaneGeometry(2,2),quad=new T.Mesh(geometry,material);quad.frustumCulled=false;quadScene.add(quad);
 const originalClear=renderer.clear,originalPosition=light.position.clone();let active:T.FramebufferTexture|null=null,restoring=false,activeSignature='',restoreAll=true,previousRegion:T.Vector4|null=null;
 const point=new T.Vector3(),box=new T.Box3(),extent=new T.Vector4();
 function movingRegion(){box.makeEmpty();dynamicRoot.updateWorldMatrix(true,true);dynamicRoot.traverseVisible(o=>{if(o instanceof T.Mesh){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();box.union(o.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld));}});let left=1,right=0,bottom=1,top=0;for(let i=0;i<8;i++){point.set(i&1?box.max.x:box.min.x,i&2?box.max.y:box.min.y,i&4?box.max.z:box.min.z).applyMatrix4(light.shadow.matrix);left=Math.min(left,point.x);right=Math.max(right,point.x);bottom=Math.min(bottom,point.y);top=Math.max(top,point.y);}const w=light.shadow.map!.width,h=light.shadow.map!.height;left=Math.max(0,Math.floor(left*w)-12);right=Math.min(w,Math.ceil(right*w)+12);bottom=Math.max(0,Math.floor(bottom*h)-12);top=Math.min(h,Math.ceil(top*h)+12);const next=new T.Vector4(left,bottom,Math.max(1,right-left),Math.max(1,top-bottom));if(previousRegion){left=Math.min(left,previousRegion.x);bottom=Math.min(bottom,previousRegion.y);right=Math.max(right,previousRegion.x+previousRegion.z);top=Math.max(top,previousRegion.y+previousRegion.w);}previousRegion=next;return extent.set(left,bottom,Math.max(1,right-left),Math.max(1,top-bottom));}
 const signature=()=>light.position.toArray().map(n=>Math.round(n*10000)).join('/');
 state.staticShadowCache={resolution:light.shadow.mapSize.toArray(),staticCasters:staticCasters.length,dynamicCasters:dynamicCasters.length,prepared:0,restores:0,originalGeometry:true};
 function capture(camera:T.Camera){
  active=null;for(const o of staticCasters)o.castShadow=true;for(const o of dynamicCasters)o.castShadow=false;
  renderer.shadowMap.needsUpdate=true;renderer.render(scene,camera);
  const target=light.shadow.map;if(!target)throw Error('Static shadow target unavailable');
  const previous=renderer.getRenderTarget(),texture=new T.FramebufferTexture(target.width,target.height);texture.colorSpace=T.NoColorSpace;
  renderer.setRenderTarget(target);renderer.copyFramebufferToTexture(texture);renderer.setRenderTarget(previous);textures.set(signature(),texture);
  for(const o of dynamicCasters)o.castShadow=true;state.staticShadowCache.prepared=textures.size;
 }
 function use(changing:boolean){const next=signature();if(next!==activeSignature){activeSignature=next;restoreAll=true;previousRegion=null;}active=changing?null:textures.get(next)||null;for(const o of staticCasters)o.castShadow=!active;state.staticShadowCache.active=!!active;}
 const cachedClear:typeof renderer.clear=function(color,depth,stencil){
  if(!active||restoring||renderer.getRenderTarget()!==light.shadow.map)return originalClear.call(renderer,color,depth,stencil);
  restoring=true;const auto=renderer.autoClear,shadows=renderer.shadowMap.enabled;renderer.autoClear=false;renderer.shadowMap.enabled=false;material.uniforms.cached.value=active;
  const target=light.shadow.map!;const region=restoreAll?new T.Vector4(0,0,target.width,target.height):movingRegion();restoreAll=false;renderer.state.setScissorTest(true);renderer.state.scissor(region);
  try{renderer.render(quadScene,quadCamera);state.staticShadowCache.restores++;state.staticShadowCache.restoredPixels=region.z*region.w;state.staticShadowCache.fullPixels=target.width*target.height;}finally{renderer.state.scissor(target.scissor);renderer.state.setScissorTest(target.scissorTest);renderer.autoClear=auto;renderer.shadowMap.enabled=shadows;restoring=false;}
 };
 return{prepare(camera:T.Camera){
  const keep=light.position.clone();active=null;for(const texture of textures.values())texture.dispose();textures.clear();restoreAll=true;previousRegion=null;activeSignature='';
  try{light.position.copy(originalPosition);light.updateMatrixWorld(true);capture(camera);light.position.copy(light.target.position).addScaledVector(new T.Vector3(-.38,.68,-.62).normalize(),120);light.updateMatrixWorld(true);capture(camera);}finally{light.position.copy(keep);light.updateMatrixWorld(true);for(const o of dynamicCasters)o.castShadow=true;}
  renderer.clear=cachedClear;use(false);light.shadow.updateMatrices(light);renderer.shadowMap.needsUpdate=true;
 },use,dispose(){if(renderer.clear===cachedClear)renderer.clear=originalClear;for(const o of staticCasters)o.castShadow=true;for(const t of textures.values())t.dispose();material.dispose();geometry.dispose();}};
}
