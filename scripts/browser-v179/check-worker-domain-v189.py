from pathlib import Path
import json,tomllib,urllib.request,urllib.error
cfg=tomllib.loads((Path.home()/'AppData/Roaming/xdg.config/.wrangler/config/default.toml').read_text(encoding='utf-8'))
url='https://api.cloudflare.com/client/v4/accounts/0424e885f532f4b1ade3fe9216ddc64c/workers/subdomain'
req=urllib.request.Request(url,headers={'Authorization':'Bearer '+cfg['oauth_token']})
try:
 with urllib.request.urlopen(req,timeout=20)as r:d=json.load(r)
 result={'success':d.get('success'),'subdomain':(d.get('result')or{}).get('subdomain'),'readOnly':True};Path('.verify/v32-189/worker-domain.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result))
except urllib.error.HTTPError as e:print(json.dumps({'status':e.code,'readOnly':True}));raise
