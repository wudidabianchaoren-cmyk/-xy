import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prepareOnly=process.argv.includes('--prepare-only');
if(!prepareOnly){
 for(const key of ['UE_BACKEND_ORIGIN','ASSET_ORIGIN']){
  const value=process.env[key];let url;try{url=new URL(value)}catch{}
  if(!url||url.protocol!=='https:'||url.username||url.password||url.hostname==='localhost'||/^127\./.test(url.hostname))throw Error(key+' must be the independently hosted HTTPS service origin; this workstation is not a production backend.');
 }
 if(process.env.PORTFOLIO_DEPLOY_READY!=='1')throw Error('Release blocked: GPU/media services and per-viewer isolation must be verified before PORTFOLIO_DEPLOY_READY=1.');
}
const out=path.join(root,'public');await fs.mkdir(out,{recursive:true});let count=0,bytes=0;
async function copy(source,relative){
 const stat=await fs.stat(source);if(stat.size>25*1024*1024)throw Error('Pages asset exceeds 25 MiB: '+relative);
 const target=path.join(out,relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(source,target);count++;bytes+=stat.size;
}
for(const entry of await fs.readdir(root,{withFileTypes:true})){
 if(!entry.isFile()||!/\.(html|css|js)$/.test(entry.name)||/^(verify|test|make-|patch-|fix-)|\.spec\.js$/.test(entry.name))continue;
 await copy(path.join(root,entry.name),entry.name);
}
async function tree(directory){
 for(const entry of await fs.readdir(path.join(root,directory),{withFileTypes:true})){
  const relative=path.join(directory,entry.name);
  if(entry.isDirectory()){if(!['node_modules','.git'].includes(entry.name))await tree(relative);}
  else if(/\.(js|css|ttf|woff2?|wasm)$/.test(entry.name))await copy(path.join(root,relative),relative);
 }
}
await tree('scene-dist');await tree('vendor');
await fs.writeFile(path.join(out,'_routes.json'),JSON.stringify({version:1,include:['/ue','/ue/*','/_runtime/*','/assets/*','/blender/*','/motion/*'],exclude:[]},null,2));
await fs.writeFile(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
await fs.writeFile(path.join(out,'404.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>页面未找到 · 造境手记</title><p>这个页面暂时没有找到。</p><a href="/">返回作品集</a></html>');
await fs.writeFile(path.join(out,'release-status.json'),JSON.stringify({prepared:true,productionVerified:false,prepareOnly,files:count,bytes,requires:['independent GPU service','independent media service','per-viewer isolation and published URL verification']},null,2));
console.log(JSON.stringify({output:'public',prepareOnly,files:count,MiB:Math.round(bytes/1024/1024),productionVerified:false}));
