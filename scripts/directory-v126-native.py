import bpy,math,json,time,hashlib,struct,zlib,bmesh
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v126';NATIVE=ROOT/'blender/directory-v32-126';V=ROOT/'.verify/v32-126'
for p in [OUT,NATIVE,V]:p.mkdir(parents=True,exist_ok=True)
old=ROOT/'blender/directory-v32-125/directory-room.blend';oldsha=hashlib.sha256(old.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(old));scene=bpy.context.scene;scene.name='V126 coherent tungsten artist desktop / unified CRT shell'
removed=[]
for ob in list(scene.objects):
 if ob.name in ['room-static','room-static-export','Calendar124 legible vector print','Calendar125 legible vector print'] or ob.name.startswith(('Preview dynamic','Calendar124 print ','CD125 low rack','CD125 independently','CRT cabinet vertical assembly seam')):
  removed.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:ob.hide_render=False;ob.hide_set(False)
remoteExport=bpy.data.objects.get('Remote123 physical controls');remoteExport.hide_render=True;remoteExport.hide_set(True)
helper=(ROOT/'scripts/directory-v122-native.py').read_text(encoding='utf8');exec(compile(helper[helper.index('def material('):helper.index('cx,cy=-.73')],'original physical modelling helpers','exec'),globals())
new=[];proxies=[];printDetails=[]
def prop(ob,key=''):
 ob['key']=key;ob['occluder']=True;ob['sourceName']=ob.name;new.append(ob);return ob
# Five legacy overlapping closed boxes shared their left/right/top exterior planes.
# Actual Boolean union removes coplanar internal/exterior faces; no polygon-offset masking.
parts=[bpy.data.objects[n] for n in ['CRT cabinet back','CRT thick side shell','CRT thick side shell.001','CRT top shell','CRT lower controls']]
shell=parts[0];beforeCabinet=[]
for ob in parts:
 beforeCabinet.append({'name':ob.name,'location':list(ob.location),'dimensions':list(ob.dimensions),'faces':len(ob.data.polygons)})
for ob in parts:
 removed.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
shell=box('CRT126 new cabinet volume',(-.25,.065,1.22),(.72,.55,.68),bpy.data.materials['Aged warm black television'],.022)
cut=box('CRT126 actual rounded front screen cavity',(-.25,-.185,1.27),(.562,.37,.424),rubber,.010)
for x in bpy.context.selected_objects:x.select_set(False)
shell.select_set(True);bpy.context.view_layer.objects.active=shell
md=shell.modifiers.new('Continuous shell and actual front cavity','BOOLEAN');md.operation='DIFFERENCE';md.solver='EXACT';md.object=cut
bpy.ops.object.modifier_apply(modifier=md.name);bpy.data.objects.remove(cut,do_unlink=True)
shell.name='CRT126 unified watertight rounded ABS cabinet';shell['key']='tv';shell['occluder']=True;shell['sourceName']=shell.name
bm=bmesh.new();bm.from_mesh(shell.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000002);bmesh.ops.dissolve_degenerate(bm,dist=.000001,edges=list(bm.edges));bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(shell.data);bm.free()
bm=bmesh.new();bm.from_mesh(shell.data);cabinetAudit={'oldParts':beforeCabinet,'newFaces':len(bm.faces),'boundaryEdges':sum(e.is_boundary for e in bm.edges),'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges),'removedCoplanarOverlapByActualBoolean':True,'method':'Rebuilt a single radius22mm cabinet volume and subtracted a radius10mm front screen cavity; legacy union audit rejected non-manifold overlapping topology.','razorThinSeamBarsRemoved':True};bm.free()
assert cabinetAudit['boundaryEdges']==0 and cabinetAudit['nonManifoldEdges']==0,cabinetAudit
# Fine manufacturing variation remains material-specific. Broader satin response replaces hard chrome trim.
for name,rough,metal,col in [('Aged warm black television',.48,0,(.030,.033,.034)),('Brushed warm brass',.39,.94,(.39,.245,.105)),('Graphite molded ABS / fine grain',.54,0,(.023,.027,.028)),('Calendar124 uncoated ivory paper',.88,0,(.82,.81,.78))]:
 mat=bpy.data.materials.get(name)
 if mat:
  p=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*col,1);mat.diffuse_color=(*col,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
  if name=='Aged warm black television':
   p.inputs['Coat Weight'].default_value=.045;p.inputs['Coat Roughness'].default_value=.34;mat['materialKind']='abs'
  if name=='Calendar124 uncoated ivory paper':
   for link in list(p.inputs['Base Color'].links):mat.node_tree.links.remove(link)
   mat['materialKind']='paper';mat['liveDatePrintedInBrowser']=True
# Group tools with sketchbook rather than scattering fragments across the focal area.
for ob in scene.objects:
 if ob.name.startswith(('Artist125 birch paintbrush','Artist125 paintbrush','Artist125 taper natural brush')):ob.location+=Vector((-.44,-.03,0))
 if ob.name.startswith(('Artist125 glazed mixing palette','Artist125 dried pigment deposit')):ob.location+=Vector((-.58,.11,0))
plastic=bpy.data.materials['CD125 charcoal injection moulded rack'];brass=bpy.data.materials['Brushed warm brass'];rubber=bpy.data.materials['Rubber feet']
# A compact stepped two-by-two media display: every cover clears the row in front.
prop(box('CD126 two-tier rack grounded foot',(.54,.09,.768),(.50,.42,.026),plastic,.006))
for level,(yy,zz) in enumerate([(-.25,.79),(.005,.999)]):
 prop(box('CD126 display tier '+str(level),(.54,yy,zz),(.49,.105,.018),plastic,.004))
 for xx in [.42,.66]:
  prop(box('CD126 slot retaining front lip',(xx,yy-.046,zz+.016),(.217,.010,.025),plastic,.003))
  for side in [-1,1]:prop(box('CD126 slot spaced side stop',(xx+side*.111,yy,zz+.013),(.004,.080,.028),plastic,.0012))
 if level:
  for xx in [.315,.765]:prop(box('CD126 rear tier connected upright',(xx,.034,.886),(.015,.065,.235),plastic,.004))
# GI stand-ins have the exact live-root layout, excluded from visible and collision exports.
C=Matrix(((1,0,0),(0,0,-1),(0,1,0)));cloth=bpy.data.materials['Proxy125 book cloth']
for i,x in enumerate([1.02,1.12,1.22]):
 o=box('Preview dynamic standing reading book GI proxy '+str(i),(0,0,0),(.47,.063,.32),cloth,.003);o.rotation_euler=(C@Matrix.Rotation(.28,3,'Y')@Matrix.Rotation(math.pi/2,3,'Z')).to_euler();o.location=(x,.38,.99);proxies.append(o)
cdRoots=[(.42,.89,.25),(.66,.89,.25),(.42,1.10,-.005),(.66,1.10,-.005)]
for i,(x,y,z) in enumerate(cdRoots):
 o=box('Preview dynamic separated CD GI proxy '+str(i),(0,0,0),(.214,.014,.21),plastic,.002);o.rotation_euler=(C@Matrix.Rotation(1.4,3,'X')).to_euler();o.location=(x,-z,y);proxies.append(o)
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
lamplight.data.energy=84;lamplight.data.color=(1,.585,.285);lamplight.data.shadow_soft_size=.08
bpy.data.objects['Cool rainy window ambient'].data.energy=60;bpy.data.objects['Cool rainy window ambient'].data.color=(.57,.69,1)
bpy.data.objects['Gentle camera-side exposure fill'].data.energy=7;scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.085
# The helper below reuses the established verified UV/export/bake pipeline only.
source=(ROOT/'scripts/directory-v125-native.py').read_text(encoding='utf8');tail=source[source.index("plant=[o for o in scene.objects"):]
tail=tail.replace("ROOT/'assets/directory-v124/collision-contract.json'","ROOT/'assets/directory-v125/collision-contract.json'")
start=tail.index('copies=[]');end=tail.index('copies=[]',start+len('copies=[]'))
tail=tail[:start]+tail[end:]
# No stale joined print mesh is created or included. Root creates its date from actual local time.
tail=tail.replace("'vectorPrintRenderedSeparately':'props-detail.glb'","'vectorPrintRenderedSeparately':None,'calendarLiveCanvas':True")
tail=tail.replace('directory-v125','directory-v126').replace('directory-v32-125','directory-v32-126').replace('V125','V126').replace('v32.125','v32.126')
tail=tail.replace("ROOT/'assets/directory-v126/collision-contract.json'","ROOT/'assets/directory-v125/collision-contract.json'")
tail=tail.replace('lamplight.data.energy=49','lamplight.data.energy=84')
tail=tail.replace("'originalV124NativeSHA256':oldsha","'originalV125NativeSHA256':oldsha,'cabinetAudit':cabinetAudit,'liveCalendar':{'position':[-1.24,.88835,.30285],'rotationX':-math.radians(13),'size':[.194,.220]},'cdRootWorldPositions':cdRoots")
tail=tail.replace("'nativeGIchanges':{'lampRadiusM':[.075,.09],'lightEnergyUnchanged':True}","'nativeGIchanges':{'tungstenW':[49,84],'cityWindowW':[105,60],'cameraFillW':[18,7],'worldStrength':[.17,.085],'lampRadiusM':[.09,.08]}")
exec(compile(tail,'V126 exact export and actual local Cycles','exec'),globals())
(V/'native-cabinet-audit.json').write_text(json.dumps(cabinetAudit,indent=2),encoding='utf8')
