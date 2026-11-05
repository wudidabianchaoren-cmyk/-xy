import * as T from 'three';
/** Reuse the static reflected world with its depth. Ship and birds are rendered
 * over that depth each update, so they still move and occlude correctly. */
export function cacheWaterReflection(renderer:T.WebGLRenderer,scene:T.Scene,water:T.Mesh,dynamic:T.Object3D[],state:any){
 const original=water.onBeforeRender.bind(water),render=renderer.render,quadScene=new T.Scene(),quadCamera=new T.Camera();let cached:T.WebGLRenderTarget|null=null,key='',inside=false;
 const uniforms={colour:{value:null as T.Texture|null},depth:{value:null as T.Texture|null}};
 const material=new T.ShaderMaterial({uniforms,depthTest:true,depthWrite:true,depthFunc:T.AlwaysDepth,blending:T.NoBlending,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'varying vec2 vUv;uniform sampler2D colour,depth;void main(){gl_FragColor=texture2D(colour,vUv);gl_FragDepth=texture2D(depth,vUv).x;}'}),quad=new T.Mesh(new T.PlaneGeometry(2,2),material);quad.frustumCulled=false;quadScene.add(quad);
 const audit=state.reflectionCache={staticCaptures:0,dynamicFrames:0,originalGeometry:true,depthOcclusion:true};
 const directionalLights=scene.children.filter(o=>o instanceof T.DirectionalLight) as T.DirectionalLight[];
 function moving(o:T.Object3D){for(let a:T.Object3D|null=o;a;a=a.parent)if(dynamic.includes(a))return true;return false;}
 water.onBeforeRender=(r,s,c,...rest)=>{if(inside)return;inside=true;renderer.render=function(world,mirror){if(world!==scene||mirror===c)return render.call(renderer,world,mirror);const target=renderer.getRenderTarget()!;const next=[...mirror.matrixWorld.elements,...mirror.projectionMatrix.elements,state.nightMix||0,...directionalLights.flatMap(light=>[...light.position.toArray(),light.intensity,light.color.r,light.color.g,light.color.b])].map(v=>Math.round(v*10000)).join('/');
   if(!cached||cached.width!==target.width||cached.height!==target.height){cached?.dispose();cached=new T.WebGLRenderTarget(target.width,target.height,{depthBuffer:true,type:target.texture.type,format:target.texture.format});cached.depthTexture=new T.DepthTexture(target.width,target.height,T.UnsignedIntType);key='';}
   const hidden:T.Object3D[]=[],background=scene.background,auto=renderer.autoClear,shadow=renderer.shadowMap.enabled;
   try{renderer.shadowMap.enabled=false;if(key!==next){for(const o of dynamic)if(o.visible){o.visible=false;hidden.push(o);}renderer.setRenderTarget(cached);renderer.autoClear=true;render.call(renderer,world,mirror);hidden.forEach(o=>o.visible=true);hidden.length=0;key=next;audit.staticCaptures++;}
    renderer.setRenderTarget(target);renderer.autoClear=true;uniforms.colour.value=cached.texture;uniforms.depth.value=cached.depthTexture;render.call(renderer,quadScene,quadCamera);
    scene.traverse(o=>{if((o instanceof T.Mesh||o instanceof T.Points||o instanceof T.Line||o instanceof T.Sprite)&&o.visible&&!moving(o)){hidden.push(o);o.visible=false;}});scene.background=null;renderer.autoClear=false;render.call(renderer,world,mirror);audit.dynamicFrames++;
   }finally{hidden.forEach(o=>o.visible=true);scene.background=background;renderer.autoClear=auto;renderer.shadowMap.enabled=shadow;renderer.setRenderTarget(target);}
  };try{original(r,s,c,...rest);}finally{renderer.render=render;inside=false;}};
 renderer.domElement.addEventListener('webglcontextrestored',()=>{key='';});return{invalidate(){key='';},dispose(){cached?.dispose();quad.geometry.dispose();material.dispose();}};
}
