"""Real native viewport HDR capture, never SceneCapture fallback; source map not saved."""
import unreal as u, time, json, traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1]; OUT=P/'.verify/v32-159/ue';OUT.mkdir(parents=True,exist_ok=True)
report={'engine':u.SystemLibrary.get_engine_version(),'route':'native viewport high-resolution HDR screenshot','sourceMap':'/Game/Cove/FullCoveV149','sourceMapModified':False,'captureHDRDoc':u.AutomationLibrary.take_high_res_screenshot.__doc__,'faces':[],'errors':[]}
def note(): (OUT/'viewport-env.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
try:
 u.EditorPythonScripting.set_keep_python_script_alive(True)
 u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV149')
 actors=u.get_editor_subsystem(u.EditorActorSubsystem);editor=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=editor.get_editor_world()
 for a in actors.get_all_level_actors():
  if isinstance(a,u.SceneCapture2D):actors.destroy_actor(a)
 for cmd in ['r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2000','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,cmd)
 faces=[('px',u.Rotator(pitch=0,yaw=0,roll=0)),('nx',u.Rotator(pitch=0,yaw=180,roll=0)),('py',u.Rotator(pitch=0,yaw=90,roll=0)),('ny',u.Rotator(pitch=0,yaw=-90,roll=0)),('pz',u.Rotator(pitch=90,yaw=0,roll=0)),('nz',u.Rotator(pitch=-90,yaw=0,roll=0))]
 cam=actors.spawn_actor_from_class(u.CameraActor,u.Vector(0,2000,450),faces[0][1]);cam.set_actor_label('V159 local HDR probe, unsaved');cc=cam.get_component_by_class(u.CameraComponent);cc.set_editor_property('field_of_view',90.);cc.set_editor_property('aspect_ratio',1.);cc.set_editor_property('constrain_aspect_ratio',True)
 settings=next(a for a in actors.get_all_level_actors() if isinstance(a,u.PostProcessVolume)).get_editor_property('settings');cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.)
 editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[0][1]);report['probeUECentimetres']=[0,2000,450];note()
 started=time.monotonic();last=started;index=0;stage=0;handle=None
 def tick(dt):
  global index,stage,last,handle
  now=time.monotonic()
  try:
   if now-started>240:
    report['timeout']=True;note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
   if stage==0 and now-last>(30 if index==0 else 10):
    name,rot=faces[index];stage=1;last=now;report['faces'].append({'name':name,'rotation':str(rot),'captureRequestedAt':now-started});note();u.AutomationLibrary.take_high_res_screenshot(512,512,str(OUT/('viewport-linear-'+name+'.exr')),camera=cam,capture_hdr=True)
   elif stage==1 and now-last>4:
    index+=1
    if index==len(faces):
     report['complete']=True;note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
    cam.set_actor_rotation(faces[index][1],False);editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[index][1]);stage=0;last=now
  except Exception:report['errors'].append(traceback.format_exc());note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:report['errors'].append(traceback.format_exc());note();u.SystemLibrary.quit_editor()
