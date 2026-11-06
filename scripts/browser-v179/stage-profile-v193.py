from pathlib import Path
import json,os,hashlib,re
root=Path.cwd().resolve();version=int(os.environ.get('PROFILE_REVISION','193'));out=root/f'.verify/v32-{version}';stage=out/'site';baseline=root/'.verify/v32-192/cloudflare/site'
out.mkdir(parents=True,exist_ok=True);stage.mkdir(exist_ok=True)
assert stage.resolve().is_relative_to(root)
plan=json.loads((root/'.verify/v32-192/cloudflare/asset-plan.json').read_text(encoding='utf-8'))
old_intro=re.search(r'<div class="personal-introduction">.*?</div>',(baseline/'index.html').read_text(encoding='utf-8'),re.S)[0]
source=root/'v31.html';source_text=source.read_text(encoding='utf-8')
if './personal-v193.css' not in source_text:
 source_text=source_text.replace('</head>','<link rel="stylesheet" href="./personal-v193.css?v=32.193"></head>',1)
 source.write_text(source_text,encoding='utf-8')
new_intro=re.search(r'<div class="personal-introduction">.*?</div>',source_text,re.S)[0]
css=(root/'personal-v193.css').read_bytes();assert b'</style' not in css.lower()
style='<style data-profile-v'+str(version)+'="true">'+css.decode('utf-8')+'</style>'
# A tiny scoped style stays inline so this repair adds no network dependency.
old_external=stage/('assets/browser-v193/personal-'+hashlib.sha256(css).hexdigest()[:16]+'.css')
if old_external.exists():
 assert old_external.resolve().is_relative_to(stage.resolve()) and not old_external.is_symlink()
 old_external.unlink()
changes=[];files=[]
for item in plan['files']:
 name=item['path'];src=baseline/name;target=stage/name;target.parent.mkdir(parents=True,exist_ok=True)
 if name in ['index.html','v31.html']:
  before=src.read_text(encoding='utf-8');assert before.count(old_intro)==1
  after=before.replace(old_intro,new_intro).replace('</head>',style+'</head>',1)
  assert after.replace(new_intro,old_intro).replace(style,'')==before
  if target.exists():target.unlink()
  target.write_text(after,encoding='utf-8');changes.append(name)
  data=target.read_bytes();files.append({'path':name,'bytes':len(data),'sha1':hashlib.sha1(data).hexdigest()})
 else:
  if not target.exists():os.link(src,target)
  assert os.path.samefile(src,target) and target.stat().st_size==item['bytes'],name
  files.append(item)
record={'version':version,'scope':'portrait display crop and factual introduction only','files':files,'bytes':sum(f['bytes']for f in files),'changed':changes,'unchangedFiles':len(files)-len(changes),'baselineProduction':'1c02a922-4093-4b16-917e-f247911b0d31','protectedSectionsUnchanged':True,'originalMediaUnchanged':True,'newRequests':0,'scopedStyleSHA256':hashlib.sha256(css).hexdigest()}
(out/'asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
(root/f'deploy/profile-v{version}-asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in record.items()if k!='files'}))
