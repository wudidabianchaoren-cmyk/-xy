import bpy,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1]
lib=P/'assets/odyssey/characters-v117/source/unpacked/human-base-meshes-bundle-v1.4.1/human_base_meshes_bundle.blend'
with bpy.data.libraries.load(str(lib),link=False) as (a,b):
 print('NAMES',[s for s in a.objects if any(t in s.lower() for t in ['body_male_realistic','body - male - realistic','eye - realistic'])]);b.objects=['GEO-body_male_realistic','GEO-body_male_realistic.eye.R','GEO-body_male_realistic.eye.L']
for o in b.objects:
 if o and o.type=='MESH':
  bpy.context.collection.objects.link(o);ps=[o.matrix_world@Vector(q) for q in o.bound_box];print('BODY',o.name,len(o.data.vertices),[min(p[i] for p in ps) for i in range(3)],[max(p[i] for p in ps) for i in range(3)],list(o.matrix_world),[m.name for m in o.modifiers])
