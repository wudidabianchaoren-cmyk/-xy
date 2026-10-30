"""Runtime-only streaming quality profile, no world or material changes."""
from pathlib import Path
import json,time
resolutionVerify151=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/.verify/v32-151');resolutionVerify151.mkdir(exist_ok=True)
resolutionCommands151=['r.ScreenPercentage 100','PixelStreaming2.WebRTC.Fps 30','PixelStreaming2.WebRTC.MinBitrate 2500000','PixelStreaming2.WebRTC.MaxBitrate 12000000','t.MaxFPS 40']
for resolutionCommand151 in resolutionCommands151:u.SystemLibrary.execute_console_command(world,resolutionCommand151)
resolutionReport151={'appliedAt':time.time(),'runtimeCommands':resolutionCommands151,'requestedStreamSize':[1600,900],'nativeViewportResize':'Editor Resolution.Width/Height frontend command is required; r.SetRes alone does not fix an editor capture region.','world':ed.get_editor_world().get_path_name(),'noSceneOrMaterialChanges':True,'cvars':{}}
for resolutionCVar151 in ['r.ScreenPercentage','PixelStreaming2.WebRTC.Fps','PixelStreaming2.WebRTC.MinBitrate','PixelStreaming2.WebRTC.MaxBitrate']:
 try:resolutionReport151['cvars'][resolutionCVar151]=u.SystemLibrary.get_console_variable_float_value(resolutionCVar151)
 except Exception as ex:resolutionReport151['cvars'][resolutionCVar151]=str(ex)
(resolutionVerify151/'ue-resolution-runtime.json').write_text(json.dumps(resolutionReport151,indent=2),encoding='utf-8')
