"""Capture the warmed native result and report actual runtime state."""
from pathlib import Path
import json
V152=P/'.verify/v32-152'
captureReport152={'world':ed.get_editor_world().get_path_name(),'gameView':u.get_editor_subsystem(u.LevelEditorSubsystem).editor_get_game_view(),'viewport':str(ed.get_level_viewport_size()),'cvars':{}}
for cc152 in ['r.Nanite','r.Nanite.MaxPixelsPerEdge','r.Streaming.FullyLoadUsedTextures','r.Streaming.UseAllMips','r.Streaming.DropMips','r.ScreenPercentage','r.ViewDistanceScale','r.AntiAliasingMethod']:
 try:captureReport152['cvars'][cc152]=u.SystemLibrary.get_console_variable_float_value(cc152)
 except Exception as ex:captureReport152['cvars'][cc152]=str(ex)
(V152/'ue-capture-state.json').write_text(json.dumps(captureReport152,indent=2),encoding='utf-8')
u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V152/'ue-live-dynamics.png'),camera=cam)
