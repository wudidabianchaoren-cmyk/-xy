import sys, pathlib, json, wave, subprocess
sys.path.insert(0,r'E:/Brain-Universe-assets/V32-69/python-deps')
import numpy as np
R=pathlib.Path(__file__).resolve().parents[1]; A=R/'assets/yangjian-v110/audio'; A.mkdir(parents=True,exist_ok=True)
SR=48000; FFM=r'F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe'; rng=np.random.default_rng(110)
def noise(d,lo,hi,slope=.7):
 n=int(SR*d); f=np.fft.rfftfreq(n,1/SR); amp=np.zeros_like(f); m=(f>=lo)&(f<=hi);amp[m]=(f[m]/lo)**(-slope)
 z=np.fft.irfft(amp*np.exp(1j*rng.uniform(0,2*np.pi,len(f))),n); return z/(np.std(z)+1e-9)
def stereo(x,d):
 y=np.roll(x,int(.023*SR));t=np.arange(len(x))/SR; pan=.11*np.sin(2*np.pi*t/d)
 return np.column_stack((x*(1+pan),y*(1-pan)))
def write(name,x,peak=.76):
 if x.ndim==1:x=stereo(x,len(x)/SR)
 x=np.tanh(x*1.2); x=x*peak/(np.max(np.abs(x))+1e-9); dest=A/(name+'.wav')
 with wave.open(str(dest),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype('<i2').tobytes())
 subprocess.run([FFM,'-y','-loglevel','error','-i',str(dest),'-c:a','libmp3lame','-b:a','192k',str(A/(name+'.mp3'))],check=True)
 return x
d=12;t=np.arange(SR*d)/SR;p=2*np.pi*t/d
water=noise(d,180,9200,.40)*(.065+.055*(.5+.5*np.sin(p*4+.5))**3)+noise(d,45,380,.4)*(.025+.04*(.5+.5*np.sin(p*4))**4)
wind=noise(d,100,3800,.65)*(.055+.04*np.sin(p*2+.8)**2)
river=write('wind-river',water+wind,.63)
rain=write('storm',noise(d,450,12000,.38)*(.11+.04*np.sin(p*4)) + wind*.8,.67)
write('wind-mountain',noise(d,90,4200,.75)*(.065+.055*np.sin(p*2)**2),.58)
def motif(d,tense=False):
 t=np.arange(SR*d)/SR; y=np.zeros(len(t)); pitches=[110,146.832,164.814,220] if not tense else [82.407,110,146.832]
 for i,hz in enumerate(pitches):
  envelope=.5+.5*np.sin(2*np.pi*t/d+i*1.4);vibrato=.006*np.sin(2*np.pi*4.4*t)
  for h in range(1,9):y+=np.sin(2*np.pi*(hz*h*t+vibrato))*envelope*.012/h**1.3
 y+=noise(d,140,5000,.8)*.012
 return y
write('music-memory',motif(24),.55);write('music-ascent',motif(24,True),.58)
d=7;t=np.arange(SR*d)/SR
rumble=noise(d,26,850,.72)*np.exp(-t/.95)*.17+noise(d,50,460,.9)*np.exp(-t/2.6)*(.3+.12*np.sin(t*7))
crack=noise(d,550,8000,.1)*np.exp(-t/.15)*.13
thunder=write('thunder',(rumble+crack)*(1-np.exp(-t*90)),.86)
d=4;t=np.arange(SR*d)/SR
hit=(noise(d,60,3400,.5)*np.exp(-t/.16)*.5 + noise(d,35,340,.2)*np.exp(-t/.8)*.28)
for f in [103,187,337,623]:hit+=np.sin(2*np.pi*f*t)*np.exp(-t/.42)*.05
write('axe-hit',hit,.86)
d=2.7;t=np.arange(int(SR*d))/SR
creak=np.zeros(len(t))
for f in [130,255,483,761]:creak+=np.sin(2*np.pi*(f*t+16*np.sin(t*7)))*np.exp(-((t-.55)/.33)**2)*.045
creak+=noise(d,220,3600,.8)*np.exp(-((t-.53)/.27)**2)*.07
write('wood-creak',creak,.58)
d=1.6;t=np.arange(int(SR*d))/SR
write('footstep',noise(d,90,4800,.6)*np.exp(-t/.09)*.3,.55)
write('bird',np.sin(2*np.pi*(2100*t+340*t*t))*np.exp(-((t-.2)/.11)**2)*.12,.35)
out=np.copy(river)*.46+rain*.15
start=int(6.32*SR);avail=min(len(thunder),len(out)-start);out[start:start+avail]+=thunder[:avail]*.43
out+=stereo(motif(12,True),12)*.23
out*=.91/(np.max(np.abs(out))+1e-9)
dest=R/'motion/yangjian-v110/opening/assets/opening-sound.wav'
with wave.open(str(dest),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype('<i2').tobytes())
metrics={'sampleRate':SR,'stereo':True,'openingPeakDb':float(20*np.log10(np.max(np.abs(out)))),'openingRmsDb':float(20*np.log10(np.sqrt(np.mean(out*out)))),'thunderStart':6.32,'source':'Original deterministic spectral/modal sound design; no paid audio generation, no reference-site audio reused','layers':['wave-phase synchronized water swell','stereo wind/rain','wood friction resonances','multi-band rolling thunder','restrained bowed harmonic motif','stone-metal impact with long lower-frequency tail']}
(A/'production.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2),encoding='utf8'); print(json.dumps(metrics))
