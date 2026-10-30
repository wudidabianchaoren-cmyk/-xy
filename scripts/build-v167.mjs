import {createRequire} from 'node:module';
const modules='E:/Brain-Universe-assets/V32-61/toolchain/node_modules',video='E:/Brain-Universe-assets/V32-72/video-tools/node_modules';const {build}=createRequire(modules+'/esbuild/package.json')('esbuild');
await build({entryPoints:['src/hobby-drift-v167.jsx'],outfile:'scene-dist/hobby-drift-v167.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,jsx:'automatic',nodePaths:[modules,video],alias:{react:video+'/react','react-dom':video+'/react-dom'}});
console.log('V167 photography component built');
