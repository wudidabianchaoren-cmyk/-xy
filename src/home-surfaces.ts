import * as THREE from 'three';

// Bake one small shared mineral field instead of evaluating dozens of sine hashes per pixel.
const mineralPixels=new Uint8Array(32*32*32);
for(let z=0;z<32;z++)for(let y=0;y<32;y++)for(let x=0;x<32;x++){const n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;mineralPixels[x+32*(y+32*z)]=Math.floor((n-Math.floor(n))*255);}
const mineralField=new THREE.Data3DTexture(mineralPixels,32,32,32);mineralField.format=THREE.RedFormat;mineralField.minFilter=mineralField.magFilter=THREE.LinearFilter;mineralField.wrapS=mineralField.wrapT=mineralField.wrapR=THREE.RepeatWrapping;mineralField.unpackAlignment=1;mineralField.needsUpdate=true;

/** Stable world-space patina: no time-dependent grain and no screen-space decals. */
const mineralBaseHooks=new WeakMap<THREE.Material,THREE.Material['onBeforeCompile']>();
/** Fine enamel pitting is tied to physical space and filtered away when it becomes subpixel. */
export function finishClockEnamel(m:THREE.MeshPhysicalMaterial){
 m.onBeforeCompile=s=>{
  s.uniforms.enamelField={value:mineralField};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 enamelWorld;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nenamelWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 enamelWorld;uniform highp sampler3D enamelField;')
   .replace('#include <color_fragment>',`#include <color_fragment>
    float enamelBroad=texture(enamelField,(enamelWorld*2.4+.5)/32.).r;
    float enamelFine=texture(enamelField,(enamelWorld*180.+.5)/32.).r;
    float enamelResolved=1.-smoothstep(.25,1.1,length(fwidth(enamelWorld*180.)));
    diffuseColor.rgb*=.984+enamelBroad*.027+(enamelFine-.5)*.025*enamelResolved;`)
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor+=.025*(enamelFine-.5)*enamelResolved;`);
 };
 m.customProgramCacheKey=()=> 'fine-pitted-clock-enamel-v32-75';
}
export function ageMasonry(m:THREE.MeshStandardMaterial,strength=.23){
  const previous=mineralBaseHooks.get(m)??m.onBeforeCompile;
  if(!mineralBaseHooks.has(m))mineralBaseHooks.set(m,previous);
  m.onBeforeCompile=(shader,renderer)=>{
    previous(shader,renderer);
    shader.uniforms.stableMineralField={value:mineralField};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vMasonryWorld;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvMasonryWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vMasonryWorld;
      uniform highp sampler3D stableMineralField;
      float stoneNoise(vec3 p){return texture(stableMineralField,(p+.5)/32.).r;}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        float mineralVariation=stoneNoise(vMasonryWorld*.82),waterTrack=stoneNoise(vMasonryWorld*vec3(3.1,.24,3.1));
        float footDamp=(1.-smoothstep(.10,1.3,vMasonryWorld.y))*smoothstep(.25,.85,mineralVariation);
        float grime=smoothstep(.48,.86,waterTrack)*${strength.toFixed(3)}+footDamp*.15;
        float grainVisibility=1.-smoothstep(.35,1.5,length(fwidth(vMasonryWorld*35.)));
        diffuseColor.rgb*=mix(vec3(.71,.73,.68),vec3(1.03,1.015,.98),mineralVariation*.65+.25)*(1.-grime);
        diffuseColor.rgb*=1.+(stoneNoise(vMasonryWorld*35.)-.5)*.085*grainVisibility;`);
  };
  m.customProgramCacheKey=()=>`cached-mineral-patina-v32-68-${strength}`;m.needsUpdate=true;
}

/** Texture density follows metres in the scene rather than each object's stretching UVs. */
export function calibrateMasonryGeometry(mesh:THREE.Mesh){
 const geometry=mesh.geometry.clone(),p=geometry.getAttribute('position'),n=geometry.getAttribute('normal');
 const uv=new Float32Array(p.count*2),point=new THREE.Vector3(),normal=new THREE.Vector3();mesh.updateWorldMatrix(true,false);const normalMatrix=new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
 for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);normal.fromBufferAttribute(n,i).applyNormalMatrix(normalMatrix);const x=Math.abs(normal.x),y=Math.abs(normal.y),z=Math.abs(normal.z);uv[i*2]=(x>y&&x>z?point.z:point.x)*.30;uv[i*2+1]=(y>x&&y>z?point.z:point.y)*.30;}
 geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));mesh.geometry=geometry;
}

export function courtyardAtmosphere(scene:THREE.Scene){
  const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,vertexShader:'varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec3 direction;void main(){vec3 d=normalize(direction);float h=pow(1.-abs(d.y),3.);vec3 c=mix(vec3(.006,.010,.016),vec3(.013,.021,.024),h);float glow=pow(max(dot(d,normalize(vec3(-.7,.25,-1.))),0.),14.);c+=vec3(.045,.029,.012)*glow;gl_FragColor=vec4(c,1.);#include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`});
  // Chunks must start on their own line for the GLSL preprocessor.
  material.fragmentShader=material.fragmentShader.replace(';#include',';\n#include');
  material.fragmentShader=material.fragmentShader.replace('vec3(.013,.021,.024)','vec3(.004,.006,.008)').replace('vec3(.045,.029,.012)','vec3(.012,.008,.004)');
  const sky=new THREE.Mesh(new THREE.SphereGeometry(70,24,12),material);sky.name='Dusk air behind the medieval courtyard';scene.add(sky);
  const veil=new THREE.Mesh(new THREE.PlaneGeometry(25,10),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:'varying vec2 veilUv;void main(){veilUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 veilUv;uniform float time;void main(){float beam=pow(max(0.,1.-abs(veilUv.x-.28-veilUv.y*.28)*3.2),8.);float a=beam*.035*(1.-smoothstep(.72,1.,veilUv.y))*smoothstep(0.,.20,veilUv.y);gl_FragColor=vec4(.72,.62,.44,a);}'}));
  veil.position.set(-1,4,-6.4);veil.name='Restrained warm aerial shaft behind the buildings';scene.add(veil);
  return {update:(time:number)=>{(veil.material as THREE.ShaderMaterial).uniforms.time.value=time;}};
}
