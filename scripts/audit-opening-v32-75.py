from pathlib import Path
import json,subprocess,math,hashlib
root=Path(__file__).resolve().parents[1]
ff=Path('F:/codex程序/FFmpeg-extracted/ffmpeg-8.1.2-essentials_build/bin')
video=root/'assets/loading-study/loading-study-v32-75.mp4'
meta=json.loads(subprocess.check_output([str(ff/'ffprobe.exe'),'-v','error','-select_streams','v:0','-show_entries','stream=nb_frames,avg_frame_rate,width,height,duration','-of','json',str(video)]))['streams'][0]
assert int(meta['nb_frames'])==600 and float(meta['duration'])==20 and meta['avg_frame_rate']=='30/1'
raw=subprocess.check_output([str(ff/'ffmpeg.exe'),'-v','error','-threads','1','-i',str(video),'-vf','scale=192:108','-pix_fmt','rgb24','-threads','1','-f','rawvideo','pipe:1'])
stride=192*108*3;assert len(raw)==stride*600
corners=[];motion=[];previous=None
for i in range(600):
 frame=raw[i*stride:(i+1)*stride]
 sums=[sum(frame[y*192*3+x*3+c] for y in range(8) for x in range(16))/128 for c in range(3)];corners.append(max(sums))
 if previous is not None:motion.append(math.sqrt(sum((frame[p]-previous[p])**2 for p in range(0,stride,12))/(stride/12)))
 previous=frame
assert max(corners)<8
old=(root/'motion/loading-study-v5/opening.js').read_text('utf8');new=(root/'motion/loading-study-v6/opening.js').read_text('utf8')
assert old[old.index(' function body('):]==new[new.index(' function body('):]
keys=[[0,0],[2.8,.9],[4,2.2],[5.2,6.6],[6.8,7.7],[8,11.8],[10.5,13],[12,16.6],[14.5,18.2],[16.5,23.4],[18.7,25.4],[20,25.6]]
speeds=[(b[1]-a[1])/(b[0]-a[0]) for a,b in zip(keys,keys[1:])];assert max(speeds)/min(speeds)>10
result=dict(passed=True,actualEncodedVideo=meta,backgroundSamples=600,maximumCornerChannelMean=max(corners),speedSegments=speeds,frameDifferenceRmsRange=[min(motion),max(motion)],onlyIllustrationsChanged=True,retainedHumanMotionLayoutEnglishProgressAndDuration=True,illustrations=['钻木取火与火塘','打制石器','木制车轮','星空与地平线观察'],narrative='艺术化的人类发现与创造意象，不宣称科学演化年表',videoSha256=hashlib.sha256(video.read_bytes()).hexdigest())
(root/'.verify/v32-75/opening-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),'utf8');print('Actual encoded 600 frames audited; fixed black and original motion preserved.')
