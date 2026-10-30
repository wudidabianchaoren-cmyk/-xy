"""Bake lighting-free PBR channels and expand the visually inspected rigged prototype."""
import bpy,json,math,random
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
P=Path(__file__).resolve().parents[1];O=P/'blender/mythology-v32-145';A=P/'assets/odyssey/refit-v145';T=A/'textures';T.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(O/'01-complete-rigged-warrior.blend'))
rig=bpy.data.objects['V145 captain rig'];body=bpy.data.objects['V145 adult male anatomical body'];sc=bpy.context.scene
restPose={p.name:(p.rotation_mode,p.rotation_quaternion.copy(),p.rotation_euler.copy()) for p in rig.pose.bones}
for p in rig.pose.bones:p.matrix_basis=Matrix.Identity(4)
bpy.context.view_layer.update()
parts=[o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' and m.object==rig for m in o.modifiers)]
for o in parts:
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
 for mod in list(o.modifiers):
  if mod.type!='ARMATURE':bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.ops.object.select_all(action='DESELECT')
for o in parts:o.select_set(True)
bpy.context.view_layer.objects.active=body;bpy.ops.object.join();body.name='V145 joined rigged warrior';body.data.name='V145 complete garment and anatomical skin'
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.15,island_margin=.003,area_weight=.5);bpy.ops.object.mode_set(mode='OBJECT')
sc.cycles.samples=8;sc.render.bake.margin=8;sc.render.bake.use_clear=True;sc.render.bake.use_selected_to_active=False
for m in body.data.materials:
 if not m or not m.use_nodes:continue
 nd=m.node_tree.nodes;lk=m.node_tree.links
 for n in list(nd):
  if n.type=='TEX_NOISE':
   coord=nd.new('ShaderNodeTexCoord');lk.new(coord.outputs['Object'],n.inputs['Vector'])
 # Modest mineral/oxidation variation belongs to the metal, rather than dirt
 # or light being painted indiscriminately over the entire actor.
 pr=nd.get('Principled BSDF')
 if pr and m.name=='V145 dark worked bronze':
  tex=nd.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=22;tex.inputs['Detail'].default_value=2
  coord=nd.new('ShaderNodeTexCoord');lk.new(coord.outputs['Object'],tex.inputs['Vector'])
  ramp=nd.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=(.061,.067,.051,1);ramp.color_ramp.elements[1].color=(.145,.135,.101,1);lk.new(tex.outputs['Fac'],ramp.inputs['Fac']);lk.new(ramp.outputs['Color'],pr.inputs['Base Color'])
def bake(name,kind,color=True):
 image=bpy.data.images.new(name,width=2048,height=2048,alpha=False);image.colorspace_settings.name='sRGB' if color else 'Non-Color'
 for m in body.data.materials:
  if not m or not m.use_nodes:continue
  nd=m.node_tree.nodes
  for n in nd:n.select=False
  n=nd.new('ShaderNodeTexImage');n.image=image;n.select=True;nd.active=n
 if kind=='DIFFUSE':
  restore=[]
  for m in body.data.materials:
   if not m or not m.use_nodes:continue
   nd=m.node_tree.nodes;lk=m.node_tree.links;pr=next(n for n in nd if n.type=='BSDF_PRINCIPLED');out=next(n for n in nd if n.type=='OUTPUT_MATERIAL');links=[(l.from_socket,l.to_socket) for l in list(lk) if l.to_node==out];restore.append((m,out,links))
   for l in list(lk):
    if l.to_node==out:lk.remove(l)
   em=nd.new('ShaderNodeEmission');em.inputs['Color'].default_value=pr.inputs['Base Color'].default_value
   if pr.inputs['Base Color'].is_linked:lk.new(pr.inputs['Base Color'].links[0].from_socket,em.inputs['Color'])
   lk.new(em.outputs[0],out.inputs['Surface'])
  bpy.ops.object.bake(type='EMIT')
  for m,out,links in restore:
   lk=m.node_tree.links
   for l in list(lk):
    if l.to_node==out:lk.remove(l)
   for a,b in links:lk.new(a,b)
 else:bpy.ops.object.bake(type=kind)
 image.filepath_raw=str(T/(name+'.png'));image.file_format='PNG';image.save();print('BAKED',name,flush=True);return image
base=bake('warrior_basecolor','DIFFUSE');rough=bake('warrior_roughness','ROUGHNESS',False);normal=bake('warrior_normal','NORMAL',False)
original=[]
for m in body.data.materials:
 if not m or not m.use_nodes:continue
 nd=m.node_tree.nodes;lk=m.node_tree.links;out=next(n for n in nd if n.type=='OUTPUT_MATERIAL');pr=nd.get('Principled BSDF');original.append((m,out,[(l.from_socket,l.to_socket) for l in list(lk) if l.to_node==out]))
 for l in list(lk):
  if l.to_node==out:lk.remove(l)
 em=nd.new('ShaderNodeEmission');em.inputs['Color'].default_value=(pr.inputs['Metallic'].default_value,)*3+(1,);lk.new(em.outputs[0],out.inputs['Surface'])
metal=bake('warrior_metallic','EMIT',False)
for m,out,links in original:
 lk=m.node_tree.links
 for l in list(lk):
  if l.to_node==out:lk.remove(l)
 for a,b in links:lk.new(a,b)
pixels=np.array(rough.pixels[:],dtype=np.float32).reshape(-1,4);mp=np.array(metal.pixels[:],dtype=np.float32).reshape(-1,4);pixels[:,0]=1;pixels[:,2]=mp[:,0];pixels[:,3]=1
orm=bpy.data.images.new('warrior_orm',width=2048,height=2048,alpha=False);orm.colorspace_settings.name='Non-Color';orm.pixels.foreach_set(pixels.ravel());orm.filepath_raw=str(T/'warrior_orm.png');orm.file_format='PNG';orm.save()
mat=bpy.data.materials.new('V145 authored PBR atlas / skin cloth leather bronze');mat.use_nodes=True;nd=mat.node_tree.nodes;lk=mat.node_tree.links;pr=next((n for n in nd if n.type=='BSDF_PRINCIPLED'),None)
if pr is None:
 pr=nd.new('ShaderNodeBsdfPrincipled');output=nd.new('ShaderNodeOutputMaterial');lk.new(pr.outputs['BSDF'],output.inputs['Surface'])
def tex(image):n=nd.new('ShaderNodeTexImage');n.image=image;return n
c=tex(base);lk.new(c.outputs['Color'],pr.inputs['Base Color']);n=tex(normal);nm=nd.new('ShaderNodeNormalMap');lk.new(n.outputs['Color'],nm.inputs['Color']);lk.new(nm.outputs['Normal'],pr.inputs['Normal']);o=tex(orm);sep=nd.new('ShaderNodeSeparateColor');lk.new(o.outputs['Color'],sep.inputs['Color']);lk.new(sep.outputs['Green'],pr.inputs['Roughness']);lk.new(sep.outputs['Blue'],pr.inputs['Metallic'])
body.data.materials.clear();body.data.materials.append(mat)
for f in body.data.polygons:f.material_index=0
# Build each rig from the same validated rest mesh; poses remain genuine joint
# rotations, and every rig retains independent animation rather than vertex waves.
actors=json.loads((P/'assets/odyssey/refit-v141/production.json').read_text(encoding='utf-8'))['actors'];fleet=[];rigs=[]
def worldq(r,name,axis,angle):
 pb=r.pose.bones[name];rest=pb.bone.matrix_local.to_quaternion();pb.rotation_mode='QUATERNION';pb.rotation_quaternion=rest.inverted()@Quaternion(axis,angle)@rest
def aim(r,name,head,target):
 pb=r.pose.bones[name];rest=pb.bone;direction=Vector(target)-Vector(head);q=(rest.tail_local-rest.head_local).rotation_difference(direction);matrix=(q@rest.matrix_local.to_quaternion()).to_matrix().to_4x4();matrix.translation=head;pb.matrix=matrix;bpy.context.view_layer.update()
for k,a in enumerate(actors):
 r=rig.copy();r.data=rig.data.copy();r.name='V145 crew %02d skeleton'%k;bpy.context.collection.objects.link(r)
 m=body.copy();m.data=body.data;m.name='V145 crew %02d complete costume'%k;bpy.context.collection.objects.link(m);m.parent=r
 for mod in m.modifiers:
  if mod.type=='ARMATURE':mod.object=r
 for pb in r.pose.bones:pb.matrix_basis=Matrix.Identity(4)
 for side in [-1,1]:
  worldq(r,'upper'+str(side),(0,1,0),side*(.28 if side==1 else .34));worldq(r,'fore'+str(side),(1,0,0),-.20 if side==1 else -.12)
 if a['seated']:
  for side in [-1,1]:
   worldq(r,'thigh'+str(side),(1,0,0),-1.38);worldq(r,'shin'+str(side),(1,0,0),1.57)
  bpy.context.view_layer.update()
  for side in [-1,1]:
   shoulder=Vector((side*.17,0,1.445));elbow=Vector((side*.235,-.175,1.25));wrist=elbow+(Vector((side*.105,-.380,1.16))-elbow).normalized()*.24
   aim(r,'upper'+str(side),shoulder,elbow);aim(r,'fore'+str(side),elbow,wrist)
  shift=Vector((a['corseletCenter'][0],a['corseletCenter'][1],a['corseletCenter'][2]-.985));angle=math.pi*.5
  # Rowers occupy their original benches and retain left/right differences.
  shift.x-=.025;shift.y+=.01*math.sin(k)
 else:
  shift=Vector((a['corseletCenter'][0],a['corseletCenter'][1],min(f['min'][2] for f in a['feet'])));angle=.20 if k==0 else math.pi*.60
 r.location=shift;r.rotation_euler.z=angle;r['crewId']=k;m['crewId']=k;r['seated']=a['seated'];fleet.append(m);rigs.append(r)
 r.pose.bones['head'].rotation_mode='XYZ';r.pose.bones['head'].rotation_euler.z=.035*math.sin(k*1.618)
 baseline={pb.name:pb.rotation_quaternion.copy() for pb in r.pose.bones if pb.rotation_mode=='QUATERNION'}
 for frame in [1,61,121,181,241]:
  t=(frame-1)/240*math.tau;phase=k*1.618
  for bn in ['chest','head']:
   pb=r.pose.bones[bn];pb.rotation_mode='XYZ';pb.rotation_euler=(.010*math.sin(t+phase),.008*math.sin(t+phase*.7),.015*math.sin(t+phase)+(.025*math.sin(k) if bn=='head' else 0));pb.keyframe_insert(data_path='rotation_euler',frame=frame)
  for side in [-1,1]:
   pb=r.pose.bones['fore'+str(side)];pb.rotation_quaternion=baseline[pb.name]@Quaternion((1,0,0),.035*math.sin(t+phase) if a['seated'] else .014*math.sin(t+phase));pb.keyframe_insert(data_path='rotation_quaternion',frame=frame)
sc.frame_start=1;sc.frame_end=241;sc.render.fps=30;sc.frame_set(1)
body.hide_render=True;body.hide_set(True);rig.hide_set(True)
# A seated prototype is reviewed before publishing the fourteen-person asset.
for k,(m,r) in enumerate(zip(fleet,rigs)):m.hide_render=k!=2
cam=sc.camera;cam.location=rigs[2].location+Vector((2.9,-3.2,2.1));target=rigs[2].location+Vector((0,0,1.1));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();sc.cycles.samples=24;sc.render.filepath=str(O/'06-rower-prototype.png');bpy.ops.render.render(write_still=True)
for m in fleet:m.hide_render=False
bpy.ops.wm.save_as_mainfile(filepath=str(O/'07-rigged-fleet-pbr.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in fleet+rigs:ob.select_set(True)
bpy.context.view_layer.objects.active=fleet[0]
bpy.ops.export_scene.gltf(filepath=str(A/'rigged-crew.glb'),export_format='GLB',use_selection=True,export_apply=False,export_animations=True,export_extras=True,export_yup=True)
bpy.ops.export_scene.fbx(filepath=str(A/'rigged-crew.fbx'),use_selection=True,object_types={'ARMATURE','MESH'},add_leaf_bones=False,bake_anim=True,bake_anim_use_all_actions=False,bake_anim_use_nla_strips=False,axis_forward='-Y',axis_up='Z')
(A/'production.json').write_text(json.dumps({'actors':actors,'count':len(fleet),'bonesPerActor':len(rig.data.bones),'source':'CC0 Blender human base meshes / original authored costume','materials':'Separate albedo, normal, roughness and metallic; no lighting baked into albedo','rigged':True,'glbBytes':(A/'rigged-crew.glb').stat().st_size,'prototypeTriangles':sum(len(p.vertices)-2 for p in body.data.polygons)},indent=2),encoding='utf-8')
print('FLEET_READY',len(fleet),(A/'rigged-crew.glb').stat().st_size,flush=True)
