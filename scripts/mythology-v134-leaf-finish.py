import bpy,runpy,json
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v134'
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-134/compact-cove-lighting.blend'))
source=next(o for o in bpy.context.scene.objects if o.name.startswith('V133 tree ') and o.name.endswith('part2'))
build=runpy.run_path(str(R/'scripts/mythology-v117-leaf-lod.py'))['build_web_leaf_lod']
leaf,report=build(source=source,target_triangles=60000,seed=134,name='V134 prototype 2',leaf_scale=2.5)
leaf.hide_render=False;leaf.hide_set(False)
copies=[leaf]
for i in [0,1]:
 src=next(o for o in bpy.context.scene.objects if o.name.startswith('V133 tree ') and o.name.endswith('part'+str(i)))
 ob=bpy.data.objects.new('V134 prototype '+str(i),src.data);bpy.context.scene.collection.objects.link(ob);copies.append(ob)
bpy.ops.object.select_all(action='DESELECT')
for ob in copies:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'vegetation.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
(A/'leaf-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('V134_LEAF',json.dumps(report),flush=True)
