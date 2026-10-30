import bpy,json,math,os,numpy as np
from mathutils import Vector,Matrix
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O=os.path.join(P,'blender','mythology-v32-84');os.makedirs(O,exist_ok=True)
D=json.load(open(os.path.join(P,'.verify','v32-84','native-input.json'),encoding='utf8'))
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=20;scene.cycles.use_denoising=True
try:
 prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
 for d in prefs.devices:d.use=d.type!='CPU'
 scene.cycles.device='GPU'
except Exception:scene.cycles.device='CPU'
scene.render.resolution_x=1600;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.view_settings.look='None';scene.view_settings.exposure=-.30
scene.world=bpy.data.worlds.new('Sea dusk');scene.world.use_nodes=True;scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value=(.15,.20,.20,1);scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.25
matcache={};images={}
def image(path):
 if path not in images:images[path]=bpy.data.images.load(os.path.join(P,path),check_existing=True)
 return images[path]
def make_image(name,kind):
 N=1024;y,x=np.mgrid[0:N,0:N];rng=np.random.default_rng(8401)
 if kind=='sand':
  v=rng.random((N,N));c=np.stack([.44+.09*v,.30+.08*v,.15+.055*v,np.ones_like(v)],axis=2)
 else:
  v=rng.random((N,N));b=.94+.025*np.sin(x*.033)*np.sin(y*.057)+.035*(v-.5)
  pores=(v>.987)*.12;c=np.stack([b-pores,b-pores,b-pores,np.ones_like(v)],axis=2)
 im=bpy.data.images.new(name,width=N,height=N);im.pixels.foreach_set(c.astype(np.float32).ravel());im.filepath_raw=os.path.join(O,name+'.png');im.file_format='PNG';im.save();im.pack();return im
sandimage=make_image('fine-sediment','sand');skinimage=make_image('weathered-pores','skin')
v=np.array(skinimage.pixels[:],dtype=np.float32).reshape(1024,1024,4)[:,:,0];dy,dx=np.gradient(v);normal=np.stack([-dx*.9,-dy*.9,np.ones_like(v)],axis=2);normal/=np.linalg.norm(normal,axis=2,keepdims=True);normal=normal*.5+.5
skinNormal=bpy.data.images.new('Native skin pore normal',width=1024,height=1024);skinNormal.pixels.foreach_set(np.concatenate([normal,np.ones((1024,1024,1))],axis=2).astype(np.float32).ravel());skinNormal.filepath_raw=os.path.join(O,'weathered-pores-normal.png');skinNormal.file_format='PNG';skinNormal.save();skinNormal.pack();skinNormal.colorspace_settings.name='Non-Color'
def material(name,color,rough=.9,metal=0,paths=None,detail=None):
 key=(name,tuple(round(float(c),3) for c in color),round(rough,2),round(metal,2))
 if key in matcache:return matcache[key]
 m=bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;l=m.node_tree.links;p=n.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if detail=='skin':p.inputs['Subsurface Weight'].default_value=.085;p.inputs['Subsurface Radius'].default_value=(1,.45,.22)
 for field,path in (paths or {}).items():
  if not path:continue
  t=n.new('ShaderNodeTexImage');t.image=image(path);t.label=field
  if field=='Base Color':l.new(t.outputs['Color'],p.inputs[field])
  elif field=='Normal':t.image.colorspace_settings.name='Non-Color';normal=n.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.65;l.new(t.outputs['Color'],normal.inputs['Color']);l.new(normal.outputs['Normal'],p.inputs['Normal'])
  else:t.image.colorspace_settings.name='Non-Color';l.new(t.outputs['Color'],p.inputs[field])
 if detail=='sand':t=n.new('ShaderNodeTexImage');t.image=sandimage;l.new(t.outputs['Color'],p.inputs['Base Color']);b=n.new('ShaderNodeBump');b.inputs['Strength'].default_value=.22;b.inputs['Distance'].default_value=.012;l.new(t.outputs['Color'],b.inputs['Height']);l.new(b.outputs['Normal'],p.inputs['Normal'])
 if detail=='skin':t=n.new('ShaderNodeTexImage');t.image=skinNormal;b=n.new('ShaderNodeNormalMap');b.inputs['Strength'].default_value=.30;l.new(t.outputs['Color'],b.inputs['Color']);l.new(b.outputs['Normal'],p.inputs['Normal'])
 matcache[key]=m;return m
rockpaths={'Base Color':'assets/odyssey/rock_boulder_cracked_diff_1k.jpg','Normal':'assets/odyssey/rock_boulder_cracked_nor_gl_1k.jpg','Roughness':'assets/odyssey/rock_boulder_cracked_rough_1k.jpg'}
shore=material('01 wet fractured littoral stone',(.23,.23,.19),.48,paths=rockpaths)
sand=material('02 warm fine sand and mineral grains',(.48,.34,.18),.96,detail='sand')
rock=material('03 stratified mineral limestone',(.35,.33,.26),.89,paths=rockpaths)
soil=material('04 shaded forest soil',(.16,.145,.085),.97)
islandmat=material('Continuous native coastal PBR / sand wet stone soil and bedding',(1,1,1),.86,paths=rockpaths)
nodes=islandmat.node_tree.nodes;links=islandmat.node_tree.links;vcol=nodes.new('ShaderNodeVertexColor');vcol.layer_name='CoastalHabitats';mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=1
diff=next(n for n in nodes if n.type=='TEX_IMAGE' and n.label=='Base Color');links.new(diff.outputs['Color'],mix.inputs[1]);links.new(vcol.outputs['Color'],mix.inputs[2]);links.new(mix.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
patch=[];stats={'actualBlender':bpy.app.version_string,'source':D['source'],'nativeObjects':0,'islandFaces':0,'hullBevels':0,'linenPanels':0,'continentalRelief':'broad asymmetric ridges and eroded branching valleys','shaderMaterials':[]}
for item in D['meshes']:
 name=item['name'];vs=np.array(item['vertices'],dtype=np.float32).reshape(-1,3);island='complete_large_island' in name;continent='Closed continent' in name
 if continent:
  # Kilometre-scale asymmetric ridges; no fast periodic chain of domes.
  xx,zz=vs[:,0],vs[:,2];layer=int(name.split('Closed continent ')[1][0]);depth=np.maximum(0,-zz-(1100,3400,6100)[layer])
  ridge=190+160*np.exp(-((xx+3200)/3100)**2)+260*np.exp(-((xx-3900)/4900)**2)+95*np.maximum(0,1-np.abs((xx+depth*.22)/5500))
  valleys=1-.19*np.exp(-((xx+900+depth*.18)/750)**2)-.12*np.exp(-((xx-4900-depth*.10)/550)**2)
  relief=15*np.sin(xx*.0012+depth*.0016)+7*np.sin(xx*.0028-depth*.0021)
  keep=vs[:,1]>-60;vs[keep,1]=(-12+(1-np.exp(-depth/820))*(ridge*valleys+relief)*(1+layer*.28))[keep]
 if island:
  # Low shore stays level; irregular bedding is concentrated on exposed steep faces.
  h=vs[:,1];w=np.clip((h-4)/12,0,1)*(1-np.clip((h-34)/12,0,1))
  vs[:,1]+=(.26*np.sin(vs[:,0]*.61+vs[:,2]*.18)+.14*np.sin(vs[:,0]*1.75-vs[:,2]*.73))*w
 converted=[(float(x),float(-z),float(y)) for x,y,z in vs]
 index=item['index'];faces=[tuple(index[i:i+3]) for i in range(0,len(index),3)] if index else [(i,i+1,i+2) for i in range(0,len(vs),3)]
 mesh=bpy.data.meshes.new(item['key']+' geometry');mesh.from_pydata(converted,[],faces);mesh.update();obj=bpy.data.objects.new(item['key']+' '+name,mesh);scene.collection.objects.link(obj);obj['source_key']=item['key'];obj['source_name']=name;obj['skinned_source']=item['skinned'];obj.hide_render=not item.get('visible',True)
 uv=mesh.uv_layers.new(name='NativePBRUV');originaluv=item.get('uv')
 for polygon in mesh.polygons:
  for li in polygon.loop_indices:
   vi=mesh.loops[li].vertex_index
   if island:
    n=polygon.normal;v=mesh.vertices[vi].co
    uv.data[li].uv=(v.x/7,v.y/7) if abs(n.z)>.6 else ((v.y/7,v.z/7) if abs(n.x)>abs(n.y) else (v.x/7,v.z/7))
   elif originaluv:uv.data[li].uv=(originaluv[vi*2],originaluv[vi*2+1])
   else:uv.data[li].uv=(mesh.vertices[vi].co.x*.2,mesh.vertices[vi].co.z*.2)
 if island:
  mesh.materials.append(islandmat);colors=mesh.color_attributes.new(name='CoastalHabitats',type='FLOAT_COLOR',domain='CORNER')
  def smooth(a,b,x):u=max(0,min(1,(x-a)/(b-a)));return u*u*(3-2*u)
  for poly in mesh.polygons:
   for li in poly.loop_indices:
    vert=mesh.vertices[mesh.loops[li].vertex_index];h=vert.co.z;slope=vert.normal.z
    sandweight=(1-smooth(4,8,h))*smooth(.50,.85,slope)*smooth(.2,2,h)
    soilweight=smooth(6,12,h)*smooth(.70,.92,slope)
    wet=1-smooth(.7,2.5,h);rockcolor=np.array([.60,.58,.48])*(1-.40*wet);sandcolor=np.array([.85,.65,.35]);soilcolor=np.array([.26,.31,.18])
    color=rockcolor*(1-sandweight)+sandcolor*sandweight;color=color*(1-soilweight)+soilcolor*soilweight
    colors.data[li].color=(*color,1)
  stats['islandFaces']+=len(mesh.polygons)
 else:
  paths={'Base Color':item.get('map'),'Normal':item.get('normalMap'),'Roughness':item.get('roughnessMap')};detail='skin' if ('Humanbody' in name or 'skin' in name.lower()) else None
  if continent:paths=rockpaths
  m=material(name,item['color'],item.get('roughness') or .85,item.get('metalness') or 0,paths,detail);mesh.materials.append(m)
  if 'linen sail' in name:
   # Tension folds radiate from attachments; keep the authored 31 x 31 vertex grid for wind animation.
   for v in mesh.vertices:
    u=(v.index%31)/30;vv=(v.index//31)/30;v.co.y+=.095*math.sin(u*math.pi*14+vv*2.1)*math.sin(vv*math.pi)*(.25+.75*abs(2*u-1))
   m.node_tree.nodes.get('Principled BSDF').inputs['Sheen Weight'].default_value=.20;stats['linenPanels']+=1
  if 'Batched solid hull' in name and len(vs)<30000:
   bpy.context.view_layer.objects.active=obj;obj.select_set(True)
   bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.remove_doubles(threshold=.0002);bpy.ops.object.mode_set(mode='OBJECT')
   mod=obj.modifiers.new('Native joinery edge highlights','BEVEL');mod.width=.012;mod.segments=2;mod.limit_method='ANGLE';mod.angle_limit=.55
   bpy.ops.object.modifier_apply(modifier=mod.name);obj.select_set(False);stats['hullBevels']+=1
  if continent:
   bpy.context.view_layer.objects.active=obj;mod=obj.modifiers.new('Distant relief geometry budget','DECIMATE');mod.ratio=.34;bpy.ops.object.modifier_apply(modifier=mod.name)
 for poly in obj.data.polygons:poly.use_smooth=True
 patch.append(obj);stats['nativeObjects']+=1
# Preserve trees at their actual current positions for the native scene; linked prototypes keep the scene compact.
forestmat=material('Mediterranean evergreen crown',(.045,.09,.032),.94);trunkmat=material('Dark mature bark',(.105,.065,.025),.96)
yy,xx=np.mgrid[-1:1:128j,-1:1:128j];a=np.clip((1-(xx*xx/.36+yy*yy)) *24,0,1);grain=.8+.14*np.sin(yy*28)*np.cos(xx*20);leafpixels=np.stack([grain*.12,grain*.24,grain*.07,a],axis=2)
leafim=bpy.data.images.new('evergreen leaf vein alpha',width=128,height=128);leafim.pixels.foreach_set(leafpixels.astype(np.float32).ravel());leafim.filepath_raw=os.path.join(O,'evergreen-leaf.png');leafim.file_format='PNG';leafim.save();leafim.pack()
leafmat=material('Native finely veined evergreen leaves',(1,1,1),.9);nn=leafmat.node_tree.nodes;ll=leafmat.node_tree.links;tex=nn.new('ShaderNodeTexImage');tex.image=leafim;ll.new(tex.outputs['Color'],nn.get('Principled BSDF').inputs['Base Color']);ll.new(tex.outputs['Alpha'],nn.get('Principled BSDF').inputs['Alpha'])
forestExports=[]
def leafcrown(name,count,shape):
 rng=np.random.default_rng(8402 if shape=='oak' else 8403);verts=[];faces=[]
 for i in range(count):
  direction=Vector(rng.normal(size=3).tolist()).normalized();r=float(rng.random()**.333)*.95;centre=direction*r;u=direction.cross(Vector((0,0,1)))
  if u.length<.1:u=Vector((1,0,0))
  u.normalize();w=direction.cross(u).normalized();sz=.24 if shape=='oak' else .20
  start=len(verts)
  for px,py in [(-1,-1),(1,-1),(1,1),(-1,1)]:verts.append(tuple(centre+u*px*sz+w*py*sz*1.45))
  faces.append((start,start+1,start+2,start+3))
 g=bpy.data.meshes.new(name);g.from_pydata(verts,[],faces);g.materials.append(leafmat);uv=g.uv_layers.new(name='VeinedLeaves')
 for p in g.polygons:
  for j,li in enumerate(p.loop_indices):uv.data[li].uv=[(0,0),(1,0),(1,1),(0,1)][j]
 obj=bpy.data.objects.new(name,g);scene.collection.objects.link(obj);obj.hide_render=True;forestExports.append(obj);return g
oakgeo=leafcrown('Native84 oak leaf cluster',48,'oak');pinegeo=leafcrown('Native84 pine leaf cluster',54,'pine')
for t in D['trees']:
 if 'Internal simplified' in t['name']:continue
 trunk='trunk' in t['name'].lower()
 if 'cypress' not in t['name'].lower() and not trunk:data=oakgeo if 'oak' in t['name'].lower() else pinegeo
 else:
  bpy.ops.mesh.primitive_cylinder_add(vertices=10,radius=1,depth=1) if trunk else bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=1)
  prototype=bpy.context.object;prototype.data.materials.append(trunkmat if trunk else forestmat);data=prototype.data;bpy.data.objects.remove(prototype,do_unlink=True)
 C=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
 for i,values in enumerate(t['matrices']):
  obj=bpy.data.objects.new(t['name']+' '+str(i),data);scene.collection.objects.link(obj);a=np.array(values).reshape(4,4).T;obj.matrix_world=C@Matrix(a.tolist())@C.inverted()
# A water surface and dusk lighting are part of the native review only; the live ocean stays interactive.
bpy.ops.mesh.primitive_plane_add(size=4000,location=(0,0,-.15));sea=bpy.context.object;sea.name='Review sea';sea.data.materials.append(material('Review sea dusk',(.012,.063,.061),.19))
def light(name,loc,energy,size,color):
 d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;d.color=color;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((-12,15,8))-o.location).to_track_quat('-Z','Y').to_euler()
light('Warm grazing sunlight',(-45,160,65),65000,45,(1,.67,.35));light('Open sky cool bounce',(-25,-35,50),12000,100,(.61,.77,1))
ld=bpy.data.lights.new('Native morning sun','SUN');ld.energy=2.4;ld.angle=.06;ld.color=(1,.72,.44);lo=bpy.data.objects.new(ld.name,ld);scene.collection.objects.link(lo);lo.rotation_euler=Vector((33,-145,-37)).to_track_quat('-Z','Y').to_euler()
d=bpy.data.cameras.new('Original mythology 32 second review');cam=bpy.data.objects.new(d.name,d);scene.collection.objects.link(cam);cam.location=(26,-40,24);cam.rotation_euler=(Vector((-65,140,20))-cam.location).to_track_quat('-Z','Y').to_euler();d.lens=35;scene.camera=cam
bpy.ops.object.select_all(action='DESELECT')
for o in patch:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True,export_image_format='AUTO')
bpy.ops.object.select_all(action='DESELECT')
for obj in forestExports:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'forest-crowns.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
stats['shaderMaterials']=[m.name for m in matcache.values()];stats['exportedGeometryPBR']=True
for im in bpy.data.images:
 if im.source=='FILE':
  try:im.pack()
  except:pass
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
scene.render.filepath=os.path.join(O,'native-material-cycles.png');bpy.ops.render.render(write_still=True)
white=material('WHITE MODEL / material-independent geometry inspection',(.72,.72,.72),.82);scene.view_layers[0].material_override=white;scene.cycles.samples=12;scene.render.filepath=os.path.join(O,'native-white-cycles.png');bpy.ops.render.render(write_still=True);scene.view_layers[0].material_override=None
json.dump(stats,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
print('V32.84 ACTUAL NATIVE PRODUCTION COMPLETE',stats['nativeObjects'],stats['hullBevels'],stats['linenPanels'])
