from pathlib import Path
import re
P=Path(__file__).resolve().parents[1]
def revise(file,fn):
 f=P/file;s=f.read_text(encoding='utf8');f.write_text(fn(s),encoding='utf8')
revise('v31-motion.js',lambda s:s.replace('loading-study-v32-72.mp4?v=32.72','loading-study-v32-73.mp4?v=32.73').replace('opening-poster-v32-72.png','opening-poster-v32-73.png'))
revise('src/scene-loader.ts',lambda s:s.replace('v31-sand-story.js?v=32.58','v31-sand-story.js?v=32.73'))
def home(s):
 s=s.replace('home-live-poster-v32-72.png','home-live-poster-v32-73.png').replace("import('./native-v18')","import('./native-v19')")
 s=s.replace('renderer.toneMappingExposure=.92','renderer.toneMappingExposure=.98').replace('new THREE.FogExp2(0x111b1c,.014)','new THREE.FogExp2(0x101919,.023)').replace('scene.environmentIntensity=.16','scene.environmentIntensity=.24')
 s=s.replace('masonryFill=new THREE.RectAreaLight(0xffead0,.35,9,6)','masonryFill=new THREE.RectAreaLight(0xffead0,.65,9,6)').replace('rim=new THREE.DirectionalLight(0xd3cdb8,.06)','rim=new THREE.DirectionalLight(0xb1c6c0,.19)')
 s=s.replace('sun.intensity=key.energy*1.12','sun.intensity=key.energy*1.35').replace('sun.angle=.88;sun.penumbra=.46','sun.angle=.74;sun.penumbra=.62')
 s=s.replace('ao.blendIntensity=.9','ao.blendIntensity=1.15').replace('radius:.65,distanceExponent:1.4,thickness:.8','radius:.44,distanceExponent:1.7,thickness:.7')
 s=s.replace('m.roughness=.89;m.normalScale.set(.46,.46);m.envMapIntensity=.40','m.roughness=.83;m.normalScale.set(.36,.36);m.envMapIntensity=.36')
 s=s.replace('ageMasonry(m,.19)','ageMasonry(m,.10);calibrateMasonry(m)')
 s=s.replace("import {ageMasonry,courtyardAtmosphere}","import {ageMasonry,courtyardAtmosphere,calibrateMasonry}")
 s=s.replace("m.roughness=.28;m.metalness=1","m.roughness=.23;m.metalness=1;m.envMapIntensity=2.0")
 s=s.replace("surfaceDetail:'2K wide / 4K close'","surfaceDetail:'2K wide / 4K close',materialCalibration:'metre-scale masonry; filtered near grain; honed bronze; local contact AO'")
 return s
revise('src/home-world.ts',home)
revise('src/home-forest.ts',lambda s:s.replace("woodlandRim=new THREE.DirectionalLight(0xa3b3a0,.24)","woodlandRim=new THREE.DirectionalLight(0xa3b3a0,.11)").replace('envMapIntensity:.4','envMapIntensity:.18').replace(".23+random()*.12",".18+random()*.09"))
def sea(s):
 s=s.replace("from './native-v18'","from './native-v19'")
 s=s.replace("import {SeaAtmosphere}","import {createOdysseyDepth} from './odyssey-world-depth';\nimport {SeaAtmosphere}")
 s=s.replace('const cyclops=await nativeMythology(scene,rock);','const cyclops=await nativeMythology(scene,rock);\n  const worldDepth=createOdysseyDepth(scene);')
 # New continuous islands already occupy the foreground; keep the distant scanned geology.
 s=s.replace('coast(-23,-72,.55,1.5,.9,1.25);','// Former isolated foreground reef replaced by a continuous island.')
 s=s.replace('for(let i=0;i<44;i++)','for(let i=0;i<18;i++)')
 s=s.replace('coast(-71,-160,.63,2.65,1.1,0);coast(-43,-178,.62,3.35,1.2,.2);','coast(-85,-170,.63,2.1,1.1,0);coast(-43,-178,.62,2.5,1.2,.2);')
 s=s.replace('atmosphere.uniforms.time.value=time;clothTime.value=time','atmosphere.uniforms.time.value=time;worldDepth.update(time);clothTime.value=time')
 s=s.replace("giantSurface:'Native Blender reclining Polyphemus across a natural cliff, as described by the National Gallery'","worldDepth:{continentalWidth:worldDepth.continentalWidth,distances:worldDepth.distances,rainDrops:worldDepth.rainDrops,aerosols:worldDepth.aerosols},giantSurface:'Blender MCP V19 upright supported shepherd with no held ball'")
 return s
revise('src/odyssey-scene.ts',sea)
revise('src/odyssey-story.ts',lambda s:s.replace('reclining Polyphemus silhouette across the cliff','upright Polyphemus on a continuous island'))
def air(s):
 s=s.replace('reach=min(totalDistance,1100.)','reach=min(totalDistance,1800.)')
 s=s.replace('.0033*exp(-max(world.y,0.)*.055)+.0060*lowBank','.0017*exp(-max(world.y,0.)*.035)+.0048*lowBank')
 s=s.replace('color=mix(color,horizonHaze,farSea*.94)','float land=smoothstep(1.,24.,p.y);float aerial=1.-exp(-max(0.,totalDistance-600.)*.00018);\n      color=mix(color,horizonHaze,max(farSea*mix(.50,.18,land),aerial*.62))')
 s=s.replace('color=mix(color,horizonHaze,distantHorizon)','color=mix(color,horizonHaze,distantHorizon*(1.-land)*.85)')
 return s
revise('src/odyssey-atmosphere.ts',air)
# Preserve the original rain mechanism, but restore enough visible beads and a measurable receiver wave.
def envelope(s):
 start=s.index('  function sampleEnvelopeVolume()');end=s.index('  function createField()',start)
 new='''  function sampleEnvelopeVolume() {
    const random=randomGenerator(973373),N=PARTICLE_COUNT;
    const positions=new Float32Array(N*3),uv=new Float32Array(N*2),opacity=new Float32Array(N),density=new Float32Array(N),focus=new Float32Array(N);
    // A paper packet: planar surfaces, bowed contents, inset triangular flap and substantial side walls.
    // Project the entire solid into an oblique view so thickness remains visible without mouse movement.
    const project=(x,y,z)=>[x*.94+z*.31,y*.80+z*.38-.12,-x*.13-y*.30+z*.86];
    const width=1.92,height=1.08,depth=.18;
    for(let i=0;i<N;i++){
      let x=(random()-.5)*width,y=(random()-.5)*height,z=depth*.5,shade=.22,alpha=.31;
      const kind=random(),u=x/width+.5,v=y/height+.5;
      if(kind<.71){
        const tip=-.10,flapY=.54-Math.abs(x)*(.64/.96),isFlap=y>flapY;
        z+=.040*Math.sin(Math.PI*u)*Math.sin(Math.PI*v)+(isFlap?.012:0);
        shade=isFlap?.14:.28;shade+=.13*(1-v);
        const d=Math.abs(y-flapY),crease=Math.exp(-d*d/.000025);
        shade+=crease*.24;alpha=.16+shade*.67;
      }else if(kind<.86){
        // The lower and right walls form a continuous, visibly shaded packet edge.
        if(random()<.66){y=-height*.5;z=(random()-.5)*depth;shade=.72;alpha=.78;}
        else {x=width*.5;z=(random()-.5)*depth;shade=.64;alpha=.73;}
      }else if(kind<.94){
        x=-width*.5;z=(random()-.5)*depth;shade=.47;alpha=.60;
      }else{
        y=height*.5;z=(random()-.5)*depth;shade=.34;alpha=.48;
      }
      const p=project(x,y,z);positions.set(p,i*3);uv.set([.5+p[0]/3.48,.5+p[1]/1.96],i*2);
      density[i]=shade;opacity[i]=alpha;focus[i]=.5+shade*.2;
    }
    return {positions,uv,opacity,density,focus,detail:{positions:positions.slice(),uv:uv.slice(),opacity:new Float32Array(N),density:density.slice(),focus:focus.slice()}};
  }

'''
 s=s[:start]+new+s[end:]
 s=s.replace('step(.16, hash11(aSeed * 47.17 + 3.0))','step(.35, hash11(aSeed * 47.17 + 3.0))').replace('step(.09, hash11(aSeed * 613.17 + 79.0))','step(.25, hash11(aSeed * 613.17 + 79.0))')
 s=s.replace('float amplitude = uScene > 5.5 ? .002 : .011;','float amplitude = uScene > 5.5 ? .012 : .011;')
 anchor='''        if (uScene > 3.5 && uScene < 4.5) shape.x += recoil * .014;'''
 extra='''
        if (uScene > 5.5) {
          float pulse=fract(uTime*.73),waveRadius=pulse*.91;
          vec2 contact=shape.xy-vec2(-.17,-.055);
          float radial=length(contact*vec2(1.,1.40));
          float ring=exp(-pow((radial-waveRadius)/.038,2.))*(1.-pulse);
          shape.z+=sin(radial*53.-uTime*24.)*ring*.025;
          shapeOpacity*=1.-ring*.23;
        }'''
 assert anchor in s;s=s.replace(anchor,anchor+extra)
 return s
revise('v31-sand-story.js',envelope)
def html(s):
 s=s.replace('aria-label="五张制作札记同时展示"','aria-label="展开或收起五张制作札记" role="button" tabindex="0" aria-expanded="false" aria-describedby="lifeDeckHint"').replace('class="life-process-grid" role="region"','class="life-process-grid"')
 s=s.replace('记录故事、素材、动作、声音与最后的收束。','记录故事、素材、动作、声音与最后的收束。<span id="lifeDeckHint">点击纸牌，展开五个创作片刻；再次点击，收起收藏。</span>')
 marker='''    </section>
  </main>'''
 epilogue='''    </section>
    <section class="portfolio-epilogue" id="portfolioEpilogue" aria-labelledby="epilogueTitle">
      <div class="epilogue-topline"><span>EPILOGUE / STILL BECOMING</span><span>WU XIANGYU · 脑海宇宙</span></div>
      <div class="epilogue-orbit" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
      <div class="epilogue-main"><small>A NOTE TO THE AGE OF AI</small><h2 id="epilogueTitle">工具会进化，<br>判断要由我来做。</h2><p class="epilogue-lead">我做这个作品集，<br>是为了让脑海中的世界，成为可以被走近的体验。</p>
        <div class="epilogue-body"><p>从森林里的钟楼，到一封被雨滴触碰的信；从西游的图像世界，到驶出名画的船，再到一句提示词长成的电影。这里收藏的是我对时间、记忆、空间和日常生活的观察。我尝试让图像有结构，让叙事有节奏，让交互有回应，让每个技术选择都落到人的感受上。</p>
        <p>AI 改变了想法成为作品的路径，也让我不断追问：当生成越来越容易，我愿意为什么负责？我希望自己能提出值得制作的问题，理解材料与工具，辨认画面的好坏，并通过一次次试验，把想象做成完整的表达。速度给了我更多尝试的机会，审美与判断决定这些尝试走向哪里。</p>
        <p>在我看来，AI 时代需要能把观察、设计与实现连起来的人：有好奇心去学习，有能力去协作，也有耐心检验细节、承担结果。我想成为这样的创作者。脑海宇宙会继续生长，而我会继续练习——让技术的可能，成为有意义、有温度、可以被别人感受到的作品。</p></div>
      </div>
      <footer class="epilogue-footer"><span>THE ARCHIVE ENDS HERE. CURIOSITY CONTINUES.</span><a href="#voyage" data-epilogue-return>回到宇宙的入口 ↗</a></footer>
    </section>
  </main>'''
 assert marker in s;s=s.replace(marker,epilogue)
 s=s.replace('最后一页 / 生命的意义 ↗','代码电影 / 创作实验 ↗')
 return s
revise('v31.html',html)
print('Six requested areas updated incrementally; film and original camera paths retained.')
