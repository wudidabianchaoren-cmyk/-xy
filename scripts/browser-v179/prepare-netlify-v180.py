from pathlib import Path
import json,subprocess,hashlib,gzip,urllib.request,tarfile,io
root=Path.cwd().resolve();out=root/'.verify/v32-180';out.mkdir(exist_ok=True)
if root.name!='cinematic-ai-archive-browser':raise RuntimeError('Isolated candidate only')
media=root/'assets/browser-v180';media.mkdir(exist_ok=True)
if not media.resolve().is_relative_to(root):raise RuntimeError('Do not overwrite linked original assets')
vendor=root/'vendor';vendor.mkdir(exist_ok=True)
version='1.7.4';target=vendor/f'hls-{version}.min.js'
if not target.exists():
 archive=urllib.request.urlopen(f'https://registry.npmjs.org/hls.js/-/hls.js-{version}.tgz',timeout=35).read()
 with tarfile.open(fileobj=io.BytesIO(archive),mode='r:gz') as package:
  target.write_bytes(package.extractfile('package/dist/hls.min.js').read());(vendor/f'hls-{version}-LICENSE').write_bytes(package.extractfile('package/LICENSE').read())
ffmpeg='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffmpeg.exe'
videos=[('mid-autumn','assets/works/mid-autumn/mid-autumn-web.mp4'),('humid-southeast-asia','assets/works/humid-southeast-asia/film-final-v149.mp4'),('courtyard-intro','assets/home-intro-v170/courtyard-16s.mp4'),('after-journey','assets/works/after-journey/trailer-v32-92.mp4'),('rural-return','assets/works/rural-return/film-sr-v32-92.mp4'),('yangjian','assets/yangjian-v116/video/opening.mp4')]
mapping={'media':{},'binary':{}};verification=[]
for name,source in videos:
 folder=media/name;folder.mkdir(exist_ok=True);playlist=folder/'index.m3u8';marker=folder/'complete.json'
 repackIntro=name=='courtyard-intro' and marker.exists() and json.loads(marker.read_text()).get('maxPartBytes',0)>8*1024*1024
 if not marker.exists() or repackIntro:
  command=[ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(root/source),'-map','0:v:0','-map','0:a?','-c','copy','-f','hls','-hls_time','2','-hls_segment_type','fmp4','-hls_playlist_type','vod','-hls_flags','independent_segments','-hls_fmp4_init_filename','init.mp4','-hls_segment_filename','part-%04d.m4s','index.m3u8']
  if name=='courtyard-intro':command[command.index('independent_segments')]='split_by_time'
  subprocess.run(command,check=True,timeout=120,cwd=folder)
  # Hash the demuxed video stream on both sides; packaging must not re-encode.
  hashes=[]
  for filename in [root/source,playlist]:
   result=subprocess.run([ffmpeg,'-hide_banner','-loglevel','error',*(['-allowed_extensions','ALL'] if filename.suffix=='.m3u8' else []),'-i',str(filename),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],capture_output=True,check=True,timeout=90);hashes.append(result.stdout.decode().strip())
  assert hashes[0]==hashes[1],f'Video stream changed: {name}'
  record={'source':source,'videoStreamSHA256':hashes[0],'videoStreamIdentical':True,'encoding':'stream copy; no re-encode','sourceBytes':(root/source).stat().st_size,'segments':len(list(folder.glob('*.m4s'))),'maxPartBytes':max(p.stat().st_size for p in folder.glob('*.m4s'))}
  marker.write_text(json.dumps(record,indent=2),encoding='utf-8')
 mapping['media']['/'+source]='/'+playlist.relative_to(root).as_posix();verification.append(json.loads(marker.read_text(encoding='utf-8')))
 print(json.dumps({'media':name,**verification[-1]}),flush=True)
originalBinary=['assets/odyssey/refit-v161/island-craft.glb','assets/odyssey/compact-v134/island-radiance.exr']
plan=json.loads((out/'asset-plan.json').read_text(encoding='utf-8'))
previousBinary={record['source'] for marker in media.glob('*/complete.json') if 'parts' in (record:=json.loads(marker.read_text(encoding='utf-8')))}
binary=originalBinary+sorted((previousBinary|{item['path'] for item in plan['files'] if item['bytes']>8*1024*1024 and Path(item['path']).suffix.lower() in {'.glb','.exr','.hdr','.bin','.gz'} and not item['path'].startswith('assets/browser-v180/')}) - set(originalBinary))
for source in binary:
 name=Path(source).stem+('' if source in originalBinary else '-'+hashlib.sha1(source.encode()).hexdigest()[:8]);folder=media/name;folder.mkdir(exist_ok=True);marker=folder/'complete.json'
 if marker.exists():record=json.loads(marker.read_text(encoding='utf-8'))
 else:
  raw=(root/source).read_bytes();packed=gzip.compress(raw,compresslevel=6,mtime=0);assert gzip.decompress(packed)==raw
  parts=[]
  for i,offset in enumerate(range(0,len(packed),4*1024*1024)):
   part=folder/f'part-{i:03d}.bin';part.write_bytes(packed[offset:offset+4*1024*1024]);parts.append('/'+part.relative_to(root).as_posix())
  record={'source':source,'encoding':'gzip','bytes':len(raw),'packedBytes':len(packed),'sha256':hashlib.sha256(raw).hexdigest(),'byteIdentical':True,'parts':parts};marker.write_text(json.dumps(record,indent=2),encoding='utf-8')
 mapping['binary']['/'+source]=record;verification.append(record);print(json.dumps({'binary':name,'bytes':record['bytes'],'packedBytes':record['packedBytes'],'parts':len(record['parts'])}),flush=True)
(root/'browser-resources-v180.js').write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(mapping,separators=(',',':'))+';',encoding='utf-8')
(out/'media-verification.json').write_text(json.dumps(verification,indent=2),encoding='utf-8')
print('Original media preserved; lossless delivery package ready',flush=True)
