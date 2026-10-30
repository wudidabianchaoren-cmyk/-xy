import bpy,math,json,time
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v137';O=P/'blender/mythology-v32-137';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v133/hero-ship.glb'))
def material(name,color,metal=0,rough=.5):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough;return m
bronze=material('V137 hammered warm bronze armor',(.34,.235,.105),.88,.30)
rim=material('V137 worn armor edges',(.48,.34,.16),.92,.25)
leather=material('V137 dark leather backing',(.055,.027,.016),0,.75)
wood=material('V137 ash spear shafts',(.19,.105,.045),0,.62)
def mesh(name,vertices,faces,mat):
 me=bpy.data.meshes.new(name);me.from_pydata(vertices,[],faces);me.update();ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.data.materials.append(mat)
 for p in me.polygons:p.use_smooth=True
 return ob
def uvball(name,pos,scale,mat,segments=24,rings=12):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=pos);ob=bpy.context.object;ob.name=name;ob.scale=scale;ob.data.materials.append(mat)
 for f in ob.data.polygons:f.use_smooth=True
 return ob
def tube(name,a,b,r,mat):
 a,b=Vector(a),Vector(b);bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=(b-a).length,location=(a+b)/2);o=bpy.context.object;o.name=name;o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();o.data.materials.append(mat);return o
def shell(name,cx,cy,z,radius,height,mat,yaw=0):
 verts=[];sections=[(0,.84),(.10,1),(.54,1.05),(.84,.92),(1,.72)]
 for h,s in sections:
  for j in range(48):
   a=2*math.pi*j/48;x=math.cos(a)*radius*s;y=math.sin(a)*radius*.66*s
   verts.append((cx+x*math.cos(yaw)-y*math.sin(yaw),cy+x*math.sin(yaw)+y*math.cos(yaw),z+h*height))
 faces=[(k*48+j,k*48+(j+1)%48,(k+1)*48+(j+1)%48,(k+1)*48+j) for k in range(4) for j in range(48)]
 o=mesh(name,verts,faces,mat);mod=o.modifiers.new('Forged plate thickness','SOLIDIFY');mod.thickness=.009;bev=o.modifiers.new('Rounded forged edges','BEVEL');bev.width=.004;bev.segments=2;return o
def helmet(name,cx,cy,z,r=.145,yaw=0):
 # Open-faced conical bronze bowl and two protective cheek pieces; no medieval visor.
 verts=[]
 for k in range(13):
  a=(k/12)*math.pi*.49;rr=r*math.cos(a)
  for j in range(40):
   th=j/40*math.pi*2;verts.append((cx+rr*math.cos(th),cy+rr*.9*math.sin(th),z+r*math.sin(a)*1.22))
 faces=[(k*40+j,k*40+(j+1)%40,(k+1)*40+(j+1)%40,(k+1)*40+j) for k in range(12) for j in range(40)]
 ob=mesh(name+' bronze bowl',verts,faces,bronze);sol=ob.modifiers.new('Bronze bowl thickness','SOLIDIFY');sol.thickness=.006
 for side in [-1,1]:
  x=cx+side*r*.89
  mesh(name+' cheek guard '+str(side),[(x,cy-.045,z+.015),(x,cy+.065,z+.01),(x*.999+cx*.001,cy+.045,z-r*.72),(x,cy-.015,z-r*.88)],[(0,1,2,3)],rim)
  uvball(name+' cheek rivet '+str(side),(x,cy+.015,z+.008),(.009,.009,.009),rim,12,6)
for ob in list(bpy.context.scene.objects):
 if ob.type=='MESH' and any(s in ob.name for s in ['V117 weathered','bent oak']):
  for m in ob.data.materials:
   if m and m.use_nodes:
    pr=m.node_tree.nodes.get('Principled BSDF')
    if pr:pr.inputs['Roughness'].default_value=.62
actors=[]
for ob in list(bpy.context.scene.objects):
 if ob.type!='MESH':continue
 rower='Human.body' in ob.name
 principal='short-sleeve' in ob.name
 if not rower and not principal:continue
 q=[ob.matrix_world@Vector(v) for v in ob.bound_box];mn=Vector([min(v[i] for v in q) for i in range(3)]);mx=Vector([max(v[i] for v in q) for i in range(3)]);c=(mn+mx)/2
 if rower:
  suffix=ob.name.split('Human.body ',1)[1]
  hair=bpy.data.objects.get('V112 Human.short01 '+suffix)
  belt=bpy.data.objects.get('V112 Brown leather sandals and belt '+suffix+'.002')
 else:
  prefix=ob.name.split(' Anatomically_',1)[0]
  hair=bpy.data.objects.get(prefix+' Humanshort01')
  belt=bpy.data.objects.get(prefix+' Leather_waist_belt')
 def bounds(obj):
  pts=[obj.matrix_world@Vector(v) for v in obj.bound_box]
  return Vector([min(v[i] for v in pts) for i in range(3)]),Vector([max(v[i] for v in pts) for i in range(3)])
 hm,hx=bounds(hair);bm,bx=bounds(belt)
 # Fit to the actual head and waist; a raised arm is not the top of the head.
 c=(bm+bx)/2;hc=(hm+hx)/2;cz=c.z+.025;h=max(.25,hm.z-cz-.025)
 rad=max(bx.x-bm.x,bx.y-bm.y)*.57;hz=hm.z+(hx.z-hm.z)*.44
 label='V137 warrior '+str(len(actors)+1)
 shell(label+' fitted bronze cuirass',c.x,c.y,cz,rad,h,bronze)
 shell(label+' leather belt',c.x,c.y,cz+.01,rad*1.015,.055,leather)
 helmet(label,hc.x,hc.y,hz,max(hx.x-hm.x,hx.y-hm.y)*.60)
 for side in [-1,1]:
  tube(label+' shoulder leather strap '+str(side),(c.x+side*rad*.58,c.y-.10,cz+h*.73),(c.x+side*rad*.58,c.y+.10,cz+h*.91),.021,leather)
 actors.append({'source':ob.name,'position':[c.x,c.y,cz],'headHeight':hz,'seated':rower})
# Shields and weapons are stowed on the gunwale so the seated oarsmen can still row.
for i,x in enumerate([-5,-1,3,7]):
 y=-9.38;z=1.72
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=12,location=(x,y,z));o=bpy.context.object;o.name='V137 stowed round hide shield '+str(i);o.scale=(.39,.075,.39);o.data.materials.append(leather)
 bpy.ops.mesh.primitive_torus_add(major_segments=40,minor_segments=8,location=(x,y-.04,z),major_radius=.375,minor_radius=.018,rotation=(math.pi/2,0,0));bpy.context.object.name='V137 shield bronze rim';bpy.context.object.data.materials.append(bronze)
 uvball('V137 shield boss',(x,y-.10,z),(.08,.045,.08),bronze)
for i,x in enumerate([-8.4,9.5]):
 y=-7.35;z=2.7;tube('V137 stowed ash spear '+str(i),(x,y,z),(x+.08,y, z+1.65),.014,wood)
 mesh('V137 leaf shaped bronze spearhead '+str(i),[(x+.08,y-.015,z+1.62),(x+.135,y,z+1.74),(x+.09,y,z+1.94),(x+.035,y,z+1.74),(x+.08,y+.015,z+1.62)],[(0,1,2),(0,2,3),(4,2,1),(4,3,2)],bronze)
 tube('V137 leader sheathed sword '+str(i),(x-.27,y,z+.15),(x-.23,y,z-.42),.033,leather);tube('V137 sword wooden grip '+str(i),(x-.28,y,z+.16),(x-.28,y,z+.32),.021,wood)
model=list(bpy.context.scene.objects)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(A/'armed-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_texcoords=True,export_normals=True,export_materials='EXPORT')
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=40;sc.cycles.use_denoising=True
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 sc.cycles.device='GPU'
except:sc.cycles.device='CPU'
world=bpy.data.worlds.new('V137 neutral coastal sky');world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(.43,.53,.61,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.4;sc.world=world
bpy.ops.object.light_add(type='AREA',location=(-5,-13,13));key=bpy.context.object;key.name='Large warm daylight';key.data.energy=2100;key.data.shape='DISK';key.data.size=9;key.rotation_euler=(Vector((0,-8,2))-key.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(-16,-17,8));cam=bpy.context.object;cam.name='V137 fitted armor and ship inspection';cam.rotation_euler=(Vector((-6,-8,2.7))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=43;sc.camera=cam
sc.render.resolution_x=1600;sc.render.resolution_y=1000;sc.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=str(O/'armed-crew-and-ship.blend'))
sc.render.filepath=str(O/'crew-material-inspection.png');started=time.time();bpy.ops.render.render(write_still=True)
report={'actualBlender':bpy.app.version_string,'device':sc.cycles.device,'actors':actors,'renderSeconds':time.time()-started,'glb':str(A/'armed-ship.glb'),'native':str(O/'armed-crew-and-ship.blend'),'references':['https://www.odysseymovie.com/','https://camu.gr/en/item/mykinaika-chalkina-opla/'],'interpretation':'Ancient Aegean-inspired bronze and leather equipment; original anatomical seated/standing actors retained, not a claimed film-accurate costume reconstruction.'}
(A/'production.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print('V137_NATIVE_REFIT_COMPLETE')
