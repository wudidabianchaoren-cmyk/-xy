import bpy,math,json,random,time
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v138';O=P/'blender/mythology-v32-138';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True);random.seed(138)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-137/armed-crew-and-ship.blend'))
for ob in list(bpy.context.scene.objects):
 if ob.type in ['LIGHT','CAMERA'] or (ob.name.startswith('V137 warrior') and any(s in ob.name for s in ['cuirass','shoulder leather','leather belt'])) or ('V118 folded garment opening' in ob.name):bpy.data.objects.remove(ob,do_unlink=True)
def mat(name,c,metal=0,rough=.7):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;n=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if n is None:n=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(n.outputs['BSDF'],out.inputs['Surface'])
 n.name='Principled BSDF';n.inputs['Base Color'].default_value=(*c,1);n.inputs['Roughness'].default_value=rough;n.inputs['Metallic'].default_value=metal;return m
bronze=mat('V138 worked pale bronze armor',(.27,.215,.12),.82,.46);edge=mat('V138 burnished bronze rolled edges',(.40,.32,.18),.88,.37);leather=mat('V138 flexible oxhide armor backing',(.045,.027,.016),0,.88);linen=mat('V138 unbleached reinforced linen armor',(.34,.31,.23),0,.94)
def cube(name,c,s,m,bevel=.01):
 bpy.ops.mesh.primitive_cube_add(size=1,location=c);o=bpy.context.object;o.name=name;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if bevel:mod=o.modifiers.new('Small physical worn arris','BEVEL');mod.width=bevel;mod.segments=2;mod=o.modifiers.new('Flat board weighted normals','WEIGHTED_NORMAL')
 return o
def mesh(name,v,f,m):
 me=bpy.data.meshes.new(name);me.from_pydata(v,[],f);me.update();o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o);o.data.materials.append(m);return o
def bounds(o):
 q=[o.matrix_world@Vector(v) for v in o.bound_box];return Vector([min(v[i] for v in q) for i in range(3)]),Vector([max(v[i] for v in q) for i in range(3)])
# A sawn, flat deck instead of cylinders. The photographed grain is aligned along each plank.
wood=[]
for i in range(5):
 m=mat('V138 sawn oak deck tone '+str(i),(.49+i*.018,.43+i*.015,.34+i*.012),0,.83);nodes=m.node_tree.nodes;links=m.node_tree.links;pr=nodes.get('Principled BSDF')
 for kind,socket in [('diff','Base Color'),('rough','Roughness'),('nor_gl','Normal')]:
  tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(P/f'assets/odyssey/wood_planks/wood_planks_{kind}_1k.jpg'),check_existing=True)
  if kind!='diff':tex.image.colorspace_settings.name='Non-Color'
  if kind=='nor_gl':n=nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.22;links.new(tex.outputs['Color'],n.inputs['Color']);links.new(n.outputs['Normal'],pr.inputs[socket])
  else:links.new(tex.outputs['Color'],pr.inputs[socket])
 wood.append(m)
boards=[]
for i,o in enumerate(list(bpy.context.scene.objects)):
 if o.type!='MESH':continue
 if 'shaped foreaft deck board' in o.name:
  lo,hi=bounds(o);name=o.name;bpy.data.objects.remove(o,do_unlink=True);c=(lo+hi)/2;s=hi-lo;s.z=.105;c.z=2.155
  ob=cube('V138 flat sawn '+name,c,s,wood[i%5],.012);uv=ob.data.uv_layers.active
  for poly in ob.data.polygons:
   for li in poly.loop_indices:
    v=ob.data.vertices[ob.data.loops[li].vertex_index].co
    uv.data[li].uv=((v.x+c.x)*.18+.21*(i%4),(v.y+c.y)*.34+.03*(i%7))
  boards.append(ob.name)
 elif 'terracotta provision amphora' in o.name:
  # Cargo no longer intersects the standing helmsman's legs and cape.
  bpy.data.objects.remove(o,do_unlink=True)
for m in bpy.data.materials:
 if not m.use_nodes:continue
 pr=m.node_tree.nodes.get('Principled BSDF')
 if not pr:continue
 if any(s in m.name.lower() for s in ['weathered','timber','bent oak']):
  pr.inputs['Roughness'].default_value=.83
  # Retain true photograph/normal texture but stop bright varnished reflections.
  pr.inputs['Specular IOR Level'].default_value=.22
 if 'V137 hammered' in m.name:pr.inputs['Roughness'].default_value=.47;pr.inputs['Metallic'].default_value=.80
actors=[]
report=json.loads((P/'assets/odyssey/refit-v137/production.json').read_text(encoding='utf-8'))
for k,a in enumerate(report['actors']):
 cx,cy,z=a['position'];hz=a['headHeight'];h=hz-z-.13;row=a['seated'];width=.245 if row else .255;depth=.155 if row else .165
 # Open armpits, formed chest/back plates, a neck cutout and separate shoulder pieces.
 for side in [-1,1]:
  verts=[];rows=9;cols=24
  for j in range(rows):
   t=j/(rows-1);w=width*(.88+.18*math.sin(t*math.pi)-.13*t**5)
   for i in range(cols+1):
    u=-1+2*i/cols;x=u*w
    yy=depth*math.sqrt(max(.08,1-u*u))*(.93+.11*math.sin(t*math.pi))
    muscle=.018*math.exp(-((abs(u)-.4)/.25)**2)*math.sin(t*math.pi)
    neck=.10*max(0,1-abs(u)*2.5)*t**8
    verts.append((cx+x,cy+side*(yy+muscle),z+t*h-neck))
  faces=[(j*(cols+1)+i,j*(cols+1)+i+1,(j+1)*(cols+1)+i+1,(j+1)*(cols+1)+i) for j in range(rows-1) for i in range(cols)]
  ob=mesh(f'V138 actor{k} anatomical '+('front' if side<0 else 'back'),verts,faces,bronze if not row or k%3==0 else linen)
  for p in ob.data.polygons:p.use_smooth=True
  sol=ob.modifiers.new('Real cuirass thickness','SOLIDIFY');sol.thickness=.012
  for sx in [-1,1]:
   strap=cube(f'V138 actor{k} shoulder reinforcement',(cx+sx*width*.67,cy,z+h-.045),(.090,.25,.016),bronze,.006)
 for i in range(12):
  ang=2*math.pi*i/12;strip=cube(f'V138 actor{k} articulated leather skirt {i}',(cx+math.cos(ang)*width*.85,cy+math.sin(ang)*depth*.94,z-.11),(.085,.035,.23),leather,.008);strip.rotation_euler.z=ang+math.pi/2
 belt=cube(f'V138 actor{k} bronze front belt clasp',(cx,cy-depth-.017,z+.025),(.07,.018,.05),edge,.008)
 actors.append({'index':k,'standing':not row,'source':a['source']})
# Correct the old detached oval shoes, and ground the actual anatomical feet on the new deck.
for who,k in [('captain',0),('helmsman',1)]:
 body=bpy.data.objects.get('V112 ship0 '+who+' base003')
 lo,hi=bounds(body);floor=lo.z
 feet=[body.matrix_world@v.co for v in body.data.vertices if (body.matrix_world@v.co).z<floor+.105]
 centers=[min(feet,key=lambda p:p.x).copy(),max(feet,key=lambda p:p.x).copy()]
 for step in range(8):
  groups=[[],[]]
  for v in feet:groups[0 if (v-centers[0]).length_squared<(v-centers[1]).length_squared else 1].append(v)
  centers=[sum(g,Vector())/len(g) if g else centers[i] for i,g in enumerate(groups)]
 dz=2.216-floor
 for ob in list(bpy.context.scene.objects):
  if 'ship0 '+who in ob.name or ob.name.startswith('V137 warrior '+str(k+1)+' ') or ob.name.startswith('V138 actor'+str(k)+' '):
   if 'Leather_closed_sandals' in ob.name:bpy.data.objects.remove(ob,do_unlink=True)
   else:ob.location.z+=dz
 for j,(center,verts) in enumerate(zip(centers,groups)):
  mn=Vector([min(v[i] for v in verts) for i in range(3)]);mx=Vector([max(v[i] for v in verts) for i in range(3)]);center=(mn+mx)/2
  sole=cube(f'V138 {who} attached sandal sole {j}',(center.x,center.y,2.204),(max(.115,mx.x-mn.x),max(.18,mx.y-mn.y),.025),leather,.018)
  cube(f'V138 {who} sandal instep strap {j}',(center.x,center.y,2.26),(max(.115,mx.x-mn.x),.042,.019),leather,.008)
for ob in list(bpy.context.scene.objects):
 if 'Scarlet wool travelling mantle boat' in ob.name:bpy.data.objects.remove(ob,do_unlink=True)
 elif 'Oatmeal woven tunic boat' in ob.name and '.001' in ob.name:
  # The source hem was modeled standing but attached unchanged to a seated actor.
  import bmesh
  bm=bmesh.new();bm.from_mesh(ob.data);inv=ob.matrix_world.inverted();cut=[v for v in bm.verts if (ob.matrix_world@v.co).z<1.08];bmesh.ops.delete(bm,geom=cut,context='VERTS');bm.to_mesh(ob.data);bm.free()
# Both anatomical feet and their attached new sandal soles are inspected independently.
bodyChecks=[]
for who in ['captain','helmsman']:
 feet=[o for o in bpy.context.scene.objects if who in o.name and 'attached sandal sole' in o.name]
 bodyChecks.append({'actor':who,'feet':len(feet),'bounds':[{'name':o.name,'min':list(bounds(o)[0]),'max':list(bounds(o)[1])} for o in feet]})
def export(path):
 bpy.ops.object.select_all(action='DESELECT')
 for o in bpy.context.scene.objects:
  if o.type=='MESH':o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
export(A/'armed-ship.glb')
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=48;sc.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 sc.cycles.device='GPU'
except:sc.cycles.device='CPU'
world=sc.world or bpy.data.worlds.new('Coastal neutral daylight');world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(.50,.58,.65,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.5;sc.world=world
bpy.ops.object.light_add(type='AREA',location=(6,-14,13));key=bpy.context.object;key.data.energy=2400;key.data.shape='DISK';key.data.size=8;key.rotation_euler=(Vector((6,-8,3))-key.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(16,-14,7));cam=bpy.context.object;cam.data.lens=58;cam.rotation_euler=(Vector((9,-8,3))-cam.location).to_track_quat('-Z','Y').to_euler();sc.camera=cam;sc.render.resolution_x=1600;sc.render.resolution_y=1100;sc.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=str(O/'sawn-deck-fitted-crew.blend'));sc.render.filepath=str(O/'helmsman-inspection.png');bpy.ops.render.render(write_still=True)
cam.location=(-15,-13,7);cam.rotation_euler=(Vector((-8,-7.7,3.1))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'captain-inspection.png');bpy.ops.render.render(write_still=True)
(A/'production.json').write_text(json.dumps({'actualBlender':bpy.app.version_string,'device':sc.cycles.device,'actors':actors,'standingFeet':bodyChecks,'flatBoards':len(boards),'cargoRemovedFromFeet':True,'native':str(O/'sawn-deck-fitted-crew.blend')},indent=2),encoding='utf-8');print('V138_SHIP_COMPLETE')
