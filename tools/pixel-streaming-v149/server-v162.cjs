const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {SignallingServer} = require('@epicgames-ps/lib-pixelstreamingsignalling-ue5.8');
const root = path.resolve(__dirname, '../..');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const transientCodes=new Set(['EPERM','EACCES','EBUSY','ETXTBSY','EINTR']);

function createControlServer(options={}){
 const verify=options.verifyDirectory||path.join(root,'.verify/v32-162');
 fs.mkdirSync(verify,{recursive:true});
 const inputFile=path.join(verify,'ue-camera-input.json');
 function readJson(name){try{return JSON.parse(fs.readFileSync(path.join(verify,name),'utf8').replace(/^\uFEFF/,''));}catch{return null;}}
 let lastNative=null;
 const liveNative=()=>{const state=readJson('ue-live.json');if(state)lastNative=state;return lastNative;};
 const restored=readJson('ue-camera-input.json');
 let controls={seq:0,theta:0,phi:0,radius:0,night:false,paused:false,reset:0,...(restored||{})};
 let nextSeq=Number.isSafeInteger(controls.seq)?controls.seq:0,tail=Promise.resolve(),signalling=null;
 const completed=new Map();
 const stats={accepted:0,committed:0,invalid:0,failed:0,retries:0,writeAttempts:0,pending:0,lastSeq:nextSeq,lastError:null};
 const realtime=options.realtimePort?require('./realtime-control-v174.cjs').realtimeControl({port:options.realtimePort,commit,stats}):null;
 const status=()=>({...stats,inputFile});
 async function commit(snapshot){
  const temporary=inputFile+'.tmp-'+process.pid+'-'+snapshot.seq;
  let written=false,attempts=0;
  try{
   for(;;){
    attempts++;stats.writeAttempts++;
    try{
     if(!written){await fs.promises.writeFile(temporary,JSON.stringify(snapshot),'utf8');written=true;}
     // Never remove the previous valid input as a workaround. Windows readers
     // can briefly deny DELETE sharing: retry the replacement after they close.
     await fs.promises.rename(temporary,inputFile);return attempts;
    }catch(error){
     if(!transientCodes.has(error.code)||attempts>=160)throw error;
     stats.retries++;await sleep(Math.min(32,2+attempts*2));
    }
   }
  }finally{await fs.promises.unlink(temporary).catch(()=>{});}
 }
 function enqueue(input){
  const identity=typeof input.clientId==='string'&&Number.isSafeInteger(input.clientSeq)?input.clientId.slice(0,128)+':'+input.clientSeq:null;
  if(identity&&completed.has(identity))return completed.get(identity);
  if(stats.pending>=4096){const e=new Error('Control queue is full');e.code='CONTROL_QUEUE_FULL';return Promise.reject(e);}
  stats.accepted++;stats.pending++;
  const task=tail.then(async()=>{
   if(input.active===false&&input.clientId&&controls.ownerClient!==input.clientId){stats.pending--;return{ok:true,ignored:true,owned:false,seq:controls.seq};}
   if(input.active!==false&&input.clientId&&controls.ownerClient&&controls.ownerClient!==input.clientId&&controls.active!==false&&Date.now()-controls.at<5000&&!input.claim){stats.pending--;return{ok:true,owned:false,seq:controls.seq};}
   const snapshot={...controls,seq:++nextSeq,at:Date.now(),ownerClient:input.clientId||controls.ownerClient};
   for(const key of ['theta','phi','radius','night','paused','camera','target','scene','fov','verticalFov','roomWork','roomTime','roomTV','roomDirectVideo','roomProps','lamp','active','homeParts','homeKey','homeWest','directCamera'])if(Object.hasOwn(input,key))snapshot[key]=input[key];
   if(input.reset)snapshot.reset++;
   try{
    const attempts=await (realtime?realtime.send(snapshot):commit(snapshot));controls=snapshot;stats.committed++;stats.lastSeq=snapshot.seq;stats.lastError=null;
    return{ok:true,owned:true,seq:snapshot.seq,persisted:!realtime,delivery:realtime?'loopback-udp':'file',attempts};
   }catch(error){stats.failed++;stats.lastError={code:error.code||'UNKNOWN',message:error.message,seq:snapshot.seq,at:Date.now()};throw error;}
   finally{stats.pending--;}
  });
  tail=task.catch(()=>{});
  if(identity){completed.set(identity,task);task.catch(()=>completed.delete(identity));if(completed.size>4096)completed.delete(completed.keys().next().value);}
  return task;
 }
 function reply(res,code,body){if(res.destroyed)return;res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(body));}
 const server=http.createServer((req,res)=>{
  const origin=req.headers.origin;
  if(origin && !/^http:\/\/(127\.0\.0\.1|localhost):(8031|8089)$/.test(origin)){res.writeHead(403);return res.end();}
  if(origin)res.setHeader('Access-Control-Allow-Origin',origin);
  res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
  const url=new URL(req.url,'http://127.0.0.1:8089');
  if(url.pathname==='/health'){
    const native=liveNative(),streamers=signalling?signalling.streamerRegistry.streamers.map(s=>s.getStreamerInfo()):[];const ready=!!(streamers.length&&native?.phase==='native viewport live'&&Date.now()/1000-native.heartbeat<6);let calendar;try{calendar=JSON.parse(fs.readFileSync(path.join(root,'.verify/v32-170/calendar-native.json'),'utf8'));}catch{}const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const calendarReady=!!(ready&&calendar?.date===today&&calendar.at>=native.startedAt);return reply(res,200,{streamers,native,camera:readJson('ue-camera-state.json'),control:status(),runtime:{ready,calendarReady,calendarDate:calendar?.date,today}});
  }
  if(url.pathname==='/control'&&req.method==='POST'){
    let body='',tooLarge=false;req.on('data',chunk=>{if(tooLarge)return;body+=chunk;if(Buffer.byteLength(body)>16384){tooLarge=true;stats.invalid++;reply(res,413,{ok:false,code:'CONTROL_BODY_TOO_LARGE',retryable:false});}});
    req.on('end',()=>{
     if(tooLarge)return;let input;
     try{input=JSON.parse(body);}catch{stats.invalid++;return reply(res,400,{ok:false,code:'INVALID_JSON',retryable:false});}
     const valid=input&&typeof input==='object'&&!Array.isArray(input)&&['theta','phi','radius'].every(k=>!Object.hasOwn(input,k)||Number.isFinite(input[k]))&&['night','paused','reset','homeWest','claim','roomTV','roomDirectVideo','verticalFov','directCamera','active'].every(k=>!Object.hasOwn(input,k)||typeof input[k]==='boolean');
     if(input.roomProps&&(!Array.isArray(input.roomProps)||input.roomProps.length>9||input.roomProps.some(d=>!/^book[0-2]$|^tape[0-4]$|^notepad$/.test(d.id)||typeof d.visible!=='boolean'||![['p',3],['q',4],['s',3]].every(([k,n])=>Array.isArray(d[k])&&d[k].length===n&&d[k].every(x=>Number.isFinite(x)&&Math.abs(x)<1000)))))return reply(res,400,{ok:false,code:'INVALID_ROOM_PROPS'});
     if(input.roomProps?.some(d=>(d.commit!==undefined&&typeof d.commit!=='boolean')||(d.glow!==undefined&&(!Array.isArray(d.glow)||d.glow.length!==4||!d.glow.every(x=>Number.isFinite(x)&&Math.abs(x)<1000)||d.glow[3]<0||d.glow[3]>1))))return reply(res,400,{ok:false,code:'INVALID_ROOM_TRANSFER'});
     if(input.homeParts&&(!Array.isArray(input.homeParts)||input.homeParts.length>64||input.homeParts.some(d=>typeof d.id!=='string'||d.id.length>160||![['p',3],['q',4],['s',3]].every(([k,n])=>Array.isArray(d[k])&&d[k].length===n&&d[k].every(x=>Number.isFinite(x)&&Math.abs(x)<100000)))))return reply(res,400,{ok:false,code:'INVALID_PARTS'});
     if(!valid||!['camera','target','homeKey'].every(k=>!Object.hasOwn(input,k)||(Array.isArray(input[k])&&input[k].length===3&&input[k].every(x=>Number.isFinite(x)&&Math.abs(x)<100000)))){stats.invalid++;return reply(res,400,{ok:false,code:'INVALID_CONTROL',retryable:false});}
     enqueue(input).then(result=>reply(res,200,result),error=>reply(res,503,{ok:false,code:error.code==='CONTROL_QUEUE_FULL'?'CONTROL_QUEUE_FULL':'CONTROL_WRITE_FAILED',retryable:true,lastCommittedSeq:stats.lastSeq}));
    });return;
  }
  res.writeHead(404);res.end();
 });
 if(options.signalling!==false)signalling=new SignallingServer({httpServer:server,streamerPort:8888,streamerWsOptions:{host:'127.0.0.1'},peerOptions:{iceServers:[]},maxSubscribers:3});
 if(realtime)server.once('close',()=>realtime.close());
 return{server,status,inputFile,settled:async()=>{await tail;if(realtime)await realtime.settled();}};
}
module.exports={createControlServer};
if(require.main===module){const{server}=createControlServer({realtimePort:8891});server.listen(8089,'127.0.0.1',()=>console.log('Cove local UE signalling/control: 127.0.0.1:8089; streamer 127.0.0.1:8888'));}
