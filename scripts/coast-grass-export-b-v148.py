import bpy
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v148'
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-148/coast-bridged-candidate-b.blend'))
obs=[o for o in bpy.context.scene.objects if o.type=='MESH' and 'elevation-limited coastal grasses' in o.name];bpy.ops.object.select_all(action='DESELECT')
for ob in obs:ob.select_set(True)
bpy.context.view_layer.objects.active=obs[0];bpy.ops.export_scene.fbx(filepath=str(A/'grass-grounded-b.fbx'),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z');print('GRASS_B_FBX_EXPORTED')
