"""Remove serial critical request hops while preserving authored execution order."""
from pathlib import Path
import re,json,posixpath
root=Path.cwd();stage=root/'.verify/v32-192/site';report=[]
for page in stage.glob('*.html'):
 text=page.read_text(encoding='utf-8');embedded=[]
 def script(match):
  url=match[1].split('?')[0];name=url.removeprefix('./').lstrip('/')
  if name not in ['browser-resources-v180.js','browser-runtime-v180.js'] and not name.startswith('assets/browser-v192/packed/'):return match[0]
  body=(stage/name).read_text(encoding='utf-8-sig');
  if len(body.encode())>65536:return match[0]
  assert '</script' not in body.lower(),name
  embedded.append({'path':name,'bytes':len(body.encode())});return '<script data-critical-source="'+name+'">\n'+body+'\n</script>'
 text=re.sub(r'<script\s+src="([^"\n]+)"\s*>\s*</script>',script,text)
 def stylesheet(match):
  path=match[1].removeprefix('./').lstrip('/')
  if not path.startswith('assets/browser-v192/packed/'):return match[0]
  body=(stage/path).read_text(encoding='utf-8');
  if len(body.encode())>16384:return match[0]
  embedded.append({'path':path,'bytes':len(body.encode())});return '<style data-critical-source="'+path+'">'+body+'</style>'
 text=re.sub(r'<link rel="stylesheet" href="([^"\n]+)">',stylesheet,text)
 # External script preloads retained for compression and shared caching.
 preloads=set()
 entries={'index.html':['home-world-v146','home-designed-intro-v160','home-thought-line-v160','scene-loader-v146'],'v31.html':['home-world-v146','home-designed-intro-v160','home-thought-line-v160','scene-loader-v146'],'mythology.html':['mythology-web-v165','mythology-local-v162'],'reading.html':['reading-book-v155']}
 if page.name in entries:
  queue=['scene-dist/browser-v192/'+name+'.js'for name in entries[page.name]]
  while queue:
   name=queue.pop()
   if name in preloads:continue
   p=stage/name
   if not p.is_file():raise RuntimeError('Missing critical module '+name)
   preloads.add(name)
   for address in re.findall(r'''(?:from|import)\s*["'](\.[^"']+\.js)["']''',p.read_text(encoding='utf-8')):
    queue.append(posixpath.normpath(posixpath.join(posixpath.dirname(name),address)))
  text=text.replace('</head>',''.join('<link rel="modulepreload" href="/'+name+'">'for name in sorted(preloads))+'</head>',1)
 page.write_text(text,encoding='utf-8');report.append({'page':page.name,'embedded':embedded,'modulepreloads':sorted(preloads),'authoredExecutionOrderPreserved':True})
(root/'deploy/critical-delivery-v192.json').write_text(json.dumps(report,indent=2));print(json.dumps({'pages':len(report),'serialRequestsRemoved':sum(len(x['embedded'])for x in report)}))
