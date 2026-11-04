import * as T from 'three';

type Pose={id:string;on:string;off:string;depth:string;depthWidth:number;depthHeight:number;near:number;far:number;position:number[];direction:number[];viewProjection:number[];sourceScene:string};
type Loaded={pose:Pose;colour:T.Texture;depth:T.DataTexture;position:T.Vector3;direction:T.Vector3;matrix:T.Matrix4};
const projectionGLSL=`
varying vec3 vNativeLightingWorld;
uniform sampler2D nativeColour0,nativeDepth0,nativeColour1,nativeDepth1;
uniform mat4 nativeVP0,nativeVP1;uniform vec2 nativeNF0,nativeNF1;
uniform float nativeWeight0,nativeWeight1,nativeLampLevel;
vec4 readNativeLighting(sampler2D colourImage,sampler2D depthImage,mat4 vp,vec2 nf,float weight){
 vec4 p=vp*vec4(vNativeLightingWorld,1.);if(p.w<=0.||weight<=0.)return vec4(0.);
 vec2 uv=p.xy/p.w*.5+.5;if(any(lessThan(uv,vec2(.001)))||any(greaterThan(uv,vec2(.999))))return vec4(0.);
 // RGBADepthPacking in the installed Three r180 stores the high byte in R.
 float packedDepth=dot(texture2D(depthImage,uv),vec4((255./256.),(255./256.)/256.,(255./256.)/65536.,1./16777216.));
 float sourceDistance=-(nf.x*nf.y)/((nf.y-nf.x)*packedDepth-nf.y);
 float tolerance=.018+p.w*.002;float visible=1.-smoothstep(tolerance*.45,tolerance,abs(sourceDistance-p.w));
 // At the 2.4 km sky dome, linearized depth loses precision. The source
 // must still be background: never use this relaxation over nearby land.
 if(p.w>500.&&sourceDistance>500.)visible=1.;
 float border=min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y));visible*=smoothstep(.001,.004,border);
 vec3 colour=mix(texture2D(colourImage,vec2(uv.x,uv.y*.5)).rgb,texture2D(colourImage,vec2(uv.x,uv.y*.5+.5)).rgb,nativeLampLevel);
 return vec4(colour*visible*weight,visible*weight);
}
`;
const applyGLSL=`
vec4 nativeA=readNativeLighting(nativeColour0,nativeDepth0,nativeVP0,nativeNF0,nativeWeight0);
vec4 nativeB=readNativeLighting(nativeColour1,nativeDepth1,nativeVP1,nativeNF1,nativeWeight1);
float nativeCoverage=nativeA.a+nativeB.a;
if(nativeCoverage>.0001){vec3 nativeColour=(nativeA.rgb+nativeB.rgb)/nativeCoverage;
 gl_FragColor.rgb=mix(gl_FragColor.rgb,linearToOutputTexel(vec4(nativeColour,1.)).rgb,clamp(nativeCoverage*2.,0.,1.));}
`;

/** Project the preserved native lighting onto real browser geometry, with a
 * depth test. Video, calendar, movable props and their controls remain live.
 * This is an authoring candidate and must pass off-axis quality checks.
 */
export async function attachBakedLightingV179(scene:T.Scene,manifestPath:string,state:any,renderer?:T.WebGLRenderer){
 const response=await fetch(manifestPath);if(!response.ok)throw Error('Native lighting manifest unavailable');
 const manifest=await response.json(),url=new URL(response.url),loader=new T.TextureLoader();
 if(!manifest.poses?.length)throw Error('Native lighting poses missing');
 const loaded:Loaded[]=[],materials:T.Material[]=[],textures:T.Texture[]=[];
 const empty=new T.Texture(),identity=new T.Matrix4();
 const uniforms:any={nativeColour0:{value:empty},nativeDepth0:{value:empty},nativeColour1:{value:empty},nativeDepth1:{value:empty},nativeVP0:{value:identity.clone()},nativeVP1:{value:identity.clone()},nativeNF0:{value:new T.Vector2()},nativeNF1:{value:new T.Vector2()},nativeWeight0:{value:0},nativeWeight1:{value:0},nativeLampLevel:{value:1}};
 let alive=true;
 async function load(pose:Pose){
  if(pose.sourceScene!==manifest.scene)throw Error('Wrong source scene in native lighting field');
  const [on,off,res]=await Promise.all([loader.loadAsync(new URL(pose.on,url).href),loader.loadAsync(new URL(pose.off,url).href),fetch(new URL(pose.depth,url))]);
  if(!res.ok)throw Error('Native lighting visibility data unavailable');
  const bytes=await new Response(res.body!.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if(bytes.byteLength!==pose.depthWidth*pose.depthHeight*4)throw Error('Incomplete native lighting visibility data');
  const atlas=document.createElement('canvas');atlas.width=on.image.width;atlas.height=on.image.height*2;const context=atlas.getContext('2d')!;context.drawImage(on.image,0,0);context.drawImage(off.image,0,on.image.height);
  const colour=new T.CanvasTexture(atlas);colour.colorSpace=T.SRGBColorSpace;colour.anisotropy=8;colour.minFilter=T.LinearMipmapLinearFilter;colour.magFilter=T.LinearFilter;on.dispose();off.dispose();
  const depth=new T.DataTexture(new Uint8Array(bytes),pose.depthWidth,pose.depthHeight,T.RGBAFormat,T.UnsignedByteType);depth.minFilter=depth.magFilter=T.NearestFilter;depth.generateMipmaps=false;depth.flipY=false;depth.needsUpdate=true;
  const item={pose,colour,depth,position:new T.Vector3().fromArray(pose.position),direction:new T.Vector3().fromArray(pose.direction),matrix:new T.Matrix4().fromArray(pose.viewProjection)};
  textures.push(colour,depth);renderer?.initTexture(colour);renderer?.initTexture(depth);if(alive)loaded.push(item);else[colour,depth].forEach(t=>t.dispose());return item;
 }
 await load(manifest.poses[0]);
 function patch(old:T.Material,water=false){
  const material=old.clone(),previous=old.onBeforeCompile,key=old.customProgramCacheKey();material.userData.nativeSourceVertexHook=previous;
  const stableLeaves=manifest.scene==='myth'&&!!(old as T.MeshStandardMaterial).alphaMap&&new URLSearchParams(location.search).has('nativeFoliage185');
  // Preserve existing streamed texture objects. ShaderMaterial.clone otherwise
  // clones their uniforms and loses the original Texture's streamed data flag.
  if(material instanceof T.ShaderMaterial&&old instanceof T.ShaderMaterial)material.uniforms={...old.uniforms};
  material.onBeforeCompile=(shader,renderer)=>{
   previous.call(material,shader,renderer);Object.assign(shader.uniforms,uniforms);
   shader.vertexShader='varying vec3 vNativeLightingWorld;\n'+shader.vertexShader;
   if(shader.vertexShader.includes('#include <worldpos_vertex>'))shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
    vec4 nativePosition=vec4(${stableLeaves?'position':'transformed'},1.);
    #ifdef USE_BATCHING
     nativePosition=batchingMatrix*nativePosition;
    #endif
    #ifdef USE_INSTANCING
     nativePosition=instanceMatrix*nativePosition;
    #endif
    vNativeLightingWorld=(modelMatrix*nativePosition).xyz;`);
   else shader.vertexShader=shader.vertexShader.replace(/void main\(\)\s*\{/,'void main(){vNativeLightingWorld=(modelMatrix*vec4(position,1.)).xyz;');
   let visibilityCode=water?projectionGLSL.replace('.018+p.w*.002','.35+p.w*.02'):stableLeaves?projectionGLSL.replace('.018+p.w*.002','.12+p.w*.003'):projectionGLSL;
   if(manifest.scene==='room')visibilityCode=visibilityCode.replace('vec3 colour=mix(',`// Reject source colour that straddles a foreground/background depth edge.
    // Linear colour filtering must not smear a TV or window frame onto the city.
    vec2 texel=1./vec2(textureSize(depthImage,0));
    for(int edge=0;edge<4;edge++){
     vec2 delta=edge==0?vec2(texel.x,0.):edge==1?vec2(-texel.x,0.):edge==2?vec2(0.,texel.y):vec2(0.,-texel.y);
     float z=dot(texture2D(depthImage,uv+delta),vec4((255./256.),(255./256.)/256.,(255./256.)/65536.,1./16777216.));
     float neighbourDistance=-(nf.x*nf.y)/((nf.y-nf.x)*z-nf.y);
     visible*=1.-smoothstep(tolerance*2.,tolerance*6.,abs(neighbourDistance-sourceDistance));
    }
    vec3 colour=mix(`);
   if((old as T.MeshStandardMaterial).alphaMap&&!stableLeaves)visibilityCode=visibilityCode.replace('return vec4(colour*visible*weight,visible*weight);','visible*=1.-smoothstep(.28,.45,dot(colour,vec3(.2126,.7152,.0722)));return vec4(colour*visible*weight,visible*weight);');
   shader.fragmentShader=visibilityCode+shader.fragmentShader;
   if(!water&&old instanceof T.MeshStandardMaterial&&!(old as T.MeshPhysicalMaterial).transmission){
    // The final preserved-lighting mix already replaces these pixels completely.
    // Skip lights/IBL/scattering only in that exact case; keep the full PBR path
    // for disocclusions and incomplete coverage. Source pixels stay identical.
    shader.fragmentShader=shader.fragmentShader.replace('#include <alphahash_fragment>',`#include <alphahash_fragment>
     vec4 nativeFastA=readNativeLighting(nativeColour0,nativeDepth0,nativeVP0,nativeNF0,nativeWeight0);
     vec4 nativeFastB=readNativeLighting(nativeColour1,nativeDepth1,nativeVP1,nativeNF1,nativeWeight1);
     float nativeFastCoverage=nativeFastA.a+nativeFastB.a;
     if(nativeFastCoverage>=.5){
      #ifdef OPAQUE
       diffuseColor.a=1.;
      #endif
      gl_FragColor=vec4(linearToOutputTexel(vec4((nativeFastA.rgb+nativeFastB.rgb)/nativeFastCoverage,1.)).rgb,diffuseColor.a);
      #include <dithering_fragment>
      return;
     }
    `);
   }
   const output=water?applyGLSL.replace('clamp(nativeCoverage*2.,0.,1.)','clamp(nativeCoverage*2.,0.,mix(.86,1.,smoothstep(80.,250.,length(vNativeLightingWorld-cameraPosition))))'):applyGLSL;
   if(water){const end=shader.fragmentShader.lastIndexOf('}');shader.fragmentShader=shader.fragmentShader.slice(0,end)+output+'\n'+shader.fragmentShader.slice(end);}
   else if(shader.fragmentShader.includes('#include <dithering_fragment>')){const marker='#include <dithering_fragment>',at=shader.fragmentShader.lastIndexOf(marker);shader.fragmentShader=shader.fragmentShader.slice(0,at)+output+'\n'+shader.fragmentShader.slice(at);}
   else if(shader.fragmentShader.includes('#include <colorspace_fragment>'))shader.fragmentShader=shader.fragmentShader.replace('#include <colorspace_fragment>','#include <colorspace_fragment>\n'+output);
   else throw Error('Unrecognized native lighting material output');
  };
  material.customProgramCacheKey=()=>key+'/native-lighting-v179-depth-checked';material.needsUpdate=true;materials.push(material);return material;
 }
 scene.traverse(object=>{
  if(!(object instanceof T.Mesh)||/calendar|date|book|tape|cassette|phone|notepad|journal|fortune|live screen/i.test(object.name))return;
  for(let ancestor:T.Object3D|null=object;ancestor;ancestor=ancestor.parent)if(ancestor.userData.nativeLightingExcluded)return;
  const original=Array.isArray(object.material)?object.material:[object.material];
  const mapped=original.map(m=>{
   if(m.transparent||!m.depthWrite&&!object.userData.nativeLightingSurface||(m as any).userData?.materialFamily==='paper')return m;
   if(m instanceof T.MeshStandardMaterial||m instanceof T.MeshLambertMaterial||m instanceof T.ShaderMaterial&&('photo'in m.uniforms||object.userData.nativeLightingSurface||object.userData.coastalWater))return patch(m,!!object.userData.coastalWater);
   return m;
  });object.material=Array.isArray(object.material)?mapped:mapped[0];
 });
 state.bakedLighting={version:179,source:'locally captured original UE output',qualityApproved:false,geometryPreserved:true,originalTexturesPreserved:true,sourcePoses:manifest.poses.length,loadedPoses:loaded.length,materials:materials.length,liveVideoExcluded:true,depthChecked:true};
 const direction=new T.Vector3();
 function bind(slot:number,item:Loaded,weight:number){for(const[k,v]of Object.entries({Colour:item.colour,Depth:item.depth,VP:item.matrix,NF:new T.Vector2(item.pose.near,item.pose.far),Weight:weight}))uniforms['native'+k+slot].value=v;}
 function update(camera:T.Camera,lamp:number){
  camera.getWorldDirection(direction);const choices=loaded.map(item=>({item,score:camera.position.distanceToSquared(item.position)/2.25+4*(1-direction.dot(item.direction))})).sort((a,b)=>a.score-b.score);
  const a=choices[0],b=choices[1]||a,wa=1/(.08+a.score),wb=choices[1]?1/(.08+b.score):0;
  bind(0,a.item,wa/(wa+wb));bind(1,b.item,wb/(wa+wb));uniforms.nativeLampLevel.value=T.MathUtils.clamp(lamp,0,1);state.bakedLighting.loadedPoses=loaded.length;
 }
 // Finish GPU uploads before controls become ready; a new view must not cause
 // a texture upload or a first-use shader compilation in the middle of a drag.
 const remaining:Pose[]=manifest.poses.slice(1);await Promise.all([0,1].map(async()=>{while(remaining.length){const pose=remaining.shift();if(pose)await load(pose);}}));
 state.bakedLighting.loadedPoses=loaded.length;
 return{update,visibilityFields:()=>loaded.map(item=>({pose:item.pose,data:item.depth.image.data as Uint8Array})),dispose(){alive=false;materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());empty.dispose();}};
}
