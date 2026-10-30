import bpy,json
from pathlib import Path
P=Path(__file__).resolve().parents[1];A=P/'assets/odyssey/refit-v147';A.mkdir(exist_ok=True);bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-147/coast-joined-v147.blend'))
for label,native in [('island-carved','Recessed actual island behind scanned cliff'),('coastal_cliff_02-embedded','Embedded coastal_cliff_02'),('coastal_cliff_04-embedded','Embedded coastal_cliff_04')]:
 obs=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith(native)];bpy.ops.object.select_all(action='DESELECT')
 for o in obs:o.select_set(True)
 bpy.context.view_layer.objects.active=obs[0]
 if label!='island-carved':
  tris=sum(sum(len(f.vertices)-2 for f in o.data.polygons) for o in obs)
  for o in obs:
   bpy.context.view_layer.objects.active=o;m=o.modifiers.new('Web coast physical silhouette','DECIMATE');m.ratio=min(1,180000/tris);bpy.ops.object.modifier_apply(modifier=m.name)
  for im in bpy.data.images:
   if im.size[0]>2048:im.scale(2048,2048)
 bpy.ops.export_scene.gltf(filepath=str(A/(label+'.glb')),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_image_format='JPEG',export_jpeg_quality=90)
(A/'coast-layout.json').write_text(json.dumps({'coordinates':'glTF/Three world geometry baked into positions; do not apply the old layouts a second time','island':'island-carved.glb','scans':[{'file':'coastal_cliff_02-embedded.glb','position':[0,0,0],'scale':[1,1,1],'yaw':0},{'file':'coastal_cliff_04-embedded.glb','position':[0,0,0],'scale':[1,1,1],'yaw':0}],'sourceNative':'blender/mythology-v32-147/coast-joined-v147.blend','plantRootsProtected':132},indent=2),encoding='utf-8');print('WEB_CARVED_COAST_READY',flush=True)
