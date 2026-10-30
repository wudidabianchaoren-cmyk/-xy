import bpy,math,json
from pathlib import Path
from mathutils import Vector
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';world=bpy.context.scene
sc=bpy.data.scenes.new('V118_WEB_FOLIAGE_ONLY_CAPTURE');sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=8;sc.cycles.use_denoising=True;sc.cycles.transparent_max_bounces=12
sc.render.resolution_x=640;sc.render.resolution_y=640;sc.render.resolution_percentage=100;sc.render.film_transparent=True;sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_mode='RGBA';sc.view_settings.view_transform='Standard';sc.view_settings.exposure=0
for i in [0,2]:
 src=bpy.data.objects['V117 tree 000 part'+str(i)];ob=bpy.data.objects.new('V117 canopy capture '+str(i),src.data);sc.collection.objects.link(ob)
w=bpy.data.worlds.new('V117 canopy capture neutral daylight');w.use_nodes=True;bg=next(n for n in w.node_tree.nodes if n.type=='BACKGROUND');bg.inputs['Color'].default_value=(.65,.75,.85,1);bg.inputs['Strength'].default_value=.7;sc.world=w
ld=bpy.data.lights.new('V117 canopy capture sun','SUN');ld.energy=2.2;lo=bpy.data.objects.new('V117 canopy capture sun',ld);sc.collection.objects.link(lo);lo.rotation_euler=(.45,-.55,-.4)
ca=bpy.data.cameras.new('V117 canopy orthographic');co=bpy.data.objects.new('V117 canopy orthographic',ca);sc.collection.objects.link(co);ca.type='ORTHO';ca.ortho_scale=1.08;co.location=(0,-3,.54);co.rotation_euler=(Vector((0,0,.54))-co.location).to_track_quat('-Z','Y').to_euler();sc.camera=co
sc.render.filepath=str(O/'canopy-impostor.png');bpy.ops.render.render(write_still=True,scene=sc.name)
print('V118_FOLIAGE_ONLY_CAPTURED_NO_TRUNK_NO_GROUND_DISC')