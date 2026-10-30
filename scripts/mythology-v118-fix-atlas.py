import bpy,json,runpy
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';ob=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];me=ob.data
before=[{'name':u.name,'active':u.active,'render':u.active_render} for u in me.uv_layers]
assert me.uv_layers.get('Terrain metres')
for u in list(me.uv_layers):
 if u.name!='Terrain metres':me.uv_layers.remove(u)
me.uv_layers.active_index=0;me.uv_layers[0].active_render=True
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_objects'](O,[ob],'island-v118.glb')
audit={'nativeBakedAtlas':'Terrain metres','before':before,'after':[u.name for u in me.uv_layers],'why':'An unused UVMap from the original boolean cutter exported before the baked terrain atlas; explicit single UV prevents sampling unbaked black space. Native bake and live TEXCOORD_0 now same.'}
(O/'04-uv-atlas-integration.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))