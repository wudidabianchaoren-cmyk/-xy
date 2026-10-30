import React from 'react';
import {createRoot} from 'react-dom/client';
import TechText from './reactbits-v153/TechText.jsx';
import './techtext-v153.css';
const selector='h1,h2,h3,[data-tech-title],.works-orbit-title,.works-orbit-name,.project-title,.research-title,.learning-index a,.learning-header a,#indexTrigger,.brand strong';
const state=window.techTextState={version:'32.165',framework:'User supplied React Bits TechText',selector,active:false,mounts:0,unmounts:0,semanticDOM:true,interceptsClicks:false};
let current=null;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
function clear(){if(!current)return;const item=current;current=null;item.element.style.color=item.color;item.root.unmount();item.host.remove();state.active=false;state.unmounts++;}
function forward(event){if(!current)return;const node=current.host.querySelector('.tech-text');node?.dispatchEvent(new PointerEvent('pointermove',{clientX:event.clientX,clientY:event.clientY,pointerId:event.pointerId||1,pointerType:'mouse',bubbles:false}));}
function enter(element,event){
 if(reduced.matches||element===current?.element||element.closest('.tech-text-v153-overlay')||element.querySelector('img,svg,button,input,textarea,canvas'))return;
 const text=element.textContent.trim();if(text.length<2||text.length>80)return;
 const range=document.createRange();range.selectNodeContents(element);const lines=[...range.getClientRects()].filter(r=>r.width>1&&r.height>1);if(lines.length!==1)return;
 const rect=range.getBoundingClientRect(),style=getComputedStyle(element),size=parseFloat(style.fontSize);if(rect.width<10||rect.height>size*1.7)return;
 clear();const host=document.createElement('div');host.className='tech-text-v153-overlay';host.setAttribute('aria-hidden','true');
 const width=rect.width/.9,height=Math.max(rect.height,size*1.6);
 Object.assign(host.style,{left:(rect.left-(width-rect.width)/2)+'px',top:(rect.top-(height-rect.height)/2)+'px',width:width+'px',height:height+'px',color:style.color,fontFamily:style.fontFamily});document.body.append(host);
 const root=createRoot(host);current={element,host,root,color:element.style.color};state.active=true;state.text=text;state.mounts++;
 root.render(<TechText text={text} fontFamily={style.fontFamily} fontWeight={Number(style.fontWeight)||400} fontSize={size} letterSpacing={(parseFloat(style.letterSpacing)||0)/size} color={style.color} accentColor="#d5af69" align="center" reveal="letter" selection={true} labels={false} draggable={false} clickKick={true} specks={0} guides={false} sweep={false} intro="none" strokeWidth={1} dashLength={3} dashGap={2}/>);
 const item=current;let tries=0;const painted=()=>{if(current!==item)return;const canvas=host.querySelector('canvas');if(canvas?.width>1&&tries++>1){element.style.color='transparent';forward(event);}else if(tries++<30)requestAnimationFrame(painted);};requestAnimationFrame(painted);
}
document.addEventListener('pointerover',event=>{const element=event.target.closest?.(selector);if(element)enter(element,event);},{passive:true});
document.addEventListener('pointermove',forward,{passive:true});
document.addEventListener('pointerout',event=>{if(current&&current.element.contains(event.target)&&!current.element.contains(event.relatedTarget))clear();},{passive:true});
document.addEventListener('click',event=>{const element=event.target.closest?.(selector);if(!element)return;if(!current)enter(element,event);const item=current;if(item){item.host.querySelector('.tech-text')?.dispatchEvent(new MouseEvent('click',{clientX:event.clientX,clientY:event.clientY,bubbles:true}));item.host.animate([{filter:'brightness(1)'},{filter:'brightness(1.4)'},{filter:'brightness(1)'}],{duration:460,easing:'ease-out'});state.clicks=(state.clicks||0)+1;}},{capture:true,passive:true});
addEventListener('scroll',clear,{passive:true});addEventListener('resize',clear,{passive:true});addEventListener('pagehide',clear);
