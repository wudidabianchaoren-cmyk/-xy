import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
await mkdir('motion/loading-study-v7',{recursive:true});
let source=await readFile('motion/loading-study-v6/opening.js','utf8');
source=source.replace(" const brass='#ded391',ivory='#e7e4d8';",` const brass='#ded391',ivory='#e7e4d8';
 const discovery=new Image();discovery.src=options.discoveryAtlasUrl||'../../assets/loading-study/v32-76/discovery-atlas.png';await discovery.decode();
 // Process the generated engravings as collage plates: separate alpha from atmospheric wash,
 // then restrain the palette to the original ivory / brass film. This is animation compositing.
 const art=document.createElement('canvas');art.width=discovery.width;art.height=discovery.height;const ink=art.getContext('2d');ink.drawImage(discovery,0,0);
 const pixels=ink.getImageData(0,0,art.width,art.height);for(let k=0;k<pixels.data.length;k+=4){const p=pixels.data,a=p[k+3]/255,l=.2126*p[k]+.7152*p[k+1]+.0722*p[k+2];
  const isolated=smooth(.56,.86,a);p[k+3]=Math.round(p[k+3]*isolated);p[k]=mix(l,p[k],.23);p[k+1]=mix(l*.965,p[k+1],.23);p[k+2]=mix(l*.84,p[k+2],.23);
 }ink.putImageData(pixels,0,0);`);
const start=source.indexOf(' function engraving('),end=source.indexOf(' function body(',start);
if(start<0||end<0)throw Error('Original illustration boundary missing');
source=source.slice(0,start)+` function engraving(i,x,y,s,angle,alpha){
  const cell=i===0?0:i===8?1:i===6?2:3,cw=art.width/2,ch=art.height/2;
  if(i===0){x+=18;y+=95;s*=.90;}if(i===8){x+=95;s*=.80;}
  ctx.save();ctx.translate(x,y);ctx.rotate(i===0?0:i===6?.035*Math.sin(angle*2):angle*.35);
  // Generous gutters and a soft reveal keep the plates readable; no poster rectangles.
  ctx.globalCompositeOperation='screen';ctx.globalAlpha=alpha*.92;
  const width=s*(i===0?1.10:1),height=width*ch/cw;
  const inset=cell===3?135:0;ctx.drawImage(art,(cell%2)*cw+inset,Math.floor(cell/2)*ch,cw-inset,ch,-width/2+width*inset/cw,-height/2,width*(1-inset/cw),height);ctx.restore();
 }
`+source.slice(end);
await writeFile('motion/loading-study-v7/opening.js',source);
await cp('motion/remotion-v32-75','motion/remotion-v32-76',{recursive:true,filter:f=>!f.includes('public')&&!f.includes('node_modules')});
let entry=await readFile('motion/remotion-v32-76/src/index.tsx','utf8');entry=entry.replace('loading-study-v6','loading-study-v7').replace("{atlasUrl:staticFile('expanded-scientific-atlas.png'),legacyAtlasUrl:staticFile('perception-engraving-atlas.png')}","{discoveryAtlasUrl:staticFile('discovery-atlas.png')}");
await writeFile('motion/remotion-v32-76/src/index.tsx',entry);
await writeFile('motion/loading-study-v7/preview.html',`<!doctype html><html><meta charset="utf-8"><style>html,body{margin:0;background:#030403}canvas{width:100vw;height:100vh;object-fit:contain}</style><canvas id="film"></canvas><script src="opening.js"></script><script>createOpeningFilm(document.getElementById('film')).then(f=>{window.film=f;f.draw(10.5);window.reviewOpening=t=>f.draw(t);})</script></html>`);
let render=await readFile('scripts/render-opening-v32-75.mjs','utf8');render=render.replaceAll('v32-75','v32-76').replaceAll('loading-study-v6','loading-study-v7').replaceAll('concurrency:1','concurrency:2');
const a=render.indexOf("await copyFile('assets/loading-study/v32-72/"),z=render.indexOf('const serveUrl=',a);render=render.slice(0,a)+"await copyFile('assets/loading-study/v32-76/discovery-atlas.png',folder+'/public/discovery-atlas.png');\n"+render.slice(z);
await writeFile('scripts/render-opening-v32-76.mjs',render);
console.log('Opening illustration edit prepared; original human, chapter timing and speed keys retained.');
