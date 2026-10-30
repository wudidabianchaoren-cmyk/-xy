import bpy,os,json,math,numpy as np
from mathutils import Vector
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','mythology-v32-85');os.makedirs(O,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=os.path.join(P,'blender','mythology-v32-84','mythology-refined.blend'))
scene=bpy.context.scene;scene.cycles.samples=12
terrain=[o for o in scene.objects if o.type=='MESH' and 'complete_large_island' in str(o.get('source_name',''))]
old=terrain[0].data.materials[0];oldAO=next(n.image for n in old.node_tree.nodes if n.type=='TEX_IMAGE' and n.image and 'occlusion' in n.image.name.lower())
D=json.load(open(os.path.join(P,'.verify','v32-84','native-input.json'),encoding='utf8'))
treeXY=[]
for group in D['trees']:
 if 'Mixed forest grounded trunks' in group['name']:
  for values in group['matrices']:
   matrix=np.array(values).reshape(4,4).T;treeXY.append((matrix[0,3],-matrix[2,3]))
treeXY=np.array(treeXY)
for obj in terrain:
 attr=obj.data.color_attributes.new(name='ForestSoilFootprint',type='FLOAT_COLOR',domain='CORNER');points=np.array([tuple(obj.matrix_world@v.co) for v in obj.data.vertices]);weights=np.zeros(len(points))
 for start in range(0,len(points),256):
  batch=points[start:start+256];dist=np.sqrt(((batch[:,None,:2]-treeXY[None,:,:])**2).sum(axis=2)).min(axis=1);weights[start:start+256]=np.clip((6.5-dist)/3.5,0,1)*np.clip((batch[:,2]-4)/2,0,1)
 for li,loop in enumerate(obj.data.loops):attr.data[li].color=(weights[loop.vertex_index],)*3+(1,)
m=bpy.data.materials.new('Native85 gold coves, ochre soil, dark forest floor, weathered bedding');m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;p=next(x for x in n if x.type=='BSDF_PRINCIPLED');out=next(x for x in n if x.type=='OUTPUT_MATERIAL')
def node(kind):return n.new(kind)
def mathnode(op,a,b=None):
 t=node('ShaderNodeMath');t.operation=op
 for i,x in enumerate([a,b]):
  if x is None:continue
  if isinstance(x,(int,float)):t.inputs[i].default_value=x
  else:l.new(x,t.inputs[i])
 return t.outputs[0]
def remap(x,a,b,c=0,d=1):
 t=node('ShaderNodeMapRange');t.clamp=True;t.interpolation_type='SMOOTHSTEP';l.new(x,t.inputs['Value']);t.inputs['From Min'].default_value=a;t.inputs['From Max'].default_value=b;t.inputs['To Min'].default_value=c;t.inputs['To Max'].default_value=d;return t.outputs[0]
def mix(a,b,f):
 t=node('ShaderNodeMixRGB');t.blend_type='MIX'
 for i,x in enumerate([f,a,b]):
  if isinstance(x,tuple):t.inputs[i].default_value=(*x,1)
  elif isinstance(x,(int,float)):t.inputs[i].default_value=x
  else:l.new(x,t.inputs[i])
 return t.outputs[0]
geo=node('ShaderNodeNewGeometry');sep=node('ShaderNodeSeparateXYZ');l.new(geo.outputs['Position'],sep.inputs[0]);normal=node('ShaderNodeSeparateXYZ');l.new(geo.outputs['Normal'],normal.inputs[0]);height=sep.outputs['Z'];slope=normal.outputs['Z']
noise=node('ShaderNodeTexNoise');l.new(geo.outputs['Position'],noise.inputs['Vector']);noise.inputs['Scale'].default_value=1.9;noise.inputs['Detail'].default_value=4
fine=node('ShaderNodeTexNoise');l.new(geo.outputs['Position'],fine.inputs['Vector']);fine.inputs['Scale'].default_value=45;fine.inputs['Detail'].default_value=2
rock=mix((.095,.055,.027),(.29,.135,.058),noise.outputs['Fac']);sand=mix((.48,.265,.052),(.76,.465,.135),noise.outputs['Fac']);soil=mix((.027,.010,.004),(.115,.044,.014),noise.outputs['Fac'])
sandMask=mathnode('MULTIPLY',remap(height,3.0,8.0,1,0),remap(slope,.15,.55));soilMask=mathnode('MULTIPLY',remap(height,4.5,7.8),remap(slope,.15,.65))
footprint=node('ShaderNodeVertexColor');footprint.layer_name='ForestSoilFootprint';gray=node('ShaderNodeRGBToBW');l.new(footprint.outputs['Color'],gray.inputs[0]);soilMask=mathnode('MAXIMUM',soilMask,gray.outputs[0])
color=mix(mix(rock,sand,sandMask),soil,soilMask);wet=remap(height,.15,2.7,1,0);color=mix(color,(.073,.066,.041),mathnode('MULTIPLY',wet,.65));l.new(color,p.inputs['Base Color']);p.inputs['Roughness'].default_value=.91
bump=node('ShaderNodeBump');bump.inputs['Strength'].default_value=.38;bump.inputs['Distance'].default_value=.13;l.new(noise.outputs['Fac'],bump.inputs['Height']);micro=node('ShaderNodeBump');micro.inputs['Strength'].default_value=.22;micro.inputs['Distance'].default_value=.017;l.new(fine.outputs['Fac'],micro.inputs['Height']);l.new(bump.outputs['Normal'],micro.inputs['Normal']);l.new(micro.outputs['Normal'],p.inputs['Normal'])
bpy.ops.object.select_all(action='DESELECT')
for o in terrain:
 o.data.materials.clear();o.data.materials.append(m);o.select_set(True);o.data.uv_layers.active=o.data.uv_layers['NativeAO'];o.data.uv_layers['NativeAO'].active_render=True
 for a in list(o.data.color_attributes):
  if a.name!='ForestSoilFootprint':o.data.color_attributes.remove(a)
bpy.context.view_layer.objects.active=terrain[0]
scene.render.bake.use_clear=True;scene.render.bake.margin=12;scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False;scene.render.bake.use_pass_color=True
def bake(name,size,kind,color=True):
 im=bpy.data.images.new(name,width=size,height=size);im.colorspace_settings.name='sRGB' if color else 'Non-Color';t=node('ShaderNodeTexImage');t.image=im;n.active=t;bpy.ops.object.bake(type=kind);im.filepath_raw=os.path.join(O,name+'.png');im.file_format='PNG';im.save();im.pack();n.remove(t);return im
base=bake('coastal-habitats-color',4096,'DIFFUSE')
norm=bake('coastal-habitats-normal',2048,'NORMAL',False)
final=bpy.data.materials.new('Native85 baked multi-habitat coastal PBR');final.use_nodes=True;nn=final.node_tree.nodes;ll=final.node_tree.links;bs=next(x for x in nn if x.type=='BSDF_PRINCIPLED');bs.inputs['Roughness'].default_value=.87;uv=nn.new('ShaderNodeUVMap');uv.uv_map='NativeAO'
for im,field in [(base,'Base Color'),(norm,'Normal')]:
 t=nn.new('ShaderNodeTexImage');t.image=im;ll.new(uv.outputs[0],t.inputs['Vector'])
 if field=='Normal':b=nn.new('ShaderNodeNormalMap');b.uv_map='NativeAO';b.inputs['Strength'].default_value=.78;ll.new(t.outputs['Color'],b.inputs['Color']);ll.new(b.outputs[0],bs.inputs['Normal'])
 else:ll.new(t.outputs['Color'],bs.inputs[field])
from io_scene_gltf2.blender.com.material_helpers import create_settings_group
t=nn.new('ShaderNodeTexImage');t.image=oldAO;ll.new(uv.outputs[0],t.inputs['Vector']);settings=nn.new('ShaderNodeGroup');settings.node_tree=create_settings_group('glTF Material Output');ll.new(t.outputs['Color'],settings.inputs['Occlusion'])
for o in terrain:
 o.data.materials.clear();o.data.materials.append(final)
 for a in list(o.data.color_attributes):o.data.color_attributes.remove(a)
# Structural individuality remains in each original boat's world space and is exported as native additions.
D=json.load(open(os.path.join(P,'.verify','v32-84','native-input.json'),encoding='utf8'));boats=[(-8,4,1.22,0),(-24,-20,1.12,1),(29,-44,1.08,2),(-45,-64,1.05,3)]
# Read the actual flagship/escort/scout/provision hull bounds instead of assuming the old positions.
def material(name,color,rough=.7,metal=0):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=next(x for x in m.node_tree.nodes if x.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;return m
wood=material('Native85 hand worn dark oak',(.16,.073,.026),.76);bronze=material('Native85 aged bronze shield rims',(.30,.17,.053),.4,.8);linen=material('Native85 rust flax awning',(.26,.095,.037),.95);dark=material('Native85 tarred stem reinforcement',(.05,.044,.028),.69)
clothnoise=linen.node_tree.nodes.new('ShaderNodeTexNoise');clothnoise.inputs['Scale'].default_value=65;clothbump=linen.node_tree.nodes.new('ShaderNodeBump');clothbump.inputs['Strength'].default_value=.2;clothbump.inputs['Distance'].default_value=.009;linen.node_tree.links.new(clothnoise.outputs['Fac'],clothbump.inputs['Height']);linen.node_tree.links.new(clothbump.outputs['Normal'],next(x for x in linen.node_tree.nodes if x.type=='BSDF_PRINCIPLED').inputs['Normal'])
extra=[];fleet=[]
def box(name,loc,size,mat):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat);mod=o.modifiers.new('Worn edges','BEVEL');mod.width=.028;mod.segments=2;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name);extra.append(o);return o
for variant,prefix in enumerate(['Ulysses flagship','Ochre escort galley','Single-mast scout','Blue-sailed provision ship']):
 hull=[o for o in scene.objects if o.get('source_key') and 'Batched solid hull' in str(o.get('source_name','')) and prefix in str(o.get('source_name',''))]
 # Batch names don't include ancestors; input list order partitions each boat around its first hull.
 if not hull:
  groups=[o for o in scene.objects if o.get('source_key') and 'Batched solid hull' in str(o.get('source_name',''))]
  hull=groups[variant*14:variant*14+1] if len(groups)>=56 else groups[variant:variant+1]
 if not hull:continue
 o=hull[0];bounds=[o.matrix_world@Vector(v) for v in o.bound_box];xmin=min(v.x for v in bounds);xmax=max(v.x for v in bounds);cy=sum(v.y for v in bounds)/8;hz=max(v.z for v in bounds);scale=(xmax-xmin)/19
 fleet.append({'variant':variant,'hull':o.name,'x':[xmin,xmax],'y':cy,'top':hz,'scale':scale})
 if variant==1:
  for side in [-1,1]:
   for j in range(7):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=.36*scale,location=(xmin+(3+j*1.6)*scale,cy+side*2.4*scale,hz+.35*scale));sh=bpy.context.object;sh.name='native85_extra_escort_round_shield';sh.scale=(1,.15,1);sh.data.materials.append(bronze);extra.append(sh)
 if variant==2:
  box('native85_extra_scout_stern_raised_deck',(xmax-2*scale,cy,hz+.18*scale),(3.2*scale,3.4*scale,.28*scale),wood)
  box('native85_extra_scout_dark_rail',(xmax-2*scale,cy-1.5*scale,hz+.55*scale),(3.3*scale,.12*scale,.60*scale),dark)
 if variant==3:
  for side in[-1,1]:box('native85_extra_provision_hatch',(xmin+9*scale,cy+side*.9*scale,hz+.14*scale),(3.4*scale,1.25*scale,.22*scale),wood)
  aw=box('native85_extra_provision_flax_awning',(xmin+12.5*scale,cy,hz+2.35*scale),(4.8*scale,3.4*scale,.055*scale),linen)
  for x in[xmin+10.2*scale,xmin+14.8*scale]:
   for y in[cy-1.6*scale,cy+1.6*scale]:box('native85_extra_provision_awning_pole',(x,y,hz+1.3*scale),(.08*scale,.08*scale,2.7*scale),wood)
# Shape the scout's sail into a taut triangular lugsail; escort keeps its square rig with a partly reefed foot.
from mathutils import Matrix
fleetStarts=[57,108,158,207,253]
for o in list(scene.objects):
 key=str(o.get('source_key',''));idx=int(key.split('_')[-1]) if key.startswith('native84_') else -1
 if 'linen sail' not in str(o.get('source_name','')):continue
 specs=[(-7,3,1.22,0),(42,-24,1.12,-.42),(-32,-10,1.08,.28),(-10,-35,1.05,0)]
 center=sum((o.matrix_world@v.co for v in o.data.vertices),Vector())/len(o.data.vertices)
 variant=min(range(4),key=lambda i:(center.x-specs[i][0])**2+(center.y+specs[i][1])**2)
 if variant in [0,3]:continue
 x,z,s,yaw=specs[variant]
 transform=Matrix.Translation(Vector((x,-z,.18)))@Matrix.Rotation(yaw,4,'Z')@Matrix.Diagonal(Vector((s,s,s,1)));inv=transform.inverted()
 locals=[inv@(o.matrix_world@v.co) for v in o.data.vertices];lo=min(v.z for v in locals);hi=max(v.z for v in locals);axis=sum(v.x for v in locals)/len(locals)
 for vert in o.data.vertices:
  local=inv@(o.matrix_world@vert.co);h=local.z
  if variant==2:
   # Preserve all 31 x 31 vertices so the live wind continues on the native sail.
   width=.16+.84*(h-lo)/max(.001,hi-lo);local.x=axis+(local.x-axis)*width
  elif variant==1:local.z=max(6.2,local.z)
  vert.co=o.matrix_world.inverted()@transform@local
 o.data.update()
 # A true cloth shader in the native file; web glTF receives the same authored colour multiplier.
 for mat in o.data.materials:
  bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if bs:bs.inputs['Roughness'].default_value=.98;bs.inputs['Sheen Weight'].default_value=.28
# Detailed deck headwear is a separate native step: refine-deck-headwear-v32-85.py.
# Keep texture multipliers from the approved ship/skin materials in the packed Blender file.
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
 if o.type=='MESH' and o.get('source_key'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
for o in extra:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'fleet-details.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
for im in bpy.data.images:
 if im.source=='FILE':
  try:im.pack()
  except:pass
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
json.dump({'version':'V32.85','actualBlender':bpy.app.version_string,'terrainMeshes':len(terrain),'baseColorBake':4096,'normalBake':2048,'AO':'reused actual NativeAO Cycles','habitats':['wet shore','gold fine sand','weathered ochre bedding','brown forest soil'],'fleetNativeAdditions':len(extra),'fleetBounds':fleet},open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),indent=2)
scene.cycles.samples=24;scene.render.filepath=os.path.join(O,'native-material-cycles.png');bpy.ops.render.render(write_still=True)
print('V85 ACTUAL NATIVE PBR HABITATS AND FLEET EXPORTED')
