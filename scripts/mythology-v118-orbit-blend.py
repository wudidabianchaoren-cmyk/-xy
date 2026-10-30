import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
if sc.get('v118_orbit_blend_done'):raise RuntimeError('Already blended')
body=bpy.data.objects['V117 CC0 complete male anatomical cyclops body'];giant=body.parent
n=0
for v in body.data.vertices:
 x,y,z=v.co
 if abs(x)<.095 and 1.578<z<1.657 and y<-.12:
  limit=-.126+.006*(abs(x)/.095)**2
  if v.co.y<limit:v.co.y=limit;n+=1
body.data.update();bm=bmesh.new();bm.from_mesh(body.data)
for step in range(10):
 verts=[v for v in bm.verts if abs(v.co.x)<.098 and 1.578<v.co.z<1.657 and v.co.y<-.095 and not(abs(v.co.x)<.030 and abs(v.co.z-1.618)<.014)]
 bmesh.ops.smooth_vert(bm,verts=verts,factor=.22,use_axis_x=True,use_axis_y=True,use_axis_z=True)
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(body.data);bm.free();body.data.update()
for name in ['V117 ONE anatomical cyclops eyeball','V117 ONE brown cyclops iris','V117 ONE black cyclops pupil']:
 for v in bpy.data.objects[name].data.vertices:v.co.y+=.025
# Replace the hard painted cap with individual short hair fibres over the real head surface.
rng=random.Random(118118);vv=[];ff=[];N=0
for name in ['V118 continuous surface-following scalp cap','V118 continuous surface-following beard cap']:
 cap=bpy.data.objects.get(name)
 if not cap:continue
 cap.hide_render=True;cap.hide_set(True)
 polys=list(cap.data.polygons)
 for k in range(3400):
  p=rng.choice(polys);points=[cap.data.vertices[i].co for i in p.vertices];center=sum(points,Vector())/len(points)
  # Interior random samples retain the real cap silhouette without large faceted patches.
  a=rng.random();b=rng.random()*(1-a);center=points[0]*a+points[1]*b+points[2]*(1-a-b)
  normal=p.normal.copy().normalized();flow=Vector((0,0,-1));flow=(flow-normal*flow.dot(normal))
  if flow.length<.1:flow=Vector((0,.5,-.3))-normal*Vector((0,.5,-.3)).dot(normal)
  flow.normalize();side=normal.cross(flow).normalized();length=rng.uniform(.003,.009);width=rng.uniform(.00018,.00036);base=len(vv)
  for j in range(3):
   t=j/2;c=center+normal*(.0008+.0015*math.sin(t*math.pi/2))+flow*length*t;w=width*(1-.8*t)
   vv.extend([tuple(c-side*w),tuple(c+side*w)])
  ff.extend([(base,base+2,base+3,base+1),(base+2,base+4,base+5,base+3)]);N+=1
mesh=bpy.data.meshes.new('V118 actual short individual facial hair fibres');mesh.from_pydata(vv,[],ff);mesh.update();obj=bpy.data.objects.new('V118 native cropped hair and beard / 6800 individual fibres',mesh);sc.collection.objects.link(obj);obj.parent=giant
mat=bpy.data.materials['V118 rough umber scalp and coherent beard'];mat.use_backface_culling=False;mesh.materials.append(mat)
for f in mesh.polygons:f.use_smooth=True
sc['v118_orbit_blend_done']=True
(O/'04-orbit-blend.json').write_text(json.dumps({'orbitalVerticesBlended':n,'singleEyeRecessShift':.025,'newEyeballs':0,'individualHairFibres':N,'paintedHairCapsHidden':True},indent=2),encoding='utf8')
# Export only giant here, leave fleet repair independent.
g=bpy.data.objects['V106_CYCLOPS / retained anatomical base, new male sculpt']
import runpy
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_objects'](O,[g,*g.children_recursive],'cyclops-v118.glb')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'04f-continuous-orbit-and-individual-hair.blend'));print('ORBIT_BLEND_AND_REAL_SHORT_HAIR_SAVED')
