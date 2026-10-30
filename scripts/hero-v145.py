"""A fresh clothed, rigged adult male prototype. Originals are never modified.

Stage 1 writes white clay and material views before any fleet replacement.
"""
import bpy,math,json,random,bmesh,sys
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
from mathutils.kdtree import KDTree
from mathutils.bvhtree import BVHTree
import numpy as np
P=Path(__file__).resolve().parents[1];O=P/'blender/mythology-v32-145';A=P/'assets/odyssey/refit-v145'
O.mkdir(parents=True,exist_ok=True);A.mkdir(parents=True,exist_ok=True);random.seed(145)
bpy.ops.wm.read_factory_settings(use_empty=True)
lib=P/'assets/odyssey/characters-v117/source/unpacked/human-base-meshes-bundle-v1.4.1/human_base_meshes_bundle.blend'
with bpy.data.libraries.load(str(lib),link=False) as (a,b):b.objects=['GEO-body_male_realistic','GEO-body_male_realistic.eye.R','GEO-body_male_realistic.eye.L']
for o in b.objects:bpy.context.collection.objects.link(o)
bpy.context.view_layer.update();body=bpy.data.objects['GEO-body_male_realistic'];body.name='V145 adult male anatomical body'
ps=[body.matrix_world@v.co for v in body.data.vertices];lo=Vector([min(p[i] for p in ps) for i in range(3)]);hi=Vector([max(p[i] for p in ps) for i in range(3)])
origin=Vector(((lo.x+hi.x)/2,0,lo.z));scale=1.80/(hi.z-lo.z)
for o in b.objects:
 wm=o.matrix_world.copy();o.parent=None
 for v in o.data.vertices:v.co=(wm@v.co-origin)*scale
 o.matrix_world=Matrix.Identity(4)
 for mod in list(o.modifiers):o.modifiers.remove(mod)
 for f in o.data.polygons:f.use_smooth=True
body.data.materials.clear()
def material(name,c,rough=.8,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1);pr=m.node_tree.nodes.get('Principled BSDF');pr.inputs['Base Color'].default_value=(*c,1);pr.inputs['Roughness'].default_value=rough;pr.inputs['Metallic'].default_value=metal;return m
skin=material('V145 weathered skin',(.31,.19,.115),.58);skin.node_tree.nodes['Principled BSDF'].inputs['Subsurface Weight'].default_value=.075
metal=material('V145 dark worked bronze',(.105,.115,.086),.43,.84)
edge=material('V145 rubbed bronze edges',(.28,.235,.13),.39,.88)
hide=material('V145 full grain brown leather',(.055,.033,.020),.79)
cloth=material('V145 coarse flax undergarment',(.058,.064,.052),.94)
capeMat=material('V145 weathered madder wool mantle',(.135,.036,.023),.96)
hair=material('V145 dark brown hair',(.055,.038,.025),.91)
sole=material('V145 stacked hide soles',(.020,.015,.010),.94)
stitch=material('V145 waxed linen seams',(.20,.16,.105),.87)
body.data.materials.append(skin)
# Native physically sized pores, cloth, leather and hand-worked metal. UV image
# channels remain separate from lighting; no baked radiance is used as albedo.
for m,amount,size in [(metal,.0006,160),(hide,.00045,300),(cloth,.00035,620),(skin,.00013,420)]:
 nd=m.node_tree.nodes;lk=m.node_tree.links;pr=nd.get('Principled BSDF');tex=nd.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=size;tex.inputs['Detail'].default_value=2
 bump=nd.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.23;bump.inputs['Distance'].default_value=amount;lk.new(tex.outputs['Fac'],bump.inputs['Height']);lk.new(bump.outputs['Normal'],pr.inputs['Normal'])
 ramp=nd.new('ShaderNodeMapRange');ramp.inputs['To Min'].default_value=max(.2,pr.inputs['Roughness'].default_value-.13);ramp.inputs['To Max'].default_value=min(.99,pr.inputs['Roughness'].default_value+.13);lk.new(tex.outputs['Fac'],ramp.inputs['Value']);lk.new(ramp.outputs['Result'],pr.inputs['Roughness'])
parts=[body];rigid={}
def mesh(name,v,f,mat,thick=0,smooth=True):
 g=bpy.data.meshes.new(name);g.from_pydata(v,[],f);g.update();o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);g.materials.append(mat)
 uv=g.uv_layers.new(name='GarmentUV')
 for poly in g.polygons:
  poly.use_smooth=smooth
  for li in poly.loop_indices:
   q=g.vertices[g.loops[li].vertex_index].co;uv.data[li].uv=(q.x*2.2,q.z*2.2)
 if thick:
  mod=o.modifiers.new('Actual material thickness','SOLIDIFY');mod.thickness=thick;mod.offset=0
 parts.append(o);return o
def tube(name,pts,r,mat,bone=None):
 g=bpy.data.curves.new(name,'CURVE');g.dimensions='3D';g.resolution_u=1;g.bevel_depth=r;g.bevel_resolution=1;sp=g.splines.new('POLY');sp.points.add(len(pts)-1)
 for p,q in zip(sp.points,pts):p.co=(*q,1)
 ob=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(ob);g.materials.append(mat);bpy.context.view_layer.objects.active=ob;ob.select_set(True);bpy.ops.object.convert(target='MESH');ob.select_set(False);parts.append(ob)
 if bone:rigid[ob.name]=bone
 return ob
def extract(name,predicate,mat,inflate=.01):
 ids=[f for f in body.data.polygons if predicate(f.center)]
 # Polygon centers need an explicit update after vertex normalization.
 v=[];faces=[];mapping={}
 for f in ids:
  face=[]
  for idx in f.vertices:
   if idx not in mapping:
    bv=body.data.vertices[idx];mapping[idx]=len(v);v.append(tuple(bv.co+bv.normal*inflate))
   face.append(mapping[idx])
  faces.append(face)
 return mesh(name,v,faces,mat,.002)
body.data.update()
# Shirt has real arm and neck openings. Its only visible regions are sleeves and
# the collar; the lower chiton is authored separately, with an overlapping waist.
shirt=extract('V145 sewn flax shirt',lambda p:.92<p.z<1.535 and (abs(p.x)<.235 or p.z>1.24),cloth,.010)
bm=bmesh.new();bm.from_mesh(shirt.data);bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),plane_co=(0,0,1.510),plane_no=(0,0,1),clear_outer=True,clear_inner=False);bm.to_mesh(shirt.data);bm.free()
for e in shirt.data.edges:
 va,vb=[shirt.data.vertices[i].co for i in e.vertices]
 if abs(va.z-1.510)<.0001 and abs(vb.z-1.510)<.0001:tube('V145 turned collar seam',[va,vb],.003,cloth,'neck')

# Pleated under-chiton, longer than the leather tabs, without cylindrical stiffness.
N=80;rows=12;vv=[]
for j in range(rows):
 t=j/(rows-1);z=.995-.385*t
 for i in range(N):
  an=i/N*math.tau;pleat=math.sin(an*18)*(.002+.006*t);w=.190+.047*t+pleat;d=.150+.035*t+pleat
  vv.append((math.sin(an)*w,-math.cos(an)*d-.021,z+.009*math.sin(an*3)*t*t))
ff=[(j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i) for j in range(rows-1) for i in range(N)]
mesh('V145 knee length pleated chiton',vv,ff,cloth,.0025)
# Complete formed cuirass: waist suppression, broad chest, low armholes, neck
# clearance and separate load-bearing shoulder bridges. No old armour remains.
N=96;rows=15;vv=[];levels=[(0,.155,.106),(.16,.157,.105),(.36,.18,.118),(.64,.219,.133),(1,.207,.119)]
tree=BVHTree.FromPolygons([q.co.copy() for q in body.data.vertices],[tuple(f.vertices) for f in body.data.polygons])
def profile(t):
 for k in range(len(levels)-1):
  a,b=levels[k],levels[k+1]
  if a[0]<=t<=b[0]:
   f=(t-a[0])/(b[0]-a[0]);return (a[1]*(1-f)+b[1]*f,a[2]*(1-f)+b[2]*f)
 return levels[-1][1:]
for j in range(rows):
 t=j/(rows-1);w,d=profile(t)
 for i in range(N):
  an=i/N*math.tau;front=math.cos(an);top=1.435-.145*abs(math.sin(an))**4
  z=.985+(top-.985)*t;keel=.003*max(0,front)**16*math.sin(t*math.pi);chest=.010*max(0,front)*math.sin(an*2)**2*math.sin(t*math.pi)
  slice=[q.co for q in body.data.vertices if abs(q.co.z-z)<.026 and abs(q.co.x)<.20]
  cy=(min(q.y for q in slice)+max(q.y for q in slice))/2 if slice else -.025
  origin=Vector((0,cy,z));direction=Vector((math.sin(an),-math.cos(an),0));hit,normal,index,dist=tree.ray_cast(origin,direction,.4)
  radius=(dist if hit is not None else math.hypot(w*math.sin(an),d*math.cos(an)))+.024
  q=origin+direction*radius;q.x=max(-.218,min(.218,q.x));vv.append(tuple(q))
ff=[(j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i) for j in range(rows-1) for i in range(N)]
cuirass=mesh('V145 complete fitted bronze cuirass',vv,ff,metal,.006);rigid[cuirass.name]='chest'
for row in [0,rows-1]:tube('V145 rolled cuirass rim '+str(row),[vv[row*N+i] for i in range(N)]+[vv[row*N]],.0033,edge,'chest')
for side in [-1,1]:
 v=[];M=18
 for j in range(M):
  t=j/(M-1);y=-.163+.316*t;z=1.423+.103*math.sin(t*math.pi)
  for dx in [-.026,.026]:v.append((side*.132+dx,y+.01,z))
 f=[(j*2,j*2+1,j*2+3,j*2+2) for j in range(M-1)];ob=mesh('V145 shoulder bridge '+str(side),v,f,metal,.006);rigid[ob.name]='chest'
 # Actual side seams and fastenings below each armhole.
 for z in [1.05,1.13,1.21,1.29]:
  tube('V145 side binding',[(side*.174,-.035,z),(side*.19,.008,z+.006),(side*.174,.051,z)],.0025,hide,'chest')
# Two staggered rows of narrow, supple pteruges. Each tab is weighted to the
# nearest anatomical thigh after binding, so seated poses fold instead of intersecting.
for tier in range(2):
 count=24
 for i in range(count):
  an=(i+.5*tier)/count*math.tau;length=(.245 if tier==0 else .145)*(1+.035*math.sin(i*1.7));v=[];R=8
  for j in range(R):
   t=j/(R-1);spread=.010*t+.004*math.sin(t*math.pi)
   for u in [-1,0,1]:
    a=an+u*(math.pi/count*.87);w=.200+spread+t*.025+(.006 if tier else 0);d=.162+spread+t*.019+(.005 if tier else 0)
    v.append((math.sin(a)*w,-math.cos(a)*d-.021,.995-tier*.007-length*t+.003*math.sin(t*math.pi)))
  f=[(j*3+k,j*3+k+1,(j+1)*3+k+1,(j+1)*3+k) for j in range(R-1) for k in range(2)];mesh('V145 articulated leather tab %d %d'%(tier,i),v,f,hide,.0038)
# Narrow waist belt with a modest bronze clasp.
v=[];N=80
for z in [.972,1.018]:
 for i in range(N):a=i/N*math.tau;v.append((math.sin(a)*.199,-math.cos(a)*.162-.021,z))
ob=mesh('V145 load bearing leather waist belt',v,[(i,(i+1)%N,N+(i+1)%N,N+i) for i in range(N)],hide,.004);rigid[ob.name]='pelvis'
tube('V145 bronze buckle',[(-.022,-.186,.980),(.022,-.186,.980),(.022,-.186,1.012),(-.022,-.186,1.012),(-.022,-.186,.980)],.0024,edge,'pelvis')
# Helmet is a single forged bowl, with brow, cheek hinges and neck protection.
hc=Vector((0,-.050,1.695));N=80;R=18;v=[]
for j in range(R):
 t=(j+.02)/(R-1+.02)
 for i in range(N):
  an=i/N*math.tau;front=math.cos(an);bottom=1.663+.043*max(front,0)-.025*max(-front,0);ph=t*math.pi*.5
  v.append((math.sin(an)*.108*math.sin(ph),hc.y-math.cos(an)*.125*math.sin(ph),bottom+(1.827-bottom)*math.cos(ph)))
f=[(j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i) for j in range(R-1) for i in range(N)]
helm=mesh('V145 single forged helmet bowl',v,f,metal,.004);rigid[helm.name]='head'
tube('V145 turned helmet brim',[v[(R-1)*N+i] for i in range(N)]+[v[(R-1)*N]],.0023,edge,'head')
for side in [-1,1]:
 v=[(side*.099,-.063,1.701),(side*.089,-.128,1.684),(side*.074,-.138,1.607),(side*.087,-.078,1.589),(side*.110,-.043,1.641)]
 ob=mesh('V145 hinged cheek plate '+str(side),v,[(0,1,2,3,4)],metal,.004);rigid[ob.name]='head'
 tube('V145 cheek plate rolled edge',v+[v[0]],.0016,edge,'head')
 # Closed shoes follow actual anatomical feet rather than a cone or oval proxy.
 ps=[q.co for q in body.data.vertices if q.co.z<.075 and q.co.x*side>0]
 if ps:
  xy=np.array([(q.x,q.y) for q in ps]);center=xy.mean(axis=0);vals,axes=np.linalg.eigh(np.cov(xy.T));axis=axes[:,-1];axis=axis*(-1 if axis[1]>0 else 1);forward=Vector((float(axis[0]),float(axis[1]),0));right=Vector((-forward.y,forward.x,0));mid=Vector((float(center[0]),float(center[1]),0));proj=[(q-mid).dot(forward) for q in ps];across=[(q-mid).dot(right) for q in ps];start=min(proj)-.014;end=max(proj)+.014;width=(max(across)-min(across))*.5+.012
  profile=[(0,.32,.08),(.05,.72,.105),(.15,.88,.115),(.3,.96,.12),(.5,1,.09),(.7,1,.075),(.84,.93,.064),(.94,.70,.053),(1,.15,.04)];v=[];nr=24
  for t,w,h in profile:
   for i in range(nr):
    a=i/nr*math.tau;s=math.sin(a);q=mid+forward*(start+(end-start)*t)+right*(math.cos(a)*width*w);q.z=.014+max(0,s)**.75*h if s>=0 else .014*(1+s);v.append(tuple(q))
  f=[(j*nr+i,j*nr+(i+1)%nr,(j+1)*nr+(i+1)%nr,(j+1)*nr+i) for j in range(len(profile)-1) for i in range(nr)];f.extend([tuple(reversed(range(nr))),tuple(range((len(profile)-1)*nr,len(profile)*nr))]);ob=mesh('V145 closed rounded hide shoe '+str(side),v,f,hide);rigid[ob.name]='foot'+str(side)
  outline=[tuple(mid+forward*(start+(end-start)*t)+right*(width*w)+Vector((0,0,.010))) for t,w,h in profile]+[tuple(mid+forward*(start+(end-start)*t)-right*(width*w)+Vector((0,0,.010))) for t,w,h in reversed(profile)]
  tube('V145 layered shoe welt '+str(side),outline+[outline[0]],.005,sole,'foot'+str(side))
  ankle=[q.co for q in body.data.vertices if .10<q.co.z<.17 and q.co.x*side>0];cc=sum(ankle,Vector())/len(ankle)
  v=[];nr=32
  for z in [.07,.14,.178]:
   for i in range(nr):a=i/nr*math.tau;v.append((cc.x+math.sin(a)*.057,cc.y+math.cos(a)*.060,z))
  ob=mesh('V145 ankle shoe upper '+str(side),v,[(j*nr+i,j*nr+(i+1)%nr,(j+1)*nr+(i+1)%nr,(j+1)*nr+i) for j in range(2) for i in range(nr)],hide,.003);rigid[ob.name]='foot'+str(side)
  for z in [.085,.11,.14]:tube('V145 shoe lacing '+str(side),[(cc.x-.020,cc.y-.052,z),(cc.x+.020,cc.y-.055,z+.014)],.0011,stitch,'foot'+str(side))
 # Thin fitted greave and its rolled edge; actual shin surfaces determine width.
 ps=[q.co for q in body.data.vertices if .15<q.co.z<.47 and q.co.x*side>0];ccx=sum(q.x for q in ps)/len(ps);v=[];nr=12;nc=28
 for j in range(nr):
  t=j/(nr-1);z=.15+.32*t;ring=[q for q in ps if abs(q.z-z)<.035];cx=sum(q.x for q in ring)/len(ring) if ring else ccx;cy=sum(q.y for q in ring)/len(ring) if ring else .005;rx=max([abs(q.x-cx) for q in ring]+[.042])+.007;ry=max([abs(q.y-cy) for q in ring]+[.043])+.007
  for i in range(nc):a=-1.33+2.66*i/(nc-1);v.append((cx+rx*math.sin(a),cy-ry*math.cos(a),z))
 f=[(j*nc+i,j*nc+i+1,(j+1)*nc+i+1,(j+1)*nc+i) for j in range(nr-1) for i in range(nc-1)];ob=mesh('V145 anatomical greave '+str(side),v,f,metal,.0035);rigid[ob.name]='shin'+str(side)
 for row in [0,nr-1]:tube('V145 greave turned edge',[v[row*nc+i] for i in range(nc)],.002,edge,'shin'+str(side))
 # Short horsehair crest is made from strands, not an opaque vertical fin.
for i in range(105):
 t=(i+.5)/105;an=.12+math.pi*.78*t;y=-.050+.111*math.cos(an);z=1.805+.030*math.sin(an);x=(random.random()-.5)*.024
 tube('V145 horsehair crest strand %03d'%i,[(x,y,z),(x*1.2,y+.012,z+.045),(x*1.6,y+.037,z+.080),(x*1.8,y+.062,z+.083)],.00085,capeMat,'head')
# Mantle is attached to the shoulder bridges and drapes behind the cuirass.
v=[];nx=18;ny=22
for j in range(ny):
 t=j/(ny-1)
 for i in range(nx):u=i/(nx-1)*2-1;v.append((u*(.19+.10*t),.155+.085*t+.018*math.sin(u*math.pi*4)*t,1.455-.72*t+.025*math.sin(u*math.pi)*t))
f=[(j*nx+i,j*nx+i+1,(j+1)*nx+i+1,(j+1)*nx+i) for j in range(ny-1) for i in range(nx-1)];mantle=mesh('V145 attached wool mantle',v,f,capeMat,.0025);rigid[mantle.name]='chest'
# Eyes retain their source transforms; iris and pupil are separate small surfaces.
white=material('V145 eye sclera',(.63,.59,.49),.26);iris=material('V145 hazel iris',(.055,.045,.020),.29);pupil=material('V145 pupil',(.003,.003,.002),.20)
for eye in b.objects[1:]:
 eye.data.materials.clear();eye.data.materials.append(white);parts.append(eye);rigid[eye.name]='head';c=sum((q.co for q in eye.data.vertices),Vector())/len(eye.data.vertices)
 for name,r,m in [('iris',.0054,iris),('pupil',.0025,pupil)]:
  bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,location=c+Vector((0,-.013,0)));ob=bpy.context.object;ob.name='V145 '+eye.name+' '+name;ob.scale=(r,.0009,r);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);ob.data.materials.append(m);parts.append(ob);rigid[ob.name]='head'
# Short jaw beard uses the face surface as its actual support.
beard=extract('V145 short jaw beard',lambda q:1.550<q.z<1.645 and q.y<-.080 and ((q.x/.031)**2+((q.z-1.607)/.019)**2>1.15),hair,.0018);rigid[beard.name]='head'
headVerts=[q.co.copy() for q in beard.data.vertices]
for i in range(min(85,len(headVerts))):
 q=random.choice(headVerts);tube('V145 beard strand %03d'%i,[q,q+Vector((.001,-.002,-.007)),q+Vector((.002,-.001,-.013))],.00045,hair,'head')
# Armature, not a vertex-wave effect. Rest pose matches the source A pose.
arm=bpy.data.armatures.new('V145 anatomical skeleton');rig=bpy.data.objects.new('V145 captain rig',arm);bpy.context.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
bones=[('pelvis',(0,0,.87),(0,0,1.05),None),('spine',(0,0,1.05),(0,0,1.24),'pelvis'),('chest',(0,0,1.24),(0,0,1.47),'spine'),('neck',(0,0,1.47),(0,0,1.58),'chest'),('head',(0,0,1.58),(0,0,1.79),'neck')]
for side in [-1,1]:bones.extend([('upper'+str(side),(side*.17,0,1.445),(side*.31,-.012,1.20),'chest'),('fore'+str(side),(side*.31,-.012,1.20),(side*.425,-.035,.99),'upper'+str(side)),('hand'+str(side),(side*.425,-.035,.99),(side*.47,-.060,.91),'fore'+str(side)),('thigh'+str(side),(side*.115,.012,.90),(side*.17,.012,.50),'pelvis'),('shin'+str(side),(side*.17,.012,.50),(side*.18,.061,.105),'thigh'+str(side)),('foot'+str(side),(side*.18,.061,.105),(side*.23,-.13,.04),'shin'+str(side))])
for name,head,tail,parent in bones:
 eb=arm.edit_bones.new(name);eb.head=head;eb.tail=tail
 if parent:eb.parent=arm.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT');rig.select_set(False)
bpy.ops.object.select_all(action='DESELECT');body.select_set(True);rig.select_set(True);bpy.context.view_layer.objects.active=rig;bpy.ops.object.parent_set(type='ARMATURE_AUTO');body.select_set(False);rig.select_set(False)
kd=KDTree(len(body.data.vertices))
for v in body.data.vertices:kd.insert(v.co,v.index)
kd.balance()
for ob in parts:
 if ob==body:continue
 ob.parent=rig;mod=ob.modifiers.new('Anatomical skeleton','ARMATURE');mod.object=rig
 if ob.name in rigid:
  group=ob.vertex_groups.new(name=rigid[ob.name]);group.add(list(range(len(ob.data.vertices))),1.,'REPLACE')
 else:
  groups={g.name:ob.vertex_groups.new(name=g.name) for g in body.vertex_groups}
  for v in ob.data.vertices:
   co,index,dist=kd.find(v.co)
   for gw in body.data.vertices[index].groups:groups[body.vertex_groups[gw.group].name].add([v.index],gw.weight,'REPLACE')
# A relaxed, asymmetrical standing pose with both feet on the floor.
for side in [-1,1]:
 pb=rig.pose.bones['upper'+str(side)];rest=pb.bone.matrix_local.to_quaternion();q=Quaternion((0,1,0),side*(.28 if side==1 else .34));pb.rotation_mode='QUATERNION';pb.rotation_quaternion=rest.inverted()@q@rest
 pb=rig.pose.bones['fore'+str(side)];rest=pb.bone.matrix_local.to_quaternion();q=Quaternion((1,0,0),-.20 if side==1 else -.12);pb.rotation_mode='QUATERNION';pb.rotation_quaternion=rest.inverted()@q@rest
rig.pose.bones['head'].rotation_mode='XYZ';rig.pose.bones['head'].rotation_euler.z=-.045
# Native clay and material evidence share camera, geometry and light directions.
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=32;sc.cycles.use_denoising=True;sc.render.resolution_x=1200;sc.render.resolution_y=1200;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU';sc.world=bpy.data.worlds.new('V145 neutral overcast fill');sc.world.use_nodes=True;sc.world.node_tree.nodes['Background'].inputs[0].default_value=(.26,.32,.38,1);sc.world.node_tree.nodes['Background'].inputs[1].default_value=.36
def area(name,loc,power,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color;o=bpy.data.objects.new(name,d);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
area('Large warm key',(-3,-4,5),450,3.2,(1,.88,.72));area('Cool sky fill',(3,1,4),320,3.5,(.65,.79,1))
bpy.ops.mesh.primitive_plane_add(size=200);floor=bpy.context.object;floor.name='Prototype ground';floor.data.materials.append(material('Neutral ground',(.075,.082,.085),.96));floor.location.z=-.006
camdata=bpy.data.cameras.new('Prototype inspection camera');cam=bpy.data.objects.new('Prototype inspection camera',camdata);bpy.context.collection.objects.link(cam);sc.camera=cam;camdata.lens=65
cam.location=(2.25,-4.1,2.10);cam.rotation_euler=(Vector((0,0,.94))-cam.location).to_track_quat('-Z','Y').to_euler()
bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(O/'01-complete-rigged-warrior.blend'))
clay=material('Prototype white clay',(.42,.43,.42),.88);bpy.context.view_layer.material_override=clay;sc.render.filepath=str(O/'01-warrior-white.png');bpy.ops.render.render(write_still=True)
bpy.context.view_layer.material_override=None;sc.render.filepath=str(O/'02-warrior-material.png');bpy.ops.render.render(write_still=True)
cam.location=(-2.25,3.4,2.05);cam.rotation_euler=(Vector((0,0,1.02))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'03-warrior-back.png');bpy.ops.render.render(write_still=True)
# Export the inspected prototype, retaining its real skeleton.
bpy.ops.object.select_all(action='DESELECT')
for ob in parts+[rig]:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'warrior-prototype.glb'),export_format='GLB',use_selection=True,export_apply=False,export_extras=True,export_yup=True)
(O/'prototype.json').write_text(json.dumps({'source':str(lib),'height':1.80,'parts':len(parts),'bones':len(bones),'bodyVertices':len(body.data.vertices),'stage':'prototype, pending visual inspection','clay':'01-warrior-white.png','material':'02-warrior-material.png','back':'03-warrior-back.png'},indent=2),encoding='utf-8')
print('PROTOTYPE_READY',len(parts),len(bones))
