import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dest='E:/codex/脑海宇宙作品集/当前作品集_V32.88';
const sha=b=>createHash('sha256').update(b).digest('hex');
const review='.verify/v32-88/visual-review.html';
let html=await fs.readFile(review,'utf8');
html=html.replaceAll('image-atlas-review','atlas-diagnostic').replaceAll('hobbyPage-review','hobby-ready-review');
await fs.writeFile(review,html);
const files=[review,'.verify/v32-88/hobby-ready-review.png','.verify/v32-88/review-hobby-ready.mjs'];
const records=JSON.parse(await fs.readFile(dest+'/文件清单.json','utf8'));
for(const file of files){
 const data=await fs.readFile(file),target=dest+'/项目/'+file;
 await fs.writeFile(target,data);
 if(sha(await fs.readFile(target))!==sha(data))throw Error('Review copy mismatch');
 const record={path:'项目/'+file,bytes:data.length,sha256:sha(data)},index=records.findIndex(r=>r.path===record.path);
 if(index<0)records.push(record);else records[index]=record;
}
await fs.writeFile(dest+'/文件清单.json',JSON.stringify(records,null,2));
const result=JSON.parse(await fs.readFile(dest+'/保存结果.json','utf8'));
if(!result.complete||!result.currentPackageRunPassed)throw Error('Package must have passed independent run');
Object.assign(result,{files:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0),manifestSha256:sha(await fs.readFile(dest+'/文件清单.json')),reviewUpdated:new Date().toISOString()});
await fs.writeFile(dest+'/保存结果.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({complete:result.complete,currentPackageRunPassed:result.currentPackageRunPassed,files:result.files}));
