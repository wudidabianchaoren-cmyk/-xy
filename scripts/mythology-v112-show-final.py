import bpy,json
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-112')
if bpy.app.is_job_running('RENDER'):raise RuntimeError('Wait for render before final viewer')
image=bpy.data.images.load(str(OUT/'cycles-hero-final.png'),check_existing=True);image.reload()
shown=0
for w in bpy.context.window_manager.windows:
 for area in w.screen.areas:
  if area.type=='VIEW_3D':area.spaces.active.shading.type='SOLID'
  if area.type=='IMAGE_EDITOR':area.spaces.active.image=image;shown+=1
if not shown:
 win=bpy.context.window_manager.windows[0];area=max((a for a in win.screen.areas if a.type=='VIEW_3D'),key=lambda a:a.width*a.height);area.type='IMAGE_EDITOR';area.spaces.active.image=image
 with bpy.context.temp_override(window=win,area=area,region=next(r for r in area.regions if r.type=='WINDOW')):bpy.ops.image.view_all(fit_view=True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'07-saved-native-and-visible-result.blend'))
(OUT/'visible-final.json').write_text(json.dumps({'actualVisibleMcp':True,'nativeFile':bpy.data.filepath,'shownImage':str(OUT/'cycles-hero-final.png'),'renderReplayed':False,'fullWorldDataRetained':True},indent=2),encoding='utf8');print('V112_NATIVE_FINAL_SHOWN_AND_SAVED',bpy.data.filepath)
