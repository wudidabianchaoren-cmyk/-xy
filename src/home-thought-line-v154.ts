type BootEntry={state:string;error?:string};
const audit={source:'actual home preparation phases and portfolioBoot entries',updates:[] as {at:number;text:string;home:string;desk:string;resourceReady:boolean}[],settled:false,removed:false};
(window as any).thoughtLineState=audit;
function install(){
 const prelude=document.getElementById('countdownPrelude'),progress=prelude?.querySelector<HTMLElement>('.opening-progress');if(!prelude||!progress||progress.querySelector('.thought-line'))return false;
 const root=document.createElement('div');root.className='thought-line';root.setAttribute('role','status');root.setAttribute('aria-live','polite');root.innerHTML='<span class="thought-line-symbol" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M3 10h3l2-4 3 8 2-4h4"/></svg></span><span class="thought-line-copy"></span><span class="thought-line-shimmer" aria-hidden="true"></span>';
 progress.querySelector('.opening-progress-track')?.after(root);const copy=root.querySelector<HTMLElement>('.thought-line-copy')!;
 let last='',closed=false;
 function update(){
  if(closed)return;const entries=(window as any).portfolioBoot?.entries as Map<string,BootEntry>|undefined,home=entries?.get('home')?.state||'pending',desk=entries?.get('directory')?.state||'pending',phases=((window as any).homeClockState?.preparePhases||[]) as {name:string}[];
  const has=(name:string)=>phases.some(p=>p.name===name),resourceReady=has('textures and environment ready');
  let text='正在唤醒庭院的光与声音';
  if(home==='error')text='建筑准备尚未完成，请使用下方重试';
  else if(home==='ready')text=desk==='ready'?'建筑与工作台已就绪，正在衔接开场':'庭院已就绪，工作台将在入场后继续准备';
  else if(has('normal buffers uploaded'))text='光影已归位，正在呈现庭院首帧';
  else if(has('surface shaders compiled'))text='石材与金属已准备，正在整理光影';
  else if(resourceReady)text='素材已经就位，正在准备真实光影';
  else if(has('courtyard geometry prepared'))text='建筑结构已经归位，正在读取石材与光线';
  else if(has('native decoded'))text='正在安放钟盘、石墙与树木';
  if(text===last)return;last=text;copy.textContent=text;root.classList.toggle('has-error',home==='error');root.dataset.home=home;root.dataset.desk=desk;
  audit.updates.push({at:performance.now(),text,home,desk,resourceReady});
 }
 function settle(){if(closed)return;closed=true;audit.settled=true;copy.textContent='准备完成，走进庭院';root.classList.add('is-settled');window.removeEventListener('v132:boot-progress',update);window.removeEventListener('v154:home-phase',update);window.setTimeout(()=>{root.remove();audit.removed=true;},420);}
 window.addEventListener('v132:boot-progress',update);window.addEventListener('v154:home-phase',update);window.addEventListener('v31:opening-complete',settle,{once:true});window.addEventListener('pagehide',settle,{once:true});update();
 return true;
}
if(!install()){const observer=new MutationObserver(()=>{if(install()||!document.getElementById('countdownPrelude'))observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});}
