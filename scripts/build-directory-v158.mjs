import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const modules='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const {build}=createRequire(modules+'/esbuild/package.json')('esbuild');
const result=await build({entryPoints:['src/directory-v141/app-v144.tsx'],outfile:'scene-dist/directory-v144/app.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[modules,'E:/codex/toolchains/directory-v119/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'},metafile:true});
await fs.mkdir('.verify/v32-158/room',{recursive:true});await fs.writeFile('.verify/v32-158/room/build.json',JSON.stringify({outputs:Object.keys(result.metafile.outputs),builtAt:new Date().toISOString()},null,2));console.log('Directory V158 built.');
