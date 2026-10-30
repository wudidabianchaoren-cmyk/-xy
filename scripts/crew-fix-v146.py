"""Continue saved V145 fleet without rerunning the PBR bake."""
import bpy,math,json
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v146';O=P/'blender/mythology-v32-146';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-145/07-rigged-fleet-pbr.blend'))
sc=bpy.context.scene;rigs=sorted([o for o in sc.objects if o.type=='ARMATURE' and 'skeleton' in o.name],key=lambda o:o.name);meshes=[]
atlas=bpy.data.materials['V145 authored PBR atlas / skin cloth leather bronze']
cloth=bpy.data.materials.new('V146 undyed charcoal flax lap drape');cloth.use_nodes=True;pr=next((n for n in cloth.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
if pr is None:
 pr=cloth.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=cloth.node_tree.nodes.new('ShaderNodeOutputMaterial');cloth.node_tree.links.new(pr.outputs[0],out.inputs['Surface'])
pr.inputs['Base Color'].default_value=(.058,.064,.052,1);pr.inputs['Roughness'].default_value=.94
nd=cloth.node_tree.nodes;lk=cloth.node_tree.links;n=nd.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=240;b=nd.new('ShaderNodeBump');b.inputs['Distance'].default_value=.0004;b.inputs['Strength'].default_value=.2;lk.new(n.outputs['Fac'],b.inputs['Height']);lk.new(b.outputs['Normal'],pr.inputs['Normal'])
def aim(r,name,head,target):
 pb=r.pose.bones[name];rest=pb.bone;direction=Vector(target)-Vector(head);q=(rest.tail_local-rest.head_local).rotation_difference(direction);matrix=(q@rest.matrix_local.to_quaternion()).to_matrix().to_4x4();matrix.translation=head;pb.matrix=matrix;bpy.context.view_layer.update()
contact=[]
for k,r in enumerate(rigs):
 m=next(o for o in sc.objects if o.type=='MESH' and o.parent==r);m.data=m.data.copy();m.data.materials.clear();m.data.materials.append(atlas)
 for slot in m.material_slots:slot.link='DATA';slot.material=atlas
 for f in m.data.polygons:f.material_index=0
 meshes.append(m);r.animation_data_clear();sc.frame_set(1)
 if r.get('seated'):
  for side in [-1,1]:
   shoulder=r.pose.bones['upper'+str(side)].head.copy();elbow=Vector((side*.29,-.16,1.20));wrist=elbow+(Vector((side*.22,-.43,1.15))-elbow).normalized()*.24
   aim(r,'upper'+str(side),shoulder,elbow);aim(r,'fore'+str(side),r.pose.bones['fore'+str(side)].head.copy(),wrist)
   # Keep the palm continuation aligned outward, rather than both open hands
   # interleaving at the center line. Finger grip remains a later art task.
   hand=r.pose.bones['hand'+str(side)];hh=hand.head.copy();aim(r,hand.name,hh,hh+Vector((side*.055,-.075,-.012)))
  # Cloth crosses the lap as a continuous folded surface, not two short legs.
  ev=m.evaluated_get(bpy.context.evaluated_depsgraph_get());posed=ev.to_mesh();vertices=[v.co.copy() for v in posed.vertices];faces=[tuple(f.vertices) for f in posed.polygons if .45<f.center.z<1.04];surface=BVHTree.FromPolygons(vertices,faces);ev.to_mesh_clear()
  v=[];f=[];nx=25;ny=23
  for j in range(ny):
   t=j/(ny-1);y=-.03-.47*t;z=.945-.11*t-.075*max(0,(t-.76)/.24)
   for i in range(nx):
    u=i/(nx-1)*2-1;x=u*(.212+.055*t);height=z+.012*math.cos(u*math.pi*7)*math.sin(t*math.pi*.8)-.062*abs(u)**4
    hit,normal,idx,dist=surface.ray_cast(Vector((x,y,1.06)),Vector((0,0,-1)),.7)
    if hit is not None:height=max(height,hit.z+.019)
    v.append((x,y,height))
  for j in range(ny-1):
   for i in range(nx-1):q=j*nx+i;f.append((q,q+1,q+nx+1,q+nx))
  g=bpy.data.meshes.new('V146 continuous seated chiton');g.from_pydata(v,[],f);g.update();lap=bpy.data.objects.new('V146 crew %02d folded lap chiton'%k,g);sc.collection.objects.link(lap);lap.parent=r;g.materials.append(cloth)
  for poly in g.polygons:poly.use_smooth=True
  solid=lap.modifiers.new('Sewn cloth thickness','SOLIDIFY');solid.thickness=.003;meshes.append(lap)
 baseline={pb.name:pb.matrix_basis.copy() for pb in r.pose.bones}
 for frame in [1,61,121,181,241]:
  t=(frame-1)/240*math.tau;phase=k*1.618
  for pb in r.pose.bones:
   pb.matrix_basis=baseline[pb.name];pb.rotation_mode='QUATERNION'
   if pb.name in ['chest','head']:pb.rotation_quaternion=pb.rotation_quaternion@Quaternion((0,0,1),.012*math.sin(t+phase))
   # All joint transforms are keyed so conversion preserves the actual poses.
   pb.keyframe_insert(data_path='rotation_quaternion',frame=frame);pb.keyframe_insert(data_path='location',frame=frame);pb.keyframe_insert(data_path='scale',frame=frame)
 contact.append({'id':k,'seated':bool(r.get('seated')),'handsSeparated':(r.pose.bones['hand1'].head-r.pose.bones['hand-1'].head).length})
sc.frame_set(1)
# Reposition the existing studio lights along with the subject for honest close views.
center=rigs[2].location.copy()
for o in list(sc.objects):
 if o.type=='LIGHT':o.location+=center;o.rotation_euler=(center+Vector((0,0,1.1))-o.location).to_track_quat('-Z','Y').to_euler()
for o in meshes:o.hide_render=not (o.parent==rigs[2])
sc.camera.location=center+Vector((2.8,-3.3,1.9));sc.camera.rotation_euler=(center+Vector((0,-.1,1.05))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.cycles.samples=32;sc.render.filepath=str(O/'rower-contact.png');bpy.ops.render.render(write_still=True)
for o in meshes:o.hide_render=False
bpy.ops.wm.save_as_mainfile(filepath=str(O/'rigged-fleet-v146.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in meshes+rigs:o.hide_set(False);o.select_set(True)
bpy.context.view_layer.objects.active=meshes[0]
bpy.ops.export_scene.gltf(filepath=str(A/'rigged-crew.glb'),export_format='GLB',use_selection=True,export_animations=True,export_extras=True,export_yup=True,export_force_sampling=True)
bpy.ops.export_scene.fbx(filepath=str(A/'rigged-crew.fbx'),use_selection=True,object_types={'ARMATURE','MESH'},add_leaf_bones=False,bake_anim=True,bake_anim_use_all_actions=False,bake_anim_use_nla_strips=False,axis_forward='-Y',axis_up='Z')
# A posed, standalone static hero for the first real UE lighting test.
bpy.ops.object.select_all(action='DESELECT');hero=meshes[0].evaluated_get(bpy.context.evaluated_depsgraph_get());g=bpy.data.meshes.new_from_object(hero);ob=bpy.data.objects.new('V146 hero lookdev static',g);sc.collection.objects.link(ob);ob.select_set(True);bpy.context.view_layer.objects.active=ob
bpy.ops.export_scene.fbx(filepath=str(A/'warrior-lookdev.fbx'),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z')
(A/'production.json').write_text(json.dumps({'actors':14,'bones':17,'hands':contact,'bytes':(A/'rigged-crew.glb').stat().st_size,'note':'Corrected shared material slot links, noninterleaved palms, seated lap cloth; finger grip still basic'},indent=2),encoding='utf-8')
print('V146_FLEET_READY',flush=True)
