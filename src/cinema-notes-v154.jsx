import React from 'react';
import {createRoot} from 'react-dom/client';
import FlexCarousel from './reactbits-v154/FlexCarousel.jsx';
import './cinema-notes-v154.css';
const section=document.getElementById('cinemaImageNotes'),host=document.getElementById('cinemaCarousel'),entry=document.getElementById('cinemaNotesEntry'),open=document.getElementById('openCinemaNotes'),close=document.getElementById('closeCinemaNotes'),controls=document.getElementById('readerControls');
if(section&&host&&entry&&controls){
 let root=null,items=[],inView=false,lastIndex=0,generation=0;
 const state=window.cinemaNotesState={version:'32.154',photos:0,opened:false,mounted:false,gpuReleased:true,mounts:0,unmounts:0,activeIndex:0,changes:[],props:{preset:'liquid',fit:'natural',autoplay:true,interval:2.8,dispersion:.035,focusOnClick:true,cardHeight:.68,squeeze:.08,captions:false}};
 function unmount(){generation++;if(root){root.unmount();root=null;state.unmounts++;}state.mounted=false;state.gpuReleased=true;}
 function sync(){
  const allowed=state.opened&&inView&&!document.hidden&&items.length===9;
  if(!allowed){unmount();return;}if(root)return;
  const token=++generation,offset=lastIndex,ordered=[...items.slice(offset),...items.slice(0,offset)];root=createRoot(host);state.mounted=true;state.gpuReleased=false;state.mounts++;
  root.render(<FlexCarousel items={ordered} {...state.props} intro="none" gap={20} radius={0} bend={.24} liquid={.06} captureWheel={false} onChange={index=>{if(token!==generation)return;lastIndex=(offset+index)%items.length;state.activeIndex=lastIndex;state.changes.push({index:lastIndex,at:performance.now()});document.getElementById('cinemaPhotoStatus').textContent=items[lastIndex].title;}} onSelect={index=>{state.selectedIndex=(offset+index)%items.length;state.selections=(state.selections||0)+1;}}/>);
 }
 function hide(returnToBook=true){state.opened=false;section.hidden=true;unmount();if(returnToBook){controls.scrollIntoView({behavior:'instant',block:'center'});open.focus({preventScroll:true});}}
 open.addEventListener('click',()=>{state.savedBook={page:window.readingBookState?.currentPage,spread:window.readingBookState?.spread};state.opened=true;section.hidden=false;section.scrollIntoView({behavior:'smooth',block:'start'});sync();});
 close.addEventListener('click',()=>hide());
 section.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End','Escape'].includes(event.key))event.stopPropagation();});
 new IntersectionObserver(([observation])=>{inView=observation.isIntersecting;state.inView=inView;sync();},{threshold:.08}).observe(host);
 new MutationObserver(()=>{entry.hidden=controls.hidden;if(controls.hidden&&state.opened)hide(false);}).observe(controls,{attributes:true,attributeFilter:['hidden']});entry.hidden=controls.hidden;
 document.addEventListener('visibilitychange',sync);addEventListener('pagehide',unmount);addEventListener('pageshow',sync);
 fetch('./assets/reading/cinema-notes-v154/manifest.json').then(r=>{if(!r.ok)throw Error('图像札记暂未加载');return r.json();}).then(manifest=>{items=manifest.items;state.photos=items.length;state.originalDimensions=items.map(item=>[item.width,item.height]);state.originalSources=items.map(item=>item.src);sync();}).catch(error=>{state.error=String(error);host.textContent='图像暂未加载，请稍后重试。';});
 state.close=()=>hide();
}
