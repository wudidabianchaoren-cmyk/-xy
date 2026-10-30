import bpy,runpy
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118'
runpy.run_path(str(ROOT/'scripts/mythology-v118-hero-faces.py'))['polish_hero_faces'](ROOT,OUT)
runpy.run_path(str(ROOT/'scripts/mythology-v118-export.py'))['export_figures'](ROOT,OUT)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04b-principal-faces-and-clothing.blend'))
print('V118_ACTUAL_HERO_FACES_AND_FLEET_EXPORTED')