import bpy,os,json
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','mythology-v32-84')
bpy.ops.wm.open_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
count=0
for m in bpy.data.materials:
 if not m.use_nodes:continue
 nodes=m.node_tree.nodes;links=m.node_tree.links;p=nodes.get('Principled BSDF')
 if not p or not p.inputs['Base Color'].is_linked:continue
 connection=p.inputs['Base Color'].links[0]
 if connection.from_node.type!='TEX_IMAGE' or connection.from_node.label!='Base Color':continue
 factor=tuple(p.inputs['Base Color'].default_value)
 mix=nodes.new('ShaderNodeMixRGB');mix.label='Original authored surface tint x native PBR';mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=factor
 links.new(connection.from_socket,mix.inputs[1]);links.new(mix.outputs[0],p.inputs['Base Color']);count+=1
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and o.get('source_key'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_image_format='AUTO')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
stats=json.load(open(os.path.join(O,'native-production-audit.json'),encoding='utf8'));stats['explicitAuthoredTextureTintMaterials']=count
json.dump(stats,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
bpy.context.scene.cycles.samples=20;bpy.context.scene.render.filepath=os.path.join(O,'native-material-cycles.png');bpy.ops.render.render(write_still=True)
print('Native authored texture factors explicitly connected:',count)
