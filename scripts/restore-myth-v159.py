from pathlib import Path
p=Path(__file__).resolve().parents[1]
s=(p/'src/coast-v158.ts').read_text(encoding='utf-8').replace('coastV158','coastV159')
needle=" };material.customProgramCacheKey=()=> 'v158-shared-wave-wet-sand-coastal-bedrock-pbr';"
new=''' };
 const nativeGround=await tx.loadAsync('./assets/odyssey/restored-v159/island-native-rgbe.png');nativeGround.colorSpace=T.NoColorSpace;nativeGround.flipY=false;nativeGround.generateMipmaps=false;nativeGround.minFilter=nativeGround.magFilter=T.NearestFilter;
 const nativeNight={value:0};state.nativeGroundNight=nativeNight;const coastCompile=material.onBeforeCompile;
 material.onBeforeCompile=(shader,renderer)=>{coastCompile(shader,renderer);shader.uniforms.nativeGround={value:nativeGround};shader.uniforms.nativeNight=nativeNight;
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\\nattribute vec2 uv1;varying vec2 nativeGroundUV;').replace('#include <begin_vertex>','#include <begin_vertex>\\nnativeGroundUV=vec2(uv1.x,1.-uv1.y);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
   uniform sampler2D nativeGround;uniform float nativeNight;varying vec2 nativeGroundUV;
   vec3 decodeGround(ivec2 p){ivec2 sz=textureSize(nativeGround,0);vec4 v=texelFetch(nativeGround,clamp(p,ivec2(0),sz-ivec2(1)),0);return v.rgb*exp2(v.a*255.-128.);}
   vec3 readGround(vec2 uv){vec2 q=clamp(uv,vec2(0.),vec2(1.))*vec2(textureSize(nativeGround,0))-.5;ivec2 a=ivec2(floor(q));vec2 f=fract(q);return mix(mix(decodeGround(a),decodeGround(a+ivec2(1,0)),f.x),mix(decodeGround(a+ivec2(0,1)),decodeGround(a+ivec2(1,1)),f.x),f.y);}`)
   .replace('#include <opaque_fragment>',`float slopeNative=1.-abs(normalize(coastN).y);float variationNative=.5+.5*sin(coastP.x*.17+sin(coastP.z*.21)*2.5);
   float soilNative=smoothstep(3.,7.,coastP.y)*(1.-smoothstep(.25,.62,slopeNative))*(.65+.35*variationNative);
   float soilDetailNative=clamp(dot(texture2D(soilColor,coastP.xz*.56).rgb,vec3(.2126,.7152,.0722))*5.,.58,1.42);
   vec3 originalNative=readGround(nativeGroundUV)*mix(vec3(.65,.70,.68),vec3(.23,.31,.15)*soilDetailNative,soilNative*.84);
   originalNative*=mix(vec3(1.),vec3(.105,.16,.25),nativeNight);outgoingLight=mix(outgoingLight,originalNative,smoothstep(2.,5.,coastP.y));
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'v159-restored-native-cycles-ground-and-wet-coast';state.groundRestoration={source:'original V134 CUDA Cycles 4096 radiance, delivered in 2048 RGBE without tone mapping',originalTerrainUV1:true,shoreUsesLivePBR:true,upperGroundIsNotRelit:true};'''
assert needle in s;s=s.replace(needle,new);(p/'src/coast-v159.ts').write_text(s,encoding='utf-8')
s=(p/'src/mythology-local-v158.ts').read_text(encoding='utf-8').replace("coastV158} from './coast-v158'","coastV159} from './coast-v159'").replace('await coastV158(','await coastV159(').replace('version:158','version:159').replace('./assets/odyssey/refit-v149/meadow-v149.glb','./assets/odyssey/refit-v148/grass-grounded-c.glb')
a=s.index(' grass.scene.traverse(');b=s.index('\n\n ship.scene',a)
s=s[:a]+''' let grassVertices=0;grass.scene.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const g=o.geometry,p=g.getAttribute('position');grassVertices+=p.count;const m=new THREE.MeshStandardMaterial({color:0x6d7443,roughness:.96,envMapIntensity:.28,side:THREE.DoubleSide});o.material=m;o.receiveShadow=true;o.castShadow=false;
 const parent=Array.from({length:p.count},(_,i)=>i),find=(n:number):number=>parent[n]===n?n:parent[n]=find(parent[n]);const ids=g.index;
 for(let j=0;j<(ids?.count??p.count);j+=3){const a=ids?ids.getX(j):j;for(let k=1;k<3;k++){const b=ids?ids.getX(j+k):j+k;parent[find(b)]=find(a);}}
 const lows=new Map<number,number>();for(let i=0;i<p.count;i++){const root=find(i);lows.set(root,Math.min(lows.get(root)??Infinity,p.getY(i)));}const weights=new Float32Array(p.count);for(let i=0;i<p.count;i++)weights[i]=THREE.MathUtils.clamp((p.getY(i)-lows.get(find(i))!)/.30,0,1);g.setAttribute('coastalBend',new THREE.BufferAttribute(weights,1));
 m.onBeforeCompile=shader=>{shader.uniforms.coastalWind=clock;shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\\nattribute float coastalBend;uniform float coastalWind;').replace('#include <begin_vertex>','#include <begin_vertex>\\ntransformed.x+=sin(position.z*.7+coastalWind*.6+position.x*.4)*.035*coastalBend;transformed.z+=cos(coastalWind*.43+position.x)*.022*coastalBend;');};m.customProgramCacheKey=()=> 'v159-native-low-tussock-rooted-breeze';});scene.add(grass.scene);state.coastalGrass={source:'V148 original low grounded coastal tussocks',vertices:grassVertices,denseMeadowRemoved:true,rootedBreeze:true};''' +s[b:]
s=s.replace('weather.update(dt,time);clock.value=time;','weather.update(dt,time);if(state.nativeGroundNight)state.nativeGroundNight.value=state.nightMix||0;clock.value=time;')
(p/'src/mythology-local-v159.ts').write_text(s,encoding='utf-8')
h=(p/'mythology.html').read_text(encoding='utf-8').replace('mythology-local-v158.js?v=32.158','mythology-local-v159.js?v=32.159').replace('mythology-offline-v158.js?v=32.158','mythology-offline-v159.js?v=32.159').replace('navigation-v152.js?v=32.158','navigation-v152.js?v=32.159');(p/'mythology.html').write_text(h,encoding='utf-8')
for name in ['mythology-offline-v158.js','mythology-sw-v158.js']:
 q=p/name
 if not q.exists():continue
 t=q.read_text(encoding='utf-8').replace('v158','v159').replace('32.158','32.159').replace('meadow-v149.glb','grass-grounded-c.glb').replace('refit-v149/grass-grounded-c.glb','refit-v148/grass-grounded-c.glb')
 if name.startswith('mythology-sw'):t=t.replace("const ASSETS = [","const ASSETS = ['./assets/odyssey/restored-v159/island-native-rgbe.png',")
 (p/name.replace('v158','v159')).write_text(t,encoding='utf-8')
build=(p/'scripts/build-v158-myth.mjs').read_text(encoding='utf-8').replace('158','159');(p/'scripts/build-v159-myth.mjs').write_text(build,encoding='utf-8');print('V159 native ground/low grass source prepared.')
