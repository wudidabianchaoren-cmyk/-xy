import bpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');p=R/'blender/mythology-v32-117/cycles-final-1920.png'
assert p.exists()
im=bpy.data.images.load(str(p),check_existing=True)
for w in bpy.context.window_manager.windows:
 areas=[a for a in w.screen.areas if a.type in {'VIEW_3D','IMAGE_EDITOR'}]
 if areas:
  a=max(areas,key=lambda q:q.width*q.height);a.type='IMAGE_EDITOR';a.spaces.active.image=im
print(json.dumps({'shownInVisibleLocalBlender':True,'image':str(p),'savedNative':'08-final-local-world.blend','rerendered':False}))