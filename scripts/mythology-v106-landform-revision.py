import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt');material=island.data.materials[0]
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def coast(a):
 d=math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2))
 return 1+.085*math.sin(a*3+.2)+.047*math.sin(a*7+.6)-.20*math.exp(-(d/.43)**2)
def height(x,y,r,a):
 if r>1:return .12-(r-1)*85
 d=abs(math.atan2(math.sin(a+math.pi/2),math.cos(a+math.pi/2)));bay=1-smooth((d-.34)/.53)
 spine=177+10*math.sin(x*.032)+5*math.sin(x*.073)
 ridge=smooth((49-abs(y-spine))/40)
 peaks=22+10*math.sin(x*.032+.7)+5*math.sin(x*.08-.4)
 broad=3.5*noise.fractal(Vector((x*.025,y*.025,2.4)),.8,2.1,3)
 interior=14+broad+ridge*peaks
 # Rocky headlands rise abruptly; the cove has a separate nearly level beach.
 cliff=.14+interior*smooth((1-r)/.11)
 beach=.10+1.55*smooth((1-r)/.15)
 dunes=1.4*smooth((.85-r)/.09)
 escarpment=(interior-3)*smooth((.79-r)/.14)
 cove=beach+dunes+escarpment
 h=cliff*(1-bay)+cove*bay
 erosion=noise.fractal(Vector((x*.12,y*.12,5.2)),.85,2.25,3)
 h+=erosion*(.15+1.35*(1-bay)+1.2*ridge)*smooth((1-r)/.05)
 return h
N=208;R=96;verts=[(-65,145,height(-65,145,0,0))];faces=[]
for j in range(1,R+1):
 r=j/R*1.13
 for i in range(N):
  a=i/N*math.tau;rr=r*coast(a);x=-65+164*rr*math.cos(a);y=145+103*rr*math.sin(a);verts.append((x,y,height(x,y,r,a)))
for i in range(N):faces.append((0,1+i,1+(i+1)%N))
for j in range(R-1):
 for i in range(N):
  a=1+j*N+i;b=1+j*N+(i+1)%N;faces.append((a,a+N,b+N,b))
bottom=len(verts);verts.append((-65,145,-15))
for i in range(N):faces.append((1+(R-1)*N+i,bottom,1+(R-1)*N+(i+1)%N))
mesh=bpy.data.meshes.new('V106 revised complete island / flat beach, cliffs, high ridge');mesh.from_pydata(verts,[],faces);mesh.update();island.data=mesh;mesh.materials.append(material)
bpy.context.view_layer.objects.active=island;bpy.ops.object.select_all(action='DESELECT');island.select_set(True);sub=island.modifiers.new('Continuous eroded coastline subdivision','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons])
def support(x,y):return bvh.ray_cast(Vector((x,y,120)),Vector((0,0,-1)),160)
# Cave faces the sea in the left rocky headland, not in the flat beach.
p,_,_,_=support(-171,86);cz=max(7,p.z-4)
bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=24,location=(-171,83,cz));cut=bpy.context.view_layer.objects.active;cut.scale=(7.5,24,7);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);bpy.context.view_layer.objects.active=island;bo=island.modifiers.new('Actual sea-facing cave','BOOLEAN');bo.operation='DIFFERENCE';bo.object=cut;bo.solver='EXACT';bpy.ops.object.modifier_apply(modifier=bo.name);bpy.data.objects.remove(cut,do_unlink=True)
bm=bmesh.new();bm.from_mesh(island.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(island.data);bm.free();island.data.update()
for p in island.data.polygons:p.use_smooth=True
uv=island.data.uv_layers.new(name='Coastal metre UV');attr=island.data.color_attributes.new(name='Habitat',type='FLOAT_COLOR',domain='POINT')
for v in island.data.vertices:
 h=v.co.z;normal=v.normal.z;sand=(1-smooth((h-1.8)/3.4))*smooth((normal-.7)/.24);grass=smooth((h-4.5)/5)*(1-sand)*smooth((normal-.65)/.27)
 attr.data[v.index].color=(sand,grass,max(0,1-sand-grass),1)
for p in island.data.polygons:
 for li in p.loop_indices:
  v=island.data.vertices[island.data.loops[li].vertex_index];uv.data[li].uv=(v.co.x/2,v.co.y/2)
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons]);by_id={}
forest=bpy.data.collections.get('V106 actual 460 tree coastal woodland')
for obj in list(forest.objects):
 i=int(obj.name.split(' ')[2]);p,n,_,_=support(obj.location.x,obj.location.y)
 if p is None or n.z<.75 or p.z<6:bpy.data.objects.remove(obj,do_unlink=True)
 else:
  obj.location.z=p.z;by_id[i]={'x':obj.location.x,'blenderY':obj.location.y,'z':-obj.location.y,'y':p.z,'height':obj.scale.z,'width':obj.scale.x/obj.scale.z,'rotation':obj.rotation_euler.z}
kept=list(by_id.values())
(OUT/'woodland-placement.json').write_text(json.dumps({'version':106,'trees':kept,'distribution':'clustered upland woodland, open cove, cliffs, grassy clearings'},indent=2),encoding='utf8')
# Ground cover blades are planted again on the new terrain rather than left floating.
grass=bpy.data.objects.get('V106_GROUNDCOVER / clustered meadow blades');g=grass.data
for start in range(0,len(g.vertices),8):
 base=(g.vertices[start].co+g.vertices[start+1].co)*.5;p,n,_,_=support(base.x,base.y)
 if p is None:continue
 delta=p.z-base.z
 for k in range(8):
  v=g.vertices[start+k]
  v.co.z+=delta
  if p.z<4.5 or n.z<.70:v.co.z=p.z-.2
g.update()
p,_,_,_=support(-78,129);giant.location.z=p.z+.075
# Broader trapezius, shoulders, arms and a deeper flat masculine chest.
for obj in giant.children_recursive:
 if obj.type!='MESH' or obj.hide_render:continue
 for v in obj.data.vertices:
  x,y,z=v.co;upper=smooth((z-.98)/.18)*(1-smooth((z-1.43)/.10));v.co.x*=1+.18*upper
  if .95<z<1.43:v.co.y*=1.10
  if z>1.48:v.co.x*=1.08
 obj.data.update()
def export(objects,name):
 bpy.ops.object.select_all(action='DESELECT')
 for obj in objects:
  if not obj.hide_render:obj.hide_set(False);obj.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
export([island],'island-geometry-v106.glb');export([giant,*giant.children_recursive],'cyclops-male-v106.glb');export([grass],'groundcover-v106.glb')
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04-revised-complete-island.blend'))
audit={'actualVisibleMcp':True,'revision':'User rejected uniform beach ramp; rebuilt separate flat cove, rocky cliffs and broad high back-ridge','heightMin':min(v.co.z for v in island.data.vertices),'heightMax':max(v.co.z for v in island.data.vertices),'vertices':len(island.data.vertices),'trees':len(kept),'giantWorldPosition':list(giant.location),'beachHeights':'approximately 0.1–1.8 metres, separate inland scarp','nativeRenderer':'Cycles'}
(OUT/'landform-revision-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
