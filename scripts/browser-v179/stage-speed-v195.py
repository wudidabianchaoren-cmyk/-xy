from pathlib import Path
import os,re,json,hashlib
root=Path.cwd();out=root/'.verify/v32-195';stage=out/'site';out.mkdir(parents=True,exist_ok=True);stage.mkdir(exist_ok=True)
baseline=root/'.verify/v32-194/site';base=json.loads((root/'.verify/v32-194/asset-plan.json').read_text(encoding='utf-8'))
pages=['after-journey','rural-return','mid-autumn','physical-universe','humid-southeast-asia']
def write(path,text):
 if path.exists():path.unlink()
 path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding='utf-8',newline='\n')
old_runtime=(baseline/'browser-runtime-v180.js').read_text(encoding='utf-8');runtime=old_runtime
start=runtime.index("const poster=document.querySelector('.film-poster');")
end=runtime.index('await new Promise(requestAnimationFrame)',start)
runtime=runtime[:start]+runtime[end:]
old_warm="for(const [page,images]of Object.entries(resources.pageImages||{}))if(page!=='/v31.html')for(const image of images.slice(0,2))warmImage(image);warmImage('/assets/works/humid-southeast-asia/frame-01.webp');"
assert old_warm in runtime;runtime=runtime.replace(old_warm,'')
runtime=runtime.replace("import('/progressive-media-v187.js')","import('/progressive-media-v195.js')")
old_ring=(baseline/'v31-works-ring-v144.js').read_text(encoding='utf-8')
ring=re.sub(r"const coverPath=work.src;if\(coverPath\)\{const image=new Image\(\);.*?veil.prepend\(image\);\}","const coverPath=null;",old_ring,count=1)
assert ring!=old_ring
old_progressive=(baseline/'progressive-media-v187.js').read_text(encoding='utf-8');progressive=old_progressive.replace('Math.min(cursor+4,manifest.segments.length)','Math.min(cursor+(audit.ready?3:1),manifest.segments.length)');assert progressive!=old_progressive
old_app=(root/'src/directory-v141/app-v144.tsx').read_text(encoding='utf-8');app=old_app.replace("if(new URLSearchParams(location.search).get('renderer')==='web')await fontReady;","void fontReady.catch(()=>{});");assert 'void fontReady.catch(()=>{});'in app
compiled=(baseline/'scene-dist/browser-v192/directory-app.js').read_text(encoding='utf-8')
compiled_new=re.sub(r'new URLSearchParams\(location.search\).get\("renderer"\)==="web"&&await ([A-Za-z_$][\w$]*);',r'void \1.catch(()=>{});',compiled,count=1);assert compiled_new!=compiled
# Redraw the existing notebook texture when the delayed font arrives.
# Starting the room early must not permanently bake a fallback font into it.
draw_start=re.search(r'(\w+)\.fillStyle="#e8d49d"',compiled_new);assert draw_start
texture=re.search(r';let (\w+)=new \w+\((\w+)\);\1.colorSpace=\w+,\1.anisotropy=8;',compiled_new[draw_start.start():]);assert texture
offset=draw_start.start();draw=compiled_new[offset:offset+texture.start()];texture_end=offset+texture.end();ctx=draw_start[1];tex=texture[1]
refresh='void document.fonts.load("28px DirectoryHand").then(()=>{'+ctx+'.clearRect(0,0,1100,760);'+draw+';'+tex+'.needsUpdate=true;}).catch(()=>{});'
compiled_new=compiled_new[:texture_end]+refresh+compiled_new[texture_end:]
room_path=root/'src/directory-v141/room-v143.ts';room=room_path.read_text(encoding='utf-8')
if 'font-texture-refresh195'not in room:
 start=room.index("pc.fillStyle='#e8d49d'");end=room.index('\n const closedPaper=',start);drawing=room[start:end].strip()
 needle='closedPaper.anisotropy=8;';assert needle in room
 room=room.replace(needle,needle+"/*font-texture-refresh195*/void document.fonts.load('28px DirectoryHand').then(()=>{pc.clearRect(0,0,1100,760);"+drawing+"closedPaper.needsUpdate=true;}).catch(()=>{});",1)
 room_path.write_bytes(room.replace('\r\n','\n').replace('\n','\r\n').encode('utf-8'))
guard=(root/'work-first-frame-v195.js').read_text(encoding='utf-8')
def page(text,name):
 text=text.replace(old_runtime,runtime)
 if Path(name).stem in pages:
  text=re.sub(r'<img\b(?=[^>]*class="film-poster")[^>]*>','',text)
  text=re.sub(r'(<video\b[^>]*?)\s+poster="[^"]*"',r'\1',text)
  text=re.sub(r'<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>','',text)
  text=text.replace('</head>','<style>.film-hero{background:#000}.film-poster{display:none!important}.project-film-video{background:#000}</style><script>'+guard+'</script></head>',1)
 return text
replacements={old_runtime:runtime,old_ring:ring}
changed=[];files=[];packed={}
for row in base['files']:
 name=row['path'];src=baseline/name;target=stage/name;target.parent.mkdir(parents=True,exist_ok=True)
 if target.exists()and not os.path.samefile(src,target):target.unlink()
 if not target.exists():os.link(src,target)
 if src.suffix in ['.html','.js']:
  original=src.read_text(encoding='utf-8-sig');text=original
  for old,new in replacements.items():text=text.replace(old,new)
  if name.endswith('.html'):text=page(text,name)
  if name=='scene-dist/directory-v144/app.js':
   text=text.replace('directory-app.js','directory-app-fast195.js')
  if text!=original:
   if name.startswith('assets/browser-v192/packed/'):
    newname='assets/browser-v195/packed/'+hashlib.sha256(text.encode()).hexdigest()[:20]+'.js';packed[name]=newname;write(stage/newname,text)
   else:write(target,text);changed.append(name)
newmodule='scene-dist/browser-v192/directory-app-fast195.js';write(stage/newmodule,compiled_new);changed.append(newmodule)
write(stage/'progressive-media-v195.js',progressive);changed.append('progressive-media-v195.js')
for p in stage.glob('*.html'):
 text=p.read_text(encoding='utf-8');new=text
 for old,address in packed.items():new=new.replace('/'+old,'/'+address)
 if new!=text:write(p,new);changed.append(p.name)
for name in packed.values():changed.append(name)
for p in sorted(stage.rglob('*')):
 if p.is_file():
  name=p.relative_to(stage).as_posix()
  if name in {r['path']for r in base['files']} and name not in changed:files.append(next(r for r in base['files']if r['path']==name))
  else:
   data=p.read_bytes();files.append({'path':name,'bytes':len(data),'sha1':hashlib.sha1(data).hexdigest()})
report={'version':195,'files':files,'changed':sorted(set(changed)),'newPacked':packed,'originalMediaUnchanged':True,'staticOnly':True}
(out/'asset-plan.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
(root/'deploy/speed-v195-asset-plan.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
# Keep source changes reviewable alongside the exact delivery overlay.
for name,text in [('browser-runtime-v180.js',runtime),('v31-works-ring-v144.js',ring),('progressive-media-v187.js',old_progressive),('progressive-media-v195.js',progressive),('src/directory-v141/app-v144.tsx',app)]:
 (root/name).write_bytes(text.replace('\r\n','\n').replace('\n','\r\n').encode('utf-8'))
print(json.dumps({'changed':report['changed'],'posterGateRemoved':True,'startupSegments':'4 to 1','directoryFontNoLongerBlocks3D':True}))
