import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const backup='.verify/v32-114/previous-source';
const leaves=['v31.html','physical-universe.html','v31-works-ring.js','src/scene-loader.ts','src/chapter-navigation.ts','scene-dist/scene-loader.js','scene-dist/scene-loader.js.map'];
for(const f of leaves){await fs.mkdir(path.dirname(backup+'/'+f),{recursive:true});await fs.copyFile(f,backup+'/'+f);}
let html=await fs.readFile('v31.html','utf8');
for(const id of ['odysseyIntroduction','odyssey','lifePurpose']){
 const re=new RegExp('<section[^>]*\\bid="'+id+'"[^>]*>[\\s\\S]*?<\\/section>\\s*');
 assert(re.test(html),'Missing section '+id);html=html.replace(re,'');
}
html=html.replace(/    <button[^>]*data-life-jump[^>]*>[\s\S]*?<\/button>\s*/,'');
html=html.replace(/<script>document\.querySelectorAll\('\[data-reading-volume="odyssey"\]'\)[\s\S]*?<\/script>/,'');
html=html.replace('v31-works-ring.js?v=32.106','v31-works-ring.js?v=32.114').replace('scene-loader.js?v=32.112','scene-loader.js?v=32.114');
await fs.writeFile('v31.html',html);
let loader=await fs.readFile('src/scene-loader.ts','utf8');
loader=loader.slice(0,loader.indexOf("const odyssey=document.getElementById('odysseyScene');"));
loader+='// Story and mythology now live on the reading shelf; code films live in their work.\n';
await fs.writeFile('src/scene-loader.ts',loader);
let chapter=await fs.readFile('src/chapter-navigation.ts','utf8');
chapter=chapter.replace(/^document\.addEventListener\('click',e=>\{if\(\(e.target as Element\).closest\('\[data-life-jump\]'\)\)[^\n]*\n?/m,'');
await fs.writeFile('src/chapter-navigation.ts',chapter);
let works=await fs.readFile('v31-works-ring.js','utf8');
works=works.replace('["让画面发生", "作品集宣传片", "物理手感", "设计排字 · 原创图形与物理手感", "./assets/works/physical-universe-v103/cover.webp", "./physical-universe.html?v=32.103"]','["让画面发生", "代码影像双作", "图形与叙事", "代码创作 · 物理手感与手绘拼贴", "./assets/works/physical-universe-v103/cover.webp", "./physical-universe.html?v=32.114"]');
assert(works.includes('代码影像双作'));await fs.writeFile('v31-works-ring.js',works);
const tools='E:/Brain-Universe-assets/V32-61/toolchain/node_modules',require=createRequire(tools+'/esbuild/package.json');
await require('esbuild').build({entryPoints:['src/scene-loader.ts'],outfile:'scene-dist/scene-loader.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[tools],plugins:[{name:'preserve-home-world',setup(b){b.onResolve({filter:/^\.\/home-world$/},()=>({path:'./home-world.js',external:true}));}}]});
console.log('Main sections consolidated; existing home world and mythology bundles retained.');
