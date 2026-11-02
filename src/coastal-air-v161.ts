import * as T from'three';
/** Six samples along each visible view ray, shadowed by the real sun's island/tree map. */
export function coastalAirV161(scene:T.Scene,sun:T.DirectionalLight,clock:{value:number},state:any){
 const uniforms={airMap:{value:null as T.Texture|null},airMatrix:{value:sun.shadow.matrix},airSun:{value:new T.Vector3()},airTime:clock,airEnabled:{value:0},airTint:{value:new T.Vector3(1.12,.97,.72)}};
 const code=`varying vec3 v161AirWorld;uniform sampler2D airMap;uniform mat4 airMatrix;uniform vec3 airSun,airTint;uniform float airTime,airEnabled;
 float airDepth(vec4 v){return dot(v,vec4(255./256.,(255./256.)/256.,(255./256.)/65536.,1./16777216.));}
 float airVisibility(vec3 p){vec4 q=airMatrix*vec4(p,1.);vec3 c=q.xyz/q.w;if(any(lessThan(c,vec3(0.)))||any(greaterThan(c,vec3(1.))))return 1.;float a=step(c.z-.001,airDepth(texture2D(airMap,c.xy+vec2(.00038)))),b=step(c.z-.001,airDepth(texture2D(airMap,c.xy-vec2(.00038))));return .5*(a+b);}
 vec3 coastalAir(vec3 colour){if(airEnabled<.001)return colour;vec3 span=v161AirWorld-cameraPosition;float distanceRay=min(length(span),150.);vec3 ray=normalize(span);float stepRay=distanceRay/6.,trans=1.,scatter=0.;float phase=.72/(pow(max(.15,1.16-.80*dot(ray,airSun)),1.5));
 for(int i=0;i<6;i++){vec3 p=cameraPosition+ray*((float(i)+.5)*stepRay);float breeze=.82+.18*sin(p.x*.045+p.z*.034-airTime*.12);float density=.0015*exp(-max(p.y,0.)/13.)*breeze*airEnabled;float absorb=1.-exp(-density*stepRay);scatter+=trans*absorb*airVisibility(p)*phase;trans*=1.-absorb;}
 return colour*trans+airTint*scatter;}
 `;
 const materials=new Set<T.Material>();scene.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(materials.has(m)||(!(m instanceof T.MeshStandardMaterial)&&!(m instanceof T.ShaderMaterial&&o.userData.coastalWater)))continue;
  materials.add(m);const previous=m.onBeforeCompile,key=m.customProgramCacheKey();
  m.onBeforeCompile=(s,r)=>{previous.call(m,s,r);Object.assign(s.uniforms,uniforms);s.vertexShader=s.vertexShader.replace('void main()', 'varying vec3 v161AirWorld;\nvoid main()');
   if(s.vertexShader.includes('#include <worldpos_vertex>'))s.vertexShader=s.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nv161AirWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
   else s.vertexShader=s.vertexShader.replace('#include <fog_vertex>','#include <fog_vertex>\nv161AirWorld=(modelMatrix*vec4(position,1.)).xyz;');
   s.fragmentShader=s.fragmentShader.replace('void main()',code+'\nvoid main()').replace('#include <fog_fragment>','#include <fog_fragment>\ngl_FragColor.rgb=coastalAir(gl_FragColor.rgb);');
  };m.customProgramCacheKey=()=>key+'/v161-shadow-aware-coastal-air';m.needsUpdate=true;
 }});
 state.atmosphere={algorithm:'six view-ray height-density samples with actual terrain/tree sun-shadow occlusion',materials:materials.size,displaySpaceScattering:true,nightDisabled:true,waterGeometryChanged:false};
 return{update(night:number){uniforms.airMap.value=sun.shadow.map?.texture??null;uniforms.airEnabled.value=uniforms.airMap.value?(1-night)*(1-night):0;uniforms.airSun.value.copy(sun.position).sub(sun.target.position).normalize();}};
}
