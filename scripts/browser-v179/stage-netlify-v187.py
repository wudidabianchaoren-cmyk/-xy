from pathlib import Path
import json,shutil,os,re,hashlib,posixpath
root=Path.cwd().resolve();original=root.parent/'cinematic-ai-archive-prototype';out=root/'.verify/v32-187';stage=out/'site';stage.mkdir(exist_ok=True)
assert stage.resolve().is_relative_to(root)
plan=json.loads((original/'.verify/netlify-v179/asset-plan.json').read_text(encoding='utf-8'))
resources=json.loads((root/'browser-resources-v180.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
replaced={p.lstrip('/') for p in [*resources['media'],*resources['binary']]}
for name in replaced:
 staged=stage/name
 if staged.is_file():
  assert staged.resolve().is_relative_to(stage.resolve())
  staged.unlink() # Only this generated staging entry; original input stays intact.
def alias_image(path):
 for _ in range(4):
  if path not in resources.get('imageAliases',{}):break
  path=resources['imageAliases'][path]
 return path

def image_tag(match):
 attrs=re.sub(r'\s+(?:loading|decoding)="[^"]*"','',match.group(1));source=re.search(r'(?<![\w-])src="([^"]+)"',attrs)
 if source and not source[1].startswith(('data:','http:','https:','blob:')):
  path='/'+source[1].split('?')[0].removeprefix('./').lstrip('/');target=alias_image(path);variants=resources.get('responsiveImages',{}).get(target)
  if variants:
   attrs=attrs[:source.start()]+attrs[source.start():].replace(source[0],'src="'+variants[0]['src']+'"',1)
   attrs+=' srcset="'+', '.join(v['src']+' '+str(v['width'])+'w'for v in variants)+'" sizes="(min-width:1200px) 960px, 100vw"'
  elif target!=path:attrs=attrs[:source.start()]+attrs[source.start():].replace(source[0],'src="'+target+'"',1)
 return '<img'+attrs+' loading="lazy" decoding="async">'

head='<meta charset="utf-8"><script>\n'+(root/'transport-v187.js').read_text(encoding='utf-8')+'\n</script><meta name="google" content="notranslate"><script src="/browser-resources-v180.js?v=32.187"></script><script src="/browser-runtime-v180.js?v=32.187"></script>'
paths={x['path'] for x in plan['files']}|{'browser-resources-v180.js','browser-runtime-v180.js','progressive-media-v185.js','progressive-media-v186.js','progressive-media-v187.js','vendor/hls-1.7.4.min.js','vendor/hls-1.7.4-LICENSE'}
# Follow browser modules, including lazy imports introduced after the old plan
# was captured. A build can stop inlining an import without changing its URL.
queue=list(paths);seen=set()
while queue:
 name=queue.pop()
 if name in seen:continue
 seen.add(name);source=root/name
 if source.suffix not in {'.js','.html','.css'}or not source.is_file():continue
 for reference in re.findall(r'''["'`]((?:\./|\.\./)[^"'`\r\n<>]+?\.(?:js|css|wasm|ttf|woff2?)(?:\?[^"'`\r\n<>]*)?)["'`]''',source.read_text(encoding='utf-8-sig',errors='replace')):
  relative=posixpath.normpath(posixpath.join(posixpath.dirname(name),reference.split('?')[0].split('#')[0]))
  if relative.startswith('../')or relative.startswith('/')or any(p in {'.git','.verify','node_modules','scripts','tools'}for p in relative.split('/')):continue
  if(root/relative).is_file()and relative not in paths:paths.add(relative);queue.append(relative)
# Older dependency plans resolved junctions outside the checkout and silently
# missed folder-based material probes. Keep lexical release paths for inputs.
for name in list(paths):
 source=root/name
 if source.suffix not in {'.js','.html','.json','.css'} or not source.is_file():continue
 for reference in re.findall(r'''["'`]((?:\./)?(?:assets|blender|motion|vendor)/[^"'`\n\r<>]*?)["'`]''',source.read_text(encoding='utf-8-sig',errors='replace')):
  reference=reference.split('?')[0].split('#')[0].removeprefix('./')
  if any(c in reference for c in ['{','}',' ']):continue
  entry=root/reference
  if entry.is_file() and entry.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.hdr','.exr','.bin','.gz','.json','.glb','.gltf','.mp4','.webm','.mp3','.ogg','.wav','.woff2','.ttf','.js','.css','.html','.svg'}:paths.add(reference)
  elif entry.is_dir() and reference.rstrip('/') not in ['assets','blender','motion','vendor','assets/odyssey','assets/works']:
   paths.update(p.relative_to(root).as_posix() for p in entry.rglob('*') if p.is_file() and p.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.hdr','.exr','.bin','.gz','.json','.glb','.gltf','.mp4','.webm','.mp3','.ogg','.wav','.woff2','.ttf'})
for folder in ['assets/browser-v179','assets/browser-v180','assets/browser-v181','assets/browser-v182','assets/browser-v183','assets/browser-v185','assets/browser-v186','assets/browser-v187','scene-dist/browser-v186','scene-dist/fallback-v186','scene-dist/browser-v185','scene-dist/browser-v187','scene-dist/fallback-v185','scene-dist/fallback-v187']:
 paths.update(p.relative_to(root).as_posix() for p in (root/folder).rglob('*') if p.is_file() and p.suffix.lower() not in {'.map'} and not ('room-atlas' in p.parts and p.suffix.lower()=='.png') and p.name!='complete.json' and not (folder=='assets/browser-v181' and p.suffix=='.glb'))
# Native-derived material probes use a concatenated filename prefix.
for folder in ['assets/ue-v161','assets/sand-story']:
 paths.update(p.relative_to(root).as_posix() for p in (root/folder).rglob('*') if p.is_file())
for folder in (root/'assets/works').iterdir():
 if folder.is_dir():
  paths.update(p.relative_to(root).as_posix() for p in folder.glob('*.json') if p.is_file())
needed_images={v.lstrip('/')for v in resources.get('imageAliases',{}).values()}|{v['src'].lstrip('/')for variants in resources.get('responsiveImages',{}).values()for v in variants}
paths={p for p in paths if not p.startswith('assets/browser-v183/images/')or p in needed_images}
for name in sorted(paths):
 if name in replaced or name in {'blender/reference-architecture-v22/current-complete-courtyard.glb','assets/works/mid-autumn/source-original.mp4'}:continue
 source=root/name;target=stage/name
 if not source.is_file():raise RuntimeError('Missing release input: '+name)
 target.parent.mkdir(parents=True,exist_ok=True)
 if source.suffix=='.html':
  text=source.read_text(encoding='utf-8-sig')
  text=re.sub(r'<html\b([^>]*)>',lambda m:'<html'+m.group(1)+' translate="no" class="notranslate">',text,count=1,flags=re.I)
  text=re.sub(r'(<head\b[^>]*>)',lambda m:m.group(1)+head,text,count=1,flags=re.I)
  text=re.sub(r'((?:src|href)="\./[^"?]+\.(?:js|css))\?v=[^"&]+',r'\1?v=32.187',text)
  text=re.sub(r'<img\b([^>]*?)>',image_tag,text,flags=re.I)
  if name in {'v31.html','index.html'}:
   # Offscreen pictures retain their original pixels. They must not compete
   # with the first visible scene and the original opening media.
   text=re.sub(r'<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>','',text,flags=re.I)
   text=re.sub(r'<img\b([^>]*?)>',lambda m:'<img'+re.sub(r'\s+(?:loading|decoding|fetchpriority)="[^"]*"','',m.group(1))+' loading="lazy" decoding="async" fetchpriority="low">',text,flags=re.I)
   text=text.replace('<audio id="portfolioAudio" preload="auto"','<audio id="portfolioAudio" preload="none"')
  poster=re.search(r'<img\b[^>]*class="film-poster"[^>]*src="([^"]+)"',text)
  if poster:text=text.replace('</head>','<link rel="preload" as="image" href="'+poster[1]+'" fetchpriority="high"></head>',1)
  for originalURL in resources['media']:
   text=re.sub(r'(?<![\w-])src="'+re.escape('.'+originalURL)+r'"','data-portfolio-media-src=".'+originalURL+'"',text)
  target.write_text(text,encoding='utf-8')
 elif source.suffix.lower() in {'.js','.css','.json','.m3u8','.txt','.svg'} or name.startswith('vendor/'):
  shutil.copyfile(source,target)
 elif name.startswith(('assets/browser-v185/','assets/browser-v186/','assets/browser-v187/')):
  shutil.copyfile(source,target)
 elif not target.exists():
  existing=original/'.verify/netlify-v179/site'/name
  if not existing.exists():existing=source
  try:os.link(existing,target)
  except OSError:shutil.copyfile(existing,target)
# The published root must be the current complete portfolio entry, not the old prototype.
shutil.copyfile(stage/'v31.html',stage/'index.html')
headers=['/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n','/assets/browser-v179/*\n  Cache-Control: public, max-age=31536000, immutable\n','/assets/browser-v180/*\n  Cache-Control: public, max-age=31536000, immutable\n','/assets/browser-v182/*\n  Cache-Control: public, max-age=31536000, immutable\n','/assets/browser-v183/*\n  Cache-Control: public, max-age=31536000, immutable\n','/assets/browser-v185/*\n  Cache-Control: public, max-age=31536000, immutable\n','/scene-dist/browser-v185/*\n  Cache-Control: public, max-age=31536000, immutable\n','/scene-dist/fallback-v185/*\n  Cache-Control: public, max-age=31536000, immutable\n','/assets/browser-v181/*\n  Cache-Control: public, max-age=31536000, immutable\n']
for prefix in ['assets/browser-v187','scene-dist/browser-v187','scene-dist/fallback-v187']:headers.append('/'+prefix+'/*\n  Cache-Control: public, max-age=31536000, immutable\n')
for name in ['mid-autumn','humid-southeast-asia']:headers.append(f'/assets/browser-v180/{name}/index.m3u8\n  Content-Type: application/vnd.apple.mpegurl\n')
(stage/'_headers').write_text('\n'.join(headers),encoding='utf-8')
record={'version':187,'artifactType':'browser-release','requiresRuntimeVerification':True,'runtime':'browser / static Netlify; no workstation backend','originalSourcePreserved':True,'mediaEncoding':'existing high-quality media delivery / shared exact image payloads'}
(stage/'release-status.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
files=[]
for p in sorted(stage.rglob('*')):
 if p.is_file() and p.suffix.lower() not in {'.blend','.py','.exe','.dll','.map','.pem','.key'}:
  relative=p.relative_to(stage).as_posix()
  if relative.startswith('assets/browser-v181/') and p.suffix=='.glb':continue
  if relative in replaced or relative in {'blender/reference-architecture-v22/current-complete-courtyard.glb','assets/works/mid-autumn/source-original.mp4'}:continue
  if any(x in relative.split('/') for x in ['.git','.verify','node_modules']):raise RuntimeError('Private directory in release')
  with p.open('rb')as f:sha=hashlib.file_digest(f,'sha1').hexdigest()
  files.append({'path':relative,'bytes':p.stat().st_size,'sha1':sha})
(out/'asset-plan.json').write_text(json.dumps({'files':files,'bytes':sum(f['bytes']for f in files)},indent=2),encoding='utf-8')
print(json.dumps({'files':len(files),'bytes':sum(f['bytes']for f in files),'replacedOriginals':sorted(replaced),'largestNew':sorted([f for f in files if 'browser-v180'in f['path']],key=lambda f:f['bytes'],reverse=True)[:3]}))
