import bpy,math,json,pathlib,time,sys
from mathutils import Vector

p=pathlib.Path.cwd();out=p/'blender/home-construction-v32-103';out.mkdir(parents=True,exist_ok=True)
tmp=pathlib.Path('F:/codex-construction-v103');tmp.mkdir(parents=True,exist_ok=True)
s=bpy.context.scene;s.frame_set(91);dg=bpy.context.evaluated_depsgraph_get()
oldcam=s.camera;final_cam=(oldcam.location.copy(),oldcam.rotation_euler.copy(),oldcam.data.lens)
source=[]
for o in list(s.objects):
 if o.type=='MESH' and o.name.startswith('Build main /'):
  ev=o.evaluated_get(dg);m=bpy.data.meshes.new_from_object(ev,preserve_all_data_layers=True,depsgraph=dg)
  if len(m.polygons):source.append((o.name,m,o.matrix_world.copy()))
lights=[]
for o in list(s.objects):
 if o.type=='LIGHT':lights.append((o.name,o.data.copy(),o.matrix_world.copy()))
for o in list(s.objects):bpy.data.objects.remove(o,do_unlink=True)
if s.sequence_editor:s.sequence_editor_clear()
mat=bpy.data.materials.new('V103 / warm ivory modeling clay');mat.use_nodes=True;bs=mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled');mo=mat.node_tree.nodes.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(bs.outputs[0],mo.inputs['Surface']);bs.inputs['Base Color'].default_value=(.42,.39,.33,1);bs.inputs['Roughness'].default_value=.62
dark=bpy.data.materials.new('V103 / quiet topology graphite');dark.use_nodes=True;bs=dark.node_tree.nodes.new('ShaderNodeBsdfPrincipled');mo=dark.node_tree.nodes.new('ShaderNodeOutputMaterial');dark.node_tree.links.new(bs.outputs[0],mo.inputs['Surface']);bs.inputs['Base Color'].default_value=(.065,.059,.047,1);bs.inputs['Roughness'].default_value=.65
gold=bpy.data.materials.new('V103 / selected topology brass');gold.use_nodes=True;bs=gold.node_tree.nodes.new('ShaderNodeBsdfPrincipled');mo=gold.node_tree.nodes.new('ShaderNodeOutputMaterial');gold.node_tree.links.new(bs.outputs[0],mo.inputs['Surface']);bs.inputs['Base Color'].default_value=(.38,.21,.06,1);bs.inputs['Roughness'].default_value=.35;bs.inputs['Metallic'].default_value=.45
def smooth_action(data):
 if not data.animation_data:return
 action=data.animation_data.action
 for layer in action.layers:
  for strip in layer.strips:
   try:bag=strip.channelbag(data.animation_data.action_slot)
   except:continue
   if not bag:continue
   for curve in bag.fcurves:
    for k in curve.keyframe_points:k.interpolation='BEZIER'
def vis(o,a,b=390):
 for f,state in [(1,True),(max(1,a-1),True),(a,False),(b,False),(b+1,True)]:o.hide_render=state;o.keyframe_insert('hide_render',frame=f)
def key(o,f,scale=None,loc=None,rot=None):
 if scale is not None:o.scale=scale;o.keyframe_insert('scale',frame=f)
 if loc is not None:o.location=loc;o.keyframe_insert('location',frame=f)
 if rot is not None:o.rotation_euler=rot;o.keyframe_insert('rotation_euler',frame=f)
def bevel(o,w=.02):
 m=o.modifiers.new('Physical edge bevel','BEVEL');m.width=w;m.segments=2
def cube(name,loc,size,start=1,end=390,material=mat):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material);bevel(o);vis(o,start,end);return o
floor=cube('V103 / retained courtyard plane',(0,3,-.1),(70,65,.15));floor.data.materials.clear();floor.data.materials.append(mat)
for name,data,matrix in lights:
 o=bpy.data.objects.new(name,data);s.collection.objects.link(o);o.matrix_world=matrix;o.data.animation_data_clear();o.data.use_shadow_jitter=False
 if 'practical' in name:o.data.energy*=.1
camdata=bpy.data.cameras.new('V103 process camera');cam=bpy.data.objects.new('V103 process camera',camdata);s.collection.objects.link(cam);s.camera=cam
for f,pos,target,lens in [(1,(5,-14,8),(-.15,1.2,1.1),46),(60,(7,-18,10),(-.15,1.2,2.5),43),(132,(7,-23,11),(-.15,1.2,4.1),42),(285,(7,-28.5,12),(0,2,3.9),42),(375,final_cam[0],None,final_cam[2]),(390,final_cam[0],None,final_cam[2])]:
 cam.location=pos;cam.rotation_euler=final_cam[1] if target is None else (Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();camdata.lens=lens;cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f);camdata.keyframe_insert('lens',frame=f)

# A connected subdivided cube: upper loops extend progressively while lower loops remain fixed.
verts=[];faces=[];index={};nx=6;ny=4;nz=12
for iz in range(nz+1):
 for iy in range(ny+1):
  for ix in range(nx+1):
   if ix in (0,nx)or iy in(0,ny)or iz in(0,nz):
    index[ix,iy,iz]=len(verts);verts.append((-1+2*ix/nx,-1+2*iy/ny,2*iz/nz))
def quad(ids):faces.append(tuple(index[x]for x in ids))
for z in range(nz):
 for x in range(nx):
  quad([(x,0,z),(x+1,0,z),(x+1,0,z+1),(x,0,z+1)]);quad([(x,ny,z+1),(x+1,ny,z+1),(x+1,ny,z),(x,ny,z)])
 for y in range(ny):
  quad([(0,y,z+1),(0,y+1,z+1),(0,y+1,z),(0,y,z)]);quad([(nx,y,z),(nx,y+1,z),(nx,y+1,z+1),(nx,y,z+1)])
for x in range(nx):
 for y in range(ny):
  quad([(x,y,0),(x,y+1,0),(x+1,y+1,0),(x+1,y,0)]);quad([(x,y,nz),(x+1,y,nz),(x+1,y+1,nz),(x,y+1,nz)])
mesh=bpy.data.meshes.new('Actual subdivided cube / connected surface');mesh.from_pydata(verts,[],faces);mesh.update();body=bpy.data.objects.new('01 cube → loop-cut wall extrusion',mesh);s.collection.objects.link(body);body.location=(-.15,1.65,.15);mesh.materials.append(mat);bevel(body,.025)
basis=body.shape_key_add(name='Basis')
for label,h,w,d,f0,f1 in [('01 footprint scaling',2,2.2,1.45,28,60),('02 lower wall extrusion',4.8,2.2,1.45,66,102),('03 upper wall extrusion',8.15,2.2,1.45,105,144)]:
 k=body.shape_key_add(name=label)
 for i,v in enumerate(verts):k.data[i].co=(v[0]*w,v[1]*d,v[2]/2*h)
 k.relative_key=basis if label.startswith('01')else prev
 k.value=0;k.keyframe_insert('value',frame=f0);k.value=1;k.keyframe_insert('value',frame=f1);prev=k
vis(body,1,327)
wire=bpy.data.objects.new('02 actual loop-cut topology',mesh);s.collection.objects.link(wire);wire.location=body.location;wire.data=mesh.copy();wire.data.materials.clear();wire.data.materials.append(gold);wm=wire.modifiers.new('Visible modeling edge loops','WIREFRAME');wm.thickness=.012;vis(wire,28,150)
# Copy shape-key values to the topology shell via drivers, so they always share the same geometric operation.
for k in wire.data.shape_keys.key_blocks[1:]:
 dr=k.driver_add('value').driver;dr.expression='v';v=dr.variables.new();v.name='v';v.type='SINGLE_PROP';v.targets[0].id_type='KEY';v.targets[0].id=body.data.shape_keys;v.targets[0].data_path=f'key_blocks["{k.name}"].value'

# A six-vertex roof wedge starts flat and rises by editing its actual ridge vertices.
roofverts=[(-2.3,-1.55,0),(2.3,-1.55,0),(0,-1.55,0),(-2.3,1.55,0),(2.3,1.55,0),(0,1.55,0)]
roofmesh=bpy.data.meshes.new('Roof ridge vertex editing');roofmesh.from_pydata(roofverts,[],[(0,1,2),(3,5,4),(0,2,5,3),(2,1,4,5),(0,3,4,1)]);roofmesh.update();roof=bpy.data.objects.new('04 ridge extrusion and roof taper',roofmesh);s.collection.objects.link(roof);roof.location=(-.15,1.65,8.30);roofmesh.materials.append(mat);bevel(roof);roof.shape_key_add(name='Basis');rk=roof.shape_key_add(name='Raise the ridge / taper both sides');rk.data[2].co.z=1.3;rk.data[5].co.z=1.3;rk.value=0;rk.keyframe_insert('value',frame=145);rk.value=1;rk.keyframe_insert('value',frame=181);vis(roof,145,327)

# Actual animated Boolean cutters pass through the facade, producing arched negative space.
def arch_prism(name,x,z):
 ring=[(-.34,0),(.34,0),(.34,.52)]+[(.34*math.cos(t),.52+.34*math.sin(t))for t in [math.pi*i/16 for i in range(1,17)]]
 vv=[(x+a,y,z+b)for y in(-2,5)for a,b in ring];nn=len(ring);ff=[tuple(range(nn-1,-1,-1)),tuple(range(nn,2*nn))]+[(i,(i+1)%nn,(i+1)%nn+nn,i+nn)for i in range(nn)]
 me=bpy.data.meshes.new(name);me.from_pydata(vv,[],[tuple(reversed(f))for f in ff]);me.update();o=bpy.data.objects.new(name,me);s.collection.objects.link(o);o.data.materials.append(gold);return o
cutters=[]
for i,x in enumerate([-.97,.67]):
 c=arch_prism('05 animated arch inset / Boolean cutter '+str(i),x,7.25);c.location.y=-6;key(c,182+i*9,loc=(0,-6,0));key(c,204+i*9,loc=(0,0,0));c.hide_render=True;mod=body.modifiers.new('Actual arch Boolean cut '+str(i),'BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=c;cutters.append(c)
 # A visible brass wire tool shows the same cutter motion, without filling the hole.
 w=bpy.data.objects.new('05 Boolean tool outline '+str(i),c.data.copy());s.collection.objects.link(w);w.data.materials.clear();w.data.materials.append(gold);wm=w.modifiers.new('Cutter topology outline','WIREFRAME');wm.thickness=.014;key(w,182+i*9,loc=(0,-6,0));key(w,204+i*9,loc=(0,0,0));vis(w,182+i*9,212+i*9)

for i,x in enumerate([-2.2,1.9]):
 col=cube('06 paired pier extrusion '+str(i),(x,-.04,4.0),(.24,.34,7.7),212+i*8,329);key(col,212+i*8,scale=(1,1,.025),loc=(x,-.04,.25));key(col,240+i*8,scale=(1,1,1),loc=(x,-.04,4.0))
 for j,z in enumerate([.3,3.45,7.10,8.32]):
  b=cube('06 cornice loop '+str(i)+' '+str(j),(-.15,-.06,z),(4.82,.25,.14),217+j*5,329);key(b,217+j*5,scale=(.01,1,1));key(b,240+j*5,scale=(1,1,1))
# Circular face extrusion, concentric torus bevels and radial hands are separate real components.
discs=[]
for j,(z,r)in enumerate([(5.45,1.74),(1.77,1.35)]):
 bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=r,depth=.10,location=(-.15,.07,z),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name='07 circular face extrusion '+str(j);o.data.materials.append(mat);bevel(o,.025);start=237+j*16;vis(o,start,334);key(o,start,scale=(.04,.04,.04),loc=(-.15,-.9,z));key(o,start+30,scale=(1,1,1),loc=(-.15,.07,z));discs.append(o)
 for k,rr in enumerate([1,.86,.64]):
  bpy.ops.mesh.primitive_torus_add(major_segments=96,minor_segments=8,major_radius=r*rr,minor_radius=.026,location=(-.15,-.06-k*.012,z),rotation=(math.pi/2,0,0));ring=bpy.context.object;ring.name='08 concentric ring bevel '+str(j)+' '+str(k);ring.data.materials.append(mat);vis(ring,start+10+k*8,338);key(ring,start+10+k*8,scale=(.015,.015,.015));key(ring,start+31+k*7,scale=(1,1,1))
 for k,angle in enumerate([-.65,1.04]):
  h=cube('08 radial hand '+str(j)+' '+str(k),(-.15,-.14,z),(r*.87,.04,.055),start+38+k*4,339);h.rotation_euler.y=angle;key(h,start+38+k*4,scale=(.001,1,1));key(h,start+51+k*4,scale=(1,1,1))

# Exact source clock tower is introduced as individually extruded architectural patches.
# Each patch follows its own surface normal; the temporary blocking model remains until details have support.
native=[];regioncount={}
for name,m,matrix in source:
 m.transform(matrix)
 groups={}
 for poly in m.polygons:
  cen=poly.center
  if cen.z>8.25:region='roof'
  elif cen.y<.9 and cen.z>3.55 and ((cen.x+.15)**2+(cen.z-5.45)**2)<3.7:region='upper dial'
  elif cen.y<.9 and ((cen.x+.15)**2+(cen.z-1.77)**2)<2.3:region='lower dial'
  elif abs(cen.x+.15)>1.85:region='piers and side stone'
  else:region='walls and inset carving'
  groups.setdefault(region,[]).append(poly)
 for region,polys in groups.items():
  vv=[];ff=[];lookup={}
  for poly in polys:
   f=[]
   for ix in poly.vertices:
    if ix not in lookup:lookup[ix]=len(vv);vv.append(m.vertices[ix].co.copy())
    f.append(lookup[ix])
   ff.append(tuple(f))
  if not ff:continue
  me=bpy.data.meshes.new('Native '+region);me.from_pydata(vv,[],ff);me.update();obj=bpy.data.objects.new('09 native refinement / '+region+' / '+name,me);s.collection.objects.link(obj);me.materials.append(mat);obj.shape_key_add(name='Basis');k=obj.shape_key_add(name='Surface extrusion from the support')
  for ix,v in enumerate(vv):k.data[ix].co=Vector(v)+me.vertices[ix].normal*.30
  timing={'walls and inset carving':(284,327),'piers and side stone':(290,338),'roof':(299,344),'upper dial':(306,352),'lower dial':(313,360)}[region]
  vis(obj,timing[0],390);k.value=1;k.keyframe_insert('value',frame=timing[0]);k.value=0;k.keyframe_insert('value',frame=timing[1]);native.append(obj);regioncount[region]=regioncount.get(region,0)+len(ff)
  if region=='walls and inset carving':
   # The exact facade carves through a supporting block; body shrinks only after the native wall is present.
   pass
key(body,301,scale=(1,1,1));key(body,327,scale=(.01,.01,.01));key(roof,311,scale=(1,1,1));key(roof,327,scale=(.01,.01,.01))
for obj in list(s.objects):smooth_action(obj)
for me in list(bpy.data.meshes):
 if me.shape_keys:smooth_action(me.shape_keys)
smooth_action(camdata)
s.render.engine='BLENDER_EEVEE';s.eevee.taa_render_samples=64;s.render.resolution_x=1600;s.render.resolution_y=900;s.render.resolution_percentage=100;s.render.fps=30;s.frame_start=1;s.frame_end=390;s.frame_step=2;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.use_file_extension=True;s.render.use_overwrite=False;s.render.filepath=str(tmp/'frame-');s.render.film_transparent=False
s.world.color=(.015,.02,.015);s.view_settings.view_transform='AgX';s.view_settings.look='None';s.view_settings.exposure=-.3
bpy.context.preferences.filepaths.save_version=0
for image in bpy.data.images:
 if image.packed_file:continue
 try:image.pack()
 except:pass
s.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(out/'tower-modeling-insert.blend'),compress=True)
record={'source':'blender/home-construction-v32-93/courtyard-construction.blend','sourceModified':False,'nativeSaved':str(out/'tower-modeling-insert.blend'),'addedSeconds':10,'insertSeconds':13,'oldTailStartSeconds':3,'deliverySeconds':24,'nativeSamples':64,'engine':'Eevee','sourceSampleFps':15,'deliveryFps':30,'resolution':[1600,900],'actualNativeRefinementObjects':len(native),'nativePolygonsByRegion':regioncount,'steps':[['cube',0,1],['visible connected subdivision loops',.9,2],['successive lower/upper extrusion',2,4.8],['ridge vertex lifting and taper',4.8,6],['animated actual Boolean arch openings',6,7.2],['pier and cornice extrusion',7.2,8.5],['dual circular face and concentric torus bevel',8,10],['native carved surface refinement',9.45,12],['match original native camera',12,13]],'disclosure':'Newly arranged modeling demonstration built from actual editable Blender geometry and the retained native final tower; not a recording of historical mouse operations. The retained later 11 seconds remain the original Cycles movie.'}
(out/'construction-audit.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf8')
mode=sys.argv[sys.argv.index('--')+1:]if'--'in sys.argv else[]
if'--proof'in mode:
 for f in [225,285,390]:
  s.frame_set(f);s.render.filepath=str(out/f'proof-{f:04d}.png');start=time.monotonic();bpy.ops.render.render(write_still=True);print('PROOF',f,'seconds',time.monotonic()-start,flush=True)
else:print('V103 native modeling ready',len(native),flush=True)
