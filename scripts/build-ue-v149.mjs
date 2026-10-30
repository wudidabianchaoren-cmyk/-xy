import {createRequire} from 'node:module';
const {build}=createRequire('E:/Brain-Universe-assets/V32-61/toolchain/node_modules/esbuild/package.json')('esbuild');
await build({entryPoints:['src/mythology-ue-v149.ts'],outfile:'scene-dist/mythology-ue-v149.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true});
console.log('UE streaming browser entry built');
