"""Capture existing native FullCoveV149 with its authored Lumen rig; do not save it."""
u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV149')
world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
actors=u.get_editor_subsystem(u.EditorActorSubsystem)
v158_cove_all=actors.get_all_level_actors()
v158_cove_cameras={a.get_actor_label():a for a in v158_cove_all if isinstance(a,u.CineCameraActor)}
v158_cove_cam=v158_cove_cameras['Full cove']
v158_cove_cap=actors.spawn_actor_from_class(u.SceneCapture2D,v158_cove_cam.get_actor_location(),v158_cove_cam.get_actor_rotation())
v158_cove_c=v158_cove_cap.get_component_by_class(u.SceneCaptureComponent2D)
v158_cove_rt=u.RenderingLibrary.create_render_target2d(world,1600,1000,u.TextureRenderTargetFormat.RTF_RGBA8)
v158_cove_pp=ppmanual(0.)
for k,v in [('texture_target',v158_cove_rt),('capture_every_frame',True),('capture_on_movement',False),('always_persist_rendering_state',True),('capture_source',u.SceneCaptureSource.SCS_FINAL_COLOR_LDR),('fov_angle',58.),('post_process_settings',v158_cove_pp),('post_process_blend_weight',1.)]:prop(v158_cove_c,k,v)
r['cove']={'map':'/Game/Cove/FullCoveV149','camera':str(v158_cove_cam.get_actor_location()),'actors':len(v158_cove_all),'savedMap':False,'captures':[]};save()
v158_cove_start=time.monotonic();v158_cove_step=0;v158_cove_handle=None
def v158_cove_tick(dt):
 global v158_cove_step,v158_cove_handle
 age=time.monotonic()-v158_cove_start
 try:
  if v158_cove_step==0 and age>35:
   u.RenderingLibrary.export_render_target(world,v158_cove_rt,str(OUT),'cove-native-refined.png');r['cove']['captures'].append('cove-native-refined.png');save();v158_cove_step=1
  elif v158_cove_step==1 and age>38:
   ca=v158_cove_cameras['Rock shore'];v158_cove_cap.set_actor_location(ca.get_actor_location(),False,False);v158_cove_cap.set_actor_rotation(ca.get_actor_rotation(),False);v158_cove_c.fov_angle=48.;v158_cove_step=2
  elif v158_cove_step==2 and age>60:
   u.RenderingLibrary.export_render_target(world,v158_cove_rt,str(OUT),'cove-shore-refined.png');r['cove']['captures'].append('cove-shore-refined.png');save();v158_cove_c.capture_every_frame=False;u.unregister_slate_post_tick_callback(v158_cove_handle)
 except Exception:r['cove']['failure']=traceback.format_exc();save();u.unregister_slate_post_tick_callback(v158_cove_handle)
v158_cove_handle=u.register_slate_post_tick_callback(v158_cove_tick)
