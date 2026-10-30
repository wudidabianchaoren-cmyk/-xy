import bpy,json,hashlib,collections
from pathlib import Path
R=Path.cwd();V=R/'.verify/v32-126';V.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/directory-v32-125/directory-room.blend'))
objects=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH':
  objects.append({'name':o.name,'hidden':o.hide_render,'vertices':len(o.data.vertices),'polys':len(o.data.polygons),'location':list(o.location),'dims':list(o.dimensions),'materials':[m.name for m in o.data.materials]})
(V/'native-original-objects.json').write_text(json.dumps(objects,indent=2),encoding='utf8')
print(json.dumps([o for o in objects if any(w.lower() in o['name'].lower() for w in ['CRT','Bezel','nav-','Calendar','room-static','legible','Preview','Disc'])],indent=2))
