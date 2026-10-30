import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root='E:/Brain-Universe-assets/V32-63',sources=[];
await mkdir(root,{recursive:true});
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'BrainUniverse-Portfolio'},signal:AbortSignal.timeout(240000)});if(!r.ok)throw Error(url+' '+r.status);return r;}
async function save(url,dest,expected){
  await mkdir(path.dirname(dest),{recursive:true});
  let data;try{data=await readFile(dest);if(expected&&createHash('md5').update(data).digest('hex')!==expected.md5)data=null;}catch{data=null;}
  if(!data){data=Buffer.from(await(await get(url)).arrayBuffer());if(expected&&(data.length!==expected.size||createHash('md5').update(data).digest('hex')!==expected.md5))throw Error('Asset checksum mismatch');await writeFile(dest,data);}
  const record={url,path:dest,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),...(expected?{md5:expected.md5}:{})};sources.push(record);console.log(path.basename(dest)+' verified '+data.length);return record;
}
for(const [id,res,maps] of [['marble_01','2k',['Diffuse','nor_gl','Rough','Displacement']],['rough_linen','1k',['Diffuse','nor_gl','Rough']]]){
  const metadata=await(await get('https://api.polyhaven.com/files/'+id)).json();
  for(const key of maps){const f=metadata[key][res].jpg;await save(f.url,path.join(root,id,path.basename(new URL(f.url).pathname)),f);}
  await writeFile(path.join(root,id,'SOURCE.json'),JSON.stringify({asset:id,page:'https://polyhaven.com/a/'+id,license:'CC0',maps:sources.filter(x=>x.path.includes(id))},null,2));
}
await save('https://codeload.github.com/makehumancommunity/mpfb2/zip/refs/tags/v2.0.17',root+'/mpfb2-v2.0.17.zip');
await save('https://files.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip',root+'/makehuman_system_assets_cc0.zip');
await writeFile(root+'/SOURCES.json',JSON.stringify({downloadsOnlyDrive:'E',mpfbVersion:'2.0.17',codeLicense:'AGPL-3.0',modelAssetsLicense:'CC0',sources},null,2));
