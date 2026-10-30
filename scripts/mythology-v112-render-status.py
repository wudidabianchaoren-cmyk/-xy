import bpy,json
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-112')
report={'nativeFile':bpy.data.filepath,'renderJobRunning':bpy.app.is_job_running('RENDER'),'target':bpy.context.scene.render.filepath,'renderExists':(OUT/'cycles-hero-final.png').is_file(),'renderResultHasData':bool(bpy.data.images.get('Render Result') and bpy.data.images['Render Result'].has_data),'blenderVersion':bpy.app.version_string}
(OUT/'render-status.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
