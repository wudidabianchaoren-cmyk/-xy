"""Replace the original buried round slope by a true recessed bedrock section."""
import bpy,json,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/ue-v147';O=P/'blender/mythology-v32-147';O.mkdir(exist_ok=True)
def smooth(a,b,x):
 t=max(0,min(1,(x-a)/(b-a)));return t*t*(3-2*t)
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v134/island.glb'));island=next(o for o in bpy.context.scene.objects if o.type=='MESH');island.matrix_world= island.matrix_world.copy();bpy.context.view_layer.objects.active=island;bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
plants=json.loads((P/'assets/odyssey/compact-v134/vegetation.json').read_text());roots=list({(round(p['position'][0],3),round(-p['position'][2],3)) for p in plants});changes=[]
for v in island.data.vertices:
 x,y,z=v.co;influence=0
 for cx,half,front,back,top in [(-17,18.5,11.,25.,13.2),(13,15.,18.,33.,8.0)]:
  side=1-smooth(half-4,half,abs(x-cx));frontw=smooth(front,front+3,y);backw=1-smooth(back-2,back+2,y);heightw=1-smooth(top-1.2,top,z);influence=max(influence,side*frontw*backw*heightw)
 if influence>0 and z>.3:
  # Keep sampled planting ground exactly where roots already meet it.
  near=min(math.hypot(x-rx,y-ry) for rx,ry in roots);influence*=smooth(1.5,2.7,near)
  target=.20+.12*math.sin(x*.31+y*.17);new=z+(min(z,target)-z)*influence
  if z-new>.05:changes.append(z-new)
  v.co.z=new
for f in island.data.polygons:f.use_smooth=True
island.name='Recessed actual island behind scanned cliff';bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island;bpy.ops.export_scene.fbx(filepath=str(A/'Island-cut.fbx'),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z')
allobs=[island]
for name,cx,cy,sx,sy,sz in [('coastal_cliff_02',-17,20,.88,.95,1.35),('coastal_cliff_04',13,27,.32,.32,.70)]:
 before=set(bpy.context.scene.objects);bpy.ops.import_scene.gltf(filepath=str(P/f'assets/odyssey/source-v145/{name}/{name}_4k.gltf'));obs=[o for o in bpy.context.scene.objects if o not in before and o.type=='MESH'];pts=[o.matrix_world@Vector(p) for o in obs for p in o.bound_box];lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);center=(lo+hi)/2
 for o in obs:
  mat=o.matrix_world.copy()
  for v in o.data.vertices:
   q=mat@v.co;q-=Vector((center.x,center.y,lo.z));height=q.z/max(hi.z-lo.z,.01);edge=smooth(.64,1,abs(q.x)/((hi.x-lo.x)*.5));q.x=q.x*sx+cx;q.y=q.y*sy+cy+edge*7+smooth(.73,1,height)*2.3;q.z=q.z*sz*(1-edge*.88)-.27;v.co=q
  o.matrix_world.identity();o.name='Embedded '+name
  for f in o.data.polygons:f.use_smooth=True
 bpy.ops.object.select_all(action='DESELECT')
 for o in obs:o.select_set(True)
 bpy.context.view_layer.objects.active=obs[0];bpy.ops.export_scene.fbx(filepath=str(A/(name+'-embedded.fbx')),use_selection=True,object_types={'MESH'},bake_anim=False,axis_forward='-Y',axis_up='Z');allobs.extend(obs)
bpy.ops.wm.save_as_mainfile(filepath=str(O/'coast-joined-v147.blend'));(A/'coast-cut.json').write_text(json.dumps({'alteredVertices':len(changes),'maximumRecessionMetres':max(changes),'plantRootsProtected':len(roots),'originalIslandFootprintPreserved':True,'newCliffs':['coastal_cliff_02-embedded.fbx','coastal_cliff_04-embedded.fbx']},indent=2),encoding='utf-8');print('ACTUAL_COAST_CUT_DONE',len(changes),flush=True)
