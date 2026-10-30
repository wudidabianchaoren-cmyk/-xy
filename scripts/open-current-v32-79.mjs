import {chromium} from '../node_modules/playwright/index.mjs';
// Dedicated review window: the system default selected Iris Xe despite a discrete GPU.
// This changes only this browser launch; it doesn't alter Windows or the user's browser settings.
const browser=await chromium.launch({headless:false,args:['--force-high-performance-gpu','--use-angle=d3d11'],ignoreDefaultArgs:['--enable-automation']});
const page=await browser.newPage({viewport:null});await page.goto('http://localhost:8031/v31.html?v=32.79');
console.log('V32.79 preview open, high performance GPU requested.');
await new Promise(resolve=>browser.on('disconnected',resolve));
