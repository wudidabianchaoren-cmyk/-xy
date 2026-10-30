import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117';scene=bpy.context.scene
for o in scene.objects:
 if o.type=='LIGHT':o.hide_render=True;o.hide_set(True)
def light(name,typ,pos,energy,color,size,target):
 d=bpy.data.lights.new(name,typ);d.energy=energy;d.color=color
 if typ=='SUN':d.angle=size
 if typ=='AREA':d.shape='DISK';d.size=size
 o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
light('V117 warm side-back sun','SUN',(-90,150,105),3.6,(1,.81,.57),.045,(-40,40,5))
light('V117 broad cool sky fill','AREA',(25,-90,70),10500,(.66,.80,1),75,(-50,100,8))
light('V117 cove bounce','AREA',(-70,55,20),2800,(1,.89,.69),30,(-145,116,13))
world=bpy.data.worlds.new('V117 dawn daylight / restrained environment');world.use_nodes=True;scene.world=world;n=world.node_tree.nodes;l=world.node_tree.links;bg=next(q for q in n if q.type=='BACKGROUND');sky=n.new('ShaderNodeTexSky');sky.sky_type='MULTIPLE_SCATTERING';sky.sun_elevation=math.radians(9);sky.sun_rotation=math.radians(118);sky.sun_disc=False;sky.altitude=.1;sky.air_density=1.1;bg.inputs['Strength'].default_value=.20;l.new(sky.outputs['Color'],bg.inputs['Color'])
# Bounded real volume lives behind the ship, rather than veiling all near materials.
bpy.ops.mesh.primitive_cube_add(size=2,location=(-65,151,27));mist=bpy.context.object;mist.name='V117 bounded woodland mist volume';mist.scale=(174,90,29);mist.display_type='WIRE';m=bpy.data.materials.new('V117 fine cool woodland haze');m.use_nodes=True;nodes=m.node_tree.nodes;links=m.node_tree.links;nodes.clear();output=nodes.new('ShaderNodeOutputMaterial');vol=nodes.new('ShaderNodeVolumePrincipled');vol.inputs['Color'].default_value=(.72,.79,.87,1);vol.inputs['Anisotropy'].default_value=.42;tex=nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=3.8;tex.inputs['Detail'].default_value=3;mul=nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=.0015;links.new(tex.outputs['Fac'],mul.inputs[0]);links.new(mul.outputs[0],vol.inputs['Density']);links.new(vol.outputs['Volume'],output.inputs['Volume']);mist.data.materials.append(m)
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=.20
scene.camera.location=(29,-61,16.5);scene.camera.rotation_euler=(Vector((-61,119,18))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=40;scene.camera.data.dof.use_dof=False
scene.render.engine='CYCLES';scene.cycles.device='GPU';pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.samples=24;scene.cycles.use_denoising=True;scene.cycles.adaptive_threshold=.08;scene.cycles.max_bounces=6;scene.cycles.diffuse_bounces=2;scene.cycles.glossy_bounces=3;scene.cycles.transparent_max_bounces=8;scene.cycles.volume_bounces=1;scene.cycles.use_light_tree=True
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'cycles-material-preview.png')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04-lighting-and-bounded-atmosphere.blend'))
(OUT/'04-lighting.json').write_text(json.dumps({'actualBlenderMcp':True,'engine':'Cycles CUDA','samples':24,'resolution':[1280,720],'rendererSeaGeometryUnchanged':True,'volume':'bounded native PrincipledVolume, procedural density .0015 max','sun':'warm side-back, weak cool broad fill','viewTransform':'AgX medium high contrast'},indent=2),encoding='utf8')
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('V117_NATIVE_MATERIAL_PREVIEW_INVOKED')
