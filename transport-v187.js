(() => {
 'use strict';
 if(new URLSearchParams(location.search).get('transport187')==='0'||window.portfolioTransport187)return;
 const nativeFetch=window.fetch.bind(window),queue=[];let active=0,mediaActive=0,imageActive=0;
 const audit=window.portfolioTransport187={enabled:true,maxActive:8,maxImages:3,reservedMedia:2,active:0,queued:0,peakActive:0,completed:0,failed:0,bytes:0};
 function pump(){
  while(active<8){
   queue.sort((a,b)=>a.rank-b.rank||a.order-b.order);
   const position=queue.findIndex(job=>job.rank===0||(active-mediaActive<6&&(job.rank!==2||imageActive<3)));
   if(position<0)break;const job=queue.splice(position,1)[0];job.signal?.removeEventListener('abort',job.cancel);audit.queued=queue.length;
   if(job.signal?.aborted){job.reject(new DOMException('Aborted','AbortError'));continue;}
   active++;if(job.rank===0)mediaActive++;if(job.rank===2)imageActive++;audit.active=active;audit.peakActive=Math.max(audit.peakActive,active);
   void(async()=>{const controller=new AbortController(),abort=()=>controller.abort();job.signal?.addEventListener('abort',abort,{once:true});let timer;const progress=()=>{clearTimeout(timer);timer=setTimeout(abort,20000);};progress();
    try{const response=await nativeFetch(job.input,{...job.options,signal:controller.signal});if(!response.body||[204,205,304].includes(response.status)){job.resolve(response);return;}const reader=response.body.getReader(),parts=[];let size=0;for(;;){const{done,value}=await reader.read();if(done)break;parts.push(value);size+=value.byteLength;progress();}const bytes=new Uint8Array(size);let at=0;for(const part of parts){bytes.set(part,at);at+=part.length;}const headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Content-Length',String(size));const complete=new Response(bytes,{status:response.status,statusText:response.statusText,headers});Object.defineProperty(complete,'url',{value:response.url});audit.bytes+=size;audit.completed++;job.resolve(complete);
    }catch(error){audit.failed++;audit.lastFailure={path:job.path,error:String(error)};job.reject(error);}finally{clearTimeout(timer);job.signal?.removeEventListener('abort',abort);active--;if(job.rank===0)mediaActive--;if(job.rank===2)imageActive--;audit.active=active;pump();}
   })();
  }
 }
 let order=0;
 window.fetch=function(input,options){
  const request=input instanceof Request?input:null,url=new URL(request?.url||String(input),location.href),method=options?.method||request?.method||'GET';
  if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||method.toUpperCase()!=='GET'||!(/\.(?:bin|gz|glb|gltf|json|hdr|exr|png|jpe?g|webp|avif|mp4|m4s|m3u8|ts|wasm)$/i.test(url.pathname)))return nativeFetch(input,options);
  const media=/\.(?:mp4|m4s|m3u8|ts)$/i.test(url.pathname)||url.pathname.includes('/media/'),image=/\.(?:png|jpe?g|webp|avif)$/i.test(url.pathname),rank=media||options?.priority==='high'?0:image?2:1,signal=options?.signal||request?.signal;
  return new Promise((resolve,reject)=>{const job={input,options,signal,path:url.pathname,rank,order:order++,resolve,reject,cancel:null};job.cancel=()=>{const index=queue.indexOf(job);if(index>=0){queue.splice(index,1);audit.queued=queue.length;reject(new DOMException('Aborted','AbortError'));pump();}};if(signal?.aborted){reject(new DOMException('Aborted','AbortError'));return;}signal?.addEventListener('abort',job.cancel,{once:true});queue.push(job);audit.queued=queue.length;pump();});
 };
})();
