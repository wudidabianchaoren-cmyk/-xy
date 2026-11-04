from pathlib import Path
import shutil
root=Path.cwd().resolve();original=root.parent/'cinematic-ai-archive-prototype'
for folder in [root,original]:
 for name in ['CURRENT-V32-185-RESUME.md','CURRENT-V32-188-RESUME.md']:
  p=folder/name;text=p.read_text(encoding='utf-8-sig');pointer='Latest scoped release: read CURRENT-V32-189-RESUME.md first. Same Cloudflare URL; V189 repairs published, local non-VPN route still unresolved.\n\n'
  if not text.startswith(pointer):p.write_text(pointer+text,encoding='utf-8')
for name in ['CURRENT-V32-189-RESUME.md','DEPLOY-CLOUDFLARE-BROWSER-V189.md']:
 shutil.copyfile(root/name,original/name)
for name in ['release','network','project-state','formal-flow','formal-hashes','formal-edits','formal-room']:
 shutil.copyfile(root/'deploy'/('cloudflare-v189-'+name+'.json'),original/'deploy'/('cloudflare-v189-'+name+'.json'))
p=original/'.gitignore';s=p.read_text(encoding='utf-8');extra='\n!/CURRENT-V32-189-RESUME.md\n!/DEPLOY-CLOUDFLARE-BROWSER-V189.md\n'
if '!/CURRENT-V32-189-RESUME.md'not in s:p.write_text(s+extra,encoding='utf-8')
print('Original checkout receives metadata only; original app and media untouched')
