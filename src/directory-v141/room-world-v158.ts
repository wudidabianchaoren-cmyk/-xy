import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
/** A physical room around the preserved working desktop. Decorative objects never steal its picks. */
export async function roomWorldV158(scene:T.Scene,woodColor:T.Texture,woodNormal:T.Texture,woodRough:T.Texture,original?:T.Object3D){
 // Open the two old narrow side walls into the added room. Preserve the window wall and all desk props.
 let openedWallTriangles=0;original?.updateMatrixWorld(true);original?.traverse(o=>{if(!(o instanceof T.Mesh))return;const g=o.geometry,p=g.getAttribute('position'),index=g.index,materials=Array.isArray(o.material)?o.material:[o.material],groups=g.groups.length?[...g.groups]:[{start:0,count:index?.count??p.count,materialIndex:0}],kept:number[]=[],nextGroups:any[]=[],v=new T.Vector3(),centre=new T.Vector3();
  for(const group of groups){const start=kept.length,wall=/warm plaster/i.test(materials[group.materialIndex??0]?.name??'');for(let k=group.start;k<group.start+group.count;k+=3){const ids=[0,1,2].map(j=>index?index.getX(k+j):k+j);centre.set(0,0,0);for(const id of ids)centre.add(v.fromBufferAttribute(p,id).applyMatrix4(o.matrixWorld));centre.multiplyScalar(1/3);if(wall&&Math.abs(centre.x)>1.95&&centre.z> -1.32){openedWallTriangles++;continue;}kept.push(...ids);}if(kept.length>start)nextGroups.push({start,count:kept.length-start,materialIndex:group.materialIndex});}if(openedWallTriangles){g.setIndex(kept);g.clearGroups();nextGroups.forEach(q=>g.addGroup(q.start,q.count,q.materialIndex));g.computeBoundingSphere();}
 });
 // Relocate only the original print's vertices; its old right wall no longer exists.
 let printVertices=0;original?.traverse(o=>{if(!(o instanceof T.Mesh))return;const g=o.geometry,p=g.getAttribute('position'),norm=g.getAttribute('normal'),world=new T.Vector3(),inverse=o.matrixWorld.clone().invert();for(let i=0;i<p.count;i++){world.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);if(world.x>1.97&&world.x<2.04&&world.y>1.47&&world.y<2.28&&world.z>-.86&&world.z<-.23){const x=world.x-2.005,z=world.z+.55;world.set(2.82+z,world.y+.16,-1.175-x).applyMatrix4(inverse);p.setXYZ(i,world.x,world.y,world.z);if(norm){const nx=norm.getX(i),nz=norm.getZ(i);norm.setXYZ(i,nz,norm.getY(i),-nx);}printVertices++;}}if(printVertices){p.needsUpdate=true;if(norm)norm.needsUpdate=true;g.computeBoundingBox();g.computeBoundingSphere();}});
 const root=new T.Group();root.name='V158 extended studio / stool shelving lounge and floor';scene.add(root);
 const wood=new T.MeshPhysicalMaterial({map:woodColor,normalMap:woodNormal,roughnessMap:woodRough,color:0xa98257,roughness:.49,normalScale:new T.Vector2(.18,.18),clearcoat:.17,clearcoatRoughness:.4});
 const charcoal=new T.MeshStandardMaterial({color:0x302d27,roughness:.42,metalness:.22}),metal=new T.MeshStandardMaterial({color:0xa0957a,roughness:.29,metalness:.8}),cloth=new T.MeshStandardMaterial({color:0x77705b,roughness:.94}),paper=new T.MeshStandardMaterial({color:0xe4d5b8,roughness:.91});
 let count=0;
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:T.Material,round=.025,parent:T.Object3D=root)=>{const o=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,round),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);count++;return o;};
 const cylinder=(r:number,h:number,x:number,y:number,z:number,m:T.Material)=>{const o=new T.Mesh(new T.CylinderGeometry(r,r,h,24),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);count++;return o;};
 const floorMap=woodColor.clone(),floorNormal=woodNormal.clone();floorMap.repeat.set(5,6);floorNormal.repeat.set(5,6);floorMap.needsUpdate=floorNormal.needsUpdate=true;
 const floor=new T.Mesh(new T.PlaneGeometry(8.4,7.2),new T.MeshStandardMaterial({map:floorMap,normalMap:floorNormal,normalScale:new T.Vector2(.2,.2),color:0x8c6848,roughness:.56}));floor.rotation.x=-Math.PI/2;floor.position.set(0,-.035,.45);floor.receiveShadow=true;root.add(floor);
 const wall=new T.MeshStandardMaterial({color:0xb9a283,roughness:.94});for(const side of[-1,1]){box(2.18,3.4,.13,side*2.91,1.65,-1.28,wall);box(.13,3.4,5.6,side*4.02,1.65,.95,wall);box(2.15,.12,.06,side*2.91,.07,-1.19,wood);}
 // Left stool: thick seat and four splayed solid legs with real floor contact.
 const stoolX=.16,stoolZ=1.64;cylinder(.34,.085,stoolX,.49,stoolZ,wood);
 for(const x of[-.21,.21])for(const z of[-.21,.21]){const leg=box(.055,.45,.055,stoolX+x,.225,stoolZ+z,wood,.012);leg.rotation.z=-Math.sign(x)*.085;leg.rotation.x=Math.sign(z)*.085;}
 box(.48,.032,.035,stoolX,.20,stoolZ-.2,wood,.008);box(.48,.032,.035,stoolX,.20,stoolZ+.2,wood,.008);
 function bookcase(x:number,z:number,w:number,h:number){for(const side of[-1,1])box(.075,h,.49,x+side*(w/2-.035),h/2,z,wood);box(w,h,.055,x,h/2,z-.22,wood);for(const y of[.08,h*.47,h-.035])box(w,.075,.54,x,y,z,wood);return h;}
 const leftH=bookcase(-2.85,-.72,1.15,1.40);bookcase(2.92,-.80,1.28,1.27);
 const spineColors=[0x535b4c,0x7a4d36,0xb69b68,0x393e3c,0x8c775a];
 for(const side of[-1,1])for(let i=0;i<9;i++){const x=(side<0?-3.28:2.42)+i*.09,y=.14+(i%3)*.015,h=.36+(i%4)*.034;const m=new T.MeshStandardMaterial({color:spineColors[i%5],roughness:.88});box(.067,h,.31,x,y+h/2,-.70,m,.009);box(.046,.009,.008,x,y+h*.78,-.54,paper,.002);}
 // A small CD receiver and keyboard establish the left listening corner.
 box(.76,.135,.39,-2.85,leftH+.085,-.72,charcoal);box(.68,.025,.34,-2.85,leftH+.165,-.72,metal,.012);const disc=cylinder(.115,.012,-2.85,leftH+.184,-.72,metal);disc.material=new T.MeshStandardMaterial({color:0xc7bda4,roughness:.22,metalness:.84});
 const knob=cylinder(.024,.035,-2.58,leftH+.085,-.51,metal);knob.rotation.x=Math.PI/2;
 box(.71,.035,.24,-2.84,.72,-.61,charcoal,.012);for(let row=0;row<3;row++)for(let i=0;i<11;i++)box(.044,.012,.045,-3.11+i*.052,.744,-.69+row*.062,paper,.003);
 // Right lounge chair: layered cushions, angled back and separate hardwood arms.
 const lounge=new T.Group();lounge.position.set(2.58,0,.68);lounge.rotation.y=-.28;root.add(lounge);
 box(.91,.12,.86,0,.34,0,wood,.04,lounge);box(.82,.19,.76,0,.47,.02,cloth,.085,lounge);const back=box(.82,.72,.17,0,.88,-.34,cloth,.07,lounge);back.rotation.x=-.19;
 for(const sign of[-1,1]){box(.07,.57,.07,sign*.46,.28,-.3,wood,.018,lounge);box(.075,.50,.075,sign*.46,.25,.32,wood,.018,lounge);box(.10,.08,.84,sign*.46,.64,.01,wood,.025,lounge);}
 box(.58,.20,.48,2.57,.22,1.56,cloth,.07);for(const x of[2.35,2.79])for(const z of[1.39,1.73])box(.045,.13,.045,x,.06,z,wood,.01);
 // One warm high practical lights the new room and casts grounded shadows.
 // Personal, physical working material: two original portfolio prints on a cork pinboard.
 const cork=new T.MeshStandardMaterial({color:0x826443,roughness:1,normalMap:woodNormal,normalScale:new T.Vector2(.12,.12)});
 box(1.65,.97,.045,-2.84,2.13,-1.18,wood,.012);box(1.58,.90,.014,-2.84,2.13,-1.147,cork,.007);
 const texLoader=new T.TextureLoader();const pictures=await Promise.all(['./assets/works/xianxia-cliff.png','./assets/works/rural-return/v130/element-01.webp'].map(p=>texLoader.loadAsync(p)));for(const t of pictures){t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;}
 for(let i=0;i<2;i++){const x=-3.22+i*.76;box(.67,.48,.009,x,2.17,-1.13,paper,.002);const photo=new T.Mesh(new T.PlaneGeometry(.60,.34),new T.MeshStandardMaterial({map:pictures[i],roughness:.91}));photo.position.set(x,2.19,-1.122);root.add(photo);box(.10,.037,.004,x,2.425,-1.12,new T.MeshStandardMaterial({color:0xc7b783,roughness:.9}),.001);}
 // Two paper studies below the prints, held by small brass pins.
 for(let i=0;i<3;i++){const x=-3.37+i*.50;box(.41,.105,.005,x,1.80,-1.125,paper,.001);for(let k=0;k<3;k++)box(.29-k*.03,.003,.002,x-.025,1.825-k*.023,-1.12,charcoal,.001);}
 // A portrait format sketch pad and film-strip contact sheet make the right wall intentional.
 box(.50,.68,.03,3.58,2.08,-1.17,wood,.006);box(.445,.625,.008,3.58,2.08,-1.149,paper,.001);
 for(let j=0;j<4;j++){box(.32,.087,.003,3.58,2.28-j*.13,-1.142,new T.MeshStandardMaterial({color:[0x68705b,0xa88756,0x65564a,0x9e6e47][j],roughness:.91}),.001);}
 // A low materials tray, rolled drawings and a canvas satchel occupy the previously empty lower corner.
 box(.55,.06,.31,-3.27,.755,-.61,wood,.008);for(let i=0;i<5;i++)box(.072,.012,.19,-3.43+i*.082,.795,-.61,new T.MeshStandardMaterial({color:[0xb0a69a,0x8b6041,0x4c544c,0xd1c1a4,0x716952][i],roughness:.72}),.002);
 const rolls=new T.Group();rolls.position.set(-3.60,.23,.58);root.add(rolls);for(let i=0;i<3;i++){const roll=new T.Mesh(new T.CylinderGeometry(.045,.045,.49+i*.08,20,1,true),paper);roll.rotation.z=(i-1)*.12;roll.position.set(i*.07,.06,0);roll.castShadow=true;rolls.add(roll);}
 box(.37,.30,.19,-3.47,.17,.70,cloth,.035);
 const key=new T.SpotLight(0xffcf83,38,12,1.02,.58,2);key.position.set(-2.65,3.35,1.1);key.target.position.set(.3,.4,-.05);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.normalBias=.012;key.shadow.bias=-.0001;root.add(key,key.target);
 scene.add(new T.HemisphereLight(0xf5ddaf,0x3c3024,.20));
 return{objects:count,printVertices,printMountedOnBackWall:true,frontStool:[stoolX,stoolZ],creatorPinboard:true,filmContactSheet:true,materialsTray:true,openedWallTriangles,stool:true,leftBookcase:true,cdReceiver:true,keyboard:true,rightBookcase:true,lounge:true,floor:true,walls:true,shadowLight:true};
}
