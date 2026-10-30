import bpy,math,json,time,hashlib,struct,zlib
import numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v124';NATIVE=ROOT/'blender/directory-v32-124';OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/directory-v32-123/directory-room.blend'));scene=bpy.context.scene;scene.name='Original tactile archive room / V124'
removed=[]
for ob in list(scene.objects):
 if ob.name in ['room-static','room-static-export'] or ob.name.startswith(('Upright archive binder','Binder cloth inset')):
  removed.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:ob.hide_render=False;ob.hide_set(False)
remoteExport=bpy.data.objects.get('Remote123 physical controls');remoteExport.hide_render=True;remoteExport.hide_set(True)
helper=(ROOT/'scripts/directory-v122-native.py').read_text(encoding='utf8');exec(compile(helper[helper.index('def material('):helper.index('cx,cy=-.73')],'V122 original modeling helpers','exec'),globals())
new=[];printDetails=[];proxies=[]
def prop(ob):ob['key']='';ob['occluder']=True;ob['sourceName']=ob.name;new.append(ob);return ob
paper,p=material('Calendar124 uncoated ivory paper',(.75,.735,.67),.86)
ink,p=material('Calendar124 charcoal letterpress',(.028,.035,.035),.79)
red,p=material('Calendar124 vermilion date stamp',(.31,.065,.035),.77)
aluminium,p=material('Headphones124 satin anodized aluminium',(.24,.26,.25),.30,.82)
foam,p=material('Headphones124 soft charcoal ear cushions',(.035,.039,.037),.85)
leather,p=material('Headphones124 warm brown leather padding',(.082,.046,.025),.57)
rubber,p=material('Headphones124 matte coiled cable',(.018,.022,.020),.78)
card,p=material('Calendar124 olive buckram board',(.087,.116,.090),.76)
eraser,p=material('Eraser124 warm natural rubber',(.57,.51,.44),.94)
wrapper,p=material('Eraser124 printed olive paper sleeve',(.17,.23,.18),.80)
for mat in [paper,foam,leather,eraser,card]:
 n=mat.node_tree.nodes;l=mat.node_tree.links;p=next(n for n in n if n.type=='BSDF_PRINCIPLED');tc=n.new('ShaderNodeTexNoise');tc.inputs['Scale'].default_value=500;tc.inputs['Detail'].default_value=2;bm=n.new('ShaderNodeBump');bm.inputs['Strength'].default_value=.18;bm.inputs['Distance'].default_value=.00015;l.new(tc.outputs['Fac'],bm.inputs['Height']);l.new(bm.outputs[0],p.inputs['Normal'])
# Standing A-frame calendar: folded board, distinct page block and real metal binding loops.
cx,cy=-1.24,-.27
prop(box('Calendar124 folded desk foot',(cx,cy,.760),(.215,.125,.014),card,.004))
front=prop(box('Calendar124 front paper block',(cx,cy-.027,.887),(.204,.009,.232),paper,.002));front.rotation_euler.x=math.radians(-13)
rear=prop(box('Calendar124 rear A-frame board',(cx,cy+.027,.882),(.210,.006,.237),card,.002));rear.rotation_euler.x=math.radians(13)
for x in np.linspace(cx-.083,cx+.083,6):
 prop(line('Calendar124 silver binding',[(x,cy+.006+.011*math.cos(a),1.003+.011*math.sin(a)) for a in np.linspace(0,2*math.pi,22)],.0014,aluminium))
font=bpy.data.fonts.load('C:/Windows/Fonts/arial.ttf')
bold=bpy.data.fonts.load('C:/Windows/Fonts/arialbd.ttf')
def printfront(text,x,z,size=.01,mat=ink,boldface=False):
 # Text is flush on the tilted paper, with actual vector outlines; no small atlas text.
 bpy.ops.object.text_add();ob=bpy.context.object;ob.name='Calendar124 print '+text;ob.data.body=text;ob.data.align_x='CENTER';ob.data.align_y='CENTER';ob.data.font=bold if boldface else font;ob.data.size=size;ob.data.extrude=.000035;ob.data.resolution_u=4
 ob.rotation_euler=(math.pi/2+math.radians(-13),0,0);dz=z-.887;ob.location=(x,cy-.027-.005*math.cos(math.radians(13))+dz*math.sin(math.radians(13))-.0003,z)
 bpy.ops.object.convert(target='MESH');ob=bpy.context.object;ob.data.materials.append(mat);ob['occluder']=True;ob['key']='';printDetails.append(ob);return ob
printfront('OCTOBER 2026',cx,.970,.016,boldface=True)
printfront('17',cx,.881,.108,red,True)
printfront('SATURDAY',cx,.803,.013,boldface=True)
prop(box('Eraser124 softened natural rubber',(-.94,-.54,.775),(.075,.030,.033),eraser,.004))
prop(box('Eraser124 folded sleeve',(-.942,-.54,.775),(.042,.031,.034),wrapper,.001))
# Over-ear studio headphones rest on their padded cups, not a flat icon.
hx,hy=1.305,.36
for side in [-1,1]:
 x=hx+side*.115
 shell=prop(box('Headphones124 rounded aluminium ear shell',(x,hy-.080,.794),(.108,.137,.050),aluminium,.018))
 cushion=prop(box('Headphones124 thick stitched foam cushion',(x,hy-.080,.821),(.092,.123,.025),foam,.017))
 inset=prop(box('Headphones124 recessed cloth driver',(x,hy-.080,.835),(.061,.087,.003),rubber,.015))
 for j in range(13):
  yy=hy-.119+j*.0065;prop(line('Headphones124 fabric driver weave',[(x-.025,yy,.837),(x+.025,yy,.837)],.00035,foam))
 prop(line('Headphones124 pivot metal bracket',[(x-side*.036,hy-.074,.797),(x-side*.045,hy-.02,.803),(x-side*.05,hy+.004,.803)],.0035,aluminium))
angles=np.linspace(0,math.pi,54)
prop(line('Headphones124 genuine padded arch',[(hx+.12*math.cos(a),hy+.146*math.sin(a),.802) for a in angles],.014,leather))
prop(line('Headphones124 brushed outer spring',[(hx+.12*math.cos(a),hy+.154*math.sin(a),.802) for a in angles],.0035,aluminium))
prop(line('Headphones124 loose coiled cable',[(1.19+.035*math.sin(a),.23-.14*a/(5*math.pi),.758+.001*math.cos(a)) for a in np.linspace(0,5*math.pi,100)],.0018,rubber))
prop(box('Headphones124 3.5mm jack',(1.19,.075,.759),(.008,.032,.008),aluminium,.002))
# Actual web review found the rear telephone hid the headband. Move the entire assembly forward,
# including all pads, metal, woven drivers and cable, then rebake coherent contact shadows.
for ob in new:
 if ob.name.startswith('Headphones124 '):ob.location.y-=.42
# Dynamic geometry is represented for the true native shadows only, never exported over live books/CDs.
cloth,p=material('Proxy124 reading cloth',(.12,.18,.14),.81)
for i,(x,y) in enumerate([(.85,.37),(.88,.37),(.85,.37)]):
 o=box('Preview dynamic reading book GI proxy '+str(i),(x,y,.873+i*.064),(.47,.32,.063),cloth,.004);proxies.append(o)
for i in range(4):
 o=box('Preview dynamic CD case GI proxy '+str(i),(.37,0,.763+i*.018),(.29,.235,.014),rubber,.002);proxies.append(o)
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
lamplight.data.energy=49;lamplight.data.shadow_soft_size=.075
bpy.data.objects['Cool rainy window ambient'].data.energy=105
bpy.data.objects['Gentle camera-side exposure fill'].data.energy=18
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value=.17
plant=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('CC0 photo plant')]
remotes=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('Remote123') and o!=remoteExport]
static=[o for o in scene.objects if o.type=='MESH' and o not in remotes+plant+proxies+printDetails+[screen,bulb,remoteExport] and not o.name.startswith('Preview ')]
collision=[*static,*remotes,*plant,screen,bulb,*printDetails]
glass=box('Window glass / collision only',(0,1.06,1.75),(3.08,.004,1.60),rubber,0);glass['key']='window';glass['occluder']=True;collision.append(glass)
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in collision:ob.select_set(True)
bpy.context.view_layer.objects.active=collision[0];bpy.ops.export_scene.gltf(filepath=str(OUT/'room-collision.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='NONE',export_extras=True);bpy.data.objects.remove(glass,do_unlink=True)
contract=json.loads((ROOT/'assets/directory-v123/collision-contract.json').read_text(encoding='utf8'));contract['removedUprightBookObjects']=removed;contract['addedProps']={'calendar':[-1.24,.89,.27],'headphones':[1.305,.80,.06],'eraser':[-.94,.775,.54]};contract['addedPropsInteraction']='Precise visible meshes are opaque occluders with empty semantic key; no accidental navigation';(OUT/'collision-contract.json').write_text(json.dumps(contract,indent=2),encoding='utf8')
# Dedicated print mesh retains native vector fidelity; all transforms applied before joining.
for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in printDetails:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();detail=bpy.context.object;detail.name='Calendar124 legible vector print';bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'props-detail.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_extras=True);detail.hide_render=True;detail.hide_set(True)
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
scene.cycles.device='GPU';source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')].replace("'samples':24","'samples':48");exec(compile(block,'V124 three actual radiance components','exec'),globals())
export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export';indices=[p.material_index for p in export.data.polygons];newm=[]
for mat in export.data.materials:
 p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat.use_nodes else None;col=tuple(p.inputs['Base Color'].default_value)[:3] if p else (.3,.3,.3);m,q=material('WEB122 '+mat.name,col,float(p.inputs['Roughness'].default_value) if p else .6,float(p.inputs['Metallic'].default_value) if p else 0);newm.append(m)
export.data.materials.clear()
for mat in newm:export.data.materials.append(mat)
for p,i in zip(export.data.polygons,indices):p.material_index=i
for ob in bpy.context.selected_objects:ob.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export;bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35),keep_sharp_edges=True);bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT');export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for ob in static:ob.hide_render=False;ob.hide_set(False)
screen.hide_render=False;bulb.hide_render=False;scene.cycles.samples=48;scene.render.image_settings.file_format='PNG';scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.filepath=str(OUT/'native-preview.png');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.ops.render.render(write_still=True)
lamplight.data.energy=0;scene.render.filepath=str(OUT/'native-lamp-off.png');bpy.ops.render.render(write_still=True);lamplight.data.energy=49
atlas.data.calc_loop_triangles();(OUT/'room-lighting.json').write_text(json.dumps({'complete':True,'epoch':'v32.124-real-window-fill-calendar-headphones-no-upright-books','triangles':len(atlas.data.loop_triangles),'passes':records,'normalMap':'room-normal.png','newRemoteRenderedSeparately':True,'remoteSource':'assets/directory-v123/remote-detail.glb','vectorPrintRenderedSeparately':'props-detail.glb','nativeGIchanges':{'windowAreaW':[65,105],'cameraSoftAreaW':[12,18],'worldStrength':[.12,.17],'tungstenW':[57,49],'tungstenSoftRadiusM':[.052,.075]},'dynamicGIproxies':len(proxies),'addedObjects':[o.name for o in new],'removedUprightBooks':removed,'originalV123Untouched':True},indent=2),encoding='utf8')
finish=(ROOT/'scripts/directory-v122-finish.py').read_text(encoding='utf8');finish=finish.replace('directory-v122','directory-v124').replace('directory-v32-122','directory-v32-124');exec(compile(finish,'V124 OIDN UV audit and actual normals','exec'),globals())
print('V124_NATIVE_COMPLETE',flush=True)
