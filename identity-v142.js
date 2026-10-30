(()=>{'use strict';
 const list=document.getElementById('indexList');if(!list)return;
 let queued=false;
 const descriptions={作品:'五项影像作品，观看成片与制作画面。',阅读:'翻开电影手稿，走进水墨故事与三维海湾。',学习:'镜头笔记、制作流程，以及创作中遇到的问题。',个人介绍:'吴翔宇 · 视觉传达设计 · AIGC 影像与三维叙事。'};
 function sync(){queued=false;
  for(const item of list.querySelectorAll('.index-work')){const title=item.querySelector('.title')?.textContent.trim();if(title==='实验'||title==='关于'){(item.closest('.archive-border-mount')||item).remove();continue;}const text=descriptions[title],meta=item.querySelector('.meta');if(meta&&text&&meta.textContent!==text)meta.textContent=text;}
  [...list.querySelectorAll('.index-work')].forEach((item,i)=>{const n=item.querySelector('.number'),text=String(i+1).padStart(2,'0');if(n&&n.textContent!==text)n.textContent=text;item.style.setProperty('grid-column','auto','important');item.style.setProperty('grid-row','auto','important');});
 }
 new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(sync);}}).observe(list,{childList:true,subtree:true});sync();
})();
