"""Independent, fixed cameras avoid reuse of a view's temporal matrices across cube faces."""
v158_sky=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector())
v158_sky.static_mesh_component.set_static_mesh(u.load_asset('/Engine/BasicShapes/Sphere'))
v158_sky.set_actor_scale3d(u.Vector(20000,20000,20000))
v158_sky.static_mesh_component.set_material(0,u.load_asset('/Game/Cove/V147_VisibleHDRSky'))
v158_sky.static_mesh_component.set_editor_property('cast_shadow',False)
v158_sky.static_mesh_component.set_editor_property('affect_distance_field_lighting',False)
v158_faces=[]
for label,rot in [('px',u.Rotator(pitch=0,yaw=0,roll=0)),('nx',u.Rotator(pitch=0,yaw=180,roll=0)),('py',u.Rotator(pitch=0,yaw=90,roll=0)),('ny',u.Rotator(pitch=0,yaw=-90,roll=0)),('pz',u.Rotator(pitch=90,yaw=0,roll=0)),('nz',u.Rotator(pitch=-90,yaw=0,roll=0))]:
 a=actors.spawn_actor_from_class(u.SceneCapture2D,u.Vector(-15,-650,280),rot)
 cc=a.get_component_by_class(u.SceneCaptureComponent2D)
 rt=u.RenderingLibrary.create_render_target2d(world,256,256,u.TextureRenderTargetFormat.RTF_RGBA16F)
 for k,v in [('texture_target',rt),('capture_every_frame',True),('capture_on_movement',False),('always_persist_rendering_state',True),('capture_source',u.SceneCaptureSource.SCS_SCENE_COLOR_HDR),('fov_angle',90.),('post_process_settings',ppmanual(0.)),('post_process_blend_weight',1.)]:prop(cc,k,v)
 v158_faces.append((label,a,cc,rt))
v158_env_start=time.monotonic();v158_env_handle=None
def v158_env_tick(dt):
 global v158_env_handle
 if time.monotonic()-v158_env_start<25:return
 try:
  for label,a,cc,rt in v158_faces:
   u.RenderingLibrary.export_render_target(world,rt,str(OUT),'refined-'+label+'.hdr');cc.capture_every_frame=False
  r['environmentRefined']={'probe':[-15,-650,280],'faces':[{ 'name':label,'rotation':str(a.get_actor_rotation()),'forward':str(u.MathLibrary.get_forward_vector(a.get_actor_rotation()))} for label,a,cc,rt in v158_faces]};save()
 except Exception:r['environmentRefineFailure']=traceback.format_exc();save()
 u.unregister_slate_post_tick_callback(v158_env_handle)
v158_env_handle=u.register_slate_post_tick_callback(v158_env_tick)
