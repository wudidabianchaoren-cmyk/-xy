import bpy,math,random,json,time
from pathlib import Path
from mathutils import Vector,noise
R=Path(__file__).resolve().parents[1];O=R/'blender/mythology-v32-133';O.mkdir(parents=True,exist_ok=True);A=R/'assets/odyssey/compact-v133';A.mkdir(parents=True,exist_ok=True)
rng=random.Random(133071);started=time.time();bpy.ops.wm.read_factory_settings(use_empty=True);sc=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences
try:prefs.compute_device_type='OPTIX';prefs.get_devices()
except:prefs.compute_device_type='CUDA';prefs.get_devices()
if not any(d.type=='OPTIX' for d in prefs.devices):prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type in {'OPTIX','CUDA'}
def mat(name,color,rough=.8):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;return m
def photo(name,folder,diff,normal,rough,tile=.4):
 m=mat(name,(.7,.67,.58));n=m.node_tree.nodes;l=m.node_tree.links;p=n.get('Principled BSDF');uv=n.new('ShaderNodeTexCoord');mapping=n.new('ShaderNodeVectorMath');mapping.operation='SCALE';mapping.inputs[3].default_value=tile;l.new(uv.outputs['Generated'],mapping.inputs[0])
 for kind,file in [('Base Color',diff),('Normal',normal),('Roughness',rough)]:
  tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(folder/file),check_existing=True);tex.image.colorspace_settings.name='sRGB' if kind=='Base Color' else 'Non-Color';l.new(mapping.outputs[0],tex.inputs[0])
  if kind=='Normal':b=n.new('ShaderNodeNormalMap');b.inputs['Strength'].default_value=.55;l.new(tex.outputs['Color'],b.inputs['Color']);l.new(b.outputs[0],p.inputs['Normal'])
  else:l.new(tex.outputs['Color'],p.inputs[kind])
 return m
rock=photo('V133 pale weathered limestone',R/'assets/odyssey/pbr-v118/marble_rock_03','marble_rock_03_diff_2k.jpg','marble_rock_03_nor_gl_2k.jpg','marble_rock_03_rough_2k.jpg',8)
sand=photo('V133 fine ochre sand',R/'assets/odyssey/pbr-v106/sand_01','diff.jpg','nor_gl.jpg','rough.jpg',12)
# Import just the retained ship and its actual posed crew from the previous native export.
bpy.ops.import_scene.gltf(filepath=str(R/'blender/mythology-v32-118/fleet-v118.glb'))
ship=bpy.data.objects['V112_SHIP_0'];keep={ship,*ship.children_recursive}
for ob in list(sc.objects):
 if ob not in keep:bpy.data.objects.remove(ob,do_unlink=True)
ship.location=(1,-8,.05);ship.rotation_euler=(0,0,math.radians(-12))
bpy.context.view_layer.update();crew=sum('captain' in o.name.lower() or 'rower' in o.name.lower() for o in ship.children_recursive)
for ob in ship.children_recursive:
 if ob.type=='MESH':
  for m in ob.data.materials:
   if not m or not m.use_nodes:continue
   p=m.node_tree.nodes.get('Principled BSDF')
   if p and 'skin' in m.name.lower():p.inputs['Roughness'].default_value=.5
def height(x,y):
 dx=x+7;dy=y-39;ang=math.atan2(dy/28,dx/36);rad=math.sqrt((dx/36)**2+(dy/28)**2);edge=1+.07*math.sin(ang*3+.4)+.04*math.sin(ang*7)
 inward=edge-rad
 if inward<=0:return max(-5,inward*18)
 hills=12*math.exp(-((x+18)/17)**2-((y-43)/18)**2)+8*math.exp(-((x-12)/15)**2-((y-50)/13)**2)
 h=inward**.62*12+hills
 bay=math.exp(-((x-9)/15)**2)*max(0,1-(y-10)/24)
 h*=max(.10,1-.88*bay)
 detail=noise.fractal(Vector((x*.19,y*.19,2.7)),.7,2,3)*.72
 return h+detail*min(1,inward*5)
N=116;verts=[];faces=[];colors=[]
for j in range(N+1):
 y=-4+j/N*90
 for i in range(N+1):
  x=-56+i/N*103;z=height(x,y);verts.append((x,y,z));slope=math.hypot(height(x+.35,y)-height(x-.35,y),height(x,y+.35)-height(x,y-.35))/.7
  if z<2.8:c=(.82,.75,.57,1)
  elif slope>.9 or z>23:c=(.75,.73,.65,1)
  else:c=(.32,.36,.20,1)
  colors.append(c)
for j in range(N):
 for i in range(N):a=j*(N+1)+i;faces.append((a,a+1,a+N+2,a+N+1))
me=bpy.data.meshes.new('V133 continuous bay strata');me.from_pydata(verts,[],faces);me.update();land=bpy.data.objects.new('V133_ISLAND',me);sc.collection.objects.link(land);me.materials.append(rock);me.materials.append(sand)
attribute=me.color_attributes.new(name='Biome',type='FLOAT_COLOR',domain='POINT')
for i,c in enumerate(colors):attribute.data[i].color=c
uv=me.uv_layers.new(name='metres')
for p in me.polygons:
 p.use_smooth=True;z=p.center.z
 for li in p.loop_indices:
  co=me.vertices[me.loops[li].vertex_index].co;uv.data[li].uv=(co.x*.12,co.y*.12)
 p.material_index=1 if sum(me.vertices[v].co.z for v in p.vertices)/len(p.vertices)<3 else 0
# Hard ridged exposed rock shelves break the smooth terrain silhouette.
rockobjects=[]
for i in range(38):
 a=rng.uniform(-math.pi,math.pi);rad=rng.uniform(.80,1.02);x=-7+math.cos(a)*35*rad;y=39+math.sin(a)*27*rad;z=height(x,y)
 if y<24 and x>0:continue
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=1,location=(x,y,max(-.3,z-.5)));o=bpy.context.object;o.name='V133 cliff buttress %02d'%i;o.scale=(rng.uniform(2,4.2),rng.uniform(1.8,3),rng.uniform(2.4,5.6));o.rotation_euler=(rng.uniform(-.25,.25),rng.uniform(-.2,.2),a);o.data.materials.append(rock)
 for v in o.data.vertices:v.co*=1+noise.noise_vector(v.co*2.1).x*.16
 bevel=o.modifiers.new('Weathered broken edges','BEVEL');bevel.width=.12;bevel.segments=2
 o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL');rockobjects.append(o)
# Append actual tree prototypes with full leaves, keeping a small woodland rather than a continent.
with bpy.data.libraries.load(str(R/'blender/mythology-v32-118/05-final-mediterranean-world.blend'),link=False) as (source,dest):dest.objects=[n for n in source.objects if n in ['V117 tree 000 part0','V117 tree 000 part1','V117 tree 000 part2']]
protos=[o for o in dest.objects if o];forest=[];treecount=0;shrubcount=0
for i in range(150):
 x=rng.uniform(-35,23);y=rng.uniform(20,64);z=height(x,y);slope=math.hypot(height(x+.5,y)-height(x-.5,y),height(x,y+.5)-height(x,y-.5))
 if z<5 or z>23 or slope>1.4:continue
 if z>10 and treecount<34 and rng.random()<.55:scale=rng.uniform(5.5,8.3);treecount+=1;kind='tree'
 else:scale=rng.uniform(1.1,2.7);shrubcount+=1;kind='shrub'
 a=rng.uniform(0,math.tau)
 for src in protos:
  o=bpy.data.objects.new('V133 '+kind+' %03d '%i+src.name.split()[-1],src.data);sc.collection.objects.link(o);o.location=(x,y,z-.12);o.scale=(scale,scale,scale);o.rotation_euler[2]=a;forest.append(o)
grassmat=mat('V133 dry littoral grass',(.26,.29,.10));grassverts=[];grassfaces=[]
for i in range(950):
 x=rng.uniform(-39,30);y=rng.uniform(11,67);z=height(x,y)
 if z<2.8 or z>14:continue
 slope=abs(height(x+.4,y)-height(x-.4,y))+abs(height(x,y+.4)-height(x,y-.4))
 if slope>1:continue
 for j in range(5):
  a=rng.uniform(0,math.tau);h=rng.uniform(.13,.40);w=.026;idx=len(grassverts);grassverts.extend([(x-w*math.cos(a),y-w*math.sin(a),z-.02),(x+w*math.cos(a),y+w*math.sin(a),z-.02),(x+.12*math.sin(a),y+.12*math.cos(a),z+h)]);grassfaces.append((idx,idx+1,idx+2))
gm=bpy.data.meshes.new('V133 coastal tussocks');gm.from_pydata(grassverts,[],grassfaces);gm.materials.append(grassmat);grass=bpy.data.objects.new('V133 elevation-limited coastal grasses',gm);sc.collection.objects.link(grass)
for o in protos:
 if o.name not in sc.objects:pass
# Export before adding the native ocean; web uses the same editable geometry with its own moving sea.
def export(name,objects):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:
  if o.type=='MESH':o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(A/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_attributes=True,export_cameras=False,export_lights=False)
export('hero-ship.glb',list(ship.children_recursive))
export('island.glb',[land,*rockobjects,grass])
# Save only prototype geometries and placement matrices, so the web draws vegetation with instancing.
placements=[]
for o in forest:placements.append({'name':o.name,'prototype':protos.index(next(p for p in protos if p.data==o.data)),'position':[o.location.x,o.location.z,-o.location.y],'scale':list(o.scale),'angle':-o.rotation_euler.z})
prototypecopies=[]
for i,src in enumerate(protos):
 o=bpy.data.objects.new('V133 prototype '+str(i),src.data);sc.collection.objects.link(o);prototypecopies.append(o)
export('vegetation.glb',prototypecopies)
for o in prototypecopies:bpy.data.objects.remove(o,do_unlink=True)
(A/'vegetation.json').write_text(json.dumps(placements),encoding='utf-8')
# Real GPU path tracing of this exact compact world.
watermat=mat('V133 sea / native path-traced surface',(.015,.12,.14),.22);p=watermat.node_tree.nodes.get('Principled BSDF');p.inputs['Metallic'].default_value=.15;p.inputs['IOR'].default_value=1.333
n=watermat.node_tree.nodes;l=watermat.node_tree.links;tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=2.2;tex.inputs['Detail'].default_value=3;bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.28;bump.inputs['Distance'].default_value=.12;l.new(tex.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal'])
bpy.ops.mesh.primitive_grid_add(x_subdivisions=180,y_subdivisions=180,size=12000,location=(0,0,-.15));water=bpy.context.object;water.name='V133 ocean';water.data.materials.append(watermat)
for v in water.data.vertices:v.co.z=.075*math.sin(v.co.x*.24+v.co.y*.16)+.045*math.sin(v.co.y*.39-v.co.x*.11)
for face in water.data.polygons:face.use_smooth=True
world=bpy.data.worlds.new('V133 clear maritime sky');sc.world=world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(.33,.48,.62,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.65
bpy.ops.object.light_add(type='SUN',location=(-40,-45,75));sun=bpy.context.object;sun.name='V133 warm coastal sun';sun.data.energy=3;sun.data.angle=.09;sun.rotation_euler=(math.radians(28),math.radians(-28),math.radians(-35));sun.data.color=(1,.84,.65)
bpy.ops.object.camera_add(location=(68,-80,48));camera=bpy.context.object;camera.rotation_euler=(Vector((-4,23,8))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=44;sc.camera=camera
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=96;sc.cycles.use_denoising=True;sc.cycles.adaptive_threshold=.03;sc.cycles.max_bounces=7;sc.render.resolution_x=1920;sc.render.resolution_y=1080;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.render.filepath=str(O/'cycles-compact-1920.png');sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast'
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove.blend'))
report={'scopeMetres':[103,90],'trees':treecount,'shrubs':shrubcount,'grassTriangles':len(grassfaces),'crewParts':crew,'giant':False,'realGPU':[{'name':d.name,'type':d.type,'use':d.use} for d in prefs.devices],'native':'compact-cove.blend','productionSeconds':time.time()-started}
(A/'production.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print('V133_NATIVE_EXPORTED',json.dumps(report),flush=True)
if '--no-render' not in __import__('sys').argv:
 t=time.time();bpy.ops.render.render(write_still=True);report['renderSeconds']=time.time()-t;report['actualCyclesRender']=True;(O/'render.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print('V133_RENDER_COMPLETE',json.dumps(report),flush=True)
