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
  for(const [key,value] of [['renderer','web'],['nativeLightfield','1'],['homeRenderer','web'],['roomAtlas185','1'],['roomAO','0']])query.set(key,value);
  history.replaceState(history.state,'',location.pathname+'?'+query+location.hash);
  for(const method of ['pushState','replaceState']){const original=history[method].bind(history);history[method]=function(state,title,address){if(address!=null){const url=new URL(String(address),location.href);if(url.origin===location.origin){for(const[key,value]of[['renderer','web'],['nativeLightfield','1'],['homeRenderer','web']])url.searchParams.set(key,value);address=url.href;}}return original(state,title,address);};}
  const resources=window.PORTFOLIO_RESOURCES_V180||{media:{},binary:{}};
  const originalFetch=window.fetch.bind(window);
  const segmentCache=new Map();
  function cachedSegment(address,options={}){const key=new URL(address,location.href).href;if(segmentCache.has(key))return segmentCache.get(key);const task=(async()=>{for(let attempt=0;attempt<3;attempt++){const controller=new AbortController(),abort=()=>controller.abort();options.signal?.addEventListener('abort',abort,{once:true});const timer=setTimeout(abort,30000);try{const response=await originalFetch(address,{...options,signal:controller.signal,...(attempt?{cache:'reload'}:{})});if(!response.ok)throw Error('Resource segment unavailable: '+response.status);return new Uint8Array(await response.arrayBuffer());}catch(error){if(options.signal?.aborted||attempt===2)throw error;await new Promise(r=>setTimeout(r,300*(attempt+1)));}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort);}}})();task.catch(()=>segmentCache.delete(key));segmentCache.set(key,task);return task;}
  if(/^\/(?:index\.html|v31\.html)?$/.test(location.pathname)){const queue=['/blender/reference-architecture-v16/architecture-world.glb','/blender/reference-architecture-v24/baked-architecture.glb'].flatMap(path=>resources.binary[path]?.parts||[]);for(let worker=0;worker<2;worker++)void(async()=>{while(queue.length){const path=queue.shift();try{await cachedSegment(path,{priority:'low'});}catch{}}})();addEventListener('v85:home-intro-finished',()=>setTimeout(()=>segmentCache.clear(),30000),{once:true});}
  const diagnostics=window.portfolioDeliveryState={version:185,browserOnly:true,segmentedVideos:0,assembledResources:0,errors:[]};
  const backgroundRoot=()=>!!document.getElementById('voyage')&&((window.homeDesignedIntroState&&!window.homeDesignedIntroState.finished)||document.body?.matches('.portfolio-portal-open,.works-orbit-open'));
  document.addEventListener('error',event=>{const script=event.target;if(!(script instanceof HTMLScriptElement)||!script.src||script.dataset.deliveryPlayer)return;const source=new URL(script.src,location.href),attempt=Number(script.dataset.moduleRecovery||0);if(source.origin!==location.origin||attempt>=2)return;const retry=document.createElement('script');for(const attribute of script.attributes)if(attribute.name!=='src')retry.setAttribute(attribute.name,attribute.value);if(script.nonce)retry.nonce=script.nonce;source.searchParams.set('moduleRecovery',String(attempt+1));retry.src=resources.moduleFallbacks?.[source.pathname]||source.href;retry.dataset.moduleRecovery=String(attempt+1);retry.onload=()=>dispatchEvent(new Event('portfolio:script-recovered'));(diagnostics.recoveredScriptAttempts??=[]).push({url:source.pathname,attempt:attempt+1});setTimeout(()=>script.replaceWith(retry),400*(attempt+1));},true);
  if('serviceWorker'in navigator)void(async()=>{try{const registrations=await navigator.serviceWorker.getRegistrations();let removed=0;for(const registration of registrations){const script=registration.active?.scriptURL||registration.waiting?.scriptURL||registration.installing?.scriptURL;if(script&&/\/mythology-sw-v\d+\.js$/.test(new URL(script).pathname)){await registration.unregister();removed++;}}if('caches'in window)for(const key of await caches.keys())if(/^zaojing-(?:native|mythology)-v\d+$/.test(key))await caches.delete(key);diagnostics.legacyWorkerCleanup={removed,complete:true};}catch(error){diagnostics.legacyWorkerCleanup={complete:false,error:String(error)};}})();
  window.fetch=async function(input,options){
    const request=input instanceof Request?input:null;
    const url=new URL(request?.url||String(input),location.href),record=url.origin===location.origin?resources.binary[url.pathname]:null;
    if(!record){
      if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||!/^GET$/i.test(options?.method||request?.method||'GET')||!(/\.(?:json|glb|gltf|hdr|exr|bin|gz|ttf|woff2?|mp4)$/i.test(url.pathname)))return originalFetch(input,options);
      for(let attempt=0;attempt<3;attempt++)try{
        const response=await originalFetch(input,{...options,...(backgroundRoot()&&!url.pathname.endsWith('.mp4')?{priority:'low'}:{}),...(attempt||query.has('entryRetry')?{cache:'reload'}:{})});if(!response.ok){if(attempt<2&&[408,429,500,502,503,504].includes(response.status))throw Error('Asset response '+response.status);return response;}
        const bytes=await response.arrayBuffer(),headers=new Headers(response.headers);headers.delete('Content-Encoding');headers.set('Content-Length',String(bytes.byteLength));const complete=new Response(bytes,{status:response.status,statusText:response.statusText,headers});Object.defineProperty(complete,'url',{value:response.url});return complete;
      }catch(error){if(options?.signal?.aborted||request?.signal?.aborted||attempt===2)throw error;(diagnostics.recoveredFetchAttempts??=[]).push({url:url.pathname,attempt:attempt+1});await new Promise(resolve=>setTimeout(resolve,400*(attempt+1)));}
    }
    const signal=options?.signal||request?.signal;
    let index=0;const pending=new Map();
    const segment=async position=>{
      for(let attempt=0;attempt<3;attempt++){
        try{return await cachedSegment(record.parts[position],{signal,priority:record.media?'high':backgroundRoot()?'low':'auto',...(attempt||query.has('entryRetry')?{cache:'reload'}:{})});}
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
  function clear(video){const previous=players.get(video);if(previous){players.delete(video);previous.disposed=true;previous.hls?.destroy();previous.progressive?.dispose();previous.abort?.abort();if(previous.objectURL)URL.revokeObjectURL(previous.objectURL);}}
  function attachProgressive(video,source,path){
    clear(video);const record={disposed:false,progressive:null};players.set(video,record);video.removeAttribute('src');
    void import('/progressive-media-v185.js').then(({progressiveMedia})=>{if(record.disposed)return;record.progressive=progressiveMedia(video,new URL(path,location.href).href,address=>descriptor.set.call(video,address),diagnostics,error=>{if(record.disposed)return;(diagnostics.mediaFallbacks??=[]).push({source,error:String(error)});const url=new URL(source,location.href);if(resources.originalMedia?.[url.pathname])attachOriginal(video,url.href);else if(resources.media[url.pathname])attach(video,resources.media[url.pathname]);else{clear(video);descriptor.set.call(video,source);video.load();}});}).catch(error=>{if(record.disposed)return;diagnostics.errors.push(String(error));video.dispatchEvent(new Event('error'));});
  }
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
    try{const url=new URL(String(value),location.href),path=url.origin===location.origin?resources.mseMedia?.[url.pathname]:null;if(path){attachProgressive(this,url.href,path);return;}}catch{}
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
      if(resources.mseMedia?.[url.pathname])attachProgressive(video,url.href,resources.mseMedia[url.pathname]);else if(resources.originalMedia?.[url.pathname])attachOriginal(video,url.href);else if(path)attach(video,path);
    }
  }
  new MutationObserver(records=>{for(const record of records){if(record.type==='attributes')inspect(record.target);else for(const node of record.addedNodes)inspect(node);}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-portfolio-media-src']});
  // Reuse byte-identical duplicates and choose display-sized DOM images. The
  // original full images and all off-DOM WebGL textures retain their resolution.
  const managedImages=new WeakMap(),watchedImages=new WeakSet(),imageRetries=new WeakMap(),responsiveLookup=new Map();
  for(const variants of Object.values(resources.responsiveImages||{}))for(const variant of variants)responsiveLookup.set(variant.src,variants);
  function imageAddress(value){try{const u=new URL(String(value),location.href);if(u.origin!==location.origin)return String(value);for(let n=0;n<4&&resources.imageAliases?.[u.pathname];n++)u.pathname=resources.imageAliases[u.pathname];if(u.pathname.startsWith('/assets/browser-v183/'))u.searchParams.delete('v');return u.href;}catch{return value;}}
  const imageSource=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src'),setImageAttribute=HTMLImageElement.prototype.setAttribute;
  function changedImage(image,address){const prior=managedImages.get(image);if(prior&&prior!==new URL(address,location.href).pathname){image.removeAttribute('srcset');image.removeAttribute('sizes');managedImages.delete(image);}}
  Object.defineProperty(HTMLImageElement.prototype,'src',{...imageSource,set(value){const address=imageAddress(value);changedImage(this,address);imageSource.set.call(this,address);if(this.isConnected)queueMicrotask(()=>prepareImage(this));}});
  HTMLImageElement.prototype.setAttribute=function(name,value){if(name.toLowerCase()==='src'){value=imageAddress(value);changedImage(this,value);}return setImageAttribute.call(this,name,value);};
  const imageSizes=new ResizeObserver(entries=>{for(const {target}of entries)if(managedImages.has(target)&&target.clientWidth>0)target.sizes=Math.ceil(target.clientWidth)+'px';});
  const imageLead=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){const image=entry.target;image.loading='eager';if(image.clientWidth>0&&managedImages.has(image))image.sizes=Math.ceil(image.clientWidth)+'px';void image.decode().catch(()=>{});imageLead.unobserve(image);diagnostics.imagesPrepared=(diagnostics.imagesPrepared||0)+1;}},{rootMargin:'2400px 0px'});
  function prepareImage(image){
    if(!image.isConnected||!image.getAttribute('src'))return;image.decoding='async';
    const address=new URL(imageAddress(image.getAttribute('src')),location.href),variants=resources.responsiveImages?.[address.pathname]||responsiveLookup.get(address.pathname),authoredSet=variants?.map(v=>v.src+' '+v.width+'w').join(',');
    if(variants&&image.closest('dialog,[role="dialog"],[class*="lightbox"]')&&image.getAttribute('srcset')===authoredSet){image.removeAttribute('srcset');image.removeAttribute('sizes');imageSource.set.call(image,variants.at(-1).src);}
    else if(variants&&!image.closest('dialog,[role="dialog"],[class*="lightbox"]')&&(!image.hasAttribute('srcset')||managedImages.has(image)||image.getAttribute('srcset')===authoredSet)){
      image.sizes=image.clientWidth>0?Math.ceil(image.clientWidth)+'px':'(min-width:1200px) 960px, 100vw';image.srcset=variants.map(v=>v.src+' '+v.width+'w').join(',');managedImages.set(image,address.pathname);imageSizes.observe(image);
    }
    if(!watchedImages.has(image)){watchedImages.add(image);if(!image.hasAttribute('loading'))image.loading='lazy';imageLead.observe(image);}
  }
  function prepareImages(root){if(root instanceof HTMLImageElement)prepareImage(root);for(const image of root.querySelectorAll?.('img')||[])prepareImage(image);}
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)prepareImages(node);}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('error',event=>{const image=event.target;if(!(image instanceof HTMLImageElement)||!image.isConnected)return;const attempt=imageRetries.get(image)||0,u=new URL(image.currentSrc||image.src,location.href);if(attempt>=2||u.origin!==location.origin||!/^https?:$/.test(u.protocol))return;imageRetries.set(image,attempt+1);u.searchParams.set('imageRetry',String(attempt+1));setTimeout(()=>{image.removeAttribute('srcset');image.removeAttribute('sizes');managedImages.delete(image);image.src=u.href;},400*(attempt+1));},true);
  const warmed=new Map(),warmQueue=[];let warming=0;
  function warmImage(source){const address=imageAddress(source);if(warmed.has(address))return;warmed.set(address,null);warmQueue.push(address);pumpImages();}
  function pumpImages(){while(warming<2&&warmQueue.length){const address=warmQueue.shift(),image=new Image();warming++;image.decoding='async';image.fetchPriority='low';image.loading='eager';warmed.set(address,image);const done=()=>{warmed.set(address,true);warming--;pumpImages();};image.onload=done;image.onerror=done;image.src=address;}}
  function warmPage(href){try{const page=new URL(href,location.href);if(page.origin!==location.origin)return;const path=authoredPath(page.pathname);for(const image of (resources.pageImages?.[path]||[]).slice(0,3))warmImage(image);}catch{}}
  document.addEventListener('pointerover',event=>{const link=event.target.closest?.('a[href]');if(link)warmPage(link.href);},{passive:true});
  document.addEventListener('focusin',event=>{const link=event.target.closest?.('a[href]');if(link)warmPage(link.href);});
  const warmAfterOpening=()=>{if(!document.getElementById('voyage'))return;for(const images of Object.values(resources.pageImages||{}))if(images[0])warmImage(images[0]);};
  addEventListener('v85:home-intro-finished',warmAfterOpening,{once:true});
  document.addEventListener('DOMContentLoaded',()=>{inspect(document.documentElement);prepareImages(document);if(window.homeDesignedIntroState?.finished)warmAfterOpening();if(parent!==window)void(async()=>{const poster=document.querySelector('.film-poster');if(poster){poster.loading='eager';poster.fetchPriority='high';await Promise.race([poster.decode().catch(()=>{}),new Promise(r=>setTimeout(r,6000))]);}await new Promise(requestAnimationFrame);parent.postMessage({type:'brain-universe:project-ready'},location.origin);})();},{once:true});
})();
