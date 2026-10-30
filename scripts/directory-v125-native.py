import bpy,math,json,time,hashlib,struct,zlib
import numpy as np
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v125';NATIVE=ROOT/'blender/directory-v32-125';OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
old=ROOT/'blender/directory-v32-124/directory-room.blend';oldsha=hashlib.sha256(old.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(old));scene=bpy.context.scene;scene.name='Tactile artist desk / V125 material specific surfaces'
removed=[]
for ob in list(scene.objects):
 if ob.name in ['room-static','room-static-export','Calendar124 legible vector print'] or ob.name.startswith(('Preview dynamic','Stacked archive volume','Archive volume spine','Spine cream paper inset')):
  removed.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:ob.hide_render=False;ob.hide_set(False)
remoteExport=bpy.data.objects.get('Remote123 physical controls');remoteExport.hide_render=True;remoteExport.hide_set(True)
helper=(ROOT/'scripts/directory-v122-native.py').read_text(encoding='utf8');exec(compile(helper[helper.index('def material('):helper.index('cx,cy=-.73')],'original solid modelling helpers','exec'),globals())
new=[];proxies=[];printDetails=[o for o in scene.objects if o.name.startswith('Calendar124 print ')]
def prop(ob,key=''):
 ob['key']=key;ob['occluder']=True;ob['sourceName']=ob.name;new.append(ob);return ob
def surface(mat,kind,rough,metal=0,coat=0,grain=.0001,scale=(500,500,500)):
 p=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');n=mat.node_tree.nodes;l=mat.node_tree.links
 for socket in ['Normal','Roughness']:
  for link in list(p.inputs[socket].links):l.remove(link)
 p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;p.inputs['Coat Weight'].default_value=coat;p.inputs['Coat Roughness'].default_value=.20
 tex=n.new('ShaderNodeTexCoord');vec=n.new('ShaderNodeVectorMath');vec.operation='MULTIPLY';vec.inputs[1].default_value=scale;l.new(tex.outputs['Generated'],vec.inputs[0]);noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=1;noise.inputs['Detail'].default_value=2;l.new(vec.outputs[0],noise.inputs['Vector'])
 ran=n.new('ShaderNodeMapRange');ran.inputs['To Min'].default_value=max(.05,rough-.065);ran.inputs['To Max'].default_value=min(.98,rough+.065);l.new(noise.outputs['Fac'],ran.inputs[0]);l.new(ran.outputs[0],p.inputs['Roughness'])
 bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.17;bump.inputs['Distance'].default_value=grain;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],p.inputs['Normal'])
 mat['materialKind']=kind;mat['microDisplacementMetres']=grain;mat['roughnessRange']=[max(.05,rough-.065),min(.98,rough+.065)];mat['physicalMetallic']=metal
 if kind=='brass':
  anis=p.inputs.get('Anisotropic IOR Level') or p.inputs.get('Anisotropic')
  if anis:anis.default_value=.28
 return p
for mat in bpy.data.materials:
 if not mat.use_nodes or not any(n.type=='BSDF_PRINCIPLED' for n in mat.node_tree.nodes):continue
 name=mat.name.lower()
 if name.startswith('web122'):continue
 if 'brushed warm brass' in name:surface(mat,'brass',.34,.95,.06,.000045,(95,95,2300))
 elif 'porcelain / white' in name:surface(mat,'porcelain',.24,0,.35,.000015,(220,220,220))
 elif 'graphite molded' in name:surface(mat,'abs',.47,0,.08,.000055,(950,950,950))
 elif 'cotton paper' in name or 'uncoated ivory' in name:surface(mat,'paper',.86,0,0,.00009,(380,380,650))
 elif 'warm walnut' in name or 'wood' in name:mat['materialKind']='wood'
 elif 'headphones' in name and 'aluminium' in name:surface(mat,'aluminium',.36,.82,0,.000035,(90,1600,90))
 elif 'foam' in name or 'rubber' in name:surface(mat,'rubber',.84,0,0,.00013,(400,400,400))
 # Preserve the photo-derived plant and pot materials and the real walnut image textures.
metal,p=material('Artist125 worn satin tin',(.22,.25,.235),.39,.82);surface(metal,'aluminium',.39,.82,0,.00003,(100,1500,100))
charcoal,p=material('Artist125 charcoal sticks',(.017,.019,.018),.94);surface(charcoal,'charcoal',.94,0,0,.00017,(130,130,130))
wood,p=material('Artist125 raw birch brush handles',(.37,.235,.12),.70);surface(wood,'wood',.70,0,0,.00005,(50,1100,50))
bristles,p=material('Artist125 natural hog bristles',(.22,.18,.13),.85);surface(bristles,'fibre',.85,0,0,.00013,(80,80,650))
ceramic,p=material('Artist125 porcelain mixing palette',(.69,.68,.61),.27);surface(ceramic,'porcelain',.27,0,.30,.00002,(200,200,200))
plastic,p=material('CD125 charcoal injection moulded rack',(.032,.040,.036),.52);surface(plastic,'abs',.52,0,0,.00004,(750,750,750))
# Compact art cluster on the front-left: real shallow tin, individual charcoal and brushes.
prop(box('Artist125 charcoal tin shallow base',(-1.465,-.46,.765),(.145,.205,.022),metal,.005))
for xx in [-1.537,-1.393]:prop(box('Artist125 tin rolled side wall',(xx,-.46,.779),(.003,.20,.027),metal,.001))
for yy in [-.56,-.36]:prop(box('Artist125 tin rolled end wall',(-1.465,yy,.779),(.145,.003,.027),metal,.001))
for i in range(4):
 o=prop(box('Artist125 four distinct charcoal sticks',(-1.512+i*.030,-.464,.783),(.018,.158,.017),charcoal,.002));o.rotation_euler.z=(-.02+i*.013)
for i in range(2):
 x=-.51+i*.035;y=-.46+i*.02
 prop(line('Artist125 birch paintbrush handle',[(x-.035,y-.115,.758),(x+.027,y+.080,.758)],.003,wood))
 prop(line('Artist125 paintbrush metal ferrule',[(x+.027,y+.080,.758),(x+.033,y+.102,.758)],.0045,metal))
 prop(line('Artist125 taper natural brush tip',[(x+.033,y+.102,.758),(x+.039,y+.125,.758)],.0038,bristles))
prop(box('Artist125 glazed mixing palette',(-.45,-.63,.760),(.22,.105,.013),ceramic,.025))
for i,c in enumerate([(.11,.18,.15),(.31,.12,.065),(.52,.42,.24),(.055,.065,.062)]):
 mat,p=material('Artist125 dried pigment '+str(i),c,.83);bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1,location=(-.523+i*.049,-.63,.767));o=bpy.context.object;o.name='Artist125 dried pigment deposit';o.scale=(.014,.017,.0017);o.data.materials.append(mat);prop(o)
# Four discs have a low, separated real rack rather than an unreadable pile.
prop(box('CD125 low rack base',(.615,-.18,.769),(1.03,.21,.028),plastic,.006))
for i,x in enumerate([.27,.50,.73,.96]):
 for side in [-1,1]:prop(box('CD125 independently separated slot '+str(i),(x+side*.109,-.18,.785),(.004,.13,.028),plastic,.0015))
for xx in [.914,1.322]:
 prop(box('Reading125 minimalist brass bookend foot',(xx,.38,.758),(.034,.34,.006),brass,.0015))
 prop(box('Reading125 minimalist brass bookend vertical',(xx,.38,.91),(.005,.34,.30),brass,.002))
# Native geometry proxies reproduce live media positions exactly for shadows. Never exported.
C=Matrix(((1,0,0),(0,0,-1),(0,1,0)))
cloth,p=material('Proxy125 book cloth',(.12,.18,.14),.80)
for i,x in enumerate([1.02,1.12,1.22]):
 o=box('Preview dynamic standing reading book GI proxy '+str(i),(0,0,0),(.47,.063,.32),cloth,.003)
 # First construct Three.js YXZ world rotation; map coordinates to Blender's Z-up frame.
 M=C@Matrix.Rotation(.28,3,'Y')@Matrix.Rotation(math.pi/2,3,'Z');o.rotation_euler=M.to_euler();o.location=(x,.38,.99);proxies.append(o)
for i,x in enumerate([.27,.50,.73,.96]):
 o=box('Preview dynamic separated CD GI proxy '+str(i),(0,0,0),(.214,.014,.21),plastic,.002);o.rotation_euler=(C@Matrix.Rotation(1.4,3,'X')).to_euler();o.location=(x,-.18,.89);proxies.append(o)
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
# Keep authored local warm light and room ambient; no global extra exposure trick.
lamplight.data.energy=49;lamplight.data.shadow_soft_size=.09
plant=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('CC0 photo plant')]
remotes=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('Remote123') and o!=remoteExport]
static=[o for o in scene.objects if o.type=='MESH' and o not in remotes+plant+proxies+printDetails+[screen,bulb,remoteExport] and not o.name.startswith('Preview ')]
collision=[*static,*remotes,*plant,screen,bulb,*printDetails]
panes=[]
for row,z in [('t',2.14),('b',1.34)]:
 for col,x in [('l',-.78),('r',.78)]:
  g=box('Window125 '+row+col+' glass collision only',(x,1.06,z),(1.50,.004,.76),plastic,0);g['key']='window-'+row+col;g['occluder']=True;g['sourceName']=g.name;panes.append(g)
collision+=panes
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in collision:ob.select_set(True)
bpy.context.view_layer.objects.active=collision[0];bpy.ops.export_scene.gltf(filepath=str(OUT/'room-collision.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='NONE',export_extras=True)
for g in panes:bpy.data.objects.remove(g,do_unlink=True)
contract=json.loads((ROOT/'assets/directory-v124/collision-contract.json').read_text(encoding='utf8'));contract.update({'version':'32.125','windowPanes':{'window-tl':[-.78,2.14,-1.06],'window-tr':[.78,2.14,-1.06],'window-bl':[-.78,1.34,-1.06],'window-br':[.78,1.34,-1.06]},'newArtPropsOpaqueOccluders':True,'removedStaticSupportBooks':True,'liveMediaProxiesExcluded':True});(OUT/'collision-contract.json').write_text(json.dumps(contract,indent=2),encoding='utf8')
for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in printDetails:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();detail=bpy.context.object;detail.name='Calendar125 legible vector print';bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.export_scene.gltf(filepath=str(OUT/'props-detail.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_extras=True);detail.hide_render=True;detail.hide_set(True)
for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in static:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();atlas=bpy.context.object;atlas.name='room-static'
for uv in list(atlas.data.uv_layers):atlas.data.uv_layers.remove(uv)
uv=atlas.data.uv_layers.new(name='BAKE_UV');atlas.data.uv_layers.active=uv;uv.active_render=True;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.003,area_weight=.1);bpy.ops.object.mode_set(mode='OBJECT')
for ob in static:ob.hide_render=True;ob.hide_set(True)
scene.render.engine='CYCLES';scene.cycles.samples=48;pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU';source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')].replace("'samples':24","'samples':48");exec(compile(block,'V125 real three component radiance','exec'),globals())
export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export';indices=[p.material_index for p in export.data.polygons];newm=[];materialRecords=[]
for mat in export.data.materials:
 p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat.use_nodes else None;col=tuple(p.inputs['Base Color'].default_value)[:3] if p else (.3,.3,.3);m,q=material('WEB122 '+mat.name,col,float(p.inputs['Roughness'].default_value) if p else .6,float(p.inputs['Metallic'].default_value) if p else 0)
 for k in ['materialKind','microDisplacementMetres','roughnessRange','physicalMetallic']:
  if k in mat:m[k]=mat[k]
 if p:q.inputs['Coat Weight'].default_value=p.inputs['Coat Weight'].default_value;q.inputs['Coat Roughness'].default_value=p.inputs['Coat Roughness'].default_value
 newm.append(m);materialRecords.append({'name':m.name,'kind':mat.get('materialKind','original'),'baseColor':col,'metallic':float(q.inputs['Metallic'].default_value),'roughness':float(q.inputs['Roughness'].default_value),'coat':float(q.inputs['Coat Weight'].default_value)})
export.data.materials.clear()
for mat in newm:export.data.materials.append(mat)
for p,i in zip(export.data.polygons,indices):p.material_index=i
for ob in bpy.context.selected_objects:ob.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export;bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35),keep_sharp_edges=True);bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_extras=True);export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for ob in static:ob.hide_render=False;ob.hide_set(False)
screen.hide_render=False;bulb.hide_render=False;scene.cycles.samples=48;scene.render.image_settings.file_format='PNG';scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.filepath=str(OUT/'native-preview.png');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.ops.render.render(write_still=True)
lamplight.data.energy=0;scene.render.filepath=str(OUT/'native-lamp-off.png');bpy.ops.render.render(write_still=True);lamplight.data.energy=49
atlas.data.calc_loop_triangles();(OUT/'room-lighting.json').write_text(json.dumps({'complete':True,'epoch':'v32.125-material-specific-artist-room-standing-books-separated-CDs','triangles':len(atlas.data.loop_triangles),'passes':records,'normalMap':'room-normal.png','vectorPrintRenderedSeparately':'props-detail.glb','nativeGIchanges':{'lampRadiusM':[.075,.09],'lightEnergyUnchanged':True},'dynamicGIproxies':len(proxies),'addedObjects':[o.name for o in new],'removedObjects':removed,'originalV124NativeSHA256':oldsha,'materials':materialRecords},indent=2),encoding='utf8')
finish=(ROOT/'scripts/directory-v122-finish.py').read_text(encoding='utf8').replace('directory-v122','directory-v125').replace('directory-v32-122','directory-v32-125');exec(compile(finish,'V125 OIDN real UV normals','exec'),globals())
assert hashlib.sha256(old.read_bytes()).hexdigest()==oldsha
print('V125_NATIVE_COMPLETE',flush=True)
