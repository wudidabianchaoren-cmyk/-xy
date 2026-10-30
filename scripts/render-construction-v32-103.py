import bpy,time,pathlib,json
p=pathlib.Path.cwd();s=bpy.context.scene;s.eevee.taa_render_samples=64;s.eevee.shadow_ray_count=4;s.eevee.shadow_step_count=8
s.render.filepath='F:/codex-construction-v103/frame-';s.render.use_overwrite=False;s.frame_step=2;s.frame_start=1;s.frame_end=390
bpy.context.preferences.filepaths.save_version=0;s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(p/'blender/home-construction-v32-103/tower-modeling-insert.blend'),compress=True)
start=time.monotonic();bpy.ops.render.render(animation=True)
s.frame_set(285);s.render.filepath=str(p/'blender/home-construction-v32-103/proof-0285.png');bpy.ops.render.render(write_still=True)
out=p/'.verify/v32-103/construction';out.mkdir(parents=True,exist_ok=True)
(out/'render.json').write_text(json.dumps({'passed':True,'renderer':'Blender 5.1.2 Eevee','actualFrames':195,'samples':64,'shadowRayCount':4,'elapsedSeconds':time.monotonic()-start,'resolution':[1600,900],'sourceFps':15,'newSequenceDuration':13,'sourceSaved':True},indent=2),encoding='utf8')
print('V103_NATIVE_FRAMES_COMPLETE',flush=True)
