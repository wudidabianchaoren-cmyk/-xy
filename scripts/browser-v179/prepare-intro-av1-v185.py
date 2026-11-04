from pathlib import Path
import json,subprocess
root=Path.cwd()
source='/assets/home-intro-v170/courtyard-16s.mp4'
script=(root/'scripts/browser-v179/prepare-media-v185.py').read_text(encoding='utf-8')
script=script.replace("sources=list(dict.fromkeys([*resources.get('originalMedia',{}),*resources['media']]))",'sources='+repr([source]))
script=script.replace('mapping={}',"mapping=dict(resources.get('mseMedia',{}))")
script=script.replace("original=root/source.lstrip('/')","original=root/'.verify/v32-185/intro-av1.mp4'")
script=script.replace("avcc=initialization.find(b'avcC')\n    assert avcc>=0,'Expected existing H264 media: '+source\n    codec='avc1.'+initialization[avcc+5:avcc+8].hex()", "avcc=initialization.find(b'av1C')\n    assert avcc>=0,'Expected AV1'\n    profile=initialization[avcc+5]>>5;level=initialization[avcc+5]&31\n    codec=f'av01.{profile}.{level:02}M.08'")
script=script.replace("'originalVideoAndAudioStreamsCopied':True","'originalVideoAndAudioStreamsCopied':False,'highQualityAV1Derivative':True,'originalPreserved':True")
script=script.replace("root/'deploy/media-v185.json'","root/'deploy/intro-av1-v185.json'")
script=script.replace("'codecCopyOnly':True","'codecCopyOnly':False,'originalSourcePreserved':True")
exec(compile(script,'prepare-av1','exec'))
