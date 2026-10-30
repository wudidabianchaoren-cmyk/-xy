import * as THREE from'three';
/** A local reflection probe must be projected from the surface's position, not treated as an infinitely distant studio. */
export function roomReflections(m:THREE.MeshStandardMaterial){const previous=m.onBeforeCompile.bind(m),key=m.customProgramCacheKey.bind(m);m.onBeforeCompile=(s,r)=>{previous(s,r);s.uniforms.roomProbe={value:new THREE.Vector3(.1,1.35,.55)};s.uniforms.roomMin={value:new THREE.Vector3(-1.75,0,-1.08)};s.uniforms.roomMax={value:new THREE.Vector3(1.75,3.15,3.30)};
 s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRoomSurface;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvRoomSurface=(modelMatrix*vec4(transformed,1.)).xyz;');
 s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
 varying vec3 vRoomSurface;uniform vec3 roomProbe;uniform vec3 roomMin;uniform vec3 roomMax;
 vec3 roomProjected(vec3 direction){vec3 d=mix(vec3(-1.),vec3(1.),step(vec3(0.),direction))*max(abs(direction),vec3(.0001));vec3 p=clamp(vRoomSurface,roomMin+.001,roomMax-.001);vec3 t=max((roomMax-p)/d,(roomMin-p)/d);float farT=min(t.x,min(t.y,t.z));return normalize(p+d*farT-roomProbe);}
 `).replace('#include <envmap_physical_pars_fragment>',THREE.ShaderChunk.envmap_physical_pars_fragment.replace('reflectVec = inverseTransformDirection( reflectVec, viewMatrix );','reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\nreflectVec=roomProjected(reflectVec);'));
 };m.customProgramCacheKey=()=>key()+'-room-box-v124';m.needsUpdate=true;}
