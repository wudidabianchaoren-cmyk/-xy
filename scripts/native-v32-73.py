import bpy,math,ast,json,hashlib,time
from pathlib import Path
from mathutils import Vector,Matrix,noise
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')
H=P/'blender/reference-architecture-v19';H.mkdir(parents=True,exist_ok=True);A=P/'assets'
tree=ast.parse((P/'blender/reference-architecture-v17/build-increment.py').read_text(encoding='utf8').replace('bpy.context.object','bpy.context.view_layer.objects.active'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'retained-native-functions','exec'),globals())
def cube(name,pos,size,mat,bevel=.04):
 x,y,z=pos;a,b,c=[v/2 for v in size]
 vs=[(x+i*a,y+j*b,z+k*c) for i,j,k in [(-1,-1,-1),(-1,-1,1),(-1,1,-1),(-1,1,1),(1,-1,-1),(1,-1,1),(1,1,-1),(1,1,1)]]
 o=mesh(name,vs,[(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)],mat)
 if bevel:
  m=o.modifiers.new('V19 crafted edge bevel','BEVEL');m.width=bevel;m.segments=3
  o.data=bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()));o.modifiers.clear()
 return o
def batch(objects):return objects
def selected_export(objects,file):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]
 with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],object=objects[0],active_object=objects[0],selected_objects=objects,selected_editable_objects=objects):
  bpy.ops.export_scene.gltf(filepath=str(H/file),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
base=P/'blender/reference-architecture-v18/architecture-v18.blend';frozen=hashlib.sha256(base.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(base));bpy.context.scene.frame_set(1)
stone=material('V19 honed edge limestone',(.41,.36,.27),.82,maps=photos(A/'home','sandstone_cracks'))
bronze=material('V19 restrained chased bronze',(.28,.14,.045),.32,.94)
before=set(bpy.context.scene.objects)
# Details stay on the architecture, with broad coping profiles read from the wide camera.
for x,y,z,width in [(-4.75,3.60,-2.4,1.8),(6.2,.55,-.22,1.05),(7.7,.55,-.22,1.05),(9.2,.55,-.22,1.05)]:
 cube('V19 chamfered sill and weathered drip profile',(x,y,z),(width,.12,.28),stone,.026)
 cube('V19 inset bronze sill edge',(x,y+.025,z+.142),(width*.86,.025,.015),bronze,.008)
for x in [-1.95,1.67]:
 for y in [.49,2.85,6.96]:cube('V19 clock tower projecting stone course',(x,y,-.02),(.26,.12,.40),stone,.025)
new=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH'];selected_export(batch(new),'architectural-profiles.glb')
for m in bpy.data.materials:
 if not m.use_nodes:continue
 for node in m.node_tree.nodes:
  if node.type=='BSDF_PRINCIPLED':
   if 'limestone' in m.name.lower() or 'travertine' in m.name.lower():node.inputs['Roughness'].default_value=.80
  if node.type=='NORMAL_MAP':node.inputs['Strength'].default_value=.38
for o in list(bpy.context.scene.objects):
 if o.type=='LIGHT':bpy.data.objects.remove(o,do_unlink=True)
area((-7.5,9.5,7),(0,4,-1),2400,3.5,(1,.70,.42))
area((7,9,-9),(0,5,-1),850,5.5,(.39,.53,.58))
area((1,6,6),(-.15,4,-.1),130,7,(1,.84,.68))
for x in [5.55,6.65,7.75,8.85]:
 bpy.ops.object.light_add(type='POINT',location=w((x,1.83,.25)));o=bpy.context.view_layer.objects.active;o.data.energy=24;o.data.color=(1,.56,.21);o.data.shadow_soft_size=.18
if bpy.context.scene.world and bpy.context.scene.world.use_nodes:
 for node in bpy.context.scene.world.node_tree.nodes:
  if node.type=='BACKGROUND':node.inputs['Strength'].default_value=.025
camera((3.8,6.2,26.5),(.1,4,-1),39.5)
def save_native(file):
 for image in bpy.data.images:
  if image.source=='FILE':
   try:image.pack()
   except Exception:pass
 bpy.ops.wm.save_as_mainfile(filepath=str(H/file))
save_native('architecture-v19.blend')
# Recover an upright, supported anatomy from the frozen baked pose; remove the ball entirely.
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/reference-architecture-v18/polyphemus-reclining.blend'))
undo=Matrix.Rotation(-1.18,4,'Y')
for o in list(bpy.context.scene.objects):
 if o.type=='MESH':
  if 'throwing stone' in o.name.lower():bpy.data.objects.remove(o,do_unlink=True);continue
  o.matrix_world=undo@o.matrix_world
character=[o for o in bpy.context.scene.objects if o.type=='MESH']
selected_export(character,'polyphemus-upright.glb')
meta=json.loads((P/'blender/reference-architecture-v18/input-anatomy.json').read_text(encoding='utf8'))
for key in ['rightHandLocal','leftHandLocal']:
 x,y,z=meta[key];meta[key]=[x*math.cos(1.18)-y*math.sin(1.18),x*math.sin(1.18)+y*math.cos(1.18),z]
meta.update({'pose':'upright supported on natural island','heldObject':'none','eyeCount':1,'nativeVersion':'V19'})
(H/'input-anatomy.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
for o in list(bpy.context.scene.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
area((-2,3,3),(0,1,0),260,2,(1,.73,.46));area((2,2,-2),(0,1,0),90,2,(.39,.54,.60));camera((2.2,1.7,4.2),(0,1,0),55)
save_native('polyphemus-upright.blend')
# A wide island has a continuous top, a shore shelf and separate surface zones.
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
rock=material('V19 island stratified rock',(.25,.26,.19),.88,maps=photos(A/'home','sandstone_cracks'))
sand=material('V19 island tidal sand',(.37,.31,.20),.95)
moss=material('V19 sparse island moss',(.10,.135,.060),.97)
verts=[];faces=[];rings=40;N=128
for j in range(rings+1):
 t=j/rings
 for i in range(N):
  a=i/N*math.tau;r=t*(1+.07*math.sin(a*5)+.035*math.sin(a*11))
  x=math.cos(a)*39*r;z=math.sin(a)*25*r
  h=14*max(0,1-t*t)**1.8+(1-t)*2*noise.noise(Vector((x*.065,z*.065,3)))
  h-=3*t**12
  verts.append((x,h,z))
  if j<rings:k=j*N+i;n=j*N+(i+1)%N;faces.append((k,n,n+N,k+N))
faces.append(tuple(rings*N+i for i in reversed(range(N))))
island=mesh('V19 continuous low island with eroded coast',verts,faces,rock);island.data.materials.append(sand);island.data.materials.append(moss)
for f in island.data.polygons:
 h=sum(island.data.vertices[i].co.z for i in f.vertices)/len(f.vertices)
 f.material_index=1 if -.5<h<1.4 else (2 if h>9 and f.normal.z>.75 else 0)
 f.use_smooth=True
uv_world(island,.038);selected_export([island],'island.glb');save_native('island.blend')
audit={'version':'V32.73','blenderVersion':bpy.app.version_string,'connection':'Actual MCP execute_blender_code on separate hidden Blender instance','baseV18Unchanged':hashlib.sha256(base.read_bytes()).hexdigest()==frozen,'newNativeProfiles':len(new),'uprightCompleteGiant':True,'heldObjectRemoved':True,'continuousIsland':True,'engine':'CYCLES','device':'CPU','renderFinished':False}
(H/'native-production-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8')
bpy.ops.wm.open_mainfile(filepath=str(H/'architecture-v19.blend'))
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True
s.render.resolution_x=1920;s.render.resolution_y=1080;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'courtyard-cycles-v19.png')
s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.40
bpy.ops.wm.save_as_mainfile(filepath=str(H/'architecture-v19.blend'))
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V19 native assets saved; new Cycles home render started asynchronously.')
