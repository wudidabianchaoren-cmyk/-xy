import * as THREE from 'three';

/** Material-local contact-hardening filter; other scenes keep their original shadow shaders.
 * Based on the blocker-search / penumbra / PCF stages in Three's official PCSS example.
 * Fixed sample positions avoid temporal crawling on the fine engraved clock rings.
 */
export function courtyardSoftShadows(material:THREE.Material){
 const previous=material.onBeforeCompile,cacheKey=material.customProgramCacheKey();
 material.onBeforeCompile=(shader,renderer)=>{
  previous(shader,renderer);
  let chunk=THREE.ShaderChunk.shadowmap_pars_fragment;
  const algorithm=`
   vec2 courtyardDisk(int i){
    if(i==0)return vec2(-.326,-.406);if(i==1)return vec2(-.840,-.074);
    if(i==2)return vec2(-.696,.457);if(i==3)return vec2(-.203,.621);
    if(i==4)return vec2(.962,-.195);if(i==5)return vec2(.473,-.480);
    if(i==6)return vec2(.519,.767);return vec2(.185,-.893);
   }
   float courtyardLinearDepth(float z){return 27.5/max(.001,55.-z*54.5);}
   float courtyardPenumbra(sampler2D depths,vec2 uv,float z,vec2 size){
    float centre=unpackRGBAToDepth(texture2D(depths,uv));float blocker=0.,count=0.;vec2 search=max(vec2(.003),4./size);
    if(centre<z-.000012){blocker=courtyardLinearDepth(centre);count=1.;}
    for(int i=0;i<3;i++){float d=unpackRGBAToDepth(texture2D(depths,uv+courtyardDisk(i*2)*search));if(d<z-.000012){blocker+=courtyardLinearDepth(d);count+=1.;}}
    if(count<.5)return 1.;
    float receiver=courtyardLinearDepth(z),radius=1.2/size.x;
    if(count>0.){blocker/=count;radius=clamp(.85*(receiver-blocker)/max(.5,blocker*receiver),radius,.022);}
    float sum=0.;for(int i=0;i<6;i++)sum+=texture2DCompare(depths,uv+courtyardDisk(i)*radius,z);
    return sum/6.;
   }
  `;
  chunk=chunk.replace('float getShadow( ',algorithm+'\n\tfloat getShadow( ');
  chunk=chunk.replace('if ( frustumTest ) {',`if (frustumTest && shadowRadius > 3.9) return mix(1.,courtyardPenumbra(shadowMap,shadowCoord.xy,shadowCoord.z,shadowMapSize),shadowIntensity);
   if ( frustumTest ) {`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <shadowmap_pars_fragment>',chunk);
 };
 material.customProgramCacheKey=()=>cacheKey+' / courtyard-contact-hardening-v76';material.needsUpdate=true;
}
