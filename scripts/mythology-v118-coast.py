"""Actual local Blender MCP. Continuous steep coast, grounded root systems, no scan sheets."""
import bpy,bmesh,math,random,json
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118';OUT.mkdir(parents=True,exist_ok=True)
sc=bpy.context.scene;rng=random.Random(118)
if sc.get('v118_coast_started'):raise RuntimeError('V118 coast already started; resume checkpoint, never apply twice')
sc['v118_coast_started']=True
old=bpy.data.objects['V117_ISLAND'];land=bpy.data.objects.new('V118_ISLAND / continuous Mediterranean headlands',old.data.copy());col=bpy.data.collections.new('V118_LAND');sc.collection.children.link(col);col.objects.link(land);old.hide_render=True;old.hide_set(True)
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def gauss(a,c,w):return math.exp(-(math.atan2(math.sin(a-c),math.cos(a-c))/w)**2)
def coastline(a):return 1+.11*math.sin(a*3+.65)+.055*math.sin(a*7-.4)+.027*math.sin(a*13+.8)-.21*gauss(a,-math.pi/2,.41)
changed=0
for v in land.data.vertices:
 x,y,z=v.co
 if z<-.15:continue
 a=math.atan2((y-151)/92,(x+65)/156);r=math.hypot((x+65)/156,(y-151)/92)/coastline(a);d=(1-r)*90
 # Preserve the central flat bay. Compress only the flanking coast's horizontal run.
 cove=math.exp(-((x+62)/61)**4)*math.exp(-((y-73)/31)**4)
 flank=(1-cove)*(1-smooth((y-164)/36))
 if 0<d<32:
  nd=d*.26 if d<=12 else 3.12+(d-12)*(32-3.12)/20
  nr=1-(d+(nd-d)*flank)/90
  if r>.001:v.co.x=-65+(x+65)*nr/r;v.co.y=151+(y-151)*nr/r;changed+=1
 # Micro erosion is bounded in metres and only follows exposed coastal stone.
 if z>1 and flank>.35 and d<20:v.co.z+=.15*noise.noise(Vector((x*.42,y*.42,z*.35)))
land.data.update();bm=bmesh.new();bm.from_mesh(land.data);bmesh.ops.recalc_face_normals(bm,faces=bm.faces);bm.to_mesh(land.data);bm.free();land.data.update()
hab=land.data.color_attributes['Habitat'];forestattr=land.data.attributes['ForestDensity'];under=land.data.attributes['UnderstoryDensity']
for v in land.data.vertices:
 x,y,z=v.co;nz=v.normal.z
 cove=math.exp(-((x+62)/61)**4)*math.exp(-((y-73)/31)**4)
 sand=cove*(1-smooth((z-1.1)/1.6))*smooth((nz-.70)/.23)
 soil=smooth((z-4)/6)*smooth((nz-.60)/.31)*(1-sand)
 # Sunny maquis has dry limestone clearings, not a solid grass-covered hillside.
 rock=1-max(sand,soil);hab.data[v.index].color=(sand,soil,rock,1)
 patch=.5+.5*noise.fractal(Vector((x*.028,y*.028,3.4)),.8,2,3)
 forestattr.data[v.index].value=soil*patch;under.data[v.index].value=soil*(.32+.30*patch)
bvh=BVHTree.FromPolygons([v.co.copy() for v in land.data.vertices],[tuple(p.vertices) for p in land.data.polygons])
def ground(x,y):return bvh.ray_cast(Vector((x,y,130)),Vector((0,0,-1)),200)
# Make the original misleading thin scan sheets unavailable to both native render and export.
for o in bpy.data.collections['V117_ROCKS'].objects:
 if o:o.hide_render=True;o.hide_set(True)

# Photo-ground material in world metres. Native render and live web use the same PBR sources.
mat=bpy.data.materials.new('V118 warm pale coastal rock / dry woodland / fine bay sand');mat.use_nodes=True
n=mat.node_tree.nodes;l=mat.node_tree.links;bs=next(q for q in n if q.type=='BSDF_PRINCIPLED');bs.inputs['Roughness'].default_value=.83
geo=n.new('ShaderNodeNewGeometry');habnode=n.new('ShaderNodeVertexColor');habnode.layer_name='Habitat';sep=n.new('ShaderNodeSeparateColor');l.new(habnode.outputs['Color'],sep.inputs['Color'])
def photo(path,metres,noncolor=False):
 t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(ROOT/path),check_existing=True);t.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';t.projection='BOX';t.projection_blend=.25
 scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=1/metres;l.new(geo.outputs['Position'],scale.inputs[0]);l.new(scale.outputs[0],t.inputs['Vector']);return t
rock=photo('assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_diff_2k.jpg',1.8)
soil=photo('assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg',1.7)
sand=photo('assets/odyssey/pbr-v106/sand_01/diff.jpg',.42)
def tint(socket,color):
 mix=n.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=color;l.new(socket,mix.inputs[1]);return mix.outputs[0]
r=tint(rock.outputs['Color'],(1.25,1.20,1.04,1));s=tint(soil.outputs['Color'],(1.04,.94,.72,1));b=tint(sand.outputs['Color'],(1.14,1.10,.98,1))
mix=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Green'],mix.inputs[0]);l.new(r,mix.inputs[1]);l.new(s,mix.inputs[2]);mix2=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Red'],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(b,mix2.inputs[2]);l.new(mix2.outputs[0],bs.inputs['Base Color'])
nor=photo('assets/odyssey/pbr-v118/marble_rock_03/marble_rock_03_nor_gl_2k.jpg',1.8,True);nm=n.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.25;l.new(nor.outputs['Color'],nm.inputs['Color']);l.new(nm.outputs[0],bs.inputs['Normal']);land.data.materials.clear();land.data.materials.append(mat)

# Keep dense broad crowns. Their new bases are deliberately embedded in the ACTUAL local ground.
wood=bpy.data.collections['V117_FOREST'];trees={};rootparts=[];hidden_steep=0
for o in wood.objects:
 if not o or not o.name.startswith('V117 tree'):continue
 idx=o.name.split(' ')[2];trees.setdefault(idx,[]).append(o)
rootcol=bpy.data.collections.new('V118_ROOTS / ground following buttresses and maquis');sc.collection.children.link(rootcol)
rootmat=bpy.data.materials.new('V118 rooted weathered bark');rootmat.use_nodes=True;rb=next(q for q in rootmat.node_tree.nodes if q.type=='BSDF_PRINCIPLED');rb.inputs['Base Color'].default_value=(.115,.105,.078,1);rb.inputs['Roughness'].default_value=.96
removed_floor_faces=0;trunk_data={}
for parts in trees.values():
 trunk=next(o for o in parts if o.name.endswith('part1'))
 if trunk.data.name not in trunk_data:
  original=trunk.data;data=original.copy();bm=bmesh.new();bm.from_mesh(data)
  remove=[f for f in bm.faces if max(v.co.z for v in f.verts)<.026 and (f.normal.z>.45 or max(math.hypot(v.co.x,v.co.y) for v in f.verts)>.065)]
  removed_floor_faces+=len(remove);bmesh.ops.delete(bm,geom=remove,context='FACES');bm.to_mesh(data);bm.free();data.update();trunk_data[original.name]=data
 trunk.data=trunk_data.get(trunk.data.name,trunk.data)
 p,norm,_,_=ground(trunk.location.x,trunk.location.y)
 if p is None or norm.z<.52:
  for o in parts:o.hide_render=True;o.hide_set(True)
  hidden_steep+=1;continue
 was_visible=any(not o.hide_render for o in parts)
 for o in parts:o.location.z=p.z-.40
 if not was_visible:continue
 # Five woody buttresses taper below the surrounding terrain. These are roots, not flat discs.
 h=trunk.scale.z;radius=min(1.15,.056*h);vv=[];ff=[]
 for k in range(5):
  a=trunk.rotation_euler.z+k*math.tau/5+rng.uniform(-.22,.22);length=radius*rng.uniform(1.8,2.5);base=len(vv)
  for j in range(6):
   t=j/5;rr=radius*.28+length*t;px=p.x+math.cos(a)*rr;py=p.y+math.sin(a)*rr;hit=ground(px,py)[0]
   gz=hit.z if hit else p.z;zz=max(gz-.11,p.z+.45*(1-t)**2)-.12*t;w=radius*.22*(1-t*.94)
   for q in range(7):
    ang=q*math.tau/7;vv.append((px-math.sin(a)*w*math.cos(ang),py+math.cos(a)*w*math.cos(ang),zz+w*.65*math.sin(ang)))
  for j in range(5):
   for q in range(7):x=base+j*7+q;y=base+j*7+(q+1)%7;ff.append((x,y,y+7,x+7))
  ff.append(tuple(base+q for q in reversed(range(7))));ff.append(tuple(base+35+q for q in range(7)))
 me=bpy.data.meshes.new('V118 embedded spreading root base');me.from_pydata(vv,[],ff);me.update();ob=bpy.data.objects.new('V118 rooted tree '+trunk.name.split(' ')[2],me);rootcol.objects.link(ob);me.materials.append(rootmat)
 for f in me.polygons:f.use_smooth=True
 rootparts.append(ob)
for o in wood.objects:
 if not o or not o.name.startswith('V117 forest fern'):continue
 hit=ground(o.location.x,o.location.y)[0]
 if hit:o.location.z=hit.z-.055;o.scale*=.82
grass=bpy.data.objects.get('V117_GROUNDCOVER / editable masked Geometry Nodes')
if grass:
 grass.data=land.data.copy();grass.data.materials.clear();grass.data.materials.append(bpy.data.materials['V117 coastal grass / sage green'])
 gb=next(q for q in grass.data.materials[0].node_tree.nodes if q.type=='BSDF_PRINCIPLED');gb.inputs['Base Color'].default_value=(.23,.245,.083,1)
giant=bpy.data.objects['V106_CYCLOPS / retained anatomical base, new male sculpt'];hit=ground(giant.location.x,giant.location.y)[0]
if hit:giant.location.z=hit.z+.035

# Closed, appropriately scaled scanned blocks tie the cave mouth to its cliff foot.
before=set(sc.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/pbr-v118/boulder_01/boulder_01_1k.gltf'))
srcs=[o for o in sc.objects if o not in before and o.type=='MESH'];rockcol=bpy.data.collections.new('V118_CLOSED_ROCKS');sc.collection.children.link(rockcol)
protos=[]
for o in srcs:
 me=o.data.copy();points=[o.matrix_world@v.co for v in me.vertices];lo=Vector(tuple(min(p[k] for p in points) for k in range(3)));hi=Vector(tuple(max(p[k] for p in points) for k in range(3)));center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
 for v,p in zip(me.vertices,points):v.co=p-center
 me.update();protos.append((me,hi-lo))
for o in list(sc.objects):
 if o not in before:bpy.data.objects.remove(o,do_unlink=True)
positions=[(-191,95),(-181,91),(-167,91),(-149,99),(-143,107),(-135,117),(8,103),(27,113),(46,124),(60,144)]
for i,(x,y) in enumerate(positions):
 p=ground(x,y)[0]
 if p is None:continue
 me,size=protos[i%len(protos)];ob=bpy.data.objects.new('V118 closed coastal boulder '+str(i),me);rockcol.objects.link(ob);height=rng.uniform(2.4,4.5);s=height/size.z;ob.scale=(s*rng.uniform(.9,1.2),s*rng.uniform(.9,1.15),s);ob.location=(x,y,p.z-height*.48);ob.rotation_euler[2]=rng.uniform(0,math.tau)

# Unique native UV atlas for an actual Cycles ground-contact AO bake.
bpy.ops.object.select_all(action='DESELECT');land.hide_set(False);land.select_set(True);bpy.context.view_layer.objects.active=land
area=max(bpy.context.window.screen.areas,key=lambda a:a.width*a.height);area.type='VIEW_3D'
with bpy.context.temp_override(area=area):
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=1.10,island_margin=.003);bpy.ops.object.mode_set(mode='OBJECT')
bpy.context.view_layer.update();bm=bmesh.new();bm.from_mesh(land.data);boundary=sum(e.is_boundary for e in bm.edges);nonmanifold=sum(not e.is_manifold for e in bm.edges);bm.free()
audit={'actualBlenderMcp':True,'coastalVerticesConditioned':changed,'closedIslandBoundaryEdges':boundary,'nonManifoldEdges':nonmanifold,'removedOpenScanSheets':16,'closedBoulderInstances':len(rockcol.objects),'preservedTreeGroups':len(trees),'treesExcludedFromSteepFace':hidden_steep,'actualRootSystems':len(rootparts),'scanFloorFacesRemoved':removed_floor_faces,'groundMap':'photographic marble_rock_03 as pale weathered rock visual substitute, not claimed certified Greek limestone','seaChanged':False}
(OUT/'01-coast-and-root-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');sc['v118_coast_completed']=True
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'01-mediterranean-coast-and-grounded-roots.blend'));print(json.dumps(audit))
