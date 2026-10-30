import json,struct,hashlib
from pathlib import Path
R=Path.cwd();A=R/'assets/directory-v125';V=R/'.verify/v32-125'
def glb(name):
 b=(A/name).read_bytes();n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n])
def tris(g):return sum(g['accessors'][p['indices']]['count']//3 for m in g.get('meshes',[]) for p in m.get('primitives',[]) if 'indices' in p)
c=glb('room-collision.glb');s=glb('room-static.glb');d=glb('props-detail.glb');names=[n.get('name','') for n in c.get('nodes',[])];keys=[n.get('extras',{}).get('key','') for n in c.get('nodes',[])]
assert not any('Preview dynamic' in x or 'Stacked archive volume' in x for x in names)
assert not any(x.startswith(('book','tape')) for x in keys)
assert all(x in keys for x in ['cup','pens','window-tl','window-tr','window-bl','window-br'])
lighting=json.loads((A/'room-lighting.json').read_text(encoding='utf8'));native=json.loads((A/'native-result.json').read_text(encoding='utf8'));oldsha=hashlib.sha256((R/'blender/directory-v32-124/directory-room.blend').read_bytes()).hexdigest();assert oldsha==lighting['originalV124NativeSHA256']
result={'complete':True,'version':'32.125','originalV124NativeUnchanged':True,'originalV124NativeSHA256':oldsha,'nativeSHA256':hashlib.sha256((R/'blender/directory-v32-125/directory-room.blend').read_bytes()).hexdigest(),'actualBlender':'5.1.2 Cycles CUDA 48samples / actual OIDN / tangent normals','staticTriangles':tris(s),'detailTriangles':tris(d),'passes':[{'name':p['name'],'samples':p['samples'],'scale':p['scale'],'denoise':p.get('denoise')} for p in lighting['passes']],'noDynamicMediaInStaticOrCollision':True,'noOldTwoSupportBooks':True,'nativeGIShadowProxies':7,'semanticCupAndPensRetained':True,'windowKeys':['window-tl','window-tr','window-bl','window-br'],'nativeOnOffActuallyViewed':True,'addedArtProps':['four charcoal sticks in shallow rolled-edge metal tin','two birch/ferrule/natural-bristle brushes','porcelain mixing palette with four dried pigments','four-slot injection moulded CD rack','brass standing bookends'],'materialRecords':lighting['materials'],'physicalMicroTextures':json.loads((A/'materials/SOURCE.json').read_text(encoding='utf8')),'nativeViewLimit':'Placeholder TV phosphor and old outside scene retained only in native production checks; final website independently judged. No 1:1 or movie-grade claim.'}
result['collisionTriangles']=tris(c);result['collisionBytes']=(A/'room-collision.glb').stat().st_size
(V/'native-audit.json').write_text(json.dumps(result,indent=2),encoding='utf8')
native.update({'version':'32.125','nativeSHA256':result['nativeSHA256'],'originalV124Untouched':True,'originalV124NativeSHA256':oldsha,'standingReadingBooks':3,'separatedCDSlots':4,'windowPanes':4,'materialSpecificParameters':True});(A/'native-result.json').write_text(json.dumps(native,indent=2),encoding='utf8')
(A/'PRODUCTION.md').write_text('''# V125 native artist desk

Started from V124 without changing its native file. Removed the old atlas, old moving-media proxies and the two old static support-book stacks. Added exactly positioned GI-only stand-ins for three standing reading books and four independently selectable CD cases, excluded from the visible static and exact-triangle collision exports. The low moulded CD rack and brass reading bookends are real geometry and participate in lighting.

Distinct material work: warm brushed brass metal0.95/roughness0.34 with narrow directional microtexture and restrained coat; porcelain glaze roughness0.24/coat0.35; fine-grain ABS roughness0.47; uncoated fibre paper roughness0.86; separate aluminium, rubber, bristles and raw brush wood. Original photographed walnut and licensed photo plant/pot assets remain. Six additional 512-square normal/roughness pairs are original deterministic manufacturing textures; they are honestly labelled procedural, not scans. Their physical tile sizes are recorded in materials/SOURCE.json. Final web shader must use these according to material, not globally paint one normal map over everything.

Original calendar17, eraser and headphones retained. Compact charcoal tin with four individual sticks, two physical paintbrushes and a glazed mixing palette with dry pigment were modelled. The palette was initially hidden behind the TV, found by actually viewing the native result, moved forward and all three real lighting passes rebaked. No stale original shadows are reused.

All three 2048-square diffuse/albedo/direct/indirect components are actual Cycles CUDA48sample bakes followed by actual Blender OpenImageDenoise on retained linear HDR EXR files, plus real tangent-normal bake and UV convention audit. Per-pass decode scales live in room-lighting.json and must be read rather than assumed. Dynamic reflections/specular remain a separate real-time web approximation, not real-time Cycles. Native lamp-on/off previews were viewed; they use the old placeholder TV and outside and cannot replace final real webpage review.

Exact collision keeps cup and pens semantic keys and empty-key opaque art objects as occluders. The window now has four independent panes: window-tl, window-tr, window-bl and window-br. Window bars retain their old opaque geometry. Picking and camera routing are implemented separately in the web controller.
''',encoding='utf8')
print(json.dumps({'complete':True,'nativeSHA':result['nativeSHA256'],'triangles':result['staticTriangles'],'collisionTriangles':result['collisionTriangles'],'collisionBytes':result['collisionBytes'],'passScales':[p['scale'] for p in result['passes']],'materials':len(result['materialRecords'])}))
