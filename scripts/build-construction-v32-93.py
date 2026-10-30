import bpy,json,pathlib,math,numpy as np
from mathutils import Vector,Matrix
p=pathlib.Path.cwd();out=p/'blender/home-construction-v32-93';out.mkdir(exist_ok=True);tmp=pathlib.Path('F:/codex-construction-v93');tmp.mkdir(exist_ok=True);s=bpy.context.scene;s.frame_set(1)
source=list(s.objects);materials=list(bpy.data.materials);base_meshes=sum(o.type=='MESH' for o in source)
# A new native timeline, frozen source files remain untouched.
for o in source:
 if o.animation_data:o.animation_data_clear()
 if o.data and getattr(o.data,'animation_data',None):o.data.animation_data_clear()
# Consolidate the 37,433 native foliage pieces once; geometry and material are preserved.
for material_name in ['Material_56','Material_57']:
 objs=[o for o in list(s.objects) if o.type=='MESH' and len(o.data.materials)==1 and o.data.materials[0].name==material_name]
 verts=[];loops=[];starts=[];totals=[];uvs=[];offset=0;loffset=0
 for o in objs:
  m=o.data;n=len(m.vertices);v=np.empty(n*3,np.float32);m.vertices.foreach_get('co',v);v=v.reshape(-1,3);mat=np.array(o.matrix_world,dtype=np.float32);v=v@mat[:3,:3].T+mat[:3,3];verts.append(v.ravel())
  l=np.empty(len(m.loops),np.int32);m.loops.foreach_get('vertex_index',l);loops.append(l+offset)
  a=np.empty(len(m.polygons),np.int32);b=a.copy();m.polygons.foreach_get('loop_start',a);m.polygons.foreach_get('loop_total',b);starts.append(a+loffset);totals.append(b)
  if m.uv_layers:
   u=np.empty(len(m.loops)*2,np.float32);m.uv_layers[0].data.foreach_get('uv',u)
  else:u=np.zeros(len(m.loops)*2,np.float32)
  uvs.append(u);offset+=n;loffset+=len(m.loops)
 me=bpy.data.meshes.new('Native forest consolidated '+material_name);me.vertices.add(offset);me.vertices.foreach_set('co',np.concatenate(verts));me.loops.add(loffset);me.loops.foreach_set('vertex_index',np.concatenate(loops));count=sum(len(a)for a in starts);me.polygons.add(count);me.polygons.foreach_set('loop_start',np.concatenate(starts));me.polygons.foreach_set('loop_total',np.concatenate(totals));me.polygons.foreach_set('use_smooth',np.ones(count,bool));me.uv_layers.new(name='UVMap').data.foreach_set('uv',np.concatenate(uvs));me.materials.append(bpy.data.materials[material_name]);me.update()
 obj=bpy.data.objects.new('Construction / native forest / '+material_name,me);s.collection.objects.link(obj)
 bpy.data.batch_remove(ids=objs)
 print('Consolidated',material_name,len(objs),offset,flush=True)
# Animate genuine mesh clipping with a construction front, not a dissolve of still images.
def reveal(obj,start,end,group=None):
 ng=bpy.data.node_groups.new('Build '+obj.name,'GeometryNodeTree');ng.interface.new_socket(name='Geometry',in_out='INPUT',socket_type='NodeSocketGeometry');ng.interface.new_socket(name='Geometry',in_out='OUTPUT',socket_type='NodeSocketGeometry');ns=ng.nodes;ls=ng.links;i=ns.new('NodeGroupInput');o=ns.new('NodeGroupOutput');pos=ns.new('GeometryNodeInputPosition');xyz=ns.new('ShaderNodeSeparateXYZ');ls.new(pos.outputs['Position'],xyz.inputs[0]);cmp=ns.new('ShaderNodeMath');cmp.operation='GREATER_THAN';ls.new(xyz.outputs['Z'],cmp.inputs[0]);cmp.inputs[1].default_value=-1;cmp.inputs[1].keyframe_insert('default_value',frame=start);cmp.inputs[1].default_value=14;cmp.inputs[1].keyframe_insert('default_value',frame=end)
 sel=cmp.outputs[0]
 if group:
  a=ns.new('ShaderNodeMath');a.operation='LESS_THAN' if group=='right' else 'GREATER_THAN';ls.new(xyz.outputs['X'],a.inputs[0]);a.inputs[1].default_value=3.6 if group=='right' else -3.6
  if group=='main':
   a.inputs[1].default_value=3.6;b=ns.new('ShaderNodeMath');b.operation='LESS_THAN';ls.new(xyz.outputs['X'],b.inputs[0]);b.inputs[1].default_value=-3.6;c=ns.new('ShaderNodeMath');c.operation='MAXIMUM';ls.new(a.outputs[0],c.inputs[0]);ls.new(b.outputs[0],c.inputs[1]);a=c
  c=ns.new('ShaderNodeMath');c.operation='MAXIMUM';ls.new(a.outputs[0],c.inputs[0]);ls.new(sel,c.inputs[1]);sel=c.outputs[0]
 delete=ns.new('GeometryNodeDeleteGeometry');delete.domain='FACE';ls.new(i.outputs[0],delete.inputs['Geometry']);ls.new(sel,delete.inputs['Selection']);ls.new(delete.outputs[0],o.inputs[0]);mod=obj.modifiers.new('Build from the ground','NODES');mod.node_group=ng
 if ng.animation_data:
  for curve in ng.animation_data.action.layers[0].strips[0].channelbag(ng.animation_data.action_slot).fcurves:
   for k in curve.keyframe_points:k.interpolation='BEZIER'
for obj in list(s.objects):
 if obj.type!='MESH':continue
 obj.data=obj.data.copy();obj.data.transform(obj.matrix_world);obj.matrix_world=Matrix.Identity(4)
 name=obj.name;bounds=[Vector(v)for v in obj.bound_box];z=max(v.z for v in bounds);y=min(v.y for v in bounds)
 if 'native forest' in name:reveal(obj,151,211);continue
 if z<.1:continue
 if y>5:reveal(obj,151,204);continue
 for group,start,end in [('main',25,91),('left',91,135),('right',120,166)]:
  new=obj.copy();new.data=obj.data;s.collection.objects.link(new);new.name='Build '+group+' / '+name;reveal(new,start,end,group)
 bpy.data.objects.remove(obj,do_unlink=True)
# Real cube at the beginning: one primitive extends into the first structural mass.
bpy.ops.mesh.primitive_cube_add(size=2,location=(-.15,1.2,1));cube=bpy.context.object;cube.name='01 / the first cube';clay=bpy.data.materials.new('Construction / ivory study');clay.diffuse_color=(.42,.39,.33,1);clay.use_nodes=True;bs=next((v for v in clay.node_tree.nodes if v.type=='BSDF_PRINCIPLED'),None) or clay.node_tree.nodes.new('ShaderNodeBsdfPrincipled');bs.inputs['Base Color'].default_value=(.42,.39,.33,1);bs.inputs['Roughness'].default_value=.6;cube.data.materials.append(clay)
for frame,scale,loc in [(1,(1,1,1),(-.15,1.2,1)),(16,(1.5,1.3,1),(-.15,1.2,1)),(27,(1.5,1.3,.3),(-.15,1.2,.3)),(37,(.001,.001,.001),(-.15,1.2,0))]:cube.scale=scale;cube.location=loc;cube.keyframe_insert('scale',frame=frame);cube.keyframe_insert('location',frame=frame)
# All original linked textures remain connected; an animated BSDF blend exposes them in stages.
for m in materials:
 if not m.use_nodes:continue
 ns=m.node_tree.nodes;ls=m.node_tree.links;output=next((n for n in ns if n.type=='OUTPUT_MATERIAL' and n.is_active_output),None)
 if not output or not output.inputs['Surface'].links:continue
 old=output.inputs['Surface'].links[0].from_socket;white=ns.new('ShaderNodeBsdfPrincipled');white.inputs['Base Color'].default_value=(.42,.39,.33,1);white.inputs['Roughness'].default_value=.63;mix=ns.new('ShaderNodeMixShader');ls.new(white.outputs[0],mix.inputs[1]);ls.new(old,mix.inputs[2]);ls.new(mix.outputs[0],output.inputs['Surface']);mix.inputs[0].default_value=0;mix.inputs[0].keyframe_insert('default_value',frame=211);mix.inputs[0].default_value=1;mix.inputs[0].keyframe_insert('default_value',frame=291)
# Neutral sculptural study light resolves to the retained amber lighting.
for o in s.objects:
 if o.type=='LIGHT':
  energy=o.data.energy;color=list(o.data.color);o.data.color=(1,.94,.84);o.data.keyframe_insert('color',frame=241);o.data.color=color;o.data.keyframe_insert('color',frame=331);o.data.energy=energy*(.1 if 'practical' in o.name else 1.1);o.data.keyframe_insert('energy',frame=241);o.data.energy=energy;o.data.keyframe_insert('energy',frame=331)
# Carefully bounded three-quarter camera; the final composition matches the native wide view.
cam=s.camera;cam.data.type='PERSP';cam.data.sensor_width=36;cam.data.sensor_fit='HORIZONTAL'
for f,position,target,lens in [(1,(9,-32,15),(0,2,3.2),42),(91,(7,-30,12),(0,2,3.9),42),(211,(5,-28,9),(0,2,4),40),(331,(3.8,-26.5,6.2),(.1,1,4),39.5),(420,(3.8,-26.5,6.2),(.1,1,4),39.5)]:
 cam.location=position;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=lens;cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f);cam.data.keyframe_insert('lens',frame=f)
s.render.engine='CYCLES';prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
s.cycles.device='GPU';s.cycles.samples=16;s.cycles.use_denoising=True;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.08;s.cycles.max_bounces=5;s.cycles.diffuse_bounces=2;s.cycles.glossy_bounces=3;s.cycles.transparent_max_bounces=4
s.render.resolution_x=1600;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.fps=30;s.frame_start=1;s.frame_end=420;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.filepath=str(tmp/'frame-');s.render.use_file_extension=True;s.render.use_persistent_data=True
# No narration or competing text; the geometry tells the process.
s.world.color=(.015,.02,.015);s.view_settings.view_transform='AgX';s.view_settings.look='None';s.view_settings.exposure=-.3
s.frame_set(420);bpy.ops.wm.save_as_mainfile(filepath=str(out/'courtyard-construction.blend'),compress=True)
audit={'blender':bpy.app.version_string,'duration':14,'fps':30,'frames':420,'originalNativeMeshCount':base_meshes,'animatedMeshCount':sum(o.type=='MESH'for o in s.objects),'engine':'Cycles CUDA','samples':16,'source':'reference-architecture-v24/current-complete-courtyard.blend','steps':[['cube',1,37],['clock tower',25,91],['west buildings',91,135],['cloister',120,166],['forest and background',151,211],['native textures',211,291],['amber lighting',241,331],['final hold',331,420]],'sourceFilesModified':False,'renderDirectory':str(tmp)};(out/'construction-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8')
for f in [1,180,420]:s.frame_set(f);s.render.filepath=str(out/f'proof-{f:04d}.png');bpy.ops.render.render(write_still=True)
print('CONSTRUCTION_READY',flush=True)



