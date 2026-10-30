import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const backup='.verify/v32-115/previous-source';await fs.mkdir(backup,{recursive:true});
for(const f of ['yangjian.html','yangjian.js','yangjian.css'])await fs.copyFile(f,backup+'/'+f,fs.constants.COPYFILE_EXCL).catch(e=>{if(e.code!=='EEXIST')throw e});
const media=JSON.parse(await fs.readFile('assets/yangjian-v115/IMAGE-SOURCE.json','utf8'));await fs.mkdir('assets/yangjian-v115/art',{recursive:true});for(const a of media.art)await fs.copyFile(a.source,a.destination);
let h=await fs.readFile(backup+'/yangjian.html','utf8');
h=h.replace('</head>','<link rel="stylesheet" href="./yangjian-v115.css?v=32.115"></head>');
h=h.replaceAll('./assets/yangjian-v111/video/opening-poster.png','./assets/yangjian-v115/video/opening-poster.png').replace('yangjian.css?v=32.112','yangjian.css?v=32.115').replace('yangjian.js?v=32.112','yangjian.js?v=32.115');
h=h.replace('data-video="opening"','data-video="opening" data-source="./assets/yangjian-v115/video/opening.mp4"').replace('data-video="river"','data-video="river" data-source="./assets/yangjian-v115/video/opening.mp4"');
h=h.replace('<h1 id="bookTitle">劈<span>山</span></h1><h2>杨戬救母</h2>','<h1 id="bookTitle"><span>SPLIT THE</span>MOUNTAIN</h1><h2>劈山 · 杨戬救母</h2>');
h=h.replace(/<div class="cover-tail">[\s\S]*?<\/div><\/section>/,'</section>');
// Center the synopsis before the first image; the scene remains one continuous flow.
h=h.replace('class="beat layout-side" data-page="1"','class="beat layout-center opening-summary" data-page="1"');
const figure=(id,alt)=>'<figure class="ink-panel art-wide ink-paper" data-depth="0.65"><img data-art="'+id+'" data-ink-paper="true" alt="'+alt+'"></figure>';
for(const [page,id,alt]of [[12,22,'杨戬踏上湿滑山路，衣角在风中扬起。'],[22,23,'双手握紧竹篙，将力量压向逆流。']]){
 const re=new RegExp('(<article[^>]*data-page="'+page+'"[^>]*>[\\s\\S]*?)(<\\/article>)');assert(re.test(h));h=h.replace(re,'$1'+figure(id,alt)+'$2');
}
const riverPoint=h.indexOf('<article class="beat layout-right" data-page="22"');assert(riverPoint>0);
h=h.slice(0,riverPoint)+'<article class="beat layout-center river-insert" data-page="21.5">'+figure(21,'少年与船头一起迎向浪峰，水墨白浪向后退去。')+'</article>'+h.slice(riverPoint);
await fs.writeFile('yangjian.html',h);
let s=await fs.readFile(backup+'/yangjian.js','utf8');
const change=(a,b)=>{assert(s.includes(a),'Expected original fragment '+a.slice(0,65));s=s.replace(a,b);};
change("function artPath(n){return (Number(n)>12?", "function artPath(n){if(Number(n)>=21)return './assets/yangjian-v115/art/scene-'+n+'.png';return (Number(n)>12?");
change("+'?v=32.112'","+'?v=32.115'");
const start=s.indexOf('function syncOpeningSound()'),end=s.indexOf('\nfunction activeVideos',start);assert(start>=0&&end>start);
s=s.slice(0,start)+"function syncOpeningSound(){for(const [v]of videoStates){v.muted=true;v.volume=0}}\n"+s.slice(end);
change("function waveAt(t){return {roll:.65*Math.sin(2*Math.PI*t/6)+.30*Math.sin(2*Math.PI*t/3),y:7*Math.sin(2*Math.PI*t/4),x:3*Math.sin(2*Math.PI*t/12)}}","function waveAt(t){const p=2*Math.PI*t/5;return {roll:(.025*Math.sin(p)+.009*Math.sin(2*p+1))*180/Math.PI,y:12*Math.sin(p+.4)+5*Math.sin(2*Math.PI*t/2.5),x:0}}");
change("if(age>6)","if(age>7.5)");change('const push=ease(0,1.25,age),recover=1-ease(1.25,6,age);','const push=1-Math.pow(1-clamp(age/.72),4),recover=1-ease(.72,7.5,age);');
change("age<1.25?'push':'recover'","age<.72?'push':'recover'");
const eventStart=s.indexOf("if(v.dataset.video==='opening'){const event=6.1"),eventEnd=s.indexOf("if(v.dataset.video==='storm')",eventStart);assert(eventStart>0&&eventEnd>eventStart);
s=s.slice(0,eventStart)+"if(v.dataset.video==='opening'||v.dataset.video==='river'){for(const [j,event]of [3.8,10.6,16.2].entries()){const key='river-lightning-'+j;if(t>=event&&s.lastT<event&&!s.eventsSeen.has(key)){s.eventsSeen.add(key);flashAt=now;impulse(r,'lightning',.10,j%2?1:-1);sound.effect(j===1?'thunderFar':'thunder',j===1?.42:.5,j%2?.2:-.28,.38);lastEvent={...lastEvent,videoTime:t,audioSource:'single WebAudio real recording bus',thunderDelay:.38}}}}"+s.slice(eventEnd);
const pathsStart=s.indexOf('const paths={memory:'),pathsEnd=s.indexOf(';for(const[key,path]',pathsStart);assert(pathsStart>0&&pathsEnd>pathsStart);
s=s.slice(0,pathsStart)+"const paths={rain:'./assets/yangjian-v115/audio/rain-natural-60s.mp3',water:'./assets/yangjian-v115/audio/water-stream-60s.mp3',wind:'./assets/yangjian-v115/audio/wind-rain-distant-60s.mp3'}"+s.slice(pathsEnd);
const rowsStart=s.indexOf('const rows=[{memory:'),rowsEnd=s.indexOf(',gains=rows[chapter]',rowsStart);assert(rowsStart>0&&rowsEnd>rowsStart);
s=s.slice(0,rowsStart)+"const rows=[{rain:.64,water:.20,wind:.12},{rain:.32,water:.14,wind:.06},{rain:.70,wind:.10},{rain:.20,wind:.10},{wind:.18},{rain:.48,water:.36,wind:.16},{wind:.17},{rain:.22,wind:.18},{water:.10,wind:.05},{water:.07}]"+s.slice(rowsEnd);
change("key==='thunder'?'./assets/yangjian-v111/audio/thunder.mp3'","key.startsWith('thunder')?'./assets/yangjian-v115/audio/'+(key==='thunderFar'?'thunder-soft-far':'thunder-soft-near')+'.mp3'");
change("for(const key of ['thunder','axe','clatter','step','bird'])","for(const key of ['thunder','thunderFar','axe','clatter','step','bird'])");
s=s.replace(/this\.limiter\.threshold\.value=-[\d.]+/,'this.limiter.threshold.value=-8');
const fxStart=s.indexOf(' async effect('),fxEnd=s.indexOf('\n async visibility',fxStart);assert(fxStart>0&&fxEnd>fxStart);
s=s.slice(0,fxStart)+` async effect(key,gain=.5,pan=0,delay=0){
 if(!this.enabled||!this.ctx||hidden)return;
 if(key.startsWith('thunder')){if(performance.now()-(this.lastThunderAt||-1e6)<2800)return;this.lastThunderAt=performance.now();}
 if(key==='axe'||key.startsWith('thunder'))this.duckTime=performance.now();
 try{const variation=key==='step'&&((this.stepCount=(this.stepCount||0)+1)%2===0)?'step2':key;const buffer=await this.prepareEffect(variation);if(!buffer||!this.enabled||hidden)return;const source=this.ctx.createBufferSource(),level=this.ctx.createGain(),stereo=this.ctx.createStereoPanner();source.buffer=buffer;level.gain.value=gain;stereo.pan.value=clamp(pan,-1,1);source.connect(level);level.connect(stereo);stereo.connect(this.master);(this.activeEffects??=new Set()).add(source);source.start(this.ctx.currentTime+delay);source.onended=()=>{this.activeEffects.delete(source);source.disconnect();level.disconnect();stereo.disconnect()}}catch(e){this.error=e.message}
 }`+s.slice(fxEnd);
change('if(hidden)await this.ctx.suspend().catch(()=>{});','if(hidden){for(const src of this.activeEffects||[])try{src.stop()}catch{}await this.ctx.suspend().catch(()=>{});}');
change('disable(){this.enabled=false;','disable(){for(const src of this.activeEffects||[])try{src.stop()}catch{}this.enabled=false;');
change('length:76','length:150');change('size:8+(i%8)*3','size:16+(i%8)*5');
change("rain=[.32,0,.4,0,0,.4,0,.17,0,0]","rain=[.5,.12,.55,0,0,.55,0,.22,0,0]");
change("const wave=r.kind==='river'?waveAt(t):{x:0,y:0,roll:0};","const wave=(r.kind==='river'||journeyWanted&&(r.kind==='memory'||r.node.matches('.cover-motion')))?waveAt(t):{x:0,y:0,roll:0};");
change("shock.type==='axe'?22:115","shock.type==='axe'?22:innerWidth*.13");change("shock.type==='axe'?2.3:12.8","shock.type==='axe'?2.3:15.6");
change('const floatX=Math.sin(now/1850+i*.9)*3.5,floatY=Math.sin(now/2350+i*1.3)*5;','const floatX=Math.sin(now/1850+i*.9)*7,floatY=Math.sin(now/2350+i*1.3)*10;');
change('const z=-160+proximity*315+shock.amount*depth*115;','const z=-200+proximity*340+shock.amount*depth*145;');
change('side*(position*7+2.7)+pointerSmooth.x*1.5+shock.amount*shock.sign*3.5','side*(position*9+3.2)+pointerSmooth.x*1.5+shock.amount*shock.sign*6');
change('Math.sin(now/3300+i)*.35+r.roll*depth*.16','Math.sin(now/3300+i)*.7+shock.amount*shock.sign*depth*2');
change("b.n===22||b.n===23?'wave'","b.n>=21&&b.n<=24?'wave'");
change("if(!kind)continue;b.armed=false;","if(!kind)continue;if(kind==='wave'&&r&&performance.now()-(r.lastWaveAt||-1e6)<2500)continue;b.armed=false;if(kind==='wave'&&r)r.lastWaveAt=performance.now();");
change("const alpha=journeyWanted?(1-.66*ease(0,.27,journeyProgress))*(1-ease(.85,1,journeyProgress)):0;","const alpha=journeyWanted?(1-.42*ease(.12,.55,journeyProgress))*(1-ease(.85,1,journeyProgress)):0;");
change("const r=activeScene;const z=1+journeyProgress*.13;","const r=activeScene;const z=1.06+journeyProgress*.04;const title=$('.cover-title');if(title){title.style.opacity=String(1-ease(.05,.62,y/innerHeight));title.style.transform='translateY('+(-Math.min(y,innerHeight)*.08)+'px)'}");
change("((r?.roll||0)*.35)","(r?.roll||0)");
change("(r?.x||0)*.12","(r?.x||0)");change("(r?.y||0)*.2","(r?.y||0)");
await fs.writeFile('yangjian.js',s);
console.log('Yang Jian V115 integrated: original story retained, new ink assets, common camera and one audio bus.');
