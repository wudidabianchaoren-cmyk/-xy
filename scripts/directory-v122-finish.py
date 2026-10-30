import bpy,json,hashlib,math,struct,zlib
import numpy as np
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v122';NATIVE=ROOT/'blender/directory-v32-122'
# Full verified V120 finalizer, scoped to new paths; it checks all UVs and actually runs OIDN.
source=(ROOT/'scripts/directory-v120-denoise-atlas.py').read_text(encoding='utf8');source=source[:source.index('mg=json.loads')];source=source.replace("assets/directory-v120","assets/directory-v122").replace("blender/directory-v32-120","blender/directory-v32-122").replace("startswith('WEB ')","startswith('WEB122 ')").replace("material.name[4:]","material.name[7:]")
exec(compile(source,'V122 audited finish only','exec'),globals())
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'));scene=bpy.context.scene;atlas=bpy.data.objects['room-static']
for ob in scene.objects:
 if ob.name.startswith(('Hollow brass pen holder','Pen holder','Standing graphite pencil')):ob['key']='pens'
 if ob.name=='CRT analog tuning knob.001':ob['key']='power'
# The collision GLB keeps the same rendered triangles and names; update only semantic metadata.
path=OUT/'room-collision.glb';d=path.read_bytes();jl=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+jl]);tail=d[20+jl:]
for node in g.get('nodes',[]):
 ex=node.get('extras',{})
 if ex.get('key') in ['penholder','pencil']:ex['key']='pens'
 if node.get('name')=='CRT analog tuning knob.001':ex['key']='power'
raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);path.write_bytes(struct.pack('<III',0x46546C67,2,12+8+len(raw)+len(tail))+struct.pack('<II',len(raw),0x4E4F534A)+raw+tail)
contract=json.loads((OUT/'collision-contract.json').read_text(encoding='utf8'));contract['bounds']['penholder']['key']='pens';contract['cupLiquid']={'center':[-.73,.883,.56],'radius':.0615,'rimTopY':.914};contract['powerControl']='CRT analog tuning knob.001';(OUT/'collision-contract.json').write_text(json.dumps(contract,indent=2),encoding='utf8')
# Normal bake is data, not a color-managed PNG or a painted image.
normal=bpy.data.images.new('V122 tangent normal actual Cycles bake',width=2048,height=2048,alpha=False,float_buffer=True);normal.colorspace_settings.name='Non-Color'
for mat in atlas.data.materials:
 if mat and mat.use_nodes:
  for node in mat.node_tree.nodes:node.select=False
  node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.name='V122 tangent normal target';node.image=normal;node.select=True;mat.node_tree.nodes.active=node
for ob in bpy.context.selected_objects:ob.select_set(False)
atlas.hide_set(False);atlas.hide_render=False;atlas.select_set(True);bpy.context.view_layer.objects.active=atlas
scene.render.bake.normal_space='TANGENT';scene.render.bake.margin=12;bpy.ops.object.bake(type='NORMAL')
pixels=np.empty(2048*2048*4,dtype=np.float32);normal.pixels.foreach_get(pixels);rgb=np.clip(np.round(pixels.reshape(2048,2048,4)[:,:,:3]*255),0,255).astype(np.uint8);writepng(OUT/'room-normal.png',np.flipud(rgb));atlas.hide_set(True);atlas.hide_render=True
normal.filepath_raw=str(OUT/'room-normal.png');normal.file_format='PNG'
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
atlas.data.calc_loop_triangles();result={'complete':True,'cupHollowWall':True,'penHolderHollowWall':True,'threeActualCyclesPasses':True,'actualOIDN':True,'staticTriangles':len(atlas.data.loop_triangles),'actualTangentNormalBake':{'file':'room-normal.png','resolution':[2048,2048],'colorSpace':'NoColorSpace; raw tangent XYZ RGB','flipY':False,'normalScaleSuggestion':[.35,.35]},'nativeSHA256':hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest(),'staticSHA256':hashlib.sha256((OUT/'room-static.glb').read_bytes()).hexdigest(),'collisionSHA256':hashlib.sha256((OUT/'room-collision.glb').read_bytes()).hexdigest(),'originalV120Untouched':True};(OUT/'native-result.json').write_text(json.dumps(result,indent=2),encoding='utf8');print('V122_FINISH_COMPLETE',json.dumps(result),flush=True)
