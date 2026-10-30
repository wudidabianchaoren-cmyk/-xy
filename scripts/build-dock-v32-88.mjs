import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const cache='E:/Brain-Universe-assets/V32-61/toolchain/node_modules',video='E:/Brain-Universe-assets/V32-72/video-tools/node_modules';
const {build}=createRequire(cache+'/esbuild/package.json')('esbuild');
await build({entryPoints:['src/exhibition-dock.tsx','src/archive-effects.jsx','src/home-designed-intro.jsx'],outdir:'scene-dist/dock',bundle:true,splitting:true,format:'esm',target:'es2022',minify:true,sourcemap:true,jsx:'automatic',alias:{react:video+'/react','react-dom':video+'/react-dom'},nodePaths:[cache,video,'E:/Brain-Universe-assets/V32-84/react-motion/node_modules','E:/Brain-Universe-assets/V32-80/threeui-runtime/node_modules']});
try{await fs.access('vendor/threeui/LICENSE');}catch{await fs.copyFile('E:/Brain-Universe-assets/V32-80/threeui/package/LICENSE','vendor/threeui/LICENSE');}
console.log('Original exhibition directory motion and scroll collage built');
