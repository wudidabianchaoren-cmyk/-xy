import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
const tool='F:/codex吴翔宇/tools/realesrgan', folder='assets/works/after-journey', out=folder+'/restored-v90';
const temp='F:/codex-sr-v90';
await fs.mkdir(temp,{recursive:true});await fs.mkdir(out,{recursive:true});await fs.mkdir('.verify/v32-90',{recursive:true});
const sha=async f=>createHash('sha256').update(await fs.readFile(f)).digest('hex');
const run=(exe,args,cwd)=>new Promise((resolve,reject)=>{let output='';const child=spawn(exe,args,{cwd,windowsHide:true});child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);child.on('error',reject);child.on('exit',code=>code===0?resolve(output):reject(Error(output.slice(-2000))));});
const manifest=JSON.parse(await fs.readFile(folder+'/manifest.json','utf8')), records=[];
if(manifest.frames.some(f=>f.restoration))throw Error('Restoration already completed. Reuse existing derivatives; do not upscale them again.');
for(let i=0;i<5;i++){
 const n=i+2, input=temp+'/source-'+n+'.jpg', output=temp+'/restored-'+n+'.png';
 await fs.copyFile(folder+'/original-西游'+n+'.jpg',input);
 const log=await run(tool+'/realesrgan-ncnn-vulkan.exe',['-i',input,'-o',output,'-n','realesrgan-x4plus','-s','4','-t','128','-m',tool+'/models','-j','1:1:1'],tool);
 await fs.writeFile('.verify/v32-90/super-resolution-'+n+'.log',log);
 const restored=out+'/original-'+n+'-x4.png';await fs.copyFile(output,restored);
 for(const frame of manifest.frames.filter(f=>f.sourceImage==='original-西游'+n+'.jpg')){
  const target=out+'/'+frame.image;
  await run('F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe',['-y','-i',output,'-vf',`crop=${frame.width*4}:${frame.height*4}:0:${frame.sourceY*4},scale=2160:-1:flags=lanczos`,'-frames:v','1','-quality','97',target],process.cwd());
  frame.image='restored-v90/'+frame.image;frame.width=2160;frame.height=frame.height*2;frame.restoration='Real-ESRGAN x4plus, 4x inference, 2x delivery';
 }
 records.push({source:'original-西游'+n+'.jpg',sourceSha256:await sha(input),restored,restoredSha256:await sha(restored),inferenceScale:4,deliveryWidth:2160});
 console.log('Restored original '+n+'; composition preserved.');
}
manifest.gallerySelection=[4,8,0,2,13,14,15,16,17,18,19,20];
manifest.additionalProcessing='Original JPEGs retained. Real-ESRGAN x4plus super-resolution, 4x inference and 2x full-width web derivatives. No generative variants used in the live gallery. Super-resolution improves readability but cannot recover unverifiable original detail.';
await fs.writeFile(folder+'/manifest.json',JSON.stringify(manifest,null,2));
await fs.writeFile(out+'/processing.json',JSON.stringify({source:'https://github.com/xinntao/Real-ESRGAN',model:'realesrgan-x4plus',records,generativeVariantsUsed:false,limitations:'Learned super-resolution may infer microtexture; it is not recovery of a lost original master.'},null,2));
