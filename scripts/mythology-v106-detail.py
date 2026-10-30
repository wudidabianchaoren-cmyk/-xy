import bpy, bmesh, math, json, random
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106'
scene=bpy.context.scene;island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
if not island or not giant:raise RuntimeError('Visible MCP white stage must exist first')
bm=bmesh.new();bm.from_mesh(island.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(island.data);bm.free();island.data.update()
# Real edits of the anatomical vertices. No new paired spherical breast volumes.
modified=0
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
for o in giant.children_recursive:
 if o.type!='MESH':continue
 for v in o.data.vertices:
  x,y,z=v.co;chest=smooth((z-1.04)/.10)*(1-smooth((z-1.38)/.10))
  central=1-smooth((abs(x)-.19)/.09)
  if y<-.070 and chest*central>.01:
   plane=-.098-.020*max(0,1-(x/.24)**2)
   v.co.y=y+(max(y,plane)-y)*chest*central;modified+=1
  v.co.x*=1+.15*chest*(1-smooth((abs(x)-.24)/.10))
  pelvis=smooth((z-.82)/.12)*(1-smooth((z-1.03)/.12));v.co.x*=1-.09*pelvis
  if z>1.48:v.co.x*=1+.11*smooth((1.67-z)/.12)
 o.data.update()
# A low, horizontal sea-facing grotto is boolean-cut into the connected island.
bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,location=(-158,87,10.8));cut=bpy.context.object;cut.name='Cave cutter / only construction';cut.scale=(7.5,25,6.6)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
bpy.context.view_layer.objects.active=island;mod=island.modifiers.new('Carved sea-facing grotto','BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=cut;bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cut,do_unlink=True)
for p in island.data.polygons:p.use_smooth=True
ground=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons])
def support(x,y):
 hit=ground.ray_cast(Vector((x,y,120)),Vector((0,0,-1)),160)
 return hit[0],hit[1]
p,n=support(-78,129);giant.location=(-78,129,p.z+.075);giant.rotation_euler[2]=-.18
# Proper metre-based continuous UVs and habitat weights are shared with the web.
uv=island.data.uv_layers.new(name='Coastal metre UV')
attr=island.data.color_attributes.new(name='Habitat',type='FLOAT_COLOR',domain='POINT')
for v in island.data.vertices:
 h=v.co.z;normal=v.normal.z;sand=(1-smooth((h-2)/5.8))*smooth((normal-.35)/.4)
 grass=smooth((h-4.5)/5)*(1-sand)*smooth((normal-.72)/.22)
 attr.data[v.index].color=(sand,grass,max(0,1-sand-grass),1)
for p in island.data.polygons:
 for li in p.loop_indices:
  v=island.data.vertices[island.data.loops[li].vertex_index];uv.data[li].uv=(v.co.x/3,v.co.y/3)
# Spatially separated woodland groups and an open cove/giant clearing.
rng=random.Random(1061829);placements=[]
for attempt in range(25000):
 if len(placements)>=460:break
 x=rng.uniform(-207,78);y=rng.uniform(73,227);point,normal=support(x,y)
 if point is None or point.z<6.3 or point.z>29 or normal.z<.85:continue
 if ((x+78)/24)**2+((y-129)/24)**2<1 or ((x+158)/16)**2+((y-93)/29)**2<1:continue
 cluster=.5+.28*math.sin(x*.074+y*.019)+.22*math.sin(y*.093-x*.035)
 if cluster<.28 or rng.random()>cluster:continue
 if any((x-a['x'])**2+(y-a['blenderY'])**2<23 for a in placements):continue
 placements.append({'x':x,'blenderY':y,'z':-y,'y':point.z,'height':rng.uniform(6.8,11.8),'width':rng.uniform(.75,1.1),'rotation':rng.uniform(0,math.tau)})
(OUT/'woodland-placement.json').write_text(json.dumps({'version':106,'trees':placements,'distribution':'clustered woodland, open meadow/cove, 24 metre cyclops clearing'},indent=2),encoding='utf8')
for obj in [island,*giant.children_recursive]:
 if obj.type=='MESH' and not obj.hide_render:
  for poly in obj.data.polygons:poly.use_smooth=True
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'02-modelled-landform-and-male-anatomy.blend'))
(OUT/'modelling-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'fromWhiteStage':True,'maleChestVerticesEdited':modified,'islandVertices':len(island.data.vertices),'islandPolygons':len(island.data.polygons),'treePlacements':len(placements),'giantWorldPosition':list(giant.location),'giantHeightMetres':1.7222*8.5,'cave':'Actual applied Boolean sea-facing grotto','anatomyBase':'Retained complete Human anatomy; male chest and pelvis are newly reshaped, not a new human sculpt from a cube'},indent=2),encoding='utf8')
print('V106_VISIBLE_MCP_DETAIL_SAVED',modified,len(placements),list(giant.location))
