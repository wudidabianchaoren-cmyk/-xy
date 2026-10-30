import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');lib=ROOT/'assets/odyssey/characters-v117/source/unpacked/human-base-meshes-bundle-v1.4.1/human_base_meshes_bundle.blend'
with bpy.data.libraries.load(str(lib),link=False) as (data,loaded):
 names={'objects':[s for s in data.objects if any(k in s.lower() for k in ['male','realistic','body'])],'collections':list(data.collections),'meshes':[s for s in data.meshes if 'male' in s.lower()]}
(ROOT/'.verify/v32-117/human-library.json').write_text(json.dumps(names,indent=2),encoding='utf8');print(json.dumps(names))
