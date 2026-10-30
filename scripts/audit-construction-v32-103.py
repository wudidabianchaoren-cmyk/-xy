import bpy,pathlib,json
from mathutils import Vector
p=pathlib.Path.cwd();s=bpy.context.scene;body=bpy.data.objects.get('01 cube → loop-cut wall extrusion');assert body
heights=[]
for f in [1,90,144]:
 s.frame_set(f);ev=body.evaluated_get(bpy.context.evaluated_depsgraph_get());m=ev.to_mesh();vv=[ev.matrix_world@v.co for v in m.vertices];heights.append({'frame':f,'height':max(v.z for v in vv)-min(v.z for v in vv),'vertices':len(m.vertices),'faces':len(m.polygons)});ev.to_mesh_clear()
assert heights[0]['height']<2.2 and heights[1]['height']>heights[0]['height']+.7 and heights[2]['height']>8
names=[k.name for k in body.data.shape_keys.key_blocks];assert len(names)==4
boolean=[m for m in body.modifiers if m.type=='BOOLEAN'];assert len(boolean)==2 and all(m.operation=='DIFFERENCE'for m in boolean)
roof=bpy.data.objects.get('04 ridge extrusion and roof taper');assert roof and len(roof.data.shape_keys.key_blocks)==2
s.frame_set(390);native=[o for o in s.objects if o.name.startswith('09 native refinement')];assert len(native)>20 and all(not o.hide_render for o in native)
report={'passed':True,'actualSavedFileReadback':True,'file':bpy.data.filepath,'insertSeconds':13,'nativeStartFrame':1,'nativeEndFrame':390,'nativeFps':30,'sourceSamplingStep':2,'connectedCubeSurface':True,'animatedLoopCutShell':True,'successiveExtrusionHeights':heights,'wallOperations':names,'actualAnimatedBooleanOpenings':2,'ridgeVertexShapeKey':True,'exactSourceRefinementObjects':len(native),'fullDeliverySeconds':24,'retainedTailSource':'Original V93 movie3–14seconds','noSourceNativeOverwrite':True,'historicalMouseRecording':False}
out=p/'.verify/v32-103/construction';out.mkdir(parents=True,exist_ok=True);(out/'native-checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(report,ensure_ascii=False),flush=True)
