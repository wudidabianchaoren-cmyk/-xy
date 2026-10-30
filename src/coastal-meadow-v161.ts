import * as T from 'three';

/** Fine tapered leaves in loose salt-wind patches; exact BVH roots, no alpha cards. */
export function coastalMeadowV161(land:T.Object3D,clock:{value:number},cottage:number[],state:any){
 let seed=16127;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions:number[]=[],colours:number[]=[],indices:number[]=[];
 for(let b=0;b<7;b++){
  const a=b*2.399,rx=Math.cos(a),rz=Math.sin(a),w=.012+rand()*.015,h=.18+rand()*.25,ox=rx*.09,oz=rz*.09,start=positions.length/3,bend=.10+rand()*.07;
  for(const[x,y,z,c]of[[-w,0,0,0],[w,0,0,0],[-w*.72,h*.48,bend*.28,.48],[w*.72,h*.48,bend*.28,.48],[-w*.32,h*.81,bend*.72,.81],[w*.32,h*.81,bend*.72,.81],[0,h,bend,1]]){
   positions.push(ox+x*rx+z*rz,y,oz+x*rz-z*rx);const tip=T.MathUtils.smoothstep(c,.72,1);colours.push(.105+c*.17+tip*.11,.155+c*.21+tip*.045,.035+c*.055+tip*.04);
  }
  indices.push(start,start+1,start+2,start+1,start+3,start+2,start+2,start+3,start+4,start+3,start+5,start+4,start+4,start+5,start+6);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new T.MeshStandardMaterial({name:'V161 fine coastal meadow / olive roots and sunbleached tips',vertexColors:true,roughness:.95,envMapIntensity:.55,side:T.DoubleSide});
 material.onBeforeCompile=s=>{s.uniforms.meadowTime=clock;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float meadowTime;varying float meadowTip;').replace('#include <begin_vertex>',`#include <begin_vertex>
 vec2 root=vec2(instanceMatrix[3].x,instanceMatrix[3].z);float bend=pow(clamp(position.y/.43,0.,1.),1.8);meadowTip=bend;
 float gust=.6+.4*sin(meadowTime*.43-root.x*.045-root.y*.045);float wave=sin(meadowTime*1.4-root.x*.12-root.y*.12);
 transformed.x+=(wave*.047*gust+.014*sin(meadowTime*2.8+root.y))*.7071*bend;
 transformed.z+=(wave*.047*gust+.014*sin(meadowTime*2.8+root.y))*.7071*bend;`);s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying float meadowTip;').replace('#include <opaque_fragment>','outgoingLight+=diffuseColor.rgb*.055*meadowTip;\n#include <opaque_fragment>');};material.customProgramCacheKey=()=> 'v161-fine-leaves-rooted-coherent-saltwind';
 const mesh=new T.InstancedMesh(geometry,material,18500);mesh.name='V161 grounded fine coastal meadow';mesh.receiveShadow=true;mesh.castShadow=false;
 const bounds=new T.Box3().setFromObject(land),ray=new T.Raycaster(),down=new T.Vector3(0,-1,0),normal=new T.Vector3(),nm=new T.Matrix3(),dummy=new T.Object3D();(ray as any).firstHitOnly=true;
 let count=0,minY=Infinity,maxY=-Infinity;
 for(let i=0;i<235000&&count<18500;i++){
  const x=T.MathUtils.lerp(bounds.min.x,bounds.max.x,rand()),z=T.MathUtils.lerp(bounds.min.z,bounds.max.z,rand());
  const patch=.68+.23*Math.sin(x*.21+Math.sin(z*.15))*Math.cos(z*.18)+.10*Math.sin(x*.61-z*.39);if(rand()>patch*.92)continue;
  if(Math.abs(x-cottage[0])<3.5&&Math.abs(z-cottage[2])<3.0)continue;
  ray.set(new T.Vector3(x,bounds.max.y+5,z),down);const hit=ray.intersectObject(land,true)[0];if(!hit||hit.point.y<2.5||!hit.face)continue;
  normal.copy(hit.face.normal).applyNormalMatrix(nm.getNormalMatrix(hit.object.matrixWorld));if(normal.y<.76)continue;
  const size=.78+rand()*.67;dummy.position.copy(hit.point);dummy.position.y+=.008;dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal);dummy.rotateY(rand()*Math.PI*2);dummy.scale.set(size,size,size);dummy.updateMatrix();mesh.setMatrixAt(count,dummy.matrix);mesh.setColorAt(count,new T.Color().setRGB(.82+rand()*.34,.86+rand()*.22,.76+rand()*.26));count++;minY=Math.min(minY,hit.point.y);maxY=Math.max(maxY,hit.point.y);
 }
 mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();
 state.coastalGrass={source:'V161 seven fine tapered physical blades per coastal tuft, rooted on actual island triangles',tufts:count,blades:count*7,triangles:count*35,rootOffset:.008,minY,maxY,minimumNormalY:.76,rootedBreeze:true,alphaCards:false,drawCalls:1,leafWidthMetres:[.024,.054],wind:'same northwest gust phase as foliage and sail'};return mesh;
}
