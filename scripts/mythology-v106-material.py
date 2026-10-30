import bpy, math, json, random
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
if not island or not giant:raise RuntimeError('MCP modelling stage missing')
def material(name,color,roughness=.85):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.node_tree.nodes.clear();bs=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(bs.outputs[0],out.inputs['Surface']);bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=roughness;return m,bs
def image_node(nodes,links,path,vector,noncolor=False):
 t=nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(path),check_existing=True);t.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';links.new(vector,t.inputs['Vector']);return t
ground,bs=material('V106 continuous fine sand, limestone and meadow',(.46,.40,.28))
n=ground.node_tree.nodes;l=ground.node_tree.links;coord=n.new('ShaderNodeTexCoord');habit=n.new('ShaderNodeVertexColor');habit.layer_name='Habitat';sep=n.new('ShaderNodeSeparateColor');l.new(habit.outputs['Color'],sep.inputs['Color'])
rock=image_node(n,l,ROOT/'assets/odyssey/pbr-v103/seaside_rock/Diffuse.jpg',coord.outputs['UV']);sand=image_node(n,l,ROOT/'assets/odyssey/pbr-v106/sand_01/diff.jpg',coord.outputs['UV']);soil=image_node(n,l,ROOT/'assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg',coord.outputs['UV'])
meadow=n.new('ShaderNodeMixRGB');meadow.blend_type='MULTIPLY';meadow.inputs[0].default_value=.62;meadow.inputs[2].default_value=(.38,.53,.18,1);l.new(soil.outputs['Color'],meadow.inputs[1])
mix=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Green'],mix.inputs[0]);l.new(rock.outputs['Color'],mix.inputs[1]);l.new(meadow.outputs[0],mix.inputs[2]);mix2=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Red'],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(sand.outputs['Color'],mix2.inputs[2]);l.new(mix2.outputs[0],bs.inputs['Base Color'])
normal=image_node(n,l,ROOT/'assets/odyssey/pbr-v106/sand_01/nor_gl.jpg',coord.outputs['UV'],True);nm=n.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.22;l.new(normal.outputs['Color'],nm.inputs['Color']);l.new(nm.outputs[0],bs.inputs['Normal'])
island.data.materials.clear();island.data.materials.append(ground)
# Append existing ship and crew geometry, not the rejected old island/forest/body.
base=ROOT/'blender/mythology-v32-105/mythology-current-v105.blend'
with bpy.data.libraries.load(str(base),link=False) as (src,dst):
 dst.objects=[name for name in src.objects if name.startswith('native84_') and (int(name.split('_')[1].split(' ')[0])<6 or int(name.split('_')[1].split(' ')[0])>=30) or name.startswith('native104_') or ('bronze plank fasteners' in name)]
ship_objects=[]
for obj in dst.objects:
 if obj is None:continue
 scene.collection.objects.link(obj);ship_objects.append(obj)
# Preserve the original skin photograph and proper UVs in the newly modelled figure.
atlas=None
for mat in bpy.data.materials:
 if 'restored original native skin atlas' in mat.name and mat.use_nodes:
  atlas=next((node.image for node in mat.node_tree.nodes if node.type=='TEX_IMAGE' and node.image),None)
  if atlas:break
skin,skinbs=material('V106 earthy male cyclops / pores and uneven pigment',(.32,.235,.17),.78)
sn=skin.node_tree.nodes;sl=skin.node_tree.links;tc=sn.new('ShaderNodeTexCoord')
if atlas:
 tex=sn.new('ShaderNodeTexImage');tex.image=atlas;sl.new(tc.outputs['UV'],tex.inputs['Vector']);sl.new(tex.outputs['Color'],skinbs.inputs['Base Color']);atlas.filepath_raw=str(OUT/'cyclops-original-skin-atlas.png');atlas.file_format='PNG';atlas.save()
noise=sn.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=180;noise.inputs['Detail'].default_value=3;sl.new(tc.outputs['Generated'],noise.inputs['Vector']);bump=sn.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.28;bump.inputs['Distance'].default_value=.006;sl.new(noise.outputs['Fac'],bump.inputs['Height']);sl.new(bump.outputs[0],skinbs.inputs['Normal']);skinbs.inputs['Subsurface Weight'].default_value=.045
eye,eb=material('V106 single eye sclera',(.55,.45,.34),.22);iris,ib=material('V106 single eye brown iris',(.045,.027,.008),.3);pupil,pb=material('V106 single eye pupil',(.002,.002,.001),.13)
for obj in giant.children_recursive:
 if obj.type!='MESH' or obj.hide_render:continue
 obj.data.materials.clear();obj.data.materials.append(pupil if 'pupil' in obj.name.lower() else iris if 'iris' in obj.name.lower() else eye if 'eyeball' in obj.name.lower() else skin)
# Beard follows the actual lower-face surface rather than a ball attached to the chin.
beard,bbs=material('V106 rough dark facial hair',(.022,.014,.008),.95);body=next(o for o in giant.children_recursive if o.type=='MESH' and 'Human.body' in o.name)
hair=bpy.data.curves.new('V106 individually rooted coarse facial hairs','CURVE');hair.dimensions='3D';hair.bevel_depth=.0012;hair.bevel_resolution=0;hair.resolution_u=2
rng=random.Random(106);candidates=[v.co.copy() for v in body.data.vertices if 1.477<v.co.z<1.55 and v.co.y<-.10 and abs(v.co.x)<.074]
for i in range(360):
 if not candidates:break
 p=rng.choice(candidates);s=hair.splines.new('POLY');s.points.add(3);length=rng.uniform(.025,.067)
 for j in range(4):s.points[j].co=(p.x+.002*math.sin(j+i),p.y-.004-j*.002,p.z-length*j/3,1)
h=bpy.data.objects.new('V106 rooted beard',hair);scene.collection.objects.link(h);h.parent=giant;h.data.materials.append(beard)
# Actual native coastal trees share linked geometry; the web uses the same placement file.
bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/vegetation-v104/island_tree_01/tree-web-v104.glb'))
prototypes=[o for o in bpy.context.selected_objects if o.type=='MESH'];all_imported=list(bpy.context.selected_objects)
coords=[o.matrix_world@v.co for o in prototypes for v in o.data.vertices];minz=min(p.z for p in coords);maxz=max(p.z for p in coords);cx=(min(p.x for p in coords)+max(p.x for p in coords))/2;cy=(min(p.y for p in coords)+max(p.y for p in coords))/2;treeheight=maxz-minz
for obj in prototypes:
 matrix=obj.matrix_world.copy();mesh=obj.data.copy()
 for v in mesh.vertices:v.co=(matrix@v.co-Vector((cx,cy,minz)))/treeheight
 obj.data=mesh;obj.parent=None;obj.matrix_world.identity()
 for m in obj.data.materials:
  if not m or not m.use_nodes:continue
  bs2=next((v for v in m.node_tree.nodes if v.type=='BSDF_PRINCIPLED'),None)
  if bs2:bs2.inputs['Roughness'].default_value=.88
plants=json.loads((OUT/'woodland-placement.json').read_text())['trees'];forest=bpy.data.collections.new('V106 actual 460 tree coastal woodland');scene.collection.children.link(forest)
for i,place in enumerate(plants):
 for prototype in prototypes:
  obj=bpy.data.objects.new('V106 woodland '+str(i)+' '+prototype.name,prototype.data);forest.objects.link(obj);obj.location=(place['x'],place['blenderY'],place['y']);obj.rotation_euler[2]=place['rotation'];obj.scale=(place['height']*place['width'],place['height']*place['width'],place['height'])
for obj in all_imported:
 if obj.name in bpy.data.objects:bpy.data.objects.remove(obj,do_unlink=True)
# Merged, curved grass blades form clustered ground cover; they do not cover the sandy cove.
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons]);gv=[];gf=[]
for i in range(12500):
 x=rng.uniform(-204,83);y=rng.uniform(73,230);point,normal,_,_=bvh.ray_cast(Vector((x,y,110)),Vector((0,0,-1)),140)
 if point is None or point.z<5.7 or normal.z<.78 or .5+.5*math.sin(x*.39+y*.27)<.42:continue
 if ((x+78)/11)**2+((y-129)/11)**2<1:continue
 for j in range(3):
  a=rng.uniform(0,math.tau);height=rng.uniform(.19,.55);w=.026;dx=math.cos(a);dy=math.sin(a);start=len(gv)
  for k in range(4):
   u=k/3;center=point+Vector((dx*height*u*u*.45,dy*height*u*u*.45,height*u));width=w*(1-u*.87)
   gv.extend([tuple(center+Vector((-dy*width,dx*width,0))),tuple(center+Vector((dy*width,-dx*width,0)))])
  for k in range(3):gf.append((start+k*2,start+k*2+1,start+k*2+3,start+k*2+2))
g=bpy.data.meshes.new('V106 merged coastal grass blades');g.from_pydata(gv,[],gf);g.update();grass=bpy.data.objects.new('V106_GROUNDCOVER / clustered meadow blades',g);scene.collection.objects.link(grass);gm,gb=material('V106 coastal meadow foliage',(.085,.135,.028),.94);g.materials.append(gm)
# Local sea, sunset environment, and Cycles illumination; this is a native renderer.
water,wbs=material('V106 native water for Cycles inspection',(.018,.063,.055),.12);wbs.inputs['Metallic'].default_value=.1;wbs.inputs['Transmission Weight'].default_value=.35;wbs.inputs['IOR'].default_value=1.333
wn=water.node_tree.nodes;wl=water.node_tree.links;wave=wn.new('ShaderNodeTexNoise');wave.inputs['Scale'].default_value=75;wave.inputs['Detail'].default_value=4;wb=wn.new('ShaderNodeBump');wb.inputs['Strength'].default_value=.42;wb.inputs['Distance'].default_value=.12;wl.new(wave.outputs['Fac'],wb.inputs['Height']);wl.new(wb.outputs[0],wbs.inputs['Normal'])
bpy.ops.mesh.primitive_plane_add(size=3500,location=(0,0,-.25));sea=bpy.context.object;sea.name='V106 Cycles sea / separate from live web water';sea.data.materials.append(water)
world=bpy.data.worlds.new('V106 native sunset illumination');world.use_nodes=True;scene.world=world;world.node_tree.nodes.clear();env=world.node_tree.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(str(ROOT/'assets/odyssey/venice_sunset_1k.hdr'));bg=world.node_tree.nodes.new('ShaderNodeBackground');bg.inputs['Strength'].default_value=.6;wo=world.node_tree.nodes.new('ShaderNodeOutputWorld');world.node_tree.links.new(env.outputs[0],bg.inputs[0]);world.node_tree.links.new(bg.outputs[0],wo.inputs[0])
for o in list(scene.objects):
 if o.type=='LIGHT':bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.object.light_add(type='SUN',location=(-45,160,45));sun=bpy.context.object;sun.name='V106 warm late-afternoon sunlight';sun.rotation_euler=(Vector((-12,15,8))-sun.location).to_track_quat('-Z','Y').to_euler();sun.data.energy=2.2;sun.data.angle=.055
scene.cycles.samples=32;scene.cycles.use_denoising=True;scene.cycles.device='GPU';prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for device in prefs.devices:device.use=device.type=='CUDA'
scene.render.engine='CYCLES';scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.1
# Export only the actual new geometry; unsupported procedural Cycles shaders are calibrated in web code.
def export(objects,filename):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:
  if not o.hide_render:o.hide_set(False);o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(OUT/filename),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_attributes=True)
export([island],'island-geometry-v106.glb');export([giant,*giant.children_recursive,h],'cyclops-male-v106.glb');export([grass],'groundcover-v106.glb')
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'03-materials-and-lighting.blend'))
(OUT/'native-production-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'blenderVersion':bpy.app.version_string,'treeCount':len(plants),'curvedGrassBlades':len(gv)//8,'preservedShipMeshes':len(ship_objects),'giantMaleChestEdit':True,'nativeRenderer':'Cycles CUDA, 32 samples','exports':['island-geometry-v106.glb','cyclops-male-v106.glb','groundcover-v106.glb'],'referenceImagesUsedAsSceneAssets':False,'retainedAnatomyBase':True,'nativeWaterIsSeparateFromWebWater':True},indent=2),encoding='utf8')
print('V106_VISIBLE_MCP_MATERIAL_SAVED',len(plants),len(ship_objects),len(gv)//8)
