import * as THREE from 'three';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
/** Authored Blender OCIO display transform, sampled in scene-linear light.
 * Output is already display sRGB; do not run OutputPass a second time.
 */
export async function nativeDisplayPass(){
 const directory='./blender/reference-architecture-v24/';
 const [meta,buffer]=await Promise.all([fetch(directory+'display-transform.json').then(r=>r.json()),fetch(directory+'display-transform.bin').then(r=>r.arrayBuffer())]);
 const map=new THREE.Data3DTexture(new Uint8Array(buffer),meta.size,meta.size,meta.size);map.format=THREE.RGBAFormat;map.minFilter=map.magFilter=THREE.LinearFilter;map.unpackAlignment=1;map.needsUpdate=true;
 return{meta,pass:new ShaderPass({uniforms:{tDiffuse:{value:null},displayLattice:{value:map},latticeSize:{value:meta.size},logScale:{value:meta.logScale},lightGain:{value:.95},saturation:{value:1.07}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D tDiffuse;uniform highp sampler3D displayLattice;uniform float latticeSize,logScale,lightGain,saturation;varying vec2 vUv;void main(){vec4 light=texture2D(tDiffuse,vUv);vec3 p=clamp(log2(1.+max(light.rgb*lightGain,vec3(0.))*64.)/logScale,vec3(0.),vec3(1.));p=p*(latticeSize-1.)/latticeSize+.5/latticeSize;vec3 c=texture(displayLattice,p).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,saturation)*vec3(1.,.95,.86);vec2 edgeUV=(vUv-.5)*vec2(1.,.84);float vignette=1.-.19*smoothstep(.28,.66,length(edgeUV));c*=vignette;gl_FragColor=vec4(c,light.a);}'} )};
}
