import fs from 'node:fs/promises';
let js=await fs.readFile('yangjian.js','utf8');
js=js.replace('this.master.connect(this.ctx.destination);',"this.limiter=this.ctx.createDynamicsCompressor();this.limiter.threshold.value=-10;this.limiter.knee.value=18;this.limiter.ratio.value=3;this.limiter.attack.value=.008;this.limiter.release.value=.35;this.master.connect(this.limiter);this.limiter.connect(this.ctx.destination);");
js=js.replaceAll('mp4?v=32.109','mp4?v=32.110');
await fs.writeFile('yangjian.js',js);
let qc=await fs.readFile('.verify/v32-110/opening/check-opening.mjs','utf8');qc=qc.replaceAll('yangjian-v109','yangjian-v110');await fs.writeFile('.verify/v32-110/opening/check-opening.mjs',qc);
