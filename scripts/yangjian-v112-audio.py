import os,sys,json,hashlib,subprocess,wave
sys.path.insert(0,'E:/Brain-Universe-assets/V32-69/python-deps')
import numpy as np
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'assets/yangjian-v112/audio'
FF='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe'
SR=48000
def read(path):
    b=subprocess.check_output([FF,'-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'])
    return np.frombuffer(b,dtype='<f4').reshape(-1,2).copy()
def write(name,a,peak=.55):
    a=np.asarray(a); m=np.max(np.abs(a))
    if m>peak:a=a*(peak/m)
    if len(a)>SR//50:
        f=np.linspace(0,1,SR//100);a[:len(f)]*=f[:,None];a[-len(f):]*=f[::-1,None]
    p=OUT/(name+'.wav')
    with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
    subprocess.run([FF,'-v','error','-y','-i',str(p),'-c:a','libmp3lame','-b:a','160k',str(OUT/(name+'.mp3'))],check=True)
    return dict(file=name+'.wav',duration=len(a)/SR,peak=float(np.max(np.abs(a))))
def add(dst,src,t,gain=1,pan=0):
    start=int(t*SR); end=min(len(dst),start+len(src));s=src[:end-start]*gain
    s=s*np.array([1-max(0,pan)*.45,1+min(0,pan)*.45]);dst[start:end]+=s
steps=[read(OUT/'originals'/n) for n in ['01-footstep.ogg','02-footstep.ogg']]
creak=read(OUT/'originals/wood-creak-506660.mp3')
rows=[]
for i,s in enumerate(steps):rows.append(write('footstep-'+str(i+1),s,.5))
rows.append(write('wood-creak',creak,.36))
rain=read(ROOT/'assets/yangjian-v111/audio/rain-loop.wav')
wind=read(ROOT/'assets/yangjian-v110/audio/wind-mountain.wav')
axe=read(ROOT/'assets/yangjian-v110/audio/axe-hit.wav')
for k in ['orphan','training','guard','reunion']:
    a=np.zeros((SR*8,2),dtype=np.float32)
    if k=='orphan':add(a,rain[:len(a)],0,.16)
    if k=='training':
        add(a,wind[:len(a)],0,.22)
        for j,t in enumerate([.7,2.7,4.7,6.7]):add(a,steps[j%2],t,.12,(-1)**j*.3)
    if k=='guard':
        add(a,wind[:len(a)],0,.15);add(a,axe,3.98,.15,-.1)
    if k=='reunion':add(a,wind[:len(a)],0,.08)
    rows.append(write(k+'-sound',a,.32))
sources=[dict(files=['01-footstep.ogg','02-footstep.ogg'],author='GboxMikeFozzy',license='CC0-1.0',source='https://opengameart.org/content/footsteps-0',downloads=['https://opengameart.org/sites/default/files/01-footstep_0.ogg','https://opengameart.org/sites/default/files/02-footstep.ogg'],description='Author-recorded walking in subway; actual recorded footfalls, EQ/gain and short fade only.'),dict(files=['wood-creak-506660.mp3'],author='Rudmer_Rotteveel',license='CC0-1.0',source='https://freesound.org/people/Rudmer_Rotteveel/sounds/506660/',download='https://cdn.freesound.org/previews/506/506660_4921277-hq.mp3',description='Public high-quality preview; original WAVE not downloaded. A recorded wooden floor creak, used at low level as timber foley, not claimed as boat field recording.')]
for s in sources:
    s['sha256']={n:hashlib.sha256((OUT/'originals'/n).read_bytes()).hexdigest() for n in s['files']}
(OUT/'SOURCE.json').write_text(json.dumps(dict(sources=sources,processed=rows,reusedRain='../yangjian-v111/audio/SOURCE.json',remainingSynthetic=['axe-hit from V110','bird from V110','wind-mountain and theme from V110'],limitation='These four films animate existing illustrations locally; no full character performance or recorded orchestral music is claimed.'),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(rows))
