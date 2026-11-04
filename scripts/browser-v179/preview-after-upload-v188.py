from pathlib import Path
import json,time,subprocess,sys
root=Path.cwd();out=root/'.verify/v32-188';started=time.monotonic();last=-1
while time.monotonic()-started<7200:
 try:d=json.loads((out/'upload-progress.json').read_text(encoding='utf-8'))
 except (OSError,ValueError):time.sleep(5);continue
 completed=len(d.get('results',[]));total=d.get('totalBatches',1)
 if d.get('failedBatches',0)>=5:raise SystemExit('Upload stopped after bounded failures; preview not created.')
 milestone=int(completed*10/total)
 if milestone!=last:print(json.dumps({'uploadPercent':round(completed*100/total,1),'MiB':round(d.get('uploadedBytes',0)/1048576,1)}),flush=True);last=milestone
 if completed==total and not d.get('failedBatches'):break
 time.sleep(5)
else:raise SystemExit('Upload watchdog deadline; no publication attempted.')
cli=Path.home()/'AppData/Local/npm-cache/_npx/c943b712072b77c4/node_modules/wrangler/bin/wrangler.js'
args=['node',str(cli),'pages','deploy','.','--project-name','xy','--branch','cf-candidate-v188','--commit-hash','4fa0023','--commit-message','Complete preserved browser portfolio V188 candidate','--commit-dirty=true']
with(out/'preview-deploy.log').open('w',encoding='utf-8')as log:result=subprocess.run(args,cwd=out/'site',stdout=log,stderr=subprocess.STDOUT)
print(json.dumps({'previewCLIExit':result.returncode}),flush=True)
print(json.dumps({'cliOutput':(out/'preview-deploy.log').read_text(encoding='utf-8')[-2500:]}))
raise SystemExit(result.returncode)
