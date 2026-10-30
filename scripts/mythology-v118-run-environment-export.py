import runpy
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118'
runpy.run_path(str(ROOT/'scripts/mythology-v118-export.py'))['export_environment'](ROOT,OUT)