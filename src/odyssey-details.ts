import * as THREE from 'three';

export type SeaBird={root:THREE.Group;wings:THREE.Group[];tips:THREE.Group[];origin:THREE.Vector3;phase:number;radius:number};

export function createSeaBirds(scene:THREE.Scene):SeaBird[] {
  const birds:SeaBird[]=[];
  const feather=new THREE.MeshStandardMaterial({color:0x242e2c,roughness:.86,side:THREE.DoubleSide});
  const breast=new THREE.MeshStandardMaterial({color:0x969b91,roughness:.9});
  const bodyGeometry=new THREE.SphereGeometry(1,12,8);
  for(let i=0;i<11;i++) {
    const root=new THREE.Group();root.name='Travelling articulated seabird';scene.add(root);
    const body=new THREE.Mesh(bodyGeometry,breast);body.scale.set(.14,.13,.39);root.add(body);
    const head=new THREE.Mesh(bodyGeometry,breast);head.position.set(0,.12,-.35);head.scale.set(.10,.10,.13);root.add(head);
    const beak=new THREE.Mesh(new THREE.ConeGeometry(.035,.19,6),feather);beak.rotation.x=-Math.PI/2;beak.position.set(0,.10,-.51);root.add(beak);
    const wings:THREE.Group[]=[],tips:THREE.Group[]=[];
    for(const side of [-1,1]) {
      const wing=new THREE.Group();root.add(wing);wings.push(wing);
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([
        0,.025,-.17,side*.52,.055,-.20,side*.98,.015,.03,side*.66,0,.23,0,0,.19],3));
      geometry.setIndex([0,1,3,1,2,3,0,3,4]);geometry.computeVertexNormals();wing.add(new THREE.Mesh(geometry,feather));
      const tip=new THREE.Group();tip.position.set(side*.90,0,.04);wing.add(tip);tips.push(tip);
      const outer=new THREE.BufferGeometry();outer.setAttribute('position',new THREE.Float32BufferAttribute([
        0,0,-.06,side*.55,.015,.08,side*.68,0,.20,side*.42,0,.32,-side*.22,0,.18],3));
      outer.setIndex([0,1,4,1,2,3,1,3,4]);outer.computeVertexNormals();tip.add(new THREE.Mesh(outer,feather));
    }
    const tail=new THREE.Mesh(new THREE.ConeGeometry(.19,.31,3),feather);tail.rotation.x=Math.PI/2;tail.position.z=.43;root.add(tail);
    const distant=i>=8;
    root.scale.setScalar((distant?.94:.72)+(i%3)*.12);
    const origin=distant?new THREE.Vector3(-40+(i-8)*5,32+(i-8)*1.8,-91-(i-8)*6):new THREE.Vector3(-12+i*1.8,12+(i%4)*2.4,-15-i*3.4);
    birds.push({root,wings,tips,origin,phase:i*.81,radius:distant?18:18+(i%4)*3});
  }
  updateSeaBirds(birds,0);
  return birds;
}

export function updateSeaBirds(birds:SeaBird[],time:number) {
  for(const bird of birds) {
    const angle=time*(.23+.015*Math.sin(bird.phase))+bird.phase,rate=.23+.015*Math.sin(bird.phase);
    const zRadius=bird.radius*.72;
    bird.root.position.set(bird.origin.x+Math.sin(angle)*bird.radius,bird.origin.y+1.1*Math.sin(angle*2.)+.16*Math.sin(time*6.+bird.phase),bird.origin.z+Math.cos(angle)*zRadius);
    const dx=Math.cos(angle)*bird.radius*rate,dz=-Math.sin(angle)*zRadius*rate;
    bird.root.rotation.set(.07*Math.cos(angle*2.),Math.atan2(-dx,-dz),-.20*Math.sin(angle));
    const envelope=.16+.84*THREE.MathUtils.smoothstep(.5+.5*Math.sin(time*.47+bird.phase),.16,.48);
    const stroke=time*(6.4+.35*Math.sin(bird.phase))+bird.phase;
    bird.wings.forEach((wing,index)=>{
      const side=index===0?-1:1;
      wing.rotation.z=side*(.12+.83*Math.sin(stroke)*envelope);
      bird.tips[index].rotation.z=side*.32*Math.sin(stroke-.65)*envelope;
    });
  }
}

// World-space sampling keeps photographed cracks metre-scale across anatomical skin and boulders.
export function rockyGiantMaterial(diffuse:THREE.Texture,normalMap:THREE.Texture,rough:THREE.Texture) {
  const material=new THREE.MeshStandardMaterial({map:diffuse,normalMap,roughnessMap:rough,roughness:.98,color:0x8b8878,envMapIntensity:.18});
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>
      varying vec3 vRockPosition;varying vec3 vRockNormal;`)
      .replace('#include <worldpos_vertex>',`#include <worldpos_vertex>
      vRockPosition=(modelMatrix*vec4(transformed,1.)).xyz;
      vRockNormal=inverseTransformDirection(transformedNormal,viewMatrix);`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vRockPosition;varying vec3 vRockNormal;
      vec3 rockWeights(){vec3 w=pow(abs(normalize(vRockNormal)),vec3(4.));return w/max(dot(w,vec3(1.)),.0001);}
      vec4 rockSample(sampler2D surface){vec3 p=vRockPosition*.38,w=rockWeights();
        return texture2D(surface,p.yz)*w.x+texture2D(surface,p.xz)*w.y+texture2D(surface,p.xy)*w.z;}`)
      .replace('#include <map_fragment>',`diffuseColor*=rockSample(map);
        float mineral=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mineral*.86,mineral*.98,mineral*.93),.48);
        float wet=1.-smoothstep(1.,9.,vRockPosition.y);diffuseColor.rgb*=1.-wet*.27;`)
      .replace('#include <roughnessmap_fragment>',`float roughnessFactor=.82+.16*rockSample(roughnessMap).g;
        roughnessFactor=max(roughnessFactor,.68);`)
      .replace('#include <normal_fragment_maps>',`vec3 pRock=vRockPosition*.38,wRock=rockWeights(),sRock=sign(vRockNormal);
        vec3 nx=texture2D(normalMap,pRock.yz).xyz*2.-1.;
        vec3 ny=texture2D(normalMap,pRock.xz).xyz*2.-1.;
        vec3 nz=texture2D(normalMap,pRock.xy).xyz*2.-1.;
        vec3 rockyNormal=normalize(vec3(nx.z*sRock.x,nx.x*.65,nx.y*.65)*wRock.x+
          vec3(ny.x*.65,ny.z*sRock.y,ny.y*.65)*wRock.y+vec3(nz.x*.65,nz.y*.65,nz.z*sRock.z)*wRock.z);
        normal=normalize(mix(normal,mat3(viewMatrix)*rockyNormal,.62));`);
  };
  material.customProgramCacheKey=()=> 'weathered-triplanar-rock-v32-67';
  return material;
}

export function coastalRockMaterial(diffuse:THREE.Texture,normalMap:THREE.Texture,rough:THREE.Texture){
  const material=rockyGiantMaterial(diffuse,normalMap,rough);material.color.set(0xb0aca0);
  const compile=material.onBeforeCompile;
  material.onBeforeCompile=(shader,renderer)=>{
    compile(shader,renderer);
    shader.fragmentShader=shader.fragmentShader
      .replace('float wet=1.-smoothstep(1.,9.,vRockPosition.y);diffuseColor.rgb*=1.-wet*.27;','float wet=1.-smoothstep(.2,2.4,vRockPosition.y);diffuseColor.rgb*=1.-wet*.35;')
      .replace('roughnessFactor=max(roughnessFactor,.68);','float tidalWet=1.-smoothstep(.2,2.4,vRockPosition.y);roughnessFactor=mix(.32,max(roughnessFactor,.78),1.-tidalWet);')
      .replace('mat3(viewMatrix)*rockyNormal,.62','mat3(viewMatrix)*rockyNormal,.42');
  };
  material.customProgramCacheKey=()=> 'fractured-coastal-grain-v32-67';return material;
}

export function poseRockGiant(anatomy:THREE.Object3D,stone:THREE.MeshStandardMaterial) {
  const sockets=new THREE.MeshStandardMaterial({color:0x172421,roughness:.97});
  anatomy.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    const materials=Array.isArray(object.material)?object.material:[object.material];
    const skin=materials.some(material=>/^Human\.(body|nipple|lips|fingernails|toenails|ears)$/.test(material.name));
    const eye=materials.some(material=>material.name==='Human.low-poly');
    object.visible=skin||eye;
    if(object.visible){object.material=eye?sockets:stone;object.castShadow=true;object.receiveShadow=true;}
  });
  const bones=new Map<string,THREE.Bone>();
  anatomy.traverse(object=>{if(object instanceof THREE.Bone)bones.set(object.name.replace(/[^a-z0-9]/gi,'').toLowerCase(),object);});
  const aim=(jointName:string,endName:string,direction:THREE.Vector3)=>{
    const joint=bones.get(jointName),end=bones.get(endName);if(!joint||!end||!joint.parent)return;
    anatomy.updateMatrixWorld(true);
    const from=end.getWorldPosition(new THREE.Vector3()).sub(joint.getWorldPosition(new THREE.Vector3())).normalize();
    const rotation=new THREE.Quaternion().setFromUnitVectors(from,direction.normalize());
    const world=joint.getWorldQuaternion(new THREE.Quaternion()),parent=joint.parent.getWorldQuaternion(new THREE.Quaternion());
    joint.quaternion.copy(parent.invert()).multiply(rotation).multiply(world);
    anatomy.updateMatrixWorld(true);
  };
  aim('upperarm01r','lowerarm01r',new THREE.Vector3(-.46,-.84,.17));
  aim('upperarm01l','lowerarm01l',new THREE.Vector3(.52,-.81,.18));
  aim('lowerarm01r','wristr',new THREE.Vector3(-.10,-.97,.22));
  aim('lowerarm01l','wristl',new THREE.Vector3(.12,-.96,.24));
  const head=bones.get('head');if(head){head.rotateX(-.055);head.rotateY(.08);}
  anatomy.updateMatrixWorld(true);
}

export function dressTorchBearer(hero:THREE.Object3D,linen:THREE.Texture,linenNormal:THREE.Texture,linenRough:THREE.Texture,time:{value:number}) {
  hero.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    object.castShadow=true;object.receiveShadow=true;
    const refine=(source:THREE.Material):THREE.Material=>{
      if(!(source instanceof THREE.MeshStandardMaterial))return source;
      const material=source.clone();
      if(/woven tunic|travelling mantle/.test(material.name)) {
        // Blender's procedural colour multiply is not represented by glTF's baseColorFactor.
        const mantle=/mantle/.test(material.name);
        material.color.set(mantle?0x8e3026:0xb9aa8e);material.map=linen;material.normalMap=linenNormal;material.roughnessMap=linenRough;
        material.normalScale.set(.48,.48);material.roughness=.92;
        if(material instanceof THREE.MeshPhysicalMaterial){material.sheen=.24;material.sheenColor.set(0xa99b85);material.sheenRoughness=.85;}
        const loose=/hem|mantle/.test(object.name);
        if(loose) {
          material.onBeforeCompile=shader=>{
            shader.uniforms.clothTime=time;
            shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nuniform float clothTime;')
              .replace('#include <begin_vertex>',`#include <begin_vertex>
              float freeHem=1.-smoothstep(.38,1.38,position.y);
              transformed.z+=sin(position.x*19.+clothTime*2.1)*freeHem*.018;
              transformed.x+=sin(position.y*8.-clothTime*1.4)*freeHem*.008;`);
          };
          material.customProgramCacheKey=()=> 'odyssey-rigged-cloth-v32-64';
        }
      }else if(/^Human\.(body|nipple|lips|fingernails|toenails|ears)$/.test(material.name)) {
        material.transparent=false;material.depthWrite=true;material.alphaTest=0;material.roughness=.62;material.color.set(0xddc5ad);
        if(material instanceof THREE.MeshPhysicalMaterial){material.clearcoat=0;material.clearcoatRoughness=1;}
      }else if(/^Human\./.test(material.name)) {
        material.alphaTest=.35;material.depthWrite=true;material.roughness=.83;
      }
      return material;
    };
    object.material=Array.isArray(object.material)?object.material.map(refine):refine(object.material);
  });
}
