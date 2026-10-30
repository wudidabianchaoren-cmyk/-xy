import fs from 'node:fs/promises';
await fs.mkdir('.verify/v32-111/before',{recursive:true});for(const f of ['yangjian.html','yangjian.css','yangjian.js','v31.html'])await fs.copyFile(f,'.verify/v32-111/before/v110-'+f);
let h=await fs.readFile('yangjian.html','utf8');const match=h.match(/<video class="cover-video"[\s\S]*?<\/video>/);if(!match)throw Error('Opening film missing');h=h.replace(match[0],'').replace('<main id="story">','<div id="journeyBackdrop" aria-hidden="true"><div class="journey-camera">'+match[0]+'<div class="journey-shade"></div></div></div><main id="story">');h=h.replaceAll('assets/yangjian-v110/video/','assets/yangjian-v111/video/').replace(/32\.110(?:-[a-f0-9]{10})?/g,'32.111');await fs.writeFile('yangjian.html',h);
let js=await fs.readFile('yangjian.js','utf8');js=js.replace("videoAsset='./assets/yangjian-v110/video/'","videoAsset='./assets/yangjian-v111/video/'");js=js.replace('const videoStates=new Map();',"const videoStates=new Map();const journeyVideo=$('#journeyBackdrop video');let journeyProgress=0,journeyWanted=true,videoAutoplayBlocked=false,autoAudioStatus='pending';");
js=js.replace("video:$('video',node)","video:(node.matches('.cover-motion')||node.dataset.motion==='memory')?$('#journeyBackdrop video'):$('video',node)");
js=js.replace('v.muted=!sound.enabled||hidden;v.volume=.82','v.muted=!sound.enabled||hidden||videoAutoplayBlocked;v.volume=.55*(1-journeyProgress*.56)');
js=js.replace("const wanted=r?.video===v&&!hidden&&!reduced&&!$('dialog[open]')", "const wanted=(v===journeyVideo?journeyWanted:r?.video===v)&&!hidden&&!reduced&&!$('dialog[open]')");
js=js.replace("s.eventsSeen.add(key);impulse(r,'lightning',.16,-1)","s.eventsSeen.add(key);flashAt=now;impulse(r,'lightning',.16,-1)");
js=js.replace('await this.ctx.resume();if(gen!==this.generation)return;',"await Promise.race([this.ctx.resume(),new Promise(r=>setTimeout(r,700))]);if(this.ctx.state!=='running'){autoAudioStatus='requires-gesture';this.error='autoplay-requires-gesture';return}if(gen!==this.generation)return;autoAudioStatus='running';");
js=js.replace("interrupted=e.name==='AbortError';if(e.name!=='AbortError'", "interrupted=e.name==='AbortError';if(e.name==='NotAllowedError'){videoAutoplayBlocked=true;autoAudioStatus='requires-gesture';v.muted=true;await v.play().catch(()=>{});}if(e.name!=='AbortError'");
js=js.replace("river:audioAsset+'wind-river.mp3',storm:audioAsset+'storm.mp3'", "river:'./assets/yangjian-v111/audio/rain-loop.mp3',storm:'./assets/yangjian-v111/audio/rain-loop.mp3'");
js=js.replace("fetch(audioAsset+''+files[key]+'.mp3')", "fetch(key==='thunder'?'./assets/yangjian-v111/audio/thunder.mp3':audioAsset+files[key]+'.mp3')");
js=js.replace('memory:.48','memory:.18').replace('memory:.3','memory:.14').replace('ascent:.34','ascent:.13').replace('ascent:.28','ascent:.12').replace('storm:.48','storm:.24').replace('river:.5','river:.23');
js=js.replace('force?.25:.55','force?.8:1.0').replace('},1900)','},4600)').replace('thunder\',.45','thunder\',.24');
js=js.replace("if(!sound.enabled)sound.enable()", "videoAutoplayBlocked=false;if(!sound.enabled)sound.enable();else syncOpeningSound()");
const continuation=`function updateJourney(y){
 const first=geometry.find(g=>g.id===1);const end=first?.bottom||innerHeight*3;
 journeyProgress=clamp((y-innerHeight*.3)/(end-innerHeight*.3));journeyWanted=y<end-innerHeight*.18;
 const alpha=journeyWanted?(1-.66*ease(0,.27,journeyProgress))*(1-ease(.85,1,journeyProgress)):0;
 const b=$('#journeyBackdrop');b.style.opacity=String(alpha);
 const r=activeScene;const z=1+journeyProgress*.13;
 $('.journey-camera',b).style.transform='translate3d('+(-journeyProgress*innerWidth*.035+(r?.x||0)*.12)+'px,'+(-(journeyProgress*innerHeight*.025)+(r?.y||0)*.2)+'px,0) rotate('+((r?.roll||0)*.35)+'deg) scale('+z+')';
 if(journeyWanted&&journeyVideo&&r?.video!==journeyVideo)videoEvents(records.find(q=>q.video===journeyVideo),performance.now());
}
`;
js=js.replace('function tick(now){',continuation+'\nfunction tick(now){').replace('activeVideos(activeScene);if', 'updateJourney(y);activeVideos(activeScene);if');
js=js.replace('bootMs=performance.now()-bootStart;measure();', 'bootMs=performance.now()-bootStart;measure();sound.enable();');js=js.replace('soundError:sound.error,','soundError:sound.error,autoAudioStatus,journeyProgress,journeyWanted,');js=js.replace(/32\.110(?:-[a-f0-9]{10})?/g,'32.111');await fs.writeFile('yangjian.js',js);
await fs.appendFile('yangjian.css',`\n/* V111: opening film continues into the first chapter, under a readable dark veil. */
#journeyBackdrop{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:#080808;will-change:opacity}
.journey-camera{position:absolute;inset:-2%;width:104%;height:104%;transform-origin:55% 50%;background:#080808 url('./assets/yangjian-v111/video/opening-poster.png') center/cover no-repeat;will-change:transform}
.journey-camera video{width:100%;height:100%;object-fit:cover}
.journey-shade{position:absolute;inset:0;background:linear-gradient(90deg,#08080845,transparent 45%),linear-gradient(0deg,#08080844,transparent 25%)}
#story{position:relative;z-index:2}.cover,.chapter[data-chapter="1"]{background:transparent}.cover-ink{display:none}
.chapter[data-chapter="1"] .scene-stage{background:transparent}.chapter[data-chapter="1"] .copy{text-shadow:0 2px 15px #000}
@media(prefers-reduced-motion:reduce){.journey-camera{transform:none!important}}
`);
let m=await fs.readFile('v31.html','utf8');m=m.replace(/(<!-- YJ APPEND (?:STYLE|CHAPTER|LOADER) START -->)[\s\S]*?(<!-- YJ APPEND (?:STYLE|CHAPTER|LOADER) END -->)/g,b=>b.replaceAll('32.110','32.111'));await fs.writeFile('v31.html',m);
console.log('Opening-to-chapter video continuity and sound envelopes applied.');
