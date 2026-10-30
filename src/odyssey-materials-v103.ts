import * as THREE from 'three';
type Pack={diff:THREE.Texture;normal:THREE.Texture;rough:THREE.Texture;ao:THREE.Texture;height:THREE.Texture};
const folder='./assets/odyssey/pbr-v103/';
async function loadPack(id:string):Promise<Pack>{
 const loader=new THREE.TextureLoader(),ts=await Promise.all(['Diffuse.jpg','nor_gl.jpg','Surface.png'].map(k=>loader.loadAsync(folder+id+'/'+k)));
 ts.forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;});ts[0].colorSpace=THREE.SRGBColorSpace;
 return {diff:ts[0],normal:ts[1],rough:ts[2],ao:ts[2],height:ts[2]};
}
async function fineBeachPack():Promise<Pack>{const loader=new THREE.TextureLoader(),[diff,normal,rough]=await Promise.all(['diff','nor_gl','rough'].map(k=>loader.loadAsync('./assets/odyssey/pbr-v106/sand_01/'+k+'.jpg')));for(const t of[diff,normal,rough]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}diff.colorSpace=THREE.SRGBColorSpace;return{diff,normal,rough,ao:rough,height:rough};}
const declarations=`varying vec3 pbrPosition,pbrWorld,pbrNormal;
 vec3 triWeights(){vec3 w=pow(abs(normalize(pbrNormal)),vec3(4.));return w/max(dot(w,vec3(1.)),.0001);}
 vec3 tri(sampler2D tex,vec3 p,vec3 w){return texture2D(tex,p.yz).rgb*w.x+texture2D(tex,p.xz).rgb*w.y+texture2D(tex,p.xy).rgb*w.z;}
 vec3 triNormal(sampler2D tex,vec3 p,vec3 w,float strength){
  vec3 a=texture2D(tex,p.yz).xyz*2.-1.,b=texture2D(tex,p.xz).xyz*2.-1.,c=texture2D(tex,p.xy).xyz*2.-1.;
  vec3 n=normalize(pbrNormal),sgn=sign(n);
  a.xy*=strength;b.xy*=strength;c.xy*=strength;
  vec3 x=vec3(a.z*sgn.x,a.x,a.y),y=vec3(b.x,b.z*sgn.y,b.y),z=vec3(c.x,c.y,c.z*sgn.z);
  // Preserve the geometric normal; add only the photographed surface gradient.
  vec3 baseAxes=vec3(sgn.x*w.x,sgn.y*w.y,sgn.z*w.z);
  return normalize(n+(x*w.x+y*w.y+z*w.z-baseAxes));
 }`;
function positionVaryings(s:THREE.WebGLProgramParametersWithUniforms){
 s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 pbrPosition,pbrWorld,pbrNormal;')
  .replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
   vec4 pbrLocal=vec4(transformed,1.);
   #ifdef USE_INSTANCING
    pbrLocal=instanceMatrix*pbrLocal;
   #endif
   pbrPosition=pbrLocal.xyz;pbrWorld=(modelMatrix*pbrLocal).xyz;pbrNormal=inverseTransformDirection(transformedNormal,viewMatrix);`);
}
function terrainMaterial(rock:Pack,sand:Pack,soil:Pack){
 for(const pack of[rock,sand,soil])for(const t of new Set(Object.values(pack)))t.wrapS=t.wrapT=THREE.MirroredRepeatWrapping;
 const grainNormal=sand.normal.clone();grainNormal.repeat.set(5.2,5.2);grainNormal.needsUpdate=true;
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.92,normalMap:grainNormal,normalScale:new THREE.Vector2(.12,.12),envMapIntensity:.72});m.name='V106 fine sandy cove / stratified rock / coastal meadow';
 m.onBeforeCompile=s=>{
  positionVaryings(s);s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 habitat;varying vec3 groundHabitat;').replace('#include <begin_vertex>','#include <begin_vertex>\ngroundHabitat=habitat;');for(const [key,p]of Object.entries({r:rock,b:sand,f:soil}))for(const [kind,t]of Object.entries(p))s.uniforms[key+kind]={value:t};
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\n${declarations}
   varying vec3 groundHabitat;uniform sampler2D rdiff,rnormal,rrough,bdiff,bnormal,brough,fdiff,fnormal,frough;
   float groundHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float groundNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(groundHash(i),groundHash(i+vec2(1.,0.)),f.x),mix(groundHash(i+vec2(0.,1.)),groundHash(i+vec2(1.)),f.x),f.y);}
   vec2 groundOffset(vec2 p){return vec2(groundHash(p),groundHash(p+13.17))*2.;}
   vec3 groundSample(sampler2D tex,vec2 uv){vec2 i=floor(uv),f=fract(uv),w=f*f*(3.-2.*f);vec3 a=texture2D(tex,f+groundOffset(i)).rgb,b=texture2D(tex,f-vec2(1.,0.)+groundOffset(i+vec2(1.,0.))).rgb,c=texture2D(tex,f-vec2(0.,1.)+groundOffset(i+vec2(0.,1.))).rgb,d=texture2D(tex,f-vec2(1.)+groundOffset(i+vec2(1.))).rgb;return mix(mix(a,b,w.x),mix(c,d,w.x),w.y);}
   vec3 groundTri(sampler2D tex,vec3 p,vec3 w){vec3 result=vec3(0.);float total=0.;if(w.x>.01){result+=groundSample(tex,p.yz)*w.x;total+=w.x;}if(w.y>.01){result+=groundSample(tex,p.xz)*w.y;total+=w.y;}if(w.z>.01){result+=groundSample(tex,p.xy)*w.z;total+=w.z;}return result/max(total,.0001);}
   vec3 groundDiffuse(sampler2D tex,vec3 p,vec3 w,vec3 meanColor){vec2 uv=p.xz*5.2;vec3 a=texture2D(tex,uv).rgb,b=texture2D(tex,mat2(.8,.6,-.6,.8)*uv*1.37+vec2(.27,.61)).rgb;float grain=clamp(dot((a+b)*.5,vec3(.333333))*3.,0.,1.);return meanColor*(.96+.08*grain);}
   vec3 groundNormal(sampler2D tex,vec3 p,vec3 w,float strength){vec3 a=groundSample(tex,p.yz)*2.-1.,b=groundSample(tex,p.xz)*2.-1.,c=groundSample(tex,p.xy)*2.-1.;vec3 n=normalize(pbrNormal),sgn=sign(n);a.xy*=strength;b.xy*=strength;c.xy*=strength;vec3 x=vec3(a.z*sgn.x,a.x,a.y),y=vec3(b.x,b.z*sgn.y,b.y),z=vec3(c.x,c.y,c.z*sgn.z);return normalize(n+x*w.x+y*w.y+z*w.z-vec3(sgn.x*w.x,sgn.y*w.y,sgn.z*w.z));}`)
   .replace('#include <map_fragment>',`vec3 weights=triWeights();vec3 rp=pbrWorld/13.,bp=pbrWorld/2.2,fp=pbrWorld/3.15;
    float slope=normalize(pbrNormal).y;float coast=pbrWorld.y+.7*sin(pbrWorld.x*.063)*sin(pbrWorld.z*.041);
    float beach=groundHabitat.r;float forest=groundHabitat.g;
    vec3 rockColor=groundTri(rdiff,rp,weights)*vec3(1.85,1.72,1.53);vec3 sandColor=mix(groundTri(bdiff,pbrWorld*1.1,weights)*1.25,vec3(.48,.415,.30),.35);vec3 soilColor=groundTri(fdiff,fp,weights)*vec3(.75,1.05,.60);
    // Albedo remains photographic. Broad sediment colour changes do not replace its detail.
    rockColor*=mix(vec3(.87,.92,.94),vec3(1.10,1.05,.96),.5+.5*sin(pbrWorld.y*.32+pbrWorld.x*.014));
    float wet=1.-smoothstep(.2,1.7,coast);diffuseColor.rgb=mix(mix(rockColor,soilColor,forest),sandColor,beach)*(1.-wet*.32);
    float surfaceAO=mix(mix(groundTri(rrough,rp,weights).r,groundTri(frough,fp,weights).r,forest),groundTri(brough,bp,weights).r,beach);
    diffuseColor.rgb*=mix(.82,1.,surfaceAO)*(.93+.12*groundNoise(pbrWorld.xz*.025));`)
   .replace('#include <roughnessmap_fragment>',`float roughnessFactor=mix(mix(.74+.20*groundTri(rrough,rp,weights).g,.84+.14*groundTri(frough,fp,weights).g,forest),.89+.10*groundTri(brough,bp,weights).g,beach);roughnessFactor=mix(roughnessFactor,.42,wet);`)
   .replace('#include <normal_fragment_maps>',`vec3 rockRelief=groundNormal(rnormal,rp,weights,.62),soilRelief=groundNormal(fnormal,fp,weights,.22),sandRelief=groundNormal(bnormal,pbrWorld*1.1,weights,.14);normal=normalize(mat3(viewMatrix)*normalize(mix(mix(rockRelief,soilRelief,forest),sandRelief,beach)));`)
   ;
 };m.customProgramCacheKey=()=> 'v106-native-landform-photographic-habitats';return m;
}
function woodMaterial(p:Pack,index:number){
 const m=new THREE.MeshStandardMaterial({color:new THREE.Color().setScalar(.88+(index%4)*.025),roughness:.78,envMapIntensity:.65,side:THREE.DoubleSide});m.name='V103 real weathered ship timber';
 m.onBeforeCompile=s=>{
  positionVaryings(s);for(const [k,t]of Object.entries(p))s.uniforms['wood'+k]={value:t};
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\n${declarations}\nuniform sampler2D wooddiff,woodnormal,woodrough;`)
   .replace('#include <map_fragment>',`vec3 weights=triWeights();vec3 wp=pbrPosition/1.8;vec3 woodColor=tri(wooddiff,wp,weights);
    float damp=1.-smoothstep(-.2,.60,pbrWorld.y);diffuseColor.rgb*=woodColor*(1.-damp*.28);diffuseColor.rgb*=mix(.76,1.,tri(woodrough,wp,weights).r);`)
   .replace('#include <roughnessmap_fragment>','float roughnessFactor=mix(.57+.31*tri(woodrough,wp,weights).g,.37,damp);')
   .replace('#include <normal_fragment_maps>','normal=normalize(mat3(viewMatrix)*triNormal(woodnormal,wp,weights,.55));');
 };m.customProgramCacheKey=()=> 'v103-real-ship-timber';return m;
}
function stoneMaterial(p:Pack){
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.88,envMapIntensity:.6});m.name='V103 sea-worn stone / photographic microrelief';
 m.onBeforeCompile=s=>{positionVaryings(s);for(const[k,t]of Object.entries(p))s.uniforms['stone'+k]={value:t};
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\n${declarations}\nuniform sampler2D stonediff,stonenormal,stonerough;`)
   .replace('#include <map_fragment>',`vec3 weights=triWeights();vec3 rp=pbrWorld/2.;float wet=1.-smoothstep(.2,1.8,pbrWorld.y);diffuseColor.rgb*=tri(stonediff,rp,weights)*(1.-wet*.32)*mix(.72,1.,tri(stonerough,rp,weights).r);`)
   .replace('#include <roughnessmap_fragment>','float roughnessFactor=mix(.70+.23*tri(stonerough,rp,weights).g,.34,wet);')
   .replace('#include <normal_fragment_maps>','normal=normalize(mat3(viewMatrix)*triNormal(stonenormal,rp,weights,.68));');
 };m.customProgramCacheKey=()=> 'v103-sea-worn-stone';return m;
}
export async function finishMaterialRendering(scene:THREE.Scene,boats:THREE.Group[],anatomyUV:Map<string,THREE.BufferGeometry>){
 const [wood,linen,rock,sand,soil,atlas]=await Promise.all([loadPack('weathered_brown_planks'),loadPack('rough_linen'),loadPack('seaside_rock'),fineBeachPack(),loadPack('forest_ground_04'),new THREE.TextureLoader().loadAsync(folder+'skin-atlas.png')]);
 atlas.colorSpace=THREE.SRGBColorSpace;atlas.flipY=false;atlas.anisotropy=8;
 const ground=terrainMaterial(rock,sand,soil),stone=stoneMaterial(rock),timbers=Array.from({length:8},(_,i)=>woodMaterial(wood,i));
 const skin=new THREE.MeshPhysicalMaterial({map:atlas,color:0xffffff,roughness:.63,metalness:0,envMapIntensity:.65,specularIntensity:.36});skin.name='V103 original anatomical skin atlas / restored after native import';
 skin.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 skinPoint;').replace('#include <begin_vertex>','#include <begin_vertex>\nskinPoint=position;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 skinPoint;float pore(vec3 p){return sin(p.x*2133.+sin(p.z*1171.))*sin(p.y*1933.+p.z*731.);}`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nfloat h=pore(skinPoint)*.000045;vec3 a=dFdx(-vViewPosition),b=dFdy(-vViewPosition),c=cross(b,normal),d=cross(normal,a);float dt=dot(a,c);normal=normalize(abs(dt)*normal-sign(dt)*(dFdx(h)*c+dFdy(h)*d));`);
 };skin.customProgramCacheKey=()=> 'v103-restored-anatomy-skin';
 const skinDetail=skin.clone();skinDetail.map=null;skinDetail.color.set(0xc79676);skinDetail.name='V103 anatomical eyelid / matched skin pigment';
 let terrain=0,woodMeshes=0,sails=0,skinMeshes=0,stones=0,foliage=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const key=Number(String(o.userData.native84Key||'').split('_')[1]);
  if((key>=19&&key<=22)||(key>=26&&key<=29)){if(!o.geometry.getAttribute('habitat')){const a=o.geometry.getAttribute('position'),n=o.geometry.getAttribute('normal'),h=new Float32Array(a.count*3),point=new THREE.Vector3(),normal=new THREE.Vector3(),nm=new THREE.Matrix3().getNormalMatrix(o.matrixWorld);for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld);normal.fromBufferAttribute(n,i).applyMatrix3(nm).normalize();const b=(1-THREE.MathUtils.smoothstep(point.y,1.8,5.2))*THREE.MathUtils.smoothstep(normal.y,.70,.94),f=THREE.MathUtils.smoothstep(point.y,4.5,9.5)*(1-b)*THREE.MathUtils.smoothstep(normal.y,.65,.92);h.set([b,f,Math.max(0,1-b-f)],i*3);}o.geometry.setAttribute('habitat',new THREE.BufferAttribute(h,3));}o.material=ground;terrain++;return;}
  if([6,7,8,12,13,14,15,17].includes(key)){
   const original=anatomyUV.get(o.userData.native84Key);
   if(original){o.geometry=original;o.material=skin;}else o.material=skinDetail;
   o.receiveShadow=true;skinMeshes++;return;
  }
  if(/eroded ridge boulder|fractured exposed ridge outcrops|littoral rock|Scanned sea-worn cliff/.test(o.name)){o.material=stone;stones+=o instanceof THREE.InstancedMesh?o.count:1;return;}
  const mats=Array.isArray(o.material)?o.material:[o.material];
  if(/Wind-filled linen sail/.test(o.name)){
   const old=mats[0] as THREE.MeshPhysicalMaterial,m=new THREE.MeshPhysicalMaterial({map:linen.diff.clone(),normalMap:linen.normal.clone(),roughnessMap:linen.rough.clone(),color:[0xe4ddc8,0xc5b38b,0xd3cbb8,0x90a9b3][o.parent?.userData.variant||0],side:THREE.DoubleSide,roughness:.93,normalScale:new THREE.Vector2(.28,.28),sheen:.55,sheenRoughness:.85,sheenColor:new THREE.Color(0xe8ddc0),envMapIntensity:.65});
   // The photographed swatch is 27 cm wide: no metre-wide visible woven threads.
   const p=o.geometry.getAttribute('position'),uv=o.geometry.getAttribute('uv');o.geometry.computeBoundingBox();const size=o.geometry.boundingBox!.getSize(new THREE.Vector3());
   for(let i=0;i<p.count;i++){const u=uv.getX(i),v=uv.getY(i),tension=Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
    p.setZ(i,p.getZ(i)+tension*(.085*Math.sin(u*Math.PI*11.+v*.9)+.028*Math.sin(u*Math.PI*23.-v*5.)));
   }p.needsUpdate=true;o.geometry.computeVertexNormals();
   for(const t of [m.map,m.normalMap,m.roughnessMap])t!.repeat.set(Math.max(5,size.x/.271),Math.max(8,size.y/.271));
   m.onBeforeCompile=old.onBeforeCompile;m.customProgramCacheKey=()=> 'v103-real-linen-seams';m.name='V103 27cm scanned linen with sewn panels';o.material=m;o.receiveShadow=true;sails++;return;
  }
  let ancestor:THREE.Object3D|null=o,inBoat=false;while(ancestor){if(boats.includes(ancestor as THREE.Group))inBoat=true;ancestor=ancestor.parent;}
  const replace=mats.map((m,i)=>{
   if(!(m instanceof THREE.MeshStandardMaterial))return m;
   if(inBoat&&m.metalness<.2&&(/Batched solid hull and interior joinery/.test(m.name)&&!!m.map||m.color.getHex()===0x624126||/Raised flagship stern|timber|wood|plank|mast|deck/i.test(o.name+' '+m.name))&&!/skin|Human|cloth|tunic|mantle|fire|linen/.test(o.name+' '+m.name)){woodMeshes++;return timbers[i%timbers.length];}
   if(/foliage|leaf|crown|canopy/i.test(o.name+' '+m.name)){m.envMapIntensity=.85;m.roughness=.88;m.color.multiplyScalar(1.05);foliage++;}
   else if(inBoat){m.envMapIntensity=.65;if(/Human.*body|skin/i.test(m.name)){m.color.set(0xffffff);m.roughness=.64;skinMeshes++;}}
   return m;
  });o.material=Array.isArray(o.material)?replace:replace[0];
 });
 // Keep sea, sky, original sun and camera path. Correct only the twice-attenuated material fill.
 scene.environmentIntensity=.65;
 const ambient=scene.children.find(o=>o instanceof THREE.HemisphereLight) as THREE.HemisphereLight|undefined;if(ambient)ambient.intensity=.72;
 return {version:105,terrain,woodMeshes,sails,skinMeshes,stones,foliage,realPbrMaps:true,linenSwatchMetres:.271,woodTileMetres:1.8,rockTileMetres:2,sandTileMetres:.423,groundNormalMethod:'Standard photographic grain normal; continuous UV; no biased mip division',source:'Poly Haven CC0 scans + retained native skin atlas',seaChanged:false};
}
