"""Apply only current rendering stability and the courtyard light correction."""
import unreal as u,inspect,json,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-163'
QUALITY=['r.AntiAliasingMethod 4','r.ScreenPercentage 100','r.TSR.History.SampleCount 32','r.TSR.History.ScreenPercentage 200','r.Tonemapper.GrainQuantization 0','r.TSR.ShadingRejection.Flickering 1','r.Lumen.ScreenProbeGather.Temporal.MaxFramesAccumulated 32','r.Lumen.Reflections.Temporal.MaxFramesAccumulated 24','r.Shadow.Virtual.SMRT.RayCountLocal 16','r.Shadow.Virtual.SMRT.SamplesPerRayLocal 8','r.Shadow.Virtual.SMRT.AdaptiveRayCount 0','r.Tonemapper.Sharpen 0','r.CustomDepth 3']
def apply():
 # Replace the registered camera callback without restarting the editor or
 # allowing the old and new scene controllers to run at the same time.
 g=next(frame.frame.f_globals for frame in inspect.stack()if frame.filename.replace('\\','/').endswith('ue-live-final-v162.py')and 'report'in frame.frame.f_globals)
 u.unregister_slate_post_tick_callback(g['handle']);source=(P/'scripts/ue-live-final-v162.py').read_text(encoding='utf-8');body=source[source.index('def tick(dt):'):source.index('handle=u.register_slate_post_tick_callback')];g.update(lastCameraPose=None,lastLamp=None,lastNight=None,cameraWrites=0);exec(source[source.index('def load(scene):'):source.index("\nload('myth')")],g);exec(compile(body,str(P/'scripts/ue-live-final-v162.py'),'exec'),g);g['handle']=u.register_slate_post_tick_callback(g['tick'])
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 for c in QUALITY:u.SystemLibrary.execute_console_command(ed.get_editor_world(),c)
 levels.load_level('/Game/V162/Courtyard');actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 for a in actors.get_all_level_actors():
  if a.get_actor_label()=='Courtyard broad warm key':a.light_component.set_light_color(u.LinearColor(1.,.63,.30,1));a.light_component.set_intensity(620.)
  if a.get_actor_label()=='Courtyard quiet stone return':a.light_component.set_light_color(u.LinearColor(1.,.72,.46,1));a.light_component.set_intensity(75.)
  if isinstance(a,u.PostProcessVolume):
   s=a.get_editor_property('settings');s.set_editor_property('auto_exposure_bias',-.55);a.set_editor_property('settings',s)
 u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/V162/Courtyard')
 import ue_runtime_v162,ue_mirror_v162,ue_room_media_v163
 if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
 importlib.reload(ue_mirror_v162);importlib.reload(ue_room_media_v163);importlib.reload(ue_runtime_v162).ensure_runtime();(OUT/'native-stability-applied.json').write_text(json.dumps({'cameraWritesOnlyOnPoseChange':True,'lightsOnlyOnStateChange':True,'singleNativeRoom':True,'quality':QUALITY,'islandArtPreserved':True}))
