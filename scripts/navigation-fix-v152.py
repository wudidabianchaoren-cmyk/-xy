from pathlib import Path
import re
P=Path(__file__).resolve().parents[1]
V=P/'.verify/v32-152/before'
def backup(name):
 p=P/name;dest=V/name;dest.parent.mkdir(parents=True,exist_ok=True)
 if not dest.exists():dest.write_bytes(p.read_bytes())
 return p,p.read_text(encoding='utf-8')
p,s=backup('navigation-v144.js')
s=s.replace('version:144','version:152').replace('32.149','32.152')
s=s.replace("try{sessionStorage.setItem('portfolio-last-surface',JSON.stringify(context));if(main)sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}catch{}", "try{if(main){sessionStorage.setItem('portfolio-last-surface',JSON.stringify(context));sessionStorage.setItem('portfolio-home-return',JSON.stringify(context));sessionStorage.setItem('brain-universe-return-scroll',String(scrollY));}}catch{}")
start=s.index('   let prior;try{prior=JSON.parse(')
end=s.index('\n  },{hold:!local})',start)
s=s[:start]+'''   if(location.pathname.endsWith('/mythology-process.html')){location.assign(versioned(priorMyth?.href||'./mythology.html'));return;}
   if(location.pathname.endsWith('/mythology.html')){location.assign(versioned('./reading.html'));return;}
   const declared=document.querySelector('[data-project-return],.reading-header a,.learning-header a,[data-yj-return]')?.getAttribute('href');
   const destination=new URL(declared||'./v31.html?return=1',location.href);
   if(destination.origin!==location.origin||!destination.pathname.endsWith('/v31.html')){destination.href=new URL('./v31.html?return=1',location.href).href;}
   destination.searchParams.set('return','1');destination.searchParams.delete('directory');
   location.assign(versioned(destination.href));'''+s[end:]
(P/'navigation-v152.js').write_text(s,encoding='utf-8')
p,s=backup('v31-works-ring-v144.js')
s=s.replace("if(pushHistory)history.pushState({brainWork:url.searchParams.get('work')},'',work.href);", "if(pushHistory)history.pushState({brainWork:url.searchParams.get('work')},'',new URL('./v31.html?v=32.152',location.href));")
s=s.replace("&&event.data?.type==='brain-universe:work-return')history.back();", "&&event.data?.type==='brain-universe:work-return'){history.replaceState(null,'',new URL('./v31.html?v=32.152',location.href));finishProjectReturn();}")
s=s.replace("window.addEventListener('popstate',()=>{const i=works.findIndex(w=>w.href&&location.pathname.endsWith(new URL(w.href,location.href).pathname));", "window.addEventListener('popstate',event=>{const i=event.state?.brainWork?works.findIndex(w=>w.href&&new URL(w.href,location.href).pathname.endsWith('/'+event.state.brainWork+'.html')):-1;")
p.write_text(s,encoding='utf-8')
p,s=backup('home-creation-launch-v141.js')
s=s.replace("if(push)history.pushState({brainHomeCreation:true},'','./home-creation.html?v=32.141');", "if(push)history.pushState({brainHomeCreation:true},'',new URL('./v31.html?v=32.152',location.href));")
s=s.replace("&&event.data?.type==='brain-universe:work-return')history.back();", "&&event.data?.type==='brain-universe:work-return'){history.replaceState(null,'',new URL('./v31.html?v=32.152',location.href));close();}")
s=s.replace("window.addEventListener('popstate',()=>{if(location.pathname.endsWith('/home-creation.html'))open(false);else close();});", "window.addEventListener('popstate',event=>{if(event.state?.brainHomeCreation)open(false);else close();});")
p.write_text(s,encoding='utf-8')
p,s=backup('v31-motion-v144.js')
s=s.replace("url.searchParams.delete('return');url.hash='';", "for(const key of ['return','work','directory','project','view'])url.searchParams.delete(key);url.hash='';try{sessionStorage.removeItem('brain-universe-work-return');sessionStorage.setItem('brain-universe-return-scroll','0');sessionStorage.setItem('brain-universe-last-view','home');}catch{}")
s=s.replace("history.replaceState(history.state,'',url.pathname+url.search);\n      window.scrollTo", "history.replaceState(null,'',url.pathname+url.search);\n      window.scrollTo",1)
p.write_text(s,encoding='utf-8')
updated=[]
for p in P.glob('*.html'):
 s=p.read_text(encoding='utf-8')
 if not re.search(r'\./navigation-v(?:142|143|144)\.js',s):continue
 backup(p.name)
 s=re.sub(r'\./navigation-v(?:142|143|144)\.js\?v=[\d.]+','./navigation-v152.js?v=32.152',s)
 if p.name=='v31.html':
  s=s.replace('home-designed-intro-v151.js?v=32.151','home-designed-intro-v152.js?v=32.152')
  for name in ['v31-motion-v144.js','v31-works-ring-v144.js','home-creation-launch-v141.js','home-world-v146.js','scene-loader-v146.js']:
   s=re.sub(re.escape(name)+r'\?v=[\d.]+',name+'?v=32.152',s)
 if p.name=='mythology.html':
  s=re.sub(r'mythology-ue-v149\.(js|css)\?v=[\d.]+',r'mythology-ue-v149.\1?v=32.152',s)
 p.write_text(s,encoding='utf-8');updated.append(p.name)
print('V152 navigation integrated: '+', '.join(updated))
