import bpy,bmesh,json
from pathlib import Path
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')
island=next(o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('V21 solid inhabited'))
bm=bmesh.new();bm.from_mesh(island.data)
report={'version':'V32.75','actualBlenderReadback':True,'blendFile':bpy.data.filepath,'vertices':len(bm.verts),'faces':len(bm.faces),'boundaryEdges':sum(e.is_boundary for e in bm.edges),'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges),'heightRange':[min(v.co.z for v in bm.verts),max(v.co.z for v in bm.verts)],'coastSpan':[max(v.co.x for v in bm.verts)-min(v.co.x for v in bm.verts),max(v.co.y for v in bm.verts)-min(v.co.y for v in bm.verts)],'materials':[m.name for m in island.data.materials if m]}
bm.free();report['passed']=report['boundaryEdges']==0 and report['heightRange'][1]-report['heightRange'][0]>25
(P/'blender/reference-architecture-v21/readback-audit.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report))
