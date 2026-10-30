import * as THREE from 'three';

/** Real three-dimensional shore aprons, weathered ledges and gravel use the existing terrain as their support. */
export async function coveGroundDetailV144(scene:THREE.Scene,land:THREE.Object3D,state:any){
 const loader=new THREE.TextureLoader();
 const [map,normal,rough]=await Promise.all(['diff','nor_gl','rough'].map(s=>loader.loadAsync(`./assets/odyssey/rock_boulder_cracked_${s}_1k.jpg`)));
 map.colorSpace=THREE.SRGBColorSpace;for(const t of [map,normal,rough]){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;}
 const rock=new THREE.MeshStandardMaterial({name:'V144 fractured limestone / real eroded ledges',color:0xbab7a8,roughness:.9,metalness:0,envMapIntensity:.24});
 rock.onBeforeCompile=s=>{
  s.uniforms.rockPhoto={value:map};s.uniforms.rockNormal={value:normal};s.uniforms.rockRough={value:rough};
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 detailWorld,detailNormal;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\ndetailWorld=worldPosition.xyz;detailNormal=inverseTransformDirection(transformedNormal,viewMatrix);');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
   uniform sampler2D rockPhoto,rockNormal,rockRough;varying vec3 detailWorld,detailNormal;
   vec3 detailWeights(){vec3 w=pow(abs(normalize(detailNormal)),vec3(5.));return w/max(.0001,w.x+w.y+w.z);}
   vec3 triRock(sampler2D t){vec3 w=detailWeights();vec3 q=detailWorld*.68;return texture2D(t,q.zy).rgb*w.x+texture2D(t,q.xz).rgb*w.y+texture2D(t,q.xy).rgb*w.z;}`)
   .replace('#include <color_fragment>',`#include <color_fragment>
    vec3 photo=triRock(rockPhoto);float grain=dot(photo,vec3(.2126,.7152,.0722));
    diffuseColor.rgb*=mix(vec3(max(.20,grain*1.65)),photo*1.65,.24);`)
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor=clamp(triRock(rockRough).g,.74,.98);`)
   .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
    vec3 w=detailWeights(),q=detailWorld*.68;
    vec3 nx=texture2D(rockNormal,q.zy).xyz*2.-1.,ny=texture2D(rockNormal,q.xz).xyz*2.-1.,nz=texture2D(rockNormal,q.xy).xyz*2.-1.;
    vec3 perturb=vec3(nx.z*sign(detailNormal.x),nx.y,nx.x)*w.x+vec3(ny.x,ny.z*sign(detailNormal.y),ny.y)*w.y+vec3(nz.x,nz.y,nz.z*sign(detailNormal.z))*w.z;
    normal=normalize(mat3(viewMatrix)*normalize(normalize(detailNormal)+perturb*.60));`);
 };rock.customProgramCacheKey=()=> 'v144-limestone-world-triplanar-relief';
 // Preserve the native lighting and colour continuity; add physically lit surface relief to the complete coast.
 let repairedRockMeshes=0;
 scene.traverse(o=>{if(!(o instanceof THREE.Mesh)||o instanceof THREE.InstancedMesh)return;
  let ancestor:THREE.Object3D|null=o;while(ancestor&&ancestor!==land)ancestor=ancestor.parent;
  if(o.material instanceof THREE.MeshBasicMaterial&&o.material.map){
   const old=o.material;
   const physical=rock.clone();physical.name='V144 native-colour coast with real relief';physical.map=old.map;physical.color.copy(old.color).multiplyScalar(.78);physical.envMapIntensity=.18;
   physical.onBeforeCompile=shader=>{rock.onBeforeCompile(shader,null as any);shader.fragmentShader=shader.fragmentShader.replace('diffuseColor.rgb*=mix(vec3(max(.20,grain*1.65)),photo*1.65,.24);','diffuseColor.rgb*=clamp(.72+grain*1.4,.72,1.12);');};
   physical.customProgramCacheKey=()=> 'v144-native-radiance-colour-with-rock-relief';o.material=physical;repairedRockMeshes++;
  }else if(!Array.isArray(o.material)&&/pale fractured coast/.test(o.material.name)){o.material=rock;repairedRockMeshes++;}
 });
 const sand=new THREE.MeshStandardMaterial({name:'V144 sloping submerged sand apron',color:0xc4bda4,roughness:.98,metalness:0,envMapIntensity:.1});
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0);land.updateMatrixWorld(true);
 const hit=(x:number,z:number)=>{ray.set(new THREE.Vector3(x,60,z),down);return ray.intersectObject(land,true)[0];};
 const shore:THREE.Vector3[]=[];
 for(let x=-39;x<=31;x+=1.4){let found:THREE.Vector3|null=null;
  for(let z=-8;z>=-40;z-=1.4){const h=hit(x,z);if(h&&h.point.y>-.55){found=h.point.clone();break;}}
  if(found&&found.y<4)shore.push(found);
 }
 const verts:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let i=0;i<shore.length;i++){
  const p=shore[i];for(let j=0;j<4;j++){const f=j/3,outer=(1-f)*2.1;verts.push(p.x,p.y*f-(1-f)*1.3,p.z+outer);uv.push(p.x*.7,(p.z+outer)*.7);}
  if(i&&Math.abs(p.z-shore[i-1].z)<6)for(let j=0;j<3;j++){const a=(i-1)*4+j,b=i*4+j;indices.push(a,b,a+1,b,b+1,a+1);}
 }
 const apron=new THREE.BufferGeometry();apron.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));apron.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));apron.setIndex(indices);apron.computeVertexNormals();const beach=new THREE.Mesh(apron,sand);beach.name='V144 continuous sand slope below trough waterline';beach.receiveShadow=true;scene.add(beach);
 const shape=new THREE.IcosahedronGeometry(.5,2);const p=shape.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const bevel=1-.15*Math.abs(x*z)*4;const irregular=1+.10*Math.sin(x*13+z*7+y*8);p.setXYZ(i,x*irregular,y*bevel+.028*Math.sin(x*21+z*17),z*(1+.11*Math.sin(y*9+x*10)));}
 shape.computeVertexNormals();const ledges=new THREE.InstancedMesh(shape,rock,shore.length*3),dummy=new THREE.Object3D();let count=0;
 for(let i=0;i<shore.length;i++){const q=shore[i];if(i%3!==0||Math.sin(i*12.9)<-.25)continue;
  for(let layer=0;layer<3;layer++){const x=q.x+Math.sin(i*3+layer)*.45,z=q.z-.35-layer*.43;const h=hit(x,z);if(!h)continue;dummy.position.set(x,h.point.y-.12+layer*.01,z);dummy.rotation.set(.07*Math.sin(i),Math.sin(i*12.7)*.40,.08*Math.cos(i*4));dummy.scale.set(1.2+.7*(.5+.5*Math.sin(i*8)),.72+layer*.12,.82+layer*.16);dummy.updateMatrix();ledges.setMatrixAt(count++,dummy.matrix);}
 }
 ledges.count=count;ledges.name='V144 volumetric fractured foreshore strata';ledges.receiveShadow=true;scene.add(ledges);
 const pebbleGeo=new THREE.IcosahedronGeometry(1,1);const gravel=new THREE.InstancedMesh(pebbleGeo,rock,360);let n=0;
 for(let i=0;i<360;i++){if(!shore.length)break;const q=shore[i%shore.length];const x=q.x+Math.sin(i*137.5)*1.5,z=q.z+Math.cos(i*29.7)*1.2;const h=hit(x,z);if(!h||h.point.y<-.28||h.point.y>4)continue;const s=.035+(.5+.5*Math.sin(i*43))*.16;dummy.position.set(x,h.point.y+s*.35,z);dummy.scale.set(s*1.5,s*.65,s);dummy.rotation.set(i*.31,i*1.8,i*.91);dummy.updateMatrix();gravel.setMatrixAt(n++,dummy.matrix);}
 gravel.count=n;gravel.receiveShadow=true;gravel.name='V144 grounded shingle and broken shore fragments';scene.add(gravel);
 state.shoreDetailV144={shoreSamples:shore.length,realStrata:count,gravel:n,repairedRockMeshes,apronTriangles:indices.length/3,submergedSlope:true,material:'photographic PBR; actual geometry, not a screenshot layer'};
}
