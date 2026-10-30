import bpy,math,json,hashlib
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v123';bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/directory-v32-123/directory-room.blend'));scene=bpy.context.scene
background=bpy.data.objects['Preview outside / excluded from GLB'];mat=bpy.data.materials.new('Environment only / actual licensed Berlin photo');mat.use_nodes=True;n=mat.node_tree.nodes;n.clear();t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(ROOT/'assets/directory-v119/berlin-night.jpg'));co=n.new('ShaderNodeTexCoord');sep=n.new('ShaderNodeSeparateXYZ');combine=n.new('ShaderNodeCombineXYZ');mat.node_tree.links.new(co.outputs['Generated'],sep.inputs[0]);mat.node_tree.links.new(sep.outputs['X'],combine.inputs['X']);mat.node_tree.links.new(sep.outputs['Z'],combine.inputs['Y']);mat.node_tree.links.new(combine.outputs[0],t.inputs[0]);em=n.new('ShaderNodeEmission');em.inputs[1].default_value=.7;mat.node_tree.links.new(t.outputs['Color'],em.inputs[0]);out=n.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(em.outputs[0],out.inputs[0]);background.data.materials.clear();background.data.materials.append(mat)
for ob in scene.objects:
 if ob.name.startswith('Preview distant window'):ob.hide_render=True
bpy.ops.object.camera_add(location=(.10,-.55,1.35));camera=bpy.context.object;camera.name='V123 panorama only / no saved scene change';camera.data.type='PANO';camera.rotation_euler=(math.pi/2,0,0)
if hasattr(camera.data,'panorama_type'):camera.data.panorama_type='EQUIRECTANGULAR'
else:camera.data.cycles.panorama_type='EQUIRECTANGULAR'
scene.camera=camera;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True;scene.render.resolution_x=1536;scene.render.resolution_y=768;scene.render.resolution_percentage=100
pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU';scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=0
lamp=bpy.data.objects['Warm tungsten local light'];bulb=bpy.data.objects['Lamp luminous bulb'];records=[]
for on in [True,False]:
 lamp.data.energy=57 if on else 0;bulb.hide_render=not on;name='room-env-on' if on else 'room-env-off';scene.render.image_settings.file_format='OPEN_EXR';scene.render.image_settings.color_depth='16';scene.render.image_settings.color_mode='RGB';scene.render.image_settings.exr_codec='ZIP';scene.render.filepath=str(OUT/(name+'.exr'));bpy.ops.render.render(write_still=True)
 scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95;bpy.data.images['Render Result'].save_render(str(OUT/(name+'.jpg')),scene=scene)
 records.append({'lampOn':on,'exr':name+'.exr','jpg':name+'.jpg','resolution':[1536,768],'samples':24,'exrColorSpace':'scene linear Rec709 HALF RGB ZIP','jpgColorSpace':'AgX display sRGB for preview; use EXR for PMREM if possible','exrBytes':(OUT/(name+'.exr')).stat().st_size,'jpgBytes':(OUT/(name+'.jpg')).stat().st_size,'exrSHA256':hashlib.sha256((OUT/(name+'.exr')).read_bytes()).hexdigest()})
(OUT/'environment.json').write_text(json.dumps({'complete':True,'actualCyclesPanoramas':True,'probeGLTF':[.1,1.35,.55],'probeNative':[.1,-.55,1.35],'records':records,'licensedBackground':'Billie Grace Ward Berlin Skyline CC BY2.0; same previously attributed photograph in directory-v119/SOURCES.json','mainNativeSceneModified':False,'limitations':'Native photographic plane approximation, not exact live website cylindrical projection or dynamic TV film. Actual-web CubeCamera capture with environment disabled can match the live webpage more closely.'},indent=2),encoding='utf8');print('ENVIRONMENT_PANORAMAS_COMPLETE',flush=True)
