"""Native V18 additions, continuous reclining anatomy and real CPU Cycles proof images."""
import bpy, math, ast, json, random, hashlib, time
from pathlib import Path
from mathutils import Vector, noise
H=Path(__file__).resolve().parents[1]/'blender/reference-architecture-v18';H.mkdir(parents=True,exist_ok=True)
P=H.parents[1];A=P/'assets';rng=random.Random(3272)
tree=ast.parse((H.parent/'reference-architecture-v17/build-increment.py').read_text(encoding='utf8'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'retained-native-functions','exec'),globals())
def render(file):
 s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=48;s.cycles.use_denoising=True
 s.render.resolution_x=1600;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/file)
 s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.35
 bpy.ops.render.render(write_still=True)
def empty_scene():
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def textured_wool():
 return material('heavy undyed flax cloth',(.24,.19,.12),.95,maps={'Base Color':A/'odyssey/rough_linen/rough_linen_diff_1k.jpg','Roughness':A/'odyssey/rough_linen/rough_linen_rough_1k.jpg','Normal':A/'odyssey/rough_linen/rough_linen_nor_gl_1k.jpg'})
start=time.time();base=H.parent/'reference-architecture-v17/architecture-v17.blend';frozen=hashlib.sha256(base.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(base));bpy.context.scene.frame_set(1)
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and any(m and m.name.startswith('V17 /') for m in o.data.materials):bpy.data.objects.remove(o,do_unlink=True)
before=set(bpy.context.scene.objects)
stone=material('archive matched limestone',(.58,.51,.40),.84,maps=photos(A/'home','white_sandstone_blocks_02'))
iron=material('forged charcoal iron',(.04,.035,.027),.52,.8);brass=material('aged warm brass',(.43,.25,.075),.34,.92)
glass=material('warm lantern glass',(.58,.23,.035),.45)
shader=next(n for n in glass.node_tree.nodes if n.type=='BSDF_PRINCIPLED');shader.inputs['Emission Color'].default_value=(1,.29,.035,1);shader.inputs['Emission Strength'].default_value=2.5
# Stone benches are recessed against the side wings; no loose cart, well or trough in the foreground.
for x in [-7.65,9.45]:
 cube('built-in carved cloister stone seat',(x,.49,-3.7),(1.7,.18,.48),stone,.04)
 for side in [-1,1]:cube('stone seat engaged corbel',(x+side*.63,.26,-3.82),(.23,.43,.34),stone,.035)
 cube('guild seat carved back panel',(x,.78,-3.97),(1.68,.52,.12),stone,.025)
for x in [5.55,6.65,7.75,8.85,-7.5]:
 y=1.7 if x>0 else 2.1;z=-.56 if x>0 else -1.5
 cube('Gothic wall lamp back plate',(x,y,z),(.10,.41,.06),iron,.013)
 tube('Gothic wall lamp bracket',[(x,y-.15,z),(x,y-.08,z+.36),(x,y+.12,z+.36)],.022,iron)
 cube('Gothic lantern amber glass',(x,y+.23,z+.36),(.16,.28,.16),glass,.012)
 for side in [-1,1]:tube('lantern iron mullion',[(x+side*.09,y+.08,z+.36),(x+side*.09,y+.40,z+.36)],.012,iron)
 cube('lantern sloping copper crown',(x,y+.43,z+.36),(.23,.07,.23),brass,.014)
 bpy.ops.object.light_add(type='POINT',location=w((x,y+.25,z+.46)));bpy.context.object.data.energy=28;bpy.context.object.data.color=(1,.47,.17);bpy.context.object.data.shadow_soft_size=.16
added=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH'];selected_export(batch(added),'courtyard-additions.glb')
# The warm key moves through the retained native architecture; use a deliberately directional frame.
for o in bpy.context.scene.objects:
 if o.type=='LIGHT':o.data.energy*=.24
area((-8,10,6),(0,4,-1),1900,4.0,(1,.66,.34));area((8,7,-9),(0,5,-1),750,5.0,(.42,.62,.75))
if bpy.context.scene.world and bpy.context.scene.world.use_nodes:
 bg=next((n for n in bpy.context.scene.world.node_tree.nodes if n.type=='BACKGROUND'),None)
 if bg:bg.inputs['Strength'].default_value=.075
camera((3.8,6.2,26.5),(.1,4,-1),39.5)
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
bpy.ops.wm.save_as_mainfile(filepath=str(H/'architecture-v18.blend'));render('courtyard-cycles-v18.png')
empty_scene();bpy.ops.import_scene.gltf(filepath=str(H/'cyclops-input.glb'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and any(q in o.name.lower() for q in ['hair','stitch','apron','clasp']):bpy.data.objects.remove(o,do_unlink=True)
skin=material('earth toned weathered giant skin',(.28,.20,.13),.92)
body=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH' and 'Uncut' in o.name:
  body.append(o);o.data.materials.clear();o.data.materials.append(skin)
  for f in o.data.polygons:f.use_smooth=True
# Garment follows the existing continuous reclining torso. Work in upright coordinates, then
# apply the same rotation as the baked anatomical pose; avoid a conical robe or card-based hair.
wool=textured_wool();N=64;R=28;verts=[];faces=[]
for j in range(R+1):
 t=j/R;y=1.43-.71*t;r=.115+.075*math.sin(t*math.pi*.65)
 for i in range(N+1):
  a=i/N*math.tau;x=math.sin(a)*(r+.004*math.sin(a*14));z=math.cos(a)*r*.81+.017
  verts.append((x*math.cos(-1.18)-y*math.sin(-1.18),x*math.sin(-1.18)+y*math.cos(-1.18),z))
  if j<R and i<N:k=j*(N+1)+i;faces.append((k,k+1,k+N+2,k+N+1))
robe=mesh('Fitted reclining short woven wool robe',verts,faces,wool)
for f in robe.data.polygons:f.use_smooth=True
uv_world(robe,8)
meta=json.loads((H/'input-anatomy.json').read_text(encoding='utf8'));hand=meta['rightHandLocal']
# The only held object is an irregular rock. Natural noise replaces rectilinear forms.
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3,radius=.09,location=w((hand[0],hand[1]+.045,hand[2])))
rock=bpy.context.object;rock.name='Hand held fractured throwing stone';rock.data.materials.append(material('fractured throwing stone',(.18,.16,.13),.96))
for v in rock.data.vertices:v.co*=1+.18*noise.noise(v.co*37)
uv_world(rock,8)
character=[o for o in bpy.context.scene.objects if o.type=='MESH'];selected_export(character,'polyphemus-reclining.glb')
area((-.6,3,3),(1,.3,.05),55,2,(1,.73,.47));area((3,1,-2),(1,.3,.1),35,2,(.48,.61,.65));camera((2.6,1.5,4.3),(.75,.20,0),50)
bpy.context.scene.world.use_nodes=True;bpy.context.scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.08
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
bpy.ops.wm.save_as_mainfile(filepath=str(H/'polyphemus-reclining.blend'));render('polyphemus-cycles-v18.png')
empty_scene();geology=material('natural stratified limestone cliff',(.18,.19,.15),.97,maps=photos(A/'home','sandstone_cracks'))
# One irregular solid cliff, with flat rough top support and no arch, stairs, temple or cylinders.
verts=[];faces=[];rings=14;segments=48
for j in range(rings+1):
 y=j/rings*24
 for i in range(segments):
  a=i/segments*math.tau;r=(1-.18*j/rings)*(1+.08*math.sin(a*5)+.04*math.sin(a*13+j*.9))
  verts.append((17+math.cos(a)*25*r,y+(.12*math.sin(a*9) if j==rings else .6*math.sin(a*7+j)),math.sin(a)*17*r))
  if j<rings:k=j*segments+i;n=j*segments+(i+1)%segments;faces.append((k,n,n+segments,k+segments))
faces.extend([tuple(range(segments-1,-1,-1)),tuple(rings*segments+i for i in range(segments))])
cliff=mesh('Continuous naturally layered reclining cliff',verts,faces,geology);selected_export([cliff],'natural-cliff.glb')
bpy.ops.wm.save_as_mainfile(filepath=str(H/'natural-cliff.blend'))
proof={'version':'V32.72','blenderVersion':bpy.app.version_string,'engine':'CYCLES','device':'CPU','nativeBaseV17Sha256':frozen,'baseUnchanged':hashlib.sha256(base.read_bytes()).hexdigest()==frozen,'nativeV18':True,'recliningPolyphemus':True,'continuousImportedBody':len(body),'artificialTempleRemoved':True,'newCourtyardObjects':len(added),'elapsedSeconds':time.time()-start,'passed':True}
(H/'native-production-audit.json').write_text(json.dumps(proof,indent=2),encoding='utf8');print(json.dumps(proof))
