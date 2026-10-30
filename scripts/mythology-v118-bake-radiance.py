"""Transfer actual native Cycles diffuse radiance to the live 3D ground, scene-linear EXR."""
import bpy,json,time
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118';sc=bpy.context.scene
land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];mat=land.data.materials[0]
sun=bpy.data.objects['V117 warm side-back sun'];sun.data.energy=4.2;sun.data.color=(1,.91,.76);sun.location=(-100,-20,100);sun.rotation_euler=(Vector((-60,120,10))-sun.location).to_track_quat('-Z','Y').to_euler()
bpy.data.objects['V117 broad cool sky fill'].data.energy=22000
for n in sc.world.node_tree.nodes:
 if n.type=='BACKGROUND':
  if n.inputs['Color'].is_linked:n.inputs['Strength'].default_value=.12
  else:n.inputs['Color'].default_value=(.24,.32,.40,1);n.inputs['Strength'].default_value=.8
mist=bpy.data.materials['V117 fine cool woodland haze']
for n in mist.node_tree.nodes:
 if n.type=='MATH' and n.operation=='MULTIPLY':n.inputs[1].default_value=.0006
# Same pale photographic rock on the closed volumes. No black stretched scan sheets.
for o in bpy.data.collections['V118_CLOSED_ROCKS'].objects:
 if o and o.type=='MESH':o.data.materials.clear();o.data.materials.append(mat)
im=bpy.data.images.new('V118 actual Cycles diffuse radiance / scene linear',width=2048,height=2048,alpha=False,float_buffer=True);im.colorspace_settings.name='Linear Rec.709';im.file_format='OPEN_EXR';im.filepath_raw=str(OUT/'ground-cycles-radiance.exr')
n=mat.node_tree.nodes;target=n.new('ShaderNodeTexImage');target.name='V118 actual Cycles radiance bake target';target.image=im;n.active=target
bpy.ops.object.select_all(action='DESELECT');land.hide_set(False);land.select_set(True);bpy.context.view_layer.objects.active=land
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=32;sc.render.bake.use_selected_to_active=False;sc.render.bake.margin=12
sc.render.bake.use_pass_color=True;sc.render.bake.use_pass_direct=True;sc.render.bake.use_pass_indirect=True
started=time.time();bpy.ops.object.bake(type='DIFFUSE');sc.render.image_settings.file_format='OPEN_EXR';sc.render.image_settings.color_depth='16';im.save_render(str(OUT/'ground-cycles-radiance.exr'),scene=sc)
sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_depth='8'
audit={'actualBlenderMcp':True,'actualCyclesBake':True,'type':'DIFFUSE / colour + direct + indirect','resolution':[2048,2048],'samples':32,'format':'OpenEXR half scene-linear, not display-tonemapped PNG','seconds':time.time()-started,'liveUse':'MeshBasic map on same real island mesh and native unique UV atlas; web AgX tone mapping still applies once','staticLighting':True,'seaGeometryAndShaderChanged':False,'bytes':(OUT/'ground-cycles-radiance.exr').stat().st_size}
(OUT/'04-radiance-bake.json').write_text(json.dumps(audit,indent=2),encoding='utf8');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04c-native-radiance-for-live-3d.blend'));print(json.dumps(audit))
