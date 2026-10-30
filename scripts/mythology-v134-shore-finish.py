import bpy,math,json
from pathlib import Path
from mathutils import Vector,noise
R=Path(__file__).resolve().parents[1];A=R/'assets/odyssey/compact-v134';O=R/'blender/mythology-v32-134'
bpy.ops.wm.open_mainfile(filepath=str(O/'compact-cove-lighting.blend'))
land=bpy.data.objects['V133_ISLAND'];mesh=land.data
def smooth(a,b,x):
 t=max(0,min(1,(x-a)/(b-a)));return t*t*(3-2*t)
for v in mesh.vertices:
 x,y,z=v.co
 if z>1:
  front=(1-smooth(35,53,y))*(1-smooth(-1,24,x))
  fissure=noise.noise(Vector((x*.29,y*.23,3.1)))*.7
  stepped=z*.78+5.5*smooth(5,8.5,z+fissure)
  v.co.z=z+(stepped-z)*front
mesh.update()
def height(x,y):
 u=max(0,min(115.999,(x+56)/103*116));v=max(0,min(115.999,(y+4)/90*116));i,j=int(u),int(v);a,b=u-i,v-j
 return sum(mesh.vertices[(j+dy)*117+i+dx].co.z*w for dx,dy,w in [(0,0,(1-a)*(1-b)),(1,0,a*(1-b)),(0,1,(1-a)*b),(1,1,a*b)])
placements=[]
for ob in bpy.context.scene.objects:
 if ob.name.startswith(('V133 tree ','V133 shrub ')):
  ob.location.z=height(ob.location.x,ob.location.y)-.12
  placements.append({'name':ob.name,'prototype':int(ob.name[-1]),'position':[ob.location.x,ob.location.z,-ob.location.y],'scale':list(ob.scale),'angle':-ob.rotation_euler.z})
(A/'vegetation.json').write_text(json.dumps(placements))
grass=bpy.data.objects['V133 elevation-limited coastal grasses']
# Re-root the triangles, preserving their blade heights and cluster positions.
for poly in grass.data.polygons:
 verts=[grass.data.vertices[i] for i in poly.vertices];x=sum(v.co.x for v in verts)/3;y=sum(v.co.y for v in verts)/3;bottom=min(v.co.z for v in verts);delta=height(x,y)-bottom-.02
 for v in verts:v.co.z+=delta
grass.data.update()
(A/'height.json').write_text(json.dumps({'size':117,'bounds':[-56,47,-4,86],'heights':[v.co.z for v in mesh.vertices]}))
bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove-lighting.blend'))
for name,ob in [('island.glb',land),('grass.glb',grass)]:
 bpy.ops.object.select_all(action='DESELECT');ob.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(A/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_cameras=False,export_lights=False)
(A/'shore-form.json').write_text(json.dumps({'footprintUnchanged':[103,90],'frontHeadland':'asymmetric eroded limestone shelf','vegetationAndGrassRegrounded':True,'nativeSaved':True},indent=2))
