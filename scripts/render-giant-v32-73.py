import bpy,json
from pathlib import Path
H=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v19')
bpy.ops.wm.open_mainfile(filepath=str(H/'polyphemus-upright.blend'))
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True
s.render.resolution_x=1280;s.render.resolution_y=1280;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'polyphemus-cycles-v19.png')
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.3
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('Giant Cycles rendering started.')
