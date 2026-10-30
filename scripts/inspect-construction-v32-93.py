import bpy,json,pathlib
from mathutils import Vector
p=pathlib.Path.cwd();s=bpy.context.scene;s.frame_set(1)
a=[]
for o in s.objects:
 if o.type=='MESH':
  b=[o.matrix_world@Vector(v) for v in o.bound_box]
  a.append({'name':o.name,'v':len(o.data.vertices),'bounds':[[round(min(v[i] for v in b),3),round(max(v[i] for v in b),3)]for i in range(3)],'mat':[m.name for m in o.data.materials if m]})
report={'meshes':a,'camera':{'p':list(s.camera.location),'r':list(s.camera.rotation_euler),'lens':s.camera.data.lens},'collections':[{ 'name':c.name,'count':len(c.all_objects)}for c in bpy.data.collections],'lights':[{'name':o.name,'energy':o.data.energy,'p':list(o.location)}for o in s.objects if o.type=='LIGHT']}
(p/'.verify/v32-93').mkdir(exist_ok=True);(p/'.verify/v32-93/native-inspect.json').write_text(json.dumps(report),encoding='utf8')
print(json.dumps({'meshCount':len(a),'largeMeshes':[v for v in a if v['v']>1000][:18],'collections':report['collections'],'camera':report['camera']}),flush=True)
