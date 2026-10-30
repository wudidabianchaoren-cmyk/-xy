import bpy,json,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v145';O=P/'blender/mythology-v32-145';report=[]
for name in ['coastal_cliff_02','coastal_cliff_04','coast_rocks_02']:
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(P/f'assets/odyssey/source-v145/{name}/{name}_4k.gltf'));bpy.context.view_layer.update()
 obs=[o for o in bpy.context.scene.objects if o.type=='MESH'];pts=[o.matrix_world@Vector(v) for o in obs for v in o.bound_box];lo=Vector([min(p[i] for p in pts) for i in range(3)]);hi=Vector([max(p[i] for p in pts) for i in range(3)]);center=(lo+hi)/2
 for ob in obs:ob.location-=Vector((center.x,center.y,lo.z));ob.name='V145 '+name
 bpy.context.view_layer.update();bpy.ops.wm.save_as_mainfile(filepath=str(O/(name+'-source.blend')))
 bpy.ops.export_scene.fbx(filepath=str(A/(name+'-nanite.fbx')),use_selection=False,object_types={'MESH'},add_leaf_bones=False,bake_anim=False,path_mode='COPY',embed_textures=False,axis_forward='-Y',axis_up='Z')
 before=sum(sum(len(f.vertices)-2 for f in o.data.polygons) for o in obs)
 for ob in obs:
  bpy.context.view_layer.objects.active=ob;ob.select_set(True);mod=ob.modifiers.new('Web silhouette budget','DECIMATE');mod.ratio=min(1.,180000/before);bpy.ops.object.modifier_apply(modifier=mod.name)
 for image in bpy.data.images:
  if image.size[0]>2048:image.scale(2048,2048)
 bpy.ops.export_scene.gltf(filepath=str(A/(name+'-web.glb')),export_format='GLB',use_selection=False,export_apply=True,export_image_format='JPEG',export_jpeg_quality=92)
 after=sum(sum(len(f.vertices)-2 for f in o.data.polygons) for o in obs);report.append({'source':name,'nativeTriangles':before,'webTriangles':after,'size':list(hi-lo),'webBytes':(A/(name+'-web.glb')).stat().st_size,'pbr':'photogrammetry / true albedo normal roughness / no baked illumination','license':'CC0'})
 (A/'scans.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print('SCAN_READY',report[-1],flush=True)
