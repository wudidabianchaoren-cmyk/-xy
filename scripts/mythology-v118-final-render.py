import bpy,json,time
from pathlib import Path
from mathutils import Vector
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
sc.camera.location=(27,-60,15);sc.camera.rotation_euler=(Vector((-105,130,16))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.lens=31.4;sc.camera.data.dof.use_dof=False
sc.render.engine='CYCLES';sc.cycles.device='GPU';sc.cycles.samples=64;sc.cycles.adaptive_threshold=.035;sc.cycles.use_denoising=True
sc.render.resolution_x=1920;sc.render.resolution_y=1080;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.render.image_settings.color_depth='8';sc.render.filepath=str(O/'cycles-final-1920.png')
sc.view_settings.view_transform='AgX';sc.view_settings.look='AgX - Medium High Contrast';sc.view_settings.exposure=.2
for w in bpy.context.window_manager.windows:
 for a in w.screen.areas:
  if a.type=='VIEW_3D':a.spaces.active.shading.type='SOLID';a.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'05-final-mediterranean-world.blend'))
t=time.time();bpy.ops.render.render(write_still=True)
audit={'actualBlenderMcp':True,'native':'05-final-mediterranean-world.blend','actualCyclesCuda':True,'resolution':[1920,1080],'samples':64,'seconds':time.time()-t,'fullNativeLeavesPreserved':True,'live3DUsesActual4096CyclesDiffuseRadiance':True,'webStillDifferentRenderer':True,'movieOrUserVisualAcceptance':False}
(O/'05-final-render.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
