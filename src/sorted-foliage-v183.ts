import * as T from 'three';

/** Front-to-back cutout drawing, with every original triangle and texture retained. */
export function sortedFoliage(sources:T.InstancedMesh[],camera:T.Camera,state:any){
 const total={sourceTriangles:0,retainedTriangles:0,bins:0,updates:0,geometryReduced:false};
 const sets:any[]=[],lastCamera=new T.Vector3(Infinity,0,0),matrix=new T.Matrix4(),world=new T.Matrix4(),inverse=new T.Matrix4(),local=new T.Vector3(),colour=new T.Color();
 for(const source of sources){
  const material=source.material as T.MeshStandardMaterial,index=source.geometry.index,position=source.geometry.getAttribute('position');
  if(!material.alphaMap||!index||index.count%6)continue;
  const centers=new Float32Array(index.count/6*3);for(let i=0;i<index.count;i+=6)for(let j=0;j<6;j++){const id=index.getX(i+j);for(let c=0;c<3;c++)centers[i/6*3+c]+=position.getComponent(id,c)/6;}
  source.geometry.computeBoundingSphere();source.updateWorldMatrix(true,false);const matrices=Array.from({length:source.count},(_,i)=>{source.getMatrixAt(i,matrix);return matrix.clone();});
  const colors=source.instanceColor?Array.from({length:source.count},(_,i)=>{source.getColorAt(i,colour);return colour.clone();}):null;
  const bins:T.InstancedMesh[]=[];
  for(let elevation=0;elevation<3;elevation++)for(let azimuth=0;azimuth<16;azimuth++){
   const angle=azimuth*Math.PI/8,vertical=(elevation-1)*.55,horizontal=Math.sqrt(1-vertical*vertical),dir=new T.Vector3(Math.cos(angle)*horizontal,vertical,Math.sin(angle)*horizontal);
   const order=Array.from({length:centers.length/3},(_,i)=>i),depth=(i:number)=>centers[i*3]*dir.x+centers[i*3+1]*dir.y+centers[i*3+2]*dir.z;order.sort((a,b)=>depth(b)-depth(a));
   const indices=new Uint32Array(index.count);for(let i=0;i<order.length;i++)for(let j=0;j<6;j++)indices[i*6+j]=index.getX(order[i]*6+j);
   const geometry=new T.BufferGeometry();for(const [name,attribute]of Object.entries(source.geometry.attributes))geometry.setAttribute(name,name==='nativeLeafInstance186'?new T.InstancedBufferAttribute(new Float32Array(source.count),1):attribute);geometry.setIndex(new T.BufferAttribute(indices,1));geometry.boundingSphere=source.geometry.boundingSphere!.clone();
   const mesh=new T.InstancedMesh(geometry,source.material,source.count);mesh.name='Same leaf cards / front-to-back bucket';mesh.matrixAutoUpdate=false;mesh.matrix.copy(source.matrix);mesh.castShadow=source.castShadow;mesh.receiveShadow=source.receiveShadow;mesh.count=0;mesh.visible=false;source.parent!.add(mesh);bins.push(mesh);
  }
  source.visible=false;sets.push({source,matrices,colors,bins,center:source.geometry.boundingSphere!.center.clone()});total.sourceTriangles+=index.count/3*source.count;total.retainedTriangles+=index.count/3*source.count;total.bins+=bins.length;
 }
 state.foliageOrdering=total;
 let priorVisibility=-1,priorDirection='';
 function update(force=false){
  camera.updateWorldMatrix(true,false);const eye=new T.Vector3().setFromMatrixPosition(camera.matrixWorld),visibility=sources.reduce((n,s)=>n+(s.userData.foliageRevision||0),0),direction=camera.matrixWorld.elements.slice(8,11).map(v=>Math.round(v*1000)).join('/');if(!force&&eye.distanceToSquared(lastCamera)<.25&&visibility===priorVisibility&&direction===priorDirection)return;lastCamera.copy(eye);priorVisibility=visibility;priorDirection=direction;total.updates++;
  for(const set of sets){
   const members:number[][]=Array.from({length:48},()=>[]);set.source.updateWorldMatrix(true,false);
   for(let i=0;i<set.matrices.length;i++){
    if(set.source.userData.foliageVisible?.[i]===false)continue;
    world.multiplyMatrices(set.source.matrixWorld,set.matrices[i]);inverse.copy(world).invert();local.copy(eye).applyMatrix4(inverse).sub(set.center).normalize();
    const azimuth=(Math.round(Math.atan2(local.z,local.x)*8/Math.PI)+16)%16,elevation=T.MathUtils.clamp(Math.round(local.y/.55)+1,0,2);members[elevation*16+azimuth].push(i);
   }
   members.forEach((ids,b)=>{const mesh=set.bins[b];ids.sort((a,c)=>{world.multiplyMatrices(set.source.matrixWorld,set.matrices[a]);local.setFromMatrixPosition(world);const da=local.distanceToSquared(eye);world.multiplyMatrices(set.source.matrixWorld,set.matrices[c]);return da-local.setFromMatrixPosition(world).distanceToSquared(eye);});mesh.count=ids.length;mesh.visible=ids.length>0;const stable=mesh.geometry.getAttribute('nativeLeafInstance186'),original=set.source.geometry.getAttribute('nativeLeafInstance186');ids.forEach((id,j)=>{mesh.setMatrixAt(j,set.matrices[id]);if(set.colors)mesh.setColorAt(j,set.colors[id]);if(stable)stable.setX(j,original.getX(id));});mesh.instanceMatrix.needsUpdate=true;if(stable)stable.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;if(ids.length)mesh.computeBoundingSphere();});
  }
 }
 update(true);return{update};
}
