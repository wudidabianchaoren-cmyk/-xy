import {createRequire} from 'node:module';import fs from 'node:fs/promises';
const toolchain='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';const require=createRequire(toolchain+'/esbuild/package.json');const {build}=require('esbuild');
const video='E:/Brain-Universe-assets/V32-72/video-tools/node_modules';
const common={bundle:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:['E:/codex/toolchains/directory-v119/node_modules',toolchain,video,'E:/Brain-Universe-assets/V32-84/react-motion/node_modules','E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],jsx:'automatic',loader:{'.ttf':'file'}};
const results=[];
for(const [entryPoints,outfile] of [[['src/home-world-v132.ts'],'scene-dist/home-world-v132.js'],[['src/scene-loader-v132.ts'],'scene-dist/scene-loader-v132.js'],[['src/home-designed-intro.jsx'],'scene-dist/dock/home-designed-intro-v132.js'],[['src/directory-v132/app.tsx'],'scene-dist/directory-v132/app.js']]){results.push(await build({...common,...(outfile.includes('home-designed-intro')?{alias:{react:video+'/react','react-dom':video+'/react-dom'}}:{}),entryPoints,outfile,metafile:true}));}
await fs.writeFile('.verify/v32-132/build.json',JSON.stringify(results.map(r=>Object.keys(r.metafile.outputs)),null,2));console.log('Built only home, startup, intro and directory targets.');
