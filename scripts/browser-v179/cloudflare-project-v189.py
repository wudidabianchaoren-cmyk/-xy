from pathlib import Path
import tomllib,json,urllib.request,sys
root=Path.cwd();out=root/'.verify/v32-189';out.mkdir(parents=True,exist_ok=True)
cfg=tomllib.loads((Path.home()/'AppData/Roaming/xdg.config/.wrangler/config/default.toml').read_text(encoding='utf-8'))
headers={'Authorization':'Bearer '+cfg['oauth_token']};aid='0424e885f532f4b1ade3fe9216ddc64c';endpoint='https://api.cloudflare.com/client/v4/accounts/'+aid+'/pages/projects/xy'
def api(url,data=None):
 request=urllib.request.Request(url,headers={**headers,**({'Content-Type':'application/json'}if data is not None else{})},data=None if data is None else json.dumps(data).encode(),method='GET'if data is None else'PATCH')
 with urllib.request.urlopen(request,timeout=45)as response:r=json.load(response)
 if not r.get('success'):raise RuntimeError(str(r.get('errors')))
 return r['result']
project=api(endpoint)
if '--stop-git-builds'in sys.argv:
 source=project.get('source')
 if source:
  settings=dict(source['config']);settings.update({'production_deployments_enabled':False,'preview_deployment_setting':'none'})
  project=api(endpoint,{'source':{'type':source['type'],'config':settings}})
source=project.get('source')or{};settings=source.get('config')or{}
summary={'name':project['name'],'accountId':aid,'subdomain':project['subdomain'],'productionBranch':project.get('production_branch'),'source':{'type':source.get('type'),'repository':settings.get('repo_name'),'productionDeploymentsEnabled':settings.get('production_deployments_enabled'),'previewDeploymentSetting':settings.get('preview_deployment_setting')},'latestDeployment':{k:(project.get('latest_deployment')or{}).get(k)for k in ['id','url','environment','latest_stage','uses_functions']},'canonicalDeployment':{k:(project.get('canonical_deployment')or{}).get(k)for k in ['id','url','environment','latest_stage','uses_functions']}}
(out/'project-state.json').write_text(json.dumps(summary,indent=2),encoding='utf-8');print(json.dumps(summary))
