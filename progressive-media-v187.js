const manifestCache=new Map();
export function progressiveMedia(video,url,setSource,diagnostics,onFallback){
 const lifetime=new AbortController();let disposed=false,mediaSource,sourceBuffer,objectURL,manifest,cursor=0,generation=0,pumping=false,again=false,download;
 const waiters=new Set();
 const segments=new Map();
 const audit={source:url,bytes:0,requests:0,retries:0,seeks:0,firstAppendAt:0,ready:false,failed:false};
 (diagnostics.progressiveMedia??=[]).push(audit);
 async function bytes(address,signal=lifetime.signal){
  for(let attempt=0;attempt<3;attempt++){
   const request=new AbortController(),abort=()=>request.abort();signal.addEventListener('abort',abort,{once:true});
   const timeout=setTimeout(abort,20000);
   try{if(signal.aborted)throw new DOMException('Disposed','AbortError');const endpoint=new URL(address,url);if(attempt)endpoint.searchParams.set('mediaRetry',String(attempt));audit.requests++;
    const response=await fetch(endpoint,{signal:request.signal,priority:video.currentTime<.2?'high':'auto'});if(!response.ok)throw Error('Media response '+response.status);
    const buffer=await response.arrayBuffer();audit.bytes+=buffer.byteLength;return buffer;
   }catch(error){if(signal.aborted||disposed)throw error;if(attempt===2)throw error;audit.retries++;await new Promise(r=>setTimeout(r,300*(attempt+1)));}
   finally{clearTimeout(timeout);signal.removeEventListener('abort',abort);}
  }
 }
 function idle(){if(!sourceBuffer?.updating)return Promise.resolve();return new Promise((resolve,reject)=>{
  const end=()=>{cleanup();resolve();},fail=()=>{cleanup();reject(Error('Media append failed'));};
  const cleanup=()=>{sourceBuffer.removeEventListener('updateend',end);sourceBuffer.removeEventListener('error',fail);waiters.delete(fail);};
  waiters.add(fail);sourceBuffer.addEventListener('updateend',end,{once:true});sourceBuffer.addEventListener('error',fail,{once:true});
 });}
 async function append(buffer){await idle();if(disposed)return;sourceBuffer.appendBuffer(buffer);await idle();}
 function endAt(time){for(let i=0;i<video.buffered.length;i++)if(video.buffered.start(i)<=time+.15&&video.buffered.end(i)>=time-.15)return video.buffered.end(i);return time;}
 function anchor(time){let selected=0;for(let i=0;i<manifest.segments.length;i++){const part=manifest.segments[i];if(part.keyframes.some(t=>t<=time+.005))selected=i;if(part.start>time+.2)break;}return selected;}
 function fail(error){if(disposed)return;audit.failed=true;audit.error=String(error);onFallback?.(error);}
 function clearSegments(){for(const job of segments.values())job.controller.abort();segments.clear();}
 function ahead(){for(let index=cursor;index<Math.min(cursor+4,manifest.segments.length);index++)if(!segments.has(index)){
  const controller=new AbortController(),abort=()=>controller.abort();lifetime.signal.addEventListener('abort',abort,{once:true});
  const task=bytes(new URL(manifest.segments[index].file,url).href,controller.signal).finally(()=>lifetime.signal.removeEventListener('abort',abort));task.catch(()=>{});segments.set(index,{controller,task});
 }}
 async function pump(){
  if(disposed||!sourceBuffer||!manifest)return;if(pumping){again=true;return;}pumping=true;
  try{
   do{again=false;const own=generation;
    while(!disposed&&own===generation&&cursor<manifest.segments.length){
     const time=video.currentTime||0,goal=video.paused?2:7;
     if(endAt(time)-time>=goal)break;
     ahead();let buffer;
     try{buffer=await segments.get(cursor).task;}catch(error){if(own!==generation)break;throw error;}
     if(disposed||own!==generation)break;
     try{await append(buffer);}catch(error){if(error?.name!=='QuotaExceededError')throw error;await idle();if(video.currentTime>15){sourceBuffer.remove(0,video.currentTime-12);await idle();await append(buffer);}else throw error;}
     if(disposed||own!==generation)break;
     segments.delete(cursor);cursor++;audit.firstAppendAt||=performance.now();audit.ready=true;
     if(video.currentTime>20&&sourceBuffer.buffered.length&&sourceBuffer.buffered.start(0)<video.currentTime-16){await idle();sourceBuffer.remove(0,video.currentTime-12);await idle();}
    }
    if(!disposed&&own===generation&&cursor>=manifest.segments.length&&mediaSource.readyState==='open'){await idle();if(!sourceBuffer.updating)mediaSource.endOfStream();}
   }while(again&&!disposed);
  }catch(error){if(!disposed)fail(error);}finally{pumping=false;if(again&&!disposed)queueMicrotask(pump);}
 }
 function seek(){if(!manifest||disposed)return;generation++;audit.seeks++;clearSegments();cursor=anchor(Math.max(0,video.currentTime));download?.abort();again=true;void pump();}
 const wake=()=>void pump();
 for(const name of ['timeupdate','play','waiting','stalled'])video.addEventListener(name,wake);
 video.addEventListener('seeking',seek);
 async function start(){
  try{
   let promise=manifestCache.get(url);if(!promise){const embedded=window.PORTFOLIO_RESOURCES_V180?.mseManifests?.[new URL(url,location.href).pathname];promise=embedded?Promise.resolve(embedded):bytes(url).then(raw=>JSON.parse(new TextDecoder().decode(raw)));promise.catch(()=>manifestCache.delete(url));manifestCache.set(url,promise);}
   manifest=await promise;if(disposed)return;if(!window.MediaSource?.isTypeSupported(manifest.mime))throw Error('Original stream codec unsupported by MediaSource');
   mediaSource=new MediaSource();objectURL=URL.createObjectURL(mediaSource);
   mediaSource.addEventListener('sourceopen',()=>{if(sourceBuffer||disposed)return;void(async()=>{try{sourceBuffer=mediaSource.addSourceBuffer(manifest.mime);mediaSource.duration=manifest.duration;await append(await bytes(new URL(manifest.init,url).href));if(!disposed)await pump();}catch(error){fail(error);}})();},{once:true});
   setSource(objectURL);video.load();
  }catch(error){fail(error);}
 }
 function dispose(){if(disposed)return;disposed=true;clearSegments();lifetime.abort();download?.abort();for(const fail of waiters)fail();waiters.clear();for(const name of ['timeupdate','play','waiting','stalled'])video.removeEventListener(name,wake);video.removeEventListener('seeking',seek);window.removeEventListener('pagehide',dispose);if(objectURL)URL.revokeObjectURL(objectURL);}
 window.addEventListener('pagehide',dispose,{once:true});void start();return{dispose,audit};
}
