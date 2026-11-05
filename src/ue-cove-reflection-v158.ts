import * as T from 'three';

/** UE viewport color probe: restrained reflection detail, never a radiometric sky replacement. */
export async function prepareUECove192(){
 const folder='./assets/ue-v159/';
 const [meta,response]=await Promise.all([
  fetch(folder+'cove-ue5-cubeuv.json').then(r=>{if(!r.ok)throw Error('UE probe metadata '+r.status);return r.json();}),
  fetch(folder+'cove-ue5-cubeuv.bin.gz')
 ]);
 if(!response.ok)throw Error('UE probe '+response.status);
 if(meta.revision!==T.REVISION||meta.width!==384||meta.height!==512||!meta.ready)throw Error('Incompatible UE reflection probe');
 const decoded=await new Response(response.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 if(decoded.byteLength!==meta.bytes)throw Error('Incomplete UE reflection probe');
 return {meta,decoded};
}

export async function attachUECoveReflectionV158(water:T.Mesh,boat:T.Group,state:any,prepared192?:ReturnType<typeof prepareUECove192>){
 const {meta,decoded}=await(prepared192||prepareUECove192());
 const probe=new T.DataTexture(new Uint16Array(decoded),meta.width,meta.height,T.RGBAFormat,T.HalfFloatType);
 probe.name='FullCoveV149 UE5 native viewport color reflection';probe.mapping=T.CubeUVReflectionMapping;
 probe.colorSpace=T.LinearSRGBColorSpace;probe.minFilter=probe.magFilter=T.LinearFilter;probe.generateMipmaps=false;probe.needsUpdate=true;
 const materials=new Map<T.MeshStandardMaterial,number>();
 boat.traverse(o=>{if(!(o instanceof T.Mesh))return;for(const m of Array.isArray(o.material)?o.material:[o.material]){
  if(!(m instanceof T.MeshStandardMaterial)||materials.has(m))continue;
  const bronze=/bronze|armor|brass/i.test(m.name)&&m.metalness>.45;
  const vessel=/weathered oak|timber|hemp|sawn oak/i.test(m.name)&&!/linen|sail/i.test(m.name);
  if(!bronze&&!vessel)continue;const intensity=bronze?.28:.24;materials.set(m,intensity);m.envMap=probe;m.envMapIntensity=intensity;m.needsUpdate=true;
 }});
 const material=water.material as T.ShaderMaterial;
 Object.assign(material.defines,{ENVMAP_TYPE_CUBE_UV:'',CUBEUV_TEXEL_WIDTH:(1/meta.width).toPrecision(14),CUBEUV_TEXEL_HEIGHT:(1/meta.height).toPrecision(14),CUBEUV_MAX_MIP:'7.0'});
 material.uniforms.ueCoveProbe={value:probe};material.uniforms.ueCoveMix={value:.18};
 material.fragmentShader=material.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D ueCoveProbe;uniform float ueCoveMix;\n#include <cube_uv_reflection_fragment>');
 const marker='vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );';
 if(!material.fragmentShader.includes(marker))throw Error('Water reflection integration point missing');
 material.fragmentShader=material.fragmentShader.replace(marker,marker+'\nvec3 ueReflection=textureCubeUV(ueCoveProbe,reflect(-eyeDirection,surfaceNormal),.42).rgb;reflectionSample=mix(reflectionSample,ueReflection,ueCoveMix);');material.needsUpdate=true;
 state.ueEnvironment={engine:meta.engine,sourceMap:meta.sourceMap,sourceMapModified:meta.sourceMapModified,source:'six native viewport EXR faces / offline PMREM / postprocessed color',revision:meta.revision,bytes:decoded.byteLength,materials:materials.size,waterDayMix:.18,bronzeDayIntensity:.28,vesselDayIntensity:.24,nightScale:1,scope:'water / vessel / bronze reflection only; browser geometry and navigation remain interactive'};
 return{update(night:number){const scale=(1-night)*(1-night);materials.forEach((base,m)=>m.envMapIntensity=base*scale);material.uniforms.ueCoveMix.value=.18*scale;state.ueEnvironment.nightScale=scale;},dispose(){probe.dispose();}};
}
