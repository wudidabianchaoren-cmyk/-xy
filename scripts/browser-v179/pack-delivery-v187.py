from pathlib import Path
import re,hashlib,json,urllib.parse
root=Path.cwd();stage=root/'.verify/v32-187/site';folder=stage/'assets/browser-v187/packed';folder.mkdir(parents=True,exist_ok=True)
def css(path,seen=None):
 seen=set()if seen is None else seen
 if path in seen:return ''
 seen.add(path);text=path.read_text(encoding='utf-8-sig')
 def imports(m):
  address=m[1];target=(path.parent/address).resolve()
  if address.startswith(('http:','https:','data:','/')):return m[0]
  if not target.is_relative_to(root):raise RuntimeError('CSS input outside checkout')
  return css(target,seen)
 text=re.sub(r'@import\s+url\(["\']([^"\']+)["\']\)\s*;',imports,text)
 def url(m):
  value=m[1].strip().strip('"\'')
  if value.startswith(('data:','http:','https:','/','#')):return m[0]
  relative=urllib.parse.urlsplit(value);target=(path.parent/relative.path).resolve()
  # Input textures can be junctions; lexical paths preserve their release URL.
  lexical=Path(__import__('os').path.normpath(path.parent/relative.path))
  address='/'+lexical.relative_to(root).as_posix()
  if relative.query:address+='?'+relative.query
  return 'url("'+address+'")'
 text=re.sub(r'url\(([^)]+)\)',url,text);return re.sub(r'@charset\s+[^;]+;','',text)
record=[]
for page in stage.glob('*.html'):
 text=page.read_text(encoding='utf-8-sig');tags=list(re.finditer(r'<link\b(?=[^>]*rel="stylesheet")[^>]*>',text,re.I));styles=[]
 for tag in tags:
  source=re.search(r'href="([^"]+)"',tag[0]);
  if not source or source[1].startswith(('http:','https:')):continue
  path=root/source[1].split('?')[0].lstrip('./');styles.append(css(path))
 if styles:
  content='\n'.join(styles);sha=hashlib.sha256(content.encode()).hexdigest()[:20];target=folder/(sha+'.css');target.write_text(content,encoding='utf-8')
  first=True
  def replace(m):
   global first
   if first:first=False;return '<link rel="stylesheet" href="/assets/browser-v187/packed/'+sha+'.css">'
   return ''
  text=re.sub(r'<link\b(?=[^>]*rel="stylesheet")[^>]*>',replace,text,flags=re.I)
 # The first meaningful cover is never lazily requested behind a black video.
 text=re.sub(r'<img\b(?=[^>]*class="film-poster")[^>]*>',lambda m:re.sub(r'\s+(?:loading|fetchpriority)="[^"]*"','',m[0])[:-1]+' loading="eager" fetchpriority="high">',text)
 page.write_text(text,encoding='utf-8');record.append({'page':page.name,'stylesheets':len(styles),'packedBytes':sum(len(x.encode())for x in styles)})
(root/'deploy/packed-delivery-v187.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps({'pages':len(record),'stylesheets':len(list(folder.glob('*.css')))}))
