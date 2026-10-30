import bpy,math,ast,json,hashlib
from pathlib import Path
from mathutils import Vector,noise
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');H=P/'blender/reference-architecture-v20';H.mkdir(parents=True,exist_ok=True);A=P/'assets'
tree=ast.parse((P/'blender/reference-architecture-v17/build-increment.py').read_text(encoding='utf8').replace('bpy.context.object','bpy.context.view_layer.objects.active'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-functions','exec'),globals())
def cube(name,pos,size,mat,bevel=.025):
 x,y,z=pos;a,b,c=[v/2 for v in size];vs=[(x+i*a,y+j*b,z+k*c) for i,j,k in [(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]]
 o=mesh(name,vs,[(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)],mat)
 if bevel:
  m=o.modifiers.new('Small dressed stone edge','BEVEL');m.width=bevel;m.segments=3;o.data=bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()));o.modifiers.clear()
 return o
def export(objects,file):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]
 with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=objects[0],selected_objects=objects,selected_editable_objects=objects):bpy.ops.export_scene.gltf(filepath=str(H/file),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
def combine(objects):
 groups={}
 for o in objects:groups.setdefault(o.data.materials[0],[]).append(o)
 result=[]
 for mat,group in groups.items():
  vs=[];fs=[];uvs=[]
  for o in group:
   offset=len(vs);vs.extend(tuple(o.matrix_world@v.co) for v in o.data.vertices);fs.extend(tuple(offset+i for i in f.vertices) for f in o.data.polygons)
   if o.data.uv_layers:uvs.extend(tuple(v.uv) for v in o.data.uv_layers.active.data)
   else:uvs.extend((0,0) for _ in o.data.loops)
  d=bpy.data.meshes.new(mat.name+' combined');d.from_pydata(vs,[],fs);d.update();d.uv_layers.new()
  for i,uv in enumerate(uvs):d.uv_layers.active.data[i].uv=uv
  joined=bpy.data.objects.new(mat.name+' / coherent native courtyard detail',d);bpy.context.collection.objects.link(joined);d.materials.append(mat);result.append(joined)
  for o in group:bpy.data.objects.remove(o,do_unlink=True)
 return result
base=P/'blender/reference-architecture-v19/architecture-v19.blend';baseline=hashlib.sha256(base.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(base));bpy.context.scene.frame_set(1);before=set(bpy.context.scene.objects)
stone=material('V20 chamfered cloister vault limestone',(.46,.41,.31),.87,maps=photos(A/'home','sandstone_cracks'));oak=material('V20 guild manuscript shelf oak',(.23,.13,.065),.88,maps={'Base Color':A/'odyssey/wood_planks/wood_planks_diff_1k.jpg','Normal':A/'odyssey/wood_planks/wood_planks_nor_gl_1k.jpg','Roughness':A/'odyssey/wood_planks/wood_planks_rough_1k.jpg'});paper=material('V20 folded manuscript edges',(.60,.47,.28),.97);iron=material('V20 blackened lantern iron',(.035,.029,.022),.62,.7)
for x in [5.55,6.65,7.75,8.85]:
 # Barrel vault returns into the building: the recess has an illuminated ceiling and a dark back.
 vs=[];fs=[]
 for zi in range(8):
  z=.06-zi*.31
  for ai in range(25):
   angle=ai/24*math.pi;vs.append((x+.48*math.cos(angle),1.49+.65*math.sin(angle),z))
   if zi<7 and ai<24:k=zi*25+ai;fs.append((k,k+1,k+26,k+25))
 vault=mesh('V20 full depth barrel vault',vs,fs,stone);m=vault.modifiers.new('Real limestone vault thickness','SOLIDIFY');m.thickness=.10
 vault.data=bpy.data.meshes.new_from_object(vault.evaluated_get(bpy.context.evaluated_depsgraph_get()));vault.modifiers.clear()
 cube('V20 shaded cloister rear wall',(x,.96,-2.20),(.93,1.92,.16),stone)
 for y in [.20,.79,1.35]:cube('V20 fitted manuscript shelf',(x,y,-1.93),(.84,.065,.30),oak)
 for i in range(6):cube('V20 bound manuscript in recess',(x-.34+i*.13,.49,-1.88),(.085,.42,.21),paper if i%3==0 else oak,.012)
 for side in [-1,1]:
  cube('V20 column square plinth',(x+side*.51,.14,-.03),(.18,.24,.36),stone)
  cube('V20 carved capital return',(x+side*.51,1.49,-.03),(.21,.13,.32),stone)
 cube('V20 hanging lantern dark frame',(x,1.57,-.76),(.17,.24,.15),iron,.016)
new=combine([o for o in bpy.context.scene.objects if o not in before and o.type=='MESH']);export(new,'courtyard-depth.glb')
# Practical lights now cast soft shadows inside the vaults; a broad moving key reaches the forest.
for o in list(bpy.context.scene.objects):
 if o.type=='LIGHT':bpy.data.objects.remove(o,do_unlink=True)
area((-12,13,9),(0,4,-9),3600,4,(1,.73,.43));area((10,11,-14),(0,5,-12),900,7,(.43,.57,.55));area((1,6,7),(0,4,-1),170,7,(1,.82,.59))
area((-18,10,-5),(-15,5,-18),1200,6,(1,.77,.43));area((15,11,-7),(15,5,-17),1050,6,(1,.72,.38))
for x in [5.55,6.65,7.75,8.85]:
 bpy.ops.object.light_add(type='POINT',location=w((x,1.56,-.75)));o=bpy.context.view_layer.objects.active;o.data.energy=45;o.data.color=(1,.53,.19);o.data.shadow_soft_size=.13
for o in bpy.context.scene.objects:
 if o.type=='MESH' and any(s in o.name.lower() for s in ['leaf','foliage','canopy']):
  for m in o.data.materials:
   if m and m.use_nodes:
    s=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
    if s:s.inputs['Roughness'].default_value=.90
camera((3.7,6.3,26.0),(.3,3.9,-1.1),39)
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True;s.render.resolution_x=1600;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'courtyard-cycles-v20.png');s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.35
bpy.ops.wm.save_as_mainfile(filepath=str(H/'architecture-v20.blend'))
(H/'home-native-audit.json').write_text(json.dumps({'nativeVersion':'V20','baseV19Unchanged':hashlib.sha256(base.read_bytes()).hexdigest()==baseline,'addedMaterialBatches':len(new),'depthVaults':4,'realMcp':True,'CyclesDevice':'CPU','samples':64,'renderComplete':False},indent=2),encoding='utf8')
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V20 native continuous vaulted recesses, shelves and reveals saved; new CPU Cycles render running.')
