import {chromium} from '../node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:false,args:['--force-high-performance-gpu','--use-angle=d3d11'],ignoreDefaultArgs:['--enable-automation']});
const page=await browser.newPage({viewport:null});await page.goto(process.argv.includes('--project')?'http://localhost:8031/after-journey.html?v=32.87#gallery':'http://localhost:8031/v31.html?v=32.87&return=1&work=after-journey');
console.log('V32.87 selected project ready to review.');await new Promise(resolve=>browser.on('disconnected',resolve));
