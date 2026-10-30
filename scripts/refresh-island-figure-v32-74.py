import bpy,json
from pathlib import Path
from mathutils import Vector
H=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v20')
bpy.ops.wm.open_mainfile(filepath=str(H/'inhabited-island.blend'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and not ('complete large island' in o.name or 'native island vegetation' in o.name):bpy.data.objects.remove(o,do_unlink=True)
meta=json.loads((H/'input-anatomy.json').read_text(encoding='utf8'));meta['supportHeight']=json.loads((H/'island-native-audit.json').read_text(encoding='utf8'))['supportHeight'];(H/'input-anatomy.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
with bpy.data.libraries.load(str(H/'polyphemus-v20.blend'),link=False) as (source,target):target.objects=source.objects
for o in target.objects:
 if o and o.type=='MESH':bpy.context.collection.objects.link(o);o.location+=Vector((-5,-11,meta['supportHeight']));o.scale*=19.5;o.rotation_euler.z=.32
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
bpy.ops.wm.save_as_mainfile(filepath=str(H/'inhabited-island.blend'))
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('Final corrected neckline and organic folds integrated into existing V20 island; new Cycles proof running.')
