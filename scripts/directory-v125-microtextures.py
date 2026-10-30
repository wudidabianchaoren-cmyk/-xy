import numpy as np,json,zlib,struct,hashlib
from pathlib import Path
R=Path.cwd();A=R/'assets/directory-v125/materials';A.mkdir(parents=True,exist_ok=True)
def png(path,rgb):
 h,w,_=rgb.shape
 def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d)&0xffffffff)
 raw=b''.join(b'\0'+rgb[y].tobytes() for y in range(h));path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,8))+chunk(b'IEND',b''))
n=512;yy,xx=np.mgrid[:n,:n];rng=np.random.default_rng(125);records=[]
for name,mean,variation,strength,tile in [('brass',.34,.11,.12,.07),('abs',.48,.07,.10,.045),('porcelain',.24,.045,.045,.08),('paper',.86,.065,.16,.04),('rubber',.83,.075,.19,.05),('aluminium',.38,.085,.08,.07)]:
 noise=rng.random((n,n));broad=np.sin(xx*2*np.pi/n*3+.3)*np.sin(yy*2*np.pi/n*5+.7)
 if name in ['brass','aluminium']:
  strip=rng.random(n);height=.75*strip[yy]+.25*noise;rough=np.clip(mean+variation*((height-.5)*1.2+.15*broad),.08,.97)
 elif name=='paper':
  height=.6*noise+.2*np.sin(xx*.73)+.2*np.sin(yy*.79);rough=np.clip(mean+variation*(height-.3),.1,.98)
 else:height=noise;rough=np.clip(mean+variation*((noise-.5)+.13*broad),.08,.98)
 # Periodic central differences yield truly tileable normal maps, never colour/noise mixed into lighting.
 dx=(np.roll(height,-1,1)-np.roll(height,1,1))*strength;dy=(np.roll(height,-1,0)-np.roll(height,1,0))*strength
 norm=np.stack([-dx,-dy,np.ones_like(dx)],axis=-1);norm/=np.linalg.norm(norm,axis=-1,keepdims=True)
 normal=np.round((norm*.5+.5)*255).astype(np.uint8);rr=np.round(rough*255).astype(np.uint8);roughrgb=np.repeat(rr[:,:,None],3,2)
 png(A/(name+'-normal.png'),normal);png(A/(name+'-roughness.png'),roughrgb)
 records.append({'kind':name,'normal':name+'-normal.png','roughness':name+'-roughness.png','tileMetres':tile,'roughnessRange':[float(rough.min()),float(rough.max())],'normalGreenConvention':'OpenGL +Y','colourSpace':'Non-Color linear data','provenance':'Original deterministic generated manufacturing microtexture; not a scanned photograph','normalSHA256':hashlib.sha256((A/(name+'-normal.png')).read_bytes()).hexdigest()})
(A/'SOURCE.json').write_text(json.dumps({'version':'32.125','resolution':[512,512],'records':records,'wood':'Existing real photo walnut maps remain in v123; do not replace with these procedural maps','pot':'Existing CC0 photo-derived 2K ceramic pot maps remain in v123'},indent=2),encoding='utf8')
print('V125_MICROTEXTURES_COMPLETE',len(records))
