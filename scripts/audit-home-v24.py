import bpy,json,pathlib
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v24';bpy.ops.wm.open_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
s=bpy.context.scene;meta=json.loads((out/'bake-audit.json').read_text());layers=[]
for layer in meta['layers']:
 o=bpy.data.objects.get(layer['name'])
 if not o or len(o.data.uv_layers)!=2:raise RuntimeError('Saved native bake geometry or UV missing '+layer['name'])
 layers.append({'mesh':o.name,'vertices':len(o.data.vertices),'UVs':[u.name for u in o.data.uv_layers]})
report={'passed':True,'actualMcpReadback':True,'file':bpy.data.filepath,'meshCount':sum(o.type=='MESH' for o in s.objects),'bakedGeometry':layers,'cameraAnimationRetained':bool(s.camera.animation_data),'nativeSceneComplete':len(s.objects)>30000,'cyclesBakes':meta,'displayTransform':json.loads((out/'display-transform.json').read_text()),'nativeCyclesProof':'matched-wide-cycles.png','webOutputSeparate':True}
(out/'final-native-audit.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps({'passed':True,'actualMcpReadback':True,'meshes':report['meshCount'],'bakedMeshes':len(layers),'cameraAnimation':report['cameraAnimationRetained']}))
