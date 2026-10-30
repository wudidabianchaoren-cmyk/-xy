import bpy,json,hashlib
from pathlib import Path
from mathutils import Vector,Matrix
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v120/plant';NATIVE=ROOT/'blender/directory-v32-120'
assert (OUT/'SOURCE.json').exists(),'Download/source verification must finish first'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(OUT/'potted_plant_02_1k.gltf'))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];vs=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
minimum=Vector(tuple(min(v[i] for v in vs) for i in range(3)));maximum=Vector(tuple(max(v[i] for v in vs) for i in range(3)));center=(minimum+maximum)/2
factor=.80/(maximum.z-minimum.z);transform=Matrix.Scale(factor,4)@Matrix.Translation((-center.x,-center.y,-minimum.z))
for ob in meshes:ob.matrix_world=transform@ob.matrix_world
for ob in bpy.context.selected_objects:ob.select_set(False)
for ob in meshes:ob.select_set(True)
bpy.context.view_layer.objects.active=meshes[0]
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'plant-potted-02.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'potted-plant-02.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT',export_image_format='AUTO',export_texcoords=True,export_normals=True)
vs=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box];bounds={'min':[min(v[i] for v in vs) for i in range(3)],'max':[max(v[i] for v in vs) for i in range(3)]}
triangles=0
for ob in meshes:ob.data.calc_loop_triangles();triangles+=len(ob.data.loop_triangles)
result={'complete':True,'source':'Poly Haven Potted Plant 02, Rico Cilliers, CC0','authoredOriginalByUs':False,'model':'potted-plant-02.glb','heightMeters':.80,'gltfRootPlacement':'Pot bottom anchored at Y=0, centered X/Z; place at(-1.39,.755,-.39) to replace original houseplant','nativeBounds':bounds,'triangles':triangles,'meshObjects':len(meshes),'materialNames':[m.name for m in bpy.data.materials],'textureResolution':'1k original official maps, no AI regeneration','glbBytes':(OUT/'potted-plant-02.glb').stat().st_size,'glbSHA256':hashlib.sha256((OUT/'potted-plant-02.glb').read_bytes()).hexdigest(),'native':'blender/directory-v32-120/plant-potted-02.blend'}
(OUT/'PREPARED.json').write_text(json.dumps(result,indent=2),encoding='utf8');print('PLANT_READY',json.dumps(result),flush=True)
