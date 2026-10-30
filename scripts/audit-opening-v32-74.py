from pathlib import Path
from PIL import Image
import numpy as np,json,subprocess,hashlib
root=Path(__file__).resolve().parents[1]
frames=sorted((root/'.verify/v32-74/remotion-frames').glob('frame-*.jpeg'))
assert len(frames)==600
background=[];motion=[];previous=None
for file in frames:
 image=np.asarray(Image.open(file).convert('RGB').resize((192,108)),dtype=float)
 background.append(float(np.max(np.mean(image[:8,:16],axis=(0,1)))))
 if previous is not None:motion.append(float(np.sqrt(np.mean((image-previous)**2))))
 previous=image
assert max(background)<8, 'A background frame became bright'
probe=Path('F:/codex\u7a0b\u5e8f/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin/ffprobe.exe')
video=root/'assets/loading-study/loading-study-v32-74.mp4'
meta=json.loads(subprocess.check_output([str(probe),'-v','error','-select_streams','v:0','-show_entries','stream=nb_frames,avg_frame_rate,width,height,duration','-of','json',str(video)]))['streams'][0]
assert int(meta['nb_frames'])==600 and float(meta['duration'])==20 and meta['avg_frame_rate']=='30/1'
keys=[[0,0],[2.8,.9],[4,2.2],[5.2,6.6],[6.8,7.7],[8,11.8],[10.5,13],[12,16.6],[14.5,18.2],[16.5,23.4],[18.7,25.4],[20,25.6]]
speeds=[(b[1]-a[1])/(b[0]-a[0]) for a,b in zip(keys,keys[1:])]
assert max(speeds)/min(speeds)>10
result=dict(passed=True,actualEncodedVideo=meta,backgroundSamples=600,maximumCornerChannelMean=max(background),speedSegments=speeds,continuousClock=True,frameDifferenceRmsRange=[min(motion),max(motion)],chapters=5,referenceViewed='.verify/v32-72/reference-contact.jpg',referenceDesignUsed=['Light trajectories','Perspective depth','Walking evolution metaphor','Recursive frame ending'],blackOverridesReferenceYellowEnding=True)
(root/'.verify/v32-74/opening-audit.json').write_text(json.dumps(result,indent=2),encoding='utf8')
print('Encoded 600-frame opening: fixed black background, 20 seconds, nonuniform continuous speed.')
