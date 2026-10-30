import {Config,PixelStreaming} from '../tools/pixel-streaming-v149/node_modules/@epicgames-ps/lib-pixelstreamingfrontend-ue5.8/dist/esm/pixelstreamingfrontend.js';
const stage=document.querySelector<HTMLElement>('#ueCove')!;
const loading=document.querySelector<HTMLElement>('.odyssey-preparing')!;
const label=loading.querySelector('p')!;
const retry=document.querySelector<HTMLButtonElement>('[data-ue-retry]')!;
const night=document.querySelector<HTMLButtonElement>('[data-odyssey-night]')!;
const pause=document.querySelector<HTMLButtonElement>('[data-odyssey-pause]')!;
const reset=document.querySelector<HTMLButtonElement>('[data-odyssey-reset]')!;
const state:any={version:153,renderer:'Unreal Engine 5.8.4 / Pixel Streaming 2',ready:true,streamReady:false,paused:false,nightMix:0,frames:0,input:{dragRadiansPerPixel:.001,wheelLogPerPixel:.00018,deadzone:4,direction:'drag-right / look-right'},control:{sent:0,acknowledged:0,retries:0,failures:0}};
(window as any).odysseyState=state;
const endpoint='http://127.0.0.1:8089';
let player:PixelStreaming|null=null,active=!new URLSearchParams(location.search).has('prewarm'),sending=false,dirty=false,connecting=false,connectionEpoch=0;
let controls={theta:0,phi:0,radius:0,night:false,paused:false,reset:false};
const clientId=crypto.randomUUID();let clientSeq=0,nextSendAt=0,sendTimer:number|undefined;
let lastPos:{x:number,y:number}|null=null,dragging=false,dragMoved=false;
function status(text:string,failed=false){label.textContent=text;loading.hidden=false;retry.hidden=!failed;}
async function send(){
  sendTimer=undefined;
  if(sending||!dirty||!active)return;
  if(performance.now()<nextSendAt){scheduleSend(nextSendAt-performance.now());return;}
  sending=true;dirty=false;
  const payload={...controls,clientId,clientSeq};controls.reset=false;state.control.sent++;
  let acknowledged=false;
  for(let attempt=0;attempt<4&&active;attempt++){
    try{
      const response=await fetch(endpoint+'/control',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(3500)});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.code||`Control request failed: ${response.status}`);
      state.control.acknowledged=payload.clientSeq;state.control.serverSeq=result.seq;state.controlUnavailable=false;acknowledged=true;break;
    }catch(error){state.control.lastError=String(error);state.control.retries++;if(attempt<3)await new Promise(resolve=>setTimeout(resolve,80*2**attempt));}
  }
  if(!acknowledged){state.controlUnavailable=true;state.control.failures++;controls.reset ||=payload.reset;dirty=true;}
  nextSendAt=performance.now()+(acknowledged?20:800);sending=false;if(dirty)scheduleSend(nextSendAt-performance.now());
}
function scheduleSend(delay=0){if(sendTimer!==undefined)return;sendTimer=window.setTimeout(send,Math.max(0,delay));}
function update(){clientSeq++;dirty=true;scheduleSend();}
async function connect(){
  if(!active||player||connecting)return;
  connecting=true;const epoch=connectionEpoch;
  status('正在走入暮光海湾');
  try{
    const health=await fetch(endpoint+'/health',{signal:AbortSignal.timeout(4000)}).then(r=>r.json());state.health=health;
    if(!active||epoch!==connectionEpoch||player)return;
    if(!health.streamers?.length){status('海湾尚未连接，当前显示静帧',true);return;}
    const config=new Config({useUrlParams:false,initialSettings:{ss:'ws://127.0.0.1:8089',AutoConnect:false,AutoPlayVideo:true,StartVideoMuted:true,WaitForStreamer:true,HoveringMouse:true,MouseInput:false,KeyboardInput:false,TouchInput:false,GamepadInput:false,MatchViewportRes:false,WebRTCFPS:24,WebRTCMinBitrate:8000,WebRTCMaxBitrate:20000}});
    player=new PixelStreaming(config,{videoElementParent:stage});
    player.addEventListener('videoInitialized',()=>{state.connectedAt=performance.now();player?.play();});
    player.addEventListener('playStream',()=>{const first=!state.streamReady;state.streamReady=true;loading.hidden=true;retry.hidden=true;document.body.classList.add('ue-cove-live');night.disabled=false;stage.querySelectorAll('video').forEach(v=>{v.onclick=null;});if(first){controls.reset=true;update();for(const delay of [250,1000,2500])setTimeout(()=>{if(active&&player)requestResolution();},delay);}});
    player.addEventListener('webRtcDisconnected',()=>{state.streamReady=false;document.body.classList.remove('ue-cove-live');if(active)status('连接已暂停，点击继续看海',true);});
    player.addEventListener('statsReceived',(event:any)=>{state.stats=event.data.aggregatedStats;});
    player.connect();
    setTimeout(()=>{if(active&&!state.streamReady)status('海湾仍在连接，点击重试',true);},15000);
  }catch(e){state.connectionError=String(e);if(active)status('海湾尚未连接，当前显示静帧',true);}finally{connecting=false;}
}
function requestResolution(width=1920,height=1080){player?.emitCommand({'Resolution.Width':width,'Resolution.Height':height});state.requestedResolution=[width,height];}
state.requestResolution=requestResolution;
function suspend(){active=false;connectionEpoch++;player?.disconnect();player=null;stage.replaceChildren();state.streamReady=false;document.body.classList.remove('ue-cove-live');}
retry.addEventListener('click',()=>{player?.disconnect();player=null;stage.replaceChildren();void connect();});
stage.addEventListener('pointerdown',e=>{if(e.button!==0||!state.streamReady)return;dragging=true;dragMoved=false;lastPos={x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');});
stage.addEventListener('pointermove',e=>{if(!dragging||!lastPos)return;if(!dragMoved){if(Math.hypot(e.clientX-lastPos.x,e.clientY-lastPos.y)<4)return;dragMoved=true;lastPos={x:e.clientX,y:e.clientY};return;}controls.theta+=(e.clientX-lastPos.x)*.001;controls.phi=Math.max(-.75,Math.min(.7,controls.phi+(e.clientY-lastPos.y)*.00085));lastPos={x:e.clientX,y:e.clientY};state.input.lastTargets={...controls};update();});
function release(){dragging=false;dragMoved=false;lastPos=null;stage.classList.remove('is-dragging');}
stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
stage.addEventListener('wheel',e=>{if(!state.streamReady)return;e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?600:1);controls.radius=Math.max(-1.7,Math.min(1.0,controls.radius+Math.max(-.024,Math.min(.024,delta*.00018))));state.input.lastTargets={...controls};state.zoomProgress=Math.min(1,Math.max(0,-controls.radius/1.7));update();},{passive:false});
night.addEventListener('click',()=>{controls.night=!controls.night;night.setAttribute('aria-pressed',String(controls.night));night.textContent=controls.night?'切换白天':'切换夜晚';state.nightMix=controls.night?1:0;update();});
pause.addEventListener('click',()=>{controls.paused=!controls.paused;state.paused=controls.paused;pause.setAttribute('aria-pressed',String(controls.paused));pause.setAttribute('aria-label',controls.paused?'继续场景':'暂停场景');stage.querySelectorAll('video').forEach(v=>{if(controls.paused)v.pause();else void v.play();});update();});
reset.addEventListener('click',()=>{controls.theta=controls.phi=controls.radius=0;controls.reset=true;update();});
window.addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data?.type==='portfolio:surface-suspend')suspend();if(e.data?.type==='portfolio:child-return'){active=true;void connect();}});
window.addEventListener('pagehide',suspend);
state.reset=()=>reset.click();state.setNight=(value:boolean)=>{if(value!==controls.night)night.click();};
state.inspect=()=>fetch(endpoint+'/health').then(r=>r.json());
if(active)void connect();
