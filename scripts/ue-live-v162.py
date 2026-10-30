"""Visible local UE5 viewport. Bounded numeric camera/scene controls, no command execution inbox."""
import unreal as u,json,time,math,traceback,sys,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162';OUT.mkdir(exist_ok=True)
u.EditorPythonScripting.set_keep_python_script_alive(True)
levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
sys.path.insert(0,str(P/'scripts'))
from ue_room_build_v162 import build_room
from ue_island_build_v162 import refine_island,import_crew,import_vessel
progress={'phase':'refining native sea, grass and sunset','engine':u.SystemLibrary.get_engine_version(),'visibleEditor':True};(OUT/'ue-live.json').write_text(json.dumps(progress))
if not u.EditorAssetLibrary.does_asset_exist('/Game/Cove/FullCoveV162'):refine_island()
if not (OUT/'ue-vessel-build.json').exists() and (P/'assets/odyssey/crew-v162/vessel-oarports-ue.glb').exists():import_vessel()
progress['phase']='building complete studio materials and lighting';(OUT/'ue-live.json').write_text(json.dumps(progress))
if not u.EditorAssetLibrary.does_asset_exist('/Game/V162/Studio'):build_room()
levels.load_level('/Game/Cove/FullCoveV162');world=ed.get_editor_world();levels.editor_set_game_view(True);levels.editor_set_viewport_realtime(True);actors.clear_actor_selection_set()
try:u.get_default_object(u.EditorPerformanceSettings).set_editor_property('throttle_cpu_when_not_foreground',False)
except Exception:pass
levels.set_level_viewport_fov(57.1,levels.get_active_viewport_config_key())
for c in ['Slate.bAllowThrottling 0','t.IdleWhenNotForeground 0','DisableAllScreenMessages','r.Streaming.FullyLoadUsedTextures 1','r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2000','PixelStreaming2.WebRTC.Fps 30','PixelStreaming2.WebRTC.MinBitrate 4000000','PixelStreaming2.WebRTC.MaxBitrate 16000000','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,c)
def vec(p):return u.Vector(p[0]*100,p[2]*100,p[1]*100)
ed.set_level_viewport_camera_info(vec([37,17,49]),u.MathLibrary.find_look_at_rotation(vec([37,17,49]),vec([-6,9,-16])))
report={'engine':u.SystemLibrary.get_engine_version(),'visibleEditor':True,'map':'/Game/Cove/FullCoveV162','maps':{'myth':'/Game/Cove/FullCoveV162','room':'/Game/V162/Studio','home':'/Game/V162/Courtyard'},'startedAt':time.time(),'phase':'UE scene open / live local stream','errors':[],'mode':'native UE viewport, not an environment-only export'}
def note():(OUT/'ue-live.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
note();last=0.;stamp=0;first=True;handle=None;sunDay=[];currentScene='myth';jobStamp=0;lastReport=0.;nativeClock=0.;paused=False
for a in actors.get_all_level_actors():
 if isinstance(a,u.DirectionalLight):sunDay.append((a,a.light_component.intensity,a.light_component.get_light_color()))
def tick(dt):
 global last,stamp,first,handle,currentScene,world,sunDay,jobStamp,lastReport,nativeClock,paused
 now=time.monotonic()
 try:
  if first and now-report.get('warmMonotonic',now)>4:pass
  if now-last<.04:return
  last=now;job=OUT/'asset-update.json'
  if job.exists() and job.stat().st_mtime_ns!=jobStamp:
   jobStamp=job.stat().st_mtime_ns;kind=json.loads(job.read_text(encoding='utf-8-sig')).get('kind');report['phase']='updating '+str(kind);note()
   if kind=='polish':
    import ue_polish_v162
    importlib.reload(ue_polish_v162).polish()
   elif kind=='audit':
    import ue_polish_v162
    module=importlib.reload(ue_polish_v162)
    module.diagnose() if (OUT/'diagnostic-enabled').exists() else module.audit()
   elif kind=='home':
    import ue_home_v162
    importlib.reload(ue_home_v162).build_home()
    report['maps']['home']='/Game/V162/Courtyard'
   elif kind=='crew':import_crew()
   elif kind=='room':build_room()
   elif kind=='island':refine_island()
   levels.load_level(report['maps'][currentScene]);world=ed.get_editor_world();sunDay=[(a,a.light_component.intensity,a.light_component.get_light_color())for a in actors.get_all_level_actors()if isinstance(a,u.DirectionalLight)];stamp=0;levels.editor_set_game_view(True);levels.editor_set_viewport_realtime(True);report['phase']='native viewport live';note()
  f=OUT/'ue-camera-input.json'
  if f.exists() and f.stat().st_mtime_ns!=stamp:
   nextStamp=f.stat().st_mtime_ns;v=json.loads(f.read_text(encoding='utf-8-sig'));stamp=nextStamp;p=v.get('camera',[37,17,49]);t=v.get('target',[-6,9,-16]);scene=v.get('scene','myth');paused=bool(v.get('paused',False));levels.editor_set_viewport_realtime(bool(v.get('active',True)))
   if scene!=currentScene and scene in report['maps']:
    levels.load_level(report['maps'][scene]);world=ed.get_editor_world();currentScene=scene;sunDay=[(a,a.light_component.intensity,a.light_component.get_light_color())for a in actors.get_all_level_actors()if isinstance(a,u.DirectionalLight)];levels.editor_set_game_view(True);levels.editor_set_viewport_realtime(True);u.SystemLibrary.execute_console_command(ed.get_editor_world(),'DisableAllScreenMessages')
   if scene=='room':
    for a in actors.get_all_level_actors():
     if isinstance(a,(u.PointLight,u.RectLight))and any(k in a.get_actor_label().lower()for k in['practical','bulb','warm shade','soft room']):
      lc=a.light_component;label=a.get_actor_label();base=55. if('practical'in label or'bulb'in label)else 4. if'warm shade'in label else 12.;lc.set_intensity(base if v.get('lamp',True)else 0.)
   if len(p)==3 and len(t)==3 and all(isinstance(x,(int,float))and math.isfinite(x)and abs(x)<100000 for x in p+t):
    levels.set_level_viewport_fov(float(v.get('fov',57.1)),levels.get_active_viewport_config_key());loc=vec(p);rot=u.MathLibrary.find_look_at_rotation(loc,vec(t));ed.set_level_viewport_camera_info(loc,rot)
   if 'night'in v:
    for a,energy,col in sunDay:
     a.light_component.set_intensity(.4 if v['night']else energy);a.light_component.set_light_color(u.LinearColor(.35,.48,.75,1)if v['night']else col)
   report.update(map=report['maps'].get(currentScene),seq=v.get('seq'),camera=p,target=t,scene=scene,night=v.get('night',False),at=time.time());note()
  if now-lastReport>1:
   lastReport=now;report.update(heartbeat=time.time(),scene=currentScene,phase='native viewport live');note()
  if first and time.time()-report['startedAt']>7:
   first=False;sz=ed.get_level_viewport_size()
   if sz.x<1400:u.SystemLibrary.execute_console_command(world,'LevelEditor.ToggleImmersive')
   report['viewport']=[sz.x,sz.y];note()
 except (PermissionError,FileNotFoundError,json.JSONDecodeError):pass
 except Exception:report['errors'].append(traceback.format_exc());note()
handle=u.register_slate_post_tick_callback(tick)
from ue_runtime_v162 import ensure_runtime
ensure_runtime()

