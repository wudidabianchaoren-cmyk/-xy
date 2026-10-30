"""Reference-led dark armour and overlapping skirt plates. Preserved native input stays read-only."""
import bpy,math,json,bmesh
from pathlib import Path
from mathutils import Vector,Quaternion
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v144';O=P/'blender/mythology-v32-144'
A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-143/sealed-hull-and-fitted-footwear.blend'))
production=json.loads((P/'assets/odyssey/refit-v143/production.json').read_text(encoding='utf-8'))
native=json.loads((P/'assets/odyssey/refit-v141/production.json').read_text(encoding='utf-8'))['actors']
def mat(name,c,metal=0,rough=.8):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1);s=m.node_tree.nodes.get('Principled BSDF');s.inputs['Base Color'].default_value=(*c,1);s.inputs['Metallic'].default_value=metal;s.inputs['Roughness'].default_value=rough;return m
iron=mat('V144 dark patinated armour',(.042,.052,.048),.76,.52)
leather=mat('V144 layered oxhide pteruges',(.028,.022,.017),0,.86)
trim=mat('V144 restrained aged bronze trim',(.16,.12,.058),.78,.57)
cloths=[mat('V144 densely woven charcoal '+str(i),c,0,.96) for i,c in enumerate([(.055,.064,.058),(.085,.075,.052),(.045,.054,.047),(.093,.047,.029)])]
def mesh(name,verts,faces,material,k):
 g=bpy.data.meshes.new(name);g.from_pydata(verts,[],faces);g.update();o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);g.materials.append(material)
 uv=g.uv_layers.new(name='GarmentUV')
 for p in g.polygons:
  p.use_smooth=True
  for li in p.loop_indices:
   v=g.vertices[g.loops[li].vertex_index].co;uv.data[li].uv=(v.x*2,v.z*2)
 o['crewId']=k;o['crewPhase']=k*1.618;o['crewSeated']=native[k]['seated']
 return o
created=0
for k,a in enumerate(native):
 c=Vector(a['corseletCenter']);head=Vector(a['headCenter']);seated=a['seated'];members=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Crew%02d__'%k)]
 # Existing thick breastplates, helmets, greaves and straps remain fitted to the body.
 for o in members:
  low=o.name.lower()
  for slot in o.material_slots:
   n=slot.material.name.lower() if slot.material else ''
   if any(t in n for t in ['worked bronze cuirass','bronze bowl','helmet foundation','formed armor']):slot.material=iron
   elif any(t in n for t in ['rolled pale bronze','armor edges']):slot.material=trim
   elif 'wool' in n or 'oatmeal' in n or 'woven tunic' in n or 'tunic dye' in n:slot.material=cloths[k%4]
  if 'formed corselet' in low or 'shin guard' in low or 'greave' in low:
   o.data.materials.clear();o.data.materials.append(iron)
 # Clip only the obsolete lower tunic under the skirt; it must not poke through the lappets.
 for o in members:
  if any(t in o.name.lower() for t in ['tunic','pleated_woven']) and not any(t in o.name.lower() for t in ['mantle','cape','cloak']):
   bm=bmesh.new();bm.from_mesh(o.data);inv=o.matrix_world.inverted();plane=inv@Vector((c.x,c.y,c.z+.045));no=(o.matrix_world.to_3x3().transposed()@Vector((0,0,1))).normalized()
   bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),plane_co=plane,plane_no=no,clear_inner=True,clear_outer=False);bm.to_mesh(o.data);bm.free()
 # The captain's raised signal arm settles into a relaxed outward/downward gesture.
 if False:
  bodies=[o for o in members if 'base003' in o.name and not any(x in o.name for x in ['base003_','toenail'])]
  high=[o.matrix_world@v.co for o in bodies for v in o.data.vertices if (o.matrix_world@v.co).z>head.z+.22]
  if high:
   wrist=sum(high,Vector())/len(high);axis=wrist-head;axis.z=0;axis.normalize();shoulder=Vector((head.x,head.y,head.z-.23))+axis*.19
   current=(wrist-shoulder).normalized();desired=(axis*.43+Vector((0,0,-.65))).normalized();turn=current.rotation_difference(desired)
   for o in members:
    if not ('base003' in o.name or 'tunic' in o.name.lower()):continue
    if o.data.users>1:o.data=o.data.copy()
    inv=o.matrix_world.inverted()
    for v in o.data.vertices:
     q=o.matrix_world@v.co;offset=q-head;along=offset.x*axis.x+offset.y*axis.y;perp=abs(offset.x*axis.y-offset.y*axis.x)
     w=max(0,min(1,(along-.15)/.13))*max(0,min(1,(q.z-c.z-.02)/.16)) if perp<.19 else 0
     if w:v.co=inv@(shoulder+Quaternion().slerp(turn,w)@(q-shoulder))
    o.data.update()
 # Overlapping broad leather lappets replace the visual reading of shorts.
 forward=Vector((1,0,0)) if seated else Vector((0,-1,0));right=Vector((-forward.y,forward.x,0))
 count=18
 for j in range(count):
  theta=2*math.pi*j/count;half=math.pi/count*.92;vs=[];rows=6;cols=5
  front=max(0,math.cos(theta));length=(.24+.03*front) if seated else (.49+.018*math.sin(j*2.4))
  for row in range(rows):
   t=row/(rows-1);z=c.z+.015-length*t
   # A seated apron drapes across the upper thighs, staying above the bench.
   shift=forward*(.24*t if seated else .015*t)
   for col in range(cols):
    an=theta+(col/(cols-1)*2-1)*half
    w=(.235 if seated else .255)+(.065 if seated else .070)*t
    d=(.195 if seated else .205)+.045*t
    q=c+right*(math.sin(an)*w)+forward*(math.cos(an)*d)+shift;q.z=z+.006*math.sin(t*math.pi)*math.cos(an*5)
    vs.append(tuple(q))
  fs=[(row*cols+i,row*cols+i+1,(row+1)*cols+i+1,(row+1)*cols+i) for row in range(rows-1) for i in range(cols-1)]
  o=mesh('Crew%02d__V144 overlapping leather skirt plate %02d'%(k,j),vs,fs,leather,k);sol=o.modifiers.new('Real layered hide thickness','SOLIDIFY');sol.thickness=.009;created+=1
 # A small crest and cheek guards replace the pale basket reading of the old cap.
 for o in members:
  if any(t in o.name.lower() for t in ['helmet','forehead','cheek','brow_guard','headband']):o.data.materials.clear();o.data.materials.append(iron)
 vs=[];N=22
 for side in [-1,1]:
  for j in range(N+1):
   t=j/N
   for level in [0,1]:
    q=head.copy();q.y+=(t-.5)*.29;q.x+=side*.014;q.z+=.12+.05*math.sin(t*math.pi)+level*.14*math.sin(t*math.pi);vs.append(tuple(q))
 stride=(N+1)*2;fs=[]
 for j in range(N):
  a0=j*2;fs.extend([(a0,a0+2,a0+3,a0+1),(stride+a0,stride+a0+1,stride+a0+3,stride+a0+2),(a0+1,a0+3,stride+a0+3,stride+a0+1)])
 mesh('Crew%02d__V144 attached crested helmet'%k,vs,fs,cloths[3] if k<2 else iron,k)
 # A narrow second overlapping tier makes the waist-to-armour connection continuous.
 vs=[];N=48
 for row in range(2):
  for j in range(N+1):
   an=j/N*math.tau;q=c+right*(math.sin(an)*.255)+forward*(math.cos(an)*.210);q.z=c.z+.065-row*.11;vs.append(tuple(q))
 fs=[(j,j+1,N+2+j,N+1+j) for j in range(N)]
 mesh('Crew%02d__V144 continuous armour waist binding'%k,vs,fs,leather,k)
 # Shoulder layers have real thickness and stay outside the original breastplate.
 for side in []:
  vs=[];rows=5;cols=7;center=c.lerp(head,.61)+right*(side*.205)
  for row in range(rows):
   t=row/(rows-1)
   for col in range(cols):
    f=col/(cols-1)*2-1;q=center+forward*(f*.103)+right*(side*t*.095);q.z=center.z+.055-.09*t+.018*(1-f*f);vs.append(tuple(q))
  fs=[(j*cols+i,j*cols+i+1,(j+1)*cols+i+1,(j+1)*cols+i) for j in range(rows-1) for i in range(cols-1)]
  o=mesh('Crew%02d__V144 layered shoulder guard %d'%(k,side),vs,fs,iron,k);o.modifiers.new('Shoulder plate thickness','SOLIDIFY').thickness=.006

# Remove hidden historical gold glints from under the new iron plates.
for m in bpy.data.materials:
 if not m.use_nodes:continue
 p=m.node_tree.nodes.get('Principled BSDF')
 if p and any(t in m.name.lower() for t in ['bronze bowl','helmet','bracer']):
  p.inputs['Base Color'].default_value=(.055,.061,.049,1);p.inputs['Metallic'].default_value=.72;p.inputs['Roughness'].default_value=.58

sc=bpy.context.scene;bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=str(O/'dark-armour-layered-skirts.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in sc.objects:
 if ob.type=='MESH':ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'armed-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_image_format='JPEG',export_jpeg_quality=85)
production.update(version=144,costume='reference-led dark cuirass / layered leather skirt armour / shoulder guards / covered shoes and greaves',addedSkirtPlates=created,originalPeople=14,glbBytes=(A/'armed-ship.glb').stat().st_size)
(A/'production.json').write_text(json.dumps(production,ensure_ascii=False,indent=2),encoding='utf-8')
sc.render.engine='CYCLES';sc.cycles.samples=24;sc.cycles.use_denoising=True;sc.render.resolution_x=1400;sc.render.resolution_y=1000;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU';cam=sc.camera;cam.location=(-11,-11.7,4.8);cam.data.lens=56;cam.rotation_euler=(Vector((-8.82,-7.66,3.1))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'costume-close.png');bpy.ops.render.render(write_still=True)
print('V144 costume ready',created,production['glbBytes'])
