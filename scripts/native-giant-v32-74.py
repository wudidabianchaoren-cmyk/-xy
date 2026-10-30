import bpy,math,ast,json
from pathlib import Path
from mathutils import Vector,noise
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');H=P/'blender/reference-architecture-v20';A=P/'assets'
tree=ast.parse((P/'blender/reference-architecture-v17/build-increment.py').read_text(encoding='utf8').replace('bpy.context.object','bpy.context.view_layer.objects.active'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-functions','exec'),globals())
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.import_scene.gltf(filepath=str(H/'cyclops-input.glb'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and any(s in o.name.lower() for s in ['waist','apron','binding','clasp','stitch']):bpy.data.objects.remove(o,do_unlink=True)
skin=material('V20 softly weathered shepherd skin',(.33,.25,.18),.83);n=skin.node_tree.nodes;l=skin.node_tree.links;s=next(v for v in n if v.type=='BSDF_PRINCIPLED');grain=n.new('ShaderNodeTexNoise');grain.inputs['Scale'].default_value=260;grain.inputs['Detail'].default_value=2;bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.17;bump.inputs['Distance'].default_value=.0007;l.new(grain.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs['Normal'],s.inputs['Normal'])
for o in bpy.context.scene.objects:
 if o.type=='MESH' and 'Uncut' in o.name:
  o.data.materials.clear();o.data.materials.append(skin)
  for f in o.data.polygons:f.use_smooth=True
linen={'Base Color':A/'odyssey/rough_linen/rough_linen_diff_1k.jpg','Normal':A/'odyssey/rough_linen/rough_linen_nor_gl_1k.jpg','Roughness':A/'odyssey/rough_linen/rough_linen_rough_1k.jpg'}
wool=material('V20 fitted pleated woven wool tunic',(.35,.27,.16),.97,maps=linen);mantle=material('V20 folded woven shoulder mantle',(.19,.14,.09),.98,maps=linen);leather=material('V20 worn waist belt',(.075,.044,.025),.89);hair=material('V20 short uneven beard',(.055,.037,.021),.97)
for mat,tint in [(wool,(.54,.33,.17,1)),(mantle,(.30,.22,.14,1))]:
 nodes=mat.node_tree.nodes;links=mat.node_tree.links;shader=next(v for v in nodes if v.type=='BSDF_PRINCIPLED');source=shader.inputs['Base Color'].links[0].from_socket;mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=tint;links.new(source,mix.inputs[1]);links.new(mix.outputs[0],shader.inputs['Base Color'])
def fabric(name,verts,faces,mat,uvs):
 o=mesh(name,verts,faces,mat);uv=o.data.uv_layers.active
 for f in o.data.polygons:
  f.use_smooth=True
  for li in f.loop_indices:uv.data[li].uv=uvs[o.data.loops[li].vertex_index]
 solid=o.modifiers.new('Woven cloth has a sewn thickness','SOLIDIFY');solid.thickness=.003
 o.data=bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()));o.modifiers.clear();return o
# A shaped torso and gathered skirt share a fitted waist. Vertical folds widen towards the hem.
verts=[];faces=[];uvs=[];N=144;R=58
for j in range(R+1):
 t=j/R;y=.655+t*.755
 if y<1.035:
  v=(1.035-y)/.38;rx=.182+.057*v;rz=.138+.030*v;fold=(.009+.012*v)*math.cos(18*(math.tau/N))
 else:
  v=(y-1.035)/.375;rx=.193+.074*math.sin(v*math.pi*.56);rz=.176+.060*math.sin(v*math.pi)
 for i in range(N):
  a=i/N*math.tau;f=(.004+.008*max(0,(1.035-y)/.38))*math.sin(a*9+.65*math.sin(y*6+a*2))+.0025*math.sin(a*19+y*7)
  if y>1.035:f+=.006*math.sin(a*4+v*7)*math.sin(v*math.pi)
  yy=y+.012*math.sin(a*3+.8)*(1-t)**3
  # Shoulder seam rises beside the neck; the neck opening stays clear of the original head.
  if t>.92:yy+=.025*math.cos(a*2)*(t-.92)/.08
  verts.append((math.sin(a)*(rx+f),yy,math.cos(a)*(rz+f*.68)+.018));uvs.append((i/N*5,t*4))
  if j<R:k=j*N+i;vnext=j*N+(i+1)%N;faces.append((k,vnext,vnext+N,k+N))
fabric('V20 tailored short tunic / continuous torso, gathered waist and irregular sewn hem',verts,faces,wool,uvs)
vs=[];fs=[];us=[]
for j in range(14):
 t=j/13
 for i in range(144):
  a=i/144*math.tau;edgeFold=.004*math.sin(a*9+.65*math.sin(1.410*6+a*2))+.0025*math.sin(a*19+1.410*7)
  rx=.085+(.193+.074*math.sin(math.pi*.56)+edgeFold-.085)*t;rz=.075+(.176+edgeFold*.68-.075)*t;y=1.485-.075*t+.025*math.cos(a*2)*t;vs.append((math.sin(a)*rx,y,math.cos(a)*rz+.018));us.append((i/144*5,t))
  if j<13:k=j*144+i;q=j*144+(i+1)%144;fs.append((k,q,q+144,k+144))
fabric('V20 sewn shoulder yoke and fitted neckline',vs,fs,wool,us)
# Soft sleeves follow both lowered arm axes, leaving the hands unobstructed.
for side in [-1,1]:
 start=Vector((side*.22,1.36,.02));end=Vector((side*.315,1.11,.075));axis=(end-start).normalized();right=axis.cross(Vector((0,0,1))).normalized();forward=axis.cross(right).normalized();vs=[];fs=[];us=[]
 for j in range(15):
  t=j/14;center=start.lerp(end,t)
  for i in range(48):
   a=i/48*math.tau;r=.098-.017*t+.005*math.sin(a*11+t*3);v=center+(right*math.cos(a)+forward*math.sin(a))*r;vs.append(tuple(v));us.append((i/48*2,t*1.5))
   if j<14:k=j*48+i;q=j*48+(i+1)%48;fs.append((k,q,q+48,k+48))
 fabric('V20 fitted short woven sleeve '+str(side),vs,fs,wool,us)
# Draped back mantle with a weighted curved hem and sculpted folds, not a rigid panel.
vs=[];fs=[];us=[];cols=56;rows=40
for j in range(rows+1):
 t=j/rows
 for i in range(cols+1):
  u=i/cols;x=(u-.5)*(.57+.08*t);y=1.39-.50*t+.042*math.sin(u*math.pi);z=-.135-.025*t-.020*math.sin(u*math.pi)-.015*math.sin(u*math.pi*9+t*.7)*(t*.8+.2)
  vs.append((x,y,z));us.append((u*3,t*3))
  if j<rows and i<cols:k=j*(cols+1)+i;fs.append((k,k+1,k+cols+2,k+cols+1))
fabric('V20 softly draped wool mantle across the shoulders',vs,fs,mantle,us)
vs=[];fs=[]
for i in range(120):
 a=i/120*math.tau
 for j in range(10):
  b=j/10*math.tau;vs.append((math.sin(a)*(.189+.013*math.cos(b)),1.042+.013*math.sin(b),math.cos(a)*(.144+.013*math.cos(b))+.020));k=i*10+j;q=i*10+(j+1)%10;n=((i+1)%120)*10+j;r=((i+1)%120)*10+(j+1)%10;fs.append((k,q,r,n))
mesh('V20 worn leather belt',vs,fs,leather)
# A compact natural beard follows the jaw. The scalp mesh remains the anatomical source hair.
vs=[];fs=[];us=[]
for j in range(18):
 t=j/17
 for i in range(41):
  u=i/40;a=(u-.5)*2.15;rx=.075*(1-t*.52);y=1.535-t*.094;z=.156+.018*math.sin(math.pi*t)+.002*math.sin(i*2.6+j*3);vs.append((math.sin(a)*rx,y,z-.04*(1-math.cos(a))));us.append((u,t))
  if j<17 and i<40:k=j*41+i;fs.append((k,k+1,k+42,k+41))
# The continuous jaw stays clean; no hanging flat beard panel.
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0]
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=objects[0],selected_objects=objects,selected_editable_objects=objects):bpy.ops.export_scene.gltf(filepath=str(H/'polyphemus-v20.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
meta=json.loads((H/'input-anatomy.json').read_text(encoding='utf8'));meta.update({'nativeVersion':'V20','pose':'upright / aligned foot toe directions and chest +Z','heldObject':'none','newGarment':True,'eyeCount':1,'supportHeight':15.1});(H/'input-anatomy.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
area((-2,3,3),(0,1,0),270,2,(1,.79,.59));area((2,2,-2),(0,1,0),110,2,(.41,.57,.62));camera((2.1,1.4,3.7),(0,.92,0),52)
bpy.context.scene.world=bpy.data.worlds.new('V20 quiet figure studio');bpy.context.scene.world.use_nodes=True;bpy.context.scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.06
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True;s.render.resolution_x=1200;s.render.resolution_y=1200;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'polyphemus-cycles-v20.png');s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.3
bpy.ops.wm.save_as_mainfile(filepath=str(H/'polyphemus-v20.blend'))
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V20 complete giant with aligned feet and newly tailored pleated tunic exported; CPU Cycles running.')
