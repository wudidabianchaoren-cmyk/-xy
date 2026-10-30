"""One coast silhouette candidate: continuous recess, then actual triangle grounding."""
import bpy,json,math,re,statistics as statlib
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v148';O=P/'blender/mythology-v32-148';V=P/'.verify/v32-148/candidate-b';A.mkdir(parents=True,exist_ok=True);O.mkdir(parents=True,exist_ok=True);V.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-147/coast-joined-v147.blend'));sc=bpy.context.scene
old=next(o for o in sc.objects if o.type=='MESH' and o.name.startswith('Recessed actual island'))
# Reload only the original untouched height mesh; scan transforms stay exactly as saved.
before=set(sc.objects);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v134/island.glb'));island=next(o for o in sc.objects if o not in before and o.type=='MESH');bpy.data.objects.remove(old,do_unlink=True)
bpy.context.view_layer.objects.active=island;bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);island.name='V148 scan-envelope bedrock with continuous back slope'
def smooth(a,b,x):
 t=max(0,min(1,(x-a)/(b-a)));return t*t*(3-2*t)
# Build vertical ray sections through the real scan mesh. The land will sit just
# inside that envelope, then meet the original hill across a five-metre back slope.
scanSections=[]
for ob in [o for o in sc.objects if o.type=='MESH' and o.name.startswith('Embedded coastal_cliff')]:
 pts=[ob.matrix_world@v.co for v in ob.data.vertices];faces=[tuple(f.vertices) for f in ob.data.polygons];tree=BVHTree.FromPolygons(pts,faces);xmin=min(q.x for q in pts);xmax=max(q.x for q in pts);ymin=min(q.y for q in pts);ymax=max(q.y for q in pts);columns=[];step=.4
 for i in range(int((xmax-xmin)/step)+2):
  x=min(xmax,xmin+i*step);hits=[]
  for j in range(int((ymax-ymin)/.25)+2):
   y=min(ymax,ymin+j*.25);hit,normal,index,dist=tree.ray_cast(Vector((x,y,150)),Vector((0,0,-1)),300)
   if hit is not None:hits.append((y,float(hit.z)))
  columns.append(hits)
 scanSections.append({'name':ob.name,'xmin':xmin,'xmax':xmax,'step':step,'columns':columns})
# Half-metre terrain cells give the joining edge actual geometry at scan scale.
bpy.context.view_layer.objects.active=island;sub=island.modifiers.new('One actual join subdivision','SUBSURF');sub.subdivision_type='SIMPLE';sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
# Recess the buried shore continuously; a real, closed bedrock bridge joins the
# scanned crest to the original hill. No tree-protection bumps are preserved.
originalTree=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[tuple(f.vertices) for f in island.data.polygons]);changes=[]
for v in island.data.vertices:
 x,y,z=v.co;influence=0
 for cx,half,front,back,top in [(-17,18.5,11.,25.,13.2),(13,15.,18.,33.,8.0)]:
  side=1-smooth(half-4,half,abs(x-cx));frontw=smooth(front,front+3,y);backw=1-smooth(back-2,back+2,y);heightw=1-smooth(top-1.2,top,z);influence=max(influence,side*frontw*backw*heightw)
 if influence>0 and z>.3:
  target=.20+.12*math.sin(x*.31+y*.17);new=z+(min(z,target)-z)*influence
  if z-new>.05:changes.append(float(z-new))
  v.co.z=new
bridges=[]
for section in scanSections:
 rows=[];N=24
 for ii,hits in enumerate(section['columns']):
  if not hits:continue
  x=section['xmin']+ii*section['step'];y,z=max(hits,key=lambda h:h[1])
  if z<.50:continue
  # Both ends overlap real solid terrain/scan by a few centimetres.
  backY=y+5;hit,normal,idx,dist=originalTree.ray_cast(Vector((x,backY,150)),Vector((0,0,-1)),300)
  if hit is None:continue
  backZ=hit.z+.035;row=[]
  for j in range(N+1):
   t=j/N;yy=y-.18+(5.18)*t;zz=(z-.12)*(1-t)+backZ*t-.16*math.sin(t*math.pi);row.append((x,yy,zz))
  rows.append(row)
 vertices=[q for row in rows for q in row];faces=[];stride=N+1
 for i in range(len(rows)-1):
  for j in range(N):a=i*stride+j;faces.append((a,a+stride,a+stride+1,a+1))
 # Close the bridge sides down into the existing island. These are hidden
 # intersections, not an exposed paper-thin sheet suspended above a trench.
 boundary=list(range(stride))+[i*stride+N for i in range(1,len(rows))]+list(reversed(range((len(rows)-1)*stride,(len(rows)-1)*stride+N)))+[i*stride for i in reversed(range(1,len(rows)-1))]
 bottom=[]
 for q in boundary:bottom.append(len(vertices));v=vertices[q];vertices.append((v[0],v[1],-2.0))
 for j in range(len(boundary)):k=(j+1)%len(boundary);faces.append((boundary[j],bottom[j],bottom[k],boundary[k]))
 faces.append(tuple(reversed(bottom)))
 mesh=bpy.data.meshes.new('V148 closed real crest back-slope');mesh.from_pydata(vertices,[],faces);mesh.update();ob=bpy.data.objects.new('V148 crest bridge '+section['name'],mesh);sc.collection.objects.link(ob)
 for material in island.data.materials:mesh.materials.append(material)
 for f in mesh.polygons:f.use_smooth=True
 bridges.append(ob)
bpy.ops.object.select_all(action='DESELECT');island.select_set(True)
for ob in bridges:ob.select_set(True)
bpy.context.view_layer.objects.active=island;bpy.ops.object.join()
island.data.update()
for f in island.data.polygons:f.use_smooth=True
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.export_scene.gltf(filepath=str(A/'island-bridged.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_image_format='JPEG',export_jpeg_quality=90)
# Reuse the exact final high triangle surfaces, never an analytic height estimate.
terrain=[o for o in sc.objects if o.type=='MESH' and (o==island or o.name.startswith('Embedded coastal_cliff'))];bvh=[]
for ob in terrain:
 points=[ob.matrix_world@v.co for v in ob.data.vertices];faces=[tuple(f.vertices) for f in ob.data.polygons];bvh.append((ob.name,BVHTree.FromPolygons(points,faces,all_triangles=False)))
placements=json.loads((P/'assets/odyssey/compact-v134/vegetation.json').read_text());groups={}
for p in placements:groups.setdefault(tuple(round(a,5) for a in p['position']),[]).append(p)
records=[]
for key,parts in groups.items():
 x,oldz,negY=parts[0]['position'];y=-negY;hits=[]
 for name,tree in bvh:
  hit,normal,index,dist=tree.ray_cast(Vector((x,y,150)),Vector((0,0,-1)),300)
  if hit is not None:hits.append((hit.z,name,list(normal)))
 if not hits:raise RuntimeError('No final triangle under '+parts[0]['name'])
 z,support,normal=max(hits,key=lambda a:a[0]);newz=z-.018
 for p in parts:p['position'][1]=newz
 records.append({'name':re.sub(r' part\d+$','',parts[0]['name']),'x':x,'y':y,'before':oldz,'after':newz,'move':newz-oldz,'surface':support,'surfaceNormal':normal,'tree':parts[0]['scale'][0]>3.2})
(A/'vegetation-grounded-b.json').write_text(json.dumps(placements,separators=(',',':')),encoding='utf-8')
statistics={'groups':len(groups),'parts':len(placements),'trees':sum(r['tree'] for r in records),'shrubs':sum(not r['tree'] for r in records),'xyAndScaleUnchanged':True,'changedGroupsOver1cm':sum(abs(r['move'])>.01 for r in records),'loweredGroupsOver25cm':sum(r['move']<-.25 for r in records),'raisedGroupsOver25cm':sum(r['move']>.25 for r in records),'maxLowerMetres':max(-r['move'] for r in records),'maxRaiseMetres':max(r['move'] for r in records),'groupsOnScans':sum('Embedded' in r['surface'] for r in records),'groupsAtSeaLevel':sum(r['after']<.6 for r in records),'treesAtSeaLevel':sum(r['after']<.6 and r['tree'] for r in records),'alteredIslandVertices':len(changes),'maximumIslandRecession':max(changes),'rootProtectionDisks':0,'scansUnchanged':True,'backSlopeTransitionMetres':5,'scanSectionGridXMetres':.4,'scanSectionGridYMetres':.25}
(A/'grounding-statistics-b.json').write_text(json.dumps({'statistics':statistics,'groups':records},indent=2),encoding='utf-8');print('GROUNDING',json.dumps(statistics),flush=True)
# Grass is one combined source mesh; keep every XY coordinate and ground each
# connected blade/root cluster against the same final triangle surfaces.
before=set(sc.objects);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v134/grass.glb'));grasses=[o for o in sc.objects if o not in before and o.type=='MESH'];grassStats=[]
for ob in grasses:
 bpy.context.view_layer.objects.active=ob;bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);adj=[[] for v in ob.data.vertices]
 for edge in ob.data.edges:a,b=edge.vertices;adj[a].append(b);adj[b].append(a)
 seen=set();rootGroups={}
 for vi in range(len(adj)):
  if vi in seen:continue
  stack=[vi];seen.add(vi);component=[]
  while stack:
   q=stack.pop();component.append(q)
   for other in adj[q]:
    if other not in seen:seen.add(other);stack.append(other)
  points=[ob.data.vertices[q].co for q in component];root=min(points,key=lambda q:q.z);key=(round(root.x),round(root.y),round(root.z*2));rootGroups.setdefault(key,[]).extend(component)
 shifts=[]
 for indices in rootGroups.values():
  points=[ob.data.vertices[q].co for q in indices];zmin=min(q.z for q in points);rootPts=[q for q in points if q.z<zmin+.05];x=sum(q.x for q in rootPts)/len(rootPts);y=sum(q.y for q in rootPts)/len(rootPts);heights=[]
  for name,tree in bvh:
   hit,normal,index,dist=tree.ray_cast(Vector((x,y,150)),Vector((0,0,-1)),300)
   if hit is not None:heights.append(hit.z)
  if heights:
   dz=max(heights)-.012-zmin
   for q in indices:ob.data.vertices[q].co.z+=dz
   shifts.append(dz)
 grassStats.append({'name':ob.name,'connectedRootCells':len(rootGroups),'movedCells':sum(abs(dz)>.01 for dz in shifts),'maxLower':max([-dz for dz in shifts]+[0]),'maxRaise':max(shifts+[0])})
bpy.ops.object.select_all(action='DESELECT')
for ob in grasses:ob.select_set(True)
if grasses:bpy.context.view_layer.objects.active=grasses[0];bpy.ops.export_scene.gltf(filepath=str(A/'grass-grounded-b.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
statistics['grass']=grassStats;(A/'grounding-statistics-b.json').write_text(json.dumps({'statistics':statistics,'groups':records},indent=2),encoding='utf-8')
# Native candidate and exact plant instances allow silhouette inspection.
before=set(sc.objects);bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/compact-v134/vegetation.glb'));protos={}
for ob in [o for o in sc.objects if o not in before and o.type=='MESH']:
 match=re.search(r'prototype[ _](\d)',ob.name)
 if match:protos[int(match[1])]=ob
for p in placements:
 src=protos[p['prototype']];ob=src.copy();ob.data=src.data;ob.name=p['name']+' grounded V148';sc.collection.objects.link(ob);ob.parent=None;ob.location=(p['position'][0],-p['position'][2],p['position'][1]);ob.rotation_euler=(0,0,p['angle']);ob.scale=p['scale']
for ob in protos.values():bpy.data.objects.remove(ob,do_unlink=True)
# Clay colours retain the actual cutout opacity of leaf cards.
for material in bpy.data.materials:
 if not material.use_nodes:continue
 pr=next((n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not pr:continue
 for link in list(material.node_tree.links):
  if link.to_socket in [pr.inputs['Base Color'],pr.inputs['Metallic'],pr.inputs['Roughness'],pr.inputs['Normal']]:material.node_tree.links.remove(link)
 pr.inputs['Base Color'].default_value=(.42,.44,.43,1);pr.inputs['Metallic'].default_value=0;pr.inputs['Roughness'].default_value=.85
# A flat water datum makes the cut shore's height and slope readable.
bpy.ops.mesh.primitive_plane_add(size=500,location=(0,0,-.03));water=bpy.context.object;water.name='Gray water datum';ma=bpy.data.materials.new('V148 gray water datum');ma.diffuse_color=(.12,.15,.16,1);water.data.materials.append(ma)
world=bpy.data.worlds.new('V148 neutral silhouette world');world.use_nodes=True;bg=world.node_tree.nodes.new('ShaderNodeBackground');wo=world.node_tree.nodes.new('ShaderNodeOutputWorld');world.node_tree.links.new(bg.outputs[0],wo.inputs['Surface']);bg.inputs[0].default_value=(.22,.25,.28,1);bg.inputs[1].default_value=.6;sc.world=world
bpy.ops.object.light_add(type='AREA',location=(-35,-5,85));light=bpy.context.object;light.data.energy=75000;light.data.shape='DISK';light.data.size=55;light.rotation_euler=(Vector((-5,35,5))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();cam=bpy.context.object;sc.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=117;sc.render.engine='CYCLES';sc.cycles.samples=12;sc.cycles.use_denoising=True;sc.render.resolution_x=1600;sc.render.resolution_y=1100;sc.render.resolution_percentage=100
try:
 pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
 for device in pref.devices:device.use=device.type=='CUDA'
 sc.cycles.device='GPU'
except Exception:pass
sc.view_settings.view_transform='AgX';sc.render.image_settings.file_format='PNG'
for label,loc,target,scale in [('01-overhead',(-5,38,140),(-5,38,0),116),('02-shore-front',(-5,-65,24),(-5,30,9),116),('03-shore-side',(100,15,34),(-5,30,8),112)]:
 cam.location=loc;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=scale;sc.render.filepath=str(V/(label+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(O/'coast-bridged-candidate-b.blend'));print('V148_COAST_CANDIDATE_READY',flush=True)
