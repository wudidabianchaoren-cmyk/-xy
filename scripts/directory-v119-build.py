import bpy, math, random, json, sys, time
from pathlib import Path
from mathutils import Vector

ROOT=Path.cwd(); OUT=ROOT/'assets/directory-v119'; NATIVE=ROOT/'blender/directory-v32-119'
OUT.mkdir(parents=True,exist_ok=True); NATIVE.mkdir(parents=True,exist_ok=True)
random.seed(119)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene; scene.name='Original rain-night creative archive / V119'
scene.render.engine='CYCLES'; scene.cycles.samples=40; scene.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA'; prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 scene.cycles.device='GPU'
except Exception as e:print('CUDA selection',e)
scene.render.resolution_x=1600; scene.render.resolution_y=1000; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'; scene.view_settings.exposure=.35
scene.world=bpy.data.worlds.new('Blue rainy hour'); scene.world.use_nodes=True
bg=scene.world.node_tree.nodes.get('Background'); bg.inputs['Color'].default_value=(.055,.085,.15,1); bg.inputs['Strength'].default_value=.25
static=[]; excluded=[]

def mat(name,color,rough=.45,metal=0,noise=0,scale=150):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 n=m.node_tree.nodes;lk=m.node_tree.links;p=n.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if noise:
  t=n.new('ShaderNodeTexNoise');t.inputs['Scale'].default_value=scale;t.inputs['Detail'].default_value=2
  b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=noise;b.inputs['Distance'].default_value=.0007;lk.new(t.outputs['Fac'],b.inputs['Height']);lk.new(b.outputs[0],p.inputs['Normal'])
 return m
def woodmat():
 m=mat('Oiled walnut / subtle long grain',(.16,.06,.025),.31,noise=.08,scale=350);n=m.node_tree.nodes;lk=m.node_tree.links;p=n.get('Principled BSDF')
 tc=n.new('ShaderNodeTexCoord');v=n.new('ShaderNodeVectorMath');v.operation='MULTIPLY';v.inputs[1].default_value=(1.8,95,7);lk.new(tc.outputs['Generated'],v.inputs[0])
 no=n.new('ShaderNodeTexNoise');no.inputs['Scale'].default_value=2.1;no.inputs['Detail'].default_value=3;no.inputs['Roughness'].default_value=.65;lk.new(v.outputs[0],no.inputs[0])
 ramp=n.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.1;ramp.color_ramp.elements[0].color=(.075,.022,.009,1);ramp.color_ramp.elements[1].position=.86;ramp.color_ramp.elements[1].color=(.31,.135,.049,1);lk.new(no.outputs['Fac'],ramp.inputs[0]);lk.new(ramp.outputs['Color'],p.inputs['Base Color'])
 return m
wood=woodmat();black=mat('Graphite molded ABS / fine grain',(.018,.021,.024),.39,noise=.12);rubber=mat('Rubber feet',(.006,.007,.008),.8)
warmplastic=mat('Aged warm black television',(.035,.027,.021),.36,noise=.10)
brass=mat('Brushed warm brass',(.33,.20,.082),.27,.72);metal=mat('Gunmetal small fittings',(.085,.095,.105),.32,.72)
ceramic=mat('Ivory glazed ceramic',(.61,.56,.45),.23,noise=.015);clay=mat('Terracotta fired clay',(.31,.105,.045),.72,noise=.13,scale=70)
paper=mat('Warm cotton paper',(.77,.70,.52),.83,noise=.05);bluepaper=mat('Muted indigo cloth',(.035,.075,.105),.77,noise=.15)
wall=mat('Warm plaster',(.34,.31,.25),.87,noise=.05,scale=40);trim=mat('Old painted window frame',(.22,.18,.13),.52,noise=.04)
curtain=mat('Woven linen curtain',(.41,.34,.24),.93,noise=.17,scale=240)
leafmat=mat('Deep waxy leaf',(.028,.09,.035),.38,noise=.06);leaflight=mat('Leaf young growth',(.075,.16,.045),.43)
pages=mat('Book page edges',(.56,.52,.39),.85,noise=.08,scale=400)
red=mat('Muted oxblood cloth',(.20,.043,.034),.75,noise=.10);olive=mat('Faded olive binding',(.16,.18,.095),.70,noise=.1)

def assign(o,m):o.data.materials.append(m);static.append(o);return o
def box(name,loc,dims,m,bevel=.008):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  b=o.modifiers.new('Soft manufactured edges','BEVEL');b.width=bevel;b.segments=3
  bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=b.name)
  o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
 return assign(o,m)
def cyl(name,loc,r,depth,m,vertices=32):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=name
 b=o.modifiers.new('Rounded rim','BEVEL');b.width=min(.003,depth*.12);b.segments=2;bpy.ops.object.modifier_apply(modifier=b.name)
 for p in o.data.polygons:p.use_smooth=True
 return assign(o,m)
def line(name,pts,r,m):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=2;c.resolution_u=12;s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);bpy.context.view_layer.objects.active=o;o.select_set(True)
 bpy.ops.object.convert(target='MESH');o=bpy.context.object;o.select_set(False);return assign(o,m)
def torus(name,loc,major,minor,m,rotation=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_segments=40,minor_segments=8,location=loc,major_radius=major,minor_radius=minor,rotation=rotation);o=bpy.context.object;o.name=name
 for p in o.data.polygons:p.use_smooth=True
 return assign(o,m)
def emissive(name,color,strength):
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear();e=n.new('ShaderNodeEmission');e.inputs[0].default_value=(*color,1);e.inputs[1].default_value=strength;o=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(e.outputs[0],o.inputs[0]);return m
def area(name,loc,target,power,color,size):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.color=color;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
def leaf(name,start,end,width,m):
 a=Vector(start);b=Vector(end);d=b-a;side=d.cross(Vector((0,1,.2))).normalized()*width
 vs=[]; fs=[]
 for i in range(9):
  t=i/8;center=a+d*t+Vector((0,-.03*math.sin(t*math.pi),.045*math.sin(t*math.pi)));w=math.sin(t*math.pi)**.7
  vs += [tuple(center-side*w),tuple(center+Vector((0,-.018*w,0))),tuple(center+side*w)]
 for i in range(8):
  j=i*3;fs += [(j,j+3,j+4,j+1),(j+1,j+4,j+5,j+2)]
 me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new(name,me);scene.collection.objects.link(o)
 for p in me.polygons:p.use_smooth=True
 return assign(o,m)

# Room with an actual empty opening for a web-added rainy city view.
box('Walnut table / continuous top',(0,0,.71),(3.4,1.65,.08),wood,.017)
box('Front apron',(0,-.75,.60),(3.27,.08,.17),wood,.01)
for x in [-1.55,1.55]:
 for y in [-.65,.65]:box('Table leg',(x,y,.33),(.075,.075,.66),wood,.008)
box('Lower wall',(0,1.24,.42),(4,.14,.84),wall,.005)
box('Above window',(0,1.24,2.94),(4,.14,.7),wall,.005)
for x in [-1.84,1.84]:box('Wall beside rain window',(x,1.24,1.70),(.48,.14,1.72),wall,.005)
box('Wide window sill',(0,1.02,.91),(3.38,.37,.09),trim,.009)
for x in [-1.55,0,1.55]:box('Vertical window mullion',(x,1.05,1.75),(.045,.09,1.62),trim,.005)
for z in [.96,1.73,2.55]:box('Horizontal window sash',(0,1.05,z),(3.15,.09,.045),trim,.005)
cyl('Window brass handle',(0,.985,1.67),.013,.11,brass)
for i in range(21):
 x=-1.2+i*.12
 box('Cast radiator rib',(x,1.03,.46),(.075,.11,.64),ceramic,.025)
line('Radiator supply pipe',[(-1.34,1.03,.15),(-1.34,1.03,.08),(1.4,1.03,.08),(1.4,1.03,.61)],.017,ceramic)
for side in [-1,1]:
 vs=[];fs=[]
 for j in range(25):
  z=.90+j/24*1.94
  for i in range(25):
   u=i/24;x=side*(1.48+u*.47);y=.91+.075*math.sin(u*8*math.pi)+.015*math.sin(z*4+u*5);vs.append((x,y,z+.014*math.cos(u*8*math.pi)))
 for j in range(24):
  for i in range(24):k=j*25+i;fs.append((k,k+1,k+26,k+25))
 me=bpy.data.meshes.new('Linen fold topology');me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new('Heavy folded linen curtain',me);scene.collection.objects.link(o)
 for p in me.polygons:p.use_smooth=True
 assign(o,curtain)

# VCR, CRT cabinet: the screen is deliberately a separate lighting source.
tx=-.25
box('VCR deck',(tx,.075,.815),(.81,.60,.13),black,.015)
box('VCR cassette mouth',(tx-.10,-.234,.827),(.43,.012,.044),rubber,.003)
box('VCR cassette door lip',(tx-.10,-.242,.841),(.42,.008,.008),warmplastic,.002)
displaymat=emissive('Low cyan clock glow',(.13,.55,.43),.65)
clock=box('VCR time display',(tx+.253,-.235,.835),(.13,.008,.028),displaymat,.003)
for i in range(4):box('Clock digit segment',(tx+.205+i*.03,-.242,.835),(.014,.006,.003),ceramic,.001)
for i in range(5):box('VCR transport key',(tx+.16+i*.034,-.242,.793),(.024,.012,.014),metal,.002)
for x in [tx-.32,tx+.32]:
 for y in [-.14,.28]:cyl('VCR rubber foot',(x,y,.752),.022,.013,rubber)
box('CRT cabinet back',(tx,.205,1.22),(.72,.33,.68),warmplastic,.035)
for x in [tx-.326,tx+.326]:box('CRT thick side shell',(x,.065,1.22),(.068,.55,.68),warmplastic,.022)
box('CRT top shell',(tx,.065,1.525),(.72,.55,.07),warmplastic,.022)
box('CRT lower controls',(tx,.065,.975),(.72,.55,.19),warmplastic,.017)
for z in [1.045,1.495]:box('Bezel horizontal lip',(tx,-.193,z),(.59,.032,.035),black,.012)
for x in [tx-.288,tx+.288]:box('Bezel vertical lip',(x,-.193,1.27),(.028,.032,.42),black,.010)
screenmat=emissive('Blue CRT phosphor lighting only',(.07,.19,1),2.2)
screen=box('nav-screen',(tx,-.205,1.27),(.55,.006,.40),screenmat,.018);static.remove(screen);excluded.append(screen)
for i in range(8):box('CRT physical channel button',(tx-.20+i*.041,-.222,.978),(.028,.018,.021),black,.003)
for i in range(2):
 o=cyl('CRT analog tuning knob',(tx+.21+i*.068,-.229,.984),.021,.018,metal);o.rotation_euler[0]=math.pi/2
for i in range(15):box('CRT speaker slot',(tx-.22+i*.023,-.219,.935),(.011,.007,.025),rubber,.002)
for i in range(14):box('Rear cooling vent',(tx-.25+i*.038,.376,1.29),(.014,.008,.22),rubber,.002)
for loc in [(tx-.265,-.218,1.51),(tx+.265,-.218,1.51)]:
 o=cyl('Cabinet screw',loc,.0035,.002,metal,12);o.rotation_euler[0]=math.pi/2
line('Power cable',[(tx+.20,.35,.81),(tx+.38,.49,.78),(.45,.65,.76),(.60,1.10,.55)],.008,rubber)

# Lamp with a real thin shell, cream interior, and physically located bulb.
cyl('Desk lamp base',(-1.01,-.02,.772),.145,.035,brass)
line('Lamp angled stem',[(-1.01,-.02,.79),(-1.01,.02,1.13),(-.94,.015,1.43)],.012,brass)
bpy.ops.mesh.primitive_cone_add(vertices=64,radius1=.19,radius2=.072,depth=.20,end_fill_type='NOTHING',location=(-.94,.015,1.43));shade=bpy.context.object;shade.name='Brass lamp shade / open thin shell';assign(shade,brass)
shade.data.materials.append(ceramic);s=shade.modifiers.new('Cream enamel inside','SOLIDIFY');s.thickness=.0025;s.material_offset=1;bpy.context.view_layer.objects.active=shade;bpy.ops.object.modifier_apply(modifier=s.name)
torus('Rolled shade lip',(-.94,.015,1.33),.19,.003,brass)
bulbmat=emissive('Warm tungsten filament', (1,.52,.19),4)
bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=.026,location=(-.94,.015,1.365));bulb=bpy.context.object;bulb.name='Lamp luminous bulb';bulb.data.materials.append(bulbmat);excluded.append(bulb)
ld=bpy.data.lights.new('Warm tungsten local light','POINT');ld.energy=42;ld.color=(1,.58,.29);ld.shadow_soft_size=.07;lo=bpy.data.objects.new(ld.name,ld);scene.collection.objects.link(lo);lo.location=(-.94,-.015,1.34)

# Plant, physically curved leaves rather than alpha cards.
cyl('Earthen plant pot',(-1.39,.39,.87),.145,.24,clay,48);torus('Plant pot rolled lip',(-1.39,.39,.99),.145,.011,clay)
soil=mat('Dark potting soil',(.023,.016,.009),.95,noise=.35,scale=180);cyl('Pot soil',(-1.39,.39,.995),.132,.008,soil)
for i in range(15):
 angle=i*2.399;h=random.uniform(.21,.60);r=random.uniform(.18,.35);start=(-1.39,.39,1.0);end=(-1.39+math.cos(angle)*r,.39+math.sin(angle)*r,1.0+h)
 mid=tuple(Vector(start).lerp(Vector(end),.55));line('Plant stem',[start,mid,end],.003,leafmat)
 leaf('Broad sculpted leaf',mid,(end[0]+math.cos(angle)*.17,end[1]+math.sin(angle)*.17,end[2]+.03),.055,leafmat if i%3 else leaflight)

# Actual open cup, coffee and curved handle.
cx,cy=-.73,-.56
verts=[];faces=[];N=48
for r,z in [(.071,.756),(.075,.91),(.065,.91),(.061,.772)]:
 for i in range(N):a=2*math.pi*i/N;verts.append((cx+r*math.cos(a),cy+r*math.sin(a),z))
for k in range(3):
 for i in range(N):j=(i+1)%N;faces.append((k*N+i,k*N+j,(k+1)*N+j,(k+1)*N+i))
me=bpy.data.meshes.new('Cup thick lip topology');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('Ceramic coffee cup',me);scene.collection.objects.link(o)
for p in me.polygons:p.use_smooth=True
assign(o,ceramic);torus('Cup rounded lip',(cx,cy,.91),.070,.005,ceramic)
coffee=mat('Coffee surface',(.022,.010,.005),.13);cyl('Coffee',(cx,cy,.887),.064,.002,coffee)
pts=[(cx-.065-.047*math.sin(t*math.pi),cy,.81+.073*math.cos(t*math.pi)) for t in [i/16 for i in range(17)]];line('Cup ceramic loop handle',pts,.009,ceramic)

# Notebook, pencil, remote and pens on the left. Right-front remains empty for four interactive VHS.
o=box('Closed sketchbook',(-1.13,-.48,.765),(.36,.35,.024),bluepaper,.006);o.rotation_euler[2]=-.08
o=box('Sketchbook pages',(-1.13,-.48,.781),(.34,.33,.012),paper,.002);o.rotation_euler[2]=-.08
line('Pencil on paper',[(-1.29,-.54,.798),(-1.0,-.43,.798)],.004,olive)
cyl('Brass pencil cup',(-1.48,-.20,.827),.049,.15,brass)
for i in range(6):
 x=-1.48+random.uniform(-.026,.026);y=-.20+random.uniform(-.026,.026);line('Standing graphite pencil',[(x,y,.78),(x+random.uniform(-.03,.03),y+.015,.99+random.random()*.055)],.0032,wood if i%2 else black)
o=box('Tactile remote control',(.05,-.56,.781),(.11,.28,.034),black,.009);o.rotation_euler[2]=-.08
for i in range(12):
 x=.025+(i%3)*.027;y=-.65+(i//3)*.038;box('Remote rubber keypad',(x,y,.802),(.017,.023,.006),rubber,.002)
box('Remote red power key',(.025,-.69,.803),(.018,.018,.006),red,.003)
for s in [-1,1]:
 torus('Round reading glasses',(.34+s*.045,-.18,.762),.04,.002,metal)
line('Glasses bridge',[(.329,-.18,.763),(.34,-.171,.766),(.351,-.18,.763)],.002,metal)
for s in [-1,1]:line('Glasses arm',[(.34+s*.085,-.18,.763),(.34+s*.09,.005,.762),(.34+s*.075,.018,.762)],.002,metal)

for i in range(5):
 x=.90+(.035 if i%2 else 0);y=.39;z=.765+i*.042
 cover=[bluepaper,red,olive,warmplastic,bluepaper][i]
 o=box('Stacked archive volume cover',(x,y,z),(.51,.30,.009),cover,.003);o.rotation_euler[2]=(-.025+i*.015)
 box('Stacked archive volume pages',(x,y,z+.017),(.495,.278,.027),pages,.002)
 box('Archive volume spine',(x,y-.145,z+.019),(.51,.015,.038),cover,.003)
 # Unlettered physical label insert: real navigation typography is supplied accessibly in the webpage.
 box('Spine cream paper inset',(x,y-.155,z+.019),(.33,.002,.021),paper,.001)
for i in range(3):
 x=1.36+i*.07;box('Upright archive binder',(x,.45,.96),(.055,.27,.41),[red,olive,bluepaper][i],.004)
 box('Binder cloth inset',(x,.305,.97),(.033,.004,.30),paper,.002)
# A small tactile cassette recorder at the back right.
box('Portable recorder body',(.82,.79,.83),(.31,.15,.16),black,.012)
box('Recorder brushed front',(.82,.707,.84),(.275,.008,.115),metal,.005)
box('Recorder tape window',(.79,.699,.85),(.15,.006,.066),rubber,.006)
for x in [.75,.83]:
 o=torus('Recorder reel well',(x,.693,.85),.018,.003,ceramic,(math.pi/2,0,0))
for i in range(4):box('Recorder top key',(.72+i*.055,.77,.921),(.04,.045,.012),warmplastic,.002)

# Two deliberately independent colour sources, plus a broad soft rainy window fill.
area('Cool rainy window ambient',(0,.90,2.05),(0,0,.85),95,(.40,.57,1),2.5)
area('CRT soft blue bounce',(tx,-.24,1.27),(tx,-.80,.73),7,(.21,.35,1),.45)
area('Gentle camera-side exposure fill',(0,-2.0,2.2),(0,.2,1.0),28,(1,.78,.52),3)

# Actual editable camera and a simple grey-blue view outside only in the native preview.
bpy.ops.object.camera_add(location=(.20,-4.2,2.10));cam=bpy.context.object;cam.name='Archive desk camera';target=Vector((-.1,.05,1.24));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=35;scene.camera=cam
cam.data.dof.use_dof=False
background=box('Preview outside / excluded from GLB',(0,1.48,1.74),(3.14,.02,1.6),mat('Rain night blue outside',(.015,.032,.065),.9),0);static.remove(background);excluded.append(background)
citylightmat=emissive('Distant warm city windows',(.8,.61,.29),.9)
for i in range(38):
 x=random.uniform(-1.50,1.50);z=random.uniform(.99,1.65)
 o=box('Preview distant window',(x,1.44,z),(.012+random.random()*.025,.008,.015+random.random()*.045),citylightmat,.001);static.remove(o);excluded.append(o)

for o in bpy.context.selected_objects:o.select_set(False)
scene['original_assets']='Original procedural bpy modeling; no reference website geometry or texture copied'
scene['screen_contract']=json.dumps({'blenderCenter':[-.25,-.205,1.27],'width':.55,'height':.40,'gltfCenter':[-.25,1.27,.205]})
scene['interactive_vhs_reserved']=json.dumps({'x':[.55,.8,1.05,1.3],'y':-.45,'z':.82})
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'native-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
bpy.ops.render.render(write_still=True)
print('DIRECTORY_NATIVE_PREVIEW_READY',flush=True)

# Single static unique UV atlas, while originals remain individually editable in native file.
copies=[]
for o in static:
 if o.type!='MESH':continue
 c=o.copy();c.data=o.data.copy();scene.collection.objects.link(c);copies.append(c)
for o in bpy.context.selected_objects:o.select_set(False)
for o in copies:o.select_set(True)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();atlas=bpy.context.object;atlas.name='room-static'
for mod in list(atlas.modifiers):
 if mod.type=='WEIGHTED_NORMAL':
  try:bpy.ops.object.modifier_apply(modifier=mod.name)
  except:pass
uv=atlas.data.uv_layers.new(name='BAKE_UV');atlas.data.uv_layers.active=uv;uv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.003,area_weight=.1);bpy.ops.object.mode_set(mode='OBJECT')
for o in static:o.hide_render=True;o.hide_set(True)
im=bpy.data.images.new('Room Cycles radiance / scene-linear RGBA 4K',width=4096,height=4096,alpha=True,float_buffer=True);im.colorspace_settings.name='Linear Rec.709'
for m in atlas.data.materials:
 if not m or not m.use_nodes:continue
 for n in m.node_tree.nodes:n.select=False
 n=m.node_tree.nodes.new('ShaderNodeTexImage');n.name='Cycles radiance bake target';n.image=im;m.node_tree.nodes.active=n;n.select=True
scene.cycles.samples=24
scene.render.bake.use_pass_direct=True;scene.render.bake.use_pass_indirect=True;scene.render.bake.use_pass_color=True;scene.render.bake.margin=12
start=time.time();bpy.ops.object.bake(type='DIFFUSE')
im.filepath_raw=str(OUT/'room-radiance.exr');im.file_format='OPEN_EXR';scene.render.image_settings.file_format='OPEN_EXR';scene.render.image_settings.color_depth='16';im.save_render(str(OUT/'room-radiance.exr'),scene=scene)
print('DIRECTORY_4K_BAKE_READY',time.time()-start,flush=True)

# glTF has only the unique bake UV, not the generated procedural shader inputs.
export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export'
for layer in list(export.data.uv_layers):
 if layer.name!='BAKE_UV':export.data.uv_layers.remove(layer)
export.data.uv_layers.active=export.data.uv_layers[0];export.data.uv_layers[0].active_render=True
placeholder=mat('Radiance shader applied in webpage',(.45,.45,.45),1)
export.data.materials.clear();export.data.materials.append(placeholder)
for p in export.data.polygons:p.material_index=0
for o in bpy.context.selected_objects:o.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_texcoords=True,export_normals=True,export_materials='EXPORT')
export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for o in static:o.hide_render=False;o.hide_set(False)
scene.render.image_settings.file_format='PNG';scene.cycles.samples=40
scene.render.filepath=str(OUT/'native-preview.png')
bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
atlas.data.calc_loop_triangles()
audit={'complete':True,'originalModeling':True,'baked':{'engine':'Cycles CUDA','resolution':[4096,4096],'samples':24,'pass':'DIFFUSE COLOR DIRECT INDIRECT','linearHDR':True,'halfEXR':True,'seconds':time.time()-start},'nativeObjects':len(static),'triangles':len(atlas.data.loop_triangles),'vertices':len(atlas.data.vertices),'screen':{'blenderCenter':[-.25,-.205,1.27],'gltfCenter':[-.25,1.27,.205],'width':.55,'height':.40,'normalGLTF':[0,0,1]},'window':{'gltfZ':-1.05,'width':3.10,'bottomY':.95,'topY':2.55},'vhsReserved':{'gltfX':[.55,.8,1.05,1.3],'gltfZ':.45,'gltfY':.82},'camera':{'gltfPosition':[.20,2.10,4.2],'gltfTarget':[-.1,1.24,-.05],'lensMM':35},'exrUsage':'EXRLoader LinearSRGBColorSpace; glTF V flipped: map.flipY=false; map.repeat.y=-1; map.offset.y=1; MeshBasicMaterial; toneMapped=true','excludedFromStaticGLB':['nav-screen','Lamp luminous bulb','preview outside city lights'],'paths':{'blend':str(NATIVE/'directory-room.blend'),'glb':str(OUT/'room-static.glb'),'exr':str(OUT/'room-radiance.exr'),'preview':str(OUT/'native-preview.png')}}
(OUT/'production.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
print('DIRECTORY_COMPLETE',json.dumps(audit),flush=True)
