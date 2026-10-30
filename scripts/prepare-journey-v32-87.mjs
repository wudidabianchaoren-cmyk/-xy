import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const ffmpeg='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe';
const source='C:/Users/HP/Desktop/9月初第三版AI作品集/图片/西游1.jpg',dest='assets/works/after-journey';
await fs.mkdir(dest,{recursive:true});
await fs.copyFile(source,dest+'/original-storyboard.jpg');
const run=args=>{const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error',...args],{maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.stderr.toString());return r.stdout;};
// Find the original panel boundaries; no artwork is redrawn or stretched.
const rgb=run(['-i',source,'-vf','scale=144:8032','-f','rawvideo','-pix_fmt','rgb24','pipe:1']);
const boundaries=[0];
for(let n=1;n<13;n++){const estimated=Math.round(n*8032/13);let best=estimated,score=-1;for(let y=estimated-20;y<=estimated+20;y++){let difference=0;for(let x=0;x<432;x++)difference+=Math.abs(rgb[y*432+x]-rgb[(y-1)*432+x]);if(difference>score){score=difference;best=y;}}boundaries.push(best);}
boundaries.push(8032);
const labels=['冰崖之间','穿过风暴','紫云深处','光从洞口来','宫阙与身影','一瞬的凝视','云海的回声','雾中楼阁','金色中轴','山与日光','再向云端','踏云而行','远处的宫殿'];
const frames=[];
for(let i=0;i<13;i++){const name=`frame-${String(i+1).padStart(2,'0')}.webp`,height=boundaries[i+1]-boundaries[i];run(['-i',source,'-vf',`crop=1440:${height}:0:${boundaries[i]}`,'-c:v','libwebp','-quality','95','-compression_level','6','-y',dest+'/'+name]);frames.push({image:name,title:labels[i],width:1440,height,sourceY:boundaries[i]});}
run(['-i',dest+'/frame-12.webp','-vf','crop=ih:ih:(iw-ih)/2:0,scale=960:960','-c:v','libwebp','-quality','95','-y',dest+'/cover.webp']);
const original=await fs.readFile(source);await fs.writeFile(dest+'/manifest.json',JSON.stringify({title:'后西游记',english:'AFTER THE JOURNEY',sourceWidth:1440,sourceHeight:8032,sourceSha256:createHash('sha256').update(original).digest('hex'),processing:'Original panel boundaries, full-width crops, WebP quality 95. Original JPEG preserved byte-for-byte.',frames},null,2));
console.log(JSON.stringify({frames:frames.length,boundaries,sourceSha256:createHash('sha256').update(original).digest('hex')}));
