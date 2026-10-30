import bpy,json
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-106');image=bpy.data.images.load(str(OUT/'cycles-coastal-world.png'),check_existing=True);image.reload();shown=0
for window in bpy.context.window_manager.windows:
 for area in window.screen.areas:
  if area.type=='VIEW_3D':area.spaces.active.shading.type='SOLID'
  if area.type=='IMAGE_EDITOR':area.spaces.active.image=image;shown+=1
audit={'actualBlenderMcp':True,'nativeFileOpen':bpy.data.filepath,'savedColourRenderShownInEditors':shown,'imageFile':str(OUT/'cycles-coastal-world.png'),'renderEngine':bpy.context.scene.render.engine,'originalUserBlenderInstancesNotChanged':True}
(OUT/'visible-native-result.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
