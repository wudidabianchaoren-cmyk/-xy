import * as T from 'three';
/** Test a cheap preserved-lighting pass before PBR disocclusions. Source
 * geometry, alpha coverage, wind, depth and final native pixels are retained. */
export function nativeCoverage187(renderer:T.WebGLRenderer,scene:T.Scene,camera:T.Camera,materials:T.Material[],state:any){
 const covers=new Map<T.Material,T.Material>(),hidden:T.Object3D[]=[],swapped=new Map<T.Mesh,T.Material|T.Material[]>();
 for(const old of materials){if(!(old instanceof T.MeshStandardMaterial)||(old as T.MeshPhysicalMaterial).transmission>0||old.transparent||!old.depthWrite)continue;const cover=old.clone();cover.depthFunc=T.LessEqualDepth;
  cover.onBeforeCompile=(shader,r)=>{old.onBeforeCompile.call(old,shader,r);const marker='#include <alphahash_fragment>',end=shader.fragmentShader.indexOf(marker);if(end<0||!shader.fragmentShader.includes('readNativeLighting'))throw Error('Native coverage integration missing');shader.fragmentShader=shader.fragmentShader.slice(0,end+marker.length)+`
   vec4 a187=readNativeLighting(nativeColour0,nativeDepth0,nativeVP0,nativeNF0,nativeWeight0);
   vec4 b187=readNativeLighting(nativeColour1,nativeDepth1,nativeVP1,nativeNF1,nativeWeight1);
   float coverage187=a187.a+b187.a;if(coverage187<.5)discard;
   #ifdef OPAQUE
    diffuseColor.a=1.;
   #endif
   gl_FragColor=vec4(linearToOutputTexel(vec4((a187.rgb+b187.rgb)/coverage187,1.)).rgb,diffuseColor.a);
   #include <dithering_fragment>
  }`;};cover.customProgramCacheKey=()=>old.customProgramCacheKey()+'/native-covered187';covers.set(old,cover);
 }
 const audit=state.nativeCoverage187={enabled:true,materials:covers.size,frames:0,sourceGeometryPreserved:true,originalPBRForDisocclusions:true};
 function swap(){scene.traverse(o=>{if(!(o instanceof T.Mesh||o instanceof T.Points||o instanceof T.Line||o instanceof T.Sprite)||!o.visible)return;if(o instanceof T.Mesh){const list=Array.isArray(o.material)?o.material:[o.material];if(list.every(m=>covers.has(m))){swapped.set(o,o.material);o.material=Array.isArray(o.material)?list.map(m=>covers.get(m)!):covers.get(o.material)!;return;}}o.visible=false;hidden.push(o);});}
 function restore(){for(const[o,m]of swapped)o.material=m;swapped.clear();for(const o of hidden)o.visible=true;hidden.length=0;}
 return{async prepare(){const shadow=renderer.shadowMap.enabled,background=scene.background;renderer.shadowMap.enabled=false;scene.background=null;swap();try{await renderer.compileAsync(scene,camera);}finally{restore();renderer.shadowMap.enabled=shadow;scene.background=background;}},render(draw:()=>void){const auto=renderer.autoClear,shadow=renderer.shadowMap.enabled,background=scene.background,depths=new Map<T.Material,T.DepthModes>();renderer.autoClear=true;renderer.shadowMap.enabled=false;scene.background=null;swap();try{renderer.render(scene,camera);}finally{restore();renderer.shadowMap.enabled=shadow;}for(const old of covers.keys()){depths.set(old,old.depthFunc);old.depthFunc=T.LessDepth;}renderer.autoClear=false;try{draw();audit.frames++;}finally{for(const[m,d]of depths)m.depthFunc=d;renderer.autoClear=auto;scene.background=background;}},dispose(){covers.forEach(m=>m.dispose());}};
}
