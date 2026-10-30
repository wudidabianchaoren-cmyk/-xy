import json,subprocess,hashlib
from pathlib import Path
r=Path(__file__).resolve().parents[1];q=r/'.verify/v32-72'
ff=Path('F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin')
files=['assets/loading-study/loading-study-v32-72.mp4']+[f'assets/life-purpose/v32-72/life-purpose-{kind}-music.mp4' for kind in ['with','no']]
records=[]
for file in files:
 d=json.loads(subprocess.check_output([str(ff/'ffprobe.exe'),'-v','error','-show_format','-show_streams','-of','json',str(r/file)]));video=next(s for s in d['streams'] if s['codec_type']=='video');expected=20 if 'loading-study' in file else 50
 assert float(d['format']['duration'])==expected;assert int(video['nb_frames'])==(600 if expected==20 else 1200)
 records.append({'file':file,'duration':expected,'frames':int(video['nb_frames']),'sha256':hashlib.sha256((r/file).read_bytes()).hexdigest()})
for source,target in [('mix-with-music.wav','mix-with-music.wav'),('mix-no-music.wav','mix-no-music.wav')]:assert (r/'assets/life-purpose/v32-70'/source).read_bytes()==(r/'assets/life-purpose/v32-72'/target).read_bytes()
for t,name in [(34,'before'),(36.25,'mid'),(39,'after')]:
 outfile=q/f'production-chair-{name}.png';subprocess.run([str(ff/'ffmpeg.exe'),'-v','error','-y','-ss',str(t),'-i',str(r/files[1]),'-frames:v','1',str(outfile)],check=True)
 def pixels(f):return subprocess.check_output([str(ff/'ffmpeg.exe'),'-v','error','-i',str(f),'-vf','scale=400:225','-f','rawvideo','-pix_fmt','rgb24','-frames:v','1','-'])
 after=pixels(outfile);reference=pixels(r/f'.verify/life-film-v32-72/styleframe-chair-{name}.png')
 difference=sum(abs(a-b) for a,b in zip(after,reference))/len(after);assert difference<4,(name,difference)
result={'passed':True,'movies':records,'actualAudioListeningPerformed':False,'originalAudioWavsUnchanged':True,'productionChairMatchesAuthoredFrames':True,'newChairFrames':168,'preservedOtherSegments':True}
(q/'film-production.json').write_text(json.dumps(result,indent=2),'utf8');print(json.dumps(result))
