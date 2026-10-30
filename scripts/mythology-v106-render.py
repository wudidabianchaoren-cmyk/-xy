import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
scene.render.filepath=str(OUT/'cycles-coastal-world.png');scene.cycles.samples=32;scene.render.resolution_x=1600;scene.render.resolution_y=900
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04-cycles-render-ready.blend'))
# Invoke the real Blender rendering job in the visible software window.
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V106_VISIBLE_CYCLES_RENDER_INVOKED',scene.render.filepath)
