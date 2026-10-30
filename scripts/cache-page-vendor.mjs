import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cache='E:/Brain-Universe-assets/V32-61/vendor';
await mkdir(cache,{recursive:true});await mkdir('assets/vendor',{recursive:true});
const sources=[
  ['three-0.160.0.min.js','https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js'],
  ['gsap-3.13.0.min.js','https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js'],
  ['ScrollTrigger-3.13.0.min.js','https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js'],
  ['lenis-1.3.23.min.js','https://unpkg.com/lenis@1.3.23/dist/lenis.min.js'],
  ['lenis-1.3.23.css','https://unpkg.com/lenis@1.3.23/dist/lenis.css'],
  ['lucide-0.468.0.min.js','https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js'],
  ['three-LICENSE.txt','https://cdn.jsdelivr.net/npm/three@0.160.0/LICENSE'],
  ['gsap-README.md','https://cdn.jsdelivr.net/npm/gsap@3.13.0/README.md'],
  ['lenis-LICENSE.txt','https://unpkg.com/lenis@1.3.23/LICENSE'],
  ['lucide-LICENSE.txt','https://unpkg.com/lucide@0.468.0/LICENSE'],
];
const manifest=[];
for(const [name,url] of sources) {
  let data;
  for(let i=0;i<5;i++)try{const response=await fetch(url);if(!response.ok)throw Error(response.status);data=Buffer.from(await response.arrayBuffer());break;}catch(e){if(i===4)throw e;await new Promise(r=>setTimeout(r,600*(i+1)));}
  await writeFile(cache+'/'+name,data);await copyFile(cache+'/'+name,'assets/vendor/'+name);
  manifest.push({name,url,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});console.log('Cached original '+name);
}
await writeFile(cache+'/manifest.json',JSON.stringify(manifest,null,2));await copyFile(cache+'/manifest.json','assets/vendor/manifest.json');
