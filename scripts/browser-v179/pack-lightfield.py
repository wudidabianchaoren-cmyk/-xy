from pathlib import Path
from PIL import Image
import json,hashlib
root=Path.cwd().resolve();backup=root/'.verify/v32-179/source-captures';backup.mkdir(exist_ok=True)
report=json.loads((root/'assets/browser-v179/packing-verification.json').read_text(encoding='utf-8')) if (root/'assets/browser-v179/packing-verification.json').exists() else []
for scene in ['room','myth']:
 folder=root/f'assets/browser-v179/{scene}-field';manifest=json.loads((folder/'manifest.json').read_text(encoding='utf-8'))
 if not folder.resolve().is_relative_to(root):raise RuntimeError('Do not write through junction')
 for pose in manifest['poses']:
  for key in ['on','off']:
   source=folder/pose[key]
   if source.suffix!='.png':continue
   target=source.with_suffix('.webp');image=Image.open(source).convert('RGBA');image.save(target,lossless=True,exact=True,method=4)
   decoded=Image.open(target).convert('RGBA');assert decoded.tobytes()==image.tobytes(),'Lossless pixel check failed'
   record={'scene':scene,'pose':pose['id'],'state':key,'file':target.name,'sourceBytes':source.stat().st_size,'bytes':target.stat().st_size,'decodedPixelSHA256':hashlib.sha256(image.tobytes()).hexdigest(),'pixelIdentical':True};report.append(record);pose[key]=target.name
   destination=backup/scene/source.name;destination.parent.mkdir(exist_ok=True);assert destination.resolve().is_relative_to(root);source.replace(destination)
 manifest['packing']={'codec':'WebP lossless','resolutionPreserved':True,'decodedPixelsVerified':True}
 (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
(root/'assets/browser-v179/packing-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'images':len(report),'sourceBytes':sum(x['sourceBytes']for x in report),'packedBytes':sum(x['bytes']for x in report),'pixelIdentical':all(x['pixelIdentical']for x in report)}))
