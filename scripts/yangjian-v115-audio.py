"""V115 real recording-only ambience preparation. Not a preview launcher."""
import sys, pathlib, subprocess, json, hashlib, wave, math
sys.path.insert(0, r'E:/Brain-Universe-assets/V32-69/python-deps')
import numpy as np

ROOT=pathlib.Path(__file__).resolve().parents[1]
A=ROOT/'assets/yangjian-v115/audio'; QA=ROOT/'.verify/v32-115/audio'
A.mkdir(parents=True,exist_ok=True); QA.mkdir(parents=True,exist_ok=True)
FF=r'F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe'
SR=48000
def decode(p, filters=None):
    cmd=[FF,'-v','error','-i',str(p),'-ac','2','-ar',str(SR)]
    if filters: cmd+=['-af',filters]
    return np.frombuffer(subprocess.check_output(cmd+['-f','f32le','-']),dtype='<f4').reshape(-1,2).copy()
def rms(x): return float(np.sqrt(np.mean(x.astype(np.float64)**2)))
def db(x):return float(20*np.log10(max(float(x),1e-12)))
def level(x,target,peak=.48):
    return x*min(target/max(rms(x),1e-9),peak/max(float(np.max(np.abs(x))),1e-9))
def circular_ola(x,starts):
    # Four 30-second actual-recording excerpts, 15-second spacing, Hann overlaps.
    # This creates a 60-second cyclic edit, not 60 seconds of unique field capture.
    n=SR*60; length=SR*30; y=np.zeros((n,2),np.float64)
    w=(.5-.5*np.cos(2*np.pi*np.arange(length)/length))[:,None]
    for i,start in enumerate(starts):
        grain=x[int(start*SR):int(start*SR)+length]
        assert len(grain)==length
        ids=(np.arange(length)+i*SR*15)%n
        y[ids]+=grain*w
    return y
def wrap66(x,start=0):
    x=x[int(start*SR):int((start+66)*SR)].copy(); assert len(x)==66*SR
    w=(.5-.5*np.cos(np.linspace(0,np.pi,SR*6)))[:,None]
    return np.concatenate([x[SR*6:SR*60],x[SR*60:SR*66]*(1-w)+x[:SR*6]*w])
def fade(x,attack=.15,release=1):
    x=x.copy(); a=min(int(SR*attack),len(x));b=min(int(SR*release),len(x))
    x[:a]*=(.5-.5*np.cos(np.linspace(0,np.pi,a)))[:,None]
    x[-b:]*=(.5+.5*np.cos(np.linspace(0,np.pi,b)))[:,None]
    return x
def stats(x,loop=False):
    mono=x.mean(axis=1); sample=mono[:min(len(mono),SR*20)]
    freq=np.fft.rfftfreq(len(sample),1/SR); ps=np.abs(np.fft.rfft(sample))**2
    d={'duration':len(x)/SR,'rmsDbfs':db(rms(x)),'samplePeakDbfs':db(np.max(np.abs(x))),
       'clippedSamples':int(np.count_nonzero(np.abs(x)>=1)),'channels':2,'sampleRate':SR,
       'energyBelow80HzFraction':float(ps[freq<80].sum()/max(ps.sum(),1e-20))}
    if loop:
        delta=np.abs(np.diff(x,axis=0));d.update({'loopBoundaryDelta':float(np.max(np.abs(x[0]-x[-1]))),
            'normalDerivativeP99':float(np.quantile(delta,.99)),
            'boundaryWithinDerivativeP99':bool(np.max(np.abs(x[0]-x[-1]))<=np.quantile(delta,.99)),
            'first1sRmsDbfs':db(rms(x[:SR])),'last1sRmsDbfs':db(rms(x[-SR:]))})
    return d
outputs={}; encoded={}
def write(name,x,loop=False):
    if loop:
        # 3 ms cosine edge shaping prevents compressed codec edge discontinuities.
        # It is a local anti-click envelope, not an audible long fade or silence pad.
        x=fade(x,.003,.003)
    x=x.astype(np.float32); assert np.max(np.abs(x))<.98
    p=A/(name+'.wav')
    with wave.open(str(p),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
        f.writeframes(np.rint(x*32767).astype('<i2').tobytes())
    for ext,opts in [('mp3',['-c:a','libmp3lame','-b:a','160k']),('ogg',['-c:a','libvorbis','-q:a','5'])]:
        dest=A/(name+'.'+ext)
        subprocess.run([FF,'-v','error','-y','-i',str(p)]+opts+[str(dest)],check=True)
        decoded=decode(dest);encoded[dest.name]=stats(decoded,loop)
    outputs[name]=stats(x,loop)
    return x

rainp=A/'originals/rain-ezwa.ogg'; windp=A/'originals/rain-wind-cori.ogg'
waterp=A/'originals/swale-water.ogg'
old=ROOT/'assets/yangjian-v111/audio/originals/rain-thunder.ogg'
rain=decode(rainp,'highpass=f=95:p=2,lowpass=f=8500:p=2,equalizer=f=2700:t=q:w=0.8:g=-2.5')
rain=write('rain-natural-60s',level(circular_ola(rain,[0,7,14,4]),.065),True)
wind=decode(windp,'highpass=f=120:p=2,lowpass=f=2300:p=2,equalizer=f=250:t=q:w=0.8:g=-3')
wind=write('wind-rain-distant-60s',level(wrap66(wind,8),.035,.26),True)
water=decode(waterp,'highpass=f=120:p=2,lowpass=f=6200:p=2,equalizer=f=2400:t=q:w=0.8:g=-2')
water=write('water-stream-60s',level(circular_ola(water,[0,.3,.7,1]),.045,.32),True)
th=decode(old,'highpass=f=45:p=2,lowpass=f=1800:p=2,equalizer=f=100:t=q:w=0.8:g=-3.5')
th=th[int(3.3*SR):int(10.6*SR)]
th=write('thunder-soft-near',fade(level(th,.075,.30),.16,2.1))
far=decode(old,'highpass=f=60:p=2,lowpass=f=850:p=2,equalizer=f=110:t=q:w=0.8:g=-4')
far=far[int(3.5*SR):int(11.3*SR)]
far=write('thunder-soft-far',fade(level(far,.042,.18),.30,2.6))
# Sample is the proposed actual master mix, no music or synthesized material.
sample=rain[:20*SR]*.64+wind[:20*SR]*.10+water[:20*SR]*.17
i=int(6.55*SR);sample[i:i+len(th)]+=th*.50
sample=write('opening-audition-20s',fade(sample*.72,.65,1.0))
sources=[
 {'file':'originals/rain-ezwa.ogg','title':'Rain','author':'ezwa','license':'Public domain author dedication',
 'page':'https://commons.wikimedia.org/wiki/File:Rain_(1).ogg','download':'https://upload.wikimedia.org/wikipedia/commons/0/0e/Rain_%281%29.ogg',
 'sourceDuration':44.9567346938776,'description':'Rain field recording; original source description Raining cats and dogs. Source recording mono; no artificial stereo widening.'},
 {'file':'originals/rain-wind-cori.ogg','title':'Rain against the Window','author':'cori / Cori Samuel','license':'Public domain author dedication',
 'page':'https://commons.wikimedia.org/wiki/File:Rain_against_the_window.ogg','download':'https://upload.wikimedia.org/wikipedia/commons/4/41/Rain_against_the_window.ogg',
 'sourceDuration':81.6587755102041,'description':'Real window-sill rain and coastal gust recording; used low and filtered. It is not an isolated outdoor wind recording.'},
 {'file':'originals/swale-water.ogg','title':'Swale flowing into a stream','author':'Ksd5 / Siddharth Patil','license':'CC0-1.0',
 'page':'https://commons.wikimedia.org/wiki/File:Swale.ogg','download':'https://upload.wikimedia.org/wikipedia/commons/8/84/Swale.ogg',
 'sourceDuration':31.0281458333333,'description':'Small swale trickling into stream; low-level water texture, not a recording of a large river or a boat.'},
 {'file':'../../yangjian-v111/audio/originals/rain-thunder.ogg','title':'Rain and thunder','author':'Caesar','license':'Public domain author dedication',
 'page':'https://commons.wikimedia.org/wiki/File:Rain_and_thunder.ogg','download':'https://upload.wikimedia.org/wikipedia/commons/4/42/Rain_and_thunder.ogg',
 'sourceDuration':18.903583333333334,'description':'Existing local original retained, real thunder excerpts with 45/60Hz highpass, 1800/850Hz lowpass, gain and fade; no synthetic sub-bass or reverb.'}]
for s in sources:
    p=(A/s['file']).resolve();s['bytes']=p.stat().st_size;s['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
manifest={'version':'32.115','sources':sources,'processing':{
 'rain':'4 real 30s excerpts with Hann overlap, 15s spacing, cyclic 60s edit; 95Hz highpass/8500Hz lowpass, -2.5dB broad 2700Hz EQ.',
 'wind':'66s real recording with 6s cosine wrap overlap to make 60s; 120Hz highpass/2300Hz lowpass, -3dB 250Hz EQ.',
 'water':'4 real 30s excerpts with Hann overlap, cyclic 60s edit; 120Hz highpass/6200Hz lowpass.',
 'notDone':['No music generation','No TheBoat audio copied','No noise-generation layer','No extra sub-bass','No hardware listening','No claim 60s is unique field capture']},
 'outputs':outputs,'encodedDecodeChecks':encoded,
 'recommendedMix':{'master':.72,'opening':{'rain':.64,'wind':.10,'water':.17,'thunder':.50,'flashSeconds':6.10,'thunderStartSeconds':6.55},
 'musicDefaultGain':0,'nativeAAC':'Mute when WebAudio master owns ambience and thunder; never run duplicate rain/thunder paths.',
 'crossfade':'Position in × position out envelope; 1.2s smoothing during continuous scroll; start source once and keep currentTime when temporarily silent. All cyclic masters use a 3ms cosine anti-click edge.',
 'thunder':'Soft-near gain .50 at opening flash +.45s; later near .32-.50/far .35-.55, 2.5s minimum retrigger guard, no synthetic low thump.'},
 'limitations':['Spectral and decoded waveform checks only; no speaker/headphone audition.','Rain and wind sources contain recording noise; no aggressive denoiser because rain itself is broadband.','MP3 browser gapless looping depends on browser; prefer Ogg or decoded AudioBuffer for exact loop scheduling.']}
files={}
for p in A.iterdir():
    if p.is_file() and p.suffix in ['.wav','.mp3','.ogg']:files[p.name]={'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
manifest['files']=files
(A/'SOURCE.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
(QA/'production-audit.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
oldmetrics={}
for p in [ROOT/'assets/yangjian-v111/audio/rain-loop.mp3',ROOT/'assets/yangjian-v110/audio/music-memory.mp3',ROOT/'assets/yangjian-v110/audio/wind-mountain.mp3',ROOT/'assets/yangjian-v111/audio/thunder.mp3']:
    oldmetrics[str(p.relative_to(ROOT))]=stats(decode(p))
(QA/'previous-audio-metrics.json').write_text(json.dumps(oldmetrics,indent=2),encoding='utf8')
print(json.dumps({'outputs':outputs,'totalBytes':sum(z['bytes'] for z in files.values()),'sourceCount':len(sources)},indent=2))
