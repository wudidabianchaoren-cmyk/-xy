import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire('E:/Brain-Universe-assets/V32-62/toolchain/node_modules/meshoptimizer/package.json');
const {MeshoptSimplifier}=require('meshoptimizer');await MeshoptSimplifier.ready;
const dir='E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02';
const gltf=JSON.parse(await readFile(path.join(dir,'coastal_cliff_02_2k.gltf'),'utf8'));
const binary=await readFile(path.join(dir,gltf.buffers[0].uri));
function attribute(index){
  const a=gltf.accessors[index],v=gltf.bufferViews[a.bufferView],components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
  const array=a.componentType===5126?new Float32Array(a.count*components):new Uint32Array(a.count*components);
  const view=new DataView(binary.buffer,binary.byteOffset,binary.byteLength),stride=v.byteStride||components*4,offset=(v.byteOffset||0)+(a.byteOffset||0);
  for(let i=0;i<a.count;i++)for(let j=0;j<components;j++)array[i*components+j]=a.componentType===5126?view.getFloat32(offset+i*stride+j*4,true):view.getUint32(offset+i*stride+j*4,true);
  return {array,components};
}
const p=gltf.meshes[0].primitives[0],positions=attribute(p.attributes.POSITION).array,original=attribute(p.indices).array;
const inputs=Object.fromEntries(Object.values(p.attributes).map(index=>[index,attribute(index)]));
const [indices,error]=MeshoptSimplifier.simplify(original,positions,3,Math.floor(original.length*.10/3)*3,.012,['LockBorder']);
const [remap,count]=MeshoptSimplifier.compactMesh(indices),chunks=[];
gltf.bufferViews=[];let offset=0;
for(const [name,index] of Object.entries(p.attributes)){
  const input=attributeFromOriginal(index),output=new Float32Array(count*input.components);
  for(let i=0;i<remap.length;i++)if(remap[i]!==0xffffffff)for(let k=0;k<input.components;k++)output[remap[i]*input.components+k]=input.array[i*input.components+k];
  add(index,output,34962);gltf.accessors[index].count=count;
}
add(p.indices,indices,34963);gltf.accessors[p.indices].count=indices.length;
gltf.buffers=[{uri:'coastal_cliff_02.web.bin',byteLength:offset}];
gltf.asset.generator='meshoptimizer 0.25 / retained scanned PBR and attribute seams';
await writeFile(path.join(dir,'coastal_cliff_02.web.bin'),Buffer.concat(chunks));
await writeFile(path.join(dir,'coastal_cliff_02.web.gltf'),JSON.stringify(gltf));
const audit={sourceTriangles:original.length/3,triangles:indices.length/3,vertices:count,relativeError:error,bytes:offset,sourceUntouched:true};
await writeFile(path.join(dir,'web-audit.json'),JSON.stringify(audit,null,2));console.log(JSON.stringify(audit));
function add(index,array,target){const a=gltf.accessors[index];a.bufferView=gltf.bufferViews.length;delete a.byteOffset;
  const chunk=Buffer.from(array.buffer,array.byteOffset,array.byteLength);chunks.push(chunk);gltf.bufferViews.push({buffer:0,byteOffset:offset,byteLength:chunk.length,target});offset+=chunk.length;}
function attributeFromOriginal(index){return inputs[index];}
