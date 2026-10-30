import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const destination='E:/Brain-Universe-assets/V32-61/odyssey';
await mkdir(destination,{recursive:true});
const metadata=await (await fetch('https://api.polyhaven.com/files/rock_boulder_cracked')).json();
const manifest=[];
for(const key of ['Diffuse','nor_gl','Rough']) {
  const entry=metadata[key]['1k'].jpg;
  const response=await fetch(entry.url);if(!response.ok)throw Error(response.status);
  const data=Buffer.from(await response.arrayBuffer());
  if(data.length!==entry.size || createHash('md5').update(data).digest('hex')!==entry.md5)throw Error('Asset integrity failure');
  const name=entry.url.split('/').at(-1);await writeFile(destination+'/'+name,data);
  manifest.push({name,...entry,license:'CC0',source:'https://polyhaven.com/a/rock_boulder_cracked'});
  console.log('Verified '+name+' '+data.length);
}
await writeFile(destination+'/rock-assets.json',JSON.stringify(manifest,null,2));
