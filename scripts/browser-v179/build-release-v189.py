from pathlib import Path
import subprocess,sys,json
out=Path('.verify/v32-189/build');out.mkdir(parents=True,exist_ok=True)
steps=[['node','scripts/build-browser-v189.mjs'],['node','scripts/build-fallback-v189.mjs']]+[[sys.executable,'scripts/browser-v179/'+name]for name in ['stage-netlify-v189.py','pack-delivery-v189.py','pack-classic-v189.py','pack-critical-v189.py','preserve-old-modules-v189.py','manifest-v189.py']]
for i,args in enumerate(steps):
 result=subprocess.run(args,capture_output=True,text=True,encoding='utf-8',errors='replace');(out/(str(i)+'.log')).write_text(result.stdout+'\n'+result.stderr,encoding='utf-8');print(json.dumps({'step':args[1],'exit':result.returncode}),flush=True)
 if result.returncode:print(result.stdout[-3000:]+result.stderr[-3000:]);raise SystemExit(result.returncode)
