from pathlib import Path
import json,gzip,struct,hashlib
folder=Path('assets/browser-v185/room-atlas');source=Path('.verify/v32-185/room-layout-full.json');record=json.loads(source.read_text(encoding='utf-8'));payload=bytearray();meshes=[]
for mesh in record['meshes']:
 result={k:mesh[k]for k in['id','name','sourceVertices']}
 for field,fmt in [('source','I'),('index','I'),('uv','f')]:
  values=mesh[field];result[field]={'offset':len(payload),'count':len(values),'type':fmt};payload.extend(struct.pack('<'+str(len(values))+fmt,*values))
 meshes.append(result)
compressed=gzip.compress(payload,compresslevel=9,mtime=0);name='layout-'+hashlib.sha256(compressed).hexdigest()[:20]+'.bin.gz';(folder/name).write_bytes(compressed)
metadata={'version':185,'sourcePoses':record['sourcePoses'],'originalGeometryPreserved':True,'dataFile':name,'dataBytes':len(payload),'meshes':meshes};(folder/'layout.json').write_text(json.dumps(metadata,separators=(',',':')),encoding='utf-8');print(json.dumps({'jsonBytes':(folder/'layout.json').stat().st_size,'dataBytes':len(payload),'transferBytes':len(compressed)}))
