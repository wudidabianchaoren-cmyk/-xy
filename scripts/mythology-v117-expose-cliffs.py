import bpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-117'
rocks=sorted([o for o in bpy.data.collections['V117_ROCKS'].objects if o],key=lambda o:o.name)
# Expose connected scanned faces at the bay shoulders. Keep the sandy central bay open.
placements=[(-194,101,1.2),(-181,93,.6),(-168,91,.4),(-154,99,1.1),(-140,109,3.2)]
for o,p in zip(rocks,placements):o.location=p
bpy.ops.object.select_all(action='DESELECT')
for o in rocks:o.hide_set(False);o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(O/'cliffs-v117.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_extras=True,export_cameras=False,export_lights=False)
# Key lights the visible face of the coast as well as giving the sails a warm rim.
from mathutils import Vector
sun=bpy.data.objects['V117 warm side-back sun'];sun.location=(-100,-20,100);sun.rotation_euler=(Vector((-60,115,8))-sun.location).to_track_quat('-Z','Y').to_euler();sun.data.energy=3.2;sun.data.color=(1,.86,.65)
bpy.context.scene.world.node_tree.nodes.get('Background')
print(json.dumps({'exposedScanFaceLocations':placements,'key':'warm side / cove-facing','seaUnchanged':True}))