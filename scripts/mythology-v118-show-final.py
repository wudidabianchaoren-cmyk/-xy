import bpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');p=R/'blender/mythology-v32-118/cycles-final-1920.png'
im=bpy.data.images.load(str(p),check_existing=True);im.reload()
window=bpy.context.window_manager.windows[0];area=max(window.screen.areas,key=lambda a:a.width*a.height);area.type='IMAGE_EDITOR';area.spaces.active.image=im
with bpy.context.temp_override(window=window,area=area,region=next(r for r in area.regions if r.type=='WINDOW')):
 bpy.ops.image.view_all(fit_view=True)
print(json.dumps({'visibleLocalBlenderImage':str(p),'savedNative':bpy.data.filepath,'regeneratedForViewing':False}))
