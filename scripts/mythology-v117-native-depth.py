import bpy,math,json
from mathutils import Vector
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-117';sc=bpy.context.scene
# Distant silhouettes fill the native-world horizon; this does not modify the live web sea.
for band in range(3):
 vv=[];ff=[];N=120
 for j in range(5):
  for i in range(N+1):
   x=-1100+i*1800/N;y=430+band*230+j*65;z=-1 if j in (0,4) else (55+35*math.sin(x*.009+band)+21*math.sin(x*.023+band*.7))*math.sin(j/4*math.pi)
   vv.append((x,y,z))
 for j in range(4):
  for i in range(N):a=j*(N+1)+i;ff.append((a,a+1,a+N+2,a+N+1))
 me=bpy.data.meshes.new('V117 native distant coastal ridge');me.from_pydata(vv,[],ff);me.update();ob=bpy.data.objects.new('V117 distant atmospheric ridge '+str(band),me);sc.collection.objects.link(ob)
 ma=bpy.data.materials.new('V117 distant ridge aerial depth '+str(band));ma.use_nodes=True;bs=next(n for n in ma.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=(.10+band*.025,.15+band*.027,.17+band*.03,1);bs.inputs['Roughness'].default_value=1;me.materials.append(ma)
 for f in me.polygons:f.use_smooth=True
sc.camera.rotation_euler=(Vector((-105,130,11))-sc.camera.location).to_track_quat('-Z','Y').to_euler()
sc.cycles.samples=64;sc.render.filepath=str(O/'cycles-final-1920.png');bpy.ops.wm.save_as_mainfile(filepath=str(O/'08-final-local-world.blend'));bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('NATIVE_FINAL_HORIZON_COMPOSITION_INVOKED')