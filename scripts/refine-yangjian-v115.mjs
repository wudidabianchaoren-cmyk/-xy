import fs from 'node:fs/promises';import assert from 'node:assert/strict';
let s=await fs.readFile('yangjian.js','utf8');
s=s.replace("r.shock={at:performance.now(),type,strength,sign};triggerCount++", "if(!(type==='lightning'&&r.shock?.type==='wave'&&performance.now()-r.shock.at<6000))r.shock={at:performance.now(),type,strength,sign};triggerCount++");
s=s.replace("node.dataset.motion==='memory')?$('#journeyBackdrop video')", "['memory','river'].includes(node.dataset.motion))?$('#journeyBackdrop video')");
s=s.replace("shock.type==='axe'?22:innerWidth*.13","shock.type==='axe'?22:innerWidth*.08");
s=s.replace("kind==='capture'?.48:.35,b.n%2?-1:1)", "kind==='capture'?.48:.35,kind==='wave'?(r.waveSign=-(r.waveSign||1)):(b.n%2?-1:1))");
const start=s.indexOf('function updateJourney(y){'),end=s.indexOf('\nfunction tick(now)',start);assert(start>0&&end>start);
s=s.slice(0,start)+`function updateJourney(y){
 const first=geometry.find(g=>g.id===1),end=first?.bottom||innerHeight*3,r=activeScene,river=r?.kind==='river';
 journeyProgress=clamp((y-innerHeight*.3)/(end-innerHeight*.3));journeyWanted=y<end-innerHeight*.18||river;
 const textFocus=.55*ease(.45,.95,y/innerHeight),fade=1-ease(.85,1,journeyProgress);
 const alpha=river?.44:journeyWanted?(1-textFocus)*(1-.25*ease(.35,.8,journeyProgress))*fade:0;
 const backdrop=$('#journeyBackdrop');backdrop.style.opacity=String(alpha);
 const z=river?1.42:1.06+journeyProgress*.04;
 const title=$('.cover-title');if(title){title.style.opacity=String(1-ease(.05,.62,y/innerHeight));title.style.transform='translateY('+(-Math.min(y,innerHeight)*.08)+'px)'}
 $('.journey-camera',backdrop).style.transform='translate3d('+((river?0:-journeyProgress*innerWidth*.025)+(r?.x||0))+'px,'+((river?0:-journeyProgress*innerHeight*.015)+(r?.y||0))+'px,0) rotate('+(r?.roll||0)+'deg) scale('+z+')';
 if(journeyWanted&&journeyVideo&&r?.video!==journeyVideo)videoEvents(records.find(q=>q.video===journeyVideo),performance.now());
}
`+s.slice(end);
s=s.replace('sharedRoot:!!activeScene&&activeScene.root.contains(activeScene.video),','sharedRoot:!!activeScene&&activeScene.root.contains(activeScene.video),sharedCamera:!!activeScene&&(activeScene.root.contains(activeScene.video)||activeScene.video===journeyVideo),');
assert(s.includes('sharedCamera:'));await fs.writeFile('yangjian.js',s);
let h=await fs.readFile('yangjian.html','utf8');h=h.replace(/(<div class="scene-stage river-stage">)<video[\s\S]*?<\/video>/,'$1');await fs.writeFile('yangjian.html',h);
await fs.appendFile('yangjian-v115.css',`\n/* Reset the older flex title and keep moving backgrounds under one fixed camera. */
.cover-title{width:auto;max-width:none;left:0;right:0;display:block}
.cover-title h1{display:block!important;align-items:normal;gap:0;width:auto}
.cover-title h1 span{display:block!important;width:auto;flex:none;float:none}
.journey-camera{background-image:url('./assets/yangjian-v115/video/opening-poster.png')}
.chapter[data-chapter="5"]{background:transparent}
.river-stage .stage-haze{display:none}
`);
console.log('Title reset, chapter contrast, uncropped shared river background and non-overwriting lightning.');
