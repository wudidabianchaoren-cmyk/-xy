import bpy,math,json
from pathlib import Path
H=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')/'blender/reference-architecture-v19'
bpy.ops.wm.open_mainfile(filepath=str(H/'island.blend'))
o=next(o for o in bpy.context.scene.objects if 'continuous low island' in o.name)
for v in o.data.vertices:
 x,y,z=v.co
 if z>1.5 and z<12:v.co.z+=.52*math.sin(x*.58+y*.32)+.24*math.sin(y*.87-x*.23)
o.data.update()
for f in o.data.polygons:
 h=sum(o.data.vertices[i].co.z for i in f.vertices)/len(f.vertices)
 c=f.center;f.material_index=1 if -.4<h<.7 else 2 if h>10 and math.sin(c.x*.62+c.y*.41)>.35 else 0
uv=o.data.uv_layers.active
for f in o.data.polygons:
 axis=max(range(3),key=lambda i:abs(f.normal[i]));a,b=[i for i in range(3) if i!=axis]
 for li in f.loop_indices:
  v=o.data.vertices[o.data.loops[li].vertex_index].co;uv.data[li].uv=(v[a]*.20,v[b]*.20)
bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=o,selected_objects=[o],selected_editable_objects=[o]):
 bpy.ops.export_scene.gltf(filepath=str(H/'island.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
bpy.ops.wm.save_as_mainfile(filepath=str(H/'island-refined.blend'))
a=json.loads((H/'native-production-audit.json').read_text());a['finalIslandBlend']='island-refined.blend';a['islandRoughnessAndMetreUvRefined']=True;(H/'native-production-audit.json').write_text(json.dumps(a,indent=2));bpy.ops.wm.read_factory_settings(use_empty=True)
print('Saved final continuous island: irregular ridges, sparse moss patches and metre-scale photograph UVs.')
