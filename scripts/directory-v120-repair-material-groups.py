import bpy,json,hashlib,struct
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v120';NATIVE=ROOT/'blender/directory-v32-120'
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'))
atlas=bpy.data.objects['room-static'];export=bpy.data.objects['room-static-export']
assert len(atlas.data.polygons)==len(export.data.polygons)
for p,q in zip(export.data.polygons,atlas.data.polygons):p.material_index=q.material_index
for o in bpy.context.selected_objects:o.select_set(False)
export.hide_set(False);export.select_set(True);bpy.context.view_layer.objects.active=export
bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_texcoords=True,export_normals=True,export_materials='EXPORT')
export.hide_set(True);bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
d=(OUT/'room-static.glb').read_bytes();length=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+length]);used=sorted(set(p['material'] for m in g['meshes'] for p in m['primitives']))
assert len(used)>10
r={'materialGroupsRestored':True,'materialGroups':len(used),'primitives':sum(len(m['primitives']) for m in g['meshes']),'materials':[{'name':m.get('name'),'roughness':m.get('pbrMetallicRoughness',{}).get('roughnessFactor',1),'metalness':m.get('pbrMetallicRoughness',{}).get('metallicFactor',1)} for m in g['materials']],'glbSHA256':hashlib.sha256(d).hexdigest(),'nativeSHA256':hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest()}
(OUT/'material-groups.json').write_text(json.dumps(r,indent=2),encoding='utf8');print(json.dumps(r),flush=True)
