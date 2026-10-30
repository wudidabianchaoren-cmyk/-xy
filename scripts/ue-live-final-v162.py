"""Local offscreen UE editor. Resident scenes and bounded numeric page controls."""
import unreal as u,json,time,math,traceback,sys,importlib,builtins,os
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-162';OUT.mkdir(exist_ok=True);sys.path.insert(0,str(P/'scripts'));builtins._zaojing_ue_busy=False
u.EditorPythonScripting.set_keep_python_script_alive(True)
levels=u.get_editor_subsystem(u.LevelEditorSubsystem);actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
maps={'myth':'/Game/Cove/FullCoveV162','room':'/Game/V162/Studio','home':'/Game/V162/Courtyard'}
report={'engine':u.SystemLibrary.get_engine_version(),'visibleEditor':False,'offscreen':True,'processId':os.getpid(),'maps':maps,'startedAt':time.time(),'phase':'native viewport starting','errors':[],'mode':'complete native UE viewport / serialized scene ownership'}
current='myth';stamp=0;jobStamp=0;last=0.;heartbeat=0.;sunDay=[];lastCameraPose=None;lastLamp=None;lastNight=None;cameraWrites=0
def note():(OUT/'ue-live.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
def vec(p):return u.Vector(p[0]*100,p[2]*100,p[1]*100)
def load(scene):
 global current,sunDay,lastCameraPose,lastLamp,lastNight
 assert scene in maps
 import ue_worlds_v165
 ue_worlds_v165.ensure();loaded=ue_worlds_v165.show(scene);labels={a.get_actor_label()for a in loaded}
 if scene=='myth':assert {'Vessel','Island'}.issubset(labels),'Cove scene identity failed'
 if scene=='room':assert len(loaded)>300,'Studio scene identity failed'
 if scene=='home':assert sum('HomePart_'in name for name in labels)>80,'Courtyard scene identity failed'
 
 for a in loaded:
  if isinstance(a,u.PostProcessVolume):
   settings=a.get_editor_property('settings');settings.set_editor_property('override_film_grain_intensity',True);settings.set_editor_property('film_grain_intensity',0.);a.set_editor_property('settings',settings)
 current=scene;lastCameraPose=None;lastLamp=None;lastNight=None;levels.editor_set_game_view(True);actors.clear_actor_selection_set();sunDay=ue_worlds_v165.day_lights(scene);report.update(scene=scene,map=maps[scene],residentWorld=ue_worlds_v165.PATH,preloadedScenes=True);u.SystemLibrary.execute_console_command(ed.get_editor_world(),'DisableAllScreenMessages')
initialScene='myth'if '-PortfolioInitialScene=myth'in u.SystemLibrary.get_command_line()else'room'if '-PortfolioInitialScene=room'in u.SystemLibrary.get_command_line()else'home'
load(initialScene)
controlPath=OUT/'ue-camera-input.json'
if controlPath.exists():stamp=controlPath.stat().st_mtime_ns
try:u.get_default_object(u.EditorPerformanceSettings).set_editor_property('throttle_cpu_when_not_foreground',False)
except Exception:pass
for c in ['Slate.bAllowThrottling 0','t.IdleWhenNotForeground 0','r.Streaming.FullyLoadUsedTextures 1','r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2000','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(ed.get_editor_world(),c)
initialP=[37,17,49]if initialScene=='myth'else[.02,1.82,3.08]if initialScene=='room'else[3.8,6.2,26.5];initialT=[-6,9,-16]if initialScene=='myth'else[-.05,1.17,-.14]if initialScene=='room'else[0,4.2,-2];ed.set_level_viewport_camera_info(vec(initialP),u.MathLibrary.find_look_at_rotation(vec(initialP),vec(initialT)));note()
def tick(dt):
 global stamp,jobStamp,last,heartbeat,lastCameraPose,lastLamp,lastNight,cameraWrites,sunDay
 if getattr(builtins,'_zaojing_ue_busy',False):return
 now=time.monotonic()
 if now-last<1/120:return
 last=now;builtins._zaojing_ue_busy=True
 try:
  job=OUT/'asset-update.json'
  if job.exists()and job.stat().st_mtime_ns!=jobStamp:
   jobStamp=job.stat().st_mtime_ns;kind=json.loads(job.read_text(encoding='utf-8-sig')).get('kind');report['phase']='updating '+str(kind);note();restore=current
   try:
    if kind in ['polish','audit']:
     import ue_polish_v162
     module=importlib.reload(ue_polish_v162);module.polish()if kind=='polish'else module.audit()
    elif kind=='home':
     import ue_home_v162
     importlib.reload(ue_home_v162).build_home()
   finally:
    if ed.get_editor_world().get_name()!=maps[restore].rsplit('/',1)[1]:load(restore)
    else:
     report['phase']='native viewport live';note();lastNight=None;lastLamp=None;lastCameraPose=None;sunDay=[(a,a.light_component.intensity,a.light_component.get_light_color())for a in actors.get_all_level_actors()if isinstance(a,u.DirectionalLight)]
    stamp=0
   job.unlink(missing_ok=True)
  f=OUT/'ue-camera-input.json'
  if f.exists()and f.stat().st_mtime_ns!=stamp:
   nextStamp=f.stat().st_mtime_ns;v=json.loads(f.read_text(encoding='utf-8-sig'));scene=v.get('scene','myth');p=v.get('camera',[37,17,49]);t=v.get('target',[-6,9,-16])
   if scene not in maps:raise ValueError('Unsupported scene')
   if scene!=current:load(scene)
   if len(p)!=3 or len(t)!=3 or not all(isinstance(x,(int,float))and math.isfinite(x)and abs(x)<100000 for x in p+t):raise ValueError('Invalid numeric camera')
   size=ed.get_level_viewport_size();fov=float(v.get('fov',57.1));hfov=math.degrees(2*math.atan(math.tan(math.radians(fov)/2)*size.x/max(1,size.y)))if v.get('verticalFov')else fov
   pose=tuple(round(x,5)for x in p+t)+(round(hfov,4),)
   if pose!=lastCameraPose:
    if lastCameraPose is None or abs(lastCameraPose[-1]-hfov)>.0001:
     if hasattr(levels,'eject_pilot_level_actor'):levels.eject_pilot_level_actor()
     levels.set_level_viewport_fov(hfov,levels.get_active_viewport_config_key())
    ed.set_level_viewport_camera_info(vec(p),u.MathLibrary.find_look_at_rotation(vec(p),vec(t)));lastCameraPose=pose;cameraWrites+=1
    realp,realr=ed.get_level_viewport_camera_info();report['appliedCamera']=[realp.x/100,realp.z/100,realp.y/100]
   if scene=='room'and v.get('lamp',True)!=lastLamp:
    lastLamp=v.get('lamp',True)
    for a in actors.get_all_level_actors():
     if isinstance(a,(u.PointLight,u.RectLight))and any(k in a.get_actor_label().lower()for k in['practical','bulb','warm shade','soft room']):
      label=a.get_actor_label().lower();base=18. if('practical'in label or'bulb'in label)else 4. if'warm shade'in label else 12.;a.light_component.set_intensity(base if lastLamp else 0.)
   if v.get('night',False)!=lastNight:
    lastNight=v.get('night',False)
    for a,power,col in sunDay:a.light_component.set_intensity(.4 if lastNight else power);a.light_component.set_light_color(u.LinearColor(.35,.48,.75,1)if lastNight else col)
   report.update(cameraWrites=cameraWrites,verticalFov=bool(v.get('verticalFov')),horizontalFov=hfov)
   stamp=nextStamp;report.update(seq=v.get('seq'),scene=scene,map=maps[scene],camera=p,target=t,night=v.get('night',False),at=time.time());note()
  if now-heartbeat>1:heartbeat=now;size=ed.get_level_viewport_size();report.update(heartbeat=time.time(),phase='native viewport live',viewport=[size.x,size.y]);note()
 except (PermissionError,FileNotFoundError,json.JSONDecodeError):pass
 except Exception:
  if len(report['errors'])<8:report['errors'].append(traceback.format_exc())
  note()
 finally:builtins._zaojing_ue_busy=False
from ue_stability_v163 import QUALITY
from ue_session_v171 import apply as apply_session_scheduling
apply_session_scheduling()
for command in QUALITY:u.SystemLibrary.execute_console_command(ed.get_editor_world(),command)
handle=u.register_slate_post_tick_callback(tick)
from ue_runtime_v162 import ensure_runtime
ensure_runtime()
from ue_art_v164 import QUALITY as QUALITY_V164
for command in QUALITY_V164+['MediaIO.EnableExperimentalScheduling 0']:u.SystemLibrary.execute_console_command(ed.get_editor_world(),command)
from ue_stream_v164 import ensure as ensure_native_capture
ensure_native_capture(refresh=True)
u.SystemLibrary.execute_console_command(ed.get_editor_world(),'PixelStreaming2.Encoder.Codec VP9')
u.SystemLibrary.execute_console_command(ed.get_editor_world(),'PixelStreaming2.WebRTC.Fps 45')
u.SystemLibrary.execute_console_command(ed.get_editor_world(),'t.MaxFPS 45')
report['codec']=u.SystemLibrary.get_console_variable_string_value('PixelStreaming2.Encoder.Codec');report['captureExperimentalScheduling']=u.SystemLibrary.get_console_variable_int_value('MediaIO.EnableExperimentalScheduling');note()
