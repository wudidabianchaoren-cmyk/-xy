import fs from 'node:fs';
const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));
edit('v31-motion.js',s=>s.replace("try{returningThroughHistory=sessionStorage.getItem('brain-universe-entered')==='1';}catch{}",`try{const navigation=performance.getEntriesByType('navigation')[0];returningThroughHistory=navigation?.type==='back_forward'&&sessionStorage.getItem('brain-universe-entered')==='1';}catch{}`)
 .replace('if (!flow || !chapters) return;','if (!flow || !chapters || flow.dataset.presentation===\'scroll-collage\') return;'));
edit('src/home-world.ts',s=>{
 s="import {applyNativeV23} from './home-native-v23';\nimport {architecturalCamera} from './home-camera-v23';\n"+s;
 s=s.replace("preparing.innerHTML='<span>正在点亮森林中的小镇</span><small>THE CAMERA WILL BEGIN AUTOMATICALLY</small><i></i>';surface.append(preparing);","preparing.hidden=true;");
 s=s.replace('renderer.toneMappingExposure=.78','renderer.toneMappingExposure=.88').replace('scene.environmentIntensity=.24','scene.environmentIntensity=.16');
 s=s.replace('0x3a2512,.065','0x3a2512,.038').replace('0xb1c6c0,.065','0xb1c6c0,.045').replace('0xffe0b1,.55,9,6','0xffcf8e,.26,9,6');
 s=s.replace('state.shot=intro>=16?\'fixed-wide\':shot.shot;',"state.shot=architecturalCamera(camera,intro,track.camera.frames[0]);");
 s=s.replace('.lerp(new THREE.Color(0xffb968),.38)','.lerp(new THREE.Color(0xffa955),.72)').replace('n.energy,mix)*.93','n.energy,mix)*(1.08+.18*Math.sin(elapsed*.39))');
 s=s.replace('metalStrip.intensity=strip.energy*.025','metalStrip.intensity=strip.energy*.011');
 const marker='world.traverse(o=>{if(o instanceof THREE.Mesh&&o.geometry.index&&o.geometry.index.count>21000)';
 const i=s.indexOf(marker);if(i<0)throw Error('native hookup missing');
 s=s.slice(0,i)+"state.addedElements.push(JSON.stringify(await applyNativeV23(scene,world).then(({replaced,calibrated,source})=>({replaced,calibrated,source}))));\n    "+s.slice(i);
 return s;
});
edit('src/scene-loader.ts',s=>s.replace("const dialog=document.getElementById('odyssey');let odysseyLoaded=false,returnFocus",`const warmMyth=()=>{const links=['./blender/reference-architecture-v20/polyphemus-v20.glb','./blender/reference-architecture-v21/inhabited-island.glb','./assets/odyssey/coastal_cliff_02/coastal_cliff_02.web.gltf'];for(const href of links){const l=document.createElement('link');l.rel='prefetch';l.href=href;document.head.append(l);}void import('./odyssey-scene').catch(e=>console.error('Myth preparation failed',e));};
observe(document.getElementById('odysseyIntroduction'),'700px',warmMyth);
const dialog=document.getElementById('odyssey');let odysseyLoaded=false,returnFocus`));
edit('src/native-v20.ts',s=>s.replace('root.scale.setScalar(10.8)','root.scale.setScalar(8.5)').replace('*10.8','*8.5').replace('scale:10.8','scale:8.5')
 .replace('1-.13*w','1-.23*w').replace('1-.10*w','1-.34*w')
 .replace('const bareFigure=refineCyclops(root);',`root.traverse(o=>{if(o instanceof THREE.Mesh&&/nipple/i.test(o.name+' '+(Array.isArray(o.material)?o.material.map(m=>m.name).join(' '):o.material.name)))o.visible=false;});const bareFigure=refineCyclops(root);`));
edit('src/odyssey-scene.ts',s=>s.replace('[[-7,3,1.36,0],[20,-25,1.10,2.1],[-20,-25,.48,3.2],[10,-60,.32,1.5]]','[[-7,3,1.22,0],[24,-18,1.03,2.1],[-28,-9,.90,3.2],[20,-39,.78,1.5]]'));
edit('src/island-ground.ts',s=>s.replace('vec3(.28,.25,.19)','vec3(.19,.145,.092)').replace('vec3(.043,.073,.025)','vec3(.055,.072,.024)').replace('vec3(.34,.29,.20)','vec3(.51,.36,.16)').replace('scrub*.88','scrub*.96').replace('smoothstep(.8,3.3,coastHeight)','smoothstep(.7,5.2,coastHeight)').replace('float bedding=.90+.10','float bedding=.81+.19').replace('perturb*.35','perturb*.46').replace('continuous-coastal-habitats-v32-78','continuous-coastal-habitats-v32-80'));
// This is the three obsolete modes before the rural film, replaced by one reversible scroll composition.
edit('v31.html',s=>{
 const a=s.indexOf('    <section class="work-flow"'),b=s.indexOf('    <section class="image-chapters"',a);
 if(a<0||b<a)throw Error('image flow section missing');
 const section=`    <section class="work-flow scroll-collage" id="workFlow" data-presentation="scroll-collage" aria-label="图像、观察与记忆">
      <div class="scroll-collage-stage">
        <div class="scroll-collage-copy"><h2>图像，是想法的<br>第一种形状。</h2><h2>从观察中寻找关系，<br>让想象有迹可循。</h2><h2>让画面带着记忆，<br>回到生活。</h2></div>
        <div class="scroll-collage-images" aria-hidden="true"></div>
      </div>
    </section>\n\n`;
 return(s.slice(0,a)+section+s.slice(b)).replace('</head>','  <link rel="stylesheet" href="./v32-80.css?v=32.80">\n</head>').replace('32.79','32.80');
});
for(const p of ['reading.html','learning.html','src/reading-book.ts'])edit(p,s=>s.replaceAll('32.79&return','32.80&return'));
fs.cpSync('motion/remotion-v32-79','motion/remotion-v32-80',{recursive:true});
edit('scripts/render-opening-v32-80.mjs',s=>s); // created by caller from the existing renderer
console.log('V32.80 incremental source updates applied');
