import {createRequire} from 'node:module';
const tools='E:/Brain-Universe-assets/V32-61/toolchain/node_modules',require=createRequire(tools+'/esbuild/package.json');
await require('esbuild').build({entryPoints:['src/home-world.ts'],outfile:'scene-dist/home-world.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[tools,'E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules']});
console.log('Only actual homepage rebuilt; no assets, other scenes or production scripts executed.');
