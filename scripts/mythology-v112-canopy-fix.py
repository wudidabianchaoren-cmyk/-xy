"""Correct per-material canopy LOD; never decimate the entire scanned tree as bark."""
import bpy,json
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112';scene=bpy.context.scene
forest=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession']
origins={}
for o in forest.objects:
 if o.name.startswith(('V112 tree','V112 shrub')):
  key=' '.join(o.name.split()[:3]);origins[key]={'location':o.location.copy(),'rotation':o.rotation_euler.copy(),'scale':o.scale.copy()}
old=[o for o in forest.objects if o.name.startswith(('V112 tree','V112 shrub'))]
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/vegetation-v104/island_tree_01/island_tree_01_1k.gltf'))
original=[o for o in scene.objects if o not in before];meshes=[o for o in original if o.type=='MESH'];points=[o.matrix_world@v.co for o in meshes for v in o.data.vertices];lo=Vector(tuple(min(p[k] for p in points) for k in range(3)));hi=Vector(tuple(max(p[k] for p in points) for k in range(3)));th=hi.z-lo.z;center=Vector(((hi.x+lo.x)/2,(hi.y+lo.y)/2,lo.z))
for src in meshes:
 bpy.ops.object.select_all(action='DESELECT');src.select_set(True);bpy.context.view_layer.objects.active=src;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
parts=[o for o in scene.objects if o not in before and o.type=='MESH'];protos=[];audit=[]
for src in parts:
 bpy.ops.object.select_all(action='DESELECT');src.select_set(True);bpy.context.view_layer.objects.active=src
 tri=sum(len(p.vertices)-2 for p in src.data.polygons);mat=src.active_material;limit=28000 if mat and 'leaves' in mat.name.lower() else 5500
 if tri>limit:
  dec=src.modifiers.new('V112 per material canopy LOD','DECIMATE');dec.ratio=limit/tri;bpy.ops.object.modifier_apply(modifier=dec.name)
 data=src.data.copy();matrix=src.matrix_world.copy()
 for v in data.vertices:v.co=(matrix@v.co-center)/th
 data.update()
 if mat and mat.use_nodes:
  bs=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Roughness'].default_value=.87
  if 'leaves' in mat.name.lower():bs.inputs['Subsurface Weight'].default_value=.045;mat.use_backface_culling=False
 protos.append(data);audit.append({'part':mat.name if mat else src.name,'triangles':sum(len(p.vertices)-2 for p in data.polygons)})
for o in old:bpy.data.objects.remove(o,do_unlink=True)
for key,p in origins.items():
 for k,data in enumerate(protos):
  o=bpy.data.objects.new(key+' part'+str(k),data);forest.objects.link(o);o.location=p['location'];o.rotation_euler=p['rotation'];o.scale=p['scale']
for o in list(scene.objects):
 if o not in before and o.name not in forest.objects:bpy.data.objects.remove(o,do_unlink=True)
(OUT/'canopy-lod-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'instances':len(origins),'perMaterialPrototype':audit,'previousIncorrectCombinedPrototypeTriangles':5342,'newPrototypeTriangles':sum(p['triangles'] for p in audit)},indent=2),encoding='utf8')
print('V112_CANOPY_CORRECTED',json.dumps(audit))
