"""Load saved V149 only: no asset generation or reimport on preview."""
import unreal as u,json,time,traceback
from pathlib import Path
P=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');V=P/'.verify/v32-149'
u.EditorPythonScripting.set_keep_python_script_alive(True)
actors=u.get_editor_subsystem(u.EditorActorSubsystem);assets=u.get_editor_subsystem(u.EditorAssetSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV149');world=ed.get_editor_world();byName={a.get_actor_label():a for a in actors.get_all_level_actors()};cam=byName['Full cove'];shore=byName['Rock shore']
u.get_editor_subsystem(u.LevelEditorSubsystem).editor_set_game_view(True)
actors.clear_actor_selection_set()
for command in ['r.DepthOfFieldQuality 0','r.MotionBlurQuality 0','r.Streaming.PoolSize 2300','r.ScreenPercentage 85','r.AntiAliasingMethod 4','r.VolumetricFog.GridPixelSize 12','t.MaxFPS 40']:
 u.SystemLibrary.execute_console_command(world,command)
exec(compile((P/'scripts/ue-resolution-runtime-v151.py').read_text(encoding='utf-8'),str(P/'scripts/ue-resolution-runtime-v151.py'),'exec'),globals())
# Pair with -EditorPixelStreamingRes=1920x1080: -ResX only configures game output.
# The editor producer crops the Slate viewport, so expand that actual widget once.
viewportBootstrapStart151=time.monotonic();viewportBootstrapHandle151=None;viewportBootstrapPhase151=0
def viewportBootstrap151(dt):
 global viewportBootstrapHandle151,viewportBootstrapPhase151
 if time.monotonic()-viewportBootstrapStart151<3:return
 sz151=ed.get_level_viewport_size()
 if viewportBootstrapPhase151==0:
  if sz151.x<1600 or sz151.y<900:u.SystemLibrary.execute_console_command(world,'LevelEditor.ToggleImmersive')
  viewportBootstrapPhase151=1;return
 if time.monotonic()-viewportBootstrapStart151<6:return
 sz151=ed.get_level_viewport_size();vd151=P/'.verify/v32-151';vd151.mkdir(exist_ok=True)
 (vd151/'ue-bootstrap-viewport.json').write_text(json.dumps({'width':sz151.x,'height':sz151.y,'meets1600x900':sz151.x>=1600 and sz151.y>=900,'map':ed.get_editor_world().get_path_name(),'at':time.time()}),encoding='utf-8')
 u.unregister_slate_post_tick_callback(viewportBootstrapHandle151)
viewportBootstrapHandle151=u.register_slate_post_tick_callback(viewportBootstrap151)
exec(compile((P/'scripts/ue-camera-bridge-v149.py').read_text(encoding='utf-8'),str(P/'scripts/ue-camera-bridge-v149.py'),'exec'),globals())
if assets.does_asset_exist('/Game/Cove/V152_LiveSea') and assets.does_asset_exist('/Game/Cove/V152DistantGull'):
 exec(compile((P/'scripts/ue-motion-runtime-v152.py').read_text(encoding='utf-8'),str(P/'scripts/ue-motion-runtime-v152.py'),'exec'),globals())
if assets.does_asset_exist('/Game/Cove/V153_ContinuousDeepSea') and assets.does_asset_exist('/Game/Cove/V153ContinuousOcean'):
 exec(compile((P/'scripts/ue-ocean-runtime-v153.py').read_text(encoding='utf-8'),str(P/'scripts/ue-ocean-runtime-v153.py'),'exec'),globals())
lastCommand149=None;lastPoll149=0.
def bridge149(dt):
 global lastCommand149,lastPoll149
 if time.monotonic()-lastPoll149<.25:return
 lastPoll149=time.monotonic();ff=V/'ue-command.json'
 if not ff.exists():return
 stamp=ff.stat().st_mtime_ns
 if stamp==lastCommand149:return
 lastCommand149=stamp
 try:
  job=json.loads(ff.read_text(encoding='utf-8-sig'));sp=(P/job['script']).resolve()
  if not str(sp).startswith(str(P/'scripts')):raise RuntimeError('Outside project scripts')
  exec(compile(sp.read_text(encoding='utf-8'),str(sp),'exec'),globals());(V/'ue-command-result.json').write_text(json.dumps({'ok':True,'job':job}),encoding='utf-8')
 except Exception:(V/'ue-command-result.json').write_text(json.dumps({'ok':False,'trace':traceback.format_exc()}),encoding='utf-8')
liveHandle149=u.register_slate_post_tick_callback(bridge149)
(V/'ue-bootstrap.json').write_text(json.dumps({'stage':'live','map':'/Game/Cove/FullCoveV149','noAssetRebuild':True}),encoding='utf-8')
