import{createRequire}from'node:module';import fs from'node:fs/promises';
const tools='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';const{build}=createRequire(tools+'/esbuild/package.json')('esbuild');
const targets=[['src/mythology-compact-v139.ts','scene-dist/mythology-compact-v139.js'],['src/directory-v139/app.tsx','scene-dist/directory-v139/app.js'],['src/reading-book-v139.ts','scene-dist/reading-book-v139.js']];
const outputs=[];for(const[input,output]of targets){const r=await build({entryPoints:[input],outfile:output,bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[tools,'E:/codex/toolchains/directory-v119/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'},metafile:true});outputs.push(...Object.keys(r.metafile.outputs));}
await fs.writeFile('.verify/v32-139/build.json',JSON.stringify(outputs,null,2));console.log('Only the three affected source entries built.');
