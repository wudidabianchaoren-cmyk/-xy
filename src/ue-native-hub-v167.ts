import './ue-socket-v169';
import {Config,PixelStreaming} from '../tools/pixel-streaming-v149/node_modules/@epicgames-ps/lib-pixelstreamingfrontend-ue5.8/dist/esm/pixelstreamingfrontend.js';
type View={position:number[];target:number[];fov:number;roomTime?:number;roomWork?:number;roomTV?:boolean;roomProps?:any[];night?:boolean;paused?:boolean;lamp?:boolean;enabled?:boolean;homeParts?:any[];homeKey?:number[];homeWest?:boolean;directCamera?:boolean};
type Surface=any;
const rootWindow=(()=>{try{return window.top as any}catch{return window as any}})();

/** One persistent decoder per portfolio tab, shared by the courtyard, room and embedded cove. */
function hub(){
 if(rootWindow.__portfolioNativeHubV167)return rootWindow.__portfolioNativeHubV167;
 const doc=rootWindow.document,endpoint=rootWindow.PORTFOLIO_STREAM_URL||(/^(127\.0\.0\.1|localhost)$/.test(rootWindow.location.hostname)?'http://127.0.0.1:8089':new URL('/ue',rootWindow.location.href).href.replace(/\/$/,''));
 const transport=doc.createElement('div');transport.className='ue-native-transport-v167';Object.assign(transport.style,{position:'absolute',inset:'0',pointerEvents:'none',overflow:'hidden'});
 const config=new Config({useUrlParams:false,initialSettings:{ss:endpoint.replace(/^http/,'ws'),AutoConnect:false,AutoPlayVideo:true,StartVideoMuted:true,WaitForStreamer:true,PreferredCodec:new URLSearchParams(rootWindow.location.search).get('nativeCodec')||'VP9',MouseInput:false,KeyboardInput:false,TouchInput:false,GamepadInput:false,MatchViewportRes:false,WebRTCFPS:45,WebRTCMinBitrate:12000,WebRTCMaxBitrate:40000}});
 const player=new PixelStreaming(config,{videoElementParent:transport});
 const h:any={apiVersion:171,transport,player,endpoint,surfaces:new Set<Surface>(),owner:null,connected:false,connecting:false,retryAt:0,sending:false,healthPending:false,seq:0,id:crypto.randomUUID(),last:'',sentAt:0,frames:0,lastFrameAt:0,lastHealth:0,native:null,claim:true,connectingAt:0,connections:0};
 rootWindow.__portfolioNativeHubV167=h;
 let watched:HTMLVideoElement|null=null,frameCallback=0;
 function watch(force=false){for(const [key,value]of [['position','absolute'],['inset','0'],['width','100%'],['height','100%']])transport.style.setProperty(key,value,'important');const video=transport.querySelector('video') as HTMLVideoElement|null;if(!video||video===watched&&!force)return;if(watched&&frameCallback)watched.cancelVideoFrameCallback(frameCallback);watched=video;Object.assign(video.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'});video.muted=true;
  const frame=()=>{h.frames++;h.lastFrameAt=performance.now();const owner=h.owner;if(owner){owner.status.frames=h.frames;owner.status.resolution=[video.videoWidth,video.videoHeight];owner.state.nativeFramePresented?.(h.native,h.frames);if(!owner.status.ready&&h.serviceReady&&(owner.scene!=='room'||h.calendarReady&&h.frames>=(h.calendarFrame||0)+4&&performance.now()-(h.calendarAt||0)>100)&&owner.ackAt&&h.frames>=owner.ackFrame+(owner.warmed?4:8)&&performance.now()-owner.ackAt>(owner.warmed?160:650)&&h.native?.scene===owner.scene){owner.warmed=true;owner.status.prewarmed=true;owner.status.ready=true;owner.status.engine=h.native.engine;owner.status.readyAt=performance.now();owner.cover.hidden=true;owner.cover.style.display='none';owner.layer.setAttribute('aria-busy','false');for(const input of owner.inputs||[])input.canvas.style.pointerEvents=input.events;owner.state.nativeSurfaceChanged?.(true);}}frameCallback=video.requestVideoFrameCallback(frame);};frameCallback=video.requestVideoFrameCallback(frame);
 }
 const hide=(s:Surface)=>{if(!s)return;if(s.status.ready&&performance.now()-s.status.readyAt>1200&&h.native?.scene===s.scene){const v=transport.querySelector('video') as HTMLVideoElement|null;if(v?.videoWidth){const c=doc.createElement('canvas');c.width=1280;c.height=720;c.getContext('2d')!.drawImage(v,0,0,1280,720);(s.poster||s.cover).style.backgroundImage='url("'+c.toDataURL('image/jpeg',.9)+'")';s.caption.hidden=true;}}s.status.ready=false;s.ackAt=0;s.cover.hidden=false;s.cover.style.display='';s.caption.hidden=false;s.layer.setAttribute('aria-busy','true');for(const input of s.inputs||[])input.canvas.style.pointerEvents='none';s.state.nativeSurfaceChanged?.(false);};
 function choose(){
  const candidates=[...h.surfaces].filter((s:any)=>s.alive&&s.visible());
  const browserHome=String(rootWindow.homeClockState?.renderer||'').startsWith('Three.js');
  const warming=browserHome&&!!rootWindow.homeClockState?.ready&&h.focused&&!rootWindow.document.hidden?[...h.surfaces].filter((s:any)=>s.alive&&s.scene!=='home'):[];
  const next=candidates.at(-1)||warming.filter((s:any)=>!s.warmed).at(-1)||warming.find((s:any)=>s.scene==='room')||null;if(next===h.owner)return;
  h.controlAbort?.abort();const previous=h.owner;hide(previous);h.owner=next;h.last='';h.claim=true;h.native=null;
  if(next){next.layer.prepend(transport);watch(true);hide(next);next.firstSeq=0;next.status.switchedAt=performance.now();void transport.querySelector('video')?.play().catch(()=>{});h.resize?.();}
  else if(previous)void fetch(endpoint+'/control',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:h.id,clientSeq:++h.seq,active:false})}).catch(()=>{});
 }
 async function ensureNative(refresh=false){
  if(h.ensurePending||h.destroyed||(!refresh&&performance.now()-(h.lastEnsure||-Infinity)<4000))return;
  h.ensurePending=true;h.lastEnsure=performance.now();
  try{const response=await fetch(new URL('/_runtime/'+(refresh?'refresh':'ensure'),rootWindow.location.origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scene:h.owner?.scene||'room'}),signal:AbortSignal.timeout(3500)});if(!response.ok)throw Error('Runtime startup unavailable');h.runtime=await response.json();for(const s of h.surfaces){s.status.starting=!!h.runtime.starting;s.status.serviceReady=!!h.runtime.ready;}}
  catch(error){h.lastEnsureError=String(error);for(const s of h.surfaces){s.status.serviceReady=false;s.status.startupError=String(error);if(!s.status.ready)s.caption.textContent='实时画面尚未连接，请重试';}}
  finally{h.ensurePending=false;}
 }
 h.ensureNative=ensureNative;
 async function health(){if(h.healthPending||!h.owner||!h.connected)return;h.healthPending=true;
  try{const response=await fetch(endpoint+'/health',{signal:AbortSignal.timeout(1400)}).then(r=>r.json());h.lastHealth=performance.now();const s=h.owner;
   h.serviceReady=!!(response.streamers?.length&&response.native?.phase==='native viewport live'&&Date.now()/1000-response.native.heartbeat<6);const calendarReady=!!response.runtime?.calendarReady;if(calendarReady&&!h.calendarReady){h.calendarFrame=h.frames;h.calendarAt=performance.now();}h.calendarReady=calendarReady;
   h.native=h.serviceReady?response.native:null;
   if(!h.serviceReady){if(s){hide(s);s.status.serviceReady=false;}void ensureNative();return;}
   if(s){s.status.serviceReady=true;s.status.calendarDate=response.runtime?.calendarDate;s.status.calendarReady=h.calendarReady;}
   if(s&&response.native?.scene===s.scene&&response.native?.seq>=s.firstSeq&&s.firstSeq&&transport.querySelector('video')?.readyState>=2){s.status.presentedCamera=response.native.camera;s.status.presentedTarget=response.native.target;s.status.appliedSeq=response.native.seq;if(!s.ackAt){s.ackAt=performance.now();s.ackFrame=h.frames;}}
   if(s&&response.native?.scene&&response.native.scene!==s.scene){hide(s);h.last='';}
  }catch(e){if(h.owner)h.owner.status.lastTransportError=String(e);}finally{h.healthPending=false;}
 }
 async function update(){if(h.destroyed)return;h.focused=rootWindow.document.hasFocus();choose();const s=h.owner;if(!h.serviceReady&&!rootWindow.document.hidden)void ensureNative();if(!s)return;
  if(!h.connected){if(performance.now()>h.retryAt){h.connecting=true;h.connectingAt=performance.now();h.retryAt=performance.now()+12000;h.connections++;player.connect();}return;}
  watch();if(h.sending)return;
  const v=s.camera(),round=(p:number[])=>p.map(n=>Math.round(n*100000)/100000);
  const data={scene:s.scene,camera:round(v.position),target:round(v.target),fov:v.fov,verticalFov:true,directCamera:v.directCamera??false,roomTime:v.roomTime===undefined?undefined:Math.round(v.roomTime*2)/2,roomWork:v.roomWork,roomTV:v.roomTV,roomProps:v.roomProps,night:v.night??false,paused:v.paused??(!s.visible()&&!!s.warmed&&performance.now()-s.status.readyAt>1200),lamp:v.lamp??true,homeParts:v.homeParts??[],homeKey:v.homeKey,homeWest:v.homeWest,active:true,claim:h.claim,clientId:h.id,clientSeq:++h.seq};
  h.outputPaused=data.paused;const key=JSON.stringify({...data,clientSeq:0,claim:false});if(key===h.last&&performance.now()-h.sentAt<1000){if(performance.now()-h.lastHealth>(v.directCamera||s.status.appliedSeq<s.status.lastSeq?22:s.status.ready?180:80))void health();return;}
  h.sending=true;const controlAbort=new AbortController();h.controlAbort=controlAbort;
  try{const r=await fetch(endpoint+'/control',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.any([AbortSignal.timeout(1600),controlAbort.signal])}).then(r=>r.json());if(!r.ok)throw Error(r.code||'Camera update failed');if(s!==h.owner)return;if(r.owned===false){s.status.blocked=true;hide(s);s.caption.textContent='点击画面继续';return;}
   if(s.status.lastTransportError)s.status.lastRecoveredAt=performance.now();s.status.lastTransportError='';s.status.blocked=false;s.status.connected=true;s.status.sent++;s.status.lastSeq=r.seq;if(!s.firstSeq)s.firstSeq=r.seq;h.claim=false;h.last=key;h.sentAt=performance.now();
   if(performance.now()-h.lastHealth>(v.directCamera?22:50))void health();
   const video=transport.querySelector('video');if(video&&(!data.paused||!s.status.ready)&&video.paused)void video.play().catch(()=>{});
   // The engine freezes its scene clock; keep the WebRTC decoder consuming frames.
  }catch(e){if(s!==h.owner||controlAbort.signal.aborted)return;s.status.lastTransportError=String(e);s.status.lastTransportFailureAt=performance.now();s.status.transientRetries++;if(!s.status.ready&&performance.now()-s.status.switchedAt>6000)s.caption.textContent='正在连接实时场景 · 点击重试';}finally{if(h.controlAbort===controlAbort)h.controlAbort=null;h.sending=false;}
 }
 h.update=update;h.health=health;h.hide=hide;
 const reduceReceiverDelay=()=>{try{const pc=(player as any)._webRtcController?.peerConnectionController?.peerConnection as RTCPeerConnection|undefined;let count=0;for(const receiver of pc?.getReceivers()??[]){if(receiver.track?.kind!=='video')continue;const r=receiver as any;const local=/^(127\.0\.0\.1|localhost)$/.test(new URL(endpoint).hostname);if('jitterBufferTarget'in r){r.jitterBufferTarget=local?0:30;count++;}if('playoutDelayHint'in r){r.playoutDelayHint=local?0:.03;count++;}}h.receiverPolicy={propertiesSet:count,localTargetMs:0};}catch(e){h.receiverPolicyError=String(e);}};
 player.addEventListener('videoInitialized',()=>{reduceReceiverDelay();watch();player.play();});
 const resize=()=>{if(h.destroyed||!h.owner||!h.channelOpen)return;const width=Math.max(1280,Math.min(1920,Math.ceil(h.owner.host.clientWidth*rootWindow.devicePixelRatio/32)*32)),height=width*9/16,video=transport.querySelector('video');h.owner.status.displayResolution=[width,height];if(video?.videoWidth===width&&video?.videoHeight===height)return;player.emitCommand({'Resolution.Width':width,'Resolution.Height':height});};h.resize=resize;
 player.addEventListener('dataChannelOpen',()=>{h.channelOpen=true;resize();setTimeout(resize,500);});
 const connected=()=>{if(h.destroyed)return;h.connected=true;h.connecting=false;h.connectedAt=performance.now();h.retryAt=0;reduceReceiverDelay();watch();void update();};
 player.addEventListener('playStream',connected);
 player.addEventListener('webRtcConnected',connected);
 player.addEventListener('webRtcDisconnected',()=>{h.connected=h.connecting=h.channelOpen=h.serviceReady=false;h.retryAt=performance.now()+1200;h.claim=true;hide(h.owner);h.last='';});
 h.focused=rootWindow.document.hasFocus();rootWindow.addEventListener('focus',()=>{h.focused=rootWindow.document.hasFocus();h.claim=true;void update();});rootWindow.addEventListener('blur',()=>{h.focused=rootWindow.document.hasFocus();void update();});
 rootWindow.addEventListener('pointerdown',()=>{if(h.owner?.status.blocked){h.claim=true;h.last='';}void update();},true);
 const recover=()=>{if(h.destroyed)return;void ensureNative(true);hide(h.owner);h.connected=h.connecting=h.serviceReady=false;h.retryAt=performance.now()+400;h.claim=true;h.last='';player.disconnect();};h.recover=recover;
 let lastHealthTick=performance.now();const checkHealth=()=>{const now=performance.now(),browserStalled=now-lastHealthTick>2000;lastHealthTick=now;if(!h.owner||h.destroyed)return;const v=h.owner.camera();if(browserStalled){h.lastFrameAt=now;return;}if(!h.owner.status.ready||now-h.lastFrameAt>1600)void health();if(h.connected&&h.owner.visible()&&!h.outputPaused&&!v.paused&&now-Math.max(h.lastFrameAt,h.connectedAt||now)>6000){h.owner.status.stallRecoveries=(h.owner.status.stallRecoveries||0)+1;recover();}};
 const startTimers=()=>{clearInterval(h.timer);clearInterval(h.healthTimer);h.timer=setInterval(update,22);h.healthTimer=setInterval(checkHealth,200);};startTimers();
 rootWindow.addEventListener('pagehide',()=>{h.destroyed=true;clearInterval(h.timer);clearInterval(h.healthTimer);h.controlAbort?.abort();hide(h.owner);h.owner=null;h.connected=h.serviceReady=false;if(watched&&frameCallback)watched.cancelVideoFrameCallback(frameCallback);frameCallback=0;navigator.sendBeacon(endpoint+'/control',new Blob([JSON.stringify({clientId:h.id,clientSeq:++h.seq,active:false})],{type:'text/plain'}));player.disconnect();});
 rootWindow.addEventListener('pageshow',(event:PageTransitionEvent)=>{if(!event.persisted&&!h.destroyed)return;h.destroyed=false;h.connected=h.connecting=h.serviceReady=false;h.claim=true;h.last='';h.retryAt=0;h.lastFrameAt=performance.now();watch(true);startTimers();void ensureNative();void update();});

 return h;
}

export async function nativeUESurface(host:HTMLElement,scene:'myth'|'room'|'home',camera:()=>View,state:any){
 const h=hub(),layer=document.createElement('div');layer.className='ue-native-surface-v162';Object.assign(layer.style,{position:'absolute',inset:'0',pointerEvents:'none',zIndex:'0',background:'#171a18',overflow:'hidden'});host.prepend(layer);
 const cover=document.createElement('div');cover.className='ue-native-cover-v171';Object.assign(cover.style,{position:'absolute',inset:'0',zIndex:'25',pointerEvents:'auto',overflow:'hidden',background:'#171a18'});layer.append(cover);layer.setAttribute('aria-busy','true');
 const poster=document.createElement('div');poster.setAttribute('aria-hidden','true');Object.assign(poster.style,{position:'absolute',inset:'-12px',filter:'blur(9px) brightness(.5)',background:`#171a18 url("./assets/native-v171/${scene}.jpg?v=32.171") center / cover no-repeat`});cover.append(poster);
 const panel=document.createElement('div');Object.assign(panel.style,{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',display:'grid',gap:'18px',justifyItems:'center',textAlign:'center',color:'#eee7da',font:'14px/1.8 sans-serif'});cover.append(panel);
 const caption=document.createElement('span');caption.className='ue-native-caption-v171';caption.setAttribute('role','status');caption.textContent=scene==='myth'?'正在连接海湾…':scene==='room'?'正在连接工作台…':'正在连接庭院…';panel.append(caption);
 const retry=document.createElement('button');retry.type='button';retry.textContent='重新连接';Object.assign(retry.style,{padding:'9px 18px',background:'#d3c5a8',color:'#202821',border:'0',borderRadius:'5px',cursor:'pointer',font:'13px/1.5 sans-serif',pointerEvents:'auto'});retry.addEventListener('click',()=>h.recover());panel.append(retry);
 const inputs=Array.from(host.querySelectorAll<HTMLElement>('canvas,.directory-scene-input')).map(canvas=>({canvas,events:canvas.style.pointerEvents}));for(const input of inputs)input.canvas.style.pointerEvents='none';
 const status=state.nativeUE={version:171,ready:false,scene,wholeViewport:true,blocked:false,transientRetries:0,lastTransportError:'',sent:0,errors:[],lastSeq:0,connected:false,frames:0,resolution:[0,0],sharedTransport:true,switchedAt:performance.now()};
 let alive=true,intersects=false;const visible=()=>{if(!alive||!intersects||document.hidden||document.body.classList.contains('works-orbit-open')||document.body.classList.contains('standalone-archive-open')||document.body.classList.contains('directory-music-open')||document.body.classList.contains('directory-source-open')||document.body.classList.contains('portfolio-surface-suspended') )return false;
  try{if(!h.focused)return false;let w:any=window;while(w!==rootWindow){const el=w.frameElement as HTMLElement;if(!el||el.getClientRects().length===0)return false;const b=el.getBoundingClientRect();if(b.bottom<=0||b.top>=w.parent.innerHeight||getComputedStyle(el).visibility==='hidden')return false;w=w.parent;}}catch{return false;}return camera().enabled!==false;};
 const s:any={host,layer,cover,poster,caption,inputs,scene,camera,state,status,alive:true,visible,firstSeq:0,ackAt:0,ackFrame:0};h.surfaces.add(s);
 const size=new ResizeObserver(()=>{if(h.owner===s)h.resize?.();});size.observe(host);
 const reclaim=()=>{if(visible()&&status.blocked){h.claim=true;h.last='';void h.update();}};host.addEventListener('pointerdown',reclaim,true);
 const observer=new IntersectionObserver(([e])=>{intersects=e.isIntersecting&&e.intersectionRatio>.45;void h.update()},{threshold:[0,.45,.5,1]});observer.observe(host);const gate=new MutationObserver(()=>void h.update());gate.observe(document.body,{attributes:true,attributeFilter:['class']});const visibility=()=>void h.update();document.addEventListener('visibilitychange',visibility);
 state.nativeSurfaceChanged?.(false);void h.update();
 return{layer,update:h.update,async waitForView(){const desired=camera(),deadline=performance.now()+8000;h.last='';await h.update();let ack:any;while(performance.now()<deadline){await h.health();const n=h.native;if(n?.scene===scene&&n.camera?.every((x:number,i:number)=>Math.abs(x-desired.position[i])<.01)&&n.target?.every((x:number,i:number)=>Math.abs(x-desired.target[i])<.01)){ack=n;break;}await new Promise(r=>setTimeout(r,40));}if(!ack)throw Error('Native camera pose acknowledgement timed out');const before=h.frames;const video=layer.querySelector('video');if(video?.paused)await video.play();while(performance.now()<deadline&&h.frames<before+2)await new Promise(r=>setTimeout(r,20));return{scene,poseAcknowledged:true,seq:ack.seq,streamFramesAfterPose:h.frames-before,at:performance.now()};},suspend(){s.alive=false;h.hide(s);void h.update();},destroy(){alive=false;s.alive=false;h.surfaces.delete(s);observer.disconnect();size.disconnect();gate.disconnect();host.removeEventListener('pointerdown',reclaim,true);document.removeEventListener('visibilitychange',visibility);if(h.owner===s){h.owner=null;h.last='';}layer.remove();void h.update();}};
}
