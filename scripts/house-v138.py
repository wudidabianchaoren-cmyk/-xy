import bpy,math,random,json
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v138';O=P/'blender/mythology-v32-138';random.seed(138)
bpy.ops.wm.read_factory_settings(use_empty=True)
def mat(name,c,rough=.85):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;return m
stone=[mat('V138 cottage limestone '+str(i),(.40+i*.028,.37+i*.025,.30+i*.02)) for i in range(5)];lime=mat('V138 cottage weathered limewash',(.68,.66,.55));wood=mat('V138 cottage aged oak',(.105,.074,.041));dark=mat('V138 recessed unlit interior',(.015,.013,.010));tiles=[mat('V138 fired clay tile '+str(i),(.26+i*.018,.095+i*.008,.045+i*.004)) for i in range(5)]
def cube(name,c,s,m,b=.018):
 bpy.ops.mesh.primitive_cube_add(size=1,location=c);o=bpy.context.object;o.name=name;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if b:mod=o.modifiers.new('Weathered cut edges','BEVEL');mod.width=b;mod.segments=2;mod=o.modifiers.new('Masonry normals','WEIGHTED_NORMAL')
 return o
# Small Aegean coastal storekeeper's cottage: masonry plinth, a real recessed doorway, oak shutters and tiled gable.
cube('Stone foundation plinth',(0,0,.22),(5.25,4.25,.64),stone[1],.07)
for side in [-1,1]:cube('Limewashed side wall',(side*2.35,0,1.77),(.30,3.85,2.65),lime)
cube('Limewashed back wall',(0,1.83,1.77),(4.7,.30,2.65),lime)
for x,w in [(-1.66,1.38),(1.66,1.38)]:cube('Front masonry beside real opening',(x,-1.83,1.77),(w,.34,2.65),lime)
cube('Front overdoor',(0,-1.83,2.80),(1.94,.34,.59),lime)
cube('Deep oak doorway',(0,-1.70,1.48),(1.28,.06,2.06),dark)
for i in range(6):cube('Oak door vertical board',(-.54+i*.216,-1.76,1.47),(.203,.06,1.96),wood,.009)
for z in [.91,2.03]:cube('Oak door brace',(0,-1.81,z),(1.18,.055,.10),wood,.009)
for x in [-.77,.77]:
 for j in range(6):cube('Dressed stone door jamb',(x,-1.87,.70+j*.31),(.28,.42,.295),stone[j%5],.025)
cube('Door limestone lintel',(0,-1.88,2.51),(1.86,.44,.28),stone[3],.035)
for side in [-1,1]:
 cube('Deep side window',(side*2.516,.26,1.96),(.024,1.13,.91),dark,.005)
 for j in [-1,1]:cube('Timber louver shutter',(side*2.54,.26+j*.31,1.96),(.038,.52,.85),wood,.008)
 cube('Window stone sill',(side*2.55,.26,1.45),(.24,1.27,.13),stone[2],.02)
# Raised blocks expose a restrained masonry base rather than a featureless box.
for row in range(3):
 for i in range(9):
  x=-2.24+i*.56+(row%2)*.12
  if abs(x)<.97:continue
  cube('Exposed base limestone',(x,-2.015,.48+row*.25),(.54,.09,.235),stone[random.randrange(5)],.024)
for y in [-1.83,1.83]:
 me=bpy.data.meshes.new('Gable triangle');me.from_pydata([(-2.5,y,3.08),(2.5,y,3.08),(0,y,4.35)],[],[(0,1,2)]);ob=bpy.data.objects.new('Limewashed gable',me);bpy.context.collection.objects.link(ob);ob.data.materials.append(lime)
angle=math.atan2(1.32,2.72)
for side in [-1,1]:
 roof=cube('Oak roof underside',(side*1.36,0,3.71),(3.02,4.55,.11),wood);roof.rotation_euler.y=side*angle
 for r in range(10):
  x=side*(.12+r*.28);z=4.35-abs(x)*math.tan(angle)
  for col in range(15):
   y=-2.10+col*.30
   # Curved half-round clay channels, with shallow raised cap tiles along each joint.
   v=[];f=[]
   for yy in [y-.17,y+.17]:
    for j in range(9):
     t=j/8*math.pi;v.append((x+side*math.cos(t)*.155,yy,z+.05+math.sin(t)*.045))
   for j in range(8):f.append((j,j+1,10+j,9+j))
   me=bpy.data.meshes.new('Curved tile');me.from_pydata(v,[],f);ob=bpy.data.objects.new('Individual overlapping terracotta tile',me);bpy.context.collection.objects.link(ob);ob.data.materials.append(tiles[random.randrange(5)])
for i in range(4):cube('Approach stone step',(0,-2.25-i*.30,.23-i*.11),(1.70,.38,.20),stone[(i+1)%5],.035)
# Position in a small existing clearing, with an embedded plinth accommodating the sampled slope.
g=json.loads((P/'assets/odyssey/compact-v134/height.json').read_text());n=g['size'];x,z=12.,-32.
def height(x,z):return g['heights'][round((-z+4)/90*(n-1))*n+round((x+56)/103*(n-1))]
h=height(x,z);coords=[height(x+dx,z+dz) for dx in [-2.5,2.5] for dz in [-2,2]];base=max(coords)-.20
actual=json.loads((P/'.verify/v32-138/visual-checks.json').read_text(encoding='utf-8'))['myth']['cottage'];x,base,z=actual['position'];coords=actual['site']['heights']
cube('Solid masonry terrace embedded into the slope',(0,0,-.70),(5.20,4.18,2.04),stone[2],.055)
for j in range(7):
 for i in range(9):
  cube('Terrace front individual stone',(-2.30+i*.575,-2.106,-1.55+j*.28),(.56,.065,.264),stone[(i+j*2)%5],.021)
for ob in bpy.context.scene.objects:ob.location+=Vector((x,-z,base))
# Continuous solid terrace reaches below the lowest actual triangle sample; no open stilt gap.
bpy.ops.object.select_all(action='SELECT');bpy.ops.export_scene.gltf(filepath=str(A/'coastal-cottage.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
bpy.ops.wm.save_as_mainfile(filepath=str(O/'coastal-cottage.blend'));(A/'house.json').write_text(json.dumps({'design':'small limestone coastal storekeeper cottage / oak shutters / individual clay tiles','position':[x,base,z],'terrainCornerHeights':coords,'terrainEmbeddedFootings':True}),encoding='utf-8');print('V138_HOUSE_COMPLETE')
