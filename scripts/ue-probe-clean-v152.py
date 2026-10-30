"""Clean display first; inspect actual helpers without removing any world asset."""
from pathlib import Path
import json,time
V152=P/'.verify/v32-152';V152.mkdir(exist_ok=True);(V152/'before').mkdir(exist_ok=True)
level152=u.get_editor_subsystem(u.LevelEditorSubsystem)
probe152={'gameViewBefore':level152.editor_get_game_view(),'map':ed.get_editor_world().get_path_name(),'actors':[]}
for a152 in actors.get_all_level_actors():
 item152={'name':a152.get_actor_label(),'class':a152.get_class().get_name(),'hiddenInGame':a152.get_editor_property('hidden')}
 if isinstance(a152,u.StaticMeshActor):
  sm152=a152.static_mesh_component.static_mesh;item152['mesh']=sm152.get_path_name() if sm152 else None;item152['bounds']=str(a152.get_actor_bounds(False))
 probe152['actors'].append(item152)
actors.clear_actor_selection_set();level152.editor_set_game_view(True)
for cmd152 in ['ShowFlag.SelectionOutline 0','ShowFlag.CompositeEditorPrimitives 0','r.Streaming.FullyLoadUsedTextures 1','r.Streaming.UseAllMips 1','r.Streaming.PoolSize 2300']:
 u.SystemLibrary.execute_console_command(world,cmd152)
probe152['gameViewAfter']=level152.editor_get_game_view();probe152['deletedActors']=0
(V152/'ue-helper-probe.json').write_text(json.dumps(probe152,indent=2),encoding='utf-8')
u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V152/'ue-clean-gameview.png'),camera=cam)
