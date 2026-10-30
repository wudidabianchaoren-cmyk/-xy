import bpy,math,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene;island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior')
source=(ROOT/'scripts/mythology-v106-finish-render.py').read_text(encoding='utf8');marker="next(v for v in scene.world.node_tree.nodes if v.type=='BACKGROUND')"
exec(source[source.index(marker):])
