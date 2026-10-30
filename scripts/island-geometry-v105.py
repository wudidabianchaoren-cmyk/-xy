import bpy,bmesh,json,math
from pathlib import Path
from mathutils import Vector,noise
root=Path.cwd();out=root/'blender/mythology-v32-105';out.mkdir(parents=True,exist_ok=True)
data=json.loads((root/'.verify/v32-104/web-native-input.json').read_text(encoding='utf8'))
bpy.ops.wm.read_factory_settings(use_empty=True)
verts=[];faces=[]
for item in data['meshes']:
 if item['key'] not in ['native84_19','native84_20','native84_21','native84_22']:continue
 offset=len(verts);a=item['vertices'];verts.extend((a[i],-a[i+2],a[i+1]) for i in range(0,len(a),3))
 index=item['index'] or list(range(len(a)//3));faces.extend(tuple(offset+j for j in index[i:i+3]) for i in range(0,len(index),3))
mesh=bpy.data.meshes.new('V105 continuous original island / welded material boundaries');mesh.from_pydata(verts,[],faces);mesh.update()
bm=bmesh.new();bm.from_mesh(mesh);before=len(bm.verts)
bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.003)
welded=before-len(bm.verts)
# Undo the extra V95 Gaussian uplift; it made a disconnected conical mound.
for v in bm.verts:
 x,z,y=v.co.x,-v.co.y,v.co.z
 if y<=3:continue
 uplift=27*math.exp(-((x+107)/66)**2-((-z-178)/45)**2)+18*math.exp(-((x+12)/42)**2-((-z-183)/36)**2)
 lo,hi=0,y
 for _ in range(26):
  mid=(lo+hi)/2;t=max(0,min(1,(mid-7)/13));t=t*t*(3-2*t)
  if mid+uplift*t>y:hi=mid
  else:lo=mid
 base=(lo+hi)/2
 # Retain coves/cave and shore. The inland terrain becomes a low connected headland.
 v.co.z=base if base<8 else 8+(base-8)*.73
# Refinement gives erosion a continuous surface instead of amplifying coarse square cells.
bmesh.ops.subdivide_edges(bm,edges=list(bm.edges),cuts=1,use_grid_fill=True)
upper=[v for v in bm.verts if v.co.z>2.7]
for _ in range(3):bmesh.ops.smooth_vert(bm,verts=upper,factor=.42,use_axis_x=False,use_axis_y=False,use_axis_z=True)
for v in upper:
 x,z,h=v.co.x,-v.co.y,v.co.z
 t=max(0,min(1,(h-3)/11));t=t*t*(3-2*t)
 coarse=noise.fractal(Vector((x*.026,z*.026,1.7)),.9,2.13,3)
 fine=noise.fractal(Vector((x*.17,z*.17,7.3)),.85,2.2,2)
 # Broad irregular erosion and subtle fractured strata, not a regular sine/grid field.
 v.co.z+=t*(coarse*1.05+fine*.22)
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free();mesh.update()
for p in mesh.polygons:p.use_smooth=True
obj=bpy.data.objects.new('V105 welded low island / original closed coves and cave',mesh);bpy.context.collection.objects.link(obj)
material=bpy.data.materials.new('V105 continuous ground / webpage photographs applied after import');material.diffuse_color=(.39,.36,.29,1);obj.data.materials.append(material)
bpy.context.view_layer.objects.active=obj;obj.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'island-geometry-v105.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'island-geometry-v105.glb'),export_format='GLB',use_selection=True,export_yup=True,export_normals=True,export_texcoords=False,export_materials='EXPORT')
audit={'actualBlender':bpy.app.version_string,'source':'V104 actual four surface parts; same shoreline and cave','verticesBeforeWelding':before,'weldedSeamVertices':welded,'vertices':len(mesh.vertices),'triangles':sum(len(p.vertices)-2 for p in mesh.polygons),'heightMin':min(v.co.z for v in mesh.vertices),'heightMax':max(v.co.z for v in mesh.vertices),'operations':['weld four photographic-material parts','reverse V95 extra Gaussian uplift','lower inland rise','subdivide once','smooth height only three passes','irregular noise erosion','recalculate shared normals'],'newImagesOrDownloads':False}
(out/'geometry-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit),flush=True)
