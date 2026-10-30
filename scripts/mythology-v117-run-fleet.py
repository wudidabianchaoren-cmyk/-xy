import bpy,runpy
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117'
mod=runpy.run_path(str(ROOT/'scripts/mythology-v117-fleet-finish.py'))
mod['finish_fleet'](ROOT,OUT)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'03-refined-ships-flax-crew-and-cyclops.blend'))
print('V117_FLEET_NATIVE_CHECKPOINT_SAVED')
