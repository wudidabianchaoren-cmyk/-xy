import bpy,json,ast,math
from pathlib import Path
from mathutils import Vector
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');H=P/'blender/reference-architecture-v19';A=P/'assets'
tree=ast.parse((P/'blender/reference-architecture-v17/build-increment.py').read_text(encoding='utf8').replace('bpy.context.object','bpy.context.view_layer.objects.active'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-functions','exec'),globals())
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.import_scene.gltf(filepath=str(H/'cyclops-input.glb'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and any(s in o.name.lower() for s in ['waist','apron','binding','clasp','stitch','hair']):bpy.data.objects.remove(o,do_unlink=True)
skin=material('V19 weathered shepherd skin',(.27,.21,.16),.86)
for o in bpy.context.scene.objects:
 if o.type=='MESH' and 'Uncut' in o.name:
  o.data.materials.clear();o.data.materials.append(skin)
  for f in o.data.polygons:f.use_smooth=True
with bpy.data.libraries.load(str(H/'polyphemus-upright.blend'),link=False) as (source,target):
 target.objects=[n for n in source.objects if 'Tailored reclining' in n or 'Compact natural scalp' in n]
for o in target.objects:
 if o:bpy.context.collection.objects.link(o)
character=[o for o in bpy.context.scene.objects if o.type=='MESH'];bpy.ops.object.select_all(action='DESELECT')
for o in character:o.select_set(True)
bpy.context.view_layer.objects.active=character[0]
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=character[0],selected_objects=character,selected_editable_objects=character):
 bpy.ops.export_scene.gltf(filepath=str(H/'polyphemus-grounded.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
meta=json.loads((H/'input-anatomy.json').read_text(encoding='utf8'));meta.update({'pose':'grounded upright / both feet down / lowered arms','heldObject':'none','nativeVersion':'V19'});(H/'input-anatomy.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
area((-2,3,3),(0,1,0),260,2,(1,.73,.46));area((2,2,-2),(0,1,0),90,2,(.39,.54,.60));camera((2.2,1.7,4.2),(0,1,0),55)
bpy.context.scene.world=bpy.data.worlds.new('dark sculptural studio');bpy.context.scene.world.use_nodes=True;bpy.context.scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.04
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True
s.render.resolution_x=1280;s.render.resolution_y=1280;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'polyphemus-grounded-cycles-v19.png')
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.3
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
bpy.ops.wm.save_as_mainfile(filepath=str(H/'polyphemus-grounded.blend'))
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('Grounded shepherd replaces suspended pose; lowered arms, two feet and no ball.')
