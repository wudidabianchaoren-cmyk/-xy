import * as THREE from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {MeshoptSimplifier} from './vendor/meshopt_simplifier.module.js';
type AttributeRecord={name:string;array:THREE.TypedArray;itemSize:number;normalized:boolean};
const scope=self as unknown as {onmessage:((event:MessageEvent)=>void)|null;postMessage:(message:unknown,transfer:Transferable[])=>void};
scope.onmessage=async event=>{
 try{
  await MeshoptSimplifier.ready;
  const source=new THREE.BufferGeometry();
  for(const a of event.data.attributes as AttributeRecord[])source.setAttribute(a.name,new THREE.BufferAttribute(a.array,a.itemSize,a.normalized));
  source.setIndex(new THREE.BufferAttribute(event.data.index,1));
  const geometry=mergeVertices(source,1e-5),p=geometry.getAttribute('position'),positions=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){positions[i*3]=p.getX(i);positions[i*3+1]=p.getY(i);positions[i*3+2]=p.getZ(i);}
  const indices=Uint32Array.from(geometry.index!.array),[reduced,error]=MeshoptSimplifier.simplify(indices,positions,3,Math.floor(indices.length*.38/3)*3,.002,['ErrorAbsolute','LockBorder']);
  const attributes=Object.entries(geometry.attributes).map(([name,a])=>({name,array:(a as THREE.BufferAttribute).array,itemSize:a.itemSize,normalized:a.normalized}));
  scope.postMessage({attributes,index:reduced,error,used:reduced.length<indices.length*.92},[reduced.buffer,...attributes.map(a=>a.array.buffer as ArrayBuffer)]);
 }catch(error){scope.postMessage({failure:String(error)},[]);}
};
