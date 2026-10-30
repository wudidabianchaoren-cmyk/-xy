"""Clothed medieval rowers: actual CC0 anatomical head/hands, retained fourteen rigs and grip poses."""
import bpy,bmesh,math,json,random
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/crew-v162';O=P/'blender/mythology-v32-162';O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-146/rigged-fleet-v148.blend'));sc=bpy.context.scene;sc.frame_set(1)
rigs=sorted([o for o in sc.objects if o.type=='ARMATURE'and'skeleton'in o.name],key=lambda o:o.name)
source=[];faces=[];uv=[];g='';joints={};jointids={}
for line in (A/'source/makehuman-base.obj').read_text().splitlines():
 if line.startswith('v '):source.append(Vector(map(float,line.split()[1:])))
 elif line.startswith('vt '):uv.append(tuple(map(float,line.split()[1:3])))
 elif line.startswith('g '):g=line[2:];jointids.setdefault(g,[])
 elif line.startswith('f '):
  ids=[int(t.split('/')[0])-1 for t in line.split()[1:]];jointids[g].extend(ids)
  if g=='body':faces.append([(int(t.split('/')[0])-1,int(t.split('/')[1])-1)for t in line.split()[1:]])
for name,ids in jointids.items():
 if name.startswith('joint-'):joints[name]=sum((source[i]for i in set(ids)),Vector())/len(set(ids))
def mat(name,col,rough=.8,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;pr=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if pr is None:pr=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(pr.outputs[0],out.inputs['Surface'])
 pr.name='Principled BSDF';pr.inputs['Base Color'].default_value=(*col,1);pr.inputs['Roughness'].default_value=rough;pr.inputs['Metallic'].default_value=metal;return m
skin=mat('V162 warm natural anatomical skin',(.48,.285,.185),.62);steel=mat('V162 worn forged steel',(.17,.185,.18),.55,.78);leather=mat('V162 worn brown oxhide',(.065,.033,.018),.84);linen=mat('V162 padded undyed linen',(.24,.205,.145),.94);wool=[mat('V162 wool surcoat '+str(i),c,.96)for i,c in enumerate([(.16,.07,.035),(.115,.15,.105),(.21,.16,.095),(.12,.115,.10)])]
# Tangible ring-scale normal and roughness maps; metal is not a smooth plastic breastplate.
size=512;yy,xx=np.mgrid[:size,:size];cell=24.;px=(xx+(np.floor(yy/cell)%2)*cell*.5)%cell-cell*.5;py=yy%cell-cell*.5;rr=np.sqrt((px/8.)**2+(py/7.)**2);height=np.exp(-((rr-1.)/.16)**2);dy,dx=np.gradient(height);norm=np.stack([-dx*2.1,-dy*2.1,np.ones_like(dx)],axis=2);norm/=np.linalg.norm(norm,axis=2)[:,:,None]
def image(name,data,colour=False):
 im=bpy.data.images.new(name,width=size,height=size,alpha=True);im.colorspace_settings.name='sRGB'if colour else'Non-Color';rgba=np.ones((size,size,4),np.float32);rgba[:,:,:3]=data;im.pixels.foreach_set(rgba.ravel());im.filepath_raw=str(A/(name+'.png'));im.file_format='PNG';im.save();return im
nimage=image('mail-normal',(norm+1)*.5);rimage=image('mail-rough',np.repeat((.78-height*.28)[:,:,None],3,axis=2));mail=mat('V162 interlocked iron mail',(.16,.175,.17),.7,.82);nd=mail.node_tree.nodes;lk=mail.node_tree.links;pr=nd.get('Principled BSDF');tex=nd.new('ShaderNodeTexImage');tex.image=nimage;nm=nd.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.72;lk.new(tex.outputs['Color'],nm.inputs['Color']);lk.new(nm.outputs['Normal'],pr.inputs['Normal']);rough=nd.new('ShaderNodeTexImage');rough.image=rimage;lk.new(rough.outputs['Color'],pr.inputs['Roughness'])
whites=mat('V162 ivory eyeball',(.42,.39,.32),.43);iris=mat('V162 dark brown iris',(.025,.017,.008),.5)
templates=[]
def mesh(name,verts,polys,material,bone=None,weights=None,uvs=None):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],polys);data.update();ob=bpy.data.objects.new(name,data);sc.collection.objects.link(ob);data.materials.append(material)
 for f in data.polygons:f.use_smooth=True
 if uvs:
  layer=data.uv_layers.new(name='UVMap')
  for poly,coords in zip(data.polygons,uvs):
   for loop,co in zip(poly.loop_indices,coords):layer.data[loop].uv=co
 else:
  layer=data.uv_layers.new(name='UVMap')
  for poly in data.polygons:
   for loop in poly.loop_indices:
    co=data.vertices[data.loops[loop].vertex_index].co;layer.data[loop].uv=(math.atan2(co.x,co.y)/math.tau*5,co.z*8)
 if bone:
  vg=ob.vertex_groups.new(name=bone);vg.add(list(range(len(verts))),1,'REPLACE')
 if weights:
  for name,ids in weights.items():ob.vertex_groups.new(name=name).add(ids,1,'REPLACE')
 templates.append(ob);return ob
def clipped(name,predicate,transform,material,bone):
 selected=[f for f in faces if all(predicate(source[i])for i,_ in f)];used=sorted({i for f in selected for i,_ in f});mapping={i:j for j,i in enumerate(used)}
 return mesh(name,[transform(source[i])for i in used],[[mapping[i]for i,_ in f]for f in selected],material,bone,uvs=[[uv[k]for _,k in f]for f in selected])
headTransform=lambda p:Vector((p.x*.10,-p.z*.10,1.47+(p.y-5.89025)*.123))
clipped('V162 anatomical adult head and neck',lambda p:p.y>5.93,headTransform,skin,'head')
for side in[-1,1]:
 key='l'if side>0 else'r';wrist=joints['joint-'+key+'-hand'];knuckle=joints['joint-'+key+'-finger-3-1'];across=(joints['joint-'+key+'-finger-5-1']-joints['joint-'+key+'-finger-2-1']).normalized();long=(knuckle-wrist).normalized();across=(across-long*across.dot(long)).normalized();normal=across.cross(long).normalized();bone=rigs[0].data.bones['hand'+str(side)]
 def valid(p):
  d=p-wrist;return p.x*side>3.65 and d.dot(long)>-.35 and abs(d.dot(across))<1.12 and abs(d.dot(normal))<.85
 def transform(p):
  d=(p-wrist)*.1;x=d.dot(across)*.85;y=d.dot(long)*.85;z=d.dot(normal)*.85-.022;start=.055
  if y>start:
   q=y-start;angle=min(2.75,q/.026);y=start+.026*math.sin(angle);z+=.026*(1-math.cos(angle))
  return bone.matrix_local@Vector((x,y,z))
 clipped('V162 anatomical five-finger gripping hand '+str(side),valid,transform,skin,'hand'+str(side))
def rings(name,sections,material,bone,segments=48,fold=.004):
 verts=[]
 for j,(z,rx,ry,cy)in enumerate(sections):
  for i in range(segments):a=i/segments*math.tau;q=fold*math.sin(a*12+j*.30);verts.append((math.sin(a)*(rx+q),cy-math.cos(a)*(ry+q),z))
 polys=[(j*segments+i,j*segments+(i+1)%segments,(j+1)*segments+(i+1)%segments,(j+1)*segments+i)for j in range(len(sections)-1)for i in range(segments)]
 ob=mesh(name,verts,polys,material,bone);mod=ob.modifiers.new('Physical garment thickness','SOLIDIFY');mod.thickness=.004;bpy.context.view_layer.objects.active=ob
 bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.ops.object.modifier_apply(modifier=mod.name);ob.select_set(False);return ob
rings('V162 mail hauberk torso',[(.87,.18,.12,.015),(1.03,.19,.12,.008),(1.18,.225,.14,.012),(1.36,.24,.13,.016),(1.46,.16,.105,0),(1.49,.075,.078,0)],mail,'chest')
rings('V162 wool split-knee tunic',[(.65,.24,.16,.016),(.77,.235,.15,.016),(.89,.19,.13,.008),(1.04,.20,.135,.008)],wool[0],'pelvis',fold=.008)
rings('V162 leather waist belt',[(.965,.202,.137,.008),(1.015,.202,.137,.008)],leather,'pelvis',fold=0)
def limb(name,boneName,radius,material,endRadius=None):
 b=rigs[0].data.bones[boneName];d=b.tail_local-b.head_local;verts=[];n=24
 for j in range(9):
  t=j/8;rad=radius*(1-t)+(endRadius or radius*.82)*t;rad*=1+.035*math.sin(t*math.pi*8)
  for i in range(n):a=i/n*math.tau;verts.append(b.matrix_local@Vector((math.cos(a)*rad,(-.025+t*(d.length+.055)),math.sin(a)*rad)))
 polys=[(j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i)for j in range(8)for i in range(n)];polys+=[tuple(reversed(range(n))),tuple(8*n+i for i in range(n))];return mesh(name,verts,polys,material,boneName)
for side in[-1,1]:
 limb('V162 padded mail upper sleeve '+str(side),'upper'+str(side),.080,mail,.063);limb('V162 fitted mail fore sleeve '+str(side),'fore'+str(side),.057,mail,.038)
 limb('V162 wool hose thigh '+str(side),'thigh'+str(side),.105,wool[2],.075);limb('V162 leather calf boot '+str(side),'shin'+str(side),.067,leather,.045)
 b=rigs[0].data.bones['foot'+str(side)];bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=1);ob=bpy.context.object;ob.name='V162 closed leather shoe '+str(side);ob.scale=(.062,.125,.042);ob.location=b.head_local.lerp(b.tail_local,.55);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);ob.data.materials.append(leather);vg=ob.vertex_groups.new(name=b.name);vg.add(list(range(len(ob.data.vertices))),1,'REPLACE');templates.append(ob)
hood=rings('V162 iron mail coif',[(1.50,.10,.11,-.035),(1.57,.113,.125,-.035),(1.67,.112,.125,-.035),(1.74,.103,.118,-.035),(1.80,.064,.08,-.035),(1.83,.005,.005,0)],mail,'head',segments=64,fold=0)
bm=bmesh.new();bm.from_mesh(hood.data);remove=[]
for f in bm.faces:
 c=f.calc_center_median()
 if c.y<-.035 and abs(c.x)<.078 and 1.56<c.z<1.735:remove.append(f)
bmesh.ops.delete(bm,geom=remove,context='FACES');bm.to_mesh(hood.data);bm.free()
rings('V162 conical nasal helmet',[(1.735,.115,.13,-.035),(1.77,.113,.129,-.035),(1.82,.075,.095,-.035),(1.88,.012,.012,-.035)],steel,'head',segments=64,fold=0)
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,-.165,1.69));guard=bpy.context.object;guard.name='V162 narrow medieval nasal guard';guard.scale=(.018,.006,.115);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);guard.data.materials.append(steel);guard.vertex_groups.new(name='head').add(list(range(len(guard.data.vertices))),1,'REPLACE');templates.append(guard)
for name in['joint-l-eye','joint-r-eye']:
 p=headTransform(joints[name]);bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=.011,location=p);ob=bpy.context.object;ob.name='V162 anatomical eye';ob.data.materials.append(whites);ob.vertex_groups.new(name='head').add(list(range(len(ob.data.vertices))),1,'REPLACE');templates.append(ob)
 p.y-=.010;bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=10,radius=1,location=p);ob=bpy.context.object;ob.name='V162 small iris';ob.scale=(.0045,.002,.0045);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);ob.data.materials.append(iris);ob.vertex_groups.new(name='head').add(list(range(len(ob.data.vertices))),1,'REPLACE');templates.append(ob)
# Remove the old classical costume/hair/rounded arm mesh; retain original rig animation and actual oar shaft.
for ob in list(sc.objects):
 if ob.type=='MESH'and ob.parent in rigs and'oar shaft'not in ob.name.lower():bpy.data.objects.remove(ob,do_unlink=True)
new=[]
for k,rig in enumerate(rigs):
 for template in templates:
  ob=template.copy();ob.data=template.data.copy();sc.collection.objects.link(ob);ob.name=template.name+' / crew%02d'%k;ob.parent=rig;ob.matrix_parent_inverse=Matrix.Identity(4);ob.matrix_basis=template.matrix_world.copy();mod=ob.modifiers.new('Retained fourteen actor rig','ARMATURE');mod.object=rig
  if'wool split'in ob.name:ob.data.materials[0]=wool[k%len(wool)]
  new.append(ob)
for ob in templates:bpy.data.objects.remove(ob,do_unlink=True)
# Solve shoulder-elbow-wrist contact against the actual retained shaft, at every keyed breathing frame.
for frame in[1,61,121,181,241]:
 sc.frame_set(frame);bpy.context.view_layer.update()
 for rig in rigs:
  shaft=next((o for o in sc.objects if o.parent==rig and'oar shaft'in o.name.lower()),None)
  if shaft is None:continue
  local=rig.matrix_world.inverted()@shaft.matrix_world;axis=(local.to_3x3()@Vector((0,0,1))).normalized();centre=local.translation
  for side in[-1,1]:
   hand=rig.pose.bones['hand'+str(side)];upper=rig.pose.bones['upper'+str(side)];fore=rig.pose.bones['fore'+str(side)];palm=hand.matrix@Vector((0,.06,0));contact=centre+axis*(palm-centre).dot(axis)
   x=axis.copy();y=Vector((0,0,-1));y=(y-x*y.dot(x)).normalized();z=x.cross(y).normalized();basis=Matrix((x,y,z)).transposed();wrist=contact-basis@Vector((0,.067,.006));shoulder=upper.head.copy();direction=(wrist-shoulder).normalized();distance=(wrist-shoulder).length;l1=rig.data.bones[upper.name].length;l2=rig.data.bones[fore.name].length;distance=min(distance,l1+l2-.005);wrist=shoulder+direction*distance;along=(l1*l1-l2*l2+distance*distance)/(2*distance);radius=math.sqrt(max(.00001,l1*l1-along*along));pole=Vector((side,0,-.25));pole=(pole-direction*pole.dot(direction)).normalized();elbow=shoulder+direction*along+pole*radius
   for bone,a,b in[(upper,shoulder,elbow),(fore,elbow,wrist)]:
    rot=(b-a).to_track_quat('Y','Z').to_matrix().to_4x4();rot.translation=a;bone.matrix=rot;bpy.context.view_layer.update()
   matrix=basis.to_4x4();matrix.translation=wrist;hand.matrix=matrix;bpy.context.view_layer.update()
   for bone in[upper,fore,hand]:bone.rotation_mode='QUATERNION';bone.keyframe_insert(data_path='rotation_quaternion',frame=frame);bone.keyframe_insert(data_path='location',frame=frame)
sc.frame_set(1);bpy.context.view_layer.update();allmesh=[o for o in sc.objects if o.type=='MESH'and o.parent in rigs];bpy.ops.object.select_all(action='DESELECT')
for ob in allmesh+rigs:ob.hide_render=False;ob.hide_set(False);ob.select_set(True)
bpy.context.view_layer.objects.active=new[0];bpy.ops.wm.save_as_mainfile(filepath=str(O/'medieval-rowers.blend'));bpy.ops.export_scene.gltf(filepath=str(A/'medieval-rowers.glb'),export_format='GLB',use_selection=True,export_animations=True,export_extras=True,export_yup=True,export_force_sampling=True)
# Static posed counterpart for the native UE scene uses exactly the deformed web geometry.
deps=bpy.context.evaluated_depsgraph_get();bpy.ops.object.select_all(action='DESELECT');static=[]
for ob in allmesh:
 data=bpy.data.meshes.new_from_object(ob.evaluated_get(deps));st=bpy.data.objects.new(ob.name+' UE posed',data);sc.collection.objects.link(st);st.matrix_world=ob.matrix_world.copy();st.select_set(True);static.append(st)
bpy.context.view_layer.objects.active=static[0];bpy.ops.export_scene.gltf(filepath=str(A/'medieval-rowers-ue.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True)
for ob in allmesh:ob.hide_render=ob.parent!=rigs[2]
for ob in static:ob.hide_render=True
centre=rigs[2].location.copy();sc.camera.location=centre+Vector((2.3,-3.6,1.6));sc.camera.rotation_euler=(centre+Vector((0,-.06,1.15))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.render.engine='CYCLES';sc.cycles.device='CPU';sc.cycles.samples=12;sc.render.resolution_x=1000;sc.render.resolution_y=1000;sc.render.resolution_percentage=100;sc.render.filepath=str(O/'rower-detail.png');bpy.ops.render.render(write_still=True)
(A/'report.json').write_text(json.dumps({'actors':len(rigs),'anatomicalHeadHands':'MakeHuman CC0 base mesh, actual geometry and five separate fingers','costume':'12th-13th century western European mail coif, conical nasal helmet, wool tunic, hose and closed leather boots','retainedOriginalRigAndGrip':True,'native':str(O/'medieval-rowers.blend'),'webBytes':(A/'medieval-rowers.glb').stat().st_size,'ueBytes':(A/'medieval-rowers-ue.glb').stat().st_size,'meshes':len(new)},indent=2));print('V162_MEDIEVAL_ROWERS_READY',flush=True)
