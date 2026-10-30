import fs from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
import {DataUtils} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/three/build/three.module.js';
const dir='assets/ue-v159',meta=JSON.parse(await fs.readFile(`${dir}/room-ue5-cubeuv.json`,'utf8'));
const native=JSON.parse(await fs.readFile('assets/directory-v127/web-environment.json','utf8')).states[0];
if(meta.width!==native.width||meta.height!==native.height)throw Error('Native and UE CubeUV sizes must match');
const a=await fs.readFile(`assets/directory-v127/${native.file}`),b=gunzipSync(await fs.readFile(`${dir}/room-ue5-cubeuv.bin.gz`));
if(a.length!==b.length)throw Error('Incomplete reflection source');
const out=Buffer.alloc(a.length),means=[0,0],read=(buffer,i)=>DataUtils.fromHalfFloat(buffer.readUInt16LE(i));
for(let i=0;i<a.length;i+=8)for(let k=0;k<3;k++){const w=[.2126,.7152,.0722][k];means[0]+=read(a,i+k*2)*w;means[1]+=read(b,i+k*2)*w;}
const gain=means[0]/means[1],weight=.25;
for(let i=0;i<a.length;i+=8){for(let k=0;k<3;k++){const x=read(a,i+k*2)*(1-weight)+read(b,i+k*2)*gain*weight;if(!Number.isFinite(x))throw Error('Non-finite reflection');out.writeUInt16LE(DataUtils.toHalfFloat(x),i+k*2);}out.writeUInt16LE(DataUtils.toHalfFloat(1),i+6);}
const compressed=gzipSync(out);await fs.writeFile(`${dir}/room-mix-ue5-cubeuv.bin.gz`,compressed);
const result={...meta,file:'room-mix-ue5-cubeuv.bin.gz',source:'75% native Cycles / room environment + 25% actual current-room UE5 viewport color reflection',nativeWeight:.75,ueWeight:weight,ueMeanGain:gain,meanBrightnessPreserved:true,compressedBytes:compressed.length,scope:'lamp-on reflections only; original lamp-off reflections and native diffuse lighting preserved',runtimePMREM:false};
await fs.writeFile(`${dir}/room-mix-ue5-cubeuv.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({width:meta.width,height:meta.height,gain,weight,compressedBytes:compressed.length}));
