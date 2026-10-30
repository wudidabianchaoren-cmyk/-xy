import bpy,json,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];O=P/'blender/mythology-v32-145';A=P/'assets/odyssey/refit-v145'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/source-v145/coastal_cliff_02/coastal_cliff_02_4k.gltf'))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];ps=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box];lo=Vector([min(p[i] for p in ps) for i in range(3)]);hi=Vector([max(p[i] for p in ps) for i in range(3)]);c=(lo+hi)/2
print('SCAN_DIMENSIONS',list(hi-lo),'CENTER',list(c),flush=True)
for o in meshes:
 o.location-=Vector((c.x,c.y,lo.z));o.name='V145 actual scanned coastal cliff';o['source']='Poly Haven coastal_cliff_02 / CC0';o['lightingBakedIntoBaseColor']=False
 for mat in o.data.materials:
  if mat and mat.use_nodes:
   pr=mat.node_tree.nodes.get('Principled BSDF')
   if pr:pr.inputs['Roughness'].default_value=1.;pr.inputs['Metallic'].default_value=0.
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=32;sc.cycles.use_denoising=True;sc.render.resolution_x=1600;sc.render.resolution_y=1000;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU';sc.world=bpy.data.worlds.new('Neutral outdoor sky');sc.world.use_nodes=True;sc.world.node_tree.nodes['Background'].inputs[0].default_value=(.35,.48,.65,1);sc.world.node_tree.nodes['Background'].inputs[1].default_value=.42
d=bpy.data.lights.new('Soft afternoon sun','SUN');d.energy=2.4;d.angle=math.radians(1.8);d.color=(1,.91,.78);sun=bpy.data.objects.new('Soft afternoon sun',d);bpy.context.collection.objects.link(sun);sun.rotation_euler=(.5,-.4,-.5)
camdata=bpy.data.cameras.new('Cliff inspection camera');cam=bpy.data.objects.new('Cliff inspection camera',camdata);bpy.context.collection.objects.link(cam);sc.camera=cam;camdata.lens=45
size=max(hi.x-lo.x,hi.y-lo.y);height=hi.z-lo.z;cam.location=(size*.35,-size*.85,height*1.15);target=Vector((0,0,height*.45));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
# Source has actual cavities and overhangs; only a local photographic plate is needed
# to validate form before the same mesh is placed around the retained island.
bpy.ops.wm.save_as_mainfile(filepath=str(O/'04-scanned-cliff-stage.blend'))
mat=bpy.data.materials.new('Neutral white clay');mat.diffuse_color=(.40,.41,.4,1);mat.use_nodes=True;mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.4,.41,.4,1);mat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.9
bpy.context.view_layer.material_override=mat;sc.render.filepath=str(O/'04-cliff-white.png');bpy.ops.render.render(write_still=True)
bpy.context.view_layer.material_override=None;sc.render.filepath=str(O/'05-cliff-material.png');bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT')
for o in meshes:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'scanned-cliff-02.glb'),export_format='GLB',use_selection=True,export_apply=True,export_image_format='JPEG',export_jpeg_quality=92)
print('CLIFF_STAGE_READY',flush=True)
