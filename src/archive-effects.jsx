import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import BorderGlow from '../vendor/react-bits/BorderGlow.jsx';
import ElasticSlider from '../vendor/react-bits/ElasticSlider.jsx';
import HalftoneReveal from '../vendor/react-bits/HalftoneReveal.jsx';
import {archivePointerEffects} from './archive-pointer-effects';
const attached=new WeakSet();
function Existing({node}){const ref=useRef(null);useEffect(()=>{ref.current?.append(node);},[node]);return <span ref={ref} style={{display:'contents'}}/>;}
function glow(node){if(attached.has(node)||node.closest('.archive-border-mount'))return;attached.add(node);const mount=document.createElement('div');mount.className='archive-border-mount';node.before(mount);createRoot(mount).render(<BorderGlow backgroundColor="#16211b" glowColor="40 80 80" colors={['#e9c078','#83ad9d','#e4cdae']} borderRadius={14} glowRadius={32} glowIntensity={1.15} fillOpacity={.20}><Existing node={node}/></BorderGlow>);}
const index=document.getElementById('indexList');
if(index){const update=()=>index.querySelectorAll('.index-work').forEach(glow);new MutationObserver(update).observe(index,{childList:true});update();index.addEventListener('pointermove',e=>{const card=e.target.closest('.border-glow-card');if(card){const r=card.getBoundingClientRect(),angle=Math.atan2(e.clientY-r.y-r.height/2,e.clientX-r.x-r.width/2)*180/Math.PI+90;card.style.setProperty('--edge-proximity','100');card.style.setProperty('--cursor-angle',angle+'deg');}});}
function SliderBridge({node,min,max}){const [input,setInput]=useState({value:Number(node.getAttribute('aria-valuenow')),revision:0}),sending=useRef(false);useEffect(()=>{const sync=e=>{if(!sending.current)setInput(s=>({value:e.detail,revision:s.revision+1}));};node.addEventListener('v84:slider-sync',sync);return()=>node.removeEventListener('v84:slider-sync',sync);},[node]);return <ElasticSlider key={input.revision} className="archive-elastic" startingValue={min} maxValue={max} defaultValue={input.value} isStepped stepSize={1} leftIcon={<span/>} rightIcon={<span/>} onValueChange={v=>{sending.current=true;try{node.dispatchEvent(new CustomEvent('v84:slider-value',{detail:v}));}finally{sending.current=false;}}}/>;}
for(const [id,min,max]of [['volumeSlider',0,100],['brightnessSlider',60,115]]){const node=document.getElementById(id);if(node){node.replaceChildren();createRoot(node).render(<SliderBridge node={node} min={min} max={max}/>);}}
// Observe only the photo viewer's open/close state, never every changing node on the page.
let photoRoot=null,photoMount=null,photoTimer=0;
const clearPhoto=()=>{clearTimeout(photoTimer);photoRoot?.unmount();photoRoot=null;photoMount?.remove();photoMount=null;};
window.addEventListener('v85:image-viewer-close',clearPhoto);
window.addEventListener('v85:image-viewer-open',e=>{clearPhoto();const viewer=e.detail,img=viewer.querySelector('img');if(!img?.src)return;photoMount=document.createElement('div');photoMount.className='photo-halftone-reveal';img.after(photoMount);photoRoot=createRoot(photoMount);photoRoot.render(<HalftoneReveal src={img.src} fit="contain" mode="duotone" cellSize={7} inkColor="#25352d" accentColor="#b49459" paperColor="#eeece5" intro={false} linger={.15} revealRadius={220} wander={false}/>);photoTimer=setTimeout(clearPhoto,2500);});
archivePointerEffects();
