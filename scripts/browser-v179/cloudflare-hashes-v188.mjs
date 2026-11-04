import fs from 'node:fs';import path from 'node:path';import{createRequire}from'node:module';
const cli=process.env.CF_WRANGLER_PACKAGE||'C:/Users/HP/AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/package.json',require=createRequire(cli),blake=require('blake3-wasm');
const plan=JSON.parse(fs.readFileSync('.verify/v32-188/asset-plan.json','utf8')),files=[];
for(const item of plan.files){if(item.path.startsWith('_'))continue;const file='.verify/v32-188/site/'+item.path,bytes=fs.readFileSync(file),hash=blake.hash(bytes.toString('base64')+path.extname(file).substring(1)).toString('hex').slice(0,32);files.push({...item,cloudflareHash:hash});}
fs.writeFileSync('.verify/v32-188/cloudflare-hashes.json',JSON.stringify({files}));console.log(JSON.stringify({files:files.length}));
