import bpy,json,pathlib
out=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH' and any('pale gold' in m.name for m in o.data.materials if m):
  out.append({'name':o.name,'vertices':len(o.data.vertices),'location':list(o.location),'scale':list(o.scale),'bounds':[list(v) for v in o.bound_box]})
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/.verify/v32-80/native-gold.json');p.write_text(json.dumps(out,indent=2));print(json.dumps(out[:2]))
