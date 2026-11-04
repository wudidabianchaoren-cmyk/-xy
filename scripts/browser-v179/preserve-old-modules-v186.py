from pathlib import Path
import shutil
root=Path.cwd();stage=root/'.verify/v32-186/site'
for folder in ['scene-dist/browser-v185','scene-dist/fallback-v185']:
 for source in(root/folder).rglob('*'):
  if source.is_file()and source.suffix!='.map':
   target=stage/source.relative_to(root);target.parent.mkdir(parents=True,exist_ok=True)
   if not target.exists()or not source.samefile(target):shutil.copyfile(source,target)
print('Previous immutable module namespaces preserved for existing visitors')
