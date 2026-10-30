import fs from 'node:fs/promises';
let s=await fs.readFile('scripts/render-physical-universe-v98.mjs','utf8');
s=s.replaceAll('physical-universe-v98','physical-universe-v99').replaceAll('assets/works/physical-universe','assets/works/physical-universe-v99').replaceAll('v32-98','v32-99').replaceAll('make-physical-audio-v98','make-physical-audio-v99').replaceAll('一触成形','让画面发生').replace("['frame-01',2.9],['frame-02',6.8],['frame-03',11.3],['frame-04',15.7]","['frame-01',6.4],['frame-02',9.6],['frame-03',13.1],['frame-04',16.2]");
await fs.writeFile('scripts/render-physical-universe-v99.mjs',s);
let a=await fs.readFile('scripts/make-physical-audio-v98.py','utf8');
a=a.replaceAll('assets/works/physical-universe','assets/works/physical-universe-v99').replace('default_rng(981)','default_rng(991)').replace('strike(4.35,432,.072);strike(10.65,510,.085);strike(14.05,324,.07)','strike(5.05,432,.09);strike(8.05,510,.1);strike(11.45,324,.085);strike(15.03,432,.065)').replace('[1.15,4.2,8.4,12.6]','[2.6,5,8,11.4,15]').replace('np.arange(1.8,14.2,.75)','np.arange(2.7,15.4,.6)').replace('beat,.035','beat,.075');
await fs.writeFile('scripts/make-physical-audio-v99.py',a);
