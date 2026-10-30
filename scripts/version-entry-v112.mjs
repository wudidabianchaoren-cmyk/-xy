import fs from 'node:fs/promises';
const dir='.verify/v32-112/previous-source';
for(const f of ['src/scene-loader.ts','scene-dist/scene-loader.js','scene-dist/scene-loader.js.map']){
 try{await fs.access(dir+'/'+f.replaceAll('/','__'));}catch{await fs.copyFile(f,dir+'/'+f.replaceAll('/','__'));}
}
let p='src/scene-loader.ts',s=await fs.readFile(p,'utf8');s=s.replace("void import('./odyssey-scene')","void import(String('./odyssey-scene.js?v=32.112'))");await fs.writeFile(p,s);
p='scene-dist/scene-loader.js';s=await fs.readFile(p,'utf8');s=s.replace('import("./odyssey-scene.js")','import("./odyssey-scene.js?v=32.112")');await fs.writeFile(p,s);
const map=JSON.parse(await fs.readFile(p+'.map','utf8'));for(let i=0;i<map.sources.length;i++)if(map.sources[i].endsWith('src/scene-loader.ts'))map.sourcesContent[i]=await fs.readFile('src/scene-loader.ts','utf8');await fs.writeFile(p+'.map',JSON.stringify(map));
console.log('Only myth lazy import cache version updated; original homepage modules unchanged');
