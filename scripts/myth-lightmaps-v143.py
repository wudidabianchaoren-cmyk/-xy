import bpy, json, time
from pathlib import Path

root=Path(__file__).resolve().parents[1]
out=root/'assets/odyssey/lightmaps-v143'
out.mkdir(parents=True,exist_ok=True)
rows=[]
for name,size in [('island-radiance',2048),('rocks-radiance',1024)]:
    source=root/'assets/odyssey/compact-v134'/f'{name}.exr'
    image=bpy.data.images.load(str(source),check_existing=False)
    original=list(image.size)
    image.scale(size,size)
    image.file_format='HDR'
    dest=out/f'{name}.hdr'
    image.filepath_raw=str(dest)
    image.save()
    rows.append(dict(source=str(source.relative_to(root)),sourceBytes=source.stat().st_size,sourceSize=original,output=str(dest.relative_to(root)),bytes=dest.stat().st_size,size=list(image.size),encoding='linear RGBE / retained radiance, no display look baked'))
    bpy.data.images.remove(image)
(out/'production.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(rows))
