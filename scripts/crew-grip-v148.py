import bpy,math,json
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v146';O=P/'blender/mythology-v32-146'
bpy.ops.wm.open_mainfile(filepath=str(O/'rigged-fleet-v147.blend'));sc=bpy.context.scene;sc.frame_set(1)
probe=json.loads((P/'.verify/v32-146/crew-grip-probe-v148.json').read_text());shafts={int(k):(Vector(a),Vector(c)) for k,(a,c) in probe['shafts'].items()}
rigs=sorted([o for o in sc.objects if o.type=='ARMATURE' and 'skeleton' in o.name],key=lambda o:o.name)
wood=bpy.data.materials.new('V148 lengthwise ash oar loom');wood.use_nodes=True;nd=wood.node_tree.nodes;lk=wood.node_tree.links;pr=next((n for n in nd if n.type=='BSDF_PRINCIPLED'),None)
if not pr:pr=nd.new('ShaderNodeBsdfPrincipled');out=nd.new('ShaderNodeOutputMaterial');lk.new(pr.outputs[0],out.inputs['Surface'])
pr.inputs['Base Color'].default_value=(.13,.073,.033,1);pr.inputs['Roughness'].default_value=.82
# Actual UV wood grain, not a single identical mirror response.
for fn,socket,color in [('wood_planks_diff_1k.jpg','Base Color',True),('wood_planks_rough_1k.jpg','Roughness',False)]:
 tx=nd.new('ShaderNodeTexImage');im=bpy.data.images.load(str(P/'assets/odyssey/wood_planks'/fn),check_existing=True);im.colorspace_settings.name='sRGB' if color else 'Non-Color';tx.image=im;lk.new(tx.outputs['Color'],pr.inputs[socket])
def pole(name,a,c,parent):
 bpy.ops.object.select_all(action='DESELECT');delta=c-a;bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=.027,depth=delta.length,end_fill_type='NGON',location=(a+c)*.5);ob=bpy.context.object;ob.name=name;ob.rotation_euler=delta.to_track_quat('Z','Y').to_euler();bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 # The UV length direction is the wood fibre direction.
 if ob.data.uv_layers:
  for uv in ob.data.uv_layers.active.data:uv.uv.y*=3.0
 ob.data.materials.append(wood);world=ob.matrix_world.copy();ob.parent=parent;ob.matrix_world=world
 for f in ob.data.polygons:f.use_smooth=len(f.vertices)==4
 ob.select_set(False);return ob

def ik_pose(r,side,target):
 hand=r.pose.bones['hand'+str(side)];fore=r.pose.bones['fore'+str(side)];upper=r.pose.bones['upper'+str(side)];mesh=next(o for o in sc.objects if o.type=='MESH' and o.parent==r and 'costume' in o.name);g=mesh.vertex_groups[hand.name]
 ids=[v.index for v in mesh.data.vertices if v.index<10582 and any(w.group==g.index and w.weight>.65 for w in v.groups)];offset=sum((hand.bone.matrix_local.inverted()@mesh.data.vertices[q].co for q in ids),Vector())/len(ids)
 oldq=hand.matrix.to_quaternion();wrist=target-oldq@offset
 # Solve a two-link anatomical chain with an outward/downward elbow plane.
 # This avoids an IK pole roll that can drive an elbow through the cuirass.
 shoulder=upper.head.copy();d=wrist-shoulder;dist=d.length;direction=d.normalized();l1=upper.bone.length;l2=fore.bone.length
 along=(l1*l1-l2*l2+dist*dist)/(2*dist);height=max(0,l1*l1-along*along)**.5
 bend=Vector((side*.85,.10,-.80));bend=(bend-direction*bend.dot(direction)).normalized();elbow=shoulder+direction*along+bend*height
 for pb,start,end in [(upper,shoulder,elbow),(fore,elbow,wrist)]:
  rest=pb.bone;q=(rest.tail_local-rest.head_local).rotation_difference(end-start);mm=(q@rest.matrix_local.to_quaternion()).to_matrix().to_4x4();mm.translation=start;pb.matrix=mm;bpy.context.view_layer.update()
 mm=oldq.to_matrix().to_4x4();mm.translation=wrist;hand.matrix=mm;bpy.context.view_layer.update()
 actual=hand.matrix@offset;return {'target':list(target),'actual':list(actual),'error':float((actual-target).length),'reach':float((target-upper.head).length)}
metrics=[];newpoles=[]
for k,r in enumerate(rigs):
 if not r.get('seated'):continue
 r.animation_data_clear();a,c=shafts[k];inner=min([a,c],key=lambda v:(v-r.location).length);outer=c if (inner-a).length<.01 else a
 # Leave the sea end at its original exact position. The upper loom is shifted
 # a few degrees to stand in front of the rower's chest rather than behind it.
 outward=-1 if inner.y<r.location.y else 1
 midY=r.location.y;final=Vector((r.location.x+.35,midY-outward*.38,1.50+.30*.38))
 newpoles.append(pole('V148 replacement oar shaft crew%02d'%k,outer,final,r))
 # Distinct hand positions along the SAME continuous corrected shaft.
 contacts=[]
 for side in [-1,1]:
  wy=midY+side*.145;t=(wy-outer.y)/(final.y-outer.y);wp=outer+(final-outer)*t;local=r.matrix_world.inverted()@wp;contacts.append(ik_pose(r,side,local))
 baseline={pb.name:pb.matrix_basis.copy() for pb in r.pose.bones}
 for frame in [1,61,121,181,241]:
  phase=(frame-1)/240*math.tau+k*1.618
  for pb in r.pose.bones:
   pb.matrix_basis=baseline[pb.name];pb.rotation_mode='QUATERNION'
   if pb.name in ['head','chest']:pb.rotation_quaternion=pb.rotation_quaternion@Quaternion((0,0,1),.006*math.sin(phase))
   pb.keyframe_insert(data_path='rotation_quaternion',frame=frame);pb.keyframe_insert(data_path='location',frame=frame);pb.keyframe_insert(data_path='scale',frame=frame)
 metrics.append({'actor':k,'shaft':k,'hands':contacts,'originalInner':list(inner),'newInner':list(final),'seaEnd':list(outer)})
sc.frame_set(1);bpy.context.view_layer.update();meshes=[o for o in sc.objects if o.type=='MESH' and o.parent in rigs]
for ob in meshes:ob.hide_render=ob.parent!=rigs[2]
center=rigs[2].location.copy();sc.camera.location=center+Vector((2.8,-3.3,1.9));sc.camera.rotation_euler=(center+Vector((0,-.1,1.05))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.cycles.samples=32;sc.render.filepath=str(O/'rower-grip-v148.png');bpy.ops.render.render(write_still=True)
for ob in meshes:ob.hide_render=False
bpy.ops.wm.save_as_mainfile(filepath=str(O/'rigged-fleet-v148.blend'))
bpy.ops.object.select_all(action='DESELECT')
for ob in meshes+rigs:ob.hide_set(False);ob.select_set(True)
bpy.context.view_layer.objects.active=meshes[0]
bpy.ops.export_scene.gltf(filepath=str(A/'rigged-crew-v148.glb'),export_format='GLB',use_selection=True,export_animations=True,export_extras=True,export_yup=True,export_force_sampling=True)
bpy.ops.object.select_all(action='DESELECT');statics=[];deps=bpy.context.evaluated_depsgraph_get()
for ob in meshes:
 g=bpy.data.meshes.new_from_object(ob.evaluated_get(deps));st=bpy.data.objects.new(ob.name+' static UE',g);sc.collection.objects.link(st);st.matrix_world=ob.matrix_world.copy();st.select_set(True);statics.append(st)
bpy.context.view_layer.objects.active=statics[0];bpy.ops.export_scene.fbx(filepath=str(A/'complete-crew-static-v148.fbx'),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z')
(A/'crew-grip-v148.json').write_text(json.dumps({'actors':14,'grips':metrics,'replacementShafts':12,'oldShaftsToHide':'V112 ship0 row[0-5] oar shaft side[-1|1]'},indent=2));print('V148_GRIP_READY',flush=True)

