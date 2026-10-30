"""V143 narrow repair: anatomically directed low footwear, sealed inner hull, web budget.

Input is the preserved V142 native scene; this file never overwrites that input.
The new meshes are modeled in measured metre coordinates from the existing feet/hull.
"""
import bpy, bmesh, math, json, re, time
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

P=Path(__file__).resolve().parents[1]
A=P/'assets/odyssey/refit-v143'; O=P/'blender/mythology-v32-143'
A.mkdir(parents=True,exist_ok=True); O.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-142/fitted-crew-and-ship.blend'))
source=json.loads((P/'assets/odyssey/refit-v141/production.json').read_text(encoding='utf8'))
production=json.loads((P/'assets/odyssey/refit-v142/production.json').read_text(encoding='utf8'))
report={'source':'blender/mythology-v32-142/fitted-crew-and-ship.blend','blender':bpy.app.version_string,'repairs':[],'feet':[],'actors':production['actors'],'waterline':{'center':[1,0,8],'length':28,'width':6.9,'depth':3,'verticalOffset':.12,'nativeToGltf':'[x,z,-y]'},'notClaimed':['new face sculpt','historical archaeological reconstruction','full skeletal animation']}

def material(name,c,rough=.8,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1)
 p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if p is None:
  p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs['BSDF'],out.inputs['Surface'])
 p.name='Principled BSDF';p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 return m

leather=material('V143 soft matt oxhide low shoes',(.055,.029,.018),.79)
solemat=material('V143 layered hide thin shoe sole',(.023,.017,.012),.92)
stitchmat=material('V143 muted waxed flax stitching',(.20,.15,.09),.94)
bronze=bpy.data.materials.get('V142 worked bronze cuirass')
wood=bpy.data.materials.get('V138 sawn oak deck tone 2')

def mesh(name,v,f,m,smooth=True):
 g=bpy.data.meshes.new(name);g.from_pydata(v,[],f);g.update();o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);g.materials.append(m)
 uv=g.uv_layers.new(name='MeasuredMaterialUV')
 for p in g.polygons:
  p.use_smooth=smooth
  for li in p.loop_indices:
   q=g.vertices[g.loops[li].vertex_index].co;uv.data[li].uv=(q.x*.28,q.y*.45)
 return o

def curve(name,pts,r,m,res=1):
 g=bpy.data.curves.new(name,'CURVE');g.dimensions='3D';g.resolution_u=1;g.bevel_depth=r;g.bevel_resolution=res
 sp=g.splines.new('POLY');sp.points.add(len(pts)-1)
 for p,co in zip(sp.points,pts):p.co=(*co,1)
 o=bpy.data.objects.new(name,g);bpy.context.collection.objects.link(o);o.data.materials.append(m)
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH');return o

def tag(o,k):
 a=production['actors'][k]
 o['crewId']=k;o['crewSeated']=a['seated'];o['crewAnchor']=a['anchor'];o['crewHead']=a['head'];o['crewPhase']=a['phase']

def box(name,c,size,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=c);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 b=o.modifiers.new('Small timber arris','BEVEL');b.width=.008;b.segments=2;o.modifiers.new('Flat timber normals','WEIGHTED_NORMAL')
 return o

# Delete only the flawed V142 footwear and unaligned greaves, retaining every person.
removed=[]
for o in list(bpy.context.scene.objects):
 if o.name.startswith('Crew') and any(s in o.name for s in ['fitted leather shoe','stitched layered sole','shoe side stitching','shaped shin guard']):
  removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)

for k,a in enumerate(source['actors']):
 body=next(o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith(f'Crew{k:02}__') and (' Human.body ' in o.name if a['seated'] else o.name.endswith(' base003')))
 points=[body.matrix_world@v.co for v in body.data.vertices]
 bodytree=BVHTree.FromPolygons(points,[tuple(p.vertices) for p in body.data.polygons])
 for footid,f in enumerate(a['feet']):
  mn,mx=Vector(f['min']),Vector(f['max']);mid=(mn+mx)/2;z0=mn.z-.006
  longaxis=0 if mx.x-mn.x>mx.y-mn.y else 1;shortaxis=1-longaxis
  # Actual surviving ankle vertices identify heel position and the toe direction.
  candidates=[p for p in points if mn.z+.12<p.z<mn.z+.22 and abs(p[shortaxis]-mid[shortaxis])<.105 and abs(p[longaxis]-mid[longaxis])<.19]
  ankle=sum(candidates,Vector())/len(candidates) if candidates else mid.copy()
  sign=1 if mid[longaxis]>=ankle[longaxis] else -1
  forward=Vector((0,0,0));forward[longaxis]=sign;right=Vector((-forward.y,forward.x,0))
  length=max(.245,min(.310,mx[longaxis]-mn[longaxis]+.024));width=max(.108,min(.155,mx[shortaxis]-mn[shortaxis]+.014))
  center=mid.copy();center.z=z0
  # Heel is narrower, toe broad and rounded, vamp rises over the instep.
  profile=[(-.52,.10,.045),(-.49,.62,.095),(-.43,.86,.112),(-.31,.90,.120),(-.12,1.0,.111),(.10,1.0,.080),(.30,.94,.063),(.42,.76,.055),(.49,.43,.043),(.52,.09,.025)]
  segments=20;vv=[]
  for t,w,h in profile:
   for i in range(segments):
    an=2*math.pi*i/segments;s=math.sin(an);zz=.016+(h-.016)*max(0,s)**.72
    # Lower half wraps the foot to a continuous thin sole rather than a pointed cone.
    if s<0:zz=.016*(1+s)
    p=center+forward*(t*length)+right*(math.cos(an)*width*.5*w);p.z+=zz;vv.append(tuple(p))
  ff=[(j*segments+i,j*segments+(i+1)%segments,(j+1)*segments+(i+1)%segments,(j+1)*segments+i) for j in range(len(profile)-1) for i in range(segments)]
  ff.extend([tuple(reversed(range(segments))),tuple(range((len(profile)-1)*segments,len(profile)*segments))])
  shoe=mesh(f'Crew{k:02}__V143 rounded toe low hide shoe {footid}',vv,ff,leather);tag(shoe,k)
  # A flat, oval edge and 15mm layered sole; no tapered vertical shoe wall.
  outline=[]
  for t,w,h in profile:outline.append(center+forward*(t*length)+right*(width*.5*w))
  outline += [center+forward*(t*length)-right*(width*.5*w) for t,w,h in reversed(profile)]
  sv=[tuple(p+Vector((0,0,z))) for z in [0,.016] for p in outline];n=len(outline)
  sf=[(i,(i+1)%n,n+(i+1)%n,n+i) for i in range(n)]+[tuple(reversed(range(n))),tuple(range(n,2*n))]
  s=mesh(f'Crew{k:02}__V143 thin flat layered sole {footid}',sv,sf,solemat,False);tag(s,k)
  # Ankle leather overlaps the heel and receives the shin, with a visible open rim.
  heel=center-forward*(length*.25);heel.z=z0
  if candidates:
   # Keep the opening inside the measured shoe footprint, not at the foot bbox centre.
   heel.x=ankle.x;heel.y=ankle.y
  radlong=.046;radwide=.043;ring=[];faces=[]
  for j,z in enumerate([.069,.115,.170]):
   for i in range(24):
    an=2*math.pi*i/24;direction=forward*math.cos(an)+right*math.sin(an);origin=heel+Vector((0,0,z))
    hit,normal,index,distance=bodytree.ray_cast(origin,direction,.18)
    rad=max(.052,(distance+.008) if hit is not None else .055);p=origin+direction*rad;ring.append(tuple(p))
  for j in range(2):
   for i in range(24):faces.append((j*24+i,j*24+(i+1)%24,(j+1)*24+(i+1)%24,(j+1)*24+i))
  collar=mesh(f'Crew{k:02}__V143 open leather ankle collar {footid}',ring,faces,leather);so=collar.modifiers.new('Ankle leather thickness','SOLIDIFY');so.thickness=.003;tag(collar,k)
  seam=curve(f'Crew{k:02}__V143 shoe welt stitch {footid}',[tuple(p+Vector((0,0,.020))) for p in outline+[outline[0]]],.0011,stitchmat,0);tag(seam,k)
  # Fit the lower leg separately. The guard follows actual shin centres, not a toe centre.
  levels=9;cols=18;gv=[];shinStart=z0+.143;shinH=.35 if not a['seated'] else .20
  for j in range(levels):
   t=j/(levels-1);zz=shinStart+shinH*t
   pts=[p for p in points if abs(p.z-zz)<.035 and (Vector((p.x,p.y,0))-Vector((heel.x,heel.y,0))).length<.19]
   cc=sum(pts,Vector())/len(pts) if pts else heel.copy();cc.z=zz
   for i in range(cols+1):
    an=-1.25+2.5*i/cols;direction=forward*math.cos(an)+right*math.sin(an)
    hit,normal,index,distance=bodytree.ray_cast(cc,direction,.25)
    rad=max(.061,(distance+.014) if hit is not None else .075)
    p=cc+direction*rad;gv.append(tuple(p))
  gf=[(j*(cols+1)+i,j*(cols+1)+i+1,(j+1)*(cols+1)+i+1,(j+1)*(cols+1)+i) for j in range(levels-1) for i in range(cols)]
  guard=mesh(f'Crew{k:02}__V143 formed anatomical greave {footid}',gv,gf,bronze);so=guard.modifiers.new('Thin bronze thickness','SOLIDIFY');so.thickness=.004;tag(guard,k)
  report['feet'].append({'actor':k,'foot':footid,'length':length,'width':width,'soleThickness':.016,'forward':list(forward),'ankle':list(heel),'actualAnkleVertices':len(candidates),'shoeBottom':z0,'deckContact':not a['seated']})
 # Remove only the fully concealed extra foot skin remaining inside closed shoes.
 bm=bmesh.new();bm.from_mesh(body.data);cutoff=min(f['min'][2] for f in a['feet'])+.153
 hidden=[f for f in bm.faces if all((body.matrix_world@v.co).z<cutoff for v in f.verts)]
 if hidden:bmesh.ops.delete(bm,geom=hidden,context='FACES');bm.to_mesh(body.data)
 bm.free()
 # Real footrests beneath seated feet, rather than floating toes above the bilge floor.
 if a['seated']:
  lows=[Vector(f['min']) for f in a['feet']];highs=[Vector(f['max']) for f in a['feet']]
  lo=Vector([min(p[i] for p in lows) for i in range(3)]);hi=Vector([max(p[i] for p in highs) for i in range(3)])
  box(f'V143 rower {k:02} transverse oak foot rest',((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z-.043),(hi.x-lo.x+.04,hi.y-lo.y+.06,.074),wood)

# Seal the original staggered open strakes with a continuous inner timber skin.
# The original outer boards, keel, frames, decks and hull silhouette all remain.
def hull(u,v,side):
 x=(u-.5)*28+1;sheer=.80*abs(2*u-1)**3.4;half=3.45*max(.005,math.sin(math.pi*u))**.56
 return (x,-8+side*half*(.12+.88*math.sin(v*math.pi*.5))*.972,-.95+v*3+sheer+.12+.05)
vv=[];sections=81;cross=16
for j in range(sections):
 u=.0002+.9996*j/(sections-1)
 row=[hull(u,k/cross,-1) for k in range(cross,-1,-1)]
 left=Vector(row[-1]);right=Vector(hull(u,0,1));row.append(tuple((left+right)/2));row.extend(hull(u,k/cross,1) for k in range(cross+1));vv.extend(row)
cols=cross*2+3
ff=[(j*cols+i,j*cols+i+1,(j+1)*cols+i+1,(j+1)*cols+i) for j in range(sections-1) for i in range(cols-1)]
ff.extend([tuple(reversed(range(cols))),tuple(range((sections-1)*cols,sections*cols))])
liner=mesh('V143 continuous sealed internal oak hull lining',vv,ff,wood);so=liner.modifiers.new('Continuous watertight lining thickness','SOLIDIFY');so.thickness=.045;so.offset=-1
report['repairs'].extend(['28 low shoes with broad rounded toe, thin flat sole, shaped vamp and open ankle collar','28 shin guards fitted to surviving posed ankle/shin vertices','12 seated foot rests placed beneath actual foot soles','continuous internal hull lining closes staggered strake gaps','runtime water exclusion uses inverse animated boat matrix and original analytic hull section'])

# Stop exporting excessive subdivisions on tiny eye/cloth pieces. Preserve native input.
before=0;after=0;reduced=[]
deps=bpy.context.evaluated_depsgraph_get()
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 ev=o.evaluated_get(deps);em=ev.to_mesh();tri=sum(len(p.vertices)-2 for p in em.polygons);ev.to_mesh_clear();before+=tri
 for mod in list(o.modifiers):
  if mod.type=='SUBSURF':o.modifiers.remove(mod)
 # Apply physical thickness first so the export and inspection inspect the same surface.
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
 for mod in list(o.modifiers):
  try:bpy.ops.object.modifier_apply(modifier=mod.name)
  except RuntimeError:pass
 if 'V143' in o.name:
  bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free()
 base=sum(len(p.vertices)-2 for p in o.data.polygons);ratio=1
 if 'hull strake' in o.name:ratio=.50
 elif o.name.startswith('Crew') and not 'V143' in o.name:
  if 'formed corselet' in o.name:ratio=.32
  elif 'rolled plate' in o.name or 'underarm hide' in o.name or 'bronze forehead' in o.name:ratio=.45
  elif 'base003' in o.name:ratio=1
  elif base>2200:ratio=.62
  elif 'helmet foundation' in o.name:ratio=.56
 if base>400 and ratio<.99:
  dec=o.modifiers.new('V143 web silhouette budget','DECIMATE');dec.ratio=ratio;dec.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=dec.name);reduced.append({'name':o.name,'before':base,'after':sum(len(p.vertices)-2 for p in o.data.polygons)})
 after+=sum(len(p.vertices)-2 for p in o.data.polygons)

sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=40;sc.cycles.use_denoising=True;sc.render.resolution_x=1400;sc.render.resolution_y=1000;sc.render.resolution_percentage=100
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.cycles.device='GPU';bpy.context.view_layer.update()
report.update({'beforeTrianglesWithRepair':before,'afterTriangles':after,'reducedMeshes':reduced,'removedOldFootwearParts':len(removed),'native':str(O/'sealed-hull-and-fitted-footwear.blend')})
bpy.ops.wm.save_as_mainfile(filepath=str(O/'sealed-hull-and-fitted-footwear.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'armed-ship.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_image_format='JPEG',export_jpeg_quality=86)
report['glbBytes']=(A/'armed-ship.glb').stat().st_size
(A/'production.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
cam=sc.camera
for name,loc,target,lens in [('captain-footwear',( -9.7,-9.4,2.92),(-8.83,-7.70,2.48),65),('captain-full',(-11.0,-11.7,4.8),(-8.82,-7.66,3.10),56),('sealed-rowing-well',(1,-16.8,10.5),(1,-8,.9),50)]:
 cam.location=loc;cam.data.lens=lens;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();sc.render.filepath=str(O/(name+'.png'));bpy.ops.render.render(write_still=True)
print('V143_SHIP_READY',after,report['glbBytes'])
