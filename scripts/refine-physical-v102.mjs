import fs from 'node:fs/promises';
const file='motion/physical-universe-v102/drawing.js';let source=await fs.readFile(file,'utf8');
source=source.replace("q.restore();q.fillStyle=INK;q.font='400 23px '","q.restore();q.fillStyle=index===4?PAPER:INK;q.font='400 23px '");
source=source.replace('g.save();g.globalAlpha=.18;printAt(5,0,0,1920,1383);g.restore();','');
await fs.writeFile(file,source);
