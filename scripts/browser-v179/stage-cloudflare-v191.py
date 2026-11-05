from pathlib import Path
import os,json,hashlib
root=Path.cwd().resolve();source=root/'.verify/v32-191/site';out=root/'.verify/v32-191/cloudflare';stage=out/'site';stage.mkdir(parents=True,exist_ok=True)
assert stage.resolve().is_relative_to(root)
plan=json.loads((root/'.verify/v32-191/asset-plan.json').read_text(encoding='utf-8'))
# Historical, unused source copies. The authored rural page uses film-sr via
# the retained HLS manifest; current myth uses the preserved native fields.
excluded={'assets/works/rural-return/original-film-v32-92.mp4','assets/odyssey/compact-v134/island-radiance.png'}
files=[]
for item in plan['files']:
 name=item['path']
 if name in excluded:continue
 assert item['bytes']<=25*1024*1024,name
 assert name not in {'_worker.js','wrangler.toml','wrangler.jsonc'} and not name.startswith('functions/')
 src=source/name;target=stage/name;target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists():os.link(src,target)
 files.append(item)
record={'version':191,'provider':'Cloudflare Pages','sourceCandidate':191,'originalInputsPreserved':True,'files':files,'bytes':sum(f['bytes']for f in files),'excludedUnusedSourceCopies':sorted(excluded),'sourceFilesDeleted':False}
(out/'asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8');(root/'deploy/cloudflare-v191-asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps({'files':len(files),'MiB':round(record['bytes']/1048576,1),'largestMiB':round(max(f['bytes']for f in files)/1048576,2)}))
