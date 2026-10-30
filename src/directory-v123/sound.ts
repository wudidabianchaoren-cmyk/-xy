type Action='paper'|'lamp'|'remote'|'book'|'tape';
export function createRoomSound(){
 const status={enabled:false};let context:AudioContext|null=null,bus:GainNode|null=null,rainGain:GainNode|null=null,active=true,destroyed=false;
 let rain:AudioBufferSourceNode|null=null,rainBuffer:AudioBuffer|null=null,wood:AudioBuffer|null=null,loading:Promise<void>|null=null;
 const rainURL='./assets/yangjian-v115/audio/rain-natural-60s.mp3';
 async function getBuffer(path:string){const response=await fetch(path);if(!response.ok)throw Error(`Room sound ${response.status}`);return await context!.decodeAudioData(await response.arrayBuffer());}
 function gain(){if(!context||!bus)return;bus.gain.cancelScheduledValues(context.currentTime);bus.gain.setTargetAtTime(status.enabled&&active?.30:0,context.currentTime,.25);}
 async function enable(){
  if(destroyed)return;
  if(!context){const AC=window.AudioContext||(window as any).webkitAudioContext;if(!AC)return;context=new AC({latencyHint:'interactive'});const compressor=context!.createDynamicsCompressor();compressor.threshold.value=-18;compressor.ratio.value=2;compressor.knee.value=16;bus=context!.createGain();bus.gain.value=0;bus.connect(compressor);compressor.connect(context!.destination);rainGain=context!.createGain();rainGain.gain.value=.19;
   const low=context!.createBiquadFilter();low.type='lowpass';low.frequency.value=2500;rainGain.connect(low);low.connect(bus);
   loading=Promise.allSettled([getBuffer(rainURL).then(buffer=>{rainBuffer=buffer;if(destroyed||!context)return;rain=context.createBufferSource();rain.buffer=buffer;rain.loop=true;rain.connect(rainGain!);rain.start();}),getBuffer('./assets/yangjian-v112/audio/wood-creak.mp3').then(buffer=>{wood=buffer;})]).then(()=>{});
  }
  await context!.resume();status.enabled=true;gain();void loading;
 }
 async function toggle(){if(status.enabled){status.enabled=false;gain();return false;}await enable();return status.enabled;}
 function pan(source:AudioNode,x:number,volume:number,duration:number){if(!context||!bus)return;const g=context.createGain(),p=context.createStereoPanner();p.pan.value=Math.max(-.85,Math.min(.85,x));g.gain.setValueAtTime(volume,context.currentTime);g.gain.exponentialRampToValueAtTime(.0001,context.currentTime+duration);source.connect(g);g.connect(p);p.connect(bus);setTimeout(()=>{g.disconnect();p.disconnect();},duration*1000+100);}
 function action(kind:Action,x=0){if(!context||!status.enabled||!active||destroyed)return;
  if((kind==='paper'||kind==='book'||kind==='tape')&&wood){const source=context.createBufferSource();source.buffer=wood;source.playbackRate.value=kind==='paper'?1.4:kind==='book'?1.15:.95;pan(source,x,kind==='paper'?.13:.18,.40);source.start(0,kind==='paper'?.16:.04,.43);return;}
  // A restrained synthesized switch transient. The rain and wood above are existing recordings.
  const duration=kind==='paper'?.11:kind==='book'?.10:.035,buffer=context.createBuffer(1,Math.ceil(duration*context.sampleRate),context.sampleRate),data=buffer.getChannelData(0);
  let seed=271;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=((seed/4294967296)*2-1)*Math.exp(-i/(context.sampleRate*.012));}
  const source=context.createBufferSource();source.buffer=buffer;const filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=kind==='lamp'?1250:kind==='remote'?2100:700;filter.Q.value=.7;source.connect(filter);pan(filter,x,.12,duration+.025);source.start();source.onended=()=>filter.disconnect();
 }
 function view(mode:string){if(!context||!rainGain)return;const near=mode==='window';rainGain.gain.setTargetAtTime(near?.29:.19,context.currentTime,.65);}
 function setActive(on:boolean){active=on;gain();}
 function destroy(){destroyed=true;status.enabled=false;rain?.stop();rain?.disconnect();bus?.disconnect();void context?.close();rainBuffer=null;wood=null;}
 return{enable,toggle,action,view,setActive,destroy,status};
}
