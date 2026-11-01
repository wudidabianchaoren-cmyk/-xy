const dgram=require('node:dgram');
const {randomUUID}=require('node:crypto');

// Numeric controls use loopback datagrams. Disk is a coalesced recovery copy;
// a Windows file-replacement retry must never hold up a drag response.
function realtimeControl({port,commit,stats}){
 const socket=dgram.createSocket('udp4'),epoch=randomUUID();
 let queued=null,flushing=null,timer=null,closed=false;
 Object.assign(stats,{inputDelivery:'loopback-udp',realtimePackets:0,lastDurableSeq:stats.lastSeq,recoveryWriteError:null});
 socket.on('error',e=>{stats.realtimeError=e.code||String(e);});
 function schedule(){if(!timer&&!closed){timer=setTimeout(()=>{timer=null;void flush().catch(()=>{});},80);timer.unref();}}
 async function flush(){
  if(flushing)return flushing;
  if(!queued)return;
  const snapshot=queued;queued=null;
  flushing=(async()=>{await commit(snapshot);stats.lastDurableSeq=snapshot.seq;stats.recoveryWriteError=null;})()
   .catch(e=>{stats.recoveryWriteError=e.code||String(e);throw e;})
   .finally(()=>{flushing=null;if(queued)schedule();});
  return flushing;
 }
 async function send(snapshot){
  snapshot.bridgeProtocol='portfolio-numeric-v174';snapshot.bridgeEpoch=epoch;
  const bytes=Buffer.from(JSON.stringify(snapshot));
  if(bytes.length>32768)throw new Error('Realtime numeric state exceeds limit');
  await new Promise((resolve,reject)=>socket.send(bytes,port,'127.0.0.1',error=>error?reject(error):resolve()));
  stats.realtimePackets++;queued=snapshot;schedule();
  return 1;
 }
 async function settled(){if(timer){clearTimeout(timer);timer=null;}while(queued||flushing)await flush();}
 function close(){closed=true;void settled().catch(()=>{}).finally(()=>{try{socket.close();}catch{}});}
 return{send,settled,close};
}
module.exports={realtimeControl};
