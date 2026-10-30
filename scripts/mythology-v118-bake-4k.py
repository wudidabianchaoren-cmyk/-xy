import bpy,json,time
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];mat=land.data.materials[0]
im=bpy.data.images.new('V118 final 4096 actual Cycles radiance',width=4096,height=4096,alpha=False,float_buffer=True);im.colorspace_settings.name='Linear Rec.709';im.file_format='OPEN_EXR';im.filepath_raw=str(O/'ground-cycles-radiance.exr')
n=mat.node_tree.nodes;target=n.new('ShaderNodeTexImage');target.name='V118 final 4K native radiance bake target';target.image=im;n.active=target
bpy.ops.object.select_all(action='DESELECT');land.hide_set(False);land.select_set(True);bpy.context.view_layer.objects.active=land
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=32;sc.render.bake.margin=16;sc.render.bake.use_selected_to_active=False
sc.render.bake.use_pass_color=True;sc.render.bake.use_pass_direct=True;sc.render.bake.use_pass_indirect=True
t=time.time();bpy.ops.object.bake(type='DIFFUSE');sc.render.image_settings.file_format='OPEN_EXR';sc.render.image_settings.color_depth='16';im.save_render(str(O/'ground-cycles-radiance.exr'),scene=sc);sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_depth='8'
audit={'actualBlenderMcp':True,'actualCyclesBake':True,'type':'DIFFUSE colour+direct+indirect','resolution':[4096,4096],'samples':32,'seconds':time.time()-t,'format':'OpenEXR scene-linear half','staticLighting':True,'worldPhotographicMicrodetail':'bounded .78..1.23 multiplier, fades by125m, preserves baked shade','bytes':(O/'ground-cycles-radiance.exr').stat().st_size}
(O/'04-radiance-bake.json').write_text(json.dumps(audit,indent=2),encoding='utf8');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'04d-4k-live-native-radiance.blend'));print(json.dumps(audit))
