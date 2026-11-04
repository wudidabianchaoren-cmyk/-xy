/** Reuse only vertices whose complete attribute bit patterns are identical.
 * Triangle order, positions, winding, UVs, normals and skin weights stay exact. */
export function trialExactIndex187(T:any,scene:any){
 const attributeIds=new WeakMap<object,number>();let sequence=0;const mappings=new Map<string,any>(),geometries=new Set<any>(),records:any[]=[];
 scene.traverse((o:any)=>{if(o.isMesh&&!o.isBatchedMesh&&!Object.keys(o.geometry.morphAttributes).length)geometries.add(o.geometry);});
 for(const g of geometries){const attributes=Object.entries(g.attributes).filter(([,a]:any)=>!a.isInstancedBufferAttribute)as any[],count=g.attributes.position.count,key=attributes.map(([name,a])=>{if(!attributeIds.has(a))attributeIds.set(a,++sequence);return name+':'+attributeIds.get(a);}).join('/');let mapping=mappings.get(key);
  if(!mapping){const readers=attributes.map(([,a])=>{const array=a.isInterleavedBufferAttribute?a.data.array:a.array,stride=a.isInterleavedBufferAttribute?a.data.stride:a.itemSize,offset=a.isInterleavedBufferAttribute?a.offset:0;const view=new DataView(array.buffer,array.byteOffset,array.byteLength),bytes=array.BYTES_PER_ELEMENT;return{size:a.itemSize,word:(i:number,c:number)=>{const at=(i*stride+offset+c)*bytes;return bytes===4?view.getUint32(at,true):bytes===2?view.getUint16(at,true):view.getUint8(at);}};});if(readers.some((a:any)=>!a.size))continue;
   mapping=new Uint32Array(count);const table=new Map<string,number[]>();let unique=0;
   for(let i=0;i<count;i++){let a=2166136261,b=2246822519;for(const r of readers)for(let c=0;c<r.size;c++){const word=r.word(i,c);a=Math.imul(a^word,16777619);b=Math.imul(b^word,3266489917);}const hash=a+'/'+b,bucket=table.get(hash)||[];let canonical=-1;for(const candidate of bucket){let equal=true;for(const r of readers){for(let c=0;c<r.size;c++)if(r.word(i,c)!==r.word(candidate,c)){equal=false;break;}if(!equal)break;}if(equal){canonical=candidate;break;}}if(canonical<0){canonical=i;bucket.push(i);table.set(hash,bucket);unique++;}mapping[i]=canonical;}
   mapping={indices:mapping,original:count,unique};mappings.set(key,mapping);
  }
  if(mapping.unique===mapping.original)continue;const old=g.index,indices=new Uint32Array(old?old.count:count);let changed=0;for(let i=0;i<indices.length;i++){const original=old?old.getX(i):i;indices[i]=mapping.indices[original];if(indices[i]!==original)changed++;}if(!changed)continue;g.setIndex(new T.BufferAttribute(indices,1));records.push({vertices:count,unique:mapping.unique,indexEntries:indices.length,changedReferences:changed,trianglesPreserved:true,attributeBitsCompared:true});
 }
 return{records,geometries:geometries.size,attributeSets:mappings.size,triangleOrderPreserved:true,sourceAssetsModified:false};
}
