from pathlib import Path
import bisect, hashlib, json, shutil, struct, subprocess

root=Path.cwd()
ffmpeg=shutil.which('ffmpeg')
ffprobe=shutil.which('ffprobe')
assert ffmpeg and ffprobe,'Existing FFmpeg tools required'
resourcesPath=root/'browser-resources-v180.js'
resources=json.loads(resourcesPath.read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
sources=list(dict.fromkeys([*resources.get('originalMedia',{}),*resources['media']]))
mapping={}
records=[]
temp=root/'.verify/v32-185/media-build'
temp.mkdir(parents=True,exist_ok=True)

def run(args):
    return subprocess.run(args,check=True,capture_output=True,timeout=180)

def packetHash(path):
    return run([ffmpeg,'-v','error','-i',str(path),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-']).stdout.decode().strip()

for source in sources:
    original=root/source.lstrip('/')
    sha=hashlib.sha256(original.read_bytes()).hexdigest()
    target=root/'assets/browser-v185/media'/sha[:16]
    target.mkdir(parents=True,exist_ok=True)
    manifestPath=target/'manifest.json'
    if manifestPath.exists():
        manifest=json.loads(manifestPath.read_text(encoding='utf-8'))
        if manifest.get('sourceSHA256')==sha and manifest.get('packetHashVerified'):
            mapping[source]='/'+manifestPath.relative_to(root).as_posix()
            records.append({'source':source,'manifest':mapping[source],'cached':True,'segments':len(manifest['segments'])})
            continue
    fragmented=temp/(sha[:16]+'.mp4')
    run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(original),'-map','0:v:0','-map','0:a?','-c','copy','-avoid_negative_ts','make_zero','-movflags','empty_moov+default_base_moof+frag_keyframe','-frag_duration','1000000','-f','mp4',str(fragmented)])
    originalHash=packetHash(original)
    assert originalHash==packetHash(fragmented),'Video packets changed: '+source
    probe=json.loads(run([ffprobe,'-v','error','-show_streams','-show_format','-show_packets','-show_entries','stream=codec_name,codec_type,profile,level:format=duration:packet=pos,pts_time,duration_time,flags,codec_type','-of','json',str(fragmented)]).stdout)
    data=fragmented.read_bytes()
    atoms=[]
    at=0
    while at<len(data):
        size,kind=struct.unpack_from('>I4s',data,at)
        header=8
        if size==1:size=struct.unpack_from('>Q',data,at+8)[0];header=16
        if size==0:size=len(data)-at
        assert size>=header and at+size<=len(data)
        atoms.append((at,size,kind));at+=size
    initialization=b''.join(data[a:a+n]for a,n,kind in atoms if kind in [b'ftyp',b'moov'])
    (target/'init.mp4').write_bytes(initialization)
    avcc=initialization.find(b'avcC')
    assert avcc>=0,'Expected existing H264 media: '+source
    codec='avc1.'+initialization[avcc+5:avcc+8].hex()
    audio=[s for s in probe['streams']if s['codec_type']=='audio']
    if audio:
        assert all(s['codec_name']=='aac'for s in audio),'Unexpected original audio codec'
        codec+=',mp4a.40.2'
    starts=[a for a,n,kind in atoms if kind==b'moof']
    ends=starts[1:]+[next((a for a,n,kind in atoms if kind==b'mfra'),len(data))]
    segments=[]
    for i,(a,b)in enumerate(zip(starts,ends)):
        name=f'part-{i:04}.m4s'
        (target/name).write_bytes(data[a:b])
        segments.append({'file':name,'start':None,'end':None,'keyframes':[],'bytes':b-a})
    firstVideo=None
    for packet in probe['packets']:
        if 'pos'not in packet or'pts_time'not in packet:continue
        i=bisect.bisect_right(starts,int(packet['pos']))-1
        if i<0:continue
        segment=segments[i];pts=float(packet['pts_time']);end=pts+float(packet.get('duration_time',0))
        segment['start']=pts if segment['start']is None else min(segment['start'],pts)
        segment['end']=end if segment['end']is None else max(segment['end'],end)
        if packet.get('codec_type')=='video':
            firstVideo=pts if firstVideo is None else min(firstVideo,pts)
            if'K'in packet.get('flags',''):segment['keyframes'].append(pts)
    assert all(s['start']is not None and s['end']is not None for s in segments)
    manifest={'version':185,'source':source,'sourceSHA256':sha,'packetSHA256':originalHash,'packetHashVerified':True,'mime':'video/mp4; codecs="'+codec+'"','init':'init.mp4','firstVideoTime':firstVideo or 0,'duration':max(s['end']for s in segments),'segments':segments,'originalVideoAndAudioStreamsCopied':True}
    manifestPath.write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8')
    mapping[source]='/'+manifestPath.relative_to(root).as_posix()
    record={'source':source,'manifest':mapping[source],'packetHashVerified':True,'segments':len(segments),'largestSegmentBytes':max(s['bytes']for s in segments),'initialSegmentBytes':segments[0]['bytes'],'duration':manifest['duration']}
    records.append(record)
    print(json.dumps(record),flush=True)
resources['mseMedia']=mapping
resourcesPath.write_text('window.PORTFOLIO_RESOURCES_V180='+json.dumps(resources,separators=(',',':'))+';',encoding='utf-8')
(root/'deploy/media-v185.json').write_text(json.dumps({'version':185,'codecCopyOnly':True,'records':records},indent=2),encoding='utf-8')
print(json.dumps({'complete':True,'media':len(records)}))
