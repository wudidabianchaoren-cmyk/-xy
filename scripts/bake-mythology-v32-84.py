import bpy,os,json
from io_scene_gltf2.blender.com.material_helpers import create_settings_group
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','mythology-v32-84')
bpy.ops.wm.open_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
scene=bpy.context.scene;scene.cycles.samples=12
terrain=[o for o in scene.objects if o.type=='MESH' and 'complete_large_island' in str(o.get('source_name',''))]
bpy.ops.object.select_all(action='DESELECT')
for o in terrain:
 o.select_set(True)
 if 'NativeAO' in o.data.uv_layers:o.data.uv_layers.remove(o.data.uv_layers['NativeAO'])
 # Restore metre-scaled PBR projection before creating a separate, packed AO unwrap.
 uv=o.data.uv_layers['NativePBRUV']
 for polygon in o.data.polygons:
  for li in polygon.loop_indices:
   v=o.data.vertices[o.data.loops[li].vertex_index].co;n=polygon.normal
   uv.data[li].uv=(v.x/7,v.y/7) if abs(n.z)>.6 else ((v.y/7,v.z/7) if abs(n.x)>abs(n.y) else (v.x/7,v.z/7))
 o.data.uv_layers.new(name='NativeAO');o.data.uv_layers.active_index=len(o.data.uv_layers)-1
bpy.context.view_layer.objects.active=terrain[0];bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.008,area_weight=.2);bpy.ops.object.mode_set(mode='OBJECT')
aoimage=bpy.data.images.new('Native coastal contact occlusion V32.84',width=2048,height=2048);aoimage.colorspace_settings.name='Non-Color'
material=terrain[0].data.materials[0];nodes=material.node_tree.nodes;links=material.node_tree.links;output=nodes.get('Material Output');old=output.inputs['Surface'].links[0].from_socket
uvPBR=nodes.new('ShaderNodeUVMap');uvPBR.uv_map='NativePBRUV'
for n in nodes:
 if n.type=='TEX_IMAGE' and n.label in ['Base Color','Roughness','Normal']:links.new(uvPBR.outputs['UV'],n.inputs['Vector'])
ao=nodes.new('ShaderNodeAmbientOcclusion');ao.inputs['Distance'].default_value=3.5;emission=nodes.new('ShaderNodeEmission');links.new(ao.outputs['Color'],emission.inputs['Color']);links.new(emission.outputs[0],output.inputs['Surface'])
target=nodes.new('ShaderNodeTexImage');target.image=aoimage;nodes.active=target
scene.render.bake.use_clear=True;scene.render.bake.margin=8;bpy.ops.object.bake(type='EMIT')
links.new(old,output.inputs['Surface']);nodes.remove(emission);nodes.remove(ao)
aoimage.filepath_raw=os.path.join(O,'island-native-ao.png');aoimage.file_format='PNG';aoimage.save();aoimage.pack()
uv=nodes.new('ShaderNodeUVMap');uv.uv_map='NativeAO';links.new(uv.outputs['UV'],target.inputs['Vector'])
settings=nodes.new('ShaderNodeGroup');settings.node_tree=create_settings_group('glTF Material Output');links.new(target.outputs['Color'],settings.inputs['Occlusion'])
for o in terrain:o.data.uv_layers['NativePBRUV'].active_render=True
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
 if o.type=='MESH' and o.get('source_key'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_image_format='AUTO')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
stats=json.load(open(os.path.join(O,'native-production-audit.json'),encoding='utf8'));stats['islandAO']={'actualCyclesBake':True,'size':2048,'samples':12,'distance':3.5,'UV':'NativeAO','terrainMeshes':len(terrain)}
json.dump(stats,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
scene.cycles.samples=20;scene.render.filepath=os.path.join(O,'native-material-cycles.png');bpy.ops.render.render(write_still=True)
print('ACTUAL NATIVE COASTAL CONTACT AO COMPLETE')
