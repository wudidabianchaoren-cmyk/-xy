"""Keep the accepted vessel and ports; replace only twelve disconnected paddle blades."""
import bpy,json,math
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/crew-v163';A.mkdir(exist_ok=True);O=P/'blender/mythology-v32-163';O.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-162/vessel-oarports.blend'));old=[o for o in bpy.context.scene.objects if o.type=='MESH'and'oar blade'in o.name.lower()];assert len(old)==12;material=old[0].active_material
for ob in old:bpy.data.objects.remove(ob,do_unlink=True)
records=json.loads((P/'assets/odyssey/refit-v146/crew-grip-v148.json').read_text())['grips'];report=[]
for r in records:
 root=Vector(r['seaEnd']);axis=(root-Vector(r['newInner'])).normalized();normal=Vector((0,0,1));side=axis.cross(normal).normalized();normal=side.cross(axis).normalized();sections=[(-.10,.035),(.00,.045),(.12,.08),(.31,.125),(.64,.125),(.80,.075),(.85,.025)];vv=[]
 for distance,width in sections:
  for sign,depth in[(-1,-1),(1,-1),(1,1),(-1,1)]:vv.append(root+axis*distance+side*width*sign+normal*.015*depth)
 faces=[(j*4+i,j*4+(i+1)%4,(j+1)*4+(i+1)%4,(j+1)*4+i)for j in range(len(sections)-1)for i in range(4)];faces+=[(3,2,1,0),tuple((len(sections)-1)*4+i for i in range(4))];data=bpy.data.meshes.new('Connected ash blade');data.from_pydata(vv,[],faces);data.update();o=bpy.data.objects.new('V163 connected ash paddle blade '+str(r['actor']),data);bpy.context.scene.collection.objects.link(o);data.materials.append(material);uv=data.uv_layers.new()
 for poly in data.polygons:
  for li in poly.loop_indices:
   v=data.vertices[data.loops[li].vertex_index].co-root;uv.data[li].uv=(v.dot(side)*2+.5,v.dot(axis)*1.5)
 bevel=o.modifiers.new('Worn rounded paddle edges','BEVEL');bevel.width=.006;bevel.segments=2;bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.modifier_apply(modifier=bevel.name);o.select_set(False);report.append({'actor':r['actor'],'shaftEnd':list(root),'bladeRootOverlapMeters':.10,'sameAxis':list(axis)})
bpy.ops.object.select_all(action='DESELECT');objects=[o for o in bpy.context.view_layer.objects if o.type=='MESH']
for o in objects:o.hide_set(False);o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.wm.save_as_mainfile(filepath=str(O/'vessel-coherent.blend'));bpy.ops.export_scene.gltf(filepath=str(A/'vessel-coherent.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True);bpy.ops.object.join();bpy.context.object.name='V163 coherent vessel and twelve connected oar blades';bpy.ops.export_scene.gltf(filepath=str(A/'vessel-coherent-ue.glb'),export_format='GLB',use_selection=True,export_animations=False,export_yup=True);(P/'.verify/v32-163/oar-correction.json').write_text(json.dumps({'removedDetachedBlades':len(old),'newBlades':report,'originalV162AndIslandPreserved':True},indent=2));print('V163_CONNECTED_BLADES',len(report),flush=True)
