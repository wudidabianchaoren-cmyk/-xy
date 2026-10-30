import bpy,os,json,math
from mathutils import Vector
P=os.getcwd();O=os.path.join(P,'blender','mythology-v32-103');os.makedirs(O,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=os.path.join(P,'blender','mythology-v32-95','mythology-refined.blend'))
scene=bpy.context.scene
packs={}
def image(asset,kind):
 path=os.path.join(P,'assets','odyssey','pbr-v103',asset,kind+'.jpg')
 im=bpy.data.images.load(path,check_existing=True);im.colorspace_settings.name='sRGB' if kind=='Diffuse' else 'Non-Color';return im
def pbr(asset,tile,name,cloth=False,skin=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;n.clear()
 out=n.new('ShaderNodeOutputMaterial');bs=n.new('ShaderNodeBsdfPrincipled');l.new(bs.outputs['BSDF'],out.inputs['Surface'])
 coord=n.new('ShaderNodeNewGeometry');scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=1/tile;l.new(coord.outputs['Position'],scale.inputs[0])
 tex={}
 for k in ['Diffuse','nor_gl','Rough','AO','Displacement']:
  node=n.new('ShaderNodeTexImage');node.image=image(asset,k);node.projection='BOX';node.projection_blend=.22;l.new(scale.outputs['Vector'],node.inputs['Vector']);tex[k]=node
 l.new(tex['Diffuse'].outputs['Color'],bs.inputs['Base Color']);l.new(tex['Rough'].outputs['Color'],bs.inputs['Roughness'])
 norm=n.new('ShaderNodeNormalMap');norm.inputs['Strength'].default_value=.28 if cloth else .55;l.new(tex['nor_gl'].outputs['Color'],norm.inputs['Color']);
 bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.25;bump.inputs['Distance'].default_value=.003 if cloth else .025;l.new(tex['Displacement'].outputs['Color'],bump.inputs['Height']);l.new(norm.outputs['Normal'],bump.inputs['Normal']);l.new(bump.outputs[0],bs.inputs['Normal'])
 if cloth:
  bs.inputs['Sheen Weight'].default_value=.45;bs.inputs['Sheen Roughness'].default_value=.85
 return m
wood=pbr('weathered_brown_planks',1.8,'V103 actual aged ship timber / all PBR maps')
cloth=pbr('rough_linen',.271,'V103 actual 27cm linen / normal, roughness and fine displacement',True)
stone=pbr('seaside_rock',2,'V103 photographed sea-worn rock')
sand=pbr('coast_sand_03',3,'V103 photographed granular coastal sand')
soil=pbr('forest_ground_04',3.15,'V103 photographed forest ground')
# Native terrain combines the three complete photographic surfaces by actual height and slope.
land=bpy.data.materials.new('V103 native continuous three-habitat photographic PBR');land.use_nodes=True;n=land.node_tree.nodes;l=land.node_tree.links;n.clear()
out=n.new('ShaderNodeOutputMaterial');geo=n.new('ShaderNodeNewGeometry');pos=n.new('ShaderNodeSeparateXYZ');normal=n.new('ShaderNodeSeparateXYZ');l.new(geo.outputs['Position'],pos.inputs[0]);l.new(geo.outputs['Normal'],normal.inputs[0])
def range_node(source,a,b):
 v=n.new('ShaderNodeMapRange');v.clamp=True;v.interpolation_type='SMOOTHSTEP';v.inputs['From Min'].default_value=a;v.inputs['From Max'].default_value=b;l.new(source,v.inputs[0]);return v.outputs[0]
beachheight=range_node(pos.outputs['Z'],6.4,2.0);beachslope=range_node(normal.outputs['Z'],.58,.9);beach=n.new('ShaderNodeMath');beach.operation='MULTIPLY';l.new(beachheight,beach.inputs[0]);l.new(beachslope,beach.inputs[1])
forestheight=range_node(pos.outputs['Z'],4,9);forestslope=range_node(normal.outputs['Z'],.62,.9);forest=n.new('ShaderNodeMath');forest.operation='MULTIPLY';l.new(forestheight,forest.inputs[0]);l.new(forestslope,forest.inputs[1])
shaders=[]
for asset,tile in [('seaside_rock',2),('forest_ground_04',3.15),('coast_sand_03',3)]:
 bs=n.new('ShaderNodeBsdfPrincipled');vec=n.new('ShaderNodeVectorMath');vec.operation='SCALE';vec.inputs[3].default_value=1/tile;l.new(geo.outputs['Position'],vec.inputs[0]);maps={}
 for k in ['Diffuse','Rough','nor_gl','Displacement']:
  t=n.new('ShaderNodeTexImage');t.image=image(asset,k);t.projection='BOX';t.projection_blend=.22;l.new(vec.outputs['Vector'],t.inputs[0]);maps[k]=t
 l.new(maps['Diffuse'].outputs[0],bs.inputs['Base Color']);l.new(maps['Rough'].outputs[0],bs.inputs['Roughness']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.35;bump.inputs['Distance'].default_value=.035 if asset=='seaside_rock' else .014;l.new(maps['Displacement'].outputs[0],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal']);shaders.append(bs.outputs[0])
mix=n.new('ShaderNodeMixShader');l.new(forest.outputs[0],mix.inputs[0]);l.new(shaders[0],mix.inputs[1]);l.new(shaders[1],mix.inputs[2]);mix2=n.new('ShaderNodeMixShader');l.new(beach.outputs[0],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(shaders[2],mix2.inputs[2]);l.new(mix2.outputs[0],out.inputs[0])
skin=bpy.data.materials.new('V103 restored original native skin atlas');skin.use_nodes=True;n=skin.node_tree.nodes;l=skin.node_tree.links;bs=next(x for x in n if x.type=='BSDF_PRINCIPLED');t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(os.path.join(P,'assets','odyssey','pbr-v103','skin-atlas.png'));l.new(t.outputs[0],bs.inputs['Base Color']);bs.inputs['Roughness'].default_value=.63;bs.inputs['Subsurface Weight'].default_value=.07;bs.inputs['Subsurface Radius'].default_value=(.008,.004,.002)
noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=580;noise.inputs['Detail'].default_value=2;bump=n.new('ShaderNodeBump');bump.inputs['Distance'].default_value=.0002;bump.inputs['Strength'].default_value=.16;l.new(noise.outputs[0],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
counts={'timber':0,'sails':0,'terrain':0,'skin':0,'stones':0}
web_uv=json.load(open(os.path.join(P,'.verify','v32-103','mythology','native-anatomy.json'),encoding='utf8'))
matched={a['key']:a for a in web_uv}
for o in scene.objects:
 if o.type!='MESH':continue
 name=str(o.get('source_name',o.name));key=str(o.get('source_key',''));index=int(key.split('_')[-1]) if key.startswith('native84_') else -1
 if key in matched:
  a=matched[key];v=a['vertices'];verts=[(v[i],-v[i+2],v[i+1]) for i in range(0,len(v),3)];inds=a['index'] or list(range(len(verts)));faces=[inds[i:i+3] for i in range(0,len(inds),3)]
  mesh=bpy.data.meshes.new(o.name+' original aligned UV');mesh.from_pydata(verts,[],faces);mesh.update();o.data=mesh;o.matrix_world.identity()
  if a.get('uv'):
   uv=mesh.uv_layers.new(name='Original anatomical and cloth UV');data=a['uv']
   for li,loop in enumerate(mesh.loops):uv.data[li].uv=(data[loop.vertex_index*2],1-data[loop.vertex_index*2+1])
  for polygon in mesh.polygons:polygon.use_smooth=True
 if index in [0,1,2,3,4,5,16,18]:o.hide_render=True;continue
 if index in [6,7,8,12,13,14,15,17]:o.data.materials.clear();o.data.materials.append(skin);counts['skin']+=1;continue
 if 19<=index<=22 or 26<=index<=29:o.data.materials.clear();o.data.materials.append(land);counts['terrain']+=1;continue
 if 'Wind-filled linen sail' in name:o.data.materials.clear();o.data.materials.append(cloth);counts['sails']+=1;continue
 for i,m in enumerate(list(o.data.materials)):
  if not m:continue
  iswood='Batched solid hull and interior joinery' in name and m.use_nodes and any(x.type=='TEX_IMAGE' for x in m.node_tree.nodes)
  if iswood or any(k in name.lower() for k in ['timber','wood','plank','deck','mast']):o.data.materials[i]=wood;counts['timber']+=1
  elif 'boulder' in name.lower() or 'littoral rock' in name.lower():o.data.materials[i]=stone;counts['stones']+=1
scene.view_layers[0].material_override=None;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
scene.world.use_nodes=True;wn=scene.world.node_tree.nodes;wl=scene.world.node_tree.links;wn.clear();env=wn.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(os.path.join(P,'assets','odyssey','venice_sunset_1k.hdr'));background=wn.new('ShaderNodeBackground');background.inputs['Strength'].default_value=.65;wl.new(env.outputs[0],background.inputs[0])
# The retained HDRI illuminates surfaces; its Venice buildings are not part of the mythology world.
sky=wn.new('ShaderNodeBackground');sky.inputs['Color'].default_value=(.055,.085,.105,1);sky.inputs['Strength'].default_value=.65
path=wn.new('ShaderNodeLightPath');mixworld=wn.new('ShaderNodeMixShader');wl.new(path.outputs['Is Camera Ray'],mixworld.inputs[0]);wl.new(background.outputs[0],mixworld.inputs[1]);wl.new(sky.outputs[0],mixworld.inputs[2]);output=wn.new('ShaderNodeOutputWorld');wl.new(mixworld.outputs[0],output.inputs[0])
fill_data=bpy.data.lights.new('V103 broad cool sky bounce','AREA');fill_data.energy=1800;fill_data.shape='DISK';fill_data.size=45;fill_data.color=(.78,.86,1);fill=bpy.data.objects.new('V103 broad cool sky bounce',fill_data);scene.collection.objects.link(fill);fill.location=(10,-35,28);fill.rotation_euler=(Vector((-20,25,8))-fill.location).to_track_quat('-Z','Y').to_euler()
try:
 prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 scene.cycles.device='GPU'
except Exception:scene.cycles.device='CPU'
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.camera.location=(12,-36,7);target=Vector((-14,15,11));scene.camera.rotation_euler=(target-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=35
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-materials.blend'))
json.dump({'actualBlender':bpy.app.version_string,'source':'Frozen V95 native geometry with original web anatomy UV restored','surfaceCounts':counts,'newPhotographicSources':'assets/odyssey/pbr-v103/SOURCE.json','originalAnatomyUvMatched':True,'cameraBackgroundExcludesHdriBuildings':True,'web':'WebGL uses the same real-world scan scales; renderer and lighting are separate, not pixel-identical.','changedSea':False},open(os.path.join(O,'native-audit.json'),'w'),indent=2)
scene.render.filepath=os.path.join(O,'cycles-material-study.png');bpy.ops.render.render(write_still=True)
print('V103 native photographic-material render complete',counts)
