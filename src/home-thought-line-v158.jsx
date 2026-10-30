import React,{useEffect,useState} from 'react';
import{createRoot}from'react-dom/client';
import ThoughtLine from './thought-line-v158/ThoughtLine';
import './home-thought-line-v158.css';
const audit=window.thoughtLineState={version:161,source:'user supplied complete ThoughtLine / real film and preparation clock',updates:[],settled:false,removed:false,english:true};
function Preparation(){
 const [steps,setSteps]=useState(['Preparing the opening film']),[working,setWorking]=useState(true),[elapsed,setElapsed]=useState(0);
 useEffect(()=>{
  let settled=false,indexStarted=false,indexReady=false;
  const elapsedNow=()=>Math.min(20,document.querySelector('.prelude-opening-video')?.currentTime??0);
  const update=()=>{if(settled)return;const phases=window.homeClockState?.preparePhases||[],has=n=>phases.some(p=>p.name===n),home=window.portfolioBoot?.entries.get('home')?.state,roomRequired=window.portfolioBoot?.required?.has('directory'),roomReady=window.portfolioBoot?.entries.get('directory')?.state==='ready';
   const names=['Reading the clock-tower geometry'];
   if(has('native decoded'))names.push('Assembling the clock mechanisms');
   if(has('textures and environment ready'))names.push('Preparing tower stone, bronze and warm light');
   if(has('surface shaders compiled'))names.push('Compiling the courtyard materials');
   if(has('geometry buffers uploaded'))names.push('Preparing the courtyard reflections');
   if(home==='ready')names.push('The courtyard is ready · preparing the clock-tower reveal');
   if(home==='ready'&&roomReady&&!indexStarted){indexStarted=true;audit.islandIndexStartedAt=performance.now();Promise.all(['./assets/odyssey/refit-v148/vegetation-grounded-c.json','./assets/odyssey/compact-v134/height.json'].map(url=>fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}))).then(()=>{indexReady=true;audit.islandIndexReadyAt=performance.now();update()}).catch(e=>{audit.islandIndexError=String(e)});}
   if(indexStarted)names.push(indexReady?'Island terrain and coastal plant index ready':'Indexing island terrain and coastal plants');
   if(indexReady)names.push('Finishing the opening film and preparing the handoff');
   if(home==='error')names.push('Preparation paused — please retry');
   const visible=names.slice(-3);setSteps(previous=>{if(previous.join('|')===visible.join('|'))return previous;audit.updates.push({at:performance.now(),steps:[...names],home});return visible;});
  };
  const finish=()=>{if(settled)return;settled=true;audit.settled=true;audit.settledAt=performance.now();audit.elapsed=elapsedNow();if(window.portfolioOpeningTimeline)window.portfolioOpeningTimeline.finishedAt=audit.settledAt;setElapsed(audit.elapsed);setWorking(false);};
  const timer=setInterval(()=>{if(!settled)setElapsed(elapsedNow())},100);
  window.addEventListener('v154:home-phase',update);window.addEventListener('v132:boot-progress',update);window.addEventListener('v31:opening-complete',finish,{once:true});update();
  return()=>{clearInterval(timer);window.removeEventListener('v154:home-phase',update);window.removeEventListener('v132:boot-progress',update);window.removeEventListener('v31:opening-complete',finish);audit.removed=true;};
 },[]);
 return <ThoughtLine working={working} elapsed={elapsed} label="Preparing…" doneLabel="Prepared in" steps={steps} glyph="sparkle" fontSize={14} color="#ddd0b4" glyphColor="#d9ba7f" breathPeriod={1.6} breathDepth={.45} settleDuration={350} settleBlur={2} collapsible collapseOnSettle showTimer onSettle={seconds=>audit.displayedSeconds=seconds}/>;
}
function install(){const prelude=document.getElementById('countdownPrelude'),progress=prelude?.querySelector('.opening-progress');if(!prelude||!progress||progress.querySelector('.thought-line-v158-host'))return false;const host=document.createElement('div');host.className='thought-line-v158-host';progress.prepend(host);const root=createRoot(host);root.render(<Preparation/>);const observer=new MutationObserver(()=>{if(!host.isConnected){observer.disconnect();root.unmount();}});observer.observe(document.body,{childList:true,subtree:true});return true;}
if(!install()){const observer=new MutationObserver(()=>{if(install()||!document.getElementById('countdownPrelude'))observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});}
