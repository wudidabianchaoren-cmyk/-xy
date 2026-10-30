import json, math, wave, pathlib, sys
sys.path.insert(0,'E:/Brain-Universe-assets/V32-69/python-deps')
import numpy as np
out=pathlib.Path('assets/works/physical-universe-v101');sr=48000;duration=21
audio=np.zeros((sr*duration,2),dtype=np.float64);rng=np.random.default_rng(1011)
record=json.loads((out/'physics-record.json').read_text('utf-8'))
def pan(t): return record[min(len(record)-1,int(t*240))]['x']
def add(t,samples,gain=1):
 start=int(t*sr);length=min(len(samples),len(audio)-start)
 if length<=0:return
 x=pan(t);audio[start:start+length,0]+=samples[:length]*gain*math.cos(x*math.pi/2);audio[start:start+length,1]+=samples[:length]*gain*math.sin(x*math.pi/2)
def strike(t,base,gain):
 tt=np.arange(int(sr*.9))/sr
 sig=sum(np.sin(2*math.pi*base*ratio*tt)*np.exp(-tt*(4+i*1.8))/(i+1)**1.4 for i,ratio in enumerate([1,2.71,4.13,6.47]))
 sig*=np.minimum(tt*sr/150,1);add(t,sig,gain)
# Locate the actual first compression; audio is attached to the same input force.
contact=next(r['t'] for r in record if r['force']>.13)
tt=np.arange(int(sr*.6))/sr;add(contact,np.tanh(np.sin(2*math.pi*(64*tt-23*tt*tt))*2)*np.exp(-tt*8),.17)
strike(contact+.025,185,.095);strike(3.05,432,.075);strike(6.05,510,.07);strike(9.05,324,.06);strike(12.02,510,.075);strike(15.1,432,.06);strike(18.02,324,.065)
for t in [2.85,5.85,8.85,11.85,14.85,16.45,17.85]:
 n=int(sr*1.2);tt=np.arange(n)/sr;noise=rng.normal(0,1,n);low=np.convolve(noise,np.ones(19)/19,'same');upper=np.convolve(noise,np.ones(3)/3,'same');air=(upper-low)*np.sin(math.pi*tt/1.2)**2;add(t,air,.018)
# Restrained pulse bed, authored and synthesized locally; no stock audio.
for t in np.arange(.75,20.2,.75):
 tt=np.arange(int(sr*.32))/sr;beat=np.sin(2*math.pi*(48*tt-20*tt*tt))*np.exp(-tt*19);add(float(t),beat,.045)
tt=np.arange(sr*duration)/sr
bed=sum(np.sin(2*math.pi*f*tt+p) for f,p in [(110,.1),(164.81,.4),(220,.2)])/3
envelope=np.minimum(tt/2,1)*np.minimum((21-tt)/3,1);audio+=bed[:,None]*envelope[:,None]*.022
peak=np.max(np.abs(audio));audio*=10**(-8/20)/max(peak,1e-9)
with wave.open(str(out/'soundtrack.wav'),'wb')as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((audio*32767).astype('<i2').tobytes())
(out/'audio-record.json').write_text(json.dumps({'sampleRate':sr,'channels':2,'duration':21,'peakDBFS':-8,'firstPhysicalContact':contact,'panning':'same input spline screen x','method':'seeded bandpass air / inharmonic glass / pitch-dropping saturated sub / synthesized pulse bed'},indent=2),encoding='utf-8')
