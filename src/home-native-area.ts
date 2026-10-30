import * as THREE from 'three';
/** Apply the moving key's cached visibility to its matching broad emitter.
 * Three's area-light BRDF supplies the native-sized soft specular highlight;
 * the existing live key shadow map supplies building and actor occlusion.
 */
export function shadowNativeArea(material:THREE.MeshStandardMaterial){
 const previous=material.onBeforeCompile,key=material.customProgramCacheKey();
 material.onBeforeCompile=(shader,renderer)=>{
  previous(shader,renderer);
  const call='RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );';
  const chunk=THREE.ShaderChunk.lights_fragment_begin.replace(call,`{vec3 beforeNativeDiffuse=reflectedLight.directDiffuse;
   vec3 beforeNativeSpecular=reflectedLight.directSpecular;
   ${call}
   #if NUM_SPOT_LIGHT_SHADOWS > 0
   if(UNROLLED_LOOP_INDEX==3 && receiveShadow){
    SpotLightShadow nativeShadow=spotLightShadows[0];
    float nativeVisibility=getShadow(spotShadowMap[0],nativeShadow.shadowMapSize,nativeShadow.shadowIntensity,nativeShadow.shadowBias,nativeShadow.shadowRadius,vSpotLightCoord[0]);
    reflectedLight.directDiffuse=mix(beforeNativeDiffuse,reflectedLight.directDiffuse,nativeVisibility);
    reflectedLight.directSpecular=mix(beforeNativeSpecular,reflectedLight.directSpecular,nativeVisibility);
   }
   #endif
   }`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_begin>',chunk);
 };
 material.customProgramCacheKey=()=>key+' / shadowed-native-area-v24';material.needsUpdate=true;
}
