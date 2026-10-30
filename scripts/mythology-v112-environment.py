import bpy,bmesh,math,json,random
from pathlib import Path
from mathutils import Vector,noise
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112'
scene=bpy.context.scene;rng=random.Random(1121829)
island=bpy.data.objects.get('V112_ISLAND / continuous bedrock, shallow bay, inland ridge')
if not island:raise RuntimeError('V112 white model must exist first')
def material(name,color,rough=.85):
 m=bpy.data.materials.new(name);m.use_nodes=True;bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Roughness'].default_value=rough;return m,bs
def photo(nt,path,scale,noncolor=False):
 n=nt.nodes;l=nt.links;geo=n.get('Texture geometry')
 if not geo:geo=n.new('ShaderNodeNewGeometry');geo.name='Texture geometry'
 s=n.new('ShaderNodeVectorMath');s.operation='SCALE';s.inputs[3].default_value=1/scale;l.new(geo.outputs['Position'],s.inputs[0])
 t=n.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(ROOT/path),check_existing=True);t.image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB';t.projection='BOX';t.projection_blend=.28;l.new(s.outputs[0],t.inputs['Vector']);return t
ground,bs=material('V112 photographed limestone / soil / fine sand',(.5,.45,.34));n=ground.node_tree.nodes;l=ground.node_tree.links
hab=n.new('ShaderNodeVertexColor');hab.layer_name='Habitat';sep=n.new('ShaderNodeSeparateColor');l.new(hab.outputs['Color'],sep.inputs['Color'])
layers=[]
for key,scale,fac in [('seaside_rock',6.5,(1.10,1.10,1.02,1)),('forest_ground_04',2.8,(.65,.79,.55,1)),('sand_01',1.3,(1.0,1.0,.94,1))]:
 path='assets/odyssey/pbr-v106/sand_01/diff.jpg' if key=='sand_01' else 'assets/odyssey/pbr-v103/'+key+'/Diffuse.jpg'
 t=photo(ground.node_tree,path,scale);color=n.new('ShaderNodeMixRGB');color.blend_type='MULTIPLY';color.inputs[0].default_value=1;color.inputs[2].default_value=fac;l.new(t.outputs['Color'],color.inputs[1]);layers.append(color.outputs[0])
mix=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Green'],mix.inputs[0]);l.new(layers[0],mix.inputs[1]);l.new(layers[1],mix.inputs[2]);mix2=n.new('ShaderNodeMixRGB');l.new(sep.outputs['Red'],mix2.inputs[0]);l.new(mix.outputs[0],mix2.inputs[1]);l.new(layers[2],mix2.inputs[2]);l.new(mix2.outputs[0],bs.inputs['Base Color'])
h=photo(ground.node_tree,'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg',6.5,True);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.38;bump.inputs['Distance'].default_value=.12;l.new(h.outputs['Color'],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
island.data.materials.clear();island.data.materials.append(ground)
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons])
def support(x,y):return bvh.ray_cast(Vector((x,y,130)),Vector((0,0,-1)),180)
# Real photogrammetric cliff module: preserve scanned colour, UV and crevices.
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/coastal_cliff_02/coastal_cliff_02.web.gltf'))
imported=[o for o in scene.objects if o not in before];parts=[o for o in imported if o.type=='MESH']
rockcol=bpy.data.collections.new('V112_ROCKS / scanned cliff assemblies');scene.collection.children.link(rockcol)
rockprotos=[]
for src in parts:
 coords=[src.matrix_world@v.co for v in src.data.vertices];low=Vector(tuple(min(p[i] for p in coords) for i in range(3)));high=Vector(tuple(max(p[i] for p in coords) for i in range(3)));size=high-low;center=Vector(((low.x+high.x)/2,(low.y+high.y)/2,low.z))
 data=src.data.copy()
 for v,p in zip(data.vertices,coords):v.co=Vector(((p.x-center.x)/max(size.x,.01),(p.y-center.y)/max(size.y,.01),(p.z-center.z)/max(size.z,.01)))
 data.update();rockprotos.append(data)
for o in imported:bpy.data.objects.remove(o,do_unlink=True)
placements=[]
# Main limestone shoulders frame the open bay rather than gravel scattered across sand.
for i,(x,y,w,d,h,z) in enumerate([(-207,112,30,27,28,2),(-188,98,31,28,30,-1),(-174,115,28,28,26,5),(-143,111,25,24,23,2),(-126,118,26,24,18,3),(-201,143,30,29,23,15),(-163,155,27,27,25,16),(33,104,28,25,23,0),(57,115,31,27,27,0),(78,144,28,30,30,-1),(63,170,33,31,23,8),(-112,208,28,25,24,27),(-83,214,30,26,22,28),(-10,206,28,25,21,21)]):
 for k,data in enumerate(rockprotos):
  o=bpy.data.objects.new('V112 cliff assembly %02d part%d'%(i,k),data);rockcol.objects.link(o);o.location=(x,y,z);o.scale=(w,d,h);o.rotation_euler[2]=rng.uniform(-.32,.32)+(.35 if i%3==0 else 0);placements.append(o)
  for m in o.data.materials:
   if not m or not m.use_nodes:continue
   p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
   if p:p.inputs['Roughness'].default_value=.8
 # Four different silhouette profiles arise from unequal scale, mirror and attitude, shared scanned topology.
 if i%4==2:
  for o in placements[-len(rockprotos):]:o.scale.x*=-1
# Tree prototype uses a middle LOD; the previous 4.5k-triangle tree destroyed most of the canopy.
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/vegetation-v104/island_tree_01/island_tree_01_1k.gltf'))
imported=[o for o in scene.objects if o not in before];trees=[o for o in imported if o.type=='MESH'];points=[o.matrix_world@v.co for o in trees for v in o.data.vertices];lo=Vector(tuple(min(p[k] for p in points) for k in range(3)));hi=Vector(tuple(max(p[k] for p in points) for k in range(3)));th=hi.z-lo.z;center=Vector(((hi.x+lo.x)/2,(hi.y+lo.y)/2,lo.z))
protos=[]
for src in trees:
 bpy.ops.object.select_all(action='DESELECT');src.select_set(True);bpy.context.view_layer.objects.active=src
 tri=sum(len(p.vertices)-2 for p in src.data.polygons);limit=20000 if 'leaves' in src.active_material.name.lower() else 4000
 if tri>limit:
  dec=src.modifiers.new('Balanced canopy LOD, retain substantially more leaf surface','DECIMATE');dec.ratio=limit/tri;bpy.ops.object.modifier_apply(modifier=dec.name)
 data=src.data.copy();matrix=src.matrix_world.copy()
 for v in data.vertices:v.co=(matrix@v.co-center)/th
 data.update();protos.append(data)
 for m in data.materials:
  if not m or not m.use_nodes:continue
  p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if p:p.inputs['Roughness'].default_value=.88
  if 'leaves' in m.name:
   # glTF-compatible thin leaf shading, photographed alpha and backfaces retained.
   p.inputs['Subsurface Weight'].default_value=.06;p.inputs['Subsurface Radius'].default_value=(.12,.22,.05);m.use_backface_culling=False
for o in imported:bpy.data.objects.remove(o,do_unlink=True)
forest=bpy.data.collections.new('V112_FOREST / clustered canopy and shrub succession');scene.collection.children.link(forest)
plant=[];trunks=[];attempts=0
while len(plant)<168 and attempts<15000:
 attempts+=1;x=rng.uniform(-210,80);y=rng.uniform(105,225);p,n,_,_=support(x,y)
 if p is None or p.z<4 or p.z>40 or n.z<.80:continue
 if ((x+156)/24)**2+((y-101)/28)**2<1:continue
 patch=noise.fractal(Vector((x*.035,y*.035,3)),.8,2,3)
 if patch<-.05 or any((x-a[0])**2+(y-a[1])**2<45 for a in trunks):continue
 h=rng.uniform(8,15);rotation=rng.uniform(0,math.tau);width=rng.uniform(.80,1.17)
 for k,data in enumerate(protos):
  o=bpy.data.objects.new('V112 tree %03d part%d'%(len(plant),k),data);forest.objects.link(o);o.location=p;o.rotation_euler[2]=rotation;o.scale=(h*width,h*width,h)
 plant.append({'x':x,'y':p.z,'z':-y,'blenderY':y,'height':h,'rotation':rotation,'width':width});trunks.append((x,y))
# Small shrub groups occupy forest margins, not a second equally spaced row of trees.
shrubs=0
for i in range(220):
 x=rng.uniform(-205,78);y=rng.uniform(95,220);p,n,_,_=support(x,y)
 if p is None or not 3<p.z<30 or n.z<.82:continue
 if noise.fractal(Vector((x*.045,y*.045,8)),.8,2,3)<.12:continue
 h=rng.uniform(.75,2.1)
 for k,data in enumerate(protos):
  o=bpy.data.objects.new('V112 shrub %03d part%d'%(shrubs,k),data);forest.objects.link(o);o.location=p;o.rotation_euler[2]=rng.uniform(0,math.tau);o.scale=(h*1.25,h*1.25,h)
 shrubs+=1
# Broad, curved, tapered grass leaves, merged into one mesh for a connected woodland floor.
gv=[];gf=[];grasscount=0
for i in range(6500):
 x=rng.uniform(-210,85);y=rng.uniform(87,226);p,n,_,_=support(x,y)
 if p is None or not 3.2<p.z<34 or n.z<.82:continue
 if noise.fractal(Vector((x*.075,y*.075,4)),.8,2,2)<-.05:continue
 for j in range(4):
  a=rng.uniform(0,math.tau);h=rng.uniform(.18,.48);w=rng.uniform(.025,.045);start=len(gv);d=Vector((math.cos(a),math.sin(a),0));perp=Vector((-d.y,d.x,0))
  for k in range(4):
   u=k/3;mid=p+d*h*u*u*.6+Vector((0,0,h*u));ww=w*(1-u*.94);gv.extend([tuple(mid-perp*ww),tuple(mid+perp*ww)])
  for k in range(3):gf.append((start+k*2,start+k*2+1,start+k*2+3,start+k*2+2))
  grasscount+=1
gm=bpy.data.meshes.new('V112 curved woodland floor leaves');gm.from_pydata(gv,[],gf);gm.update();grass=bpy.data.objects.new('V112_GROUNDCOVER / connected woodland and coastal plants',gm);forest.objects.link(grass)
gmat,gbs=material('V112 sage and olive coastal grasses',(.115,.16,.045),.93);gm.materials.append(gmat)
# The one-eyed giant remains an anatomical model, re-grounded; a rough asymmetric hide covers the pelvis.
giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
if giant:
 p,n,_,_=support(-115,137)
 if p:giant.location=(-115,137,p.z+.10)
 giant.hide_render=False;giant.hide_set(False)
 for o in giant.children_recursive:
  if not any(w in o.name.lower() for w in ['nipple','tunic','mantle','sleeve','belt']):o.hide_render=False;o.hide_set(False)
 skirtv=[];skirtf=[]
 for row in range(3):
  for i in range(64):
   a=i/64*math.tau;r=.185+row*.015;z=.91-row*.13-(.035*math.sin(a*7) if row==2 else 0);skirtv.append((math.cos(a)*r,math.sin(a)*r*.72,z))
 for row in range(2):
  for i in range(64):a=row*64+i;b=row*64+(i+1)%64;skirtf.append((a,b,b+64,a+64))
 hide=bpy.data.meshes.new('V112 draped hide wrap');hide.from_pydata(skirtv,[],skirtf);hide.update();o=bpy.data.objects.new('V112 cyclops rough hide waist wrap',hide);scene.collection.objects.link(o);o.parent=giant
 leather,lbs=material('V112 rough hide',(.095,.061,.031),.94);hide.materials.append(leather);solid=o.modifiers.new('Hide thickness','SOLIDIFY');solid.thickness=.005
# Unified lighting. Reuse the installed HDRI only as illumination; hide its city panorama from camera rays.
world=scene.world;nt=world.node_tree;n=nt.nodes;l=nt.links;output=next(x for x in n if x.type=='OUTPUT_WORLD');env=next(x for x in n if x.type=='TEX_ENVIRONMENT');bg=next(x for x in n if x.type=='BACKGROUND');bg.inputs['Strength'].default_value=.50
sky=n.new('ShaderNodeTexSky');sky.sky_type='MULTIPLE_SCATTERING';sky.sun_elevation=math.radians(13);sky.sun_rotation=math.radians(118);sky.sun_disc=False;sky.altitude=.2;sky.air_density=1.2
camera_bg=n.new('ShaderNodeBackground');camera_bg.inputs['Strength'].default_value=.36;l.new(sky.outputs[0],camera_bg.inputs['Color']);lightpath=n.new('ShaderNodeLightPath');mix=n.new('ShaderNodeMixShader');l.new(lightpath.outputs['Is Camera Ray'],mix.inputs[0]);l.new(bg.outputs[0],mix.inputs[1]);l.new(camera_bg.outputs[0],mix.inputs[2]);l.new(mix.outputs[0],output.inputs['Surface'])
for o in scene.objects:
 if o.type=='LIGHT':o.hide_render=True;o.hide_set(True)
def light(name,typ,pos,energy,color,size,target):
 data=bpy.data.lights.new(name,typ);data.energy=energy;data.color=color
 if typ=='AREA':data.shape='DISK';data.size=size
 if typ=='SUN':data.angle=size
 o=bpy.data.objects.new(name,data);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();return o
light('V112 late sun / warm raking relief','SUN',(-100,160,95),2.4,(1,.81,.60),.055,(-65,80,0))
light('V112 soft sky / cool ship fill','AREA',(8,-38,55),19000,(.65,.78,1),65,(-10,10,3))
light('V112 cove bounce / soft separation','AREA',(-112,58,24),5000,(1,.86,.66),35,(-130,105,14))
scene.camera.location=(30,-62,14);scene.camera.rotation_euler=(Vector((-49,106,15))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=43
scene.cycles.transparent_max_bounces=12;scene.cycles.max_bounces=8;scene.cycles.diffuse_bounces=3;scene.cycles.glossy_bounces=4
(OUT/'woodland-placement.json').write_text(json.dumps({'version':112,'trees':plant,'shrubs':shrubs},indent=2),encoding='utf8')
# Save the actual fully assembled material stage; originals are retained in their old native files.
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'02-scanned-cliffs-materials-and-biomes.blend'))
(OUT/'02-material-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'cliffAssemblies':14,'scannedPrototypeParts':len(rockprotos),'treeInstances':len(plant),'shrubInstances':shrubs,'canopyPrototypeTriangles':sum(sum(len(p.vertices)-2 for p in d.polygons) for d in protos),'curvedGrassLeaves':grasscount,'seaMaterialChanged':False,'source':'existing licensed CC0 Poly Haven cliff, tree, PBR sets','pluginsUsed':['Blender glTF import','Cycles','native Boolean','native Decimate'],'unverifiedArtStationPluginsClaimed':False},indent=2),encoding='utf8')
print('V112_NATIVE_ENVIRONMENT_SAVED',len(plant),shrubs,grasscount)
