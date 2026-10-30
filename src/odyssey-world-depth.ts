import * as THREE from 'three';
import {continentalVolumes} from './odyssey-terrain-solid';
/** Vast connected terrain, with an intentionally quiet silhouette at kilometres of distance. */
export function createOdysseyDepth(scene:THREE.Scene){
 const terrain=new THREE.Group();terrain.name='Continuous distant continental shelf / three atmospheric distances';scene.add(terrain);
 const volumes=continentalVolumes(terrain);
 let seed=731829;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
 const positions=Float32Array.from({length:1200*3},(_,i)=>i%3===0?(random()-.5)*240:i%3===1?random()*65:-180+random()*210);
 const mist=new THREE.BufferGeometry();mist.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const time={value:0};const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time},vertexShader:`uniform float time;varying float alpha;void main(){vec3 p=position;p.x+=sin(time*.08+p.z*.014)*2.;p.y=mod(p.y+time*.12,65.);vec4 view=modelViewMatrix*vec4(p,1.);alpha=.13*(1.-smoothstep(25.,70.,p.y));gl_PointSize=clamp(75./max(1.,-view.z),.6,2.2);gl_Position=projectionMatrix*view;}`,fragmentShader:`varying float alpha;void main(){float r=length(gl_PointCoord-.5);gl_FragColor=vec4(.69,.70,.59,alpha*(1.-smoothstep(.12,.5,r)));}`});
 const dust=new THREE.Points(mist,material);dust.name='Depth tested sparse sea aerosols';scene.add(dust);
 const rainPositions:number[]=[];for(let i=0;i<320;i++){const x=(random()-.5)*200,y=random()*64,z=-155+random()*180;rainPositions.push(x,y,z,x+.02,y-.23,z);}
 const rainGeometry=new THREE.BufferGeometry();rainGeometry.setAttribute('position',new THREE.Float32BufferAttribute(rainPositions,3));
 const rainMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time},vertexShader:`uniform float time;void main(){vec3 p=position;p.y=mod(p.y-time*5.5+10000.,65.);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:'void main(){gl_FragColor=vec4(.55,.63,.62,.075);}'});
 const rain=new THREE.LineSegments(rainGeometry,rainMaterial);rain.name='Sparse fine rain through three-dimensional air';scene.add(rain);
 return {continentalWidth:volumes.width,distances:volumes.distances,closedVolumes:volumes.closedVolumes,rainDrops:320,aerosols:1200,update:(seconds:number)=>{time.value=seconds;}};
}
