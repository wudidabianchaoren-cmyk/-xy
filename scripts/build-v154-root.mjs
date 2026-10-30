import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const modules='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const {build}=createRequire(modules+'/esbuild/package.json')('esbuild');
const common={bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[modules,'E:/codex/toolchains/directory-v119/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'},metafile:true};
const out=[];
for(const [input,output] of [['src/home-world-v146.ts','scene-dist/home-world-v146.js'],['src/scene-loader-v146.ts','scene-dist/scene-loader-v146.js'],['src/directory-v141/app-v144.tsx','scene-dist/directory-v144/app.js']]){
 const result=await build({...common,entryPoints:[input],outfile:output});out.push(...Object.keys(result.metafile.outputs));
}
await fs.writeFile('.verify/v32-154/root-build.json',JSON.stringify(out,null,2));
let html=await fs.readFile('directory.html','utf8');html=html.replace(/directory-v144\/app\.(js|css)\?v=[\d.]+/g,'directory-v144/app.$1?v=32.154');await fs.writeFile('directory.html',html);
console.log('Built homepage, loader and directory entries only.');
