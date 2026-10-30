from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'motion/life-purpose-v2/export.cjs';s=p.read_text('utf-8')
start=s.index("}else{\n const outfile=")
s=s[:start]+s[start:].replace("const outfile=path.join(OUT,'silent-film.mp4');","const patch=MODE==='patch';const outfile=path.join(OUT,patch?'chair-patch.mp4':'silent-film.mp4');",1).replace('i<1200','i<(patch?168:1200)',1).replace('},i/24);','},(patch?33:0)+i/24);',1)
needle=" enc.stdin.end();await done;\n"
addition=""" if(patch){
  await command(['-v','warning','-y','-i',path.join(ROOT,'assets/life-purpose/v32-70/silent-film.mp4'),'-i',outfile,'-filter_complex','[0:v]trim=start=0:end=33,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[0:v]trim=start=40:end=50,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1:a=0[v]','-map','[v]','-an','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',path.join(OUT,'silent-film.mp4')]);
 }
 const finalVideo=path.join(OUT,'silent-film.mp4');
"""
s=s.replace(needle,needle+addition).replace("'-i',outfile,'-i',path.join(OUT,`mix-", "'-i',finalVideo,'-i',path.join(OUT,`mix-")
s=s.replace('frames:1200,fps:24','frames:1200,newRenderedFrames:patch?168:1200,unchangedSegmentsRetained:patch,fps:24')
p.write_text(s,'utf-8')
print('168 chair frames replace 33–40s; existing opening and ending frames and audio retained')
