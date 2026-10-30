import bpy,bmesh,json,math,time,hashlib,struct,zlib,shutil
import numpy as np
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v120';NATIVE=ROOT/'blender/directory-v32-120'
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'));scene=bpy.context.scene
auditdir=ROOT/'.verify/v32-120/rejected-rough-atlas';auditdir.mkdir(parents=True,exist_ok=True)
if not (auditdir/'room-lamp-raw.exr').exists():shutil.copy2(OUT/'room-lamp.exr',auditdir/'room-lamp-raw.exr')
if not (auditdir/'previous-lighting.json').exists():shutil.copy2(OUT/'room-lighting.json',auditdir/'previous-lighting.json')
removed=[]
for ob in list(scene.objects):
 if ob.name.startswith('Desk subtle board seam'):removed.append(ob.name);bpy.data.objects.remove(ob,do_unlink=True)
atlas=bpy.data.objects['room-static'];export=bpy.data.objects['room-static-export'];removedfaces={}
for ob in [atlas,export]:
 bm=bmesh.new();bm.from_mesh(ob.data);kill=[]
 for face in bm.faces:
  mat=ob.data.materials[face.material_index];co=ob.matrix_world@face.calc_center_median()
  if mat and 'Dark oiled room floor' in mat.name and .740<co.z<.761:kill.append(face)
 removedfaces[ob.name]=len(kill);bmesh.ops.delete(bm,geom=kill,context='FACES');bm.to_mesh(ob.data);bm.free();ob.data.update()
assert removedfaces[atlas.name]==removedfaces[export.name] and removedfaces[atlas.name]>0
wood=bpy.data.materials['Oiled walnut / subtle long grain'];nodes=wood.node_tree.nodes;links=wood.node_tree.links;principled=next(n for n in nodes if n.type=='BSDF_PRINCIPLED');oldcolor=principled.inputs['Base Color'].links[0].from_socket
mapping=bpy.data.objects.new('Wood photo world coordinate anchor',None);scene.collection.objects.link(mapping)
tc=nodes.new('ShaderNodeTexCoord');tc.object=mapping
mul=nodes.new('ShaderNodeVectorMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=(.92/3.4,.07/1.65,0);links.new(tc.outputs['Object'],mul.inputs[0])
add=nodes.new('ShaderNodeVectorMath');add.operation='ADD';add.inputs[1].default_value=(.5,.065,0);links.new(mul.outputs[0],add.inputs[0])
tex=nodes.new('ShaderNodeTexImage');tex.name='CC0 real wood one plank interior';tex.image=bpy.data.images.load(str(ROOT/'assets/odyssey/wood_planks/wood_planks_diff_1k.jpg'));tex.extension='EXTEND';links.new(add.outputs[0],tex.inputs['Vector'])
mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX';mix.inputs[0].default_value=.65;links.new(oldcolor,mix.inputs[1]);links.new(tex.outputs['Color'],mix.inputs[2]);links.new(mix.outputs[0],principled.inputs['Base Color'])
originalstates={o.name:(o.hide_render,o.hide_get()) for o in scene.objects}
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
for ob in scene.objects:
 if ob.type=='MESH' and ob not in [atlas,screen,bulb] and not ob.name.startswith('Preview '):ob.hide_render=True;ob.hide_set(True)
atlas.hide_render=False;atlas.hide_set(False);scene.render.engine='CYCLES';scene.cycles.samples=24
pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU'
source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')];exec(compile(block,'existing V120 triple-bake contract','exec'),globals())
for name,(hr,hv) in originalstates.items():bpy.data.objects[name].hide_render=hr;bpy.data.objects[name].hide_set(hv)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
previous=json.loads((OUT/'room-lighting.json').read_text(encoding='utf8'));previous['passes']=records;previous['epoch']='v32.120-original-enclosed-room-photo-wood-no-seams';previous.pop('denoise',None);previous['tableRevision']={'removedObjects':removed,'removedFaces':removedfaces,'remainingUVsRepacked':False,'photoSource':'assets/odyssey/wood_planks/SOURCE.json','photoMap':'assets/odyssey/wood_planks/wood_planks_diff_1k.jpg','mapping':'world x/3.4*0.92+0.5, y/1.65*0.07+0.065; one plank interior only','photoMix':.65,'warmProceduralMix':.35};(OUT/'room-lighting.json').write_text(json.dumps(previous,indent=2),encoding='utf8')
print('TABLE_PHOTO_BAKE_DONE',json.dumps(previous['tableRevision']),flush=True)
# Reuse the audited Blender-5 compositor, UV verifier, export tint and smooth-normal workflow.
exec(compile((ROOT/'scripts/directory-v120-denoise-atlas.py').read_text(encoding='utf8'),'existing V120 OIDN contract','exec'),globals())
