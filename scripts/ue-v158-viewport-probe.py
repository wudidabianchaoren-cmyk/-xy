"""Native viewport route, avoiding SceneCapture fallback artifacts."""
for aa in actors.get_all_level_actors():
 if isinstance(aa,u.SceneCapture2D):aa.get_component_by_class(u.SceneCaptureComponent2D).capture_every_frame=False
v158_vp_cam=v158_cove_cameras['Full cove']
u.get_editor_subsystem(u.UnrealEditorSubsystem).set_level_viewport_camera_info(v158_vp_cam.get_actor_location(),v158_vp_cam.get_actor_rotation())
v158_vp_start=time.monotonic();v158_vp_handle=None;v158_vp_step=0
def v158_vp_tick(dt):
 global v158_vp_handle,v158_vp_step
 age=time.monotonic()-v158_vp_start
 if v158_vp_step==0 and age>8:
  u.AutomationLibrary.take_high_res_screenshot(1600,1000,str(OUT/'cove-viewport-probe.png'),camera=v158_vp_cam);v158_vp_step=1
 elif v158_vp_step==1 and age>14:
  r['cove']['viewportCaptureRequested']=True;save();u.unregister_slate_post_tick_callback(v158_vp_handle)
v158_vp_handle=u.register_slate_post_tick_callback(v158_vp_tick)
