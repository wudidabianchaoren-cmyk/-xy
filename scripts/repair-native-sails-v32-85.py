import bpy, os, math
from mathutils import Vector, Matrix
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','mythology-v32-85')
bpy.ops.wm.open_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
targets=[o for o in bpy.context.scene.objects if o.get('source_key') and 'linen sail' in str(o.get('source_name',''))]
names=[o.name for o in targets]
with bpy.data.libraries.load(os.path.join(P,'blender','mythology-v32-84','mythology-refined.blend'),link=False) as (source,dest):dest.objects=[n for n in source.objects if n in names]
originals={o.get('source_key'):o for o in dest.objects if o}
specs=[(-7,3,1.22,0),(42,-24,1.12,-.42),(-32,-10,1.08,.28),(-10,-35,1.05,0)]
audit=[]
for o in targets:
 old=originals[o['source_key']];assert len(old.data.vertices)==len(o.data.vertices)
 for v,w in zip(o.data.vertices,old.data.vertices):v.co=o.matrix_world.inverted()@(old.matrix_world@w.co)
 center=sum((o.matrix_world@v.co for v in o.data.vertices),Vector())/len(o.data.vertices)
 variant=min(range(4),key=lambda i:(center.x-specs[i][0])**2+(center.y+specs[i][1])**2)
 x,z,s,yaw=specs[variant];transform=Matrix.Translation(Vector((x,-z,.18)))@Matrix.Rotation(yaw,4,'Z')@Matrix.Diagonal(Vector((s,s,s,1)));inv=transform.inverted()
 if variant==1:
  for v in o.data.vertices:
   local=inv@(o.matrix_world@v.co);local.z=max(6.2,local.z);v.co=o.matrix_world.inverted()@transform@local
 elif variant==2:
  # A lugsail tapers to the mast at its foot, retaining the authored cloth grid.
  locals=[inv@(o.matrix_world@v.co) for v in o.data.vertices];lo=min(v.z for v in locals);hi=max(v.z for v in locals);axis=sum(v.x for v in locals)/len(locals)
  for v,local in zip(o.data.vertices,locals):
   width=.16+.84*(local.z-lo)/max(.001,hi-lo);local.x=axis+(local.x-axis)*width;v.co=o.matrix_world.inverted()@transform@local
 o.data.update();audit.append({'key':o['source_key'],'variant':variant,'vertices':len(o.data.vertices)})
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and o.get('source_key'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
for old in originals.values():bpy.data.objects.remove(old,do_unlink=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
import json
report=json.load(open(os.path.join(O,'native-production-audit.json'),encoding='utf8'));report['sailAssignments']=audit;json.dump(report,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),indent=2)
assert [sum(a['variant']==v for a in audit) for v in range(4)]==[2,2,1,2]
print('V85 NATIVE SAIL ASSIGNMENTS 2 / 2 / 1 / 2 VERIFIED')
