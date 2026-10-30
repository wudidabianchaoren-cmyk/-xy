"""One local offscreen UE editor, bounded command inbox. Preserve source maps."""
import unreal as u,time,json,traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-161/ue';OUT.mkdir(parents=True,exist_ok=True)
report={'engine':u.SystemLibrary.get_engine_version(),'sourceMap':'/Game/Cove/FullCoveV149','errors':[],'jobs':[]}
def note():(OUT/'session.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def prop(o,k,v):
 try:o.set_editor_property(k,v)
 except Exception as e:report['errors'].append(k+': '+str(e))
try:
 u.EditorPythonScripting.set_keep_python_script_alive(True)
 u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV149')
 actors=u.get_editor_subsystem(u.EditorActorSubsystem);editor=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=editor.get_editor_world();assets=u.get_editor_subsystem(u.EditorAssetSubsystem);mel=u.MaterialEditingLibrary
 for a in actors.get_all_level_actors():
  if isinstance(a,u.SceneCapture2D):actors.destroy_actor(a)
 rows=[]
 for a in actors.get_all_level_actors():
  r={'label':a.get_actor_label(),'class':a.get_class().get_name(),'location':str(a.get_actor_location())}
  if isinstance(a,u.StaticMeshActor):r['mesh']=a.static_mesh_component.static_mesh.get_path_name() if a.static_mesh_component.static_mesh else None
  rows.append(r)
 (OUT/'actors.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
 for c in ['r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2300','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,c)
 began=time.monotonic();stamp=None;handle=None;report['ready']=True;note()
 def tick(dt):
  global stamp,handle
  if time.monotonic()-began>1200:
   report['boundedTimeout']=True;note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
  job=OUT/'command.json'
  if job.exists() and job.stat().st_mtime_ns!=stamp:
   stamp=job.stat().st_mtime_ns
   try:
    info=json.loads(job.read_text(encoding='utf-8-sig'));f=P/info['script'];exec(compile(f.read_text(encoding='utf-8-sig'),str(f),'exec'),globals());report['jobs'].append(info);note()
   except Exception:report['errors'].append(traceback.format_exc());note()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:report['errors'].append(traceback.format_exc());note();u.SystemLibrary.quit_editor()
