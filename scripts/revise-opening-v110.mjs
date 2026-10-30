import fs from 'node:fs/promises';
const file='motion/yangjian-v110/opening/index.html';let s=await fs.readFile(file,'utf8');
s=s.replace('width=1280,height=720','width=1600,height=900').replace('data-width="1280" data-height="720"','data-width="1600" data-height="900"').replace('data-fps="24"','data-fps="30"').replace('width="1280" height="720"','width="1600" height="900"');
s=s.replace(/function mountains\(t\)\{[\s\S]*?\n  function mist/,`function mountains(t){
    const p=t*TAU/D;
    ctx.fillStyle='#050505';ctx.fillRect(0,0,W,H);
    const breathing=1.11+.035*Math.sin(p),pan=22*Math.sin(p*2),rise=12*Math.sin(p*2+.7);
    ctx.save();ctx.filter='grayscale(1)';ctx.globalAlpha=.56;
    ctx.translate(W*.5+pan,H*.5+rise);ctx.rotate(.008*Math.sin(p*2));ctx.scale(breathing,breathing);
    ctx.drawImage(bg,-W/2,-H/2,W,H);ctx.restore();
  }
  function mist`);
s=s.replace('ctx.globalAlpha=.027+layer*.005','ctx.globalAlpha=.055+layer*.015').replace(')*14+Math.sin(x*.011-p*2)*6',')*30+Math.sin(x*.011-p*2)*14').replace('y+30+Math.sin','y+60+Math.sin');
const waves=`
  function billows(t,front=false){
    const p=t*TAU/D,count=front?4:5;
    for(let n=0;n<count;n++){
      const base=(front?635:458)+n*(front?52:34),a=(front?47:15)+n*(front?17:6);
      const points=[];
      for(let x=-80;x<=W+80;x+=10){const y=base+a*Math.sin(x*.005+p*4+n*1.8)+a*.24*Math.sin(x*.013+p*8+n);points.push([x,y]);}
      ctx.save();const gray=front?12+n*4:22+n*6;ctx.fillStyle='rgb('+gray+','+gray+','+gray+')';ctx.globalAlpha=front?.96:.74;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineTo(W+80,H+80);ctx.lineTo(-80,H+80);ctx.closePath();ctx.fill();ctx.restore();
      stroke(points,front?4.2:2.1,front?.68:.38,front?224:164);
      for(let k=0;k<(front?48:28);k++){
        const x=hash(k*71+n*157)*W,y=base+a*Math.sin(x*.005+p*4+n*1.8)+a*.24*Math.sin(x*.013+p*8+n);
        const d=12+hash(k*31+n)*70,life=.5+.5*Math.sin(p*4+k*.7);
        stroke([[x,y+4],[x+d*.4,y-6-life*10],[x+d,y+life*13]],1+hash(k+n),.18+life*.42,232);
      }
    }
  }
`;
s=s.replace('  // Piecewise-affine illustration mesh.',waves+'\n  // Piecewise-affine illustration mesh.');
s=s.replace('roll=.038*Math.sin(p*4)+.012*Math.sin(p*8+.2)','roll=.09*Math.sin(p*4)+.018*Math.sin(p*8+.2)').replace('x=854+30*Math.sin(p),y=605+14*Math.sin(p*4+.45)+3*Math.sin(p*8)','x=932+38*Math.sin(p),y=636+30*Math.sin(p*4+.45)+7*Math.sin(p*8)').replace('const sc=550/hero.width','const sc=940/hero.width');
s=s.replace('cloth*(20*Math.sin','cloth*(34*Math.sin').replace('hem*16*Math.sin','hem*26*Math.sin').replace('hair*12*Math.sin','hair*20*Math.sin').replace('cloth*14*Math.sin','cloth*22*Math.sin');
s=s.replace('for(let i=0;i<155;i++)','for(let i=0;i<210;i++)').replace('t*210,840','t*280,840').replace('const alpha=.045+hash(i*17)*.12','const alpha=.12+hash(i*17)*.23');
s=s.replace('ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation','ctx.setTransform(1.25,0,0,1.25,0,0);ctx.globalCompositeOperation');
s=s.replace('mountains(t);mist(t);currents(t);boat(t);currents(t,true);rain(t);lightning(t);','mountains(t);mist(t);billows(t);currents(t);boat(t);billows(t,true);currents(t,true);rain(t);lightning(t);');
s=s.replace("flash:flashAt(t)","flash:flashAt(t),hullWidth:940,riverAmplitude:98");
await fs.writeFile(file,s);console.log('Opening revised: real 1600×900 canvas, 940/1280 close-up hull, billowing river and moving atmosphere.');
