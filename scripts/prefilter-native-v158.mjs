import{createRequire}from'node:module';import fs from'node:fs/promises';import{gzipSync}from'node:zlib';
import{chromium}from'../node_modules/playwright/index.mjs';
const cache='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';const{build}=createRequire(cache+'/esbuild/package.json')('esbuild');
const out='.verify/v32-158';await build({entryPoints:[out+'/prefilter-native-entry.js'],outfile:out+'/prefilter-native-tool.js',bundle:true,format:'esm',target:'es2022',minify:true,nodePaths:['E:/codex/toolchains/directory-v119/node_modules',cache]});
await fs.writeFile(out+'/prefilter-native-tool.html','<!doctype html><meta charset="utf-8"><title>Authoring native reflection probe</title><script type="module" src="./prefilter-native-tool.js"></script>');
const b=await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=d3d11','--force_high_performance_gpu','--disable-extensions']}),p=await b.newPage();
try{
 await p.goto('http://127.0.0.1:8031/'+out+'/prefilter-native-tool.html');await p.waitForFunction(()=>window.nativeProbePrefilter?.ready||window.nativeProbePrefilter?.error,null,{timeout:60000});
 const r=await p.evaluate(()=>nativeProbePrefilter);if(r.error)throw Error(r.error);if(r.nonzero<r.width*r.height)throw Error('Prefilter output is empty');
 const data=Buffer.from(r.base64,'base64');delete r.base64;
 await fs.writeFile('assets/home/native-v24-prefiltered-v158.bin.gz',gzipSync(data));
 await fs.writeFile('assets/home/native-v24-prefiltered-v158.json',JSON.stringify({...r,format:'RGBA HalfFloat CubeUVReflectionMapping',runtimePMREM:false},null,2));console.log(JSON.stringify(r));
}finally{await b.close();}
