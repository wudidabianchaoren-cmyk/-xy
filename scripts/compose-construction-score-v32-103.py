import numpy as np,wave,pathlib,json
sr=48000;duration=24;n=int(sr*duration);mix=np.zeros((n,2),np.float64);rng=np.random.default_rng(103)
def add(at,data,gain=1,pan=0):
 i=int(at*sr);m=min(len(data),n-i)
 if m>0:mix[i:i+m,0]+=data[:m]*gain*(1-pan*.28);mix[i:i+m,1]+=data[:m]*gain*(1+pan*.28)
def tone(freq,length,kind='mallet'):
 t=np.arange(int(length*sr))/sr
 if kind=='mallet':return (np.sin(2*np.pi*freq*t)+.24*np.sin(2*np.pi*freq*2.008*t)+.11*np.sin(2*np.pi*freq*3.01*t))*np.exp(-t*6)*(1-np.exp(-t*260))
 return np.sin(2*np.pi*freq*t)*np.minimum(t/.04,1)*np.minimum((length-t)/.15,1)
# Original 120 BPM score: rounded low drum, wood rim, soft hi-hat, bass and a glass-like arpeggio.
for beat in range(46):
 at=beat*.5;t=np.arange(int(.32*sr))/sr;phase=2*np.pi*(48*t+85*.023*(1-np.exp(-t/.023)));kick=np.sin(phase)*np.exp(-t*15);add(at,kick,.40 if beat%4==0 else .27)
 if beat%2:
  t=np.arange(int(.11*sr))/sr;rim=(np.sin(2*np.pi*890*t)*.6+rng.normal(0,.3,len(t)))*np.exp(-t*48);add(at,rim,.17,.35)
 if beat>=8:
  for d in [0,.25]:
   t=np.arange(int(.075*sr))/sr;noise=rng.normal(0,1,len(t));hat=np.r_[0,np.diff(noise)]*np.exp(-t*80);add(at+d,hat,.035,-.45)
 if beat%4==0:add(at,tone([65.406,58.27,51.913,65.406][(beat//8)%4],1.8,'bass'),.13)
 if beat>=2:
  freq=[261.626,311.127,391.995,523.251,391.995,311.127,233.082,311.127][beat%8];add(at+.125,tone(freq,.75),.12,(-1)**beat*.6)
# Wider sustained harmonic bed and a resolved last beat, with a clean tail rather than an abrupt cut.
for at,chord in [(0,[130.813,155.563,195.998]),(4,[116.541,155.563,195.998]),(8,[103.826,155.563,207.652]),(12,[130.813,155.563,195.998]),(16,[116.541,155.563,195.998]),(20,[130.813,155.563,195.998])]:
 t=np.arange(int(5*sr))/sr;env=np.minimum(t/1,1)*np.minimum((5-t)/1.2,1)
 for freq in chord:add(at,(np.sin(2*np.pi*freq*t)+np.sin(2*np.pi*(freq*1.002)*t))*.5*env,.022)
for freq in [261.626,391.995,523.251]:add(22,tone(freq,2),.085)
for delay,gain in [(.18,.12),(.31,.08)]:shift=int(delay*sr);mix[shift:]+=mix[:-shift][:,::-1]*gain
fade=np.minimum(np.arange(n)/(.035*sr),1)*np.minimum((n-1-np.arange(n))/(.7*sr),1);mix*=fade[:,None];mix=np.tanh(mix*1.1);mix*=.82/max(1e-8,np.abs(mix).max());out=pathlib.Path.cwd()/'assets/works/home-creation-v103';out.mkdir(parents=True,exist_ok=True)
with wave.open(str(out/'construction-score-v32-103.wav'),'wb')as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((mix*32767).astype('<i2').tobytes())
(out/'score-v32-103.json').write_text(json.dumps({'original':True,'method':'Procedurally composed and synthesized percussion, bass, harmonic pad and mallet arpeggio','bpm':120,'duration':24,'beatSeconds':.5,'cloudMusicApiUsed':False,'channels':2,'sampleRate':sr},indent=2),encoding='utf8')
print('Original beat score written',flush=True)
