from pathlib import Path
import json,hashlib,urllib.request,concurrent.futures,os,time
root=Path.cwd();out=root/'.verify/v32-188';origin=os.environ['CF_QA_ORIGIN'].rstrip('/');output=out/os.environ.get('CF_QA_ARTIFACT_FOLDER','artifacts');output.mkdir(parents=True,exist_ok=True)
paths=['index.html','browser-runtime-v180.js','browser-resources-v180.js','navigation-v152.js','progressive-media-v187.js','reading.html','mythology.html','learning.html','yangjian.html']+list(json.loads((root/'deploy/modules-v187.json').read_text(encoding='utf-8'))['outputs'])
def check(path):
 address=origin+'/'+(''if path=='index.html'else path)
 try:
  request=urllib.request.Request(address,headers={'Accept-Encoding':'identity'})
  with urllib.request.urlopen(request,timeout=40)as response:data=response.read();status=response.status;cache=response.headers.get('CF-Cache-Status')
  actual=hashlib.sha256(data).hexdigest();expected=hashlib.sha256((out/'site'/path).read_bytes()).hexdigest();return{'path':path,'status':status,'match':actual==expected,'SHA256':actual,'expectedSHA256':expected,'cache':cache}
 except Exception as error:return{'path':path,'match':False,'error':type(error).__name__}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:records=list(pool.map(check,paths))
direct=urllib.request.build_opener(urllib.request.ProxyHandler({}));reachability={}
for label,opener in [('systemRoute',urllib.request.build_opener()),('direct',direct)]:
 start=time.monotonic()
 try:
  with opener.open(origin+'/',timeout=25)as response:reachability[label]={'status':response.status,'seconds':round(time.monotonic()-start,2)};response.read(32)
 except Exception as error:reachability[label]={'error':type(error).__name__}
rangecheck={}
try:
 resource=json.loads((root/'browser-resources-v180.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));path=next(iter(resource['directMedia187'].values()))
 with urllib.request.urlopen(urllib.request.Request(origin+path,headers={'Range':'bytes=0-511'}),timeout=25)as response:rangecheck={'path':path,'status':response.status,'bytes':len(response.read(1024)),'contentRange':response.headers.get('Content-Range')}
except Exception as error:rangecheck={'error':type(error).__name__}
report={'origin':origin,'records':records,'allHashesMatch':all(r['match']for r in records),'range':rangecheck,'reachability':reachability};(output/'result.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps({'origin':origin,'allHashesMatch':report['allHashesMatch'],'checked':len(records),'failures':[r for r in records if not r['match']],'range':rangecheck,'reachability':reachability}))
