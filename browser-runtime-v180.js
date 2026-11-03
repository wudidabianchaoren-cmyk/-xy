(() => {
  'use strict';
  // Old Netlify Pretty URLs may survive in bookmarks or cached HTML. Restore
  // the authored route before relative assets and page-specific code resolve.
  const pageRoute=/^\/(?:v31|reading|learning|yangjian|mythology|mythology-process|after-journey|rural-return|mid-autumn|physical-universe|humid-southeast-asia|directory-credits)\/?$/;
  const authoredPath=path=>pageRoute.test(path)?path.replace(/\/$/,'')+'.html':path;
  const canonicalPath=authoredPath(location.pathname);
  if(canonicalPath!==location.pathname)history.replaceState(history.state,'',canonicalPath+location.search+location.hash);
  document.addEventListener('click',event=>{const link=event.target.closest?.('a[href]');if(!link)return;const url=new URL(link.href,location.href);if(url.origin===location.origin&&authoredPath(url.pathname)!==url.pathname){url.pathname=authoredPath(url.pathname);link.href=url.href;}},true);
  const query=new URLSearchParams(location.search);
  if(query.has('bakeCapture'))return;
  window.PORTFOLIO_BROWSER_ONLY=true;
  for(const [key,value] of [['renderer','web'],['nativeLightfield','1'],['homeRenderer','web']])query.set(key,value);
  history.replaceState(history.state,'',location.pathname+'?'+query+location.hash);
  for(const method of ['pushState','replaceState']){const original=history[method].bind(history);history[method]=function(state,title,address){if(address!=null){const url=new URL(String(address),location.href);if(url.origin===location.origin){for(const[key,value]of[['renderer','web'],['nativeLightfield','1'],['homeRenderer','web']])url.searchParams.set(key,value);address=url.href;}}return original(state,title,address);};}
  const resources=window.PORTFOLIO_RESOURCES_V180||{media:{},binary:{}};
  const originalFetch=window.fetch.bind(window);
  const diagnostics=window.portfolioDeliveryState={version:182,browserOnly:true,segmentedVideos:0,assembledResources:0,errors:[]};
  const backgroundRoot=()=>!!document.getElementById('voyage')&&((window.homeDesignedIntroState&&!window.homeDesignedIntroState.finished)||document.body?.matches('.portfolio-portal-open,.works-orbit-open'));
  document.addEventListener('error',event=>{const script=event.target;if(!(script instanceof HTMLScriptElement)||!script.src||script.dataset.deliveryPlayer)return;const source=new URL(script.src,location.href),attempt=Number(script.dataset.moduleRecovery||0);if(source.origin!==location.origin||attempt>=2)return;const retry=document.createElement('script');for(const attribute of script.attributes)if(attribute.name!=='src')retry.setAttribute(attribute.name,attribute.value);if(script.nonce)retry.nonce=script.nonce;source.searchParams.set('moduleRecovery',String(attempt+1));retry.src=source.href;retry.dataset.moduleRecovery=String(attempt+1);retry.onload=()=>dispatchEvent(new Event('portfolio:script-recovered'));(diagnostics.recoveredScriptAttempts??=[]).push({url:source.pathname,attempt:attempt+1});setTimeout(()=>script.replaceWith(retry),400*(attempt+1));},true);
  if('serviceWorker'in navigator)void(async()=>{try{const registrations=await navigator.serviceWorker.getRegistrations();let removed=0;for(const registration of registrations){const script=registration.active?.scriptURL||registration.waiting?.scriptURL||registration.installing?.scriptURL;if(script&&/\/mythology-sw-v\d+\.js$/.test(new URL(script).pathname)){await registration.unregister();removed++;}}if('caches'in window)for(const key of await caches.keys())if(/^zaojing-(?:native|mythology)-v\d+$/.test(key))await caches.delete(key);diagnostics.legacyWorkerCleanup={removed,complete:true};}catch(error){diagnostics.legacyWorkerCleanup={complete:false,error:String(error)};}})();
  window.fetch=async function(input,options){
    const request=input instanceof Request?input:null;
    const url=new URL(request?.url||String(input),location.href),record=url.origin===location.origin?resources.binary[url.pathname]:null;
    if(!record){
      if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||!/^GET$/i.test(options?.method||request?.method||'GET')||!(/\.(?:json|glb|gltf|hdr|exr|bin|gz|ttf|woff2?|mp4)$/i.test(url.pathname)))return originalFetch(input,options);
      for(let attempt=0;attempt<3;attempt++)try{
        const response=await originalFetch(input,{...options,...(backgroundRoot()&&!url.pathname.endsWith('.mp4')?{priority:'low'}:{}),...(attempt?{cache:'reload'}:{})});if(!response.ok){if(attempt<2&&[408,429,500,502,503,504].includes(response.status))throw Error('Asset response '+response.status);return response;}
        const bytes=await response.arrayBuffer(),headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Content-Length',String(bytes.byteLength));const complete=new Response(bytes,{status:response.status,statusText:response.statusText,headers});Object.defineProperty(complete,'url',{value:response.url});return complete;
      }catch(error){if(options?.signal?.aborted||request?.signal?.aborted||attempt===2)throw error;(diagnostics.recoveredFetchAttempts??=[]).push({url:url.pathname,attempt:attempt+1});await new Promise(resolve=>setTimeout(resolve,400*(attempt+1)));}
    }
    const signal=options?.signal||request?.signal;
    let index=0;const pending=new Map();
    const segment=async position=>{
      for(let attempt=0;attempt<3;attempt++){
        try{const response=await originalFetch(record.parts[position],{signal,priority:record.media?'high':backgroundRoot()?'low':'auto'});if(!response.ok)throw Error('Resource segment unavailable: '+response.status);return new Uint8Array(await response.arrayBuffer());}
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
  let playerLibrary;
  function loadPlayer(){if(window.Hls)return Promise.resolve();return playerLibrary??=(async()=>{for(let attempt=0;attempt<3;attempt++)try{await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/vendor/hls-1.7.4.min.js'+(attempt?'?playerRetry='+attempt:'');script.dataset.deliveryPlayer='true';script.async=true;script.onload=resolve;script.onerror=()=>{script.remove();reject(Error('Video player could not load'));};document.head.append(script);});return;}catch(error){if(attempt===2){playerLibrary=null;throw error;}await new Promise(resolve=>setTimeout(resolve,400*(attempt+1)));}})();}
  const media=HTMLMediaElement.prototype,descriptor=Object.getOwnPropertyDescriptor(media,'src'),players=new WeakMap();
  function clear(video){const previous=players.get(video);if(previous){players.delete(video);previous.disposed=true;previous.hls?.destroy();previous.abort?.abort();if(previous.objectURL)URL.revokeObjectURL(previous.objectURL);}}
  function attachOriginal(video,source){
    clear(video);const record={disposed:false,abort:new AbortController(),objectURL:null};players.set(video,record);video.removeAttribute('src');
    void(async()=>{try{const response=await window.fetch(source,{signal:record.abort.signal});if(!response.ok)throw Error('Original opening unavailable');const buffer=await response.arrayBuffer();if(record.disposed)return;record.objectURL=URL.createObjectURL(new Blob([buffer],{type:'video/mp4'}));diagnostics.originalVideos=(diagnostics.originalVideos||0)+1;diagnostics.playerEngine='Original MP4 / byte-identical reconstruction';descriptor.set.call(video,record.objectURL);video.load();}catch(error){if(record.disposed)return;diagnostics.errors.push(String(error));video.dispatchEvent(new Event('error'));}})();
  }
  function attach(video,path){
    clear(video);const record={path,disposed:false,hls:null};players.set(video,record);
    video.removeAttribute('src');
    queueMicrotask(async()=>{
      try{await loadPlayer();}catch(error){diagnostics.errors.push(String(error));video.dispatchEvent(new Event('error'));return;}
      if(record.disposed)return;
      if(!window.Hls?.isSupported()&&video.canPlayType('application/vnd.apple.mpegurl')){diagnostics.segmentedVideos++;diagnostics.playerEngine='native HLS';descriptor.set.call(video,path);return;}
      if(!window.Hls?.isSupported()){diagnostics.errors.push('This browser does not support segmented media');video.dispatchEvent(new Event('error'));return;}
      const opening=path.includes('/courtyard-intro/');const hls=new Hls({enableWorker:true,progressive:true,backBufferLength:12,maxBufferLength:opening?30:18,maxMaxBufferLength:opening?30:36,capLevelToPlayerSize:false});record.hls=hls;diagnostics.playerEngine='HLS.js 1.7.4 / progressive MediaSource';
      hls.on(Hls.Events.MEDIA_ATTACHED,()=>{if(!record.disposed)hls.loadSource(path);});
      hls.on(Hls.Events.ERROR,(_event,data)=>{if(data.fatal)diagnostics.errors.push('Media: '+data.type+'/'+data.details);});
      hls.attachMedia(video);diagnostics.segmentedVideos++;
    });
  }
  Object.defineProperty(media,'src',{...descriptor,set(value){
    try{const url=new URL(String(value),location.href);if(url.origin===location.origin&&resources.originalMedia?.[url.pathname]){attachOriginal(this,url.href);return;}}catch{}
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
      if(resources.originalMedia?.[url.pathname])attachOriginal(video,url.href);else if(path)attach(video,path);
    }
  }
  new MutationObserver(records=>{for(const record of records){if(record.type==='attributes')inspect(record.target);else for(const node of record.addedNodes)inspect(node);}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-portfolio-media-src']});
  document.addEventListener('DOMContentLoaded',()=>{inspect(document.documentElement);if(parent!==window)parent.postMessage({type:'brain-universe:project-ready'},location.origin);},{once:true});
})();
