from pathlib import Path
import hashlib,json
root=Path.cwd().resolve();stage=root/'.verify/v32-190/site';assert stage.resolve().is_relative_to(root)
for name in ['bake-room185.js','bake-room186.js','assets/browser-v185/room-atlas/on.png','assets/browser-v185/room-atlas/off.png','assets/browser-v185/room-atlas/base-on.png','assets/browser-v185/room-atlas/base-off.png','assets/browser-v190/room-atlas/on.png','assets/browser-v190/room-atlas/off.png','assets/browser-v190/room-atlas/base-on.png','assets/browser-v190/room-atlas/base-off.png']:
 p=stage/name;assert p.resolve().is_relative_to(stage.resolve())
 if p.is_file():p.unlink()
files=[]
for p in sorted(stage.rglob('*')):
 if not p.is_file()or p.suffix.lower()in{'.blend','.py','.exe','.dll','.map','.pem','.key'}:continue
 relative=p.relative_to(stage).as_posix()
 if relative.startswith('assets/browser-v181/')and p.suffix=='.glb':continue
 if any(x in relative.split('/')for x in['.git','.verify','node_modules']):raise RuntimeError('Private file in release')
 if relative=='blender/reference-architecture-v22/current-complete-courtyard.glb':continue
 if p.stat().st_size>50*1024*1024:raise RuntimeError('Oversized asset '+relative)
 with p.open('rb')as f:sha=hashlib.file_digest(f,'sha1').hexdigest()
 files.append({'path':relative,'bytes':p.stat().st_size,'sha1':sha})
record={'version':190,'files':files,'bytes':sum(f['bytes']for f in files)}
(root/'.verify/v32-190/asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8');(root/'deploy/netlify-v190-asset-plan.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps({'files':len(files),'bytes':record['bytes']}))
