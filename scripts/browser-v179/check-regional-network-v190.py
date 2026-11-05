"""Public, anonymous, free HTTP measurements; no account/credit purchase."""
from pathlib import Path
import json,urllib.request,urllib.error,collections,subprocess,sys
out=Path('.verify/v32-190');base='https://api.globalping.io/v1/'
def call(path,data=None):
 if sys.platform=='win32':
  # Use Windows' trusted certificate chain, including its normal intermediate
  # discovery. No certificate verification is disabled.
  script="[Console]::OutputEncoding=[Text.UTF8Encoding]::new(); $q=[Console]::In.ReadToEnd()|ConvertFrom-Json; if($null -eq $q.body){$r=Invoke-RestMethod -Uri $q.url -TimeoutSec 30}else{$r=Invoke-RestMethod -Uri $q.url -Method Post -ContentType 'application/json' -Body ($q.body|ConvertTo-Json -Depth 12) -TimeoutSec 30}; $r|ConvertTo-Json -Depth 40 -Compress"
  r=subprocess.run(['powershell','-NoProfile','-Command',script],input=json.dumps({'url':base+path,'body':data}),capture_output=True,text=True,encoding='utf-8',timeout=40)
  if r.returncode:raise RuntimeError(r.stderr[:500])
  return json.loads(r.stdout.lstrip('\ufeff'))
 req=urllib.request.Request(base+path,data=None if data is None else json.dumps(data).encode(),headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=30)as r:return json.load(r)
probes=call('probes');counts=collections.Counter(p['location']['country']for p in probes);print(json.dumps({'onlineChinaProbes':counts['CN'],'US':counts['US'],'DE':counts['DE']}),flush=True)
locations=[{'country':c,'limit':min(counts[c],n)}for c,n in [('CN',3),('US',1),('DE',1),('SG',1)]if counts[c]]
request={'type':'http','target':'vvainex.click','measurementOptions':{'protocol':'HTTPS','request':{'method':'HEAD','path':'/'}},'locations':locations,'inProgressUpdates':True}
try:
 result=call('measurements',request);(out/'regional-measurement.json').write_text(json.dumps({'request':request,'created':result},indent=2),encoding='utf-8');print(json.dumps(result))
except urllib.error.HTTPError as e:print(json.dumps({'status':e.code,'body':e.read().decode()[:600]}));raise
