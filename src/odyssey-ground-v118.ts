import * as THREE from 'three';
import {EXRLoader} from 'three/addons/loaders/EXRLoader.js';
export async function makeGroundV118(){
 const map=await new EXRLoader().setDataType(THREE.HalfFloatType).loadAsync('./blender/mythology-v32-118/ground-cycles-radiance.exr');
 // EXRLoader decodes scanlines bottom-up; glTF UVs are exported top-down.
 map.colorSpace=THREE.LinearSRGBColorSpace;map.flipY=false;map.repeat.y=-1;map.offset.y=1;map.anisotropy=8;
 // Preserve the native diffuse illumination, while restoring sub-atlas photo
 // detail in close views. Only bounded local contrast is added, never a second sun.
 const photos=await Promise.all(['./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg','./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg','./assets/odyssey/pbr-v106/sand_01/diff.jpg'].map(p=>new THREE.TextureLoader().loadAsync(p)));
 photos.forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;});
 const m=new THREE.MeshBasicMaterial({map,toneMapped:true});m.name='V118 actual Cycles radiance with metre-scale photographic close detail';
 m.onBeforeCompile=s=>{
  photos.forEach((t,i)=>s.uniforms['v118_detail'+i]={value:t});
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 habitat;varying vec3 v118_detailWorld,v118_detailNormal,v118_detailHabitat;').replace('#include <begin_vertex>','#include <begin_vertex>\nv118_detailWorld=(modelMatrix*vec4(position,1.)).xyz;v118_detailNormal=mat3(modelMatrix)*normal;v118_detailHabitat=habitat;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   uniform sampler2D v118_detail0,v118_detail1,v118_detail2;varying vec3 v118_detailWorld,v118_detailNormal,v118_detailHabitat;
   float v118_photo(sampler2D t,vec3 p,vec3 w){return dot(texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z,vec3(.2126,.7152,.0722));}
   float v118_contrast(sampler2D t,vec3 p,vec3 w){float a=v118_photo(t,p,w);float mean=(v118_photo(t,p+vec3(.17,.23,.19),w)+v118_photo(t,p-vec3(.21,.19,.17),w)+v118_photo(t,p+vec3(.34,-.37,.29),w)+v118_photo(t,p-vec3(.31,-.33,.35),w))*.25;return clamp(sqrt((a+.035)/(mean+.035)),.78,1.23);}`)
   .replace('#include <map_fragment>',`#include <map_fragment>
    vec3 v118_dw=pow(abs(normalize(v118_detailNormal)),vec3(5.));v118_dw/=max(.0001,v118_dw.x+v118_dw.y+v118_dw.z);
    float v118_dc=mix(mix(v118_contrast(v118_detail0,v118_detailWorld/1.8,v118_dw),v118_contrast(v118_detail1,v118_detailWorld/1.7,v118_dw),clamp(v118_detailHabitat.g,0.,1.)),v118_contrast(v118_detail2,v118_detailWorld/.42,v118_dw),clamp(v118_detailHabitat.r,0.,1.));
    diffuseColor.rgb*=mix(1.,v118_dc,1.-smoothstep(40.,125.,distance(cameraPosition,v118_detailWorld)));`);
 };m.customProgramCacheKey=()=> 'v118-cycles-radiance-photo-detail-1';return m;
}
export async function makeGroundPBRV118(){
 const loader=new THREE.TextureLoader();
 const paths=['./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg','./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg','./assets/odyssey/pbr-v106/sand_01/diff.jpg','./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_nor_gl_2k.jpg','./assets/odyssey/pbr-v103/forest_ground_04/nor_gl.jpg','./assets/odyssey/pbr-v106/sand_01/nor_gl.jpg','./assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_rough_2k.jpg','./assets/odyssey/pbr-v103/forest_ground_04/Rough.jpg','./assets/odyssey/pbr-v106/sand_01/rough.jpg','./blender/mythology-v32-118/ground-contact-ao.png'];
 const images=await Promise.all(paths.map(p=>loader.loadAsync(p)));images.forEach((t,i)=>{t.anisotropy=8;if(i<9)t.wrapS=t.wrapT=THREE.RepeatWrapping;if(i<3)t.colorSpace=THREE.SRGBColorSpace;});
 images[9].flipY=false; const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.84,envMapIntensity:.65,aoMap:images[9],aoMapIntensity:.75});m.name='V118 pale fractured coast / dry woodland / fine sand / native Cycles AO';
 m.onBeforeCompile=s=>{
  for(const[i,key]of['rockColor','soilColor','sandColor','rockNormal','soilNormal','sandNormal','rockRough','soilRough','sandRough'].entries())s.uniforms['v118_'+key]={value:images[i]};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 habitat;varying vec3 v118_habitat,v118_world,v118_normal;').replace('#include <begin_vertex>','#include <begin_vertex>\nv118_habitat=habitat;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nv118_world=(modelMatrix*vec4(transformed,1.)).xyz;v118_normal=inverseTransformDirection(transformedNormal,viewMatrix);');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
  varying vec3 v118_habitat,v118_world,v118_normal;
  uniform sampler2D v118_rockColor,v118_soilColor,v118_sandColor,v118_rockNormal,v118_soilNormal,v118_sandNormal,v118_rockRough,v118_soilRough,v118_sandRough;
  vec3 v118_weights(){vec3 w=pow(abs(normalize(v118_normal)),vec3(5.));return w/max(.0001,w.x+w.y+w.z);}
  vec3 v118_tri(sampler2D t,vec3 p,vec3 w){return texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z;}
  vec3 v118_bump(sampler2D t,vec3 p,vec3 w,float strength){vec3 a=texture2D(t,p.yz).xyz*2.-1.,b=texture2D(t,p.xz).xyz*2.-1.,c=texture2D(t,p.xy).xyz*2.-1.;a.xy*=strength;b.xy*=strength;c.xy*=strength;vec3 n=normalize(v118_normal),sg=sign(n);return normalize(n+vec3(a.z*sg.x,a.x,a.y)*w.x+vec3(b.x,b.z*sg.y,b.y)*w.y+vec3(c.x,c.y,c.z*sg.z)*w.z-sg*w);}`)
  .replace('#include <map_fragment>',`vec3 v118_w=v118_weights();float v118_sand=clamp(v118_habitat.r,0.,1.),v118_soil=clamp(v118_habitat.g,0.,1.);float v118_wet=1.-smoothstep(.15,1.6,v118_world.y);
  vec3 v118_rawRock=v118_tri(v118_rockColor,v118_world/1.8,v118_w);float v118_peak=max(max(v118_rawRock.r,v118_rawRock.g),v118_rawRock.b);
  vec3 v118_r=min(mix(vec3(v118_peak),v118_rawRock,.38)*vec3(3.8,3.7,3.25),vec3(.82,.82,.80)),v118_f=v118_tri(v118_soilColor,v118_world/1.7,v118_w)*vec3(1.04,.94,.72),v118_b=v118_tri(v118_sandColor,v118_world/.42,v118_w)*vec3(1.14,1.10,.98);
  diffuseColor.rgb=mix(mix(v118_r,v118_f,v118_soil),v118_b,v118_sand)*(1.-.25*v118_wet);`)
  .replace('#include <roughnessmap_fragment>',`float v118_rr=v118_tri(v118_rockRough,v118_world/1.8,v118_w).r,v118_fr=v118_tri(v118_soilRough,v118_world/1.7,v118_w).r,v118_br=v118_tri(v118_sandRough,v118_world/.42,v118_w).r;float roughnessFactor=mix(clamp(mix(mix(v118_rr,v118_fr,v118_soil),v118_br,v118_sand),.58,.96),.43,v118_wet);`)
  .replace('#include <normal_fragment_maps>',`vec3 v118_rn=v118_bump(v118_rockNormal,v118_world/1.8,v118_w,.30),v118_fn=v118_bump(v118_soilNormal,v118_world/1.7,v118_w,.16),v118_bn=v118_bump(v118_sandNormal,v118_world/.42,v118_w,.09);normal=normalize(mat3(viewMatrix)*normalize(mix(mix(v118_rn,v118_fn,v118_soil),v118_bn,v118_sand)));`);
 };m.customProgramCacheKey=()=> 'v118-native-ground-contact-and-pale-rock';return m;
}
