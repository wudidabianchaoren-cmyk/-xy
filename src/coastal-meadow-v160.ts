import * as T from 'three';

/** Patchy, broad coastal blades rooted on the exact existing island triangles. */
export function coastalMeadowV160(land:T.Object3D,clock:{value:number},cottage:number[],state:any){
 let seed=16027;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const positions:number[]=[],colours:number[]=[],indices:number[]=[];
 for(let b=0;b<5;b++){
  const a=b*2.399,rx=Math.cos(a),rz=Math.sin(a),w=.055+rand()*.028,h=.28+rand()*.13,ox=rx*.12,oz=rz*.12,start=positions.length/3,bend=.11;
  for(const[x,y,z,c]of[[-w,0,0,.55],[w,0,0,.55],[-w*.62,h*.54,bend*.4,.78],[w*.62,h*.54,bend*.4,.78],[0,h,bend,1]]){positions.push(ox+x*rx+z*rz,y,oz+x*rz-z*rx);colours.push(.18*c+.02,.24*c+.035,.075*c+.01);}
  indices.push(start,start+1,start+2,start+1,start+3,start+2,start+2,start+3,start+4);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colours,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=new T.MeshStandardMaterial({name:'V160 broad rooted coastal grass / olive and dry tips',vertexColors:true,roughness:.97,envMapIntensity:.12,side:T.DoubleSide});
 material.onBeforeCompile=s=>{s.uniforms.meadowTime=clock;s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float meadowTime;').replace('#include <begin_vertex>',`#include <begin_vertex>
 vec2 root=vec2(instanceMatrix[3].x,instanceMatrix[3].z);float bend=pow(clamp(position.y/.5,0.,1.),1.6);
 transformed.x+=sin(meadowTime*.82+root.x*.34+root.y*.18)*.035*bend;
 transformed.z+=cos(meadowTime*.58+root.y*.25)*.022*bend;`);};material.customProgramCacheKey=()=> 'v160-low-broad-grass-rooted-wind';
 const mesh=new T.InstancedMesh(geometry,material,6000);mesh.name='V160 grounded coastal meadow';mesh.receiveShadow=true;mesh.castShadow=false;
 const bounds=new T.Box3().setFromObject(land),ray=new T.Raycaster(),down=new T.Vector3(0,-1,0),normal=new T.Vector3(),nm=new T.Matrix3(),dummy=new T.Object3D();(ray as any).firstHitOnly=true;
 let count=0,minY=Infinity,maxY=-Infinity;
 for(let i=0;i<80000&&count<6000;i++){
  const x=T.MathUtils.lerp(bounds.min.x,bounds.max.x,rand()),z=T.MathUtils.lerp(bounds.min.z,bounds.max.z,rand());
  const patch=.52+.28*Math.sin(x*.29+Math.sin(z*.12))*Math.cos(z*.22)+.14*Math.sin(x*.57-z*.37);if(rand()>patch*.82)continue;
  if(Math.abs(x-cottage[0])<3.6&&Math.abs(z-cottage[2])<3.0)continue;
  ray.set(new T.Vector3(x,bounds.max.y+5,z),down);const hit=ray.intersectObject(land,true)[0];if(!hit||hit.point.y<3.4||!hit.face)continue;
  normal.copy(hit.face.normal).applyNormalMatrix(nm.getNormalMatrix(hit.object.matrixWorld));if(normal.y<.78)continue;
  const size=.85+rand()*.55;dummy.position.copy(hit.point);dummy.position.y+=.008;dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal);dummy.rotateY(rand()*Math.PI*2);dummy.scale.set(size,size,size);dummy.updateMatrix();mesh.setMatrixAt(count,dummy.matrix);mesh.setColorAt(count,new T.Color().setHSL(.18+rand()*.04,.22+rand()*.12,.46+rand()*.16));count++;minY=Math.min(minY,hit.point.y);maxY=Math.max(maxY,hit.point.y);
 }
 mesh.count=count;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.computeBoundingSphere();
 state.coastalGrass={source:'V148 low original plants plus V160 broad coastal grass on actual terrain triangles',tufts:count,blades:count*5,triangles:count*15,rootOffset:.008,minY,maxY,minimumNormalY:.78,rootedBreeze:true,denseMeadowRemoved:true,alphaCards:false,drawCalls:1};return mesh;
}
