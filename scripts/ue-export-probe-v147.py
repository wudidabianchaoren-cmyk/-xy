import bpy,json
from pathlib import Path
P=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-134/compact-cove-lighting.blend'))
data={'objects':[{'name':o.name,'type':o.type,'verts':len(o.data.vertices) if o.type=='MESH' else 0,'loc':list(o.location),'dim':list(o.dimensions),'mats':[s.material.name if s.material else '' for s in o.material_slots]} for o in bpy.context.scene.objects], 'materials': [{'name':m.name,'images':[n.image.filepath for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image]} for m in bpy.data.materials if m.node_tree]}
(P/'.verify/v32-146/native-probe-v147.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
