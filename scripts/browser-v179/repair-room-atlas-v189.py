"""Continue captured illumination across uncovered UV-chart borders.

The geometry, UV layout and captured pixels stay intact. Each disconnected UV
chart gets its own correction field, so cabinet/window colours cannot leak onto
neighbouring surfaces. Fine fallback texture detail is retained by a gain field.
"""
from pathlib import Path
import sys,json,gzip,struct,shutil
sys.path.insert(0,str(Path('.verify/v32-189/image-tools').resolve()))
import numpy as np
from scipy.ndimage import distance_transform_edt
from PIL import Image,ImageDraw
src=Path('assets/browser-v185/room-atlas');dst=Path('assets/browser-v189/room-atlas');dst.mkdir(parents=True,exist_ok=True)
layout=json.loads((src/'layout.json').read_text(encoding='utf-8'));raw=gzip.decompress((src/layout['dataFile']).read_bytes());size=4096;charts=[]
for mesh in layout['meshes']:
 arrays={key:np.frombuffer(raw,dtype='<f4'if v['type']=='f'else'<u4',count=v['count'],offset=v['offset'])for key,v in mesh.items()if key in ['source','index','uv']}
 uv=arrays['uv'].reshape(-1,2)*size;tri=arrays['index'].reshape(-1,3);parent=list(range(len(uv)))
 def find(a):
  while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
  return a
 # Source geometry can repeat a vertex per triangle. Equal atlas coordinates
 # still belong to one chart; do not incorrectly treat every triangle as one.
 shared={}
 for vertex,p in enumerate(uv):
  key=tuple(np.round(p*256).astype(int))
  if key in shared:parent[find(vertex)]=find(shared[key])
  else:shared[key]=vertex
 for a,b,c in tri:
  parent[find(int(b))]=find(int(a));parent[find(int(c))]=find(int(a))
 groups={}
 for t in tri:groups.setdefault(find(int(t[0])),[]).append(t)
 for triangles in groups.values():
  points=uv[np.array(triangles)];lo=np.maximum(0,np.floor(points.min(axis=(0,1))).astype(int)-1);hi=np.minimum(size,np.ceil(points.max(axis=(0,1))).astype(int)+2)
  if np.any(hi<=lo):continue
  mask=Image.new('L',tuple(hi-lo));draw=ImageDraw.Draw(mask)
  for t in points:draw.polygon([tuple(p-lo)for p in t],fill=255)
  charts.append((mesh['id'],tuple(lo),tuple(hi),np.array(mask)>0))
report={'version':189,'charts':len(charts),'geometryAndUVUnchanged':True,'modes':{}}
for mode in ['on','off']:
 native=np.array(Image.open(src/(mode+'.png')).convert('RGBA'));base=np.array(Image.open(src/('base-'+mode+'.png')).convert('RGBA'));result=np.array(Image.alpha_composite(Image.fromarray(base),Image.fromarray(native)));fixed=0;changed=0
 for mesh,lo,hi,mask in charts:
  x,y=lo;xx,yy=hi;n=native[y:yy,x:xx];b=base[y:yy,x:xx];covered=mask&(n[:,:,3]>250);valid=mask&(b[:,:,3]>0)
  if covered.sum()<4 or covered.sum()<mask.sum()*.06:continue
  _,indices=distance_transform_edt(~covered,return_indices=True);nearest=tuple(indices);gain=(n[:,:,:3][nearest].astype('float32')+2)/(b[:,:,:3][nearest].astype('float32')+2);gain=np.clip(gain,.035,5)
  corrected=np.clip(b[:,:,:3]*gain,0,255).astype('uint8');holes=valid&~covered;block=result[y:yy,x:xx];block[holes,:3]=corrected[holes];changed+=int(holes.sum());fixed+=1
 # Pad only after each chart has been corrected. Linear sampling uses this
 # border; no high mip level may sample the unrelated neighbouring chart.
 alpha=result[:,:,3]>0;distance,indices=distance_transform_edt(~alpha,return_indices=True);padding=(~alpha)&(distance<=4);result[padding]=result[tuple(indices)][padding]
 Image.fromarray(result).save(dst/(mode+'.webp'),lossless=True,method=6)
 report['modes'][mode]={'correctedCharts':fixed,'correctedPixels':changed,'bytes':(dst/(mode+'.webp')).stat().st_size,'preservedCoveredPixels':bool(np.array_equal(result[native[:,:,3]>250,:3],native[native[:,:,3]>250,:3]))}
for name in ['layout.json',layout['dataFile']]:shutil.copyfile(src/name,dst/name)
Path('deploy/room-atlas-v189.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report))
