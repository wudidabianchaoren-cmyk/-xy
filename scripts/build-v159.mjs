import{createRequire}from'node:module';import fs from'node:fs/promises';
const cache='E:/Brain-Universe-assets/V32-61/toolchain/node_modules',video='E:/Brain-Universe-assets/V32-72/video-tools/node_modules';const{build}=createRequire(cache+'/esbuild/package.json')('esbuild');
const common={bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,jsx:'automatic',nodePaths:[cache,video,'E:/Brain-Universe-assets/V32-84/react-motion/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules']};
await build({...common,entryPoints:['src/exhibition-dock.tsx'],outfile:'scene-dist/dock/exhibition-dock-v159.js',alias:{react:video+'/react','react-dom':video+'/react-dom'}});
await build({...common,entryPoints:['src/directory-v141/app-v144.tsx'],outfile:'scene-dist/directory-v144/app.js',loader:{'.ttf':'file'}});
await fs.writeFile('.verify/v32-159/build.json',JSON.stringify({at:new Date().toISOString(),scope:['collage','room'],filmChanged:false}));console.log('V159 local bundles built.');
