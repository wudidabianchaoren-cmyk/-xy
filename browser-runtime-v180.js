(() => {
  'use strict';
  const query=new URLSearchParams(location.search);
  if(query.has('bakeCapture'))return;
  window.PORTFOLIO_BROWSER_ONLY=true;
  for(const [key,value] of [['renderer','web'],['nativeLightfield','1'],['homeRenderer','web']])query.set(key,value);
  history.replaceState(history.state,'',location.pathname+'?'+query+location.hash);
  const resources=window.PORTFOLIO_RESOURCES_V180||{media:{},binary:{}};
  const originalFetch=window.fetch.bind(window);
  const diagnostics=window.portfolioDeliveryState={version:180,browserOnly:true,segmentedVideos:0,assembledResources:0,errors:[]};
  window.fetch=async function(input,options){
    const request=input instanceof Request?input:null;
    const url=new URL(request?.url||String(input),location.href),record=url.origin===location.origin?resources.binary[url.pathname]:null;
    if(!record)return originalFetch(input,options);
    const signal=options?.signal||request?.signal;
    let index=0;const pending=new Map();
    const segment=async position=>{
      for(let attempt=0;attempt<3;attempt++){
        try{const response=await originalFetch(record.parts[position],{signal,priority:'high'});if(!response.ok)throw Error('Resource segment unavailable: '+response.status);return new Uint8Array(await response.arrayBuffer());}
        catch(error){if(signal?.aborted||attempt===2)throw error;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}
      }
    };
    const prefetch=()=>{for(let next=index;next<Math.min(index+3,record.parts.length);next++)if(!pending.has(next)){const job=segment(next);job.catch(()=>{});pending.set(next,job);}};
    prefetch();
    const stream=new ReadableStream({
      async pull(controller){
        try{
          if(index>=record.parts.length){controller.close();return;}
          controller.enqueue(await pending.get(index));pending.delete(index++);prefetch();
        }catch(error){diagnostics.errors.push(String(error));controller.error(error);}
      },
      cancel(){index=record.parts.length;}
    });
    diagnostics.assembledResources++;
    return new Response(record.encoding==='gzip'?stream.pipeThrough(new DecompressionStream('gzip')):stream,{headers:{'Content-Type':url.pathname.endsWith('.glb')?'model/gltf-binary':'application/octet-stream','Content-Length':String(record.bytes)}});
  };
  const media=HTMLMediaElement.prototype,descriptor=Object.getOwnPropertyDescriptor(media,'src'),players=new WeakMap();
  function clear(video){const previous=players.get(video);if(previous){players.delete(video);previous.disposed=true;previous.hls?.destroy();}}
  function attach(video,path){
    clear(video);const record={path,disposed:false,hls:null};players.set(video,record);
    if(!window.Hls?.isSupported()&&video.canPlayType('application/vnd.apple.mpegurl')){diagnostics.segmentedVideos++;diagnostics.playerEngine='native HLS';descriptor.set.call(video,path);return;}
    descriptor.set.call(video,'');
    queueMicrotask(()=>{
      if(record.disposed)return;
      if(!window.Hls?.isSupported()){diagnostics.errors.push('This browser does not support segmented media');video.dispatchEvent(new Event('error'));return;}
      const opening=path.includes('/courtyard-intro/');const hls=new Hls({enableWorker:true,progressive:true,backBufferLength:12,maxBufferLength:opening?30:18,maxMaxBufferLength:opening?30:36,capLevelToPlayerSize:false});record.hls=hls;diagnostics.playerEngine='HLS.js 1.7.4 / progressive MediaSource';
      hls.on(Hls.Events.MEDIA_ATTACHED,()=>{if(!record.disposed)hls.loadSource(path);});
      hls.on(Hls.Events.ERROR,(_event,data)=>{if(data.fatal)diagnostics.errors.push('Media: '+data.type+'/'+data.details);});
      hls.attachMedia(video);diagnostics.segmentedVideos++;
    });
  }
  Object.defineProperty(media,'src',{...descriptor,set(value){
    let path;try{const url=new URL(String(value),location.href);if(url.origin===location.origin)path=resources.media[url.pathname];}catch{}
    if(path){attach(this,path);return;}
    if(!String(value).startsWith('blob:'))clear(this);
    descriptor.set.call(this,value);
  }});
  function inspect(node){
    if(!(node instanceof Element))return;
    const videos=node.matches('video')?[node]:node.querySelectorAll('video');
    for(const video of videos){
      if(players.has(video))continue;
      const source=video.getAttribute('data-portfolio-media-src')||video.getAttribute('src')||video.querySelector('source')?.getAttribute('src');
      if(!source)continue;
      const url=new URL(source,location.href),path=url.origin===location.origin?resources.media[url.pathname]:null;
      if(path)attach(video,path);
    }
  }
  new MutationObserver(records=>{for(const record of records){if(record.type==='attributes')inspect(record.target);else for(const node of record.addedNodes)inspect(node);}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-portfolio-media-src']});
  document.addEventListener('DOMContentLoaded',()=>inspect(document.documentElement),{once:true});
})();
