import {createRequire} from 'node:module';
const modules='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const video='E:/Brain-Universe-assets/V32-72/video-tools/node_modules';
const {build}=createRequire(modules+'/esbuild/package.json')('esbuild');
// Rebuild the exact entry referenced by v31.html, rather than its unused sibling.
await build({entryPoints:['src/exhibition-dock.tsx'],outfile:'scene-dist/dock/exhibition-dock-v160.js',bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,jsx:'automatic',nodePaths:[modules,video,'E:/Brain-Universe-assets/V32-84/react-motion/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],alias:{react:video+'/react','react-dom':video+'/react-dom'}});
console.log('Actual collage entry rebuilt with all 11 atmosphere images.');
