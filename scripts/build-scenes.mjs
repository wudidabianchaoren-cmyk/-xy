import {createRequire} from 'node:module';
import {mkdir,copyFile,cp,writeFile} from 'node:fs/promises';
import path from 'node:path';
const tools='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const require=createRequire(path.join(tools,'esbuild/package.json'));
const {build}=require('esbuild');
await mkdir('assets/odyssey',{recursive:true});
for(const name of ['venice_sunset_1k.hdr','waternormals.jpg','rock_boulder_cracked_diff_1k.jpg','rock_boulder_cracked_nor_gl_1k.jpg','rock_boulder_cracked_rough_1k.jpg','rock-assets.json'])await copyFile('E:/Brain-Universe-assets/V32-61/odyssey/'+name,'assets/odyssey/'+name);
await mkdir('assets/odyssey/coastal_cliff_02',{recursive:true});
for(const name of ['coastal_cliff_02.web.gltf','coastal_cliff_02.web.bin','web-audit.json'])await copyFile('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/'+name,'assets/odyssey/coastal_cliff_02/'+name);
await cp('E:/Brain-Universe-assets/V32-62/models/coastal_cliff_02/textures','assets/odyssey/coastal_cliff_02/textures',{recursive:true});
await cp('E:/Brain-Universe-assets/V32-62/wood_planks','assets/odyssey/wood_planks',{recursive:true});
await cp('E:/Brain-Universe-assets/V32-63/rough_linen','assets/odyssey/rough_linen',{recursive:true});
await copyFile('blender/reference-architecture-v15/ulysses-rigged-clean.glb','assets/odyssey/ulysses-rigged.glb');
await copyFile('blender/reference-architecture-v15/cyclops-cliff.glb','assets/odyssey/cyclops-cliff.glb');
await copyFile('E:/Brain-Universe-assets/V32-65/reference/turner-ulysses-1829.jpg','assets/odyssey/turner-ulysses-1829.jpg');
await mkdir('assets/home',{recursive:true});
for(const kind of ['diff','nor_gl','rough'])await copyFile('E:/Brain-Universe-assets/V32-69/home-4k/white_sandstone_blocks_02_'+kind+'_4k.jpg','assets/home/white_sandstone_blocks_02_'+kind+'_4k.jpg');
await cp(tools+'/three/examples/jsm/libs/draco/gltf','assets/home/draco',{recursive:true});
for(const suffix of ['diff','rough','nor_gl']){
  await copyFile('E:/Brain-Universe-assets/V32-62/white_sandstone_blocks_02/white_sandstone_blocks_02_'+suffix+'_2k.jpg','assets/home/white_sandstone_blocks_02_'+suffix+'_2k.jpg');
  const ambient={diff:'Color',rough:'Roughness',nor_gl:'NormalGL'}[suffix];
  await copyFile('E:/Brain-Universe-assets/V32-65/Marble012/Marble012_2K-JPG_'+ambient+'.jpg','assets/home/Marble012_'+suffix+'_2k.jpg');
  await copyFile('E:/Brain-Universe-assets/V32-65/sandstone_cracks/sandstone_cracks_'+suffix+'_2k.jpg','assets/home/sandstone_cracks_'+suffix+'_2k.jpg');
}
const result=await build({entryPoints:['src/home-clock.ts','src/home-world.ts','src/home-lod-worker.ts','src/odyssey-scene.ts','src/scene-loader.ts','src/loading-study.ts','src/reading-book.ts'],outdir:'scene-dist',bundle:true,splitting:true,format:'esm',target:'es2022',minify:true,sourcemap:true,nodePaths:[tools,'E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules'],metafile:true});
await writeFile('scene-dist/build-manifest.json',JSON.stringify({files:Object.keys(result.metafile.outputs)},null,2));
console.log('TypeScript scene bundles built locally; downloads cached only E.');
