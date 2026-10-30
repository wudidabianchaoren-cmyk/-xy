import bpy
from pathlib import Path
P=Path(__file__).resolve().parents[1];file=P/'assets/odyssey/crew-v162/medieval-rowers-ue.glb';bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(file));bpy.ops.object.select_all(action='DESELECT');mesh=[o for o in bpy.context.scene.objects if o.type=='MESH']
for o in mesh:o.select_set(True)
bpy.context.view_layer.objects.active=mesh[0];bpy.ops.object.join();bpy.context.object.name='V162 fourteen medieval crew / actual five finger shaft contact';bpy.ops.export_scene.gltf(filepath=str(file),export_format='GLB',use_selection=True,export_animations=False,export_yup=True);print('NATIVE_CREW_MERGED',flush=True)
