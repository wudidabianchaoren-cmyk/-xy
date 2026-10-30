import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const toolchain='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const {build}=createRequire(toolchain+'/esbuild/package.json')('esbuild');
const r=await build({entryPoints:['src/directory-v136/app.tsx'],outfile:'scene-dist/directory-v136/app.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:['E:/codex/toolchains/directory-v119/node_modules',toolchain,'E:/Brain-Universe-assets/V32-72/video-tools/node_modules','E:/Brain-Universe-assets/V32-84/react-motion/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'},metafile:true});
await fs.writeFile('.verify/v32-136/build.json',JSON.stringify(Object.keys(r.metafile.outputs),null,2));
console.log('Built only directory V136.');
