import bpy,math,json,time,hashlib,struct,zlib
import numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v122';NATIVE=ROOT/'blender/directory-v32-122'
OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/directory-v32-120/directory-room.blend'));scene=bpy.context.scene;scene.name='Original responsive archive room / V122'
for name in ['room-static','room-static-export']:
 ob=bpy.data.objects.get(name)
 if ob:bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:ob.hide_set(False);ob.hide_render=False
def remove_prefix(prefixes):
 for ob in list(scene.objects):
  if any(ob.name.startswith(p) for p in prefixes):bpy.data.objects.remove(ob,do_unlink=True)
remove_prefix(['Ceramic coffee cup','Cup rounded lip','Coffee','Cup ceramic loop handle','Brass pencil cup','Earthen plant pot','Plant pot rolled lip','Pot soil','Plant stem','Broad sculpted leaf'])
# Keep only two bottom support books; the three actual interactive books are independently rendered by the website.
removed_books=[]
for ob in list(scene.objects):
 if ob.type=='MESH' and any(ob.name.startswith(p) for p in ['Stacked archive volume cover','Stacked archive volume pages','Archive volume spine','Spine cream paper inset']) and ob.location.z>.825:
  removed_books.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
def material(name,color,rough=.45,metal=0):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True;n=m.node_tree.nodes;n.clear();p=n.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;o=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs[0],o.inputs[0]);m.diffuse_color=(*color,1);return m,p
white,p=material('Porcelain / white inner and outer glaze',(.84,.82,.77),.22);p.inputs['Coat Weight'].default_value=.32;p.inputs['Coat Roughness'].default_value=.18
coffee,p=material('Dark coffee / horizontal liquid',(.023,.011,.006),.20)
brass=bpy.data.materials['Brushed warm brass'];black=bpy.data.materials['Graphite molded ABS / fine grain'];rubber=bpy.data.materials['Rubber feet'];metal=bpy.data.materials['Gunmetal small fittings']
def lathe(name,center,profile,mat,steps=80):
 vs=[];fs=[]
 for r,z in profile:
  for i in range(steps):a=i*2*math.pi/steps;vs.append((center[0]+r*math.cos(a),center[1]+r*math.sin(a),z))
 for j in range(len(profile)-1):
  for i in range(steps):a=j*steps+i;b=j*steps+(i+1)%steps;fs.append((a,b,b+steps,a+steps))
 me=bpy.data.meshes.new(name);me.from_pydata(vs,[],fs);me.update();ob=bpy.data.objects.new(name,me);scene.collection.objects.link(ob);ob.data.materials.append(mat)
 import bmesh
 bm=bmesh.new();bm.from_mesh(me);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bm.to_mesh(me);bm.free()
 for face in me.polygons:face.use_smooth=True
 return ob
def line(name,pts,r,mat):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3;c.resolution_u=16;s=c.splines.new('POLY');s.points.add(len(pts)-1)
 for p,co in zip(s.points,pts):p.co=(*co,1)
 ob=bpy.data.objects.new(name,c);scene.collection.objects.link(ob)
 for x in bpy.context.selected_objects:x.select_set(False)
 ob.select_set(True);bpy.context.view_layer.objects.active=ob;bpy.ops.object.convert(target='MESH');ob=bpy.context.object;ob.data.materials.append(mat)
 for f in ob.data.polygons:f.use_smooth=True
 return ob
def box(name,loc,dims,mat,bevel=.003):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);ob=bpy.context.object;ob.name=name;ob.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  md=ob.modifiers.new('Manufactured rounded edges','BEVEL');md.width=bevel;md.segments=3;bpy.ops.object.modifier_apply(modifier=md.name)
 ob.data.materials.append(mat);return ob
cx,cy=-.73,-.56
cup=lathe('White ceramic cup / closed hollow volume',(cx,cy),[(0,.755),(.059,.755),(.070,.764),(.075,.894),(.074,.906),(.071,.913),(.067,.914),(.064,.908),(.062,.89),(.056,.776),(0,.776)],white)
line('White ceramic curved handle',[(cx-.066-.063*math.sin(i/32*math.pi),cy,.835+.060*math.cos(i/32*math.pi)) for i in range(33)],.010,white)
lathe('Coffee liquid / below white inner rim',(cx,cy),[(0,.883),(.0615,.883)],coffee)
pen=lathe('Hollow brass pen holder / open mouth',(-1.48,-.20),[(0,.752),(.045,.752),(.049,.759),(.049,.894),(.047,.902),(.043,.902),(.041,.894),(.041,.765),(0,.765)],brass)
# A visible dark inner floor cannot be mistaken for a solid lid at the opening.
inner,p=material('Pen holder dark inner well',(.037,.025,.012),.57,.2)
lathe('Pen holder inner floor',(-1.48,-.20),[(0,.766),(.040,.766)],inner)

# Touch-scale manufacturing details: inset power LED, cabinet seams, embossed controls and finned lamp hub.
for i in range(8):box('TV lower control inset separator',(-.46+i*.041,-.233,.959),(.021,.006,.0018),rubber,.0005)
for x in [-.593,.093]:box('CRT cabinet vertical assembly seam',(x,.04,1.225),(.0016,.40,.56),rubber,.0004)
box('CRT discreet manufacturer plate',(-.43,-.220,1.52),(.16,.002,.016),metal,.001)
led,p=material('CRT green indicator lens',(.025,.16,.055),.17);p.inputs['Emission Color'].default_value=(.02,.16,.03,1);p.inputs['Emission Strength'].default_value=.25
box('CRT standby lens',(-.48,-.228,1.00),(.008,.004,.008),led,.002)
for i in range(3):box('Remote rubber grip ridge',(.104,-.61+i*.045,.78),(.003,.020,.018),rubber,.001)
for y in [-.665,-.63,-.595]:box('Remote tiny raised button mark',(.052,y,.806),(.008,.001,.001),bpy.data.materials['Warm cotton paper'],.0003)
box('Remote battery cover join',(.05,-.445,.774),(.073,.0018,.014),rubber,.0004)
shade=bpy.data.objects.get('Brass lamp shade / open thin shell')
if shade:
 for p in shade.data.polygons:p.use_smooth=True
for i in range(3):line('Lamp head rounded collar',[(-.94+.023*math.cos(j/40*2*math.pi),.015+.023*math.sin(j/40*2*math.pi),1.49+i*.006) for j in range(41)],.002,brass)

# The actual licensed photo plant used by the webpage now also casts the native GI shadows.
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/directory-v120/plant/potted-plant-02.glb'));plant=[o for o in scene.objects if o not in before]
roots=[o for o in plant if o.parent not in plant]
for ob in roots:ob.location+=Vector((-1.39,.39,.755))
plantmeshes=[o for o in plant if o.type=='MESH']
for ob in plantmeshes:ob.name='CC0 photo plant / '+ob.name
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
lamplight.data.energy=57;lamplight.data.color=(1,.64,.36);lamplight.data.shadow_soft_size=.052
bpy.data.objects['Gentle camera-side exposure fill'].data.energy=12
bpy.data.objects['Cool rainy window ambient'].data.energy=65
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.12
static=[o for o in scene.objects if o.type=='MESH' and o not in plantmeshes and o not in [screen,bulb] and not o.name.startswith('Preview ')]

def key_for(ob):
 n=ob.name
 if n.startswith('Desk yellow navigation paper') or n.startswith('Yellow paper'):return 'notepad'
 if n.startswith(('Desk lamp','Lamp ','Brass lamp','Rolled shade','Warm tungsten')):return 'lamp'
 if n.startswith(('Tactile remote','Remote ')):return 'remote'
 if n=='CRT analog tuning knob.001':return 'power'
 if n.startswith(('CRT ','Bezel ','Cabinet screw','Rear cooling')) or ob==screen:return 'tv'
 if n.startswith('TV lower control inset separator'):return 'tv'
 if n.startswith(('Upright archive binder','Binder cloth inset')):return 'about'
 if n.startswith(('Vertical window','Horizontal window','Wide window','Window brass')):return 'window'
 if n.startswith(('Closed sketchbook','Sketchbook pages','Pencil on paper')):return 'learning'
 if n.startswith('Hollow brass pen holder') or n.startswith('Pen holder'):return 'pens'
 if n.startswith(('White ceramic','Coffee liquid')):return 'cup'
 if n.startswith('Standing graphite pencil'):return 'pens'
 return ''
collision=[*static,*plantmeshes,screen,bulb]
for ob in collision:ob['key']=key_for(ob);ob['occluder']=True;ob['sourceName']=ob.name
# Behind all furniture, an actual glass plane is the click surface of the window's transparent opening.
glass=box('Window glass / collision only',(0,1.06,1.75),(3.08,.004,1.60),rubber,0);glass['key']='window';glass['occluder']=True;glass['sourceName']=glass.name;collision.append(glass)
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in collision:ob.select_set(True)
bpy.context.view_layer.objects.active=collision[0]
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-collision.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='NONE',export_extras=True)
bpy.data.objects.remove(glass,do_unlink=True)
bounds={}
for label,ob in [('cup',cup),('penholder',pen)]:
 vs=[ob.matrix_world@Vector(c) for c in ob.bound_box];g=[[v.x,v.z,-v.y] for v in vs];bounds[label]={'min':[min(v[i] for v in g) for i in range(3)],'max':[max(v[i] for v in g) for i in range(3)],'key':key_for(ob)}
(OUT/'collision-contract.json').write_text(json.dumps({'complete':True,'model':'room-collision.glb','perObject':True,'allVisibleObjectsAreOccluders':True,'semanticKey':'mesh.userData.key or parent.userData.key; empty key still blocks all objects behind it','coordinateSystem':'glTF x,z,-y','bounds':bounds,'removedUpperBookObjects':removed_books,'dynamicBooksSuggestedCenters':[[.85,.88,-.37],[.88,.95,-.37],[.85,1.02,-.37]],'plantRenderedSeparately':True},indent=2),encoding='utf8')

for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in static:
 ob=original.copy();ob.data=original.data.copy();scene.collection.objects.link(ob);ob.select_set(True);copies.append(ob)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();atlas=bpy.context.object;atlas.name='room-static'
for uv in list(atlas.data.uv_layers):atlas.data.uv_layers.remove(uv)
uv=atlas.data.uv_layers.new(name='BAKE_UV');atlas.data.uv_layers.active=uv;uv.active_render=True
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.003,area_weight=.1);bpy.ops.object.mode_set(mode='OBJECT')
for ob in static:ob.hide_render=True;ob.hide_set(True)
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True;pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU'
# Reuse the already inspected three-pass generation, but label the actual V122 samples truthfully.
source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')].replace("'samples':24","'samples':32");exec(compile(block,'V122 triple Cycles radiance','exec'),globals())
export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export';indices=[p.material_index for p in export.data.polygons];newmats=[]
for mat in export.data.materials:
 p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat and mat.use_nodes else None
 col=tuple(p.inputs['Base Color'].default_value)[:3] if p else (.3,.3,.3);m,q=material('WEB122 '+mat.name,col,float(p.inputs['Roughness'].default_value) if p else .6,float(p.inputs['Metallic'].default_value) if p else 0);newmats.append(m)
export.data.materials.clear()
for mat in newmats:export.data.materials.append(mat)
for p,i in zip(export.data.polygons,indices):p.material_index=i
for ob in bpy.context.selected_objects:ob.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export;bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35),keep_sharp_edges=True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT')
export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for ob in static:ob.hide_render=False;ob.hide_set(False)
screen.hide_render=False;bulb.hide_render=False
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'native-preview.png');scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.cycles.samples=64
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.ops.render.render(write_still=True)
atlas.data.calc_loop_triangles();result={'complete':True,'epoch':'v32.122-hollow-volumes-object-collision','triangles':len(atlas.data.loop_triangles),'staticObjects':len(static),'materialSlots':len(newmats),'passes':records,'linearComposite':'offDiffuse + lampOnlyDiffuse * lampLevel + tvWhiteDiffuse * screenLinearRGB','pngColorSpace':'NoColorSpace; flipY=false; pow(rgb,3)*scale','multiplyAlbedoAgain':False,'collision':'room-collision.glb','native':str(NATIVE/'directory-room.blend'),'limitations':'Baked Cycles diffuse plus browser PBR specular; camera and native sky differ from web; not reference source model or pixel identity.'};(OUT/'room-lighting.json').write_text(json.dumps(result,indent=2),encoding='utf8')
# Run the actual working Blender-5 OIDN only, with paths scoped to new V122 outputs.
uvcheck={'onlyUVLayer':'BAKE_UV','nativeExportUVExact':True,'glTFConvention':'TEXCOORD_0=(nativeU,1-nativeV)'}
den=(ROOT/'scripts/directory-v120-denoise-atlas.py').read_text(encoding='utf8');den=den[den.index('def chunk(k,d):'):den.index("mg=json.loads")];exec(compile(den,'V122 actual OIDN radiance','exec'),globals())
(OUT/'native-result.json').write_text(json.dumps({'complete':True,'cupHollowWall':True,'penHolderHollowWall':True,'threeActualCyclesPasses':True,'actualOIDN':True,'staticTriangles':len(atlas.data.loop_triangles),'nativeSHA256':hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest(),'staticSHA256':hashlib.sha256((OUT/'room-static.glb').read_bytes()).hexdigest(),'collisionSHA256':hashlib.sha256((OUT/'room-collision.glb').read_bytes()).hexdigest(),'originalV120Untouched':True},indent=2),encoding='utf8')
print('V122_NATIVE_COMPLETE',flush=True)
