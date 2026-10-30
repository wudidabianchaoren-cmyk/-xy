import bpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');P=R/'assets/odyssey/characters-v117/source/unpacked/human-base-meshes-bundle-v1.4.1/human_base_meshes_bundle.blend'
with bpy.data.libraries.load(str(P),link=False) as (a,b):b.objects=['GEO-body_male_realistic']
o=b.objects[0];bpy.context.scene.collection.objects.link(o);o.name='V117_CC0_MALE_INSPECT';o.hide_render=True;o.hide_set(True)
print(json.dumps({'name':o.name,'vertices':len(o.data.vertices),'polygons':len(o.data.polygons),'location':list(o.location),'rotation':list(o.rotation_euler),'scale':list(o.scale),'bbox':[list(v) for v in o.bound_box],'modifiers':[(m.name,m.type) for m in o.modifiers],'materials':[m.name if m else None for m in o.data.materials]}))