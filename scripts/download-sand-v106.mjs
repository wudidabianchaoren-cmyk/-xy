import{mkdir,writeFile}from'node:fs/promises';import{createHash}from'node:crypto';
const dir='assets/odyssey/pbr-v106/sand_01';await mkdir(dir,{recursive:true});
const api='https://api.polyhaven.com/files/sand_01',data=await(await fetch(api)).json(),source={api,asset:'sand_01',license:'CC0',files:[]};
for(const[key,remote]of[['diff','Diffuse'],['nor_gl','nor_gl'],['rough','Rough']]){const item=data[remote]?.['1k']?.jpg;if(!item)throw Error('Missing sand_01 '+key);const bytes=Buffer.from(await(await fetch(item.url)).arrayBuffer());await writeFile(dir+'/'+key+'.jpg',bytes);source.files.push({key,url:item.url,bytes:bytes.length,md5:createHash('md5').update(bytes).digest('hex'),expected:item.md5});}
await writeFile(dir+'/SOURCE.json',JSON.stringify(source,null,2));console.log(source.files.map(f=>({key:f.key,bytes:f.bytes,md5Verified:f.md5===f.expected})));
