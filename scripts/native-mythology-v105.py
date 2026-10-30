import bpy,json,math,os,re,time
import numpy as np
from pathlib import Path
from mathutils import Matrix,Vector
root=Path.cwd();out=root/'blender/mythology-v32-105';out.mkdir(parents=True,exist_ok=True)
data=json.loads((root/'.verify/v32-105/web-native-input.json').read_text(encoding='utf8'))
instances=json.loads((root/'.verify/v32-105/web-instances.json').read_text(encoding='utf8'))
bpy.ops.wm.open_mainfile(filepath=str(root/'blender/mythology-v32-103/mythology-materials.blend'))
scene=bpy.context.scene
conversion=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
materials={m.name:m for m in bpy.data.materials}
wood=next(m for m in bpy.data.materials if 'V103 actual aged ship timber' in m.name)
cloth=next(m for m in bpy.data.materials if 'V103 actual 27cm linen' in m.name)
stone=bpy.data.materials.new('V105 actual photographed sea-worn rock');stone.use_nodes=True
n=stone.node_tree.nodes;l=stone.node_tree.links;bs=next(x for x in n if x.type=='BSDF_PRINCIPLED');coord=n.new('ShaderNodeNewGeometry');scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=.5;l.new(coord.outputs['Position'],scale.inputs[0])
for kind,socket in [('Diffuse','Base Color'),('Rough','Roughness')]:
 t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(root/'assets/odyssey/pbr-v103/seaside_rock'/(kind+'.jpg')),check_existing=True);t.projection='BOX';t.projection_blend=.22;t.image.colorspace_settings.name='sRGB' if kind=='Diffuse' else 'Non-Color';l.new(scale.outputs[0],t.inputs['Vector']);l.new(t.outputs['Color'],bs.inputs[socket])
t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(root/'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg'),check_existing=True);t.image.colorspace_settings.name='Non-Color';t.projection='BOX';t.projection_blend=.22;l.new(scale.outputs[0],t.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.45;bump.inputs['Distance'].default_value=.06;l.new(t.outputs['Color'],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
skin=next(m for m in bpy.data.materials if 'V103 restored original native skin atlas' in m.name)
# Continuous world-space photograph samples. No old per-cell terrain material groups.
ground=bpy.data.materials.new('V105 continuous photographed granular shore and weathered inland');ground.use_nodes=True
gn=ground.node_tree.nodes;gl=ground.node_tree.links;gbs=next(x for x in gn if x.type=='BSDF_PRINCIPLED');gbs.inputs['Roughness'].default_value=.93
gc=gn.new('ShaderNodeNewGeometry');sep=gn.new('ShaderNodeSeparateXYZ');gl.new(gc.outputs['Position'],sep.inputs[0])
def ground_image(asset,filename,scale_factor,non_color=False):
 scale=gn.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=scale_factor;gl.new(gc.outputs['Position'],scale.inputs[0])
 t=gn.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(root/'assets/odyssey/pbr-v103'/asset/filename),check_existing=True);t.image.colorspace_settings.name='Non-Color' if non_color else 'sRGB';t.projection='BOX';t.projection_blend=.35;gl.new(scale.outputs[0],t.inputs['Vector']);return t
sand=ground_image('coast_sand_03','Diffuse.jpg',2.4);rock=ground_image('seaside_rock','Diffuse.jpg',.5);soil=ground_image('forest_ground_04','Diffuse.jpg',.32)
grain=gn.new('ShaderNodeMixRGB');grain.blend_type='MULTIPLY';grain.inputs[0].default_value=.08;grain.inputs[1].default_value=(.31,.275,.205,1);gl.new(sand.outputs['Color'],grain.inputs[2])
height=gn.new('ShaderNodeMapRange');height.interpolation_type='SMOOTHERSTEP';height.inputs['From Min'].default_value=4;height.inputs['From Max'].default_value=10;gl.new(sep.outputs['Z'],height.inputs['Value'])
inland=gn.new('ShaderNodeMixRGB');inland.inputs[0].default_value=.5;gl.new(rock.outputs['Color'],inland.inputs[1]);gl.new(soil.outputs['Color'],inland.inputs[2])
mix=gn.new('ShaderNodeMixRGB');gl.new(height.outputs['Result'],mix.inputs[0]);gl.new(grain.outputs[0],mix.inputs[1]);gl.new(inland.outputs[0],mix.inputs[2]);gl.new(mix.outputs[0],gbs.inputs['Base Color'])
relief=ground_image('coast_sand_03','Displacement.jpg',2.4,True);gb=gn.new('ShaderNodeBump');gb.inputs['Strength'].default_value=.12;gb.inputs['Distance'].default_value=.002;gl.new(relief.outputs['Color'],gb.inputs['Height']);gl.new(gb.outputs[0],gbs.inputs['Normal'])
old={str(o.get('source_key','')):o for o in scene.objects if o.get('source_key')}
def geometry(item):
 v=item['vertices'];vertices=[(v[i],-v[i+2],v[i+1]) for i in range(0,len(v),3)]
 index=item['index'] or list(range(len(vertices)));faces=[index[i:i+3] for i in range(0,len(index),3)]
 mesh=bpy.data.meshes.new(item['key']+' current web geometry');mesh.from_pydata(vertices,[],faces);mesh.update()
 if item.get('uv'):
  uv=mesh.uv_layers.new(name='Current rectangular sail / original photographic UV');source=item['uv']
  for i,loop in enumerate(mesh.loops):uv.data[i].uv=(source[loop.vertex_index*2],1-source[loop.vertex_index*2+1])
 for face in mesh.polygons:face.use_smooth=True
 return mesh
def plain(item):
 name='V105 native '+item['name'];m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True
 bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=tuple(item['color'])+(1,);bs.inputs['Roughness'].default_value=item.get('roughness') or .85;bs.inputs['Metallic'].default_value=item.get('metalness') or 0
 return m
counts={'regularMeshes':0,'newFittedMeshes':0,'sails':0,'instancedMeshes':0,'forestTrees':0,'removedOldForestProxies':0}
for item in data['meshes']:
 obj=old.get(item['key']);existing_materials=list(obj.data.materials) if obj else [];current_mesh=geometry(item)
 if not obj:
  obj=bpy.data.objects.new(item['key']+' '+item['name'],current_mesh);scene.collection.objects.link(obj);counts['newFittedMeshes']+=1
 obj.data=current_mesh;obj.matrix_world.identity();obj.hide_render=not item['visible'];obj.hide_viewport=not item['visible'];obj['source_key']=item['key'];obj['source_name']=item['name']
 if item['key'].startswith('native104_'):
  material=wood if 'joinery' in item['name'] else plain(item)
  obj.data.materials.append(material)
 else:
  for mat in existing_materials:obj.data.materials.append(mat)
  if not existing_materials:obj.data.materials.append(plain(item))
  for face in obj.data.polygons:
   for group in item.get('groups',[]):
    if group['start']<=face.index*3<group['start']+group['count']:face.material_index=min(group['materialIndex'],len(obj.data.materials)-1)
 if 'Wind-filled linen sail' in item['name']:
  obj.data.materials.clear();obj.data.materials.append(cloth);obj['full_belly_and_corner_tension']=True;counts['sails']+=1
 counts['regularMeshes']+=1
 if item['key']=='native84_19':obj.data.materials.clear();obj.data.materials.append(ground)
# Remove the previous crown/trunk proxies; the actual new woodland below is linked geometry.
for obj in list(scene.objects):
 if obj.type=='MESH' and not obj.get('source_key') and re.search('forest|crown|trunk|umbrella|cypress|pine',obj.name,re.I):
  bpy.data.objects.remove(obj,do_unlink=True);counts['removedOldForestProxies']+=1
tree_dir=root/'assets/odyssey/vegetation-v104/island_tree_01/textures'
def tree_material(item,alpha):
 name=item['name'];kind='leaves' if 'leaves' in name else 'branches' if 'branches' in name else 'bark';asset='island_tree_01_'+kind if kind!='bark' else 'island_tree_01'
 m=bpy.data.materials.new('V105 actual scanned coastal '+kind);m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;bs=next(x for x in n if x.type=='BSDF_PRINCIPLED')
 t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(tree_dir/(asset+'_diff_1k.jpg')),check_existing=True);l.new(t.outputs['Color'],bs.inputs['Base Color']);bs.inputs['Roughness'].default_value=.9
 if alpha:
  a=n.new('ShaderNodeTexImage');a.image=bpy.data.images.load(str(tree_dir/'island_tree_01_leaves_alpha_1k.png'),check_existing=True);a.image.colorspace_settings.name='Non-Color';l.new(a.outputs['Color'],bs.inputs['Alpha']);m.surface_render_method='DITHERED';m.use_backface_culling=False
  translucent=n.new('ShaderNodeBsdfTranslucent');l.new(t.outputs['Color'],translucent.inputs['Color']);mix=n.new('ShaderNodeMixShader');mix.inputs[0].default_value=.18;l.new(bs.outputs[0],mix.inputs[1]);l.new(translucent.outputs[0],mix.inputs[2]);transparent=n.new('ShaderNodeBsdfTransparent');cutout=n.new('ShaderNodeMixShader');l.new(a.outputs['Color'],cutout.inputs[0]);l.new(transparent.outputs[0],cutout.inputs[1]);l.new(mix.outputs[0],cutout.inputs[2]);output=next(x for x in n if x.type=='OUTPUT_MATERIAL');l.new(cutout.outputs[0],output.inputs['Surface'])
 return m
collection=bpy.data.collections.new('V105 grounded actual foliage and shoreline');scene.collection.children.link(collection)
for pack in instances:
 item=pack['geometry'];mesh=geometry(item)
 if 'scanned coastal forest' in item['name']:mat=tree_material(item,bool(pack['alphaMap']))
 elif pack.get('inVessel'):mat=wood if 'wood' in pack.get('materialName','').lower() or 'timber' in pack.get('materialName','').lower() else plain(item)
 elif 'bronze' in item['name']:mat=plain(item)
 else:mat=stone
 mesh.materials.append(mat)
 for i,values in enumerate(pack['matrices']):
  obj=bpy.data.objects.new(item['name']+' '+str(i),mesh);collection.objects.link(obj);original=Matrix(np.array(values).reshape(4,4).T.tolist());obj.matrix_world=conversion@original@conversion.inverted();counts['instancedMeshes']+=1
 if 'scanned coastal forest' in item['name'] and 'branches' not in item['name'] and 'leaves' not in item['name']:counts['forestTrees']=len(pack['matrices'])
camera=scene.camera;camera.location=conversion@Vector(data['camera']['position']);target=conversion@Vector(data['camera']['target']);camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='PERSP';camera.data.sensor_fit='VERTICAL';camera.data.sensor_height=20.25;camera.data.lens=20.25/(2*math.tan(math.radians(data['camera']['fov'])/2))
scene.view_settings.view_transform='AgX';scene.view_settings.look='None';scene.view_settings.exposure=-.3
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for device in prefs.devices:device.use=device.type=='CUDA'
scene.cycles.device='GPU';scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.view_layers[0].material_override=None
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(out/'mythology-current-v105.blend'))
audit={'actualBlender':bpy.app.version_string,'base':'Frozen V103 native scene','source':'Current V105 web geometry and placement at eight-second original camera','counts':counts,'photographicSource':'Poly Haven CC0, retained original anatomy skin atlas','camera':data['camera'],'webAndCyclesAreSeparateRenderers':True,'nativeSceneIsCurrentSnapshotNot64SecondAnimation':True,'passed':counts['sails']==7 and counts['forestTrees']==1319}
(out/'native-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
scene.render.filepath=str(out/'cycles-material-v105.png');bpy.ops.render.render(write_still=True)
clay=bpy.data.materials.new('V105 clay inspection');clay.use_nodes=True;bs=next(x for x in clay.node_tree.nodes if x.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=(.6,.6,.6,1);bs.inputs['Roughness'].default_value=.8
scene.view_layers[0].material_override=clay;scene.cycles.samples=16;scene.render.filepath=str(out/'cycles-clay-v105.png');bpy.ops.render.render(write_still=True)
print('V105 actual native snapshot and separate Cycles material/clay proofs',json.dumps(audit),flush=True)
