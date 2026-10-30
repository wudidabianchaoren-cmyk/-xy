import fs from 'node:fs/promises';
const dir='.verify/v32-110';await fs.mkdir(dir+'/before',{recursive:true});
for(const f of ['yangjian.html','yangjian.css','yangjian.js','v31.html'])await fs.copyFile(f,dir+'/before/v109-'+f);
await fs.mkdir('assets/yangjian-v110/video',{recursive:true});await fs.mkdir('assets/yangjian-v110/audio',{recursive:true});
await fs.cp('motion/yangjian-v109/opening','motion/yangjian-v110/opening',{recursive:true,filter:p=>!p.includes('.hyperframes')&&!p.endsWith('opening-master.mp4')});
await fs.mkdir(dir+'/opening',{recursive:true});
console.log('New opening source and small before-records prepared; original movies untouched.');
