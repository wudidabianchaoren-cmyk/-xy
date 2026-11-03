"""Transport the original opening MP4 without introducing media-segment boundaries."""
from pathlib import Path
import json,hashlib
root=Path.cwd().resolve();source=root/'assets/home-intro-v170/courtyard-16s.mp4';target=root/'assets/browser-v182/original-intro';target.mkdir(parents=True,exist_ok=True);assert target.resolve().is_relative_to(root)
raw=source.read_bytes();parts=[]
for index,offset in enumerate(range(0,len(raw),4*1024*1024)):
 path=target/f'part-{index:03d}.bin';path.write_bytes(raw[offset:offset+4*1024*1024]);parts.append('/'+path.relative_to(root).as_posix())
joined=b''.join((root/path.lstrip('/')).read_bytes()for path in parts);assert joined==raw
proof={'source':'/'+source.relative_to(root).as_posix(),'bytes':len(raw),'encoding':'identity','media':True,'parts':parts,'sha256':hashlib.sha256(raw).hexdigest(),'reconstructedBytesIdentical':True,'originalDurationSeconds':16,'originalFrames':480}
resource=root/'browser-resources-v180.js';data=json.loads(resource.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'));data['binary'][proof['source']]=proof;data.setdefault('originalMedia',{})[proof['source']]=True;resource.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(data,separators=(',',':'))+';',encoding='utf-8');(target/'verification.json').write_text(json.dumps(proof,indent=2),encoding='utf-8');print(json.dumps({'originalOpening':True,'bytes':len(raw),'parts':len(parts),'bytesIdentical':True}))
