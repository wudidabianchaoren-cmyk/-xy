import bpy,math,ast,json,random
from pathlib import Path
from mathutils import Vector,noise
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');H=P/'blender/reference-architecture-v20';A=P/'assets';rng=random.Random(2074)
tree=ast.parse((P/'blender/reference-architecture-v17/build-increment.py').read_text(encoding='utf8').replace('bpy.context.object','bpy.context.view_layer.objects.active'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-functions','exec'),globals())
bpy.ops.wm.read_factory_settings(use_empty=True)
rock=material('V20 island eroded stratified limestone',(.30,.29,.20),.95,maps=photos(A/'home','sandstone_cracks'));sand=material('V20 protected sandy coves',(.48,.40,.27),.98);moss=material('V20 green island grass and moss',(.17,.23,.085),.98);bark=material('V20 wind-shaped olive tree bark',(.13,.11,.068),.98);leaf=material('V20 soft olive green foliage',(.22,.29,.12),.96)
def coastline(a):return 1+.095*math.sin(a*3+.5)+.060*math.sin(a*5-1.0)+.035*math.sin(a*11)
def terrain(x,z):
 a=math.atan2(z/72,x/110);t=math.hypot(x/110,z/72)/coastline(a)
 base=8*max(0,1-t*t)**1.5
 hills=18*math.exp(-((x+23)/44)**2-((z+10)/33)**2)+12*math.exp(-((x-43)/38)**2-((z-24)/27)**2)
 strata=(1-t)**2*(2.4*noise.noise(Vector((x*.055,z*.055,2)))+1.4*math.sin(x*.18+z*.10))
 shore=3.0*math.exp(-((t-.89)/.045)**2)*(.5+.5*math.sin(a*4))
 h=base+hills+strata+shore-6*t**14;distance=math.hypot(x+5,z-11);blend=max(0,min(1,(16-distance)/9));blend=blend*blend*(3-2*blend);return h*(1-blend)+19.562828*blend
vs=[];fs=[];N=192;R=70
for j in range(R+1):
 t=j/R
 for i in range(N):
  a=i/N*math.tau;r=t*coastline(a);x=110*r*math.cos(a);z=72*r*math.sin(a);vs.append((x,terrain(x,z),z))
  if j<R:k=j*N+i;q=j*N+(i+1)%N;fs.append((k,q,q+N,k+N))
fs.append(tuple(R*N+i for i in reversed(range(N))))
island=mesh('V20 complete large island / connected coves, slopes and layered headlands',vs,fs,rock);island.data.materials.append(sand);island.data.materials.append(moss);uv_world(island,.042)
for f in island.data.polygons:
 h=sum(island.data.vertices[i].co.z for i in f.vertices)/len(f.vertices);x=sum(island.data.vertices[i].co.x for i in f.vertices)/len(f.vertices)
 f.material_index=0;f.use_smooth=True
colors=island.data.color_attributes.new(name='IslandSurface',type='FLOAT_COLOR',domain='CORNER')
for face in island.data.polygons:
 for li in face.loop_indices:
  p=island.data.vertices[island.data.loops[li].vertex_index].co;x,z,h=p.x,-p.y,p.z
  grain=noise.noise(Vector((x*.19,z*.19,7)));green=max(0,min(1,(h-3.0)/5+grain*.40))*max(0,min(1,(face.normal.z-.55)/.30));beach=max(0,min(1,(2.5-h)/2.8))
  rocky=(.72,.67,.51);grassy=(.29+.03*grain,.40+.04*grain,.15);sandy=(.88,.79,.58);c=[(rocky[k]*(1-green)+grassy[k]*green)*(1-beach)+sandy[k]*beach for k in range(3)];colors.data[li].color=(*c,1)
nodes=rock.node_tree.nodes;links=rock.node_tree.links;shader=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');source=shader.inputs['Base Color'].links[0].from_socket;vertex=nodes.new('ShaderNodeVertexColor');vertex.layer_name='IslandSurface';mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;links.new(source,mix.inputs[1]);links.new(vertex.outputs['Color'],mix.inputs[2]);links.new(mix.outputs[0],shader.inputs['Base Color'])
def branch(a,b,r):
 a=Vector(a);b=Vector(b);axis=(b-a).normalized();u=axis.cross(Vector((0,1,0))).normalized();v=axis.cross(u).normalized();points=[];faces=[]
 for j in range(2):
  p=a if j==0 else b
  for i in range(8):
   angle=i/8*math.tau;points.append(tuple(p+(u*math.cos(angle)+v*math.sin(angle))*r*(1 if j==0 else .55)))
 for i in range(8):faces.append((i,(i+1)%8,(i+1)%8+8,i+8))
 return mesh('V20 olive trunk and branch',points,faces,bark)
for k in range(46):
 x=rng.uniform(-74,76);z=rng.uniform(-44,40);h=terrain(x,z)
 if h<4 or math.hypot(x+5,z-11)<11:continue
 height=rng.uniform(3.0,5.7);branch((x,h,z),(x+.25,h+height*.73,z),.15)
 for j in range(4):
  a=j*2.4+k;cx=x+math.cos(a)*1.6;cz=z+math.sin(a)*1.5;cy=h+height*(.71+rng.random()*.15);branch((x,h+height*.45,z),(cx,cy,cz),.072)
  points=[];faces=[]
  for twig in range(5):
   angle=twig*2.399+j;end=(cx+math.cos(angle)*1.15,cy+rng.uniform(-.2,.5),cz+math.sin(angle)*.95);branch((cx,cy-.30,cz),end,.028)
  for n in range(180):
   azimuth=rng.random()*math.tau;vertical=rng.uniform(-1,1);radial=rng.random()**.42;ring=math.sqrt(1-vertical*vertical)
   centre=Vector((cx+math.cos(azimuth)*ring*radial*1.6,cy+vertical*radial*.84,cz+math.sin(azimuth)*ring*radial*1.38))
   direction=Vector((rng.uniform(-1,1),rng.uniform(-.45,.8),rng.uniform(-1,1))).normalized();across=direction.cross(Vector((0,1,0))).normalized();bend=across.cross(direction).normalized();length=rng.uniform(.36,.62);width=length*.20;offset=len(points)
   for along,side,fold in [(0,0,0),(.30,-1,.04),(.72,-.8,.06),(1,0,0),(.72,.8,.06),(.30,1,.04)]:points.append(tuple(centre+direction*along*length+across*side*width+bend*fold))
   faces.extend([(offset,offset+1,offset+5),(offset+1,offset+2,offset+5),(offset+2,offset+4,offset+5),(offset+2,offset+3,offset+4)])
  o=mesh('V20 wind-shaped olive crown / separate folded leaves with airy gaps',points,faces,leaf)
  for f in o.data.polygons:f.use_smooth=True
# Small grass tufts sit on the ground instead of becoming floating decor.
grassVs=[];grassFs=[]
for k in range(850):
 x=rng.uniform(-88,88);z=rng.uniform(-51,51);h=terrain(x,z)
 if h<4 or h>25:continue
 for j in range(3):
  a=j*math.pi/3;bladeWidth=.16;height=rng.uniform(.35,.8);o=len(grassVs);grassVs.extend([(x-bladeWidth*math.cos(a),h,z-bladeWidth*math.sin(a)),(x+bladeWidth*math.cos(a),h,z+bladeWidth*math.sin(a)),(x+.13*math.cos(a),h+height,z+.13*math.sin(a))]);grassFs.append((o,o+1,o+2))
mesh('V20 rooted island ground vegetation',grassVs,grassFs,moss)
# Join by material for runtime performance, without changing the native geometry.
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];groups={}
for o in objects:
 if o is not island:groups.setdefault(o.data.materials[0],[]).append(o)
for mat,group in groups.items():
 points=[];faces=[]
 for o in group:
  offset=len(points);points.extend(tuple(o.matrix_world@v.co) for v in o.data.vertices);faces.extend(tuple(offset+i for i in f.vertices) for f in o.data.polygons)
 d=bpy.data.meshes.new('V20 batched native vegetation');d.from_pydata(points,[],faces);d.update();joined=bpy.data.objects.new(mat.name+' / native island vegetation',d);bpy.context.collection.objects.link(joined);d.materials.append(mat)
 for f in d.polygons:f.use_smooth=True
 for o in group:bpy.data.objects.remove(o,do_unlink=True)
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0]
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0],active_object=objects[0],selected_objects=objects,selected_editable_objects=objects):bpy.ops.export_scene.gltf(filepath=str(H/'inhabited-island.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False,export_vertex_color='ACTIVE',export_all_vertex_colors=True)
meta=json.loads((H/'input-anatomy.json').read_text(encoding='utf8'));meta['supportHeight']=terrain(-5,11)-meta['worldBounds']['min'][1]*19.5+.12;meta['islandWidth']=220;meta['islandDepth']=144;(H/'input-anatomy.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
with bpy.data.libraries.load(str(H/'polyphemus-v20.blend'),link=False) as (source,target):target.objects=[n for n in source.objects if n not in ['Camera','Area','Area.001']]
for o in target.objects:
 if o and o.type=='MESH':bpy.context.collection.objects.link(o);o.location+=Vector(w((-5,meta['supportHeight'],11)));o.scale*=19.5;o.rotation_euler.z=.32
area((-100,130,90),(0,8,0),240000,70,(1,.77,.48));area((90,80,-110),(0,15,0),110000,90,(.40,.58,.60));camera((170,103,205),(0,12,0),48)
bpy.context.scene.world=bpy.data.worlds.new('V20 blue-grey sea air');bpy.context.scene.world.use_nodes=True;bpy.context.scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.085,.11,.11,1);bpy.context.scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.45
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=48;s.cycles.use_denoising=True;s.render.resolution_x=1440;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.filepath=str(H/'inhabited-island-cycles-v20.png');s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=-.1
bpy.ops.wm.save_as_mainfile(filepath=str(H/'inhabited-island.blend'))
(H/'island-native-audit.json').write_text(json.dumps({'realMcp':True,'width':220,'depth':144,'terrainVertices':len(vs),'vegetationBatches':len(groups),'supportHeight':meta['supportHeight'],'CyclesDevice':'CPU'},indent=2),encoding='utf8')
with bpy.context.temp_override(window=bpy.context.window_manager.windows[0]):bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
print('V20 continuous large vegetated island exported, feet supported on measured terrain; new Cycles render running.')
