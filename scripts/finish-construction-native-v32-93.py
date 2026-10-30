import bpy,pathlib,json
p=pathlib.Path.cwd();s=bpy.context.scene;s.frame_end=420;s.frame_step=1;s.render.fps=30;s.render.filepath='//renders/frame-';s.frame_set(1);sequencer=s.sequence_editor_create();strip=sequencer.strips.new_sound('Original 120 BPM construction score',str(p/'assets/works/home-creation/construction-score-v32-93.wav'),channel=1,frame_start=1);strip.sound.pack();strip.volume=.8;bpy.context.preferences.filepaths.save_version=0;bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(p/'blender/home-construction-v32-93/courtyard-construction.blend'),compress=True)
print('Portable packed native 420-frame timeline saved',flush=True)

