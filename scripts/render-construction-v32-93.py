import bpy,pathlib,json
p=pathlib.Path.cwd();out=p/'blender/home-construction-v32-93';s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
s.cycles.device='GPU';print('Render devices',[(d.name,d.type,d.use)for d in prefs.devices],flush=True)
# Reveal auxiliary native curves alongside their architecture; do not leave them floating in the opening.
for o in s.objects:
 if o.type in ['CURVE','FONT','SURFACE']:
  o.hide_render=True;o.keyframe_insert('hide_render',frame=1);o.hide_render=True;o.keyframe_insert('hide_render',frame=140);o.hide_render=False;o.keyframe_insert('hide_render',frame=151)
 if o.type=='MESH' and not o.modifiers and 'the first cube'not in o.name and not any(n in o.name for n in ['marble','slab_joints']):
  o.hide_render=True;o.keyframe_insert('hide_render',frame=1);o.hide_render=False;o.keyframe_insert('hide_render',frame=91)
s.frame_set(420);s.render.filepath=str(out/'proof-0420.png');s.cycles.samples=32;bpy.ops.render.render(write_still=True)
s.render.filepath='F:/codex-construction-v93/frame-';s.cycles.samples=8;s.cycles.adaptive_threshold=.13;s.frame_end=331;s.frame_step=2;s.render.use_persistent_data=True
bpy.ops.wm.save_as_mainfile(filepath=str(out/'courtyard-construction.blend'),compress=True)
s.frame_set(1);s.render.filepath=str(out/'proof-0001.png');bpy.ops.render.render(write_still=True);s.render.filepath='F:/codex-construction-v93/frame-'
audit=json.loads((out/'construction-audit.json').read_text());audit.update({'renderSamples':8,'nativeTimelineFps':30,'sourceRenderFrameStep':2,'renderedConstructionSeconds':11.0666667,'finalHoldSeconds':2.9333333,'deliveryFps':30,'deliveryDuration':14,'interpolation':'Motion-compensated 15-to-30 fps between actual Cycles renders; final native Cycles frame held for ending','finalStillSamples':32,'openingAuxiliaryObjectsFixed':True});(out/'construction-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8')
s.render.use_overwrite=False;bpy.ops.render.render(animation=True)
print('ANIMATION_RENDER_COMPLETE',flush=True)

