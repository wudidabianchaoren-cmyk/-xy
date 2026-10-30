"""Local Blender refit and documented material stages. Run once, not for preview."""
import bpy,math,json,random
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v141';O=P/'blender/mythology-v32-141';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-138/sawn-deck-fitted-crew.blend'))
random.seed(141)
def material(name,c,metal=0,rough=.75):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;pr=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if pr is None:
  pr=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(pr.outputs['BSDF'],out.inputs['Surface'])
 pr.name='Principled BSDF';pr.inputs['Base Color'].default_value=(*c,1);pr.inputs['Roughness'].default_value=rough;pr.inputs['Metallic'].default_value=metal;return m
bronze=material('V141 forged Aegean bronze',(.23,.158,.07),.8,.53);edge=material('V141 polished bronze rolled seams',(.46,.31,.12),.87,.34);leather=material('V141 dark oxhide footwear and binding',(.065,.033,.017),0,.84);ivory=material('V141 naturally aged boar tusk plaques',(.42,.36,.25),0,.68)
linen=material('V141 unbleached linen corselet',(.45,.40,.29),0,.93);wool=material('V141 madder wool knee length chiton',(.19,.052,.025),0,.94)
# Real tile maps survive GLB export; shader-only noise would vanish in the browser.
import numpy as np
rng=np.random.default_rng(141);field=rng.random((256,256)).astype(np.float32)
for _ in range(5):field=(field+np.roll(field,1,0)+np.roll(field,-1,0)+np.roll(field,1,1)+np.roll(field,-1,1))/5
field=(field-field.min())/(field.max()-field.min())
for m,base,amount in [(bronze,.43,.15),(edge,.34,.10),(leather,.84,.10)]:
 px=np.ones((256,256,4),np.float32);px[:,:,:3]=(base+(field-.5)*amount)[:,:,None];im=bpy.data.images.new(m.name+' roughness',256,256);im.pixels.foreach_set(px.ravel());im.filepath_raw=str(A/(m.name.replace(' ','-')+'-rough.png'));im.file_format='PNG';im.save();im.colorspace_settings.name='Non-Color';n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=im;m.node_tree.links.new(n.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'])
for m in [linen,wool]:
 tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(P/'assets/odyssey/rough_linen/rough_linen_nor_gl_1k.jpg'),check_existing=True);tex.image.colorspace_settings.name='Non-Color';n=m.node_tree.nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.16;m.node_tree.links.new(tex.outputs['Color'],n.inputs['Color']);m.node_tree.links.new(n.outputs['Normal'],m.node_tree.nodes.get('Principled BSDF').inputs['Normal'])
def bounds(o):
 pts=[o.matrix_world@Vector(v) for v in o.bound_box];return Vector([min(p[i] for p in pts) for i in range(3)]),Vector([max(p[i] for p in pts) for i in range(3)])
def mesh(name,v,f,m,smooth=True):
 data=bpy.data.meshes.new(name);data.from_pydata(v,[],f);data.update();o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);o.data.materials.append(m)
 for p in data.polygons:p.use_smooth=smooth
 return o
def ball(name,c,s,m):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=c);o=bpy.context.object;o.name=name;o.scale=s;o.data.materials.append(m)
 for p in o.data.polygons:p.use_smooth=True
 return o
def box(name,c,s,m,b=.008):
 bpy.ops.mesh.primitive_cube_add(size=1,location=c);o=bpy.context.object;o.name=name;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if b:q=o.modifiers.new('Worn physical edges','BEVEL');q.width=b;q.segments=3;o.modifiers.new('Stable surface normals','WEIGHTED_NORMAL')
 return o
def tube(name,pts,r,m):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=2;c.bevel_depth=r;c.bevel_resolution=3;s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(m);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);return o
# Remove the misfitted earlier costume pieces; keep the actual people, poses, oars and ship.
for o in list(bpy.context.scene.objects):
 if o.name.startswith('V137 warrior ') or o.name.startswith('V138 actor') or 'attached sandal' in o.name or 'sandal instep' in o.name:bpy.data.objects.remove(o,do_unlink=True)
for o in list(bpy.context.scene.objects):
 if 'Pleated_woven_knee-length_tunic_hem' in o.name:
  lo,hi=bounds(o);inv=o.matrix_world.inverted();
  for vert in o.data.vertices:
   world=o.matrix_world@vert.co;world.z=2.78+(world.z-lo.z)/(hi.z-lo.z)*.37;vert.co=inv@world
  o.data.materials.clear();o.data.materials.append(wool)
 elif 'short-sleeve_linen_tunic' in o.name or 'Oatmeal woven tunic' in o.name:
  o.data.materials.clear();o.data.materials.append(wool if 'short-sleeve' in o.name else linen)
 if o.type=='MESH' and ('captain base003' in o.name or o.name.endswith('helmsman base003')):
  q=o.modifiers.new('Close portrait subdivision','SUBSURF');q.levels=q.render_levels=1
for m in bpy.data.materials:
 if not m.use_nodes:continue
 pr=m.node_tree.nodes.get('Principled BSDF')
 if pr and 'skin' in m.name.lower():pr.inputs['Roughness'].default_value=.66;pr.inputs['Subsurface Weight'].default_value=.04
actors=[];report=json.loads((P/'assets/odyssey/refit-v137/production.json').read_text(encoding='utf-8'))
for k,a in enumerate(report['actors']):
 row=a['seated'];src=a['source'];suffix=src.split('Human.body ',1)[1] if row else ''
 body=bpy.data.objects.get(src) if row else bpy.data.objects.get(src.split(' Anatomically_',1)[0]+' base003')
 belt=bpy.data.objects.get('V112 Brown leather sandals and belt '+suffix+'.002') if row else bpy.data.objects.get(src.split(' Anatomically_',1)[0]+' Leather_waist_belt')
 hair=bpy.data.objects.get('V112 Human.short01 '+suffix) if row else bpy.data.objects.get(src.split(' Anatomically_',1)[0]+' Humanshort01')
 if not body or not belt or not hair:raise RuntimeError('Missing original actor components '+src)
 bl,bh=bounds(belt);hl,hh=bounds(hair);c=(bl+bh)/2;hc=(hl+hh)/2;z=c.z+.015;height=min(.49,max(.36,hl.z-z-.13));wx=.282 if not row else .185;wy=.215 if not row else .239
 name=f'V141 crew {k:02}'
 # Fitted rigid plate from radial intersections with the actual posed cloth.
 # This preserves the body lean without copying cloth wrinkles into a metal shirt.
 from mathutils.bvhtree import BVHTree
 shirt=bpy.data.objects.get(src.split(' Anatomically_',1)[0]+' Anatomically_fitted_short-sleeve_linen_tunic') if not row else None
 if row:
  cs=[o for o in bpy.context.scene.objects if o.type=='MESH' and 'Oatmeal woven tunic' in o.name and suffix in o.name];shirt=cs[0] if cs else body
 verts=[shirt.matrix_world@v.co for v in shirt.data.vertices];tree=BVHTree.FromPolygons(verts,[list(p.vertices) for p in shirt.data.polygons],all_triangles=False)
 rows=18;cols=64;vv=[]
 top=min(hl.z-.13,z+.43)
 for j in range(rows):
  t=j/(rows-1);center=c.lerp(hc,t*.45);zz=z+t*(top-z)
  for i in range(cols+1):
   an=i/cols*math.pi*2;direction=Vector((math.cos(an),math.sin(an),0));origin=Vector((center.x,center.y,zz));hit,normal,index,dist=tree.ray_cast(origin,direction,.43)
   radius=max(.09,min(.34,dist if hit is not None else (.18 if row else .19))) +.046
   vv.append(tuple(origin+direction*radius))
 # Circumferential smoothing removes garment wrinkles but retains the fitted silhouette.
 for _ in range(7):
  original=[Vector(v) for v in vv]
  for j in range(rows):
   for i in range(cols):
    idx=j*(cols+1)+i;near=[original[j*(cols+1)+(i-1)%cols],original[j*(cols+1)+(i+1)%cols]]
    if j>0:near.append(original[idx-cols-1])
    if j<rows-1:near.append(original[idx+cols+1])
    vv[idx]=tuple(original[idx]*.45+sum(near,Vector())/len(near)*.55)
   vv[j*(cols+1)+cols]=vv[j*(cols+1)]
 ff=[(j*(cols+1)+i,j*(cols+1)+i+1,(j+1)*(cols+1)+i+1,(j+1)*(cols+1)+i) for j in range(rows-1) for i in range(cols)]
 ob=mesh(name+' fitted rigid bronze corselet',vv,ff,bronze if k<2 or k%3==0 else linen);q=ob.modifiers.new('Plate thickness','SOLIDIFY');q.thickness=.008
 for j in [0,rows-1]:tube(name+' folded plate edge',[vv[j*(cols+1)+i] for i in range(cols+1)],.005,edge)
 # Broad flexible shoulder yokes support the plate and meet it at riveted tabs.
 clasp=bpy.data.objects.get(src.split(' Anatomically_',1)[0]+' Bronze_belt_clasp') if not row else None
 if clasp:
  ca,cb=bounds(clasp);forward=(ca+cb)/2-c;forward.z=0;forward.normalize()
 else:forward=Vector((1,0,0))
 right=Vector((-forward.y,forward.x,0));upper=c.lerp(hc,.45)
 for side in [-1,1]:
  strip=[]
  for j in range(17):
   t=j/16;pp=Vector((upper.x,upper.y,top-.015))+right*(side*.135)+forward*(.19*(1-2*t));pp.z+=math.sin(t*math.pi)*.135
   for off in [-.032,.032]:strip.append(tuple(pp+right*off))
  ob=mesh(name+' load bearing leather shoulder yoke',strip,[(j*2,j*2+1,j*2+3,j*2+2) for j in range(16)],leather);q=ob.modifiers.new('Leather thickness','SOLIDIFY');q.thickness=.009
  for j in [0,16]:ball(name+' yoke rivet',Vector(strip[j*2]).lerp(Vector(strip[j*2+1]),.5),(.011,.011,.011),edge)

 if shirt and shirt!=body:
  q=shirt.modifiers.new('Cloth silhouette smoothing','SUBSURF');q.levels=q.render_levels=1
 # Leather cap, ivory tusk plaques, bronze brow and cheek guards; no medieval or Roman helmet.
 rx=max(.085,(hh.x-hl.x)*.45);ry=max(.09,(hh.y-hl.y)*.45);base=hh.z-.105;rise=.145
 def cap(th,an,extra=0):return(hc.x+(rx+extra)*math.cos(th)*math.cos(an),hc.y+(ry+extra)*math.cos(th)*math.sin(an),base+(rise+extra)*math.sin(th))
 vv=[cap(j/16*math.pi/2,i/64*2*math.pi) for j in range(17) for i in range(65)];ff=[(j*65+i,j*65+i+1,(j+1)*65+i+1,(j+1)*65+i) for j in range(16) for i in range(64)];mesh(name+' shaped oxhide helmet foundation',vv,ff,leather)
 for band in range(4):
  t0=.10+band*.285;t1=t0+.25
  for i in range(18):
   a0=2*math.pi*(i+band*.5)/18+.025;a1=2*math.pi*(i+1+band*.5)/18-.025
   vv=[cap(t0,a0,.006),cap(t0,a1,.006),cap(t1,a1,.006),cap(t1,a0,.006)];ob=mesh(name+' ivory helmet plaque',vv,[(0,1,2,3)],ivory);so=ob.modifiers.new('Ivory plaque thickness','SOLIDIFY');so.thickness=.003
 tube(name+' bronze forehead binding',[cap(.035,i/64*2*math.pi,.005) for i in range(65)],.009,edge)
 # Feet are fitted from the actual posed body, including seated feet; replace the detached old soles.
 lo,hi=bounds(body);foot=[body.matrix_world@v.co for v in body.data.vertices if (body.matrix_world@v.co).z<lo.z+.11]
 axis=1 if row else 0;centers=[min(foot,key=lambda p:p[axis]).copy(),max(foot,key=lambda p:p[axis]).copy()]
 for _ in range(8):
  cluster=[[],[]]
  for p in foot:cluster[0 if (p-centers[0]).length_squared<(p-centers[1]).length_squared else 1].append(p)
  centers=[sum(g,Vector())/len(g) if g else centers[i] for i,g in enumerate(cluster)]
 feetReport=[]
 for j,points in enumerate(cluster):
  mn=Vector([min(p[i] for p in points) for i in range(3)]);mx=Vector([max(p[i] for p in points) for i in range(3)]);cc=(mn+mx)/2;sx=max(.12,mx.x-mn.x)+.016;sy=max(.14,mx.y-mn.y)+.016
  box(name+f' closed hide shoe {j}',(cc.x,cc.y,lo.z+.060),(sx+.025,sy+.025,.14),leather,.055);box(name+f' sewn sole {j}',(cc.x,cc.y,lo.z+.009),(sx+.013,sy+.013,.025),leather,.015)
  # Formed shin guard, open at the back, with two real leather bindings.
  ankle=Vector((cc.x,cc.y,lo.z+.14));legH=.42 if not row else .27;vv=[]
  for r in range(9):
   t=r/8;rad=.053+.030*math.sin(t*math.pi*.75)
   for i in range(25):
    an=-1.20+2.4*i/24;dx=math.sin(an)*rad;dy=-math.cos(an)*rad;vv.append((ankle.x+(dy if row else dx),ankle.y+(dx if row else dy),ankle.z+t*legH))
  mesh(name+f' fitted bronze greave {j}',vv,[(r*25+i,r*25+i+1,(r+1)*25+i+1,(r+1)*25+i) for r in range(8) for i in range(24)],bronze)
  for t in [.12,.78]:tube(name+' shin leather binding',[(ankle.x+math.cos(i/32*2*math.pi)*.068,ankle.y+math.sin(i/32*2*math.pi)*.068,ankle.z+t*legH) for i in range(33)],.010,leather)
  feetReport.append({'min':list(mn),'max':list(mx)})
 actors.append({'id':k,'seated':row,'corseletCenter':list(c),'headCenter':list(hc),'feet':feetReport})
# Remove the old rower soles at an unrelated height; the new fitted shoes cover the real feet.
for o in list(bpy.context.scene.objects):
 if 'Brown leather sandals and belt boat0' in o.name and not o.name.endswith('.002'):bpy.data.objects.remove(o,do_unlink=True)
for o in bpy.context.scene.objects:
 if o.type=='MESH':
  for p in o.data.polygons:
   if 'V141' in o.name:p.use_smooth=True
# The first rowing station was under the oversized bow platform. Trim the
# platform to its actual bulkhead, retaining the raised captain's deck.
for ob in bpy.context.scene.objects:
 if ob.name.startswith('V138 flat sawn') and 'part-1' in ob.name:
  lo,hi=bounds(ob)
  if hi.x>-6.2 and lo.x<-6.2:
   ob.scale.x*=(-6.2-lo.x)/(hi.x-lo.x);ob.location.x=(lo.x-6.2)/2
sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=40;sc.cycles.use_denoising=True;sc.render.resolution_x=1600;sc.render.resolution_y=1100;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences
try:
 prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type=='CUDA'
 sc.cycles.device='GPU'
except:sc.cycles.device='CPU'
for o in list(sc.objects):
 if o.type in ['CAMERA','LIGHT']:bpy.data.objects.remove(o,do_unlink=True)
world=sc.world or bpy.data.worlds.new('V141 soft marine daylight');world.use_nodes=True;world.node_tree.nodes['Background'].inputs['Color'].default_value=(.48,.55,.60,1);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.35;sc.world=world
for loc,energy,size in [((-9,-13,9),1800,6),((3,-2,10),1200,8)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((-2,-8,2))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(-11.2,-10.6,4.9));cam=bpy.context.object;cam.data.lens=58;cam.rotation_euler=(Vector((-8.8,-7.7,3.2))-cam.location).to_track_quat('-Z','Y').to_euler();sc.camera=cam
bpy.ops.wm.save_as_mainfile(filepath=str(O/'aegean-crew-and-ship.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'armed-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
clay=material('V141 white model inspection',(.53,.55,.54),0,.85);sc.view_layers[0].material_override=clay;sc.cycles.samples=24;sc.render.filepath=str(O/'01-clay-model.png');bpy.ops.render.render(write_still=True)
wire=material('V141 actual mesh topology',(.12,.17,.18),0,.9);nodes=wire.node_tree.nodes;links=wire.node_tree.links;wf=nodes.new('ShaderNodeWireframe');wf.inputs['Size'].default_value=.0012;mix=nodes.new('ShaderNodeMixRGB');mix.inputs[1].default_value=(.50,.55,.54,1);mix.inputs[2].default_value=(.018,.035,.038,1);links.new(wf.outputs['Fac'],mix.inputs[0]);links.new(mix.outputs[0],nodes.get('Principled BSDF').inputs['Base Color']);sc.view_layers[0].material_override=wire;sc.render.filepath=str(O/'02-topology.png');bpy.ops.render.render(write_still=True)
sc.view_layers[0].material_override=None;sc.cycles.samples=48;sc.render.filepath=str(O/'03-armor-materials.png');bpy.ops.render.render(write_still=True)
cam.location=(10.5,-11.2,4.2);cam.data.lens=60;cam.rotation_euler=(Vector((10.4,-8.2,3.1))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'04-helmsman-costume.png');bpy.ops.render.render(write_still=True)
center=Vector(actors[2]['corseletCenter']);cam.location=center+Vector((.6,-1.0,2.7));cam.data.lens=58;cam.rotation_euler=(center+Vector((0,0,.12))-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/'05-rower-equipment.png');bpy.ops.render.render(write_still=True)
(A/'production.json').write_text(json.dumps({'blender':bpy.app.version_string,'device':sc.cycles.device,'samples':48,'actors':actors,'newNative':str(O/'aegean-crew-and-ship.blend'),'costume':'Aegean Bronze Age inspired epic adaptation; oxhide and tusk helmet, formed corselet, wool/linen tunic, fitted closed hide footwear and greaves','notArchaeologicalReconstruction':True},ensure_ascii=False,indent=2),encoding='utf-8');print('V141_NATIVE_COMPLETE')
