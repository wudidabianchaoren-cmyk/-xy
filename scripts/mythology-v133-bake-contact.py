import bpy,json,time
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v133';O=R/'blender/mythology-v32-133';bpy.ops.wm.open_mainfile(filepath=str(O/'compact-cove-final.blend'));sc=bpy.context.scene;land=bpy.data.objects['V133_ISLAND'];mesh=land.data;uv=mesh.uv_layers.new(name='V133 unique contact UV');mesh.uv_layers.active=uv
for polygon in mesh.polygons:
 for li in polygon.loop_indices:
  p=mesh.vertices[mesh.loops[li].vertex_index].co;uv.data[li].uv=((p.x+56)/103,(p.y+4)/90)
image=bpy.data.images.new('V133 native ground and rooted foliage contact AO',width=2048,height=2048,alpha=False);image.colorspace_settings.name='Non-Color';image.filepath_raw=str(A/'contact-ao.png');image.file_format='PNG'
for material in mesh.materials:
 node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;material.node_tree.nodes.active=node
bpy.ops.object.select_all(action='DESELECT');land.select_set(True);bpy.context.view_layer.objects.active=land;sc.cycles.device='GPU';sc.cycles.samples=24;sc.render.bake.use_selected_to_active=False;sc.render.bake.margin=8
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
if hasattr(sc.world,'light_settings'):sc.world.light_settings.distance=3
if hasattr(sc.cycles,'ao_bounces_distance'):sc.cycles.ao_bounces_distance=3
t=time.time();bpy.ops.object.bake(type='AO');image.save();report={'actualCyclesGpuBake':True,'size':[2048,2048],'samples':24,'seconds':time.time()-t,'source':'actual native grounded trees, shrubs and rocks'};(A/'contact-bake.json').write_text(json.dumps(report,indent=2));print(json.dumps(report));bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove-contact.blend'))
