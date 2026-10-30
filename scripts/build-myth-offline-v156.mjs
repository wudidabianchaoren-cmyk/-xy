import fs from 'node:fs/promises';
const manifest=JSON.parse(await fs.readFile('mythology-offline-manifest-v156.json','utf8'));
manifest.files=[...new Set([...manifest.files.filter(x=>x.startsWith('/')&&!x.startsWith('//')),'/mythology-offline-v156.js','/mythology-offline-manifest-v156.json'])].sort();
await fs.writeFile('mythology-offline-manifest-v156.json',JSON.stringify(manifest,null,2));
const script=`const CACHE='zaojing-mythology-v156';
const FILES=${JSON.stringify(manifest.files)};
const ALLOW=new Set(FILES);
const signal=async data=>{for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage({type:'myth-offline-156',...data});};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);let next=0,done=0;
 try{await Promise.all([0,1,2].map(async()=>{while(next<FILES.length){const path=FILES[next++];const response=await fetch(path,{cache:'reload'});if(!response.ok)throw Error(path+': '+response.status);await cache.put(path,response);done++;if(done%8===0)await signal({files:done,ready:false});}}));await signal({files:done,ready:true});await self.skipWaiting();}
 catch(error){await signal({files:done,ready:false,error:String(error)});throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if((key==='zaojing-mythology-v154'||key==='zaojing-mythology-v155'))await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='myth-offline-status-156')event.waitUntil((async()=>{const cache=await caches.open(CACHE);let count=0;for(const path of FILES)if(await cache.match(path))count++;event.source?.postMessage({type:'myth-offline-156',ready:count===FILES.length,files:count});})());});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!ALLOW.has(url.pathname))return;
 event.respondWith((async()=>{try{const response=await fetch(event.request);if(!response.ok)throw Error('HTTP '+response.status);const cache=await caches.open(CACHE);await cache.put(url.pathname,response.clone());return response;}catch(error){const hit=await(await caches.open(CACHE)).match(url.pathname);if(hit)return hit;throw error;}})());
});
`;
await fs.writeFile('mythology-sw-v156.js',script);
console.log('Offline scope: '+manifest.files.length+' local cove files.');
