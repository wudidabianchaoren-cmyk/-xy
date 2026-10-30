import bpy,json,math
from pathlib import Path
from mathutils import Vector
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-117';sc=bpy.context.scene
for n in sc.world.node_tree.nodes:
 if n.type=='BACKGROUND' and n.inputs['Color'].is_linked:n.inputs['Strength'].default_value=.065
sc.camera.location=(27,-60,15);sc.camera.rotation_euler=(Vector((-105,130,16))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.lens=34
sc.render.resolution_x=1920;sc.render.resolution_y=1080;sc.render.resolution_percentage=100;sc.cycles.samples=64;sc.cycles.adaptive_threshold=.035;sc.render.filepath=str(O/'cycles-final-1920.png')
# The owned visible window stays in camera view with inexpensive solid shading.
for w in bpy.context.window_manager.windows:
 for a in w.screen.areas:
  if a.type=='VIEW_3D':a.spaces.active.shading.type='SOLID';a.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'08-final-local-world.blend'))
(O/'final-render-settings.json').write_text(json.dumps({'actualBlenderMcp':True,'native':'08-final-local-world.blend','engine':'Cycles CUDA','resolution':[1920,1080],'samples':64,'viewTransform':sc.view_settings.view_transform,'camera':list(sc.camera.location),'target':[-105,130,16],'seaMeshAndShaderUnchanged':True,'webDifferentRenderer':True,'sceneIsNotBuiltEntirelyFromScratch':'Existing ships and crew refined; CC0 male and scans adapted; island and scatter newly built.'},indent=2),encoding='utf8')
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('FINAL_RENDER_INVOKED')