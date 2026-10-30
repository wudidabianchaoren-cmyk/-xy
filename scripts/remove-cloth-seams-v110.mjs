import fs from 'node:fs/promises';
const f='motion/yangjian-v110/opening/index.html';let s=await fs.readFile(f,'utf8');
s=s.replace("ctx.save();ctx.beginPath();d.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.clip();", "const center=[(d0[0]+d1[0]+d2[0])/3,(d0[1]+d1[1]+d2[1])/3];const edge=d.map(q=>{const len=Math.hypot(q[0]-center[0],q[1]-center[1]);return [q[0]+(q[0]-center[0])*.95/len,q[1]+(q[1]-center[1])*.95/len]});ctx.save();ctx.beginPath();edge.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.clip();");
await fs.writeFile(f,s);
const pack='scripts/package-opening-v110.mjs';let q=await fs.readFile(pack,'utf8');q=q.replace('renderCount:1','renderCount:3');
q=q.replace("await fs.writeFile('assets/yangjian-v110/video/production.json'", "const tag='32.110-'+report.sha256.slice(0,10);for(const path of ['yangjian.html','yangjian.js']){let text=await fs.readFile(path,'utf8');text=text.replace(/v=32\\.110(?:-[a-f0-9]{10})?/g,'v='+tag);await fs.writeFile(path,text);}\nawait fs.writeFile('assets/yangjian-v110/video/production.json'");
await fs.writeFile(pack,q);
