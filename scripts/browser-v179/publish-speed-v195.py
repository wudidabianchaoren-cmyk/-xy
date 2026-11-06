from pathlib import Path
import json,subprocess,sys
root=Path.cwd();out=root/'.verify/v32-195';production='--production'in sys.argv
read=lambda p:json.loads(p.read_text(encoding='utf-8'))
assert read(out/'local-final/result.json')['pass']and read(out/'handoff/result.json')['pass']
if production:assert read(out/'local-desk-final/result.json')['pass']and read(out/'preview/result.json')['pass']and read(out/'preview-hashes/result.json')['pass']
stage=out/'site';assert not(stage/'_worker.js').exists()and not(stage/'functions').exists()
cli=Path.home()/'AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
log=out/('production-deploy.log'if production else'preview-deploy.log')
args=['node',str(cli),'pages','deploy','.','--project-name','xy','--branch','main'if production else'speed-v195','--commit-hash','cebeae7','--commit-message','First-frame work playback and desk startup V195','--commit-dirty=true']
with log.open('w',encoding='utf-8')as stream:r=subprocess.run(args,cwd=stage,stdout=stream,stderr=subprocess.STDOUT)
print(json.dumps({'exit':r.returncode,'output':log.read_text(encoding='utf-8')[-1700:]}),flush=True);raise SystemExit(r.returncode)
