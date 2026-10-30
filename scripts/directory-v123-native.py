import bpy,math,json,time,hashlib,struct,zlib
import numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v123';NATIVE=ROOT/'blender/directory-v32-123';OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'blender/directory-v32-122/directory-room.blend'));scene=bpy.context.scene;scene.name='Original tactile archive room / V123'
for ob in list(scene.objects):
 if ob.name in ['room-static','room-static-export'] or ob.name.startswith(('Remote ','Tactile remote')):bpy.data.objects.remove(ob,do_unlink=True)
for ob in scene.objects:ob.hide_render=False;ob.hide_set(False)
helper=(ROOT/'scripts/directory-v122-native.py').read_text(encoding='utf8');exec(compile(helper[helper.index('def material('):helper.index('cx,cy=-.73')],'V122 original modeling helpers','exec'),globals())

# Surface dimensionality is coherent in native and browser: photo grain plus restrained anisotropic pores.
wood=bpy.data.materials['Oiled walnut / subtle long grain'];nodes=wood.node_tree.nodes;links=wood.node_tree.links;p=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Coat Weight'].default_value=.28;p.inputs['Coat Roughness'].default_value=.24
tc=nodes.new('ShaderNodeTexCoord');tc.object=bpy.data.objects['Wood photo world coordinate anchor'];scale=nodes.new('ShaderNodeVectorMath');scale.operation='MULTIPLY';scale.inputs[1].default_value=(1.7,1800,20);links.new(tc.outputs['Object'],scale.inputs[0]);grain=nodes.new('ShaderNodeTexNoise');grain.inputs['Scale'].default_value=2;grain.inputs['Detail'].default_value=2;grain.inputs['Roughness'].default_value=.6;links.new(scale.outputs[0],grain.inputs['Vector']);rough=nodes.new('ShaderNodeMapRange');rough.inputs['From Min'].default_value=0;rough.inputs['From Max'].default_value=1;rough.inputs['To Min'].default_value=.33;rough.inputs['To Max'].default_value=.46;links.new(grain.outputs['Fac'],rough.inputs['Value']);links.new(rough.outputs[0],p.inputs['Roughness']);bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12;bump.inputs['Distance'].default_value=.00012;links.new(grain.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs[0],p.inputs['Normal'])
for mat in bpy.data.materials:
 if mat.use_nodes and 'potted_plant_02_pot' in mat.name:
  for node in mat.node_tree.nodes:
   if node.type=='TEX_IMAGE' and node.image:
    for suffix in ['diff','rough','nor_gl']:
     if '_pot_'+suffix+'_' in node.image.name:
      im=bpy.data.images.load(str(OUT/'plant'/('potted_plant_02_pot_'+suffix+'_2k.jpg')),check_existing=True);im.colorspace_settings.name='sRGB' if suffix=='diff' else 'Non-Color';node.image=im

# An orderly remote with a real physical keycap grid, not arbitrary glyph strips.
shell,p=material('Remote123 charcoal satin ABS',(.018,.022,.025),.36);p.inputs['Coat Weight'].default_value=.14
rubber,p=material('Remote123 tactile key rubber',(.013,.016,.018),.68)
letters,p=material('Remote123 durable cream pad print',(.72,.73,.69),.64)
red,p=material('Remote123 power red rubber',(.29,.023,.015),.60)
parent=bpy.data.objects.new('Remote123 assembly anchor',None);scene.collection.objects.link(parent);parent.location=(.05,-.56,.781);parent.rotation_euler.z=-.08
remotes=[];keys=[]
def component(ob,pos):ob.parent=parent;ob.location=pos;ob['key']='remote';ob['occluder']=True;remotes.append(ob);return ob
component(box('Remote123 molded body',(0,0,0),(.12,.30,.032),shell,.010),(0,0,0))
component(box('Remote123 recessed faceplate',(0,0,0),(.103,.277,.004),shell,.008),(0,0,.0165))
def label(text,x,y,z,size=.009):
 bpy.ops.object.text_add();ob=bpy.context.object;ob.name='Remote123 printed '+text;ob.data.body=text;ob.data.align_x='CENTER';ob.data.align_y='CENTER';ob.data.size=size;ob.data.extrude=.00006;ob.data.resolution_u=5;bpy.ops.object.convert(target='MESH');ob=bpy.context.object;ob.data.materials.append(letters);return component(ob,(x,y,z))
def key(text,x,y,w=.022,h=.023,color=None,size=.009):
 component(box('Remote123 key '+text,(0,0,0),(w,h,.0065),color or rubber,.003),(x,y,.022));label(text,x,y,.0258,size);keys.append({'label':text,'localCenter':[x,y,.0258]})
key('I',-.033,.112,.019,.020,red,.010);label('POWER',.016,.112,.019,.0065)
for i in range(9):key(str(i+1),-.032+(i%3)*.032,.075-(i//3)*.032)
key('AV',-.032,-.021,size=.0065);key('0',0,-.021);key('OK',.032,-.021,size=.0065)
label('VOL',-.028,-.047,.020,.0065);label('CH',.028,-.047,.020,.0065)
for x in [-.028,.028]:key('+',x,-.070,.026,.025,size=.010);key('-',x,-.103,.026,.025,size=.010)
key('MUTE',0,-.131,.038,.017,size=.0058)
bpy.context.view_layer.update()
for rec in keys:
 v=parent.matrix_world@Vector(rec['localCenter']);rec['gltfCenter']=[v.x,v.z,-v.y]
(OUT/'remote-detail.json').write_text(json.dumps({'complete':True,'model':'remote-detail.glb','placement':'Absolute glTF world coordinates; scene.add with no added position/scale','key':'remote','keys':keys,'bodyCenter':[.05,.781,.56],'bodyDimensions':[.12,.032,.30],'nativeTopTextHeight':.807,'labels':'Native vector typography, actual 1–9/0, AV, OK, VOL/CH +/-, POWER, MUTE; not random ornament'},indent=2),encoding='utf8')
# One combined mesh, three meaningful PBR material groups. Native original keycaps remain editable.
for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in remotes:
 c=original.copy();c.data=original.data.copy();world=original.matrix_world.copy();c.parent=None;c.matrix_world=world;scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();remoteExport=bpy.context.object;remoteExport.name='Remote123 physical controls';remoteExport['key']='remote';remoteExport['occluder']=True
bpy.ops.export_scene.gltf(filepath=str(OUT/'remote-detail.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_extras=True);remoteExport.hide_render=True;remoteExport.hide_set(True)
plant=[o for o in scene.objects if o.type=='MESH' and o.name.startswith('CC0 photo plant')]
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
static=[o for o in scene.objects if o.type=='MESH' and o not in remotes+plant+[screen,bulb,remoteExport] and not o.name.startswith('Preview ')]
collision=[*static,*remotes,*plant,screen,bulb]
glass=box('Window glass / collision only',(0,1.06,1.75),(3.08,.004,1.60),rubber,0);glass['key']='window';glass['occluder']=True;collision.append(glass)
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in collision:ob.select_set(True)
bpy.context.view_layer.objects.active=collision[0];bpy.ops.export_scene.gltf(filepath=str(OUT/'room-collision.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='NONE',export_extras=True);bpy.data.objects.remove(glass,do_unlink=True)
contract=json.loads((ROOT/'assets/directory-v122/collision-contract.json').read_text(encoding='utf8'));contract['remote']='Actual V123 orderly key geometry; all body, caps and letters key=remote';(OUT/'collision-contract.json').write_text(json.dumps(contract,indent=2),encoding='utf8')
for ob in bpy.context.selected_objects:ob.select_set(False)
copies=[]
for original in static:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();atlas=bpy.context.object;atlas.name='room-static'
for uv in list(atlas.data.uv_layers):atlas.data.uv_layers.remove(uv)
uv=atlas.data.uv_layers.new(name='BAKE_UV');atlas.data.uv_layers.active=uv;uv.active_render=True;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.003,area_weight=.1);bpy.ops.object.mode_set(mode='OBJECT')
for ob in static:ob.hide_render=True;ob.hide_set(True)
scene.render.engine='CYCLES';scene.cycles.samples=32;pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU';source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')].replace("'samples':24","'samples':32");exec(compile(block,'V123 real triple radiance','exec'),globals())
export=atlas.copy();export.data=atlas.data.copy();scene.collection.objects.link(export);export.name='room-static-export';indices=[p.material_index for p in export.data.polygons];newm=[]
for mat in export.data.materials:
 p=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat.use_nodes else None;col=tuple(p.inputs['Base Color'].default_value)[:3] if p else (.3,.3,.3);m,q=material('WEB122 '+mat.name,col,float(p.inputs['Roughness'].default_value) if p else .6,float(p.inputs['Metallic'].default_value) if p else 0);newm.append(m)
export.data.materials.clear()
for mat in newm:export.data.materials.append(mat)
for p,i in zip(export.data.polygons,indices):p.material_index=i
for ob in bpy.context.selected_objects:ob.select_set(False)
export.select_set(True);bpy.context.view_layer.objects.active=export;bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35),keep_sharp_edges=True);bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT');export.hide_render=True;export.hide_set(True);atlas.hide_render=True;atlas.hide_set(True)
for ob in static:ob.hide_render=False;ob.hide_set(False)
screen.hide_render=False;bulb.hide_render=False;scene.cycles.samples=64;scene.render.image_settings.file_format='PNG';scene.render.resolution_x=1600;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.filepath=str(OUT/'native-preview.png');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.ops.render.render(write_still=True)
atlas.data.calc_loop_triangles();(OUT/'room-lighting.json').write_text(json.dumps({'complete':True,'epoch':'v32.123-physical-remote-varnished-photo-wood','triangles':len(atlas.data.loop_triangles),'passes':records,'normalMap':'room-normal.png','newRemoteRenderedSeparately':True,'plantPotResolution':'official 2k'},indent=2),encoding='utf8')
# The V122 finalizer checks UVs, runs real OIDN and bakes tangent normals; scope every output to V123.
finish=(ROOT/'scripts/directory-v122-finish.py').read_text(encoding='utf8');finish=finish.replace('directory-v122','directory-v123').replace('directory-v32-122','directory-v32-123');exec(compile(finish,'V123 final actual OIDN and normals','exec'),globals())
print('V123_NATIVE_COMPLETE',flush=True)
