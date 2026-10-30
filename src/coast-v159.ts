import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/** True PBR terrain and fractured scan geometry, with original island/foliage retained. */
export async function coastV159(scene:T.Scene,land:T.Group,loader:GLTFLoader,state:any){
 const tx=new T.TextureLoader(),dir='./assets/odyssey/pbr-v103/';
 async function maps(name:string){const [c,n,r]=await Promise.all(['Diffuse.jpg','nor_gl.jpg','Rough.jpg'].map(f=>tx.loadAsync(dir+name+'/'+f)));c.colorSpace=T.SRGBColorSpace;for(const t of[c,n,r]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;}return{c,n,r};}
 const[sand,stone,soil]=await Promise.all([maps('coast_sand_03'),maps('seaside_rock'),maps('forest_ground_04')]);
 const coastClock={value:0};state.coastClock=coastClock;
 const material=new T.MeshStandardMaterial({name:'V146 physical sand / bedrock / soil',roughness:.95,envMapIntensity:.35});
 material.onBeforeCompile=s=>{
  Object.assign(s.uniforms,{coastTime:coastClock,sandColor:{value:sand.c},sandNormal:{value:sand.n},sandRough:{value:sand.r},rockColor:{value:stone.c},rockNormal:{value:stone.n},rockRough:{value:stone.r},soilColor:{value:soil.c}});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 coastP;varying vec3 coastN;').replace('#include <begin_vertex>','#include <begin_vertex>\ncoastP=(modelMatrix*vec4(transformed,1.)).xyz;coastN=normalize(mat3(modelMatrix)*normal);');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   varying vec3 coastP;varying vec3 coastN;uniform float coastTime;uniform sampler2D sandColor,sandNormal,sandRough,rockColor,rockNormal,rockRough,soilColor;
   vec3 triColor(sampler2D tex,vec3 p,vec3 weights){return texture2D(tex,p.zy*.16).rgb*weights.x+texture2D(tex,p.xz*.16).rgb*weights.y+texture2D(tex,p.xy*.16).rgb*weights.z;}
   vec3 coastPerturb(vec3 n,vec3 surf,vec2 uv,vec3 mapN){
    vec3 q0=dFdx(surf),q1=dFdy(surf);vec2 st0=dFdx(uv),st1=dFdy(uv);
    vec3 q1perp=cross(q1,n),q0perp=cross(n,q0);vec3 tangent=q1perp*st0.x+q0perp*st1.x,bitangent=q1perp*st0.y+q0perp*st1.y;
    float inv=inversesqrt(max(dot(tangent,tangent),dot(bitangent,bitangent))+1e-8);
    return normalize(mat3(tangent*inv,bitangent*inv,n)*mapN);
   }`)
  .replace('#include <color_fragment>',`#include <color_fragment>
   vec3 weights=pow(abs(normalize(coastN)),vec3(5.));weights/=dot(weights,vec3(1.));float slope=1.-abs(normalize(coastN).y);
   float rocky=smoothstep(.20,.58,slope);float grass=smoothstep(2.,6.,coastP.y)*(1.-rocky);
   vec3 sand=texture2D(sandColor,coastP.xz*.55).rgb*vec3(.85,.80,.65);vec3 stone=triColor(rockColor,coastP,weights);stone=mix(stone,vec3(dot(stone,vec3(.2126,.7152,.0722))),.25)*vec3(.87,.84,.71);vec3 soil=texture2D(soilColor,coastP.xz*.31).rgb*vec3(.55,.67,.30);
   diffuseColor.rgb=mix(mix(sand,soil,grass),stone,rocky);float wetLine=.13*sin(coastTime*.04)+.16*sin((coastP.x-coastP.z)*.1485-coastTime*.45)+.09*sin((coastP.x+coastP.z)*.233-coastTime*.372);float wet=1.-smoothstep(wetLine-.2,wetLine+.65,coastP.y);diffuseColor.rgb*=mix(1.,.60,wet);`)
  .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   roughnessFactor=clamp(mix(texture2D(sandRough,coastP.xz*.55).r,triColor(rockRough,coastP,weights).r,rocky),.74,.98);roughnessFactor=mix(roughnessFactor,.46,wet*(1.-rocky));`)
  .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   vec3 detail=texture2D(sandNormal,coastP.xz*.55).xyz*2.-1.;detail.xy*=.23;
   vec3 sandN=coastPerturb(normal,-vViewPosition,coastP.xz*.55,normalize(detail));
   vec3 rX=texture2D(rockNormal,coastP.zy*.16).xyz*2.-1.,rY=texture2D(rockNormal,coastP.xz*.16).xyz*2.-1.,rZ=texture2D(rockNormal,coastP.xy*.16).xyz*2.-1.;rX.xy*=.65;rY.xy*=.65;rZ.xy*=.65;
   vec3 rockN=normalize(coastPerturb(normal,-vViewPosition,coastP.zy*.16,normalize(rX))*weights.x+coastPerturb(normal,-vViewPosition,coastP.xz*.16,normalize(rY))*weights.y+coastPerturb(normal,-vViewPosition,coastP.xy*.16,normalize(rZ))*weights.z);
   normal=normalize(mix(sandN,rockN,rocky));`);
 };
 const nativeGround=await tx.loadAsync('./assets/odyssey/restored-v159/island-native-rgbe.png');nativeGround.colorSpace=T.NoColorSpace;nativeGround.flipY=false;nativeGround.generateMipmaps=false;nativeGround.minFilter=nativeGround.magFilter=T.NearestFilter;
 const nativeNight={value:0};state.nativeGroundNight=nativeNight;const coastCompile=material.onBeforeCompile;
 material.onBeforeCompile=(shader,renderer)=>{coastCompile(shader,renderer);shader.uniforms.nativeGround={value:nativeGround};shader.uniforms.nativeNight=nativeNight;
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 uv1;varying vec2 nativeGroundUV;').replace('#include <begin_vertex>','#include <begin_vertex>\nnativeGroundUV=vec2(uv1.x,1.-uv1.y);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
   uniform sampler2D nativeGround;uniform float nativeNight;varying vec2 nativeGroundUV;
   vec3 decodeGround(ivec2 p){ivec2 sz=textureSize(nativeGround,0);vec4 v=texelFetch(nativeGround,clamp(p,ivec2(0),sz-ivec2(1)),0);return v.rgb*exp2(v.a*255.-128.);}
   vec3 readGround(vec2 uv){vec2 q=clamp(uv,vec2(0.),vec2(1.))*vec2(textureSize(nativeGround,0))-.5;ivec2 a=ivec2(floor(q));vec2 f=fract(q);return mix(mix(decodeGround(a),decodeGround(a+ivec2(1,0)),f.x),mix(decodeGround(a+ivec2(0,1)),decodeGround(a+ivec2(1,1)),f.x),f.y);}`)
   .replace('#include <opaque_fragment>',`float slopeNative=1.-abs(normalize(coastN).y);float variationNative=.5+.5*sin(coastP.x*.17+sin(coastP.z*.21)*2.5);
   float soilNative=smoothstep(3.,7.,coastP.y)*(1.-smoothstep(.25,.62,slopeNative))*(.65+.35*variationNative);
   float soilDetailNative=clamp(dot(texture2D(soilColor,coastP.xz*.56).rgb,vec3(.2126,.7152,.0722))*5.,.58,1.42);
   vec3 originalNative=readGround(nativeGroundUV)*mix(vec3(.65,.70,.68),vec3(.23,.31,.15)*soilDetailNative,soilNative*.84);
   originalNative*=mix(vec3(1.),vec3(.105,.16,.25),nativeNight);float validNative=step(.001,dot(originalNative,vec3(.2126,.7152,.0722)));float recoverNative=smoothstep(2.,5.,coastP.y)*(1.-smoothstep(.15,.48,slopeNative))*validNative;outgoingLight=mix(outgoingLight,originalNative,recoverNative);
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'v159-restored-native-cycles-ground-and-wet-coast';state.groundRestoration={source:'original V134 CUDA Cycles 4096 radiance, delivered in 2048 RGBE without tone mapping',originalTerrainUV1:true,shoreUsesLivePBR:true,upperGroundIsNotRelit:true,flatOriginalUVSurfacesOnly:true,unbakedCliffFacesKeepLivePBR:true};
 land.traverse(o=>{if(o instanceof T.Mesh){o.material=material;o.receiveShadow=true;o.castShadow=true;}});
 const scans=await Promise.all([
  loader.loadAsync('./assets/odyssey/refit-v147/coastal_cliff_02-embedded-web.glb'),
  loader.loadAsync('./assets/odyssey/refit-v147/coastal_cliff_04-embedded-web.glb'),
  loader.loadAsync('./assets/odyssey/refit-v146/coast_rocks_02.glb')
 ]);
 const layouts=[
  {i:0,p:[0,0,0],s:1,a:0},
  {i:1,p:[0,0,0],s:1,a:0},
  {i:2,p:[-5,-.45,-10.7],s:.48,a:.27}
 ];
 for(const [k,c]of layouts.entries()){
  const root=scans[c.i].scene.clone(true);root.position.fromArray(c.p);root.scale.setScalar(c.s);root.rotation.y=c.a;root.name='V146 embedded photogrammetric coast '+k;
  root.updateMatrixWorld(true);
  root.traverse(o=>{if(o instanceof T.Mesh){
   // Geometry already shares the carved island's native world coordinates.
   o.castShadow=o.receiveShadow=true;const m=(o.material as T.MeshStandardMaterial).clone();m.roughness=Math.max(.86,m.roughness);m.envMapIntensity=.35;m.color.setRGB(.86,.81,.68);if(m.normalMap)m.normalScale.setScalar(.88);const previous=m.onBeforeCompile;m.onBeforeCompile=(shader,renderer)=>{previous.call(m,shader,renderer);shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 shoreRockPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nshoreRockPosition=(modelMatrix*vec4(transformed,1.)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 shoreRockPosition;').replace('#include <color_fragment>','#include <color_fragment>\nfloat wetRock=1.-smoothstep(-.12,.78,shoreRockPosition.y);diffuseColor.rgb*=mix(1.,.61,wetRock);').replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.39,wetRock);');};m.customProgramCacheKey=()=> 'v156-natural-scanned-wet-rock-foot';o.material=m;for(const t of[m.map,m.normalMap,m.roughnessMap])if(t)t.anisotropy=8;
  }});scene.add(root);const finalBox=new T.Box3().setFromObject(root);state.scanBounds=state.scanBounds||[];state.scanBounds.push({min:finalBox.min.toArray(),max:finalBox.max.toArray()});
 }
 state.shoreDetailV146={scannedSections:layouts.length,source:'CC0 Poly Haven coastal_cliff_02 / coastal_cliff_04 / coast_rocks_02',trueAlbedo:true,bakedRadianceRelit:false,originalIslandFootprintPreserved:true,carvedVertices:5950,rootProtectionPillars:0,groundedPlantGroups:132,groundedGrassClusters:325,backSlopeMinimumMetres:5,backSlopeMinimumRearY:[28,36],rearEmbeddedMetres:.06,native:'blender/mythology-v32-148/coast-bridged-c.blend'};
}
