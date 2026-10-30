import fs from 'node:fs/promises';
let s=await fs.readFile('src/home-world.ts','utf8');
s=s.replace("import {architecturalCamera}","import {architecturalCamera,loadArchitecturalCamera}");
s=s.replace('float roughnessFactor=.53+.27*texture2D','float roughnessFactor=.66+.18*texture2D');
const calibration="state.addedElements.push(JSON.stringify(await applyNativeV23(scene,world).then(({replaced,calibrated,source})=>({replaced,calibrated,source}))));";
s=s.replace(calibration,'');
s=s.replace("scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&m.map===ashlar.map",calibration+"\n    Object.assign(state,{nativeCamera:await loadArchitecturalCamera()});\n    scene.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&m.map===ashlar.map");
s=s.replace("const gpu=renderer.getContext() as WebGL2RenderingContext;", "const gpu=renderer.getContext() as WebGL2RenderingContext;const gpuInfo=gpu.getExtension('WEBGL_debug_renderer_info');const discreteGPU=/NVIDIA|Radeon RX/.test(gpuInfo?gpu.getParameter(gpuInfo.UNMASKED_RENDERER_WEBGL):'');");
s=s.replace('if(!staticCapture)(composer.passes[0] as HomeAntialiasedPass).setSamples(0);','if(!staticCapture)(composer.passes[0] as HomeAntialiasedPass).setSamples(discreteGPU&&renderQuality>.90?4:2);');
await fs.writeFile('src/home-world.ts',s);
s=await fs.readFile('src/odyssey-scene.ts','utf8');s=s.replace('[[-7,3,1.22,0],[24,-18,1.03,2.1],[-28,-9,.90,3.2],[20,-39,.78,1.5]]','[[-7,3,1.22,0],[42,-24,1.03,2.1],[-32,-10,.92,3.2],[-10,-35,.85,1.5]]');await fs.writeFile('src/odyssey-scene.ts',s);
for(const f of ['v31.html','reading.html','learning.html']){s=await fs.readFile(f,'utf8');s=s.replaceAll('?v=32.79','?v=32.80');await fs.writeFile(f,s);}
console.log('Native camera/materials warmed before reveal; 4x MSAA discrete GPU; fleet spacing; cache versions');
