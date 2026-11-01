import * as THREE from 'three';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
/** Authored Blender OCIO display transform, sampled in scene-linear light.
 * Output is already display sRGB; do not run OutputPass a second time.
 */
export async function nativeDisplayPass(){
 const directory='./blender/reference-architecture-v24/';
 const [meta,buffer]=await Promise.all([fetch(directory+'display-transform.json').then(r=>r.json()),fetch(directory+'display-transform.bin').then(r=>r.arrayBuffer())]);
 const map=new THREE.Data3DTexture(new Uint8Array(buffer),meta.size,meta.size,meta.size);map.format=THREE.RGBAFormat;map.minFilter=map.magFilter=THREE.LinearFilter;map.unpackAlignment=1;map.needsUpdate=true;
 return{meta,pass:new ShaderPass({uniforms:{tDiffuse:{value:null},displayLattice:{value:map},latticeSize:{value:meta.size},logScale:{value:meta.logScale},lightGain:{value:.89},saturation:{value:1.16}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D tDiffuse;uniform highp sampler3D displayLattice;uniform float latticeSize,logScale,lightGain,saturation;varying vec2 vUv;void main(){vec4 light=texture2D(tDiffuse,vUv);vec2 focusUV=(vUv-vec2(.50,.51))*vec2(1.,.83);float focus=1.-smoothstep(.12,.56,length(focusUV));vec3 p=clamp(log2(1.+max(light.rgb*lightGain*mix(.90,1.23,focus),vec3(0.))*64.)/logScale,vec3(0.),vec3(1.));p=p*(latticeSize-1.)/latticeSize+.5/latticeSize;vec3 c=texture(displayLattice,p).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,saturation)*vec3(1.025,.967,.895);c=(c-.18)*1.08+.18;vec2 edgeUV=(vUv-.5)*vec2(1.,.84);float vignette=1.-.28*smoothstep(.27,.65,length(edgeUV));c=clamp(c*vignette,vec3(0.),vec3(1.));gl_FragColor=vec4(c,light.a);}'} )};
}
