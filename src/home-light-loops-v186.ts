import * as T from 'three';
/** Keep the exact lights/BRDF/order, but avoid duplicating their expensive BRDF
 * bodies once per light in the driver's first-visit shader compiler. */
export function compactHomeLightLoops186(materials:Set<T.Material>){
 if(new URLSearchParams(location.search).has('unrolledHomeLights'))return{enabled:false,materials:0};
 let count=0;
 for(const material of materials){
  if(!(material as T.MeshStandardMaterial).isMeshStandardMaterial)continue;
  const previous=material.onBeforeCompile,key=material.customProgramCacheKey();
  material.onBeforeCompile=(shader,renderer)=>{
   previous.call(material,shader,renderer);
   let source=shader.fragmentShader.replace('#include <lights_fragment_begin>',T.ShaderChunk.lights_fragment_begin);
   const rect=/#pragma unroll_loop_start\s+for \( int i = 0; i < NUM_RECT_AREA_LIGHTS; i \+\+ \) \{[\s\S]*?#pragma unroll_loop_end/;
   if(!rect.test(source))throw Error('Courtyard light-loop source changed');
   source=source.replace(rect,block=>block.replace('#pragma unroll_loop_start','').replace('#pragma unroll_loop_end','').replace('i < NUM_RECT_AREA_LIGHTS','i < min(NUM_RECT_AREA_LIGHTS, courtyardLightLoopLimit)').replaceAll('UNROLLED_LOOP_INDEX','i'));
   const point=/#pragma unroll_loop_start\s+for \( int i = 0; i < NUM_POINT_LIGHTS; i \+\+ \) \{[\s\S]*?#pragma unroll_loop_end/;
   source=source.replace(point,block=>block.replace('i < NUM_POINT_LIGHTS','i < NUM_POINT_LIGHT_SHADOWS')+`
    #if NUM_POINT_LIGHTS > NUM_POINT_LIGHT_SHADOWS
    for(int pointIndex=NUM_POINT_LIGHT_SHADOWS;pointIndex<min(NUM_POINT_LIGHTS,courtyardLightLoopLimit);pointIndex++){
     pointLight=pointLights[pointIndex];
     getPointLightInfo(pointLight,geometryPosition,directLight);
     RE_Direct(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
    }
    #endif
   `);
   shader.uniforms.courtyardLightLoopLimit={value:100000};
   shader.fragmentShader='uniform int courtyardLightLoopLimit;\n'+source;
  };
  material.customProgramCacheKey=()=>key+' / uniform-light-loops186';count++;
 }
 return{enabled:true,materials:count,lightsRemoved:0,shadingModelChanged:false};
}
