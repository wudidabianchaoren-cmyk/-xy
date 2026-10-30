import bpy,json
from pathlib import Path
from mathutils import Vector
out=Path(bpy.data.filepath).parent.parent.parent/'.verify/v32-112'
out.mkdir(parents=True,exist_ok=True)
items=[]
for o in bpy.context.scene.objects:
 if o.type not in ('MESH','CAMERA','LIGHT'):continue
 lo=[min((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]
 hi=[max((o.matrix_world@Vector(v))[i] for v in o.bound_box) for i in range(3)]
 items.append({'name':o.name,'type':o.type,'visible':not o.hide_render,'bounds':[lo,hi],'vertices':len(o.data.vertices) if o.type=='MESH' else None,'materials':[m.name for m in o.data.materials if m] if o.type=='MESH' else [],'collections':[c.name for c in o.users_collection]})
report={'file':bpy.data.filepath,'scene':bpy.context.scene.name,'objects':len(items),'camera':bpy.context.scene.camera.name if bpy.context.scene.camera else None,'addons':list(bpy.context.preferences.addons.keys()),'items':items}
(out/'native-inventory.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({'file':report['file'],'objects':report['objects'],'camera':report['camera'],'addons':report['addons'],'report':str(out/'native-inventory.json')}))
