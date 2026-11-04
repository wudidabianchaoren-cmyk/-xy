import fs from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {MeshoptEncoder} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/meshoptimizer/meshopt_encoder.module.js';
import {MeshoptDecoder} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/meshoptimizer/meshopt_decoder.module.js';
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
const resource='browser-resources-v180.js',r=JSON.parse((await fs.readFile(resource,'utf8')).split('=').slice(1).join('=').replace(/;\s*$/,''));
const inputs=JSON.parse(await fs.readFile('deploy/shared-images-v186.json','utf8')).records;
const folder='assets/browser-v186/geometry-delivery';await fs.mkdir(folder,{recursive:true});const proof=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const {source}of inputs){
 const previous=r.binary[source],chunks=await Promise.all(previous.parts.map(p=>fs.readFile(p.slice(1)))),packed=Buffer.concat(chunks),original=previous.encoding==='gzip'?gunzipSync(packed):packed;
 const n=original.readUInt32LE(12),doc=JSON.parse(original.subarray(20,20+n)),bin=original.subarray(28+n);
 if(doc.extras?.losslessGeometry186){proof.push({...doc.extras.losslessGeometry186,afterBytes:packed.length});continue;}
 if(doc.extensionsUsed?.includes('EXT_meshopt_compression'))continue;
 const before=JSON.stringify({nodes:doc.nodes,meshes:doc.meshes,materials:doc.materials,accessors:doc.accessors,animations:doc.animations,skins:doc.skins});
 let size=0,encodedViews=0;const payload=[],checks=[];
 function append(data){const pad=(4-size%4)%4;if(pad){payload.push(Buffer.alloc(pad));size+=pad;}const at=size;payload.push(Buffer.from(data));size+=data.length;return at;}
 for(let index=0;index<doc.bufferViews.length;index++){
  const view=doc.bufferViews[index],data=bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength),accessors=(doc.accessors||[]).filter(a=>a.bufferView===index);
  let mode='ATTRIBUTES',stride=view.byteStride||4;
  const a=accessors.length===1?accessors[0]:null,bytes={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4},components={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16};
  if(a&&!a.byteOffset&&a.count*bytes[a.componentType]*components[a.type]===data.length){stride=bytes[a.componentType]*components[a.type];if(view.target===34963&&a.type==='SCALAR'&&[5123,5125].includes(a.componentType))mode='INDICES';}
  let encoded=null;
  if(data.length>=128&&data.length%stride===0&&(mode==='INDICES'||stride%4===0&&stride<=256)){
   const aligned=new Uint8Array(data);encoded=MeshoptEncoder.encodeGltfBuffer(aligned,data.length/stride,stride,mode);
   const decoded=new Uint8Array(data.length);MeshoptDecoder.decodeGltfBuffer(decoded,data.length/stride,stride,encoded,mode,'NONE');
   if(!Buffer.from(decoded).equals(data))throw Error('Geometry byte difference: '+source+' view '+index);
   if(gzipSync(encoded).length>=gzipSync(data).length)encoded=null;
  }
  checks.push(hash(data));
  if(encoded){const originalOffset=view.byteOffset||0;view.buffer=1;view.byteOffset=originalOffset;view.extensions={...view.extensions,EXT_meshopt_compression:{buffer:0,byteOffset:append(encoded),byteLength:encoded.length,byteStride:stride,count:data.length/stride,mode,filter:'NONE'}};encodedViews++;}
  else{view.buffer=0;view.byteOffset=append(data);}
 }
 if(!encodedViews)continue;
 const raw=Buffer.concat(payload);doc.buffers=[{byteLength:raw.length},{byteLength:bin.length,extensions:{EXT_meshopt_compression:{fallback:true}}}];
 doc.extensionsUsed=[...new Set([...(doc.extensionsUsed||[]),'EXT_meshopt_compression'])];doc.extensionsRequired=[...new Set([...(doc.extensionsRequired||[]),'EXT_meshopt_compression'])];
 if(before!==JSON.stringify({nodes:doc.nodes,meshes:doc.meshes,materials:doc.materials,accessors:doc.accessors,animations:doc.animations,skins:doc.skins}))throw Error('Semantic geometry table changed');
 const record={source,beforeBytes:packed.length,encodedViews,decodedBufferViewSHA256:checks,allDecodedViewsByteIdentical:true,vertexIndexMaterialNodeAnimationTablesUnchanged:true,quantization:false,reorder:false,simplification:false};
 doc.extras={...doc.extras,losslessGeometry186:record};let json=Buffer.from(JSON.stringify(doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);const padded=Buffer.concat([raw,Buffer.alloc((4-raw.length%4)%4)]),head=Buffer.alloc(28);head.writeUInt32LE(0x46546c67,0);head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+padded.length,8);head.writeUInt32LE(json.length,12);head.write('JSON',16);head.writeUInt32LE(padded.length,20);head.write('BIN\0',24);
 const result=Buffer.concat([head.subarray(0,20),json,head.subarray(20),padded]),compressed=gzipSync(result,{level:9});record.afterBytes=compressed.length;
 if(compressed.length>=packed.length)continue;
 const digest=hash(compressed).slice(0,24),parts=[];for(let i=0,at=0;at<compressed.length;i++,at+=4194304){const path=folder+'/'+digest+'-'+String(i).padStart(3,'0')+'.bin';await fs.writeFile(path,compressed.subarray(at,at+4194304));parts.push('/'+path);}
 r.binary[source]={encoding:'gzip',bytes:result.length,parts,sha256:hash(result)};proof.push(record);console.log(JSON.stringify({source,before:packed.length,after:compressed.length,parts:parts.length,encodedViews}));
}
const coalesced=[];
for(const {source}of inputs){const entry=r.binary[source];if(entry.parts.length<2)continue;const data=Buffer.concat(await Promise.all(entry.parts.map(p=>fs.readFile(p.slice(1))))),count=Math.ceil(data.length/4194304);if(count>=entry.parts.length)continue;const before=entry.parts.length,parts=[],digest=hash(data).slice(0,24);for(let i=0;i<count;i++){const path=folder+'/'+digest+'-'+String(i).padStart(3,'0')+'.bin';await fs.writeFile(path,data.subarray(i*4194304,(i+1)*4194304));parts.push('/'+path);}if(!Buffer.concat(await Promise.all(parts.map(p=>fs.readFile(p.slice(1))))).equals(data))throw Error('Segment bytes changed');entry.parts=parts;coalesced.push({source,beforeParts:before,afterParts:parts.length,compressedBytesUnchanged:true});}
r.homeSharedImages186=[...new Set(inputs.filter(x=>/reference-architecture-v(?:16|18|19|20|24)\//.test(x.source)).flatMap(x=>x.images))];
await fs.writeFile(resource,'window.PORTFOLIO_RESOURCES_V180='+JSON.stringify(r)+';');await fs.writeFile('deploy/lossless-geometry-v186.json',JSON.stringify({version:186,proof,coalesced,originalInputsUnchanged:true,codec:'meshoptimizer 0.22 / NONE filter / exact byte comparisons'},null,2));console.log(JSON.stringify({coalesced,earlySharedImages:r.homeSharedImages186.length}));
