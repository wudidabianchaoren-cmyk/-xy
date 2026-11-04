from pathlib import Path
import re,hashlib,json
root=Path.cwd();stage=root/'.verify/v32-189/site';folder=stage/'assets/browser-v189/packed';records=[]
tag=re.compile(r'<script\s+src="([^"?]+)(?:\?[^"\n]*)?"\s*>\s*</script>',re.I)
for page in stage.glob('*.html'):
 text=page.read_text(encoding='utf-8');matches=list(tag.finditer(text));groups=[]
 for match in matches:
  if groups and not text[groups[-1][-1].end():match.start()].strip():groups[-1].append(match)
  else:groups.append([match])
 for group in reversed(groups):
  if len(group)<2:continue
  inputs=[];sources=[]
  for item in group:
   path=stage/item[1].removeprefix('./').lstrip('/');assert path.is_file(),path
   inputs.append(path.read_text(encoding='utf-8-sig'));sources.append(item[1])
  body='\n;\n'.join(inputs)+'\n';sha=hashlib.sha256(body.encode()).hexdigest()[:20];name=sha+'.js';(folder/name).write_text(body,encoding='utf-8');url='/assets/browser-v189/packed/'+name
  text=text[:group[0].start()]+'<script src="'+url+'"></script>'+text[group[-1].end():]
  if len(group)>=5:text=text.replace('</head>','<link rel="preload" as="script" href="'+url+'" fetchpriority="high"></head>',1)
  records.append({'page':page.name,'url':url,'sources':sources,'bytes':len(body.encode()),'authoredOrderPreserved':True})
 page.write_text(text,encoding='utf-8')
(root/'deploy/classic-v189.json').write_text(json.dumps(records,indent=2),encoding='utf-8');print(json.dumps({'groups':len(records),'requestsRemoved':sum(len(r['sources'])-1 for r in records)}))
