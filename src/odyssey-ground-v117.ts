import * as THREE from 'three';
export async function makeGroundV117(){
 const loader=new THREE.TextureLoader();const images=await Promise.all(['./assets/odyssey/pbr-v103/seaside_rock/Diffuse.jpg','./assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg','./assets/odyssey/pbr-v106/sand_01/diff.jpg','./assets/odyssey/pbr-v103/seaside_rock/nor_gl.jpg','./assets/odyssey/pbr-v103/forest_ground_04/nor_gl.jpg','./assets/odyssey/pbr-v106/sand_01/nor_gl.jpg'].map(s=>loader.loadAsync(s)));
 images.forEach((t,i)=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(i<3)t.colorSpace=THREE.SRGBColorSpace});
 const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.87,envMapIntensity:.65});m.name='V117 physical metre rock / humus / wet fine sand';
 m.onBeforeCompile=s=>{
  for(const [i,key]of ['rockColor','soilColor','sandColor','rockNormal','soilNormal','sandNormal'].entries())s.uniforms['v117_'+key]={value:images[i]};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 habitat; varying vec3 v117_habitat,v117_world,v117_normal;').replace('#include <begin_vertex>','#include <begin_vertex>\nv117_habitat=habitat;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nv117_world=(modelMatrix*vec4(transformed,1.)).xyz;v117_normal=inverseTransformDirection(transformedNormal,viewMatrix);');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   varying vec3 v117_habitat,v117_world,v117_normal;
   uniform sampler2D v117_rockColor,v117_soilColor,v117_sandColor,v117_rockNormal,v117_soilNormal,v117_sandNormal;
   vec3 v117_weights(){vec3 w=pow(abs(normalize(v117_normal)),vec3(5.));return w/max(.0001,w.x+w.y+w.z);}
   vec3 v117_tri(sampler2D t,vec3 p,vec3 w){return texture2D(t,p.yz).rgb*w.x+texture2D(t,p.xz).rgb*w.y+texture2D(t,p.xy).rgb*w.z;}
   vec3 v117_bump(sampler2D t,vec3 p,vec3 w,float strength){vec3 a=texture2D(t,p.yz).xyz*2.-1.,b=texture2D(t,p.xz).xyz*2.-1.,c=texture2D(t,p.xy).xyz*2.-1.;a.xy*=strength;b.xy*=strength;c.xy*=strength;vec3 n=normalize(v117_normal),sg=sign(n);return normalize(n+vec3(a.z*sg.x,a.x,a.y)*w.x+vec3(b.x,b.z*sg.y,b.y)*w.y+vec3(c.x,c.y,c.z*sg.z)*w.z-sg*w);}`)
  .replace('#include <map_fragment>',`vec3 v117_w=v117_weights();float v117_sand=clamp(v117_habitat.r,0.,1.),v117_soil=clamp(v117_habitat.g,0.,1.);float v117_wet=1.-smoothstep(.15,1.6,v117_world.y);
   vec3 v117_r=v117_tri(v117_rockColor,v117_world/5.,v117_w)*vec3(.95,1.,1.02),v117_f=v117_tri(v117_soilColor,v117_world/2.3,v117_w)*vec3(.66,.85,.50),v117_b=v117_tri(v117_sandColor,v117_world/1.4,v117_w)*vec3(1.1,1.04,.88);
   diffuseColor.rgb=mix(mix(v117_r,v117_f,v117_soil),v117_b,v117_sand)*(1.-.33*v117_wet);`)
  .replace('#include <roughnessmap_fragment>','float roughnessFactor=mix(.88,.43,v117_wet);')
  .replace('#include <normal_fragment_maps>',`vec3 v117_rn=v117_bump(v117_rockNormal,v117_world/5.,v117_w,.4),v117_fn=v117_bump(v117_soilNormal,v117_world/2.3,v117_w,.16),v117_bn=v117_bump(v117_sandNormal,v117_world/1.4,v117_w,.09);normal=normalize(mat3(viewMatrix)*normalize(mix(mix(v117_rn,v117_fn,v117_soil),v117_bn,v117_sand)));`);
 };m.customProgramCacheKey=()=> 'v117-physical-native-habitat';return m;
}
