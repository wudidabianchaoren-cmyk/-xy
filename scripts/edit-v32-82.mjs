import fs from 'node:fs/promises';
await fs.mkdir('.verify/v32-82',{recursive:true});
await fs.mkdir('motion/remotion-v32-82/src',{recursive:true});
await fs.mkdir('motion/remotion-v32-82/public',{recursive:true});
await fs.mkdir('motion/loading-study-v82',{recursive:true});
let opening=await fs.readFile('motion/loading-study-v8/opening.js','utf8');
const a=opening.indexOf('  if(t>8.4&&t<17.7)'),b=opening.indexOf('  if(t>16.9)',a);
opening=opening.slice(0,a)+`  // Three editorial beats, clear typography gutters, complete departures.
  const shots=[
   {a:8.55,b:10.80,hero:0,x:1000,y:330,size:390,detail:0,dx:1260,dy:485,ds:138},
   {a:11.02,b:13.38,hero:8,x:965,y:335,size:375,detail:2,dx:1230,dy:505,ds:150},
   {a:13.60,b:16.85,hero:6,x:980,y:345,size:370,detail:3,dx:1210,dy:520,ds:152}
  ];
  for(const shot of shots){
   const appear=smooth(shot.a,shot.a+.42,t),leave=1-smooth(shot.b-.45,shot.b,t),alpha=appear*leave;
   if(alpha<=0)continue;
   const u=smooth(shot.a,shot.b,t),px=shot.x+mix(24,-12,u),py=shot.y+mix(12,-6,u);
   engraving(shot.hero,px,py,shot.size*(.975+.025*u),.012,alpha);
   discoveryAccent(shot.detail,shot.dx-10*u,shot.dy,shot.ds,alpha*.48,0);
   if(shot.hero===6){discoveryAccent(4,730,520,126,alpha*.42,0);discoveryAccent(5,1275,235,118,alpha*.36,0);}
   orbit(q,1000,350,285,alpha*.33);glow(1000,350,210,alpha*.18);
   line([[505,340],[665,340],[755,390]],brass,1.1,alpha*.42);
   text('PERCEPTION BECOMES A WAY OF MAKING.',230,240,12,alpha*.68);
   text('THE WORLD BEGINS WITH A QUESTION.',230,263,12,alpha*.52);
  }
  for(const [i,a,b] of [[0,5.55,6.72],[1,6.94,8.23]]){
   const alpha=accentWindow(t,a,b);discoveryAccent(i,1220,215,166,alpha*.58,0);
  }
`+opening.slice(b);
opening=opening.replace("text('MIND UNIVERSE',768,371,62,hold);text('A LIVING DIGITAL ARCHIVE',768,412,13,hold*.68);","const exit=smooth(19.08,19.92,t);ctx.translate(768,360);ctx.scale(1-exit*.07,1-exit*.07);ctx.translate(-768,-360);text('MIND UNIVERSE',768,371,62,hold*(1-exit));text('A LIVING DIGITAL ARCHIVE',768,412,13,hold*.68*(1-exit));line([[768-110*(1-exit),447],[768+110*(1-exit),447]],brass,1,hold*(1-exit)*.5);");
opening=opening.replace("const entrance=smooth(chapter[0],chapter[0]+.32,t);","const entrance=smooth(chapter[0],chapter[0]+.32,t)*(1-smooth(19.15,19.92,t));").replace("1050,700,10,.40);","1050,700,10,.40*(1-smooth(19.15,19.92,t))); ");
await fs.writeFile('motion/loading-study-v82/opening.js',opening);
await fs.writeFile('motion/remotion-v32-82/src/index.tsx',(await fs.readFile('motion/remotion-v32-80/src/index.tsx','utf8')).replace('loading-study-v8','loading-study-v82'));
await fs.cp('motion/remotion-v32-80/toolchain-lock','motion/remotion-v32-82/toolchain-lock',{recursive:true});
await fs.writeFile('scripts/render-opening-v32-82.mjs',(await fs.readFile('scripts/render-opening-v32-80.mjs','utf8')).replaceAll('v32-80','v32-82').replaceAll('loading-study-v8','loading-study-v82'));
let html=await fs.readFile('v31.html','utf8');const start=html.indexOf('    <section class="work-flow scroll-collage"'),end=html.indexOf('    <section class="image-chapters"',start),flow=html.slice(start,end);html=html.slice(0,start)+html.slice(end);html=html.replace('    <section class="odyssey-prologue"',flow+'    <section class="odyssey-prologue"');
html=html.replace('07 / LETTER','07 / RAIN').replace('Drops descend through empty space; ripples cross the envelope before the image releases.','Drops meet an unseen surface; quiet ripples spread, overlap and return to stillness.').replaceAll('v=32.81','v=32.82').replaceAll('loading-study-v32-80.mp4','loading-study-v32-82.mp4').replaceAll('opening-poster-v32-80.png','opening-poster-v32-82.png');
html=html.replace('</head>','  <link rel="stylesheet" href="./v32-82.css?v=32.82">\n</head>');await fs.writeFile('v31.html',html);
let nav=await fs.readFile('src/home-navigation.ts','utf8');nav=nav.replace('root.hidden=!enabled;','root.hidden=true;');await fs.writeFile('src/home-navigation.ts',nav);
let motion=await fs.readFile('v31-motion.js','utf8');
motion=motion.replace('overlay.classList.add("is-open", "v31-index-open");','if(overlay.classList.contains("v31-index-open"))return;\n      overlay.classList.add("is-open", "v31-index-open");');
motion=motion.replace('trigger.addEventListener("pointerdown", openIndex, true);','').replace('close.addEventListener("pointerdown", closeIndex, true);','').replace('list.addEventListener("pointerdown", selectIndex, true);','');await fs.writeFile('v31-motion.js',motion);
let sand=await fs.readFile('v31-sand-story.js','utf8');const pos=sand.indexOf('  function createField()');
sand=sand.slice(0,pos)+`  function sampleRainSurface(){
    const N=PARTICLE_COUNT,random=randomGenerator(9733),positions=new Float32Array(N*3),uv=new Float32Array(N*2),opacity=new Float32Array(N),density=new Float32Array(N),focus=new Float32Array(N);
    for(let i=0;i<N;i++){const x=(random()-.5)*2.7,y=-.52+random()*.70;positions.set([x,y,.25-(y+.52)*1.2],i*3);uv.set([.5+x/3.48,.5+y/1.96],i*2);const edge=Math.exp(-Math.pow(x/1.15,6)-Math.pow((y+.2)/.30,6));opacity[i]=edge*.018;density[i]=.18;focus[i]=.4;}
    return{positions,uv,opacity,density,focus,detail:{positions:positions.slice(),uv:uv.slice(),opacity:new Float32Array(N),density:density.slice(),focus:focus.slice()}};
  }
`+sand.slice(pos);
sand=sand.replace('const envelopeTarget = sampleEnvelopeVolume();','const envelopeTarget = sampleRainSurface();').replace('detailParticles.visible = state.scene === 6;','detailParticles.visible = false;');
const ra=sand.indexOf('          float pulse=fract(uTime*.73)'),rb=sand.indexOf('\n        }',ra);
sand=sand.slice(0,ra)+`          float rings=0.;
          for(int hit=0;hit<5;hit++){
            float id=float(hit),pulse=fract(uTime*.51+id*.193);
            vec2 center=vec2((hash11(id*13.1+8.)-.5)*1.8,-.40+hash11(id*37.7+2.)*.49);
            float radial=length((shape.xy-center)*vec2(1.,2.15));
            float ring=exp(-pow((radial-pulse*.44)/.014,2.))*(1.-pulse)*(1.-pulse);
            rings+=ring;shape.y+=sin(radial*80.-pulse*30.)*ring*.003;
          }
          float surfaceFade=exp(-pow(shape.x/1.15,6.)-pow((shape.y+.20)/.30,6.));
          shapeOpacity=surfaceFade*(.005+min(rings,1.)*.28);
`+sand.slice(rb);await fs.writeFile('v31-sand-story.js',sand);
console.log('V32.82 opening, order, navigation labels and rain surface edited');
