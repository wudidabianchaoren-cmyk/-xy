import fs from 'node:fs/promises';
import {HDRLoader} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/three/examples/jsm/loaders/HDRLoader.js';
import {FloatType} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/three/build/three.module.js';
const dir='.verify/v32-158/ue';
const meta=[];
for(const name of ['px','nx','py','ny','pz','nz']){
 const b=await fs.readFile(`${dir}/refined-${name}.hdr`),f=new HDRLoader().setDataType(FloatType).parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
 let max=0,mean=0;const raw=Buffer.alloc(f.width*f.height*3);
 for(let i=0,j=0;i<f.data.length;i+=4,j+=3){for(let k=0;k<3;k++){const x=f.data[i+k];max=Math.max(max,x);mean+=x/3;const srgb=1.055*(x/(1+x))**(1/2.4)-.055;raw[j+k]=Math.round(Math.max(0,Math.min(1,srgb))*255);}}
 await fs.writeFile(`${dir}/refined-${name}.ppm`,Buffer.concat([Buffer.from(`P6\n${f.width} ${f.height}\n255\n`),raw]));meta.push({name,width:f.width,height:f.height,max,mean:mean/(f.width*f.height)});
}
await fs.writeFile(`${dir}/refined-face-audit.json`,JSON.stringify(meta,null,2));console.log(meta);
