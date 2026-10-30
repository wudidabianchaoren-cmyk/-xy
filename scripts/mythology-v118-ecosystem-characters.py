import bpy,runpy,math,random,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118';sc=bpy.context.scene
if sc.get('v118_ecosystem_completed'):raise RuntimeError('Already completed, resume native stage')
land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];me=land.data;bvh=BVHTree.FromPolygons([v.co.copy() for v in me.vertices],[tuple(p.vertices) for p in me.polygons])
def support(x,y):return bvh.ray_cast(Vector((x,y,120)),Vector((0,0,-1)),200)
forest=bpy.data.collections['V117_FOREST'];rng=random.Random(11886);retained=0;hidden=0
for o in forest.objects:
 if not o or not o.name.startswith('V117 forest fern'):continue
 # Photograph ferns stay in shaded protected pockets, not spread over dry maritime slopes.
 keep=o.location.y>167 and rng.random()<.68
 o.hide_render=not keep;o.hide_set(not keep)
 if keep:retained+=1
 else:hidden+=1
protos=[bpy.data.objects['V117 tree 000 part'+str(i)] for i in [0,2]]
positions=[];attempt=0
while len(positions)<420 and attempt<16000:
 attempt+=1;x=rng.uniform(-212,82);y=rng.uniform(100,233);p,n,index,_=support(x,y)
 if not p or p.z<4 or n.z<.74:continue
 if ((x+132)/17)**2+((y-125)/20)**2<1:continue
 if any((x-q.x)**2+(y-q.y)**2<5.5 for q in positions):continue
 h=rng.uniform(1.8,3.0);w=rng.uniform(1.25,1.85);a=rng.uniform(0,math.tau)
 for src in protos:
  o=bpy.data.objects.new('V118 maquis shrub %03d '%len(positions)+src.name.split(' ')[-1],src.data);forest.objects.link(o);o.location=(x,y,p.z-.33*h);o.rotation_euler[2]=a;o.scale=(h*w,h*w,h)
 positions.append(p)
runpy.run_path(str(ROOT/'scripts/mythology-v118-character-polish.py'))['polish'](ROOT,OUT)
rolecounts={}
for ship in [bpy.data.objects['V112_SHIP_'+str(i)] for i in range(4)]:
 for o in ship.children_recursive:
  if o and not o.hide_render:
   k=o.get('role','none');rolecounts[k]=rolecounts.get(k,0)+1
audit={'actualMCP':True,'maquisClumps':len(positions),'retainedShadeFerns':retained,'removedFernsFromSunnyDrySlope':hidden,'nativeSpeciesClaim':'Existing broadleaf scan used as visual maquis, not a taxonomic reconstruction','shipVisibleRoleCounts':rolecounts}
(OUT/'02-ecosystem-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');sc['v118_ecosystem_completed']=True
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'02-maquis-and-integrated-characters.blend'));print(json.dumps(audit))
