import bpy,json
from pathlib import Path
from mathutils import Vector
R=Path.cwd();bpy.ops.wm.open_mainfile(filepath=str(R/'blender/directory-v32-123/directory-room.blend'))
items=[]
for o in bpy.context.scene.objects:
 if o.type=='LIGHT' or (o.type=='MESH' and not o.name.startswith(('room-static','CC0 photo plant','Remote123 printed','Remote123 key'))):
  items.append({'name':o.name,'type':o.type,'location':list(o.location),'dimensions':list(o.dimensions),'hide':o.hide_render,'key':o.get('key'),'energy':o.data.energy if o.type=='LIGHT' else None})
(R/'.verify/v32-124').mkdir(parents=True,exist_ok=True);(R/'.verify/v32-124/native-inventory.json').write_text(json.dumps(items,indent=2),encoding='utf8')
print('INVENTORY',len(items))
