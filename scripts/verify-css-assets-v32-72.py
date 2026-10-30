from pathlib import Path
import re,json
r=Path(__file__).resolve().parents[1];checked=[]
for name in ['v31-final.css','v31-motion.css','v23.css']:
 for raw in re.findall(r'url\(([^)]+)\)',(r/name).read_text('utf8')):
  u=raw.strip().strip('\"\'')
  if u.startswith(('data:','#','https:','http:')):continue
  p=r/u.split('?')[0];assert p.is_file(),(name,u)
  checked.append({'stylesheet':name,'file':str(p.relative_to(r)).replace('\\','/')})
(r/'.verify/v32-72/css-assets.json').write_text(json.dumps({'passed':True,'checked':checked},indent=2),'utf8');print('All stylesheet assets exist:',len(checked))
