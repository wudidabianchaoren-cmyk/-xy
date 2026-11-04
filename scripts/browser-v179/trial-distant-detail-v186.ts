import {MeshoptSimplifier} from 'meshoptimizer/meshopt_simplifier.module.js';
/** Isolated feasibility tool. Never mutates source asset files or publishes. */
export async function trialDistantDetail186(T:any,objects:any){
 await MeshoptSimplifier.ready;MeshoptSimplifier.useExperimentalFeatures=true;
 const {scene,foliageMeshes,camera}=objects,selected=new Set<any>(foliageMeshes.filter((o:any)=>!o.material.alphaMap));scene.traverse((o:any)=>{if(o.isMesh&&!o.isSkinnedMesh&&/cliff|coast_rocks|scan.envelope/i.test(o.name))selected.add(o);});
 const groups=new Map<any,any>();for(const o of selected){if(!o.geometry.index||o.geometry.groups.length>1)continue;const entry=groups.get(o.geometry)||{geometry:o.geometry,objects:[]};entry.objects.push(o);groups.set(o.geometry,entry);}
 const records:any[]=[],entries:any[]=[];
 for(const entry of groups.values()){
  const g=entry.geometry,p=g.getAttribute('position'),n=g.getAttribute('normal'),uv=g.getAttribute('uv'),positions=new Float32Array(p.count*3),attributes=new Float32Array(p.count*5);for(let i=0;i<p.count;i++){positions.set([p.getX(i),p.getY(i),p.getZ(i)],i*3);attributes.set([n?.getX(i)||0,n?.getY(i)||0,n?.getZ(i)||0,uv?.getX(i)||0,uv?.getY(i)||0],i*5);}
  let scale=0,instances=0;const matrix=new T.Matrix4(),world=new T.Matrix4(),box=new T.Box3();g.computeBoundingBox();let nearest=Infinity;for(const o of entry.objects){o.updateWorldMatrix(true,false);for(let i=0;i<(o.isInstancedMesh?o.count:1);i++){if(o.isInstancedMesh){o.getMatrixAt(i,matrix);world.multiplyMatrices(o.matrixWorld,matrix);}else world.copy(o.matrixWorld);scale=Math.max(scale,world.getMaxScaleOnAxis());box.copy(g.boundingBox).applyMatrix4(world);nearest=Math.min(nearest,box.distanceToPoint(camera.position));instances++;}}
  const extent=MeshoptSimplifier.getScale(positions,3),limit=.002/Math.max(.0001,scale),[indices,error]=MeshoptSimplifier.simplifyWithAttributes(g.index.array,positions,3,attributes,5,[.02,.02,.02,.01,.01],null,Math.floor(g.index.count*.2/3)*3,limit/extent,['LockBorder']);
  const low=g.clone();low.setIndex(new T.BufferAttribute(indices,1));low.computeBoundingSphere();const record={name:entry.objects[0].name,beforeTriangles:g.index.count/3,afterTriangles:indices.length/3,instances,nearest,errorMetres:error*extent*scale,maxErrorMetres:.002,sourceGeometryPreserved:true};records.push(record);entries.push({...entry,low,nearest});
 }
 for(const entry of entries)if(entry.nearest>=25)for(const o of entry.objects)o.geometry=entry.low;
 return{records,beforeTriangles:records.reduce((n,r)=>n+r.beforeTriangles*r.instances,0),afterTriangles:records.reduce((n,r)=>n+(r.nearest>=25?r.afterTriangles:r.beforeTriangles)*r.instances,0),restore(){for(const e of entries){for(const o of e.objects)o.geometry=e.geometry;e.low.dispose();}}};
}
