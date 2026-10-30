"""Run once through the connected visible Blender MCP. Native geometry, not a painted backdrop."""
import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype')
OUT=ROOT/'blender/mythology-v32-112';OUT.mkdir(parents=True,exist_ok=True)
scene=bpy.context.scene
if 'mythology-v32-106' not in bpy.data.filepath:raise RuntimeError('Expected retained V106 native file, inspect before rebuilding')
scene.name='V112 / rocky Mediterranean cove / visible MCP production'
scene.render.image_settings.file_format='PNG';scene.render.resolution_percentage=100
scene.render.resolution_x=1600;scene.render.resolution_y=900
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.cycles.device='GPU';scene.render.film_transparent=False
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=0
scene.render.use_persistent_data=True;scene.render.fps=30
col=bpy.data.collections.new('V112_LAND / continuous eroded island');scene.collection.children.link(col)
def obj_mesh(name,verts,faces,collection=col):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
 obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj)
 for p in mesh.polygons:p.use_smooth=True
 return obj
def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
def gauss(a,c,w):d=math.atan2(math.sin(a-c),math.cos(a-c));return math.exp(-(d/w)**2)
def coast(a):
 return 1+.13*math.sin(a*3+.65)+.065*math.sin(a*7-.4)+.022*math.sin(a*19)-.245*gauss(a,-math.pi/2,.44)+.10*gauss(a,-2.45,.25)
def height(x,y,r,a):
 # Broad irregular uplands, broken escarpments, a separate near-level bay; no single conical mound.
 dist=(1-r)*100
 if r>=1:return -.4-dist*-1.35
 cove=math.exp(-((x+59)/62)**4)*math.exp(-((y-69)/42)**4)
 n=noise.fractal(Vector((x*.032,y*.032,.6)),.85,2.08,4)
 ridge_axis=195+17*math.sin((x+72)*.021)
 ridge=max(0,1-abs(y-ridge_axis)/47)
 ridge_height=(25+11*math.sin(x*.026+1.5)+5*math.sin(x*.075))*ridge**1.25
 inland=smooth(dist/27)
 base=(8.5+4.5*n+ridge_height)*inland
 # Uneven limestone wave-cut ledges at the two headlands.
 headland=(1-cove)*smooth(dist/10)*(6+4*math.sin(a*5+1)**2)
 z=.3+base+headland
 z+=inland*(2.1*noise.fractal(Vector((x*.11,y*.11,1.4)),.8,2,3))
 beach=.25+1.05*smooth((y-62)/33)+.08*math.sin(x*.37+y*.13)
 z=z*(1-cove)+beach*cove
 return z
N=256;R=106;verts=[(-65,151,height(-65,151,0,0))];faces=[]
for j in range(1,R+1):
 r=j/R*1.13
 for i in range(N):
  a=i/N*math.tau;rr=r*coast(a);x=-65+156*rr*math.cos(a);y=151+91*rr*math.sin(a)
  verts.append((x,y,height(x,y,r,a)))
for i in range(N):faces.append((0,1+i,1+(i+1)%N))
for j in range(R-1):
 for i in range(N):
  a=1+j*N+i;b=1+j*N+(i+1)%N;faces.append((a,b,b+N,a+N))
bottom=len(verts);verts.append((-65,151,-22))
for i in range(N):faces.append((1+(R-1)*N+i,1+(R-1)*N+(i+1)%N,bottom))
island=obj_mesh('V112_ISLAND / continuous bedrock, shallow bay, inland ridge',verts,faces)
bm=bmesh.new();bm.from_mesh(island.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(island.data);bm.free()
# The front headland contains a true long sea cave, not a dark decal or a rock placed in front.
bpy.ops.mesh.primitive_uv_sphere_add(segments=40,ring_count=24,location=(-156,83,7.3))
cut=bpy.context.object;cut.name='V112 temporary true sea cave Boolean';cut.scale=(10.5,31,8.4)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
bpy.context.view_layer.objects.active=island
mod=island.modifiers.new('Sea erosion / through-depth cave opening','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cut;mod.solver='EXACT'
bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cut,do_unlink=True)
bm=bmesh.new();bm.from_mesh(island.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(island.data);bm.free();island.data.update()
# Give the rock faces actual bedding relief on the scale of metres, separate from PBR micro detail.
saved=[(v.co.copy(),v.normal.copy()) for v in island.data.vertices]
for v,(p,n) in zip(island.data.vertices,saved):
 steep=1-smooth((n.z-.35)/.50)
 if p.z>1.6:
  relief=(.38*math.sin(p.z*1.7+.45*math.sin(p.x*.13))+.55*noise.fractal(Vector((p.x*.18,p.y*.18,p.z*.07)),.82,2,3))*steep
  v.co+=n*relief
island.data.update()
uv=island.data.uv_layers.new(name='Terrain metre UV')
for p in island.data.polygons:
 for li in p.loop_indices:
  v=island.data.vertices[island.data.loops[li].vertex_index];uv.data[li].uv=(v.co.x/2,v.co.y/2)
attr=island.data.color_attributes.new(name='Habitat',type='FLOAT_COLOR',domain='POINT')
for v in island.data.vertices:
 p=v.co;cove=math.exp(-((p.x+59)/65)**4)*math.exp(-((p.y-69)/45)**4)
 sand=cove*(1-smooth((p.z-1.5)/3))*smooth((v.normal.z-.65)/.28)
 soil=smooth((p.z-3)/7)*smooth((v.normal.z-.60)/.30)*(1-sand)
 attr.data[v.index].color=(sand,soil,max(0,1-sand-soil),1)
for o in list(scene.objects):
 if o==island:continue
 if o.name.startswith(('V106_ISLAND','V106_GROUNDCOVER','V106 woodland','V106 coastal rock','V106 small shore','V106 shore','V106 rooted beard')) or any('V106 actual' in c.name for c in o.users_collection):
  o.hide_render=True;o.hide_set(True)
 # Historic rocks from the old exported scene are neither the new island nor new scanned cliff modules.
 if o.type=='MESH' and not o.name.startswith('V112'):
  lo=min((o.matrix_world@v.co).y for v in o.data.vertices) if len(o.data.vertices)<100000 else -1000
  if lo>40 and not any(k in o.name for k in ('CYCLOPS','Human','eye','body','pupil','iris','beard')) and not o.name.startswith('V106 Cycles sea'):
   o.hide_render=True;o.hide_set(True)
# Simple modelling clay stage is saved before material and assembly.
clay=bpy.data.materials.new('V112 warm neutral modelling clay');clay.diffuse_color=(.52,.49,.44,1);island.data.materials.append(clay)
cam=scene.camera;cam.name='V112 native hero camera';cam.location=(35,-115,24);cam.rotation_euler=(Vector((-49,83,11))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=42;cam.data.sensor_width=36;cam.data.sensor_fit='HORIZONTAL';cam.data.clip_end=5000
scene.camera=cam
for w in bpy.context.window_manager.windows:
 for area in w.screen.areas:
  if area.type=='IMAGE_EDITOR':area.type='VIEW_3D'
  if area.type=='VIEW_3D':
   area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='SOLID';area.spaces.active.clip_end=5000
bpy.ops.object.select_all(action='DESELECT');island.hide_set(False);island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'01-continuous-landform-white.blend'))
audit={'actualVisibleMcp':True,'stage':'new continuous white landform','islandVertices':len(island.data.vertices),'heightMin':min(v.co.z for v in island.data.vertices),'heightMax':max(v.co.z for v in island.data.vertices),'trueBooleanSeaCave':True,'oldNativeFilePreserved':True,'saved':str(OUT/'01-continuous-landform-white.blend')}
(OUT/'01-white-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit))
