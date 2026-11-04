from pathlib import Path
import subprocess,sys,json
out=Path('.verify/v32-187/build');out.mkdir(parents=True,exist_ok=True)
steps=[['node','scripts/build-browser-v187.mjs'],['node','scripts/build-fallback-v187.mjs']]+[[sys.executable,'scripts/browser-v179/'+name]for name in ['stage-netlify-v187.py','pack-delivery-v187.py','pack-classic-v187.py','pack-critical-v187.py','preserve-old-modules-v187.py','manifest-v187.py']]
for i,args in enumerate(steps):
 result=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',errors='replace');(out/(str(i)+'.log')).write_text(result.stdout+'\n'+result.stderr,encoding='utf-8');print(json.dumps({'step':args[1],'exit':result.returncode}),flush=True)
 if result.returncode:print(result.stdout[-3000:]+result.stderr[-3000:]);raise SystemExit(result.returncode)
