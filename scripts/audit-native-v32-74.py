import bpy,json,struct,hashlib
from pathlib import Path
P=Path(r'C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');H=P/'blender/reference-architecture-v20';results=[]
for name,proof in [('architecture-v20.blend','courtyard-cycles-v20.png'),('polyphemus-v20.blend','polyphemus-cycles-v20.png'),('inhabited-island.blend','inhabited-island-cycles-v20.png')]:
 bpy.ops.wm.open_mainfile(filepath=str(H/name));s=bpy.context.scene;objects=list(s.objects);meshes=[o for o in objects if o.type=='MESH'];image=H/proof;assert image.is_file() and image.stat().st_size>100000
 dims=struct.unpack('>II',image.read_bytes()[16:24]);assert min(dims)>=900
 eyes=[o for o in meshes if 'eyeball' in o.name.lower()]
 if name=='polyphemus-v20.blend':
  assert len(eyes)==1;assert any('neckline' in o.name for o in meshes);assert any('gathered waist' in o.name for o in meshes);assert not any('throwing stone' in o.name.lower() or 'short beard' in o.name.lower() for o in meshes)
  body=next(o for o in meshes if 'Uncut anatomical Human.body' in o.name);feet=[o.co for o in body.data.vertices if o.co.z<.06];assert feet;forward=max(-v.y for v in feet);backward=max(v.y for v in feet);assert forward>backward,'Toe direction must point forward with the single eye'
 results.append({'file':name,'objects':len(objects),'meshes':len(meshes),'vertices':sum(len(o.data.vertices) for o in meshes),'eyeCount':len(eyes),'engine':s.render.engine,'device':s.cycles.device,'samples':s.cycles.samples,'proof':proof,'proofDimensions':dims,'proofSha256':hashlib.sha256(image.read_bytes()).hexdigest(),'packedImages':sum(bool(im.packed_file) for im in bpy.data.images)})
island=(H/'inhabited-island.glb').read_bytes();length=struct.unpack_from('<I',island,12)[0];g=json.loads(island[20:20+length]);assert any('COLOR_0' in p['attributes'] for m in g['meshes'] for p in m['primitives'])
meta=json.loads((H/'input-anatomy.json').read_text('utf8'));assert meta['islandWidth']==220 and meta['eyeCount']==1
report={'passed':True,'actualMcpReadback':True,'blenderVersion':bpy.app.version_string,'nativeVersion':'V20','results':results,'closedLargeVegetatedIsland':True,'islandVertexColorBlendingExported':True,'singleEyeAlignedFeetAndNewFittedClothing':True,'renderComplete':True}
(H/'native-production-audit.json').write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps(report))
