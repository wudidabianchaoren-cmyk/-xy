import * as THREE from 'three';

/** Keep the original close geometry. At courtyard distance collapse only subpixel tessellation. */
export async function prepareDistanceDetail(world:THREE.Group){
 const worker=new Worker('./scene-dist/home-lod-worker.js?v=32.75',{type:'module'});
 const levels:{mesh:THREE.Mesh;near:THREE.BufferGeometry;far:THREE.BufferGeometry}[]=[],audit:{mesh:string;near:number;far:number;errorMetres:number}[]=[];
 const candidates:THREE.Mesh[]=[];world.traverse(o=>{if(o instanceof THREE.Mesh&&o.visible&&!(o instanceof THREE.SkinnedMesh)&&!/marble/i.test(o.name)&&o.geometry.index&&o.geometry.index.count>15000)candidates.push(o);});
 try{for(const mesh of candidates){
  const near=mesh.geometry,attributes=Object.entries(near.attributes).map(([name,a])=>{
   if(a instanceof THREE.BufferAttribute)return{name,array:a.array.slice(),itemSize:a.itemSize,normalized:a.normalized};
   const array=new Float32Array(a.count*a.itemSize);for(let i=0;i<a.count;i++)for(let j=0;j<a.itemSize;j++)array[i*a.itemSize+j]=a.getComponent(i,j);
   return{name,array,itemSize:a.itemSize,normalized:false};
  }),index=Uint32Array.from(near.index!.array);
  const result=await new Promise<{attributes:typeof attributes;index:Uint32Array;error:number;used:boolean}>((resolve,reject)=>{
   worker.onmessage=event=>event.data.failure?reject(Error(event.data.failure)):resolve(event.data);
   worker.onerror=event=>reject(Error(event.message));
   worker.postMessage({attributes,index},[index.buffer,...attributes.map(a=>a.array.buffer as ArrayBuffer)]);
  });
  if(result.used){const g=new THREE.BufferGeometry();for(const a of result.attributes)g.setAttribute(a.name,new THREE.BufferAttribute(a.array,a.itemSize,a.normalized));g.setIndex(new THREE.BufferAttribute(result.index,1));g.groups=near.groups.map(group=>({...group}));g.boundingBox=near.boundingBox?.clone()??null;g.boundingSphere=near.boundingSphere?.clone()??null;levels.push({mesh,near,far:g});audit.push({mesh:mesh.name,near:near.index!.count/3,far:result.index.length/3,errorMetres:result.error});}
  await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
 }}finally{worker.terminate();}
 return {audit,preparationThread:'worker',update:(nearView:boolean)=>{for(const level of levels)level.mesh.geometry=nearView?level.near:level.far;}};
}
