import bpy,json
from pathlib import Path
OUT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/mythology-v32-112')
forest=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession']
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and o.name.startswith('island_trees_01_blockout_cleaned') and o.name not in forest.objects:bpy.data.objects.remove(o,do_unlink=True)
protos=list({o.data.name:o.data for o in forest.objects if o.name.startswith('V112 tree') and o.type=='MESH'}.values())
audit=[{'part':d.materials[0].name,'triangles':sum(len(p.vertices)-2 for p in d.polygons)} for d in protos]
(OUT/'canopy-lod-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'instances':len({o.name.split()[2] for o in forest.objects if o.name.startswith('V112 tree')}),'perMaterialPrototype':audit,'newPrototypeTriangles':sum(p['triangles'] for p in audit)},indent=2),encoding='utf8');print('V112_CANOPY_FINAL',json.dumps(audit))
