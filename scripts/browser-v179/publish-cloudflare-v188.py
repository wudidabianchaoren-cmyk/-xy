from pathlib import Path
import json,subprocess
root=Path.cwd();out=root/'.verify/v32-188'
flow=json.loads((out/'public-preview/main-flow.json').read_text(encoding='utf-8'));hashes=json.loads((out/'preview-browser-hashes-final/result.json').read_text(encoding='utf-8'));extra=json.loads((out/'preview-extra-pages-actual/result.json').read_text(encoding='utf-8'));native=json.loads((out/'preview-native-media/result.json').read_text(encoding='utf-8'))
assert flow['pass']and len(flow['steps'])==12 and not flow.get('native')
assert len(flow['mythDepth']['verified'])==6 and not flow['mythDepth'].get('fallbacks')
assert hashes['allHashesMatch']and hashes['browserStatus']==200 and hashes['directBrowserStatus']==200
assert extra['pass']and len(extra['pages'])==3 and native['pass']
cli=Path.home()/'AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
args=['node',str(cli),'pages','deploy','.','--project-name','xy','--branch','main','--commit-hash','4fa0023','--commit-message','Preserved complete browser portfolio V188','--commit-dirty=true']
with(out/'production-deploy.log').open('w',encoding='utf-8')as log:result=subprocess.run(args,cwd=out/'site',stdout=log,stderr=subprocess.STDOUT)
print(json.dumps({'productionCLIExit':result.returncode,'output':(out/'production-deploy.log').read_text(encoding='utf-8')[-2500:]}))
raise SystemExit(result.returncode)
