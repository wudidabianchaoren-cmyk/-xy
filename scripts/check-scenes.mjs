import {createRequire} from 'node:module';
import {writeFileSync,mkdirSync} from 'node:fs';
const root='E:/Brain-Universe-assets/V32-61/toolchain/node_modules';
const require=createRequire(root+'/typescript/package.json');const ts=require('typescript');
const options={noEmit:true,strict:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,
  moduleResolution:ts.ModuleResolutionKind.Bundler,lib:['lib.es2022.d.ts','lib.dom.d.ts'],
  baseUrl:process.cwd(),paths:{'three-mesh-bvh':['E:/Brain-Universe-assets/V32-84/geometry-acceleration/node_modules/three-mesh-bvh/src/index.d.ts'],three:[root+'/@types/three/index.d.ts'],'three/addons/*':[root+'/@types/three/examples/jsm/*'],'three/*':[root+'/@types/three/*']},
  typeRoots:[root+'/@types'],types:[]};
const program=ts.createProgram(['src/home-clock.ts','src/home-world.ts','src/home-lod-worker.ts','src/odyssey-scene.ts','src/scene-loader.ts','src/loading-study.ts','src/reading-book.ts'],options);
const diagnostics=ts.getPreEmitDiagnostics(program);
mkdirSync('.verify',{recursive:true});
writeFileSync('.verify/scenes-typecheck-results.json',JSON.stringify({passed:diagnostics.length===0,strict:true,version:ts.version,diagnostics:diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'))},null,2));
console.log(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));
if(diagnostics.length)process.exitCode=1;else console.log('Scene, navigation, player and opening TypeScript pass strict type checking.');
