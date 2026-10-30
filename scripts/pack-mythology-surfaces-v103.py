import os,subprocess,struct,zlib,json
ff='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe';root='assets/odyssey/pbr-v103';size=1024
def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
for asset in ['weathered_brown_planks','rough_linen','coast_sand_03','forest_ground_04','seaside_rock']:
 channels=[]
 for kind in ['AO','Rough','Displacement']:
  channels.append(subprocess.check_output([ff,'-v','error','-i',root+'/'+asset+'/'+kind+'.jpg','-vf','scale=1024:1024:flags=lanczos','-frames:v','1','-f','rawvideo','-pix_fmt','gray','pipe:1']))
 rgb=bytearray(size*size*3)
 for i,b in enumerate(channels):rgb[i::3]=b
 raw=b''.join(b'\x00'+rgb[y*size*3:(y+1)*size*3] for y in range(size))
 png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,6))+chunk(b'IEND',b'')
 open(root+'/'+asset+'/Surface.png','wb').write(png);print(asset,len(png))
json.dump({'method':'Data-channel packing only; R=original AO, G=original roughness, B=original height. Photographic albedo/normal unchanged.','resolution':1024,'reason':'Three coastal surfaces use 9 samplers, below the 16-sampler WebGL limit including lighting.'},open(root+'/PACKING.json','w'),indent=2)
