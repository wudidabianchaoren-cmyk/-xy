import * as THREE from 'three';
/** Separate breathing clocks; fixed feet; oar and hand use the same small stroke. */
export function crewAttributes(g:THREE.BufferGeometry,o:THREE.Object3D,actors:any[]){
 const u=o.userData,id=Number.isInteger(u.crewId)?u.crewId:Number.isInteger(u.oarId)?u.oarId:-1,a=actors[id],n=g.attributes.position.count;
 const anchors=new Float32Array(n*3),data=new Float32Array(n*4);
 for(let i=0;i<n;i++){if(a){anchors.set(a.anchor,i*3);data.set([a.phase,a.seated?1:0,a.head[1],Number.isInteger(u.oarId)?2:1],i*4);}}
 g.setAttribute('crewAnchor',new THREE.BufferAttribute(anchors,3));g.setAttribute('crewData',new THREE.BufferAttribute(data,4));return !!a;
}
export function animateCrewMaterial(material:THREE.Material,time:{value:number}){
 const before=material.onBeforeCompile,key=material.customProgramCacheKey();
 material.onBeforeCompile=(s,r)=>{before.call(material,s,r);s.uniforms.crewTime=time;
 s.vertexShader=s.vertexShader.replace('#include <common>',`#include <common>
 uniform float crewTime;attribute vec3 crewAnchor;attribute vec4 crewData;
 vec3 crewMotion(vec3 p){if(crewData.w<.5)return p;float phase=crewData.x;float breath=sin(crewTime*.85+phase);float stroke=sin(crewTime*.72+phase*.12);float upper=smoothstep(crewAnchor.y-.04,crewData.z-.20,p.y);
 if(crewData.w>1.5){p.x+=stroke*.055;return p;}
 p.x+=(breath*.016+stroke*.055*crewData.y)*upper;p.z+=sin(crewTime*.63+phase)*.015*upper;p.y+=breath*.006*upper;
 float arm=smoothstep(.23,.43,length(p.xz-crewAnchor.xz))*(1.-smoothstep(crewData.z+.02,crewData.z+.35,p.y))*smoothstep(crewData.z-.95,crewData.z-.65,p.y)*(1.-crewData.y);p.x+=sin(crewTime*.67+phase)*arm*.048;p.z+=sin(crewTime*.51+phase)*arm*.035;
 float h=smoothstep(crewData.z-.23,crewData.z-.08,p.y);float a=sin(crewTime*.43+phase)*.035*h;vec2 q=p.xz-crewAnchor.xz;p.xz=crewAnchor.xz+mat2(cos(a),-sin(a),sin(a),cos(a))*q;return p;}`)
 .replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=crewMotion(transformed);');
 };material.customProgramCacheKey=()=>key+'/v144-independent-weight-and-gesture';
}
