import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='assets/odyssey/pbr-v103';await fs.mkdir(root,{recursive:true});
const assets=await (await fetch('https://api.polyhaven.com/assets?type=textures')).json();
const packs=[['weathered_brown_planks','2k'],['rough_linen','2k'],['coast_sand_03','1k'],['forest_ground_04','1k'],['seaside_rock','2k']];
const manifest=[];
for(const [id,size]of packs){
 const meta=await(await fetch('https://api.polyhaven.com/files/'+id)).json();await fs.mkdir(root+'/'+id,{recursive:true});
 const maps=await Promise.all(['Diffuse','nor_gl','Rough','AO','Displacement'].map(async kind=>{
  const f=meta[kind]?.[size]?.jpg;if(!f)return null;const out=root+'/'+id+'/'+kind+'.jpg';
  try{const old=await fs.readFile(out);if(createHash('md5').update(old).digest('hex')===f.md5)return {kind,file:out,url:f.url,bytes:old.length,md5:f.md5};}catch{}
  const response=await fetch(f.url);if(!response.ok)throw Error(id+' '+kind+' '+response.status);const b=Buffer.from(await response.arrayBuffer());
  if(b.length!==f.size||createHash('md5').update(b).digest('hex')!==f.md5)throw Error('Official checksum mismatch: '+id+' '+kind);
  await fs.writeFile(out,b);return {kind,file:out,url:f.url,bytes:b.length,md5:f.md5};
 }));
 const a=assets[id];manifest.push({id,size,license:'CC0',page:'https://polyhaven.com/a/'+id,authors:a.authors,dimensionsMillimetres:a.dimensions,maps:maps.filter(Boolean)});console.log(id+' verified');
}
await fs.writeFile(root+'/SOURCE.json',JSON.stringify({version:103,downloaded:new Date().toISOString(),assets:manifest},null,2));
