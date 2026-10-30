import fs from 'node:fs/promises';
const f='motion/yangjian-v110/opening/index.html';let s=await fs.readFile(f,'utf8');
const replacement=`function billows(t,front=false){
    const p=t*TAU/D,count=front?3:3;
    for(let n=0;n<count;n++){
      const base=(front?641:490)+n*(front?56:35),a=(front?34:16)+n*(front?13:5),points=[];
      for(let x=-100;x<=W+100;x+=9){const y=base+a*Math.sin(x*.005+p*4+n*1.8)+a*.23*Math.sin(x*.013+p*8+n);points.push([x,y]);}
      ctx.save();ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineTo(W+100,H+100);ctx.lineTo(-100,H+100);ctx.closePath();ctx.clip();
      ctx.globalAlpha=front?.95:.74;ctx.filter='grayscale(1)';
      const pan=58*Math.sin(p*2+n),rise=16*Math.sin(p*4+n);
      ctx.drawImage(bg,0,bg.height*.67,bg.width,bg.height*.33,-115+pan,base-55+rise,W+230,270+n*28);
      ctx.fillStyle='#080808';ctx.globalAlpha=front?.18:.26;ctx.fillRect(-100,base-100,W+200,H);
      ctx.restore();stroke(points,1.5,front?.15:.07,205);
    }
  }
  // Piecewise-affine`;
s=s.replace(/function billows\(t,front=false\)\{[\s\S]*?\/\/ Piecewise-affine/,replacement);
s=s.replace("ctx.save();ctx.fillStyle='#b1b1b1';ctx.globalAlpha", "ctx.save();ctx.filter='blur(18px)';ctx.fillStyle='#b1b1b1';ctx.globalAlpha");
s=s.replace('boat(t);billows(t,true);currents(t,true);rain(t);','boat(t);billows(t,true);rain(t);');await fs.writeFile(f,s);
