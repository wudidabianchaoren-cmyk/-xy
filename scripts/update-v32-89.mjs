import fs from 'node:fs/promises';
let html=await fs.readFile('after-journey.html','utf8');
html=html.replaceAll('after-journey.js?v=32.88','after-journey.js?v=32.89').replaceAll('4 幅精选画面','12 幅精选画面').replaceAll('四幅精选画面','十二幅画面');
html=html.replace(' / 02</span>',' / 06</span>').replace('SCROLL / FOUR IMAGES','SCROLL / 12 IMAGES').replace('alt="冰崖之间的身影"','alt="宫阙与身影"');
await fs.writeFile('after-journey.html',html);
let rural=await fs.readFile('rural-return.html','utf8');await fs.writeFile('rural-return.html',rural.replace('after-journey.js?v=32.88','after-journey.js?v=32.89'));
let works=await fs.readFile('v31-works-ring.js','utf8');await fs.writeFile('v31-works-ring.js',works.replace('after-journey.html?v=32.88','after-journey.html?v=32.89'));
let main=await fs.readFile('v31.html','utf8');await fs.writeFile('v31.html',main.replace('v31-works-ring.js?v=32.88','v31-works-ring.js?v=32.89'));
