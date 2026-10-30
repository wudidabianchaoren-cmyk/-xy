import bpy,json
from pathlib import Path
H=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v20')
bpy.ops.wm.open_mainfile(filepath=str(H/'inhabited-island.blend'))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH' and ('complete large island' in o.name or '/ native island vegetation' in o.name)]
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0]
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=objects[0],selected_objects=objects,selected_editable_objects=objects):bpy.ops.export_scene.gltf(filepath=str(H/'inhabited-island.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False,export_vertex_color='ACTIVE',export_all_vertex_colors=True)
print('Explicit native vertex colors exported on '+str(len(objects))+' island and vegetation material batches.')
