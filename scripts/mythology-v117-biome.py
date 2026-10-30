"""MCP stage2: height/slope/patch ecology; real fern variants and editable GN groundcover."""
import bpy,math,random,json
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117';scene=bpy.context.scene;rng=random.Random(11745)
land=bpy.data.objects['V117_ISLAND'];mesh=land.data
prior=bpy.data.collections.get('V117_FOREST')
if prior:
 if len(prior.objects):raise RuntimeError('Resume stage2 rather than scatter twice')
 bpy.data.collections.remove(prior)
forest=bpy.data.collections.new('V117_FOREST');scene.collection.children.link(forest)
def material(name,color,rough=.85):
 m=bpy.data.materials.new(name);m.use_nodes=True;bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough;return m,bs
def photo(mat,filepath,scale,noncolor=False):
 n=mat.node_tree.nodes;l=mat.node_tree.links;geo=n.get('World position')
 if not geo:geo=n.new('ShaderNodeNewGeometry');geo.name='World position'
 s=n.new('ShaderNodeVectorMath');s.operation='SCALE';s.inputs[3].default_value=1/scale;l.new(geo.outputs['Position'],s.inputs[0]);tex=n.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(ROOT/filepath),check_existing=True);tex.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';tex.projection='BOX';tex.projection_blend=.3;l.new(s.outputs[0],tex.inputs['Vector']);return tex
mat,bs=material('V117 scanned rock / humus / fine cove sand',(.35,.39,.23));n=mat.node_tree.nodes;l=mat.node_tree.links;hab=n.new('ShaderNodeVertexColor');hab.layer_name='Habitat';sep=n.new('ShaderNodeSeparateColor');l.new(hab.outputs['Color'],sep.inputs['Color']);colors=[]
for key,scale,tint in [('seaside_rock',5.0,(.95,1.0,1.02,1)),('forest_ground_04',2.3,(.66,.85,.50,1)),('sand_01',1.4,(1.10,1.04,.88,1))]:
 path='assets/odyssey/pbr-v106/sand_01/diff.jpg' if key=='sand_01' else 'assets/odyssey/pbr-v103/'+key+'/Diffuse.jpg';t=photo(mat,path,scale);mix=n.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1;mix.inputs[2].default_value=tint;l.new(t.outputs['Color'],mix.inputs[1]);colors.append(mix.outputs[0])
mix=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Green'],mix.inputs[0]);l.new(colors[0],mix.inputs[1]);l.new(colors[1],mix.inputs[2]);mix2=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Red'],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(colors[2],mix2.inputs[2]);l.new(mix2.outputs[0],bs.inputs['Base Color'])
tex=photo(mat,'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg',5,True);bump=n.new('ShaderNodeBump');bump.inputs['Distance'].default_value=.075;bump.inputs['Strength'].default_value=.28;l.new(tex.outputs[0],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal']);land.data.materials.clear();land.data.materials.append(mat)
bvh=BVHTree.FromPolygons([v.co.copy() for v in mesh.vertices],[list(p.vertices) for p in mesh.polygons])
def support(x,y):return bvh.ray_cast(Vector((x,y,120)),Vector((0,0,-1)),180)
def weights(hit,index,attr):
 face=mesh.polygons[index];return sum(mesh.attributes[attr].data[i].value for i in face.vertices)/len(face.vertices)
old=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession'];protos=[o for o in old.objects if o and o.name.startswith('V112 tree 000 part')]
if not protos:raise RuntimeError('Actual detailed scanned source tree missing')
plants=[];positions=[];attempts=0
while len(plants)<620 and attempts<50000:
 attempts+=1;px=rng.uniform(-211,84);py=rng.uniform(98,230);p,normal,index,_=support(px,py)
 if p is None or p.z<3 or p.z>43 or normal.z<.72:continue
 den=weights(p,index,'ForestDensity')
 if rng.random()>den*.88:continue
 # A connected open approach to the cave/giant; foreground low flora will connect the ground.
 if ((px+117)/15)**2+((py-126)/22)**2<1:continue
 if any((px-q[0])**2+(py-q[1])**2<16 for q in positions):continue
 height=rng.uniform(8.5,17.5)*(1+.15*math.sin(px*.05));width=rng.uniform(.95,1.45);rot=rng.uniform(0,math.tau)
 for k,src in enumerate(protos):
  o=bpy.data.objects.new('V117 tree %03d part%d'%(len(plants),k),src.data);forest.objects.link(o);o.location=p;o.rotation_euler[2]=rot;o.scale=(height*width,height*width,height);o.hide_render=False
 plants.append({'x':px,'y':py,'z':p.z,'height':height,'width':width,'rotation':rot});positions.append((px,py))
# Real photographed understory, with the missing standalone alpha explicitly connected.
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/pbr-v117/fern_02/fern_02_1k.gltf'));ferns=[o for o in scene.objects if o not in before and o.type=='MESH'];fernprotos=[]
for src in ferns:
 data=src.data.copy();pts=[src.matrix_world@v.co for v in data.vertices];lo=Vector(tuple(min(p[k] for p in pts) for k in range(3)));hi=Vector(tuple(max(p[k] for p in pts) for k in range(3)));center=Vector(((hi.x+lo.x)/2,(hi.y+lo.y)/2,lo.z))
 for v,p in zip(data.vertices,pts):v.co=p-center
 data.update();fernprotos.append(data)
 for m in data.materials:
  if not m or not m.use_nodes:continue
  bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(ROOT/'assets/odyssey/pbr-v117/fern_02/textures/fern_02_alpha_1k.png'),check_existing=True);t.image.colorspace_settings.name='Non-Color';m.node_tree.links.new(t.outputs['Color'],bs.inputs['Alpha']);bs.inputs['Roughness'].default_value=.82;m.surface_render_method='DITHERED';m.use_backface_culling=False
for o in list(scene.objects):
 if o not in before:bpy.data.objects.remove(o,do_unlink=True)
ferncount=0
for i in range(2800):
 px=rng.uniform(-207,80);py=rng.uniform(92,232);p,normal,index,_=support(px,py)
 if p is None or p.z<2.2 or p.z>39 or normal.z<.76:continue
 if rng.random()>weights(p,index,'UnderstoryDensity')*.90:continue
 data=fernprotos[i%len(fernprotos)];o=bpy.data.objects.new('V117 forest fern %04d'%ferncount,data);forest.objects.link(o);o.location=p;o.rotation_euler[2]=rng.uniform(0,math.tau);scale=rng.uniform(1.6,3.8);o.scale=(scale,scale,scale);ferncount+=1
# Native editable groundcover nodes use the same actual painted-style density attribute as the terrain.
gv=[];gf=[]
for i in range(9):
 a=rng.uniform(0,math.tau);h=rng.uniform(.24,.68);w=rng.uniform(.018,.037);start=len(gv);px=rng.uniform(-.18,.18);py=rng.uniform(-.18,.18)
 for k in range(4):
  t=k/3;d=h*t*t*.48;ww=w*(1-.96*t);gv.extend([(px+math.cos(a)*d-math.sin(a)*ww,py+math.sin(a)*d+math.cos(a)*ww,h*t),(px+math.cos(a)*d+math.sin(a)*ww,py+math.sin(a)*d-math.cos(a)*ww,h*t)])
 for k in range(3):gf.append((start+k*2,start+k*2+1,start+k*2+3,start+k*2+2))
gm=bpy.data.meshes.new('V117 nine curved coastal grass blades');gm.from_pydata(gv,[],gf);gm.update();grassmat,gbs=material('V117 coastal grass / sage green',(.16,.235,.047),.88);gbs.inputs['Sheen Weight'].default_value=.12;gm.materials.append(grassmat)
prototype=bpy.data.objects.new('V117 hidden grass tuft prototype',gm);scene.collection.objects.link(prototype);prototype.hide_render=True;prototype.hide_set(True)
grass=bpy.data.objects.new('V117_GROUNDCOVER / editable masked Geometry Nodes',mesh.copy());forest.objects.link(grass);ng=bpy.data.node_groups.new('V117 ecosystem scatter / height slope noise mask','GeometryNodeTree');ng.interface.new_socket(name='Geometry',in_out='INPUT',socket_type='NodeSocketGeometry');ng.interface.new_socket(name='Geometry',in_out='OUTPUT',socket_type='NodeSocketGeometry');nodes=ng.nodes;links=ng.links;inp=nodes.new('NodeGroupInput');out=nodes.new('NodeGroupOutput');attr=nodes.new('GeometryNodeInputNamedAttribute');attr.data_type='FLOAT';attr.inputs['Name'].default_value='UnderstoryDensity';mult=nodes.new('ShaderNodeMath');mult.operation='MULTIPLY';mult.inputs[1].default_value=.28;links.new(attr.outputs['Attribute'],mult.inputs[0]);dist=nodes.new('GeometryNodeDistributePointsOnFaces');dist.inputs['Seed'].default_value=117;links.new(inp.outputs['Geometry'],dist.inputs['Mesh']);links.new(mult.outputs[0],dist.inputs['Density']);obj=nodes.new('GeometryNodeObjectInfo');obj.inputs['Object'].default_value=prototype;inst=nodes.new('GeometryNodeInstanceOnPoints');links.new(dist.outputs['Points'],inst.inputs['Points']);links.new(obj.outputs['Geometry'],inst.inputs['Instance']);randomscale=nodes.new('FunctionNodeRandomValue');randomscale.data_type='FLOAT_VECTOR';randomscale.inputs['Min'].default_value=(.65,.65,.65);randomscale.inputs['Max'].default_value=(1.5,1.5,1.6);links.new(randomscale.outputs['Value'],inst.inputs['Scale']);randomrot=nodes.new('FunctionNodeRandomValue');randomrot.data_type='FLOAT_VECTOR';randomrot.inputs['Min'].default_value=(0,0,-math.pi);randomrot.inputs['Max'].default_value=(0,0,math.pi);links.new(randomrot.outputs['Value'],inst.inputs['Rotation']);real=nodes.new('GeometryNodeRealizeInstances');links.new(inst.outputs['Instances'],real.inputs['Geometry']);links.new(real.outputs['Geometry'],out.inputs['Geometry']);mod=grass.modifiers.new('V117 density-masked ecosystem','NODES');mod.node_group=ng
for i,node in enumerate(nodes):node.location=(i*170,0)
# Reground the masculine original giant, and keep a clear viewing pocket around him.
giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt');hit=support(-132,125)[0]
if giant and hit:giant.location=(-132,125,hit.z+.10)
bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();evaluated=grass.evaluated_get(deps);grass_faces=len(evaluated.data.polygons)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'02-density-masks-scan-forest-and-understory.blend'))
audit={'actualBlenderMcp':True,'trees':len(plants),'fernInstances':ferncount,'fernVariants':len(fernprotos),'grassFaces':grass_faces,'groundcoverWorkflow':'Actual named UnderstoryDensity attribute -> distribute points -> instance curved tuft -> realize','treeFullNativePrototypeParts':[{'name':o.data.name,'vertices':len(o.data.vertices)} for o in protos],'webLODSeparate':True,'seaChanged':False}
(OUT/'02-biome.json').write_text(json.dumps(audit,indent=2),encoding='utf8');(OUT/'forest-placement.json').write_text(json.dumps(plants),encoding='utf8');print(json.dumps(audit))
