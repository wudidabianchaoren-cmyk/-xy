import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112'
V112_RUN_FLEET=True
exec((ROOT/'scripts/mythology-v112-fleet.py').read_text(encoding='utf8'))
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'03-four-vessels-and-anatomical-crew.blend'))
print('V112_FLEET_NATIVE_STAGE_SAVED')
