(()=>{
 const saved=new Map();let owner=null,allowed=null;
 const silence=node=>{if(node===allowed)return;if(!saved.has(node))saved.set(node,{paused:node.paused,muted:node.muted,volume:node.volume});node.muted=true;node.pause();};
 window.portfolioAudioFocus={get owner(){return owner},claim(id,media){if(owner===id)return;owner=id;allowed=media;document.querySelectorAll('audio,video').forEach(silence);window.dispatchEvent(new CustomEvent('portfolio:audio-focus',{detail:{owner}}));},release(id){if(owner!==id)return;owner=null;allowed=null;for(const[node,prior]of saved){node.muted=prior.muted;node.volume=prior.volume;if(!prior.paused&&node.isConnected)node.play().catch(()=>{});}saved.clear();window.dispatchEvent(new CustomEvent('portfolio:audio-focus',{detail:{owner:null}}));}};
 document.addEventListener('play',e=>{if(owner&&e.target instanceof HTMLMediaElement)silence(e.target);},true);
})();
