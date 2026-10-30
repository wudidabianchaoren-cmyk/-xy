"""Bounded V158 UE lookdev. Source map is never changed; commands are local files."""
import unreal as u, json, time, traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1]; OUT=P/'.verify/v32-158/ue';OUT.mkdir(parents=True,exist_ok=True)
r={'engine':u.SystemLibrary.get_engine_version(),'savedCoveModified':False,'stages':[],'errors':[],'rootCause':'prior hero used UE +Y, which is the rear of glTF +Z-facing clock; capture/export must use separate frames'}
def save(): (OUT/'refine.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
def prop(o,k,v):
 try:o.set_editor_property(k,v)
 except Exception as e:r['errors'].append(k+': '+str(e))
def ppmanual(bias=0.):
 s=u.PostProcessSettings()
 for k,v in [('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',bias),('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_motion_blur_amount',True),('motion_blur_amount',0.),('override_bloom_intensity',True),('bloom_intensity',.12)]:prop(s,k,v)
 return s
try:
 u.EditorLoadingAndSavingUtils.new_blank_map(False);world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world();actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 task=u.AssetImportTask();task.filename=str(P/'blender/reference-architecture-v16/architecture-world.glb');task.destination_path='/Game/V158ClockRefine';task.automated=True;task.save=False;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);meshes=[]
 for path in task.imported_object_paths:
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());a.static_mesh_component.set_static_mesh(asset);a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);meshes.append(a)
 r['meshCount']=len(meshes)
 sun=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(),u.Rotator(-34,110,0));sun.light_component.set_mobility(u.ComponentMobility.MOVABLE);sun.light_component.set_intensity(5.5);sun.light_component.set_light_color(u.LinearColor(1,.87,.67));prop(sun.light_component,'light_source_angle',2.)
 sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,800));sky.light_component.set_mobility(u.ComponentMobility.MOVABLE);prop(sky.light_component,'source_type',u.SkyLightSourceType.SLS_SPECIFIED_CUBEMAP);prop(sky.light_component,'cubemap',u.load_asset('/Game/Cove/DaylightHDR'));sky.light_component.set_intensity(.75)
 fill=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(),u.Rotator(-20,55,0));fill.light_component.set_mobility(u.ComponentMobility.MOVABLE);fill.light_component.set_intensity(.7);fill.light_component.set_light_color(u.LinearColor(.79,.85,1.));prop(fill.light_component,'cast_shadows',False)
 cap=actors.spawn_actor_from_class(u.SceneCapture2D,u.Vector(380,-2650,620));cap.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cap.get_actor_location(),u.Vector(0,-120,400)),False);c=cap.get_component_by_class(u.SceneCaptureComponent2D)
 target=u.RenderingLibrary.create_render_target2d(world,1200,800,u.TextureRenderTargetFormat.RTF_RGBA8)
 for k,v in [('texture_target',target),('capture_every_frame',True),('capture_on_movement',False),('always_persist_rendering_state',True),('capture_source',u.SceneCaptureSource.SCS_FINAL_COLOR_LDR),('fov_angle',40.),('post_process_settings',ppmanual(0.)),('post_process_blend_weight',1.)]:prop(c,k,v)
 u.get_editor_subsystem(u.UnrealEditorSubsystem).set_level_viewport_camera_info(cap.get_actor_location(),cap.get_actor_rotation())
 for cmd in ['r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.Streaming.PoolSize 2200','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,cmd)
 began=time.monotonic();last=began;step=0;handle=None;stamp=None
 def tick(dt):
  global step,last,stamp,handle
  now=time.monotonic()
  try:
   if now-began>1000:save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
   if step==0 and now-began>30:
    sky.light_component.recapture_sky();c.capture_scene();last=now;step=1;r['stages'].append('front capture warmed');save()
   elif step==1 and now-last>2:
    u.RenderingLibrary.export_render_target(world,target,str(OUT),'clock-front-refined.png');r['stages'].append('front export');last=now;step=2;save()
   command=OUT/'command.json'
   if command.exists():
    st=command.stat().st_mtime_ns
    if st!=stamp:
     stamp=st;job=json.loads(command.read_text(encoding='utf-8-sig'));script=P/job['script'];exec(compile(script.read_text(encoding='utf-8'),str(script),'exec'),globals());r['lastCommand']=job;save()
  except Exception:r['failure']=traceback.format_exc();save();u.log_error(r['failure'])
 u.EditorPythonScripting.set_keep_python_script_alive(True);handle=u.register_slate_post_tick_callback(tick);save()
except Exception:r['failure']=traceback.format_exc();save();u.SystemLibrary.quit_editor()
