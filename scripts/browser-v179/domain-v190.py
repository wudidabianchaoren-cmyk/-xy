"""Manage only the user-authorized vvainex.click / existing xy Pages project."""
from pathlib import Path
import json,tomllib,urllib.request,urllib.error,sys
root=Path.cwd();out=root/'.verify/v32-190';out.mkdir(exist_ok=True);aid='0424e885f532f4b1ade3fe9216ddc64c';domain='vvainex.click';base='https://api.cloudflare.com/client/v4'
def api(path,data=None,method=None):
 cfg=tomllib.loads((Path.home()/'AppData/Roaming/xdg.config/.wrangler/config/default.toml').read_text(encoding='utf-8'))
 req=urllib.request.Request(base+path,data=None if data is None else json.dumps(data).encode(),method=method or('GET'if data is None else'POST'),headers={'Authorization':'Bearer '+cfg['oauth_token'],'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=35)as r:result=json.load(r)
 except urllib.error.HTTPError as e:raise RuntimeError(str(e.code)+' '+e.read().decode()[:800])from None
 if not result.get('success'):raise RuntimeError(str(result.get('errors'))[:800])
 return result['result']
zones=api('/zones?name='+domain+'&account.id='+aid)
if not zones and '--create-zone'in sys.argv:zones=[api('/zones',{'name':domain,'account':{'id':aid},'type':'full'})]
record={'domain':domain,'accountId':aid,'zones':[]}
for zone in zones:
 z={k:zone.get(k)for k in ['id','name','status','name_servers','original_name_servers','plan']};record['zones'].append(z)
 try:records=api('/zones/'+zone['id']+'/dns_records?per_page=100');z['records']=records
 except RuntimeError as error:
  if not str(error).startswith('403 '):raise
  records=[];z['dnsReadPermissionError']=str(error)
 if '--set-pages-records'in sys.argv:
  if z.get('dnsReadPermissionError'):raise RuntimeError('Use authorized dashboard for DNS records; CLI lacks DNS permission')
  for name in [domain,'www.'+domain]:
   existing=[r for r in records if r['name']==name and r['type']in['A','AAAA','CNAME']]
   target={'type':'CNAME','name':name,'content':'xy-crg.pages.dev','ttl':1,'proxied':True}
   if not existing:api('/zones/'+zone['id']+'/dns_records',target)
   elif len(existing)==1 and existing[0]['type']=='CNAME'and existing[0]['content']=='xy-crg.pages.dev':pass
   else:raise RuntimeError('Review existing address records before replacement: '+name)
  z['records']=api('/zones/'+zone['id']+'/dns_records?per_page=100')
 if '--check-activation'in sys.argv:z['activation']=api('/zones/'+zone['id']+'/activation_check',{},'PUT')
record['pagesDomains']=api('/accounts/'+aid+'/pages/projects/xy/domains')
if '--add-pages-domains'in sys.argv:
 for name in [domain,'www.'+domain]:
  if not any(d['name']==name for d in record['pagesDomains']):api('/accounts/'+aid+'/pages/projects/xy/domains',{'name':name})
 record['pagesDomains']=api('/accounts/'+aid+'/pages/projects/xy/domains')
(out/'domain-state.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps(record,ensure_ascii=True))
