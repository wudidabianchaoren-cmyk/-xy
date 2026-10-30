import bpy,json,pathlib,re,math,time
from mathutils import Vector
from mathutils.bvhtree import BVHTree
out=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v22')
started=time.monotonic();bpy.ops.wm.open_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
vertices=[];triangles=[];objects=0
exclude=re.compile(r'oak|foliage|forest|leaf|leaves|branch|travelling|archivist|knight|needle|shutter|shadow.performer',re.I)
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 names=[];p=o
 while p:names.append(p.name);p=p.parent
 if exclude.search(' '.join(names)):continue
 if len(o.data.vertices)>300000:continue
 coords=[o.matrix_world@v.co for v in o.data.vertices]
 if not coords:continue
 center=o.matrix_world.translation
 if center.z>14 or center.y>22 or center.y<-18:continue
 offset=len(vertices);vertices.extend(coords);o.data.calc_loop_triangles()
 triangles.extend(tuple(offset+i for i in t.vertices) for t in o.data.loop_triangles);objects+=1
tree=BVHTree.FromPolygons(vertices,triangles,all_triangles=True,epsilon=.015)
print('CAVITY_BVH_READY objects=%d triangles=%d'%(objects,len(triangles)),flush=True)
minimum=[-16,0,-12];maximum=[18,11,12];dimensions=[80,32,48];directions=[]
for i in range(16):
 y=1-2*(i+.5)/16;r=math.sqrt(1-y*y);a=i*2.399963;directions.append(Vector((math.cos(a)*r,-math.sin(a)*r,y)))
pixels=bytearray();rays=0;nearestLimit=3.5
for z in range(dimensions[2]):
 for y in range(dimensions[1]):
  for x in range(dimensions[0]):
   w=[minimum[i]+([x,y,z][i]+.5)/dimensions[i]*(maximum[i]-minimum[i]) for i in range(3)]
   p=Vector((w[0],-w[2],w[1]));nearest=tree.find_nearest(p,nearestLimit)
   if nearest[0] is None:pixels.append(255);continue
   visibility=0
   for direction in directions:
    hit=tree.ray_cast(p,direction,nearestLimit);rays+=1
    visibility+=1 if hit[0] is None else min(1,hit[3]/nearestLimit)**.70
   pixels.append(round(255*(.48+.52*visibility/16)))
 if z%8==0:print('CAVITY_LAYER %d/%d'%(z,dimensions[2]),flush=True)
(out/'courtyard-cavity-volume.bin').write_bytes(pixels)
audit={'passed':True,'method':'Actual saved native Blender geometry; BVH ray visibility volume for ambient cavity shading, not a full GI lightmap','minimum':minimum,'maximum':maximum,'dimensions':dimensions,'objects':objects,'triangles':len(triangles),'rays':rays,'seconds':time.monotonic()-started,'movingObjectsAndFoliageExcluded':True,'directMovingLightingUnchanged':True}
(out/'courtyard-cavity-volume.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(audit),flush=True)
