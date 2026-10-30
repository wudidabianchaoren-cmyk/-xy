import bpy,json
from pathlib import Path
p=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')/'blender/reference-architecture-v19'
results=[]
for name in ['architecture-v19.blend','polyphemus-grounded.blend','island.blend']:
 bpy.ops.wm.open_mainfile(filepath=str(p/name))
 s=bpy.context.scene
 results.append({'file':name,'objects':len(s.objects),'meshes':sum(o.type=='MESH' for o in s.objects),'engine':s.render.engine,'cyclesSamples':s.cycles.samples,'resolution':[s.render.resolution_x,s.render.resolution_y],'vertices':sum(len(o.data.vertices) for o in s.objects if o.type=='MESH')})
assert all(r['meshes']>0 and r['vertices']>100 for r in results)
a=json.loads((p/'native-production-audit.json').read_text());a['nativeReadBack']=results;a['passed']=True;(p/'native-production-audit.json').write_text(json.dumps(a,indent=2));bpy.ops.wm.read_factory_settings(use_empty=True);print(json.dumps(results))
