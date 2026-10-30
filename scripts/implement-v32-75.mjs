import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
const edit=async(f,fn)=>writeFile(f,fn(await readFile(f,'utf8')));
const replace=(s,a,b)=>{if(!s.includes(a))throw Error('Missing exact edit: '+a.slice(0,70));return s.replace(a,b);};
await mkdir('motion/loading-study-v6',{recursive:true});
let film=await readFile('motion/loading-study-v5/opening.js','utf8');
const start=film.indexOf(' function engraving('),end=film.indexOf(' function body(',start);
if(start<0||end<0)throw Error('Existing choreography source missing');
film=film.slice(0,start)+String.raw` function engraving(i,x,y,s,angle,alpha){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(s/440,s/440);ctx.globalCompositeOperation='screen';
  const draw=(p,w=1.6,a=1)=>line(p,ivory,w,alpha*a);
  function plate(p,shade='#393a32'){ctx.save();ctx.globalAlpha=alpha*.70;ctx.fillStyle=shade;ctx.beginPath();p.forEach((q,j)=>j?ctx.lineTo(...q):ctx.moveTo(...q));ctx.closePath();ctx.fill();ctx.restore();draw([...p,p[0]],2.1);}
  const oval=(x,y,rx,ry,w=1,a=.7)=>{const p=[];for(let j=0;j<=80;j++){const t=j/80*Math.PI*2;p.push([x+Math.cos(t)*rx,y+Math.sin(t)*ry]);}draw(p,w,a);};
  if(i===0){ // Hand-drill fire-making: a wooden spindle, hearth board, tinder and flame.
   plate([[-175,104],[-40,77],[160,98],[173,124],[27,149],[-175,126]],'#34352a');
   draw([[-175,104],[19,124],[173,99]],1.5);for(let k=0;k<19;k++){let yy=107+k*1.6;draw([[-159,yy],[-55,yy-9],[15,yy+14],[147,yy-3]],.65,.42);}
   plate([[-39,100],[-27,-123],[-12,-137],[-2,-122],[-17,105]],'#777764');
   for(let k=0;k<5;k++)draw([[-32+k*3,92],[-23+k*3,-113]],.65,.50);
   draw([[-37,-115],[-7,-126]],1.1);oval(-23,106,19,5,1.2);
   for(let k=0;k<35;k++){const a=k*2.4,r=9+random(k)*34;draw([[16+Math.cos(a)*r,104+Math.sin(a)*r*.3],[36+Math.cos(a+.8)*r,111+Math.sin(a+.8)*r*.3]],.8,.48);}
   plate([[41,99],[20,73],[31,36],[41,59],[64,6],[65,-38],[85,15],[77,45],[100,23],[102,69],[76,99]],'#a79962');
   draw([[51,95],[45,66],[65,38],[63,14],[79,66],[72,89]],1.7,.86);
   for(let k=0;k<18;k++)draw([[110+k*2,108-k*1.7],[150+k*2,107-k*1.7]],.65,.32);
   for(let k=0;k<15;k++){let xx=58+Math.sin(k*3.7)*42,yy=-48-k*4.6;draw([[xx,yy],[xx+1,yy-4]],.9,.28);}
  }else if(i===8){ // Knapped flint: broad fractured planes, a core and detached cutting flake.
   const p=[[-80,126],[-130,64],[-107,-25],[-63,-118],[0,-145],[79,-101],[122,-30],[114,78],[46,137]];plate(p,'#525348');
   const cuts=[[[-63,-118],[-17,-57],[79,-101]],[[-107,-25],[-17,-57],[-37,45],[-80,126]],[[122,-30],[52,-12],[46,137]],[[114,78],[25,56],[-37,45]]];cuts.forEach(q=>draw(q,1.7,.84));
   for(let k=0;k<27;k++){const yy=-90+k*6;draw([[-67,yy],[-37+Math.sin(k*.6)*26,yy+17]],.75,.53);draw([[50,yy+13],[83,yy+38]],.65,.44);}
   plate([[143,87],[177,10],[205,52],[184,119]],'#727166');draw([[177,10],[166,80],[184,119]],.8,.65);
  }else if(i===6){ // An early solid wooden wheel; metal hub, radial planks and tangible rim.
   plate([[-35,116],[-35,-114],[-17,-132],[22,-132],[40,-114],[40,116]],'#464337');
   oval(0,0,143,143,3.1,1);oval(0,0,128,128,1.7,.8);oval(0,0,122,122,.8,.40);
   ctx.save();ctx.beginPath();ctx.arc(0,0,123,0,Math.PI*2);ctx.clip();
   for(let k=-5;k<=5;k++){let xx=k*24;draw([[xx,-140],[xx,140]],1.3,.72);for(let j=0;j<5;j++)draw([[xx+4+j*3,-133],[xx+2+j*3,-30],[xx+7+j*3,46],[xx+4+j*3,137]],.5,.33);}
   ctx.restore();oval(0,0,23,23,2.3,1);oval(0,0,11,11,1.5,.8);
   for(let k=0;k<16;k++){let a=k/16*Math.PI*2;draw([[Math.cos(a)*130,Math.sin(a)*130],[Math.cos(a)*141,Math.sin(a)*141]],1,.8);}
   draw([[-40,169],[55,169],[120,158]],1,.35);
  }else{ // Early celestial observation: stars and a measured horizon, no books or modern camera.
   const points=[[-142,61],[-87,-27],[-21,9],[47,-83],[108,-32],[147,-121]];
   draw(points,1.3,.54);for(const [xx,yy] of points){oval(xx,yy,5,5,1,.85);draw([[xx-13,yy],[xx+13,yy]],.9,.72);draw([[xx,yy-13],[xx,yy+13]],.9,.72);}
   draw([[-172,108],[-111,85],[-41,97],[20,74],[96,100],[166,82]],1.7,.65);
   for(let k=0;k<9;k++)draw([[-167,112+k*3],[165,98+k*3]],.6,.25);
   oval(-15,2,166,144,.7,.32);
  }ctx.restore();
 }
`+film.slice(end);
film=film.replace('Only constructive objects: a book, a pencil, a camera and an architectural drawing.','Fire-making, stone-tool knapping, the wheel and early celestial observation.');
await writeFile('motion/loading-study-v6/opening.js',film);
await cp('motion/remotion-v32-74/src','motion/remotion-v32-75/src',{recursive:true});
await edit('motion/remotion-v32-75/src/index.tsx',s=>s.replace('loading-study-v5','loading-study-v6'));
await edit('scripts/render-opening-v32-75.mjs',s=>s.replaceAll('v32-74','v32-75').replaceAll('loading-study-v5','loading-study-v6'));
await edit('v31-motion.js',s=>s.replaceAll('loading-study-v32-74','loading-study-v32-75').replaceAll('opening-poster-v32-74','opening-poster-v32-75'));
await edit('v31.html',s=>s.replace('  <link rel="stylesheet" href="./v32-74.css?v=32.74">','  <link rel="stylesheet" href="./v32-74.css?v=32.74">\n  <link rel="stylesheet" href="./v32-75.css?v=32.75">').replaceAll('v31-motion.js?v=32.74','v31-motion.js?v=32.75').replaceAll('scene-loader.js?v=32.74','scene-loader.js?v=32.75').replace('再次点击，收起收藏。','点击一张可放大，再次点击回到原位；用「收起札记」收回收藏。'));
await edit('src/home-world.ts',s=>s.replace('home-live-poster-v32-74','home-live-poster-v32-75').replace('Math.max(.8,renderQuality-.1)','Math.max(.9,renderQuality-.05)').replace('if(qualityWindow>2)','if(qualityWindow>2&&intro>=16)'));
await edit('reading.html',s=>s.replace('./v31.html?v=32.74','./v31.html?v=32.75&return=1').replace('src="./scene-dist/reading-book.js"','src="./scene-dist/reading-book.js?v=32.75"').replace('<img id="fullPageImage" alt="电影美学原稿页面">','<div id="fullSpread"><img id="fullPageImage" alt="电影美学原稿左页"><img id="fullPageRight" alt="电影美学原稿右页"></div>').replace('← 上一页','← 上一跨页').replace('下一页 →','下一跨页 →').replace('点击书本打开 · 打开后可拖动查看立体结构','点击书本打开，沿着两页相连的图像慢慢读。').replace('原稿以完整页面呈现；点击「清晰阅读」可放大，左右方向键翻页。','保持原稿跨页关系 · 点击两页可一起放大 · 左右方向键翻页。'));
await edit('learning.html',s=>s.replace('./v31.html?v=32.74','./v31.html?v=32.75&return=1'));
console.log('Retained film choreography and updated entry assets, editorial card layout and child return paths.');
