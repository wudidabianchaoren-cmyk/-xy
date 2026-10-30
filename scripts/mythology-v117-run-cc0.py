import bpy,runpy
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117'
runpy.run_path(str(ROOT/'scripts/mythology-v117-replace-giant.py'))['replace_giant'](ROOT,OUT)
giant=bpy.data.objects['V106_CYCLOPS / retained anatomical base, new male sculpt'];bpy.ops.object.select_all(action='DESELECT')
for o in [giant,*giant.children_recursive]:
 if o and not o.hide_render:o.hide_set(False);o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'cyclops-v117.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_extras=True,export_cameras=False,export_lights=False)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'07-complete-cc0-character-world.blend'))
print('CC0_MALE_FINAL_SAVED')