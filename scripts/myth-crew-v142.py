"""Actual local Blender refit. Original scene is read-only; output a new native and web asset."""
import bpy,math,json,random,re,bmesh
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v142';O=P/'blender/mythology-v32-142';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-141/aegean-crew-and-ship.blend'))
random.seed(142)
def mat(name,c,metal=0,rough=.7):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1);pr=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if pr is None:
  pr=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(pr.outputs['BSDF'],out.inputs['Surface'])
 pr.name='Principled BSDF';pr.inputs['Base Color'].default_value=(*c,1);pr.inputs['Metallic'].default_value=metal;pr.inputs['Roughness'].default_value=rough;return m
bronze=mat('V142 worked bronze cuirass',(.25,.16,.065),.88,.46);edge=mat('V142 rolled pale bronze edges',(.43,.30,.135),.91,.33);hide=mat('V142 oiled oxhide binding and shoe',(.034,.017,.009),0,.83);sole=mat('V142 dark layered leather sole',(.022,.014,.009),0,.94);linen=mat('V142 quilted flax corselet',(.43,.385,.29),0,.94)
cloth=[mat('V142 wool '+str(i),c,0,.94) for i,c in enumerate([(.16,.045,.028),(.27,.25,.185),(.14,.18,.16),(.30,.23,.13)])]
for m,strength in [(bronze,.08),(hide,.13),(linen,.16)]:
 im=bpy.data.images.new(m.name+' roughness',256,256);rng=np.random.default_rng(142);n=rng.random((256,256)).astype(np.float32)
 for _ in range(7):n=(n+np.roll(n,1,0)+np.roll(n,-1,0)+np.roll(n,1,1)+np.roll(n,-1,1))/5
 n=(n-n.min())/(n.max()-n.min());v=np.ones((256,256,4),np.float32);v[:,:,:3]=(m.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value+(n-.5)*strength)[:,:,None];im.pixels.foreach_set(v.ravel());im.filepath_raw=str(A/(m.name.replace(' ','-')+'-rough.png'));im.file_format='PNG';im.save();im.colorspace_settings.name='Non-Color';tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im;m.node_tree.links.new(tex.outputs['Color'],m.node_tree.nodes['Principled BSDF'].inputs['Roughness'])
def mesh(name,v,f,m):
 g=bpy.data.meshes.new(name);g.from_pydata(v,[],f);g.update();o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);o.data.materials.append(m)
 uv=g.uv_layers.new(name='MaterialUV');lo=Vector([min(p[i] for p in v) for i in range(3)]);hi=Vector([max(p[i] for p in v) for i in range(3)]);axes=sorted(range(3),key=lambda i:hi[i]-lo[i],reverse=True)[:2]
 for p in g.polygons:
  p.use_smooth=True
  for li in p.loop_indices:
   co=g.vertices[g.loops[li].vertex_index].co;uv.data[li].uv=tuple((co[i]-lo[i])/max(.0001,hi[i]-lo[i]) for i in axes)
 return o
def bounds(o):
 q=[o.matrix_world@Vector(v) for v in o.bound_box];return Vector([min(v[i] for v in q) for i in range(3)]),Vector([max(v[i] for v in q) for i in range(3)])
def tube(name,pts,r,m):
 g=bpy.data.curves.new(name,'CURVE');g.dimensions='3D';g.bevel_depth=r;g.bevel_resolution=2;s=g.splines.new('POLY');s.points.add(len(pts)-1)
 for p,v in zip(s.points,pts):p.co=(*v,1)
 o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);o.data.materials.append(m);bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH');return o
def stud(name,p,m,r=.006):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=10,ring_count=6,radius=r,location=p);o=bpy.context.object;o.name=name;o.data.materials.append(m);return o
old=json.loads((P/'assets/odyssey/refit-v141/production.json').read_text());source=json.loads((P/'assets/odyssey/refit-v137/production.json').read_text())['actors'];actors=[]
for o in list(bpy.context.scene.objects):
 if o.name.startswith('V141 crew') and any(k in o.name for k in ['fitted rigid','folded plate','load bearing','yoke rivet','closed hide','sewn sole','fitted bronze greave','shin leather']):bpy.data.objects.remove(o,do_unlink=True)
for k,(a,src) in enumerate(zip(old['actors'],source)):
 c=Vector(a['corseletCenter']);head=Vector(a['headCenter']);seated=a['seated'];name='Crew%02d__'%k;created=[]
 bodyName=src['source'] if seated else src['source'].split(' Anatomically_',1)[0]+' base003';body=bpy.data.objects[bodyName];prefix=src['source'].split(' Anatomically_',1)[0];suffix=src['source'].split('Human.body ',1)[1] if seated else ''
 clasp=bpy.data.objects.get(prefix+' Bronze_belt_clasp') if not seated else None
 if clasp:
  lo,hi=bounds(clasp);forward=(lo+hi)/2-c;forward.z=0;forward.normalize()
 else:forward=Vector((1,0,0))
 right=Vector((-forward.y,forward.x,0));z0=c.z+.025;z1=head.z-.245;H=z1-z0;rows=20;cols=64;verts=[]
 shirt=next((o for o in bpy.context.scene.objects if o.type=='MESH' and ('short-sleeve_linen_tunic' in o.name if not seated else 'Oatmeal woven tunic' in o.name) and (o.name.startswith(prefix+' ') if not seated else suffix in o.name)),body)
 shirtTree=BVHTree.FromPolygons([shirt.matrix_world@v.co for v in shirt.data.vertices],[list(p.vertices) for p in shirt.data.polygons])
 # Anatomical waist, rib-cage and collar cut. Bronze has real edge thickness.
 for j in range(rows):
  t=j/(rows-1);center=c.lerp(head,t*.35);waist=.186 if not seated else .146;chest=.229 if not seated else .172
  halfWidth=waist+(chest-waist)*math.sin(t*math.pi*.82);depth=(.151 if not seated else .139)+.015*math.sin(t*math.pi)
  for i in range(cols+1):
   ang=i/cols*math.pi*2;side=math.sin(ang);front=math.cos(ang)
   armCut=.10*abs(side)**8*t**5;neckCut=.047*max(front,0)**6*t**7
   raised=.012*math.sin(t*math.pi)*max(front,0)*(1-.6*abs(side))
   origin=Vector((center.x,center.y,z0+H*t-armCut-neckCut));direction=right*side+forward*front;hit,normal,index,distance=shirtTree.ray_cast(origin,direction,.38)
   shape=right*(side*halfWidth)+forward*(front*(depth+raised));radius=max(shape.length,(distance+.024) if hit is not None else 0);p=origin+direction*min(.34,radius)
   verts.append(tuple(p))
 faces=[(j*(cols+1)+i,j*(cols+1)+i+1,(j+1)*(cols+1)+i+1,(j+1)*(cols+1)+i) for j in range(rows-1) for i in range(cols)]
 m=bronze if k<2 or k%3==0 else linen;o=mesh(name+'formed corselet with arm and neck openings',verts,faces,m);so=o.modifiers.new('Actual layered plate thickness','SOLIDIFY');so.thickness=.014 if m==bronze else .025;so.offset=0;be=o.modifiers.new('Turned worn edges','BEVEL');be.width=.003;be.segments=2;created.append(o)
 for j in [0,rows-1]:created.append(tube(name+'rolled plate edge',[verts[j*(cols+1)+i] for i in range(cols+1)],.005,edge if m==bronze else hide))
 # Segmented underarm lacing; shoulder leather crosses the body, attached with bronze fasteners.
 for side in [-1,1]:
  strip=[]
  for j in range(17):
   t=j/16;mid=c.lerp(head,.35)+right*(side*.15)+forward*(.162*(1-2*t));mid.z=z1-.033+math.sin(t*math.pi)*.13
   strip.extend([tuple(mid-right*.024),tuple(mid+right*.024)])
  o=mesh(name+'thick stitched shoulder strap',strip,[(j*2,j*2+1,j*2+3,j*2+2) for j in range(16)],hide);s=o.modifiers.new('Hide thickness','SOLIDIFY');s.thickness=.012;created.append(o)
  for j in [0,16]:created.append(stud(name+'strap rivet',(Vector(strip[j*2])+Vector(strip[j*2+1]))/2,edge,.008))
  for j in range(6):
   t=.17+j*.105;center=c.lerp(head,t*.35);p=Vector((center.x,center.y,z0+H*t))+right*(side*(.193 if not seated else .151));created.append(tube(name+'underarm hide lacing',[p+forward*.065,p+Vector((0,0,.018))-forward*.065],.0035,hide))
 # Quiet worked-metal seams, not painted fake anatomy.
 if m==bronze:
  for sign in [-1,1]:
   pts=[]
   for j in range(15):
    t=.17+j*.046;mid=c.lerp(head,t*.35);p=Vector((mid.x,mid.y,z0+H*t))+forward*(.165+.015*math.sin(t*math.pi))+right*(sign*(.072+.025*math.sin(t*math.pi)));pts.append(p)
   created.append(tube(name+'shallow raised metal seam',pts,.0028,edge))
 # Tight, low-profile closed hide shoes built around each actual posed foot.
 for footId,foot in enumerate(a['feet']):
  mn=Vector(foot['min']);mx=Vector(foot['max']);mid=(mn+mx)/2;longAxis=0 if (mx.x-mn.x)>(mx.y-mn.y) else 1;shortAxis=1-longAxis;L=(mx[longAxis]-mn[longAxis])+.033;W=(mx[shortAxis]-mn[shortAxis])+.022;bottom=mn.z-.005
  def shoe(skin):
   vv=[];segments=40
   for j in range(7 if skin else 2):
    z=j/(6 if skin else 1);factor=1 if not skin else (1-.12*z**3);zz=bottom+(z*.13 if skin else z*.019)
    for i in range(segments):
     an=2*math.pi*i/segments;xy=[mid.x,mid.y];xy[longAxis]+=math.cos(an)*(L*.5)*factor;xy[shortAxis]+=math.sin(an)*(W*.5)*factor;vv.append((xy[0],xy[1],zz))
   layers=7 if skin else 2;ff=[(j*segments+i,j*segments+(i+1)%segments,(j+1)*segments+(i+1)%segments,(j+1)*segments+i) for j in range(layers-1) for i in range(segments)];ff.extend([tuple(reversed(range(segments))),tuple(range((layers-1)*segments,layers*segments))]);return vv,ff
  for skin in [False,True]:v,f=shoe(skin);created.append(mesh(name+('fitted leather shoe ' if skin else 'stitched layered sole ')+str(footId),v,f,hide if skin else sole))
  # Stitching remains within the foot silhouette, at a useful physical scale.
  for side in [-1,1]:
   p=mid.copy();p[shortAxis]+=side*W*.34;p.z=bottom+.053;pts=[]
   for j in range(9):q=p.copy();q[longAxis]+=(j/8-.5)*L*.60;q.z+=.025*math.sin(j/8*math.pi);pts.append(q)
   created.append(tube(name+'shoe side stitching',pts,.0016,linen))
  # Greaves track the sloping shin, rather than upright tubes floating beside a seated leg.
  ankle=mid.copy();ankle.z=bottom+.12;legH=.36 if not seated else .22;vv=[]
  for j in range(10):
   t=j/9;cc=ankle.copy();cc.z+=legH*t
   if seated:cc.x-=.10*t
   rad=.048+.021*math.sin(t*math.pi*.8)
   for i in range(25):an=-1.05+2.1*i/24;p=cc+right*(math.sin(an)*rad)+forward*(math.cos(an)*rad);vv.append(tuple(p))
  o=mesh(name+'shaped shin guard '+str(footId),vv,[(j*25+i,j*25+i+1,(j+1)*25+i+1,(j+1)*25+i) for j in range(9) for i in range(24)],bronze);so=o.modifiers.new('Greave metal thickness','SOLIDIFY');so.thickness=.005;created.append(o)
 # Identify every original body, eye, garment and helmet component for one coherent animated pose.
 members=[]
 for ob in list(bpy.context.scene.objects):
  if ob.type!='MESH':continue
  match=(not seated and ob.name.startswith(prefix+' ')) or (seated and suffix in ob.name and not 'ship0 row' in ob.name) or ob.name.startswith('V141 crew %02d'%k) or ob in created
  if match:members.append(ob)
 for ob in members:
  if any(x in ob.name for x in ['short-sleeve_linen_tunic','Oatmeal woven tunic','Pleated_woven']):ob.data.materials.clear();ob.data.materials.append(cloth[k%len(cloth)])
  if ob.name.startswith('V141 crew'):ob.name=name+ob.name.split(' ',3)[-1]
  if not ob.name.startswith(name):ob.name=name+ob.name
  # Concealed toe meshes are omitted under closed shoes; no skin or toenails pierce the leather.
  if 'toenails' in ob.name.lower() or ob.name.endswith('base003_4'):
   bpy.data.objects.remove(ob,do_unlink=True);continue
  ob['crewId']=k;ob['crewSeated']=seated;ob['crewAnchor']=[c.x,c.z,-c.y];ob['crewHead']=[head.x,head.z,-head.y];ob['crewPhase']=k*1.618
  # Small static posture differences, continuous at the waist and neck. Feet remain fixed.
  if ob.data.users>1:ob.data=ob.data.copy()
  inv=ob.matrix_world.inverted();yaw=(-.075+.15*((k*7)%13)/12) if seated else (-.03 if k==0 else .05);headYaw=(-.10+.2*((k*5)%13)/12)
  for v in ob.data.vertices:
   p=ob.matrix_world@v.co;w=max(0,min(1,(p.z-c.z)/max(.01,head.z-c.z)));base=Vector((c.x,c.y,c.z));q=p-base;p=base+Matrix.Rotation(yaw*w,3,'Z')@q
   h=max(0,min(1,(p.z-(head.z-.23))/.13));neck=Vector((head.x,head.y,head.z-.20));p=neck+Matrix.Rotation(headYaw*h,3,'Z')@(p-neck);v.co=inv@p
  ob.data.update()
 # Remove only the concealed original foot faces, under the closed footwear and greave.
 bm=bmesh.new();bm.from_mesh(body.data);cutoff=min(f['min'][2] for f in a['feet'])+.115
 buried=[f for f in bm.faces if all((body.matrix_world@v.co).z<cutoff for v in f.verts)]
 if buried:bmesh.ops.delete(bm,geom=buried,context='FACES');bm.to_mesh(body.data)
 bm.free()
 actors.append({'id':k,'seated':seated,'anchor':[c.x,c.z,-c.y],'head':[head.x,head.z,-head.y],'footY':min(f['min'][2] for f in a['feet']),'phase':k*1.618,'parts':len(members)})

# Tag the real oar blades and shafts so they share the rowing clock and correct fulcrum.
for ob in bpy.context.scene.objects:
 match=re.search(r'ship0 row(\d+) oar (?:blade|shaft) side(-?1)',ob.name)
 if match:
  row,side=map(int,match.groups());actorId=2+row*2+(1 if side==1 else 0);ob['oarId']=actorId;ob['oarSide']=side

sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=40;sc.cycles.use_denoising=True;sc.render.resolution_x=1440;sc.render.resolution_y=1080;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU'
bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(O/'fitted-crew-and-ship.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in sc.objects:
 if ob.type=='MESH':ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'armed-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
(A/'production.json').write_text(json.dumps({'blender':bpy.app.version_string,'actors':actors,'device':sc.cycles.device,'originalPreserved':True,'changes':['formed thick cuirass, armhole and collar cuts','stitched low-profile closed hide shoes','individually offset torso and head poses','tagged body components and real oars for shared procedural animation']},indent=2),encoding='utf-8')
cam=sc.camera;cam.location=(-10.6,-11.4,4.8);cam.data.lens=52;cam.rotation_euler=(Vector((-8.82,-7.66,3.15))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'crew-close-materials.png');bpy.ops.render.render(write_still=True)
center=Vector(old['actors'][2]['corseletCenter']);cam.location=center+Vector((1.0,-.6,2.7));cam.rotation_euler=(center+Vector((.08,0,.05))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=50;sc.render.filepath=str(O/'rower-materials.png');bpy.ops.render.render(write_still=True)
print('V142_NATIVE_CREW_READY',len(actors))
