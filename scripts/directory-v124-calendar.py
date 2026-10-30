import bpy,math,json,hashlib
from pathlib import Path
R=Path.cwd();A=R/'assets/directory-v124';N=R/'blender/directory-v32-124/directory-room.blend'
bpy.ops.wm.open_mainfile(filepath=str(N));scene=bpy.context.scene
for o in list(scene.objects):
 if o.name.startswith('Calendar124 print ') or o.name=='Calendar124 legible vector print':bpy.data.objects.remove(o,do_unlink=True)
ink=bpy.data.materials['Calendar124 charcoal letterpress'];red=bpy.data.materials['Calendar124 vermilion date stamp'];font=bpy.data.fonts.load('C:/Windows/Fonts/arial.ttf');bold=bpy.data.fonts.load('C:/Windows/Fonts/arialbd.ttf');details=[]
def label(text,z,size,mat=ink,boldface=False):
 bpy.ops.object.text_add();o=bpy.context.object;o.name='Calendar124 print '+text;o.data.body=text;o.data.align_x='CENTER';o.data.align_y='CENTER';o.data.font=bold if boldface else font;o.data.size=size;o.data.extrude=.000035;o.data.resolution_u=4;o.rotation_euler=(math.pi/2-math.radians(13),0,0);o.location=(-1.24,-.27-.027-.005*math.cos(math.radians(13))+(z-.887)*math.sin(math.radians(13))-.0003,z);bpy.ops.object.convert(target='MESH');o=bpy.context.object;o.data.materials.append(mat);o['key']='';o['occluder']=True;details.append(o)
label('OCTOBER 2026',.970,.016,boldface=True)
label('17',.881,.108,red,True)
label('SATURDAY',.803,.013,boldface=True)
for o in bpy.context.selected_objects:o.select_set(False)
copies=[]
for original in details:
 c=original.copy();c.data=original.data.copy();scene.collection.objects.link(c);c.select_set(True);copies.append(c)
bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join();out=bpy.context.object;out.name='Calendar124 legible vector print';bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);bpy.ops.export_scene.gltf(filepath=str(A/'props-detail.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_extras=True);out.hide_render=True;out.hide_set(True)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(N))
sha=hashlib.sha256(N.read_bytes()).hexdigest();result=json.loads((A/'native-result.json').read_text(encoding='utf8'));result['nativeSHA256']=sha;result['calendarReadabilityRefinement']='Large 17 / OCTOBER 2026 / SATURDAY vector print; no microscopic full-month grid';result['propsDetailSHA256']=hashlib.sha256((A/'props-detail.glb').read_bytes()).hexdigest();(A/'native-result.json').write_text(json.dumps(result,indent=2),encoding='utf8')
print('CALENDAR_LEGIBLE_COMPLETE',sha)
