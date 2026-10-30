import * as THREE from 'three';
/** One continuous surface; elevation and slope blend habitats rather than cutting polygons into coloured bands. */
export function islandGround(source:THREE.MeshStandardMaterial){
 const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.91,envMapIntensity:.16});
 material.name='Continuous limestone, weathered soil, sand and sparse maquis / metre-scale triplanar PBR';
 material.onBeforeCompile=s=>{
  s.uniforms.landPhoto={value:source.map};s.uniforms.landNormal={value:source.normalMap};s.uniforms.landRough={value:source.roughnessMap};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 landPosition,landNormalWorld;')
   .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nlandPosition=(modelMatrix*vec4(transformed,1.)).xyz;landNormalWorld=normalize(mat3(modelMatrix)*objectNormal);');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   varying vec3 landPosition,landNormalWorld;uniform sampler2D landPhoto,landNormal,landRough;
   vec3 landSample(sampler2D map,vec3 p,vec3 w){return texture2D(map,p.yz*.16).rgb*w.x+texture2D(map,p.xz*.16).rgb*w.y+texture2D(map,p.xy*.16).rgb*w.z;}`)
   .replace('#include <map_fragment>',`vec3 weights=pow(abs(normalize(landNormalWorld)),vec3(5.));weights/=max(.001,weights.x+weights.y+weights.z);
    vec3 photo=landSample(landPhoto,landPosition,weights);float mineral=dot(photo,vec3(.3,.5,.2));
    float fine=texture2D(landPhoto,landPosition.xz*.10).g;mineral=mix(mineral,fine,.12);
    float bedding=.96+.04*sin(landPosition.y*2.2+landPosition.x*.013+landPosition.z*.018);
    float shade=sin(landPosition.x*.18+sin(landPosition.z*.11))*sin(landPosition.z*.17);
    float coastHeight=landPosition.y+shade*.65;
    float sand=(1.-smoothstep(.7,5.2,coastHeight))*smoothstep(.48,.88,landNormalWorld.y);
    float scrub=smoothstep(3.2,6.8,coastHeight)* (1.-smoothstep(19.,26.,landPosition.y-shade))*smoothstep(.55,.84,landNormalWorld.y);
    vec3 stonePigment=mix(vec3(1.),photo/max(.10,mineral),.55);
    float weathering=.5+.5*sin(landPosition.x*.047+sin(landPosition.z*.039))*sin(landPosition.y*.23+landPosition.z*.052);
    vec3 limestone=mix(vec3(.21,.165,.112),vec3(.31,.265,.18),weathering)*(.42+mineral*1.45)*bedding*stonePigment;
    vec3 drySoil=vec3(.055,.072,.024)*(.70+mineral*.50+shade*.045);
    float sandGrain=texture2D(landRough,landPosition.xz*1.7).g;
    float sediment=.5+.5*sin(landPosition.x*.32+landPosition.z*.19+sin(landPosition.z*.09)*3.);
    vec3 beach=mix(vec3(.40,.28,.125),vec3(.55,.405,.205),sediment*.55)*(.79+sandGrain*.21+mineral*.16);
    diffuseColor.rgb=mix(mix(limestone,drySoil,scrub*.96),beach,sand);
    float tidalWet=1.-smoothstep(.15,1.8,coastHeight);diffuseColor.rgb*=1.-tidalWet*.42;
    float coastPebble=smoothstep(.035,.12,abs(sin(landPosition.x*1.7)*sin(landPosition.z*1.9)));
    diffuseColor.rgb*=1.-(1.-coastPebble)*sand*.12;
    float crack=1.-smoothstep(.06,.19,mineral);diffuseColor.rgb*=1.-crack*.24*(1.-sand);`)
   .replace('#include <normal_fragment_maps>',`vec3 nX=texture2D(landNormal,landPosition.yz*.16).xyz*2.-1.;
    vec3 nY=texture2D(landNormal,landPosition.xz*.16).xyz*2.-1.;
    vec3 nZ=texture2D(landNormal,landPosition.xy*.16).xyz*2.-1.;vec3 signs=sign(landNormalWorld);
    vec3 mappedNormal=normalize(vec3(nX.z*signs.x,nX.x*.60,nX.y*.60)*weights.x+vec3(nY.x*.60,nY.z*signs.y,nY.y*.60)*weights.y+vec3(nZ.x*.60,nZ.y*.60,nZ.z*signs.z)*weights.z);
    normal=normalize(mix(normal,mat3(viewMatrix)*mappedNormal,(1.-sand)*.58));
    float relief=mix(mineral*.12+bedding*.055,sandGrain*.026,sand);vec3 q0=dFdx(-vViewPosition),q1=dFdy(-vViewPosition);
    vec3 r1=cross(q1,normal),r2=cross(normal,q0);float determinant=dot(q0,r1);
    normal=normalize(abs(determinant)*normal-sign(determinant)*(dFdx(relief)*r1+dFdy(relief)*r2));`)
   .replace('#include <roughnessmap_fragment>','float photoRough=landSample(landRough,landPosition,weights).g;float roughnessFactor=mix(.27,.70+photoRough*.23,smoothstep(.15,1.8,coastHeight));roughnessFactor=mix(roughnessFactor,.97,clamp(sand*.85+scrub*.45,0.,1.));');
 };
 material.customProgramCacheKey=()=> 'continuous-coastal-habitats-v32-83';return material;
}
