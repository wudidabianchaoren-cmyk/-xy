import bpy
from pathlib import Path
R=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-134/compact-cove-lighting.blend'))
bpy.ops.object.select_all(action='DESELECT');o=bpy.data.objects['V133 elevation-limited coastal grasses'];o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(R/'assets/odyssey/compact-v134/grass.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
