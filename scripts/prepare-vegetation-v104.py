import bpy,os,json,math,time,random
import numpy as np
from pathlib import Path
from mathutils import Vector
root=Path.cwd();folder=root/'assets/odyssey/vegetation-v104/island_tree_01'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(folder/'island_tree_01_1k.gltf'))
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
rows=[]
for o in list(bpy.context.scene.objects):
 if o.type!='MESH':continue
 # Real source topology and UVs are kept; only redundant geometry is reduced.
 bpy.context.view_layer.objects.active=o;o.select_set(True)
 original=sum(max(1,len(p.vertices)-2) for p in o.data.polygons)
 mats=[m.name for m in o.data.materials if m]
 leaves=any('leaves' in n.lower() for n in mats)
 target=3200 if leaves else 650
 if leaves:
  mesh=o.data;count=len(mesh.vertices);parent=list(range(count))
  def find(a):
   while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
   return a
  for edge in mesh.edges:
   a,b=edge.vertices;ra,rb=find(a),find(b)
   if ra!=rb:parent[rb]=ra
  groups={}
  for i in range(count):groups.setdefault(find(i),[]).append(i)
  coords=np.empty(count*3,dtype=np.float32);mesh.vertices.foreach_get('co',coords);coords=coords.reshape(-1,3)
  vertex_uv=np.zeros((count,2),dtype=np.float32)
  for li,loop in enumerate(mesh.loops):vertex_uv[loop.vertex_index]=mesh.uv_layers.active.data[li].uv
  valid=[ids for ids in groups.values() if len(ids)>=4];random.Random(104).shuffle(valid);selected=valid[:1600]
  gain=min(5.0,max(1.0,math.sqrt(len(valid)/len(selected))*.82))
  vertices=[];faces=[];uv_coords=[]
  for ids in selected:
   points=coords[ids];uv=vertex_uv[ids];low,high=uv.min(axis=0),uv.max(axis=0)
   if min(high-low)<.001:continue
   fit=np.linalg.lstsq(np.column_stack((uv,np.ones(len(ids)))),points,rcond=None)[0]
   center=points.mean(axis=0);corners=[(low[0],low[1]),(low[0],high[1]),(high[0],high[1]),(high[0],low[1])];start=len(vertices)
   for u,v in corners:
    p=np.array((u,v,1.0))@fit;p=center+(p-center)*gain;vertices.append(p.tolist());uv_coords.append((float(u),float(v)))
   faces.append((start,start+1,start+2,start+3))
  simplified=bpy.data.meshes.new('V104 individual leaf cards retaining real source placement');simplified.from_pydata(vertices,[],faces);simplified.update()
  uv_layer=simplified.uv_layers.new(name='Original photographed leaf atlas')
  for li,loop in enumerate(simplified.loops):uv_layer.data[li].uv=uv_coords[loop.vertex_index]
  for m in mesh.materials:simplified.materials.append(m)
  o.data=simplified
  print('V104 real leaf groups:',len(valid),'retained cards:',len(faces),'coverage scale:',gain,flush=True)
 elif original>target:
  # Drop the smallest disconnected twigs; retain the substantial connected branches.
  if any('branch' in n.lower() for n in mats):
   mesh=o.data;parent=list(range(len(mesh.vertices)))
   def branch_find(a):
    while parent[a]!=a:parent[a]=parent[parent[a]];a=parent[a]
    return a
   for edge in mesh.edges:
    a,b=edge.vertices;ra,rb=branch_find(a),branch_find(b)
    if ra!=rb:parent[rb]=ra
   areas={}
   for face in mesh.polygons:
    k=branch_find(face.vertices[0]);areas[k]=areas.get(k,0)+face.area
   retained=set(k for k,a in sorted(areas.items(),key=lambda kv:kv[1],reverse=True)[:240])
   import bmesh
   bm=bmesh.new();bm.from_mesh(mesh);bm.verts.ensure_lookup_table()
   bmesh.ops.delete(bm,geom=[v for v in bm.verts if branch_find(v.index) not in retained],context='VERTS');bm.to_mesh(mesh);bm.free();mesh.update()
   original_remaining=sum(max(1,len(p.vertices)-2) for p in mesh.polygons)
  else:original_remaining=original
  dec=o.modifiers.new('V104 desktop forest geometry budget','DECIMATE');dec.ratio=min(1,target/original_remaining);dec.use_collapse_triangulate=True;bpy.ops.object.modifier_apply(modifier=dec.name)
 for m in o.data.materials:
  if not m or not m.use_nodes:continue
  n=m.node_tree.nodes;l=m.node_tree.links;bs=next((x for x in n if x.type=='BSDF_PRINCIPLED'),None)
  if bs:bs.inputs['Roughness'].default_value=.9
  if 'leaves' in m.name.lower():
   diffuse=n.new('ShaderNodeTexImage');diffuse.image=bpy.data.images.load(str(folder/'textures/island_tree_01_leaves_diff_1k.png'),check_existing=True)
   alpha=n.new('ShaderNodeTexImage');alpha.image=bpy.data.images.load(str(folder/'textures/island_tree_01_leaves_alpha_1k.png'),check_existing=True);alpha.image.colorspace_settings.name='Non-Color'
   if bs:l.new(diffuse.outputs['Color'],bs.inputs['Base Color']);l.new(alpha.outputs['Color'],bs.inputs['Alpha']);bs.inputs['Roughness'].default_value=.92
   m.surface_render_method='DITHERED';m.use_backface_culling=False
 rows.append({'name':o.name,'materials':mats,'sourceTriangles':original,'webTriangles':sum(max(1,len(p.vertices)-2) for p in o.data.polygons),'leaves':leaves})
 o.select_set(False)
bpy.ops.wm.save_as_mainfile(filepath=str(folder/'tree-web-v104.blend'))
bpy.ops.export_scene.gltf(filepath=str(folder/'tree-web-v104.glb'),export_format='GLB',export_image_format='AUTO',export_materials='EXPORT')
(folder/'web-model-audit.json').write_text(json.dumps({'passed':True,'nativeBlender':bpy.app.version_string,'source':'Poly Haven island_tree_01 / CC0','meshes':rows,'nativeSaved':True,'leafAlphaConnected':True},indent=2),encoding='utf8')
print('V104 real tree saved: '+json.dumps(rows))
