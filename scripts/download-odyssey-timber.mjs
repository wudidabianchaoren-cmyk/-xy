import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='E:/Brain-Universe-assets/V32-62/wood_planks';await mkdir(dir,{recursive:true});
const m=await(await fetch('https://api.polyhaven.com/files/wood_planks')).json(),files=[];
for(const key of ['Diffuse','nor_gl','Rough']) {
  const f=m[key]['1k'].jpg,r=await fetch(f.url);if(!r.ok)throw Error(r.status);
  const b=Buffer.from(await r.arrayBuffer());if(b.length!==f.size||createHash('md5').update(b).digest('hex')!==f.md5)throw Error('Official asset checksum mismatch');
  const name=new URL(f.url).pathname.split('/').at(-1);await writeFile(dir+'/'+name,b);files.push({name,bytes:b.length,md5:f.md5,source:f.url});
}
await writeFile(dir+'/SOURCE.json',JSON.stringify({asset:'Wood Planks',author:'Amal Kumar',license:'CC0',source:'https://polyhaven.com/a/wood_planks',files},null,2));
console.log(JSON.stringify(files));
