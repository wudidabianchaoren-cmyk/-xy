import fs from 'node:fs';
let s=fs.readFileSync('motion/loading-study-v8/opening.js','utf8');
// Shared motion envelopes carry the plates from the walker's gaze into the discovery system.
s=s.replace('engraving(0,pan,332,370+smooth(9.6,11.2,t)*55,-.02,alpha*(1-smooth(12.0,13.3,t)));',`engraving(0,pan,332+20*Math.sin(smooth(8.6,12.0,t)*Math.PI),370+smooth(9.6,11.2,t)*55,-.02,alpha*(1-smooth(12.0,13.3,t)));`);
s=s.replace('engraving(8,1182,490,240,.04,study*.72);',`engraving(8,mix(1290,1140,smooth(10.6,12.0,t)),mix(555,472,smooth(10.6,12.0,t)),240,.04,study*.72);`);
s=s.replace('engraving(6,805,350,405,q*.055,systems*alpha*.86);engraving(3,1190,245,170,-.2,systems*alpha*.56);',`engraving(6,mix(900,760,smooth(12.3,14.2,t)),mix(435,348,smooth(12.3,14.2,t)),405,q*.055,systems*alpha*.86);engraving(3,mix(1350,1140,smooth(13.0,14.3,t)),mix(280,240,smooth(13.0,14.3,t)),170,-.2,systems*alpha*.56);`);
const start=s.indexOf('  discoveryAccent(0,1190'),end=s.indexOf('  if(t>16.9)',start);if(start<0||end<0)throw Error('accepted six accents not found');
s=s.slice(0,start)+`  const plates=[
   [0,5.4,8.5,1230,342,170,-.025], [1,7.5,10.7,1170,220,178,.025],
   [2,9.1,12.8,1235,490,160,0], [3,12.4,15.7,490,485,166,-.025],
   [4,13.3,16.5,1095,530,158,.02], [5,14.9,17.4,1235,375,166,.02]
  ];
  for(const [i,a,b,x,y,size,turn] of plates){
   const arrival=smooth(a,a+.70,t),departure=smooth(b-.55,b,t),u=smooth(a,b,t);
   const fromX=x<700?x-160:x+190,fromY=y+60;
   const px=mix(fromX,x,arrival)-departure*85,py=mix(fromY,y,arrival)-departure*75+Math.sin(u*Math.PI)*14;
   discoveryAccent(i,px,py,size*(.92+.08*arrival),accentWindow(t,a,b)*.66,turn*(1-departure));
   const link=accentWindow(t,a,b)*arrival*.23;line([[px,y+size*.36],[px-45,y+size*.36],[900,430]],brass,.8,link);
  }
`+s.slice(end);
fs.writeFileSync('motion/loading-study-v8/opening.js',s);
let h=fs.readFileSync('v31.html','utf8');h=h.replace('</head>','  <link rel="stylesheet" href="./vendor/threeui/src/shaders/threeui.css">\n</head>');h=h.replace('</body>','  <script type="module" src="./scene-dist/dock/exhibition-dock.js?v=32.80"></script>\n</body>');fs.writeFileSync('v31.html',h);
let m=fs.readFileSync('v31-motion.js','utf8').replaceAll('loading-study-v32-79.mp4','loading-study-v32-80.mp4').replaceAll('opening-poster-v32-79.png','opening-poster-v32-80.png');fs.writeFileSync('v31-motion.js',m);
console.log('All accepted plates retained; coherent entrance, linking and exit added');
