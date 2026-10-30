"""Original clock GLB rendered through native UE viewport, isolated from saved cove."""
import unreal as u, time, json, traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1]; OUT=P/'.verify/v32-159/ue-clock';OUT.mkdir(parents=True,exist_ok=True)
report={'engine':u.SystemLibrary.get_engine_version(),'route':'native viewport high-resolution EXR','source':'blender/reference-architecture-v16/architecture-world.glb','savedCoveModified':False,'faces':[],'errors':[]}
def note():(OUT/'viewport-env.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
try:
 u.EditorPythonScripting.set_keep_python_script_alive(True);u.EditorLoadingAndSavingUtils.new_blank_map(False)
 actors=u.get_editor_subsystem(u.EditorActorSubsystem);editor=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=editor.get_editor_world()
 task=u.AssetImportTask();task.filename=str(P/report['source']);task.destination_path='/Game/V159ClockViewport';task.automated=True;task.save=False;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);meshes=[]
 for path in task.imported_object_paths:
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):
   aa=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());aa.static_mesh_component.set_static_mesh(asset);aa.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);meshes.append(aa)
 report['meshCount']=len(meshes)
 sun=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(),u.Rotator(pitch=-32,yaw=-116,roll=0));sun.light_component.set_mobility(u.ComponentMobility.MOVABLE);sun.light_component.set_intensity(5.5);sun.light_component.set_light_color(u.LinearColor(1,.87,.65));sun.light_component.set_editor_property('light_source_angle',2.)
 fill=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(),u.Rotator(pitch=-22,yaw=-48,roll=0));fill.light_component.set_mobility(u.ComponentMobility.MOVABLE);fill.light_component.set_intensity(.35);fill.light_component.set_light_color(u.LinearColor(.86,.9,1.));fill.light_component.set_editor_property('cast_shadows',False)
 sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,800));sky.light_component.set_mobility(u.ComponentMobility.MOVABLE);sky.light_component.set_editor_property('source_type',u.SkyLightSourceType.SLS_SPECIFIED_CUBEMAP);sky.light_component.set_editor_property('cubemap',u.load_asset('/Game/Cove/DaylightHDR'));sky.light_component.set_intensity(.8)
 sphere=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());sphere.static_mesh_component.set_static_mesh(u.load_asset('/Engine/BasicShapes/Sphere'));sphere.set_actor_scale3d(u.Vector(20000,20000,20000));sphere.static_mesh_component.set_material(0,u.load_asset('/Game/Cove/V147_VisibleHDRSky'));sphere.static_mesh_component.set_editor_property('cast_shadow',False);sphere.static_mesh_component.set_editor_property('affect_distance_field_lighting',False)
 settings=u.PostProcessSettings()
 for k,v in [('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',0.),('override_motion_blur_amount',True),('motion_blur_amount',0.),('override_bloom_intensity',True),('bloom_intensity',.08)]:settings.set_editor_property(k,v)
 pp=actors.spawn_actor_from_class(u.PostProcessVolume,u.Vector());pp.set_editor_property('unbound',True);pp.set_editor_property('settings',settings)
 for cmd in ['r.ScreenPercentage 100','r.AntiAliasingMethod 1','r.SSR.Quality 0','r.Lumen.ScreenProbeGather.ScreenTraces 0','r.Lumen.Reflections.ScreenTraces 0','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2000','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,cmd)
 faces=[('px',u.Rotator(pitch=0,yaw=0,roll=0)),('nx',u.Rotator(pitch=0,yaw=180,roll=0)),('py',u.Rotator(pitch=0,yaw=90,roll=0)),('ny',u.Rotator(pitch=0,yaw=-90,roll=0)),('pz',u.Rotator(pitch=90,yaw=0,roll=0)),('nz',u.Rotator(pitch=-90,yaw=0,roll=0))]
 cam=actors.spawn_actor_from_class(u.CameraActor,u.Vector(-15,650,280),faces[0][1]);cc=cam.get_component_by_class(u.CameraComponent);cc.set_editor_property('field_of_view',90.);cc.set_editor_property('aspect_ratio',1.);cc.set_editor_property('constrain_aspect_ratio',False);cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.)
 editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[0][1]);report['probeUECentimetres']=[-15,650,280];note()
 started=time.monotonic();last=started;index=0;stage=0;handle=None;busy=False;pending=None
 def tick(dt):
  global index,stage,last,handle,busy,pending
  if busy:return
  busy=True
  now=time.monotonic()
  try:
   if now-started>220:report['timeout']=True;note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
   if stage==0 and now-last>(30 if index==0 else 8):
    name,rot=faces[index];stage=1;last=now;report['faces'].append({'name':name,'rotation':str(rot),'captureRequestedAt':now-started});note();pending=u.AutomationLibrary.take_high_res_screenshot(512,512,str(OUT/('viewport-linear-'+name+'.exr')),camera=cam,capture_hdr=True)
   elif stage==1 and now-last>6:
    done=getattr(pending,'is_task_done',None)
    if done is not None and not (done() if callable(done) else done):return
    if not (OUT/('viewport-linear-'+faces[index][0]+'.exr')).exists():return
    index+=1
    if index==len(faces):report['complete']=True;note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
    cam.set_actor_rotation(faces[index][1],False);editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[index][1]);stage=0;last=now
  except Exception:report['errors'].append(traceback.format_exc());note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
  finally:busy=False
 handle=u.register_slate_post_tick_callback(tick)
except Exception:report['errors'].append(traceback.format_exc());note();u.SystemLibrary.quit_editor()
