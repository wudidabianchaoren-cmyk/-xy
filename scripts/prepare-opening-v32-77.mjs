import {readFile,writeFile,mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('assets/loading-study/v32-77',{recursive:true});
await copyFile('F:/codex吴翔宇/generated_images/01a11f96-341b-7750-8673-561905b7871b/exec-ae0372cf-6f46-4582-9403-4c23a6b05399.png','assets/loading-study/v32-77/discovery-additions.png');
await mkdir('motion/loading-study-v8',{recursive:true});
let s=await readFile('motion/loading-study-v7/opening.js','utf8');
s=s.replace(" const marks=[[0,0]",` const extra=new Image();extra.src=options.additionsAtlasUrl||'../../assets/loading-study/v32-77/discovery-additions.png';await extra.decode();
 const additions=document.createElement('canvas');additions.width=extra.width;additions.height=extra.height;const extraInk=additions.getContext('2d');extraInk.drawImage(extra,0,0);
 const extraPixels=extraInk.getImageData(0,0,extra.width,extra.height);for(let k=0;k<extraPixels.data.length;k+=4){const p=extraPixels.data,a=p[k+3]/255,l=.2126*p[k]+.7152*p[k+1]+.0722*p[k+2];p[k+3]=Math.round(p[k+3]*smooth(.56,.86,a));p[k]=mix(l,p[k],.23);p[k+1]=mix(l*.965,p[k+1],.23);p[k+2]=mix(l*.84,p[k+2],.23);}extraInk.putImageData(extraPixels,0,0);
 const marks=[[0,0]`);
const extraDraw=` function discoveryAccent(i,x,y,size,alpha,turn=0){
  const cw=additions.width/3,ch=additions.height/2;
  ctx.save();ctx.translate(x,y);ctx.rotate(turn);ctx.globalCompositeOperation='screen';ctx.globalAlpha=alpha;
  ctx.drawImage(additions,(i%3)*cw,Math.floor(i/3)*ch,cw,ch,-size/2,-size/2,size,size);ctx.restore();
 }
 function accentWindow(t,a,b){return smooth(a,a+.55,t)*(1-smooth(b-.45,b,t));}
 // A small time lead through discovery, returning to the accepted closing hold.
 function storyTime(t){return t+.30*smooth(1.8,4.5,t)*(1-smooth(15.3,17.3,t));}
`;
s=s.replace(' function body(',extraDraw+' function body(');
s=s.replace('function draw(t){t=Math.min(19.999,Math.max(0,t));const q=clock(t)', 'function draw(t){const realTime=t;t=storyTime(Math.min(19.999,Math.max(0,t)));const q=clock(t)*1.035');
s=s.replace('  if(t>16.9){',`  discoveryAccent(0,1260,388,194,accentWindow(t,5.4,8.5)*.64,-.025);
  discoveryAccent(1,1258,243,190,accentWindow(t,7.5,10.7)*.58,q*.008);
  discoveryAccent(2,1300,548,174,accentWindow(t,9.1,12.8)*.54);
  discoveryAccent(3,480,452,184,accentWindow(t,12.4,15.7)*.62,-.018);
  discoveryAccent(4,990,542,175,accentWindow(t,13.3,16.5)*.55,.018);
  discoveryAccent(5,1270,436,176,accentWindow(t,14.9,17.4)*.58,q*.006);
  if(t>16.9){`);
s=s.replace('return {time:t,chapter:ci','return {time:realTime,storyTime:t,chapter:ci');
await writeFile('motion/loading-study-v8/opening.js',s);
await writeFile('motion/loading-study-v8/preview.html','<!doctype html><html><meta charset="utf-8"><style>html,body{margin:0;background:#030403}canvas{width:100vw;height:100vh;object-fit:contain}</style><canvas id="film"></canvas><script src="opening.js"></script><script>createOpeningFilm(document.getElementById("film")).then(f=>{window.film=f;f.draw(14.2);window.reviewOpening=t=>f.draw(t);})</script></html>');
await cp('motion/remotion-v32-76','motion/remotion-v32-77',{recursive:true,filter:f=>!f.includes('public')&&!f.includes('node_modules')});
let entry=await readFile('motion/remotion-v32-77/src/index.tsx','utf8');entry=entry.replace('loading-study-v7','loading-study-v8').replace("discoveryAtlasUrl:staticFile('discovery-atlas.png')","discoveryAtlasUrl:staticFile('discovery-atlas.png'),additionsAtlasUrl:staticFile('discovery-additions.png')");await writeFile('motion/remotion-v32-77/src/index.tsx',entry);
let render=await readFile('scripts/render-opening-v32-76.mjs','utf8');render=render.replaceAll('v32-76','v32-77').replaceAll('loading-study-v7','loading-study-v8');render=render.replace("await copyFile('assets/loading-study/v32-77/discovery-atlas.png'","await copyFile('assets/loading-study/v32-76/discovery-atlas.png'");render=render.replace('const serveUrl=',"await copyFile('assets/loading-study/v32-77/discovery-additions.png',folder+'/public/discovery-additions.png');\nconst serveUrl=");await writeFile('scripts/render-opening-v32-77.mjs',render);
console.log('Six complementary motifs; mild time lead; 20s closing unchanged');
