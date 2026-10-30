import * as THREE from 'three';
/** Sparse exterior rain, gravity and air drag; short exposure, world-space occlusion. */
export function createRain(scene:THREE.Scene){
 const count=920,positions=new Float32Array(count*6),bases=new Float32Array(count*6),seeds=new Float32Array(count*2),ends=new Float32Array(count*2);
 let seed=132731;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<count;i++){const x=(random()-.5)*15,y=random(),z=-1.38-random()*9,r=random();for(let j=0;j<2;j++){const p=i*6+j*3;bases[p]=x;bases[p+1]=y;bases[p+2]=z;seeds[i*2+j]=r;ends[i*2+j]=j;}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('base',new THREE.BufferAttribute(bases,3));geometry.setAttribute('seed',new THREE.BufferAttribute(seeds,1));geometry.setAttribute('end',new THREE.BufferAttribute(ends,1));
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:`attribute vec3 base;attribute float seed,end;uniform float time;varying float alpha;
 void main(){float terminal=mix(5.5,8.5,seed),tau=terminal/9.81;float age=mod(time+base.y*1.65,1.65)+.55;float fall=terminal*(age-tau*(1.-exp(-age/tau)));float velocity=terminal*(1.-exp(-age/tau));float shutter=mix(.008,.014,seed);vec3 p=vec3(base.x+.12*age,6.3-fall,base.z);p+=end*vec3(-.12*shutter,velocity*shutter,0.);float d=length(cameraPosition-p);alpha=mix(.075,.16,seed)*smoothstep(.7,2.8,d)*(1.-smoothstep(9.,15.,d))*mix(.35,1.,end);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`varying float alpha;void main(){gl_FragColor=vec4(.60,.67,.72,alpha);}`});
 const rain=new THREE.LineSegments(geometry,material);rain.frustumCulled=false;rain.name='V132 light exterior rain / gravity and drag';scene.add(rain);
 return{update(t:number){material.uniforms.time.value=t;},status:{count,gravity:9.81,terminalSpeed:[5.5,8.5],worldSpace:true,exteriorOnly:true,airDrag:true,shutterSeconds:[.008,.014]},destroy(){geometry.dispose();material.dispose();}};
}
