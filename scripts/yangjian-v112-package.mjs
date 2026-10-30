import fs from 'node:fs/promises';import {spawnSync} from 'node:child_process';import {createHash}from'node:crypto';
const ff='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe',fp=ff.replace('ffmpeg.exe','ffprobe.exe');
const master='motion/yangjian-v112/chapter-films/chapter-master.mp4',out='assets/yangjian-v112/video',rows=[];
for(const[i,kind]of ['orphan','training','guard','reunion'].entries()){
 const file=out+'/'+kind+'.mp4',args=['-v','error','-y','-ss',String(i*8),'-i',master,'-i','assets/yangjian-v112/audio/'+kind+'-sound.wav','-t','8','-map','0:v:0','-map','1:a:0','-c:v','libx264','-crf','19','-preset','fast','-threads','3','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',file];
 const r=spawnSync(ff,args,{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);
 const poster=spawnSync(ff,['-v','error','-y','-ss','2.5','-i',file,'-frames:v','1','-q:v','2',out+'/'+kind+'-poster.jpg'],{encoding:'utf8'});if(poster.status!==0)throw new Error(poster.stderr);
 const meta=JSON.parse(spawnSync(fp,['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}).stdout),bytes=await fs.readFile(file);rows.push({kind,file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),duration:Number(meta.format.duration),streams:meta.streams.map(s=>({codec:s.codec_name,type:s.codec_type,width:s.width,height:s.height,fps:s.avg_frame_rate,frames:s.nb_frames}))});console.log(kind,bytes.length);
}
await fs.writeFile(out+'/production.json',JSON.stringify({method:'Actual HyperFrames 0.8.158 deterministic Canvas mesh capture, single 32s render / 768 frames, then split into four 8s clips with low-level native AAC. Artwork is retained originals animated locally, not new AI video or full character animation.',master,rows},null,2));
