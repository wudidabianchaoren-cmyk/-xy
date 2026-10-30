import * as THREE from 'three';
import {denseIslandForest} from './island-forest';
/** A Mediterranean-inspired interpretation: salt-tolerant low growth, dry scrub, cypress, exposed upper rock. */
export function islandHabitats(scene:THREE.Scene,island:THREE.Group,rock:THREE.MeshStandardMaterial){
 island.updateWorldMatrix(true,true);const surface:THREE.Mesh[]=[];
 island.traverse(o=>{if(o instanceof THREE.Mesh&&/V21.*solid.*inhabited/i.test(o.name+' '+o.parent?.name))surface.push(o);});
 const bounds=new THREE.Box3().setFromObject(island),center=bounds.getCenter(new THREE.Vector3()),extent=bounds.getSize(new THREE.Vector3());
 const root=new THREE.Group();root.name='Coastal habitats / saline littoral, dry maquis, cypress and exposed upper limestone';scene.add(root);
 const leafPositions:number[]=[],leafIndices:number[]=[];
 for(let i=0;i<44;i++){const a=i*2.399,r=.18+.72*Math.sqrt((i%17)/17),y=.38*Math.sin(i*1.71),x=Math.cos(a)*r,z=Math.sin(a)*r*.72,w=.10+.035*(i%3),n=leafPositions.length/3;leafPositions.push(x-w,y,z,x,y+.07,z-.07,x+w,y,z,x,y-.04,z+.07);leafIndices.push(n,n+1,n+2,n,n+2,n+3);}
 const leafGeometry=new THREE.BufferGeometry();leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute(leafPositions,3));leafGeometry.setIndex(leafIndices);leafGeometry.computeVertexNormals();
 const leaves=new THREE.InstancedMesh(leafGeometry,new THREE.MeshStandardMaterial({color:0xb7bf9d,roughness:.96,side:THREE.DoubleSide}),3000);
 const cypressLeaves=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,9,5),new THREE.MeshStandardMaterial({color:0x465439,roughness:.95}),100);let cypressCount=0;
 const twigs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.7,1,1,5),new THREE.MeshStandardMaterial({color:0x50412c,roughness:.93}),180);
 let seed=54711,count=0,branches=0;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;},dummy=new THREE.Object3D();
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),species={coastalLowGrowth:0,dryScrub:0,cypress:0,retainedOliveWoodland:true};
 for(let i=0;i<510;i++){
  const x=center.x+(random()-.5)*extent.x*.82,z=center.z+(random()-.5)*extent.z*.82;ray.set(new THREE.Vector3(x,90,z),down);const hit=ray.intersectObjects(surface,false)[0];if(!hit||hit.point.y<.7||hit.point.y>28||hit.face&&hit.face.normal.y<.65)continue;
  const h=hit.point.y;if(h>5&&Math.sin(x*.041+Math.sin(z*.027))*Math.cos(z*.043)<-.38)continue;
  const cypress=h>11&&h<21&&random()>.88,height=cypress?2.5+random()*1.2:h<5?.22+random()*.25:.65+random()*.6;
  if(cypress)species.cypress++;else if(h<5)species.coastalLowGrowth++;else species.dryScrub++;
  if(cypress){dummy.position.set(x,h+height*.45,z);dummy.rotation.set(0,0,0);dummy.scale.set(.14,height*.9,.14);dummy.updateMatrix();twigs.setMatrixAt(branches++,dummy.matrix);}
  if(cypress){dummy.position.set(x,h+height*.55,z);dummy.rotation.set(0,random()*6.28,0);dummy.scale.set(.33+random()*.12,height,.33+random()*.12);dummy.updateMatrix();cypressLeaves.setMatrixAt(cypressCount++,dummy.matrix);continue;}
  const clusters=5;
  for(let k=0;k<clusters;k++){
   const taper=cypress?.65+random()*.20:height*(.65+random()*.35);
   dummy.position.set(x+(cypress?0:(random()-.5)*height),h+(cypress?height*.5:height*.50),z+(cypress?0:(random()-.5)*height));
   dummy.rotation.set(cypress?0:.12*random(),random()*6.28,cypress?0:.14*random());dummy.scale.set(taper,cypress?height/.84:height*1.3,taper);dummy.updateMatrix();leaves.setMatrixAt(count,dummy.matrix);leaves.setColorAt(count++,new THREE.Color(cypress?0x3d542c:h<5?0x899363:0x687944));
  }
 }
 leaves.count=count;twigs.count=branches;cypressLeaves.count=cypressCount;cypressLeaves.castShadow=cypressLeaves.receiveShadow=true;leaves.receiveShadow=true;twigs.castShadow=twigs.receiveShadow=true;leaves.computeBoundingSphere();twigs.computeBoundingSphere();cypressLeaves.computeBoundingSphere();root.add(leaves,twigs,cypressLeaves);
 // Exposed strata follow actual slopes and sheltered banks; the flat crown stays quiet around the figure.
 const outcropGeometry=new THREE.IcosahedronGeometry(1,2),p=outcropGeometry.getAttribute('position');
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),cut=.88+.10*Math.sin(x*9+z*7)+.06*Math.sin(y*13);p.setXYZ(i,x*cut,y*cut*.58,z*cut);}outcropGeometry.computeVertexNormals();
 const stone=rock.clone();stone.color.setRGB(.53,.46,.34);stone.roughness=.88;stone.envMapIntensity=.10;
 const outcrops=new THREE.InstancedMesh(outcropGeometry,stone,240);let rockCount=0;
 for(let i=0;i<870&&rockCount<240;i++){
  const x=center.x+(random()-.5)*extent.x*.90,z=center.z+(random()-.5)*extent.z*.90;ray.set(new THREE.Vector3(x,90,z),down);const hit=ray.intersectObjects(surface,false)[0];if(!hit||!hit.face||hit.point.y<1||hit.point.y>21||hit.face.normal.y>.92&&hit.point.y>6)continue;
  const size=1.8+random()*3.6;dummy.position.copy(hit.point).add(new THREE.Vector3(0,-size*.18,0));dummy.rotation.set(.12*(random()-.5),random()*Math.PI*2,.1*(random()-.5));dummy.scale.set(size*(1+random()),size,size*(.8+random()*.4));dummy.updateMatrix();outcrops.setMatrixAt(rockCount++,dummy.matrix);
 }
 outcrops.count=rockCount;outcrops.castShadow=outcrops.receiveShadow=true;outcrops.computeBoundingSphere();outcrops.name='Naturally exposed limestone outcrops on coastal slopes';root.add(outcrops);
 Object.assign(species,{coastalOutcrops:rockCount});
 const forest=denseIslandForest(root,surface,center,extent);Object.assign(species,forest,{coastalZones:['wet littoral stone','pebble and sand coves','fractured rock slopes','closed mixed woodland','exposed cave and ridges']});
 return{species,root};
}
