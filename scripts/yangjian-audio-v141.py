"""Edit licensed field recordings, retaining sources and measured output peaks."""
from pathlib import Path
import subprocess,json,array,math,hashlib
P=Path(__file__).resolve().parents[1];A=P/'assets/yangjian-v141/audio';F='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe'
def run(args):subprocess.run([F,'-hide_banner','-loglevel','error','-y',*args],check=True)
def peak(name,after=0):
 data=subprocess.check_output([F,'-v','error','-i',str(A/(name+'-source.mp3')),'-ac','1','-ar','22050','-f','f32le','-']);x=array.array('f');x.frombytes(data);w=660
 chunks=[sum(t*t for t in x[i:i+w])/w for i in range(int(after*22050),len(x)-w,w)];return after+chunks.index(max(chunks))*w/22050
events={}
for name,after,seconds in [('axe',0,2.4),('rock',3,3.0),('bell',0,14)]:
 t=max(0,peak(name,after)-.055);events[name]=t
 run(['-ss',str(t),'-i',str(A/(name+'-source.mp3')),'-t',str(seconds),'-af',f'highpass=f=65,lowpass=f={6500 if name!="bell" else 4800},afade=t=in:d=0.004,afade=t=out:st={seconds-.35}:d=0.35,loudnorm=I=-23:TP=-3:LRA=9','-ar','44100','-c:a','libmp3lame','-b:a','192k',str(A/(name+'.mp3'))])
run(['-i',str(A/'forest-source.mp3'),'-af','highpass=f=140,lowpass=f=7000,loudnorm=I=-28:TP=-6:LRA=10','-ar','44100','-c:a','libmp3lame','-b:a','192k',str(A/'forest.mp3')])
run(['-i',str(A/'rock.mp3'),'-i',str(A/'axe.mp3'),'-filter_complex','[0:a]asetrate=33075,aresample=44100,lowpass=f=2200,volume=0.8[r];[1:a]volume=0.4[a];[r][a]amix=inputs=2:normalize=0,alimiter=limit=0.75[out]','-map','[out]','-c:a','libmp3lame','-b:a','192k',str(A/'stone-strike.mp3')])
checks=[]
for p in A.glob('*.mp3'):
 if 'source' in p.name:continue
 data=subprocess.check_output([F,'-v','error','-i',str(p),'-f','f32le','-']);x=array.array('f');x.frombytes(data);pk=max(abs(v) for v in x);checks.append({'file':p.name,'peakDBFS':20*math.log10(max(1e-8,pk)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(A/'production.json').write_text(json.dumps({'trimStartSeconds':events,'files':checks,'processing':'field-recording edit, gentle filtering, loudness control, real stone and wood impact layer; public HQ MP3 source quality, not original lossless WAV'},indent=2),encoding='utf-8');print(checks)
