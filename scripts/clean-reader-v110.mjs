import fs from 'node:fs/promises';
let html=await fs.readFile('yangjian.html','utf8');
html=html.replace(/<a class="book-mark"[\s\S]*?<\/a>/,'').replace(/<button id="menuToggle"[\s\S]*?<\/button>/,'').replace(/<div class="reading-tools"[\s\S]*?<\/div>/,'').replace(/<dialog class="chapter-menu"[\s\S]*?<\/dialog>/,'');
html=html.replace(/<div class="cover-title">[\s\S]*?<\/div>/,'<div class="cover-title"><h1 id="bookTitle">劈<span>山</span></h1><h2>杨戬救母</h2></div>');
html=html.replaceAll('32.109','32.110').replaceAll('assets/yangjian-v109/video/opening-poster.png','assets/yangjian-v110/video/opening-poster.png');
await fs.writeFile('yangjian.html',html);
let js=await fs.readFile('yangjian.js','utf8');
js=js.replace("videoAsset='./assets/yangjian-v109/video/'","videoAsset='./assets/yangjian-v110/video/', audioAsset='./assets/yangjian-v110/audio/'");
js=js.replaceAll("asset+'audio/","audioAsset+'");
js=js.replace("const filename=v.dataset.video==='opening'?'opening':v.dataset.video;","const filename=v.dataset.video==='opening'?'opening':v.dataset.video;");
// Only opening uses the revised movie directory; chapter films stay intact.
js=js.replace("v.src=videoAsset+", "v.src=(v.dataset.video==='opening'?videoAsset:'./assets/yangjian-v108/video/')+");
js=js.replace(/function setSoundButton\(\)\{[^\n]*\}/,'function setSoundButton(){}');
js=js.replace(/\$\('#soundToggle'\)\.addEventListener[^\n]*\n/,'');
js=js.replace(/function setAuto\(v\)\{[^\n]*\}/,'function setAuto(v){automatic=Boolean(v)&&ready&&!$(\'dialog[open]\');autoY=scrollY;}');
js=js.replace(/\$\('#autoToggle'\)\.addEventListener\('click',[\s\S]*?;for\(const type/,'for(const type');
js=js.replaceAll("$('#menuToggle').setAttribute", "$('#menuToggle')?.setAttribute");
js=js.replace(/function cancelEntrance\(\)\{[^\n]*\}/,'function cancelEntrance(){entranceEpoch++;if(entranceTimer!==null)clearTimeout(entranceTimer);entranceTimer=null;}');
js=js.replace(/\$\('#beginStory'\)\.addEventListener[^\n]*\n/,'');
js=js.replace(/const menu=\$\('#chapterMenu'\);[^\n]*\n/,'');
js=js.replace(/\$\('#chapterStatus'\)\.textContent=[\s\S]*?(?=\}const nextScene)/,'');
js=js.replace(/let savedRead;[^\n]*\n/,'');
js=js.replace('v.volume=.65','v.volume=.82');
js=js.replaceAll('this.master.gain.value=.65','this.master.gain.value=.72').replaceAll('setTargetAtTime(.65,','setTargetAtTime(.72,');
js=js.replace("const sound=new StorySound();","const sound=new StorySound();\nfor(const type of ['pointerdown','touchend','keydown'])window.addEventListener(type,e=>{if(e.target.closest?.('[data-yj-return]'))return;if(!sound.enabled)sound.enable()},{once:true,passive:true});\nwindow.addEventListener('keydown',e=>{if(e.code==='KeyM')sound.enabled?sound.disable():sound.enable()});");
await fs.writeFile('yangjian.js',js);
const css=`
/* V32.110: quiet title; close-up motion carries the opening. */
.book-header{height:80px;background:none;justify-content:flex-start}
.book-header>a:first-child{font-size:38px;text-shadow:0 2px 12px #000}
.cover-title{left:8.8vw;top:17svh;width:27vw;pointer-events:none;color:#eeeeee}
.cover-title h1{display:flex;gap:.07em;font-family:"STZhongsong","华文中宋","Songti SC","SimSun",serif;font-size:clamp(92px,8.2vw,150px);font-weight:400;letter-spacing:.02em;line-height:1.08;transform:none;-webkit-text-stroke:0;text-shadow:0 4px 24px #0006}
.cover-title h1 span{transform:none}
.cover-title h2{font-family:"SimSun",serif;font-size:clamp(16px,1.15vw,22px);letter-spacing:.35em;line-height:1.8;margin:22px 0 0;color:#bdbdbd}
.cover-shade{background:linear-gradient(90deg,#050505b5 0%,#05050570 20%,transparent 45%),linear-gradient(0deg,#080808,transparent 19%,transparent 93%,#08080830)}
.cover-motion{min-height:0;height:100svh}
.cover-video,.cover-ink{object-position:50% 50%}
@media(max-width:680px){.cover-title{left:8vw;top:14svh;width:55vw}.cover-title h1{font-size:82px}.cover-title h2{font-size:15px;margin-top:14px}.cover-video,.cover-ink{object-position:59% 50%}.book-header{height:65px}.book-header>a:first-child{font-size:34px}}
`;
await fs.appendFile('yangjian.css',css);
let main=await fs.readFile('v31.html','utf8');main=main.replace(/(<!-- YJ APPEND (?:STYLE|CHAPTER|LOADER) START -->)[\s\S]*?(<!-- YJ APPEND (?:STYLE|CHAPTER|LOADER) END -->)/g,b=>b.replaceAll('32.109','32.110'));await fs.writeFile('v31.html',main);
console.log('Removed visible tools/menu/entry copy; minimal title and gesture audio retained.');
