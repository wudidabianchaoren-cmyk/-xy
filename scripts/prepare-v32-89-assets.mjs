import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const bin='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/';
const source='C:/Users/HP/Desktop/9月初第三版AI作品集/图片/';
const folder='assets/works/after-journey/';
const manifest=JSON.parse(await fs.readFile(folder+'manifest.json','utf8'));
if(manifest.additionalSources)throw Error('New images already registered');
const entries=[
 ['西游2.jpg',['树下的静思','树影与远行']],
 ['西游3.jpg',['洞口的晨光','瀑布与尺度','光中的相逢']],
 ['西游4.jpg',['彼岸与晚霞']],
 ['西游5.jpg',['星海行舟']],
 ['西游6.jpg',['花影与水光']]
];
const sources=[];
for(const[name,titles]of entries){
 const file=source+name;
 const probe=spawnSync(bin+'ffprobe.exe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',file],{encoding:'utf8'});
 if(probe.status!==0)throw Error(probe.stderr);
 const {width,height}=JSON.parse(probe.stdout).streams[0];
 const original='original-'+name;
 const data=await fs.readFile(file);await fs.writeFile(folder+original,data);
 const sha256=createHash('sha256').update(data).digest('hex');
 sources.push({image:original,originalName:name,width,height,sha256,panels:titles.length});
 for(let i=0;i<titles.length;i++){
  const top=Math.round(height*i/titles.length),bottom=Math.round(height*(i+1)/titles.length),panelHeight=bottom-top;
  const image='additional-'+String(manifest.frames.length-12).padStart(2,'0')+'.webp';
  const args=['-hide_banner','-loglevel','error','-i',file];
  if(titles.length>1)args.push('-vf',`crop=${width}:${panelHeight}:0:${top}:exact=1`);
  args.push('-c:v','libwebp','-quality','97','-y',folder+image);
  const r=spawnSync(bin+'ffmpeg.exe',args);if(r.status!==0)throw Error(r.stderr.toString());
  manifest.frames.push({image,title:titles[i],width,height:panelHeight,sourceY:top,sourceImage:original,sourceSha256:sha256,position:'50% 50%'});
 }
}
manifest.additionalSources=sources;
manifest.gallerySelection=[4,8,10,11,...Array.from({length:8},(_,i)=>13+i)];
manifest.additionalProcessing='Five original JPEGs preserved byte-for-byte. Existing stacked panels separated at their original row boundaries, full width, no enlargement, WebP quality 97. Original four gallery views retained.';
await fs.writeFile(folder+'manifest.json',JSON.stringify(manifest,null,2));
console.log(JSON.stringify({sources,selected:manifest.gallerySelection}));
