import bpy,json,time
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118';sc=bpy.context.scene
land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];mat=land.data.materials[0]
im=bpy.data.images.new('V118 actual Cycles static root-contact AO',width=1536,height=1536,alpha=False);im.colorspace_settings.name='Non-Color';im.filepath_raw=str(OUT/'ground-contact-ao.png');im.file_format='PNG'
n=mat.node_tree.nodes;node=n.new('ShaderNodeTexImage');node.name='V118 actual native AO bake target';node.image=im;n.active=node
bpy.ops.object.select_all(action='DESELECT');land.hide_set(False);land.select_set(True);bpy.context.view_layer.objects.active=land
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=16;sc.render.bake.use_selected_to_active=False;sc.render.bake.margin=8;sc.world.color=(.1,.1,.1)
if hasattr(sc.world,'light_settings'):sc.world.light_settings.distance=3.0
if hasattr(sc.cycles,'ao_bounces_distance'):sc.cycles.ao_bounces_distance=3.0
started=time.time();bpy.ops.object.bake(type='AO');im.save()
report={'actualBlenderCyclesBake':True,'type':'AmbientOcclusion','resolution':[1536,1536],'samples':16,'seconds':time.time()-started,'occluders':'Actual current grounded roots, woodland, thick terrain and closed rocks; no fabricated radial screen blobs','usesNativeUniqueUV':land.data.uv_layers.active.name}
(OUT/'03-ao-bake.json').write_text(json.dumps(report,indent=2),encoding='utf8');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'03-native-ground-contact-bake.blend'));print(json.dumps(report))
