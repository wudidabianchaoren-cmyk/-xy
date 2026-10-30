import {createRequire} from 'node:module';
const require=createRequire('E:/Brain-Universe-assets/V32-61/toolchain/node_modules/esbuild/package.json');
await require('esbuild').build({entryPoints:['src/odyssey-scene.ts'],outdir:'scene-dist',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:['E:/Brain-Universe-assets/V32-61/toolchain/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules']});
console.log('Only the mythology ESM bundle rebuilt.');
