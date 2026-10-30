import * as THREE from 'three';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';

// Integrate atmospheric density along the camera ray, stopping at scene depth.
export class SeaAtmosphere extends ShaderPass {
  constructor(private view:THREE.PerspectiveCamera){
    const field=new Uint8Array(272*136);
    let seed=1829;const voxels=Uint8Array.from({length:32**3},()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>24);});
    for(let z=0;z<32;z++)for(let y=-1;y<=32;y++)for(let x=-1;x<=32;x++){
      const xx=(x+32)%32,yy=(y+32)%32;field[(Math.floor(z/8)*34+y+1)*272+(z%8)*34+x+1]=voxels[z*1024+yy*32+xx];
    }
    const noiseField=new THREE.DataTexture(field,272,136,THREE.RedFormat);noiseField.minFilter=noiseField.magFilter=THREE.LinearFilter;noiseField.generateMipmaps=false;noiseField.needsUpdate=true;
    super({uniforms:{tDiffuse:{value:null},depthMap:{value:null},resolution:{value:new THREE.Vector2()},noiseField:{value:noiseField},inverseProjection:{value:new THREE.Matrix4()},cameraWorld:{value:new THREE.Matrix4()},eye:{value:new THREE.Vector3()},time:{value:0}},
      vertexShader:`varying vec2 uvScreen;void main(){uvScreen=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`uniform sampler2D tDiffuse,depthMap,noiseField;uniform mat4 inverseProjection,cameraWorld;uniform vec3 eye;uniform vec2 resolution;uniform float time;varying vec2 uvScreen;
      vec3 depthPoint(vec2 uv){float d=texture2D(depthMap,uv).x;vec4 v=inverseProjection*vec4(uv*2.-1.,d*2.-1.,1.);v/=v.w;return(cameraWorld*v).xyz;}
      float noise(vec3 p){p=mod(p,32.);float z=floor(p.z),next=mod(z+1.,32.);
      vec2 a=(vec2(mod(z,8.),floor(z/8.))*34.+p.xy+1.5)/vec2(272.,136.);
      vec2 b=(vec2(mod(next,8.),floor(next/8.))*34.+p.xy+1.5)/vec2(272.,136.);
      return mix(texture2D(noiseField,a).r,texture2D(noiseField,b).r,fract(p.z));}
      void main(){vec4 image=texture2D(tDiffuse,uvScreen);float depth=texture2D(depthMap,uvScreen).x;
      vec4 p=inverseProjection*vec4(uvScreen*2.-1.,depth*2.-1.,1.);p/=p.w;p=cameraWorld*p;
      vec3 direction=normalize(p.xyz-eye);float totalDistance=length(p.xyz-eye),reach=min(totalDistance,1800.),stepSize=reach/24.;float transmission=1.;vec3 scatter=vec3(0.);
      // Keep low sea banks dense; clear higher continental slopes enough to reveal their own relief.
      float continental=smoothstep(700.,1200.,totalDistance)*smoothstep(20.,110.,p.y)*(1.-step(.999998,depth));
      float sunFacing=max(dot(direction,normalize(vec3(-45.,35.,-160.))),0.);
      float sun=pow(sunFacing,12.);
      // Local materials need readable illumination; distant sea banks retain the original fog.
      float nearLand=smoothstep(.35,3.2,p.y)*(1.-smoothstep(180.,520.,totalDistance))*(1.-step(.999998,depth));
      for(int j=0;j<24;j++){float distance=(float(j)+.5)*stepSize;vec3 world=eye+direction*distance;
      float cloud=noise(world*vec3(.020,.072,.027)+vec3(time*.009,0.,0.))*.65+noise(world*.061)*.35;
      float bankHeight=6.0+3.2*sin(world.x*.019+time*.045)+2.0*sin(world.z*.013-time*.035);
      float lowBank=exp(-pow((world.y-bankHeight)*.095,2.));
      float density=(.0026*exp(-max(world.y,0.)*.027)+.0065*lowBank)*smoothstep(16.,80.,distance)*(.28+cloud*1.12);
      density*=mix(1.,.66,continental);
      density*=mix(1.,.30,nearLand);
      vec3 fog=mix(vec3(.035,.063,.060),vec3(.94,.42,.078),sun*(.42+cloud*.58));
      fog+=vec3(.061,.035,.010)*pow(sunFacing,4.)*lowBank;
      float absorb=1.-exp(-density*stepSize);scatter+=transmission*absorb*fog;transmission*=1.-absorb;}
      // Stable depth-aware contact occlusion. Never darken the sky or distant horizon.
      vec3 surfaceNormal=normalize(cross(dFdx(p.xyz),dFdy(p.xyz)));if(dot(surfaceNormal,eye-p.xyz)<0.)surfaceNormal=-surfaceNormal;
      float contact=0.;float radiusPixels=clamp(resolution.y*.8/max(4.,totalDistance),3.,20.);
      for(int k=0;k<8;k++){float angle=(float(k)+.375)*2.399963;vec2 sampleUv=uvScreen+vec2(cos(angle),sin(angle))*radiusPixels/resolution;
       vec3 delta=depthPoint(clamp(sampleUv,vec2(.001),vec2(.999)))-p.xyz;float dist=length(delta);
       contact+=max(0.,dot(surfaceNormal,delta)/max(dist,.001)-.09)*(1.-smoothstep(.15,2.4,dist));}
      float occlusion=1.-.48*contact/8.*(1.-step(.9999,depth))*(1.-smoothstep(200.,430.,totalDistance));
      vec3 color=image.rgb*occlusion*transmission+scatter;
      float farSea=smoothstep(135.,390.,totalDistance)*exp(-abs(direction.y)*4.);
      vec3 horizonHaze=mix(vec3(.062,.087,.077),vec3(.54,.275,.085),pow(sunFacing,4.));
      float land=smoothstep(1.,24.,p.y);float aerial=1.-exp(-max(0.,totalDistance-300.)*.00065);
      color=mix(color,horizonHaze,max(farSea*mix(.50,.20,land),aerial*mix(.84,.62,land)));
      float distantHorizon=(1.-smoothstep(.002,.07,abs(direction.y)))*smoothstep(160.,350.,totalDistance);
      color=mix(color,horizonHaze,distantHorizon*(1.-land)*.85);
      // Grade in scene-linear space; OutputPass applies AgX and the display transform once.
      float luminance=dot(color,vec3(.2126,.7152,.0722));
      float highlight=smoothstep(.12,.85,luminance);
      color*=mix(vec3(.94,1.015,1.035),vec3(1.055,1.,.91),highlight);
      color=.18*pow(max(color/.18,vec3(.00001)),vec3(1.075));
      color=mix(vec3(dot(color,vec3(.2126,.7152,.0722))),color,1.025);
      color=max(color,vec3(0.));
      // A mild optical falloff frames the scene; distant geometry is hidden by depth haze above.
      vec2 frame=uvScreen*2.-1.;float vignette=1.-.17*smoothstep(.35,1.32,length(frame));
      gl_FragColor=vec4(color*vignette,image.a);}`});
  }
  override render(renderer:THREE.WebGLRenderer,write:THREE.WebGLRenderTarget,read:THREE.WebGLRenderTarget,dt:number,mask:boolean){
    this.uniforms.depthMap.value=read.depthTexture;
    this.uniforms.resolution.value.set(read.width,read.height);
    this.uniforms.inverseProjection.value.copy(this.view.projectionMatrixInverse);
    this.uniforms.cameraWorld.value.copy(this.view.matrixWorld);
    this.uniforms.eye.value.copy(this.view.position);
    super.render(renderer,write,read,dt,mask);
  }
}
