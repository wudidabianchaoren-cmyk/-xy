import bpy,json,time
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v134'
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-134/compact-cove-lighting.blend'))
sc=bpy.context.scene;prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU';sc.cycles.samples=64
sc.render.image_settings.file_format='OPEN_EXR';sc.render.image_settings.color_depth='16';sc.render.image_settings.exr_codec='ZIP'
report=[]
for name,objectname,res in [('island','V133_ISLAND',4096),('rocks','V134 baked coastal rock shelves',2048)]:
 ob=bpy.data.objects[objectname]
 image=bpy.data.images.new('V134 HDR native '+name,width=res,height=res,float_buffer=True,alpha=False)
 image.colorspace_settings.name='Linear Rec.709';image.file_format='OPEN_EXR';image.filepath_raw=str(A/(name+'-radiance.exr'))
 # Use the unique UV that the web explicitly reads, independent of the old metre UV.
 if name=='island':ob.data.uv_layers.active=ob.data.uv_layers['V134 unique irradiance UV']
 for material in ob.data.materials:
  node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;material.node_tree.nodes.active=node
 bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob
 sc.render.bake.use_selected_to_active=False;sc.render.bake.margin=12
 sc.render.bake.use_pass_color=True;sc.render.bake.use_pass_direct=True;sc.render.bake.use_pass_indirect=True
 t=time.time();bpy.ops.object.bake(type='DIFFUSE');image.save_render(filepath=str(A/(name+'-radiance.exr')),scene=sc);report.append({'surface':name,'resolution':res,'samples':64,'seconds':time.time()-t,'floatRadiance':True})
 print('HDR_BAKE',json.dumps(report[-1]),flush=True)
(A/'radiance-bake.json').write_text(json.dumps({'actualCUDA':True,'bakes':report},indent=2))
