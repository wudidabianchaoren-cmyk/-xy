import React from 'react';
import {createRoot} from 'react-dom/client';
import TechText from './reactbits-v153/TechText.jsx';
import './techtext-v153.css';
const selector='h1,h2,h3,h4,[data-tech-title],.works-orbit-title,.works-orbit-name,.project-title,.research-title,.learning-index a,.learning-header a,#indexTrigger,.brand strong';
const state=window.techTextState={version:'32.165',framework:'User supplied React Bits TechText',selector,active:false,mounts:0,unmounts:0,clicks:0,semanticDOM:true,interceptsClicks:false,multiline:true};
const reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=null;
function clear(){const item=current;if(!item)return;current=null;item.observer?.disconnect();item.element.style.opacity=item.opacity;item.lines.forEach(line=>{line.root.unmount();line.host.remove();});state.active=false;state.unmounts++;}
function linesOf(element){
 const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT),lines=[];let textNode;
 while(textNode=walker.nextNode()){
  if(textNode.parentElement.closest('[aria-hidden="true"]'))continue;
  const style=getComputedStyle(textNode.parentElement),range=document.createRange();let offset=0;
  for(const character of textNode.textContent){range.setStart(textNode,offset);offset+=character.length;range.setEnd(textNode,offset);const r=range.getBoundingClientRect();if(r.width<.05||r.height<1)continue;
   let line=lines.find(l=>Math.abs(l.top-r.top)<2&&l.style.fontSize===style.fontSize&&l.style.fontFamily===style.fontFamily);
   if(!line){line={text:'',left:r.left,top:r.top,right:r.right,bottom:r.bottom,style};lines.push(line);}line.text+=character;line.left=Math.min(line.left,r.left);line.right=Math.max(line.right,r.right);line.bottom=Math.max(line.bottom,r.bottom);
  }
 }return lines.filter(l=>l.text.trim().length&&l.right-l.left>3);
}
function forward(event,type='pointermove'){
 if(!current)return;for(const line of current.lines){const node=line.host.querySelector('.tech-text');if(!node)continue;const options={clientX:event.clientX,clientY:event.clientY,pointerId:event.pointerId||1,pointerType:'mouse',button:0,bubbles:false};node.dispatchEvent(type==='click'?new MouseEvent(type,options):new PointerEvent(type,options));}
}
function enter(element,event){
 if(reduced.matches||element===current?.element||element.closest('.tech-text-v153-overlay')||element.querySelector('img,svg,button,input,textarea,canvas'))return;
 const text=element.textContent.trim(),style=getComputedStyle(element);if(text.length<2||text.length>140||(element.tagName==='H4'&&parseFloat(style.fontSize)<23))return;
 const measured=linesOf(element);if(!measured.length||measured.length>5)return;clear();
 const item=current={element,opacity:element.style.opacity,lines:[],observer:new MutationObserver(()=>{if(element.textContent.trim()!==text)clear();})};item.observer.observe(element,{subtree:true,childList:true,characterData:true});state.active=true;state.text=text;state.mounts++;state.lineCount=measured.length;
 for(const line of measured){
  const size=parseFloat(line.style.fontSize),width=(line.right-line.left)/.9,height=Math.max(line.bottom-line.top,size*1.6),host=document.createElement('div');host.className='tech-text-v153-overlay';host.setAttribute('aria-hidden','true');
  Object.assign(host.style,{left:(line.left-(width-(line.right-line.left))/2)+'px',top:(line.top-(height-(line.bottom-line.top))/2)+'px',width:width+'px',height:height+'px',fontFamily:line.style.fontFamily});(element.closest('#countdownPrelude')||document.body).append(host);const root=createRoot(host);item.lines.push({host,root});
  const transformed=line.style.textTransform==='uppercase'?line.text.toUpperCase():line.style.textTransform==='lowercase'?line.text.toLowerCase():line.text;
  root.render(<TechText text={transformed} fontFamily={line.style.fontFamily} fontWeight={Number(line.style.fontWeight)||400} fontSize={size} letterSpacing={(parseFloat(line.style.letterSpacing)||0)/size} color={line.style.color} accentColor="#d5af69" align="center" reveal="letter" selection labels={false} draggable={false} clickKick specks={0} guides={false} sweep={false} intro="none" strokeWidth={1} dashLength={3} dashGap={2}/>);
 }
 let count=0;function painted(){if(current!==item)return;const ready=item.lines.every(line=>(line.host.querySelector('canvas')?.width||0)>1);if(ready&&count>2){element.style.opacity='0';forward(event);}else if(count++<40)requestAnimationFrame(painted);else clear();}requestAnimationFrame(painted);
}
document.addEventListener('pointerover',e=>{const element=e.target.closest?.(selector);if(element)enter(element,e);},{passive:true});
document.addEventListener('pointermove',e=>{if(!e.target.closest?.('.tech-text-v153-overlay')){if(!current){const element=e.target.closest?.(selector);if(element)enter(element,e);}forward(e);}},{passive:true});
document.addEventListener('pointerout',e=>{if(current&&current.element.contains(e.target)&&!current.element.contains(e.relatedTarget))clear();},{passive:true});
document.addEventListener('click',e=>{const element=e.target.closest?.(selector);if(!element)return;if(reduced.matches){element.animate([{color:getComputedStyle(element).color},{color:'#d5af69'},{color:getComputedStyle(element).color}],{duration:240});state.clicks++;return;}enter(element,e);if(current){forward(e,'pointerdown');forward(e,'pointerup');forward(e,'click');state.clicks++;}},{capture:true,passive:true});
addEventListener('scroll',clear,{passive:true});addEventListener('resize',clear,{passive:true});addEventListener('pagehide',clear);document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});

const surfaceClasses=['v31-index-open','portfolio-portal-open','works-orbit-open','standalone-archive-open','is-project-active','directory-music-open','directory-source-open','portfolio-surface-suspended'];let surfaceSignature=surfaceClasses.map(c=>document.body.classList.contains(c)).join('/');new MutationObserver(()=>{const next=surfaceClasses.map(c=>document.body.classList.contains(c)).join('/');if(next!==surfaceSignature){surfaceSignature=next;clear();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
