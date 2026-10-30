from pathlib import Path
import shutil,json
P=Path(__file__).resolve().parents[1];D=P/'motion/loading-study-v3';D.mkdir(parents=True,exist_ok=True)
shutil.copy2(P/'motion/loading-study-v2/preview.html',D/'preview.html')
s=(P/'motion/loading-study-v2/opening.js').read_text(encoding='utf8');s=s.replace('Original V32.71','Original V32.72').replace('window.createOpeningFilm=async function(canvas){','window.createOpeningFilm=async function(canvas,options={}){')
s=s.replace("image.src='../../assets/loading-study/v32-71/perception-engraving-atlas.png'","image.src=options.legacyAtlasUrl||'../../assets/loading-study/v32-71/perception-engraving-atlas.png'")
a=s.index(' const cells=regions.map');b=s.index('\n const text=',a)
s=s[:a]+''' const cells=regions.map(([sx,sy,sw,sh])=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),scale=500/Math.max(sw,sh),dw=sw*scale,dh=sh*scale;x.drawImage(image,sx,sy,sw,sh,(512-dw)/2,(512-dh)/2,dw,dh);return c;});
 const atlas=new Image();atlas.src=options.atlasUrl||'../../assets/loading-study/v32-72/expanded-scientific-atlas.png';await atlas.decode();
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){const c=document.createElement('canvas');c.width=c.height=640;const x=c.getContext('2d'),w=atlas.width/3,h=atlas.height/3;x.drawImage(atlas,col*w+8,row*h+8,w-16,h-16,0,0,640,640);cells.push(c);}
''' + s[b:]
a=s.index(' function draw(t){');b=s.index('\n return {draw,',a)
s=s[:a]+''' const beats=[
 [0,1.35,3,'THE FIRST TRACE','plume'],[1.35,2.4,6,'LOOK CLOSER','focus'],
 [2.4,3.15,13,'INVISIBLE SYSTEMS','scan'],[3.15,4.3,7,'EVERYTHING CONNECTS','branch'],
 [4.3,5.5,8,'PATTERNS IN NATURE','spiral'],[5.5,6.25,11,'A NEW PERSPECTIVE','whip'],
 [6.25,7.6,9,'LIGHT BECOMES FORM','negative'],[7.6,8.5,1,'PERCEPTION IN MOTION','shutter'],
 [8.5,9.45,14,'THOUGHT BECOMES ACTION','split'],[9.45,10.1,10,'TIME IS A MATERIAL','match'],
 [10.1,11.45,10,'COMPOSE THE INVISIBLE','mechanism'],[11.45,12.3,12,'A CONSTELLATION OF IDEAS','orbit'],
 [12.3,13.6,0,'FROM TRACE TO MEMORY','stack'],[13.6,14.5,8,'REPEAT / TRANSFORM','recursive'],
 [14.5,15.6,5,'BUILD A LIVING WORLD','parallax'],[15.6,16.55,7,'ROOTED IN CURIOSITY','branch'],
 [16.55,17.5,9,'FOLLOW THE LIGHT','negative'],[17.5,18.2,12,'ENTER THE ARCHIVE','recursive'],
 [18.2,20,2,'MIND UNIVERSE','title']];
 function draw(t){
  t=Math.max(0,Math.min(19.999,t));const beat=beats.find(b=>t>=b[0]&&t<b[1])||beats.at(-1),index=beats.indexOf(beat),u=(t-beat[0])/(beat[1]-beat[0]);
  const fast=1-Math.pow(1-u,4),hold=ease(.12,.85,u),exit=ease(.82,1,u),negative=beat[4]==='negative';
  ctx.fillStyle=negative?yellow:ink;ctx.fillRect(0,0,W,H);
  if(!negative){const air=ctx.createRadialGradient(790,380,20,790,380,850);air.addColorStop(0,'#17160d');air.addColorStop(1,ink);ctx.fillStyle=air;ctx.fillRect(0,0,W,H);}
  ctx.save();ctx.translate(W/2,H/2);const z=1+.10*fast+.035*Math.sin(t*2.1);ctx.scale(z,z);ctx.rotate(.012*Math.sin(t*1.4));ctx.translate(-W/2,-H/2);
  const cx=800+(index%2?1:-1)*(170*(1-fast)-42*exit),cy=385+18*Math.sin(u*3+index),size=520+110*hold+90*exit;
  if(beat[4]==='plume'){plume(t*2.4,1);orbit(t*2.2,780,335,265,.5);sprite(3,1080-160*fast,400,320,-.11+u*.26,.62);}
  else{
   // Shutter samples follow the eased motion; text remains crisp on its own layer.
   const turn=beat[4]==='mechanism'?u*.72:(index%2?1:-1)*(.12-.20*fast);
   for(let k=3;k>=0;k--)sprite(beat[2],cx-k*(1-fast)*22,cy,size-k*5,turn-k*.012,k===0?.97:.045,negative);
   if(['branch','split','stack','parallax'].includes(beat[4])){
    sprite((beat[2]+3)%15,310+55*fast,265,200,-.1+u*.17,.67,negative);
    sprite((beat[2]+7)%15,1180-95*fast,540,224,.15-u*.12,.52,negative);
    line([[445,210],[584,210],[584,350]],negative?ink:paper,.75,.42);
    line([[995,487],[1155,487],[1155,650]],negative?ink:paper,.75,.32);
   }
   if(beat[4]==='recursive')for(let i=0;i<13;i++){const s=570*Math.pow(.79,i)*(1+.2*fast);ctx.save();ctx.translate(cx,cy);ctx.rotate(u*.8+i*.065);ctx.strokeStyle=negative?ink:yellow;ctx.globalAlpha=.2+i*.025;ctx.lineWidth=.75;ctx.strokeRect(-s/2,-s/2,s,s);ctx.restore();}
   if(beat[4]==='scan'){ctx.save();ctx.beginPath();ctx.rect(0,180+fast*450,W,80);ctx.clip();sprite(6,cx,cy,680,0,.8);ctx.restore();}
   if(!negative){orbit(t*2.1,cx,cy,305,.38);rays(t*2.6,.74);lightRibbon(t*3,790,370,560,.64);glow(cx-90,cy-15,260,.22);}
   else{for(let i=0;i<24;i++){const angle=-.5+i*.043;line([[cx-420,cy-20],[cx+Math.cos(angle)*620,cy+Math.sin(angle)*330]],ink,.55,.2);}orbit(t*1.7,cx,cy,335,.2);}
  }
  ctx.restore();
  // Brief motivated wipes at cuts, rather than a long crossfade on every image.
  if(u<.12&&index>0){const q=1-u/.12;ctx.fillStyle=negative?ink:yellow;ctx.fillRect(W*(1-q),0,W*q*.13,H);}
  ctx.save();ctx.fillStyle=negative?ink:paper;ctx.textAlign='left';ctx.font='14px Bahnschrift,Arial,sans-serif';ctx.globalAlpha=.68;ctx.fillText(String(index+1).padStart(2,'0')+' / FIELD NOTES',138,130);
  ctx.font='400 29px "Bodoni MT","Times New Roman",serif';ctx.globalAlpha=ease(.03,.15,u)*(1-ease(.88,1,u));ctx.fillText(beat[3],138,704);
  ctx.font='11px Bahnschrift,Arial,sans-serif';ctx.globalAlpha=.43;ctx.fillText(['OBSERVE / QUESTION / IMAGINE','LIGHT / MATTER / MEMORY','AN ORIGINAL MOVING ARCHIVE'][Math.floor(index/6)%3],140,739);ctx.restore();
  if(beat[4]==='title'){
   const end=ease(18.2,18.7,t);ctx.fillStyle=`rgba(8,9,8,${end*.96})`;ctx.fillRect(0,0,W,H);glow(768,320,330,end*.22);ctx.save();ctx.textAlign='center';text('MIND UNIVERSE',W/2,409,73,end);ctx.fillStyle=yellow;ctx.globalAlpha=end*.85;ctx.font='400 25px "STSong","SimSun",serif';ctx.fillText('脑 海 宇 宙',W/2,474);ctx.font='11px Bahnschrift,Arial,sans-serif';ctx.fillStyle=paper;ctx.globalAlpha=end*.47;ctx.fillText('A LIVING DIGITAL ARCHIVE',W/2,520);ctx.restore();
  }
  ctx.globalAlpha=.065;for(let i=0;i<1100;i++){ctx.fillStyle=i%2?paper:ink;ctx.fillRect(rand(i)*W,rand(i+1800)*H,.65,.65);}ctx.globalAlpha=1;
 }
''' + s[b:]
s=s.replace('atlas:image.src','atlas:atlas.src,beats:beats.length,images:cells.length,retiming:"quartic acceleration and deceleration with shutter samples"')
(D/'opening.js').write_text(s,encoding='utf8')
(P/'.verify/v32-72/opening-edit-analysis.json').write_text(json.dumps({'referenceSeconds':12.151066,'referenceStudied':True,'method':'31 whole-video thumbnails at 0.4 second intervals; observed motifs and transitions','referenceMethods':['rapid graphic match cuts','ease acceleration and deceleration','short masked wipes','negative reversal','temporal shutter trails','recursive frame scaling','layered light rays and diagram montage'],'newDuration':20,'newBeats':19,'newImages':15,'existingPortfolioImagesUsed':False,'referenceVideoEmbedded':False},indent=2),encoding='utf8')
print('Authored 19 short beats, 15 engraving images, curve retiming, wipes, shutter samples and image/text montage in 20 seconds.')
