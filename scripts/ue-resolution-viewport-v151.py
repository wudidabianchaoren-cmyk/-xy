"""Maximize the sole streamed editor viewport within its existing hidden root window."""
import json,time
from pathlib import Path
rv151=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/.verify/v32-151')
beforeSize151=ed.get_level_viewport_size()
u.SystemLibrary.execute_console_command(world,'LevelEditor.ToggleImmersive')
viewportStart151=time.monotonic();viewportHandle151=None
def viewportReport151(dt):
 global viewportHandle151
 if time.monotonic()-viewportStart151<3:return
 afterSize151=ed.get_level_viewport_size()
 (rv151/'ue-viewport-size.json').write_text(json.dumps({'before':str(beforeSize151),'after':str(afterSize151),'command':'LevelEditor.ToggleImmersive','noSceneChanges':True}),encoding='utf-8')
 u.unregister_slate_post_tick_callback(viewportHandle151)
viewportHandle151=u.register_slate_post_tick_callback(viewportReport151)
