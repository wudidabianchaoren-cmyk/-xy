import * as T from 'three';

/** Preserve the full-resolution static shadow, then draw only moving casters over it. */
export function staticShadowCache(renderer:T.WebGLRenderer,scene:T.Scene,light:T.DirectionalLight,dynamicRoot:T.Object3D,state:any){
 const staticCasters:T.Mesh[]=[],dynamicCasters:T.Mesh[]=[];
 scene.traverse(o=>{if(!(o instanceof T.Mesh)||!o.castShadow)return;let moving=false;for(let p:T.Object3D|null=o;p;p=p.parent)if(p===dynamicRoot)moving=true;(moving?dynamicCasters:staticCasters).push(o);});
 const textures=new Map<string,T.FramebufferTexture>(),quadScene=new T.Scene(),quadCamera=new T.Camera();
 const material=new T.ShaderMaterial({uniforms:{cached:{value:null}},depthTest:true,depthWrite:true,depthFunc:T.AlwaysDepth,blending:T.NoBlending,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D cached;varying vec2 vUv;\n#include <packing>\nvoid main(){vec4 packed=texture2D(cached,vUv);gl_FragColor=packed;gl_FragDepth=unpackRGBAToDepth(packed);}'});
 const geometry=new T.PlaneGeometry(2,2),quad=new T.Mesh(geometry,material);quad.frustumCulled=false;quadScene.add(quad);
 const originalClear=renderer.clear,originalPosition=light.position.clone();let active:T.FramebufferTexture|null=null,restoring=false;
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
 function use(changing:boolean){active=changing?null:textures.get(signature())||null;for(const o of staticCasters)o.castShadow=!active;state.staticShadowCache.active=!!active;}
 const cachedClear:typeof renderer.clear=function(color,depth,stencil){
  if(!active||restoring||renderer.getRenderTarget()!==light.shadow.map)return originalClear.call(renderer,color,depth,stencil);
  restoring=true;const auto=renderer.autoClear,shadows=renderer.shadowMap.enabled;renderer.autoClear=false;renderer.shadowMap.enabled=false;material.uniforms.cached.value=active;
  try{renderer.render(quadScene,quadCamera);state.staticShadowCache.restores++;}finally{renderer.autoClear=auto;renderer.shadowMap.enabled=shadows;restoring=false;}
 };
 return{prepare(camera:T.Camera){
  try{capture(camera);light.position.copy(light.target.position).addScaledVector(new T.Vector3(-.38,.68,-.62).normalize(),120);light.updateMatrixWorld(true);capture(camera);}finally{light.position.copy(originalPosition);light.updateMatrixWorld(true);for(const o of dynamicCasters)o.castShadow=true;}
  renderer.clear=cachedClear;use(false);light.shadow.updateMatrices(light);renderer.shadowMap.needsUpdate=true;
 },use,dispose(){if(renderer.clear===cachedClear)renderer.clear=originalClear;for(const o of staticCasters)o.castShadow=true;for(const t of textures.values())t.dispose();material.dispose();geometry.dispose();}};
}
