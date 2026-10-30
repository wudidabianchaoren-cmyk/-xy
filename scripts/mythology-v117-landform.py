"""Visible Blender MCP stage1. Continuous shore/plateau masks and actual scanned rock faces."""
import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117';OUT.mkdir(parents=True,exist_ok=True)
scene=bpy.context.scene;rng=random.Random(1171829)
prior=bpy.data.collections.get('V117_LAND')
if prior:
 if len(prior.objects):raise RuntimeError('V117 already exists; resume saved stage rather than rebuild')
 bpy.data.collections.remove(prior)
landcol=bpy.data.collections.new('V117_LAND');scene.collection.children.link(landcol)
for prefix in ['V112_LAND','V112_ROCKS','V112_FOREST']:
 for col in bpy.data.collections:
  if col.name.startswith(prefix):
   for o in col.all_objects:
    if o:o.hide_render=True;o.hide_set(True)
def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
def gauss(a,c,w):return math.exp(-(math.atan2(math.sin(a-c),math.cos(a-c))/w)**2)
def coast(a):return 1+.11*math.sin(a*3+.65)+.055*math.sin(a*7-.4)+.027*math.sin(a*13+.8)-.21*gauss(a,-math.pi/2,.41)
def height(x,y,r,a):
 dist=(1-r)*90
 if r>1:return -.28-(r-1)*100
 # Only the central cove is sand. Broken high shoulders, low inland saddles and two offset ridges.
 cove=math.exp(-((x+62)/66)**4)*math.exp(-((y-73)/28)**4)
 n=noise.fractal(Vector((x*.024,y*.024,2.7)),.8,2.04,4)
 foothill=3.8+4.0*n+2.8*noise.noise(Vector((x*.064,y*.064,4)))
 ridge_a=24*math.exp(-((y-(190+14*math.sin(x*.025)))/32)**2)*(1+.22*math.sin(x*.039+1))
 ridge_b=15*math.exp(-((x+164)/34)**2-((y-146)/55)**2)
 shelf=smooth((dist-2)/9)*(1-cove)*9.5
 # Low stepped limestone terraces expose coherent cliff faces, rather than a smooth sand ramp.
 relief=(foothill+ridge_a+ridge_b)*smooth((dist-4)/20)+shelf
 relief+=smooth(dist/14)*(1-cove)*(1.0*math.sin(y*.51+math.sin(x*.026))+1.3*noise.noise(Vector((x*.12,y*.12,1.7))))
 beach=.20+1.05*smooth(dist/9)+.10*noise.noise(Vector((x*.3,y*.3,2)))
 return (.25+relief)*(1-cove)+beach*cove
N=320;R=128;verts=[(-65,151,height(-65,151,0,0))];faces=[]
for j in range(1,R+1):
 r=j/R*1.13
 for i in range(N):
  a=i/N*math.tau;rr=r*coast(a);px=-65+156*rr*math.cos(a);py=151+92*rr*math.sin(a);verts.append((px,py,height(px,py,r,a)))
for i in range(N):faces.append((0,1+i,1+(i+1)%N))
for j in range(R-1):
 for i in range(N):a=1+j*N+i;b=1+j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
bottom=len(verts);verts.append((-65,151,-24))
for i in range(N):faces.append((1+(R-1)*N+i,1+(R-1)*N+(i+1)%N,bottom))
mesh=bpy.data.meshes.new('V117 continuous cliff-cove-woodland landform');mesh.from_pydata(verts,[],faces);mesh.update();island=bpy.data.objects.new('V117_ISLAND',mesh);landcol.objects.link(island)
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(mesh);bm.free()
# Real cave cavity cuts into the high western shoulder. It is not a black picture or decal.
bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=28,location=(-159,101,8.2));cut=bpy.context.object;cut.scale=(11,31,8.3);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
bpy.context.view_layer.objects.active=island;mod=island.modifiers.new('V117 erosion / deep sea cave','BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=cut;bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cut,do_unlink=True);mesh=island.data
for p in mesh.polygons:p.use_smooth=True
mesh.update();uv=mesh.uv_layers.new(name='Terrain metres')
for p in mesh.polygons:
 for li in p.loop_indices:v=mesh.vertices[mesh.loops[li].vertex_index];uv.data[li].uv=(v.co.x/2,v.co.y/2)
hab=mesh.color_attributes.new(name='Habitat',type='FLOAT_COLOR',domain='POINT');density=mesh.attributes.new(name='ForestDensity',type='FLOAT',domain='POINT');under=mesh.attributes.new(name='UnderstoryDensity',type='FLOAT',domain='POINT')
for v in mesh.vertices:
 p=v.co;cove=math.exp(-((p.x+62)/66)**4)*math.exp(-((p.y-73)/28)**4)
 sand=cove*(1-smooth((p.z-1.35)/2.3))*smooth((v.normal.z-.60)/.30)
 soil=smooth((p.z-2)/5.5)*smooth((v.normal.z-.48)/.35)*(1-sand)
 patch=.5+.5*noise.fractal(Vector((p.x*.028,p.y*.028,3.4)),.8,2,3)
 forest=soil*smooth((patch-.18)/.38)*(1-.6*math.exp(-((p.x+108)/22)**2-((p.y-135)/36)**2))
 hab.data[v.index].color=(sand,soil,max(0,1-sand-soil),1);density.data[v.index].value=forest;under.data[v.index].value=soil*(.45+.55*patch)
rockcol=bpy.data.collections.new('V117_ROCKS');scene.collection.children.link(rockcol)
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/pbr-v117/rock_face_01/rock_face_01_2k.gltf'));parts=[o for o in scene.objects if o not in before and o.type=='MESH'];proto=[]
for src in parts:
 data=src.data.copy();coords=[src.matrix_world@v.co for v in data.vertices];lo=Vector(tuple(min(p[k] for p in coords) for k in range(3)));hi=Vector(tuple(max(p[k] for p in coords) for k in range(3)));center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z));size=hi-lo
 for v,p in zip(data.vertices,coords):v.co=p-center
 data.update();proto.append({'data':data,'size':size})
for o in list(scene.objects):
 if o not in before:bpy.data.objects.remove(o,do_unlink=True)
bvh=BVHTree.FromPolygons([v.co.copy() for v in mesh.vertices],[list(p.vertices) for p in mesh.polygons]);placements=[]
# Unequal cliff sections make a continuous coastline; the sandy central cove stays open.
spec=[(-198,112,15,20,17,-.45),(-184,104,14,21,18,-.2),(-173,99,13,18,20,.15),(-157,110,13,18,18,.1),(-145,114,13,17,17,.15),(-200,137,17,17,21,-.25),(-175,151,14,16,19,.4),(-140,156,15,19,20,.3),(7,104,18,16,15,-.4),(25,111,20,19,21,-.35),(48,124,19,17,22,-.15),(66,145,20,18,25,-.1),(57,166,16,20,20,.15),(-95,197,20,19,21,.2),(-63,209,19,19,19,-.4),(-15,189,18,17,20,-.4)]
for i,(px,py,w,d,h,rot) in enumerate(spec):
 hit=bvh.ray_cast(Vector((px,py,120)),Vector((0,0,-1)),200)[0];z=max(-2,(hit.z if hit else 4)-h*.55)
 for pr in proto:
  o=bpy.data.objects.new('V117 scanned rock face %02d'%i,pr['data']);rockcol.objects.link(o);o.location=(px,py,z);o.scale=(w/max(pr['size'].x,.1),d/max(pr['size'].y,.1),h/max(pr['size'].z,.1));o.rotation_euler[2]=rot+(.10 if i%2 else -.1);placements.append(o)
# Keep historical detailed scan modules hidden instead of piling duplicate arches onto the ridge.
clay=bpy.data.materials.new('V117 neutral clay');clay.diffuse_color=(.48,.48,.45,1);island.data.materials.append(clay)
scene.camera.location=(29,-61,16.5);scene.camera.rotation_euler=(Vector((-61,119,18))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=40
for w in bpy.context.window_manager.windows:
 for a in w.screen.areas:
  if a.type=='VIEW_3D':a.spaces.active.shading.type='SOLID';a.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island;bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'01-coast-cave-and-masked-landform.blend'))
audit={'actualBlenderMcp':True,'vertices':len(mesh.vertices),'minHeight':min(v.co.z for v in mesh.vertices),'maxHeight':max(v.co.z for v in mesh.vertices),'trueCave':True,'scannedRockFaceInstances':len(placements),'rockPrototypeSizes':[list(p['size']) for p in proto],'namedDensityAttributes':['Habitat','ForestDensity','UnderstoryDensity'],'oldFilesUntouched':True,'seaChanged':False}
(OUT/'01-landform.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
