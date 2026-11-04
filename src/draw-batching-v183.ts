import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Merge only pieces with identical parents, bind transforms and skeleton bones. */
export function mergeSkinnedParts(root:T.Object3D){
 const groups=new Map<string,T.SkinnedMesh[]>(),merged:{mesh:T.SkinnedMesh;source:T.SkinnedMesh}[]=[];
 root.updateWorldMatrix(true,true);
 root.traverseVisible(object=>{
  if(!(object instanceof T.SkinnedMesh)||Array.isArray(object.material)||object.morphTargetInfluences||object.geometry.groups.length>1)return;
  object.updateMatrix();
  const attrs=Object.entries(object.geometry.attributes).map(([k,a])=>k+':'+a.itemSize+':'+a.normalized+':'+a.array.constructor.name).sort().join('|');
  const key=[object.parent?.uuid,object.material.uuid,object.bindMode,object.bindMatrix.elements.join(','),object.matrix.elements.join(','),object.skeleton.bones.map(b=>b.uuid).join(','),attrs,!!object.geometry.index,object.castShadow,object.receiveShadow].join('/');
  const group=groups.get(key)||[];group.push(object);groups.set(key,group);
 });
 const audit={sourceParts:0,mergedParts:0,drawBatches:0,triangles:0,bindTransformsPreserved:true,skeletonsPreserved:true};
 for(const sources of groups.values()){
  audit.sourceParts+=sources.length;if(sources.length<2)continue;
  const geometry=mergeGeometries(sources.map(s=>s.geometry),false);if(!geometry)continue;
  const source=sources[0],mesh=new T.SkinnedMesh(geometry,source.material);mesh.name='Preserved rig / '+source.material.name;mesh.bindMode=source.bindMode;mesh.bind(source.skeleton,source.bindMatrix);mesh.bindMatrixInverse.copy(source.bindMatrixInverse);mesh.matrixAutoUpdate=false;mesh.matrix.copy(source.matrix);mesh.castShadow=source.castShadow;mesh.receiveShadow=source.receiveShadow;mesh.layers.mask=source.layers.mask;
  source.parent!.add(mesh);for(const original of sources)original.visible=false;merged.push({mesh,source});audit.mergedParts+=sources.length;audit.drawBatches++;audit.triangles+=(geometry.index?.count||geometry.getAttribute('position').count)/3;
 }
 return{audit,update(){for(const item of merged){item.source.updateMatrix();item.mesh.matrix.copy(item.source.matrix);item.mesh.matrixWorldNeedsUpdate=true;}}};
}

export function sceneRenderInventory(root:T.Object3D){
 const meshes:any[]=[];root.traverseVisible(o=>{if(o instanceof T.Mesh)meshes.push({name:o.name||o.parent?.name||o.type,triangles:(o.geometry.index?.count||o.geometry.getAttribute('position').count)/3*(o instanceof T.InstancedMesh?o.count:1),instances:o instanceof T.InstancedMesh?o.count:1,skinned:o instanceof T.SkinnedMesh,shadow:o.castShadow,materials:Array.isArray(o.material)?o.material.length:1});});
 return{meshes:meshes.length,triangles:meshes.reduce((n,m)=>n+m.triangles,0),largest:meshes.sort((a,b)=>b.triangles-a.triangles).slice(0,18)};
}

/** Keep source geometry and animation hierarchy; submit compatible rigid parts together. */
export function batchRigidParts(root:T.Object3D,parent:T.Object3D,renderer:T.WebGLRenderer,label:string){
 const groups=new Map<string,T.Mesh[]>(),batches:{mesh:T.BatchedMesh;sources:T.Mesh[];ids:number[]}[]=[];
 const audit={label,sourceMeshes:0,batchedMeshes:0,drawBatches:0,skinnedPreserved:0,triangles:0,multiDraw:renderer.extensions.has('WEBGL_multi_draw')};
 root.updateWorldMatrix(true,true);parent.updateWorldMatrix(true,false);
 root.traverseVisible(object=>{
  if(!(object instanceof T.Mesh)||object instanceof T.BatchedMesh||object instanceof T.InstancedMesh)return;
  if(object instanceof T.SkinnedMesh){audit.skinnedPreserved++;return;}
  if(Array.isArray(object.material)||object.morphTargetInfluences||object.customDepthMaterial||object.customDistanceMaterial)return;
  const m=object.material;if(m.transparent||m.onBeforeCompile!==T.Material.prototype.onBeforeCompile&&!m.userData.staticAtlas185)return;
  const g=object.geometry;if(g.groups.length>1)return;
  const attributes=Object.entries(g.attributes).map(([k,a])=>k+':'+a.itemSize+':'+a.normalized+':'+a.array.constructor.name).sort().join('|');
  const key=[m.uuid,attributes,!!g.index,object.castShadow,object.receiveShadow,object.layers.mask,object.renderOrder].join('/');
  const group=groups.get(key)||[];group.push(object);groups.set(key,group);audit.sourceMeshes++;
 });
 const inverse=new T.Matrix4(),matrix=new T.Matrix4();
 for(const sources of groups.values()){
  if(sources.length<3)continue;
  const unique=[...new Set(sources.map(o=>o.geometry))];
  const vertices=unique.reduce((n,g)=>n+g.getAttribute('position').count,0),indices=unique.reduce((n,g)=>n+(g.index?.count||0),0);
  const first=sources[0],mesh=new T.BatchedMesh(sources.length,vertices,indices,first.material as T.Material),geometryIds=new Map<T.BufferGeometry,number>();
  mesh.name=label+' / batched rigid parts';mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;mesh.layers.mask=first.layers.mask;mesh.renderOrder=first.renderOrder;mesh.sortObjects=false;
  for(const g of unique)geometryIds.set(g,mesh.addGeometry(g));
  const ids=sources.map(o=>{const id=mesh.addInstance(geometryIds.get(o.geometry)!);o.visible=false;o.userData.renderBatched=true;return id;});
  parent.add(mesh);batches.push({mesh,sources,ids});audit.drawBatches++;audit.batchedMeshes+=sources.length;
  audit.triangles+=sources.reduce((n,o)=>n+(o.geometry.index?.count||o.geometry.getAttribute('position').count)/3,0);
 }
 function update(){
  if(!batches.length)return;
  root.updateWorldMatrix(true,true);parent.updateWorldMatrix(true,false);inverse.copy(parent.matrixWorld).invert();
  for(const batch of batches)for(let i=0;i<batch.sources.length;i++){
   const source=batch.sources[i];let visible=true;for(let p=source.parent;p&&p!==parent;p=p.parent)if(!p.visible){visible=false;break;}
   batch.mesh.setVisibleAt(batch.ids[i],visible);matrix.multiplyMatrices(inverse,source.matrixWorld);batch.mesh.setMatrixAt(batch.ids[i],matrix);
  }
 }
 update();return{audit,update,dispose(){for(const b of batches){parent.remove(b.mesh);b.mesh.dispose();for(const s of b.sources){s.visible=true;delete s.userData.renderBatched;}}}};
}
