import * as THREE from 'three';
/** The original licensed city remains a perspective photograph. Only exterior weather changes. */
export function cityWeather(photo:THREE.Texture){
 const material=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{photo:{value:photo},weatherTime:{value:0}},vertexShader:`varying vec3 worldP;void main(){worldP=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform sampler2D photo;uniform float weatherTime;varying vec3 worldP;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 vec3 photograph(vec2 uv){
  vec3 center=texture2D(photo,uv).rgb,sum=center*2.;float weight=2.;vec2 texel=vec2(1.5/3840.,1.5/3201.);
  for(int i=0;i<4;i++){vec2 d=i==0?vec2(texel.x,0.):i==1?vec2(-texel.x,0.):i==2?vec2(0.,texel.y):vec2(0.,-texel.y);vec3 sampleColor=texture2D(photo,uv+d).rgb;float w=1./(1.+dot(sampleColor-center,sampleColor-center)*180.);sum+=sampleColor*w;weight+=w;}
  return mix(center,sum/weight,.65);
 }
 float beacon(vec2 uv,vec2 at,float phase){vec2 p=(uv-at)*vec2(1.,.834);float d=length(p);float clock=mod(weatherTime+phase,4.8);float pulse=smoothstep(.0,.14,clock)*(1.-smoothstep(.25,.55,clock));return exp(-d*d/0.0000012)*pulse;}
 void main(){float u=.5+atan(worldP.x,-worldP.z)*20./28.;u=1.-abs(mod(u,2.)-1.);float v=clamp((worldP.y+5.8)/19.6,.002,.998);vec2 uv=vec2(u,v);vec2 offset=vec2(0.);float edge=0.;
 if(cameraPosition.z> -1.025){
  vec3 ray=worldP-cameraPosition;vec3 glass=cameraPosition+ray*((-1.018-cameraPosition.z)/ray.z);
  vec2 grid=glass.xy*vec2(23.,18.);vec2 id=floor(grid);vec2 p=fract(grid)-.5;float seed=hash(id);
  float age=mod(weatherTime*(.09+seed*.14)+seed*10.,1.);float speed=smoothstep(.58,1.,seed)*.34;
  p.y=fract(p.y+.5+weatherTime*speed)-.5;p.x+=sin(id.y*3.+weatherTime*.2)*.025;
  vec2 q=p*vec2(1.35,.82);float d=length(q);float radius=.043+seed*.047;
  float drop=(1.-smoothstep(radius*.65,radius,d))*step(.39,seed);
  offset=normalize(q+vec2(.0001))*drop*.0018;
  edge=(smoothstep(radius*.48,radius*.78,d)-smoothstep(radius*.78,radius,d))*step(.39,seed)*.022;
  // A thin gravity-driven rivulet connects a moving large drop to its wet trail.
  float trail=(1.-smoothstep(.008,.025,abs(p.x)))*smoothstep(-.04,.18,p.y)*step(.80,seed);offset.x+=trail*.0006;edge+=trail*.012;
 }
 vec3 c=photograph(uv+offset);float red=beacon(uv,vec2(.259,.523),0.)+beacon(uv,vec2(.232,.510),.12)+beacon(uv,vec2(.345,.503),.2)+beacon(uv,vec2(.087,.487),1.4)+beacon(uv,vec2(.164,.487),1.5)+beacon(uv,vec2(.831,.441),2.1);
 c=c*1.25+vec3(.0036,.0031,.0023)+edge*vec3(.45,.53,.57);c+=vec3(1.8,.025,.008)*red;
 gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 return{material,update:(t:number)=>{material.uniforms.weatherTime.value=t;},status:{windowDrops:true,worldSpaceGlass:true,refraction:true,beacons:6,beaconPeriod:4.8,beaconsAnchoredTo:'existing rooftop and crane pixels of the original photograph',cityIsPhotograph:true}};
}
