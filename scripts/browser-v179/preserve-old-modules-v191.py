from pathlib import Path
import shutil
root=Path.cwd();stage=root/'.verify/v32-191/site'
for folder in ['scene-dist/browser-v190','scene-dist/fallback-v190','scene-dist/browser-v189','scene-dist/fallback-v189','scene-dist/browser-v185','scene-dist/fallback-v185','scene-dist/browser-v186','scene-dist/fallback-v186','scene-dist/browser-v187','scene-dist/fallback-v187']:
 for source in(root/folder).rglob('*'):
  if source.is_file()and source.suffix!='.map':
   target=stage/source.relative_to(root);target.parent.mkdir(parents=True,exist_ok=True)
   if not target.exists()or not source.samefile(target):shutil.copyfile(source,target)
print('Previous immutable module namespaces preserved for existing visitors')
