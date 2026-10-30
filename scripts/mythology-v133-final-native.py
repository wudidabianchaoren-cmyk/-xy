import bpy,math,time,json
from pathlib import Path
from mathutils import Vector
R=Path(__file__).resolve().parents[1];O=R/'blender/mythology-v32-133';bpy.ops.wm.open_mainfile(filepath=str(O/'compact-cove.blend'));sc=bpy.context.scene
world=sc.world;n=world.node_tree.nodes;l=world.node_tree.links;sky=n.new('ShaderNodeTexSky');sky.sky_type='MULTIPLE_SCATTERING';sky.sun_elevation=math.radians(31);sky.sun_rotation=math.radians(-40);sky.air_density=1;l.new(sky.outputs['Color'],n['Background'].inputs['Color']);n['Background'].inputs['Strength'].default_value=.22
water=bpy.data.materials['V133 sea / native path-traced surface'];n=water.node_tree.nodes;l=water.node_tree.links;geo=n.new('ShaderNodeNewGeometry');tex=next(v for v in n if v.bl_idname=='ShaderNodeTexNoise');l.new(geo.outputs['Position'],tex.inputs['Vector']);tex.inputs['Scale'].default_value=1.2
sc.camera.location=(42,-48,21);sc.camera.rotation_euler=(Vector((-6,18,10))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.lens=33.4
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.render.resolution_x=1920;sc.render.resolution_y=1080;sc.cycles.samples=128;sc.view_settings.exposure=-.2;sc.render.filepath=str(O/'cycles-final-1920.png');bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove-final.blend'));t=time.time();bpy.ops.render.render(write_still=True);report={'actualGPU':'NVIDIA RTX 4060 Laptop / CUDA','actualCyclesRender':True,'samples':128,'resolution':[1920,1080],'seconds':time.time()-t,'native':'compact-cove-final.blend'};(O/'final-render.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))


