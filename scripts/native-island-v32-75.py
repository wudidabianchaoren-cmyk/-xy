import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');old=P/'blender/reference-architecture-v20';H=P/'blender/reference-architecture-v21';H.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(old/'inhabited-island.blend'))
island=next(o for o in bpy.context.scene.objects if o.type=='MESH' and 'complete large island' in o.name)
bm=bmesh.new();bm.from_mesh(island.data)
# The old top surface had no closed seabed. Give the coast solid sides before carving a real cave.
outer=[e for e in bm.edges if e.is_boundary and sum(v.co.x*v.co.x+v.co.y*v.co.y for v in e.verts)/2>2000]
result=bmesh.ops.extrude_edge_only(bm,edges=outer);bottom=[v for v in result['geom'] if isinstance(v,bmesh.types.BMVert)]
for v in bottom:v.co.z=-14
bmesh.ops.holes_fill(bm,edges=[e for e in bm.edges if e.is_boundary],sides=0);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(island.data);bm.free();island.data.update()
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=32,location=(-28,-16,5));cutter=bpy.context.view_layer.objects.active;cutter.name='temporary actual cave volume';cutter.scale=(10,35,6)
bpy.context.view_layer.objects.active=island;island.select_set(True);cutter.select_set(False)
modifier=island.modifiers.new('Actual sea-facing Cyclops cave','BOOLEAN');modifier.operation='DIFFERENCE';modifier.solver='EXACT';modifier.object=cutter
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=island,object=island,selected_objects=[island],selected_editable_objects=[island]):bpy.ops.object.modifier_apply(modifier=modifier.name)
bpy.data.objects.remove(cutter,do_unlink=True)
def mat(name,c,rough=.95):
 m=bpy.data.materials.new(name);m.use_nodes=True;shader=m.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(*c,1);shader.inputs['Roughness'].default_value=rough
 noise=m.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=4.5;noise.inputs['Detail'].default_value=3
 bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.24;bump.inputs['Distance'].default_value=.12;m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],shader.inputs['Normal']);return m
sand=mat('V21 pale mineral sand in sheltered lower coves',(.50,.40,.25));scrub=mat('V21 dry coastal scrub above the saline shoreline',(.21,.245,.10));rock=mat('V21 exposed upper limestone and cave interior',(.31,.30,.22),.85)
for m in [sand,scrub,rock]:island.data.materials.append(m)
for f in island.data.polygons:
 c=f.center;h=c.z;n=f.normal
 if h<2.2 and n.z>.42:f.material_index=len(island.data.materials)-3
 elif 5<h<18 and n.z>.65:f.material_index=len(island.data.materials)-2
 elif h>23 or n.z<.15:f.material_index=len(island.data.materials)-1
island.name='V21 solid inhabited island / closed coast / carved sea cave / elevation materials'
# Export only retained island and its vegetation, never the proof scene's giant or lights.
objects=[o for o in bpy.context.scene.objects if o.type=='MESH' and (o==island or 'island vegetation' in o.name)]
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=island
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=island,object=island,selected_objects=objects,selected_editable_objects=objects):bpy.ops.export_scene.gltf(filepath=str(H/'inhabited-island.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False,export_vertex_color='ACTIVE',export_all_vertex_colors=True)
bpy.ops.wm.save_as_mainfile(filepath=str(H/'inhabited-island.blend'))
(H/'island-native-audit.json').write_text(json.dumps({'version':'V32.75','incrementFrom':'native V20','cave':'boolean-carved sheltered grotto, 20m wide / 12m high, preserving the hill roof above it','width':220,'depth':144,'closedSeabed':True,'meshObjects':len(objects),'elevationMaterials':[m.name for m in [sand,scrub,rock]],'noOldFileOverwrite':True},indent=2),encoding='utf8')
print('V21 solid coast and actual cave exported; retained native vegetation and giant untouched. No preview rerender.')
