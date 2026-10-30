import fs from 'node:fs/promises';
import {EXRLoader} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/three/examples/jsm/loaders/EXRLoader.js';
import {FloatType} from 'file:///E:/Brain-Universe-assets/V32-61/toolchain/node_modules/three/build/three.module.js';
const label='room',dir='.verify/v32-159/ue-room-final',out='assets/ue-v159';await fs.mkdir(out,{recursive:true});
const names=['px','nx','py','ny','pz','nz'],faces={},faceStats={};
for(const name of names){
 const b=await fs.readFile(`${dir}/viewport-linear-${name}.exr`);
 if(b.readUInt32LE(0)!==20000630)throw Error(`Expected actual EXR: ${name}`);
 const f=faces[name]=new EXRLoader().setDataType(FloatType).parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
 let max=0,sum=0,finite=0;
 for(let i=0;i<f.data.length;i+=4){for(let k=0;k<3;k++){const v=f.data[i+k];if(!Number.isFinite(v))throw Error(`Non-finite ${name}`);max=Math.max(max,v);sum+=v/3;finite++;}}
 faceStats[name]={width:f.width,height:f.height,max,mean:sum/(f.width*f.height),finite};
 if(f.width!==f.height)throw Error(`Non-square cube face ${name}`);
}
function readFace(name,u,v){const f=faces[name],x=Math.min(f.width-1,Math.max(0,(u*.5+.5)*(f.width-1))),y=Math.min(f.height-1,Math.max(0,(v*.5+.5)*(f.height-1))),ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,a=(iy*f.width+ix)*4,b=(iy*f.width+Math.min(ix+1,f.width-1))*4,c=(Math.min(iy+1,f.height-1)*f.width+ix)*4,d=(Math.min(iy+1,f.height-1)*f.width+Math.min(ix+1,f.width-1))*4;return [0,1,2].map(k=>(f.data[a+k]*(1-fx)+f.data[b+k]*fx)*(1-fy)+(f.data[c+k]*(1-fx)+f.data[d+k]*fx)*fy);}
function sample(x,y,z){let n,u,v;const ax=Math.abs(x),ay=Math.abs(y),az=Math.abs(z);if(ax>=ay&&ax>=az){n=x>0?'px':'nx';u=(x>0?y:-y)/ax;v=z/ax;}else if(ay>=az){n=y>0?'py':'ny';u=(y>0?-x:x)/ay;v=z/ay;}else{n=z>0?'pz':'nz';u=y/az;v=(z>0?-x:x)/az;}return readFace(n,u,v);}
const width=256,height=128,data=new Float32Array(width*height*4),preview=Buffer.alloc(width*height*3);
const srgb=x=>x<=.0031308?12.92*x:1.055*x**(1/2.4)-.055;
for(let y=0;y<height;y++){const lat=((y+.5)/height-.5)*Math.PI,threeY=Math.sin(lat),s=Math.cos(lat);for(let x=0;x<width;x++){const phi=((x+.5)/width-.5)*Math.PI*2,threeX=Math.cos(phi)*s,threeZ=Math.sin(phi)*s,rgb=sample(threeX,threeZ,threeY),i=(y*width+x)*4,j=((height-1-y)*width+x)*3;for(let k=0;k<3;k++){data[i+k]=rgb[k];preview[j+k]=Math.round(Math.min(1,Math.max(0,srgb(rgb[k])))*255);}data[i+3]=1;}}
await fs.writeFile(`${out}/${label}-viewport-linear.bin`,Buffer.from(data.buffer));
await fs.writeFile(`${dir}/${label}-environment-preview.ppm`,Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`),preview]));
// Adjacent faces must agree along all twelve physical edges. Time-varying water may differ slightly.
const edgePairs=[['px',t=>[1,t],'py',t=>[-1,t]],['px',t=>[-1,t],'ny',t=>[1,t]],['px',t=>[t,1],'pz',t=>[t,-1]],['px',t=>[t,-1],'nz',t=>[t,1]],['nx',t=>[1,t],'ny',t=>[-1,t]],['nx',t=>[-1,t],'py',t=>[1,t]],['nx',t=>[t,1],'pz',t=>[-t,1]],['nx',t=>[t,-1],'nz',t=>[-t,-1]],['py',t=>[t,1],'pz',t=>[1,t]],['py',t=>[t,-1],'nz',t=>[1,-t]],['ny',t=>[t,1],'pz',t=>[-1,-t]],['ny',t=>[t,-1],'nz',t=>[-1,t]]];
const seams=edgePairs.map(([a,at,b,bt])=>{let error=0,energy=0;for(let i=0;i<64;i++){const t=(i+.5)/32-1,aa=readFace(a,...at(t)),bb=readFace(b,...bt(t));for(let k=0;k<3;k++){error+=(aa[k]-bb[k])**2;energy+=(aa[k]**2+bb[k]**2)/2;}}return{a,b,relativeRMS:Math.sqrt(error/Math.max(energy,1e-9))};});
const metadata={width,height,format:'RGBA Float32 linear-sRGB equirectangular, row 0 south',engine:'Unreal Engine 5.8.4 native viewport',sourceMap:label==='room'?'current complete studio / isolated unsaved UE map':label==='clock'?'isolated unsaved clock study from blender/reference-architecture-v16/architecture-world.glb':'/Game/Cove/FullCoveV149',sourceMapModified:false,sourceFiles:names.map(n=>`viewport-linear-${n}.exr`),sourceCompression:'native EXR ZIP half-float; linear-sRGB chromaticities in headers',colourMeaning:'UE final viewport linear-sRGB output including exposure/postprocess; not absolute untonemapped incident radiance',probeUECentimetres:label==='room'?[10,55,135]:label==='clock'?[-15,650,280]:[0,2000,450],direction:'Three(X,Y,Z)=UE(X,Z,Y), equirect phi atan2(ThreeZ,ThreeX); EXRLoader returns bottom-up pixels',scope:`${label} environment lighting/reflection only; does not replace geometry or make browser UE runtime`,faceStats,seams};
await fs.writeFile(`${out}/${label}-viewport-source.json`,JSON.stringify(metadata,null,2));console.log(JSON.stringify(metadata));
