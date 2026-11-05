from pathlib import Path
p=Path('src/directory-v141/music.tsx');s=p.read_text(encoding='utf-8')
for a,b in [('aria-label="??????" disabled={!duration}','aria-label="音乐播放进度" disabled={!duration}'),('<span>??</span>','<span>音量</span>'),("volume?'????':'??????'","volume?'静音音乐':'恢复音乐音量'"),('aria-label="????" style','aria-label="音乐音量" style'),('aria-label="??????" onClick','aria-label="调高音乐音量" onClick')]:
 assert a in s,a
 s=s.replace(a,b)
s=s.replace('if(audio.current&&duration){audio.current.currentTime=value;setPosition(value);}', 'if(audio.current&&duration){if(Math.abs(audio.current.currentTime-value)>.08)audio.current.currentTime=value;setPosition(value);}')
p.write_text(s,encoding='utf-8');assert '????'not in s
