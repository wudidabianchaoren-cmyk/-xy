"""Wait only for the user-authorized Pixabay track; never fetch around a challenge."""
from pathlib import Path
import time,json,hashlib,shutil,subprocess,os
root=Path(__file__).resolve().parents[1];out=root/'assets/music-v139';manifest=out/'source.json';status=root/'.verify/v32-139/music-receiver.json'
start=time.time();status.write_text(json.dumps({'status':'waiting','pid':os.getpid(),'expires':start+5400}),encoding='utf-8')
for _ in range(1350):
 for folder in [Path('C:/Users/HP/Desktop'),Path('C:/Users/HP/Downloads')]:
  for p in folder.glob('*.mp3'):
   name=p.stem.lower().replace('-','').replace('_','').replace(' ','')
   if p.stat().st_mtime<start-86400 or not ('435079' in name or 'electronicelectronicbass' in name):continue
   before=p.stat().st_size;time.sleep(1)
   if before<100000 or p.stat().st_size!=before:continue
   target=out/'electronic-electronic-bass-435079.mp3';shutil.copy2(p,target)
   ff='F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffprobe.exe'
   probe=subprocess.run([ff,'-v','error','-show_entries','format=duration','-of','json',str(target)],capture_output=True,text=True)
   if probe.returncode:continue
   data=json.loads(manifest.read_text(encoding='utf-8'));data.update(ready=True,file='./assets/music-v139/'+target.name,duration=float(json.loads(probe.stdout)['format']['duration']),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),downloadStatus='user completed browser verification and download',localSource=str(p))
   temp=manifest.with_suffix('.json.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8');temp.replace(manifest)
   status.write_text(json.dumps({'status':'received','source':str(p),'sha256':data['sha256']},ensure_ascii=False,indent=2),encoding='utf-8');raise SystemExit
 time.sleep(4)
status.write_text(json.dumps({'status':'expired waiting for user download'}),encoding='utf-8')
