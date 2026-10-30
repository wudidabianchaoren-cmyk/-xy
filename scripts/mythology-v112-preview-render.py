import bpy,json,time
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-112');scene=bpy.context.scene
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.cycles.samples=24;scene.render.resolution_percentage=100
scene.render.filepath=str(OUT/'cycles-hero-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04-unified-lighting-render-ready.blend'))
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V112_VISIBLE_CYCLES_PREVIEW_INVOKED',scene.render.filepath)
