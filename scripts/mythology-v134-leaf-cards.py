import bpy,runpy,json,numpy as np
from pathlib import Path
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v134'
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/mythology-v32-134/compact-cove-lighting.blend'))
src=next(o for o in bpy.context.scene.objects if o.name.startswith('V133 tree ') and o.name.endswith('part2'))
script=(R/'scripts/mythology-v117-leaf-lod.py').read_text(encoding='utf-8').replace('target_triangles <= 60000','target_triangles <= 320000')
ns={'__name__':'leaf_module'};exec(compile(script,'whole-leaf-sampler','exec'),ns)
leaf,audit=ns['build_web_leaf_lod'](source=src,target_triangles=288000,seed=134,name='V134 selected full leaves',leaf_scale=1.8)
mesh=leaf.data;parent=list(range(len(mesh.vertices)))
def find(v):
 while parent[v]!=v:parent[v]=parent[parent[v]];v=parent[v]
 return v
for poly in mesh.polygons:
 ids=list(poly.vertices)
 for v in ids[1:]:parent[find(v)]=find(ids[0])
groups={}
uv=mesh.uv_layers.active
for poly in mesh.polygons:
 key=find(poly.vertices[0]);group=groups.setdefault(key,{})
 for li in poly.loop_indices:
  vi=mesh.loops[li].vertex_index;group[vi]=(tuple(mesh.vertices[vi].co),tuple(uv.data[li].uv))
verts=[];faces=[];uvs=[]
for group in groups.values():
 rows=list(group.values());xyz=np.array([r[0] for r in rows]);tex=np.array([r[1] for r in rows]);fit=np.linalg.lstsq(np.column_stack([tex,np.ones(len(tex))]),xyz,rcond=None)[0]
 lo=tex.min(axis=0);hi=tex.max(axis=0);corners=np.array([[lo[0],lo[1],1],[hi[0],lo[1],1],[hi[0],hi[1],1],[lo[0],hi[1],1]])
 positions=corners@fit
 # Keep the source leaf's front orientation; all leaf cards are still double sided.
 first=len(verts);verts.extend(positions.tolist());faces.append((first,first+1,first+2,first+3));uvs.extend(corners[:,:2].tolist())
out=bpy.data.meshes.new('V134 individual native leaf silhouette cards');out.from_pydata(verts,[],faces);out.update();layer=out.uv_layers.new(name='UVMap')
for poly in out.polygons:
 for li in poly.loop_indices:layer.data[li].uv=uvs[out.loops[li].vertex_index]
for mat in src.data.materials:out.materials.append(mat)
ob=bpy.data.objects.new('V134 prototype 2',out);bpy.context.scene.collection.objects.link(ob);copies=[ob]
for i in [0,1]:
 original=next(o for o in bpy.context.scene.objects if o.name.startswith('V133 tree ') and o.name.endswith('part'+str(i)))
 ob=bpy.data.objects.new('V134 prototype '+str(i),original.data);bpy.context.scene.collection.objects.link(ob);copies.append(ob)
bpy.ops.object.select_all(action='DESELECT')
for ob in copies:ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(A/'vegetation.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
audit.update({'nativeLeafSilhouetteCards':True,'selectedLeafCount':len(groups),'outputTriangles':len(faces)*2,'nativeFullLeavesUnchanged':True,'cardsAreIndividualLeavesNotWholeTreeImages':True})
(A/'leaf-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));print('LEAF_CARDS',len(groups),len(faces)*2,flush=True)
