import{createRequire}from'node:module';import fs from'node:fs/promises';
const tools='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const{build}=createRequire(tools+'/esbuild/package.json')('esbuild');
const result=await build({entryPoints:['src/mythology-compact-v134.ts'],outfile:'scene-dist/mythology-compact-v134.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[tools],metafile:true});
await fs.writeFile('.verify/v32-134/build.json',JSON.stringify(Object.keys(result.metafile.outputs),null,2));
console.log('Built only the mythology V134 entry.');
