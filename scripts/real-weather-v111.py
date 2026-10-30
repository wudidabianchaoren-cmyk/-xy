import sys,pathlib,subprocess,json,hashlib,wave
sys.path.insert(0,r'E:/Brain-Universe-assets/V32-69/python-deps');import numpy as np
R=pathlib.Path(__file__).resolve().parents[1];A=R/'assets/yangjian-v111/audio';V=R/'assets/yangjian-v111/video';V.mkdir(parents=True,exist_ok=True)
FF=r'F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe';sr=48000
src=A/'originals/rain-thunder.ogg';assert src.read_bytes()[:4]==b'OggS'
x=np.frombuffer(subprocess.check_output([FF,'-v','error','-i',str(src),'-ac','2','-ar',str(sr),'-f','f32le','-']),dtype='<f4').reshape(-1,2).copy()
mono=x.mean(axis=1);f=np.fft.rfftfreq(len(mono),1/sr);low=np.fft.irfft(np.fft.rfft(mono)*(f<400));block=sr//10
energy=np.array([np.sqrt(np.mean(low[i:i+block]**2)) for i in range(0,len(low)-block,block)])
peak=int(np.argmax(energy));onset=max(0,peak-3)/10;duration=min(5.2,len(x)/sr-onset)
th=x[int(onset*sr):int((onset+duration)*sr)].copy();th*=.47/(np.max(np.abs(th))+1e-8)
def fades(y,seconds=.08):
 n=min(int(seconds*sr),len(y)//2);y[:n]*=np.linspace(0,1,n)[:,None];y[-n:]*=np.linspace(1,0,n)[:,None];return y
fades(th,.08)
windows=[(float(np.sqrt(np.mean(mono[int(t*sr):int((t+3)*sr)]**2))),t) for t in np.arange(0,max(.1,len(x)/sr-3),.25)]
quiet,start=min(windows);grain=x[int(start*sr):int((start+3)*sr)].copy();grain*=.055/(np.sqrt(np.mean(grain**2))+1e-8)
loop=np.tile(grain,(9,1))[:sr*24];cross=int(.20*sr)
for i in range(3*sr,len(loop),3*sr):
 if i+cross<=len(loop):loop[i-cross:i]=loop[i-cross:i]*np.linspace(1,0,cross)[:,None]+grain[:cross]*np.linspace(0,1,cross)[:,None]
def write(name,y):
 dest=A/(name+'.wav')
 with wave.open(str(dest),'wb')as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(y,-.98,.98)*32767).astype('<i2').tobytes())
 subprocess.run([FF,'-y','-v','error','-i',str(dest),'-c:a','libmp3lame','-b:a','160k',str(A/(name+'.mp3'))],check=True)
write('rain-loop',loop);write('thunder',th)
opening=loop[:sr*12].copy();i=int(6.32*sr);n=min(len(th),len(opening)-i);opening[i:i+n]+=th[:n]*.62
fades(opening,.06);write('opening-weather',opening)
subprocess.run([FF,'-y','-v','error','-i',str(R/'assets/yangjian-v110/video/opening.mp4'),'-i',str(A/'opening-weather.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','160k','-t','12','-movflags','+faststart',str(V/'opening.mp4')],check=True)
subprocess.run([FF,'-y','-v','error','-ss','0.4','-i',str(V/'opening.mp4'),'-frames:v','1',str(V/'opening-poster.png')],check=True)
record={'title':'Rain and thunder','author':'Caesar','source':'https://commons.wikimedia.org/wiki/File:Rain_and_thunder.ogg','download':'https://upload.wikimedia.org/wikipedia/commons/4/42/Rain_and_thunder.ogg','license':'Public domain author dedication','sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'bytes':src.stat().st_size,'sourceDuration':len(x)/sr,'thunderExcerptStart':onset,'thunderDuration':duration,'rainQuietExcerptStart':start,'openingThunderTime':6.32,'videoStreamCopied':True,'newVisualRenderCount':0,'processing':'Quiet rainfall excerpt with softened loop joins; recorded thunder excerpt, short fades and reduced level. Opening original H264 bytes copied, only soundtrack replaced.'}
(A/'SOURCE.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(record))
