from pathlib import Path
import tomllib,json,urllib.request
root=Path.cwd();out=root/'.verify/v32-193';out.mkdir(exist_ok=True)
token=tomllib.loads((Path.home()/'AppData/Roaming/xdg.config/.wrangler/config/default.toml').read_text(encoding='utf-8'))['oauth_token']
req=urllib.request.Request('https://api.cloudflare.com/client/v4/accounts/0424e885f532f4b1ade3fe9216ddc64c/pages/projects/xy',headers={'Authorization':'Bearer '+token})
with urllib.request.urlopen(req,timeout=60)as response:body=json.load(response)
assert body['success'];project=body['result'];config=project['source']['config']
record={'project':project['name'],'domains':project['domains'],'canonical':{k:project['canonical_deployment'].get(k)for k in ['id','url','environment','latest_stage']},'automaticGitBuilds':config.get('production_deployments_enabled'),'previewGitBuilds':config.get('preview_deployment_setting')}
assert record['automaticGitBuilds'] is False and record['previewGitBuilds']=='none'
(out/'project-state.json').write_text(json.dumps(record,indent=2),encoding='utf-8');print(json.dumps(record))
