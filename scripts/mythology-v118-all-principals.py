import bpy,json,runpy
from pathlib import Path
from mathutils import Vector
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
if sc.get('v118_all_principals_done'):raise RuntimeError('Already done')
skin=bpy.data.materials['V118 FINAL crew actual anatomical 2K skin'];hair=bpy.data.materials['V118 FINAL crew matte umber hair'];lips=bpy.data.materials['V118 FINAL restrained natural lips'];eyes=bpy.data.materials['V118 FINAL actual ocular iris and sclera DATA']
def bind(obj,mat,uv=False):
 obj.data=obj.data.copy();obj.data.materials.clear();obj.data.materials.append(mat)
 for slot in obj.material_slots:slot.link='DATA';slot.material=mat
 for f in obj.data.polygons:f.material_index=0
 if uv:
  active=obj.data.uv_layers.active or obj.data.uv_layers.new(name='FINAL_UV')
  for u in list(obj.data.uv_layers):
   if u!=active:obj.data.uv_layers.remove(u)
  active.name='FINAL_UV';active.active_render=True;obj.data.uv_layers.active_index=0
names=[]
for i in range(4):
 for role in ['captain','helmsman']:
  actor=bpy.data.objects['V112 ship'+str(i)+' '+role+' detailed actor'];parts=[o for o in actor.children if o and o.type=='MESH' and not o.hide_render]
  body=next(o for o in parts if o.name.endswith(' base003'));eye=next(o for o in parts if 'Humanlow-poly' in o.name)
  bind(body,skin,True)
  for o in parts:
   if 'short01' in o.name.lower():bind(o,hair)
   elif o.name.endswith('base003_2'):bind(o,lips)
   elif o.name.endswith('base003_5'):bind(o,skin,True)
  # Same posed source eye topology for every captain/helmsman, use corrected
  # corresponding original ship0 surface UVs; no guessed eye placement.
  source=bpy.data.objects['V112 ship0 '+role+' Humanlow-poly']
  sourceUV=[tuple(u.uv) for u in source.data.uv_layers.active.data]
  bind(eye,eyes,True)
  if len(sourceUV)!=len(eye.data.uv_layers.active.data):raise RuntimeError('Ocular source topology differs')
  for u,xy in zip(eye.data.uv_layers.active.data,sourceUV):u.uv=xy
  names.append(actor.name)
sc['v118_all_principals_done']=True
(O/'04-all-principal-materials.json').write_text(json.dumps({'actors':names,'sameOriginalEyeTopology':True,'noNewBodies':True},indent=2),encoding='utf8')
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_figures'](R,O)
print('ALL_EIGHT_ORIGINAL_PRINCIPAL_MATERIALS_EXPORTED')
