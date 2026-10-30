import{createRequire}from'node:module';import fs from'node:fs/promises';
const modules='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';const{build}=createRequire(modules+'/esbuild/package.json')('esbuild');
const entries=[['src/home-world-v145.ts','scene-dist/home-world-v145.js'],['src/scene-loader-v145.ts','scene-dist/scene-loader-v145.js']];
const out=[];for(const[input,output]of entries){const r=await build({entryPoints:[input],outfile:output,bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[modules,'E:/codex/toolchains/directory-v119/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'},metafile:true});out.push(...Object.keys(r.metafile.outputs));}
await fs.writeFile('.verify/v32-145/build.json',JSON.stringify(out,null,2));console.log('V145: affected scene entries built');
