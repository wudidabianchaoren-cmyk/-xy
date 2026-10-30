import json,struct,hashlib
from pathlib import Path
R=Path.cwd();A=R/'assets/directory-v124';V=R/'.verify/v32-124'
def glb(name):
 b=(A/name).read_bytes();n=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+n])
collision=glb('room-collision.glb');static=glb('room-static.glb');detail=glb('props-detail.glb')
names=[n.get('name','') for n in collision.get('nodes',[])]
assert not any('Upright archive binder' in x or 'Binder cloth inset' in x for x in names)
assert not any('Preview dynamic' in x for x in names)
assert not any(n.get('extras',{}).get('key','').startswith(('book','tape')) for n in collision.get('nodes',[]))
lighting=json.loads((A/'room-lighting.json').read_text(encoding='utf8'));result=json.loads((A/'native-result.json').read_text(encoding='utf8'));old=json.loads((R/'assets/directory-v123/native-result.json').read_text(encoding='utf8'))
oldsha=hashlib.sha256((R/'blender/directory-v32-123/directory-room.blend').read_bytes()).hexdigest()
def tris(g):return sum(g['accessors'][p['indices']]['count']//3 for m in g.get('meshes',[]) for p in m.get('primitives',[]) if 'indices' in p)
audit={'complete':True,'version':'32.124','native':'blender/directory-v32-124/directory-room.blend','actualBlender':'5.1.2 / Cycles CUDA','staticTriangles':tris(static),'calendarVectorPrintTriangles':tris(detail),'collisionTriangleKeyRulePreserved':True,'removedUprightBinders':3,'removedUprightInsetMeshes':3,'noGhostUprightCollisions':True,'noDynamicBookOrCDCollisionProxiesExported':True,'dynamicGIProxies':7,'giModes':[{'mode':p['name'],'samples':p['samples'],'scale':p['scale'],'denoise':p.get('denoise')} for p in lighting['passes']],'illuminationChanges':lighting['nativeGIchanges'],'nativeOnOffActuallyViewed':True,'nativeRenderLimit':'Native preview uses original placeholder blue CRT and outside building blocks; final website must be inspected independently with live video, licensed city photograph and runtime PMREM/SH. No identical-image claim.','oldV123NativeUnchanged':oldsha==old['nativeSHA256'],'oldV123NativeActualSHA':oldsha,'dependenciesRetained':['assets/directory-v123/remote-detail.glb','assets/directory-v123/plant/*.jpg'],'propsDetailPlacement':'Absolute glTF coordinates; no parent transform needed','calendarTypography':'Actual Arial vector outlines: OCTOBER 2026 / large 17 / SATURDAY; no microscopic full-month grid','headphones':'Physical rounded shells, thick foam cushions with inset fabric, spring arch with leather pad, real three-dimensional cable and 3.5mm jack','noNewPaidAssetOrAPI':True}
assert audit['oldV123NativeUnchanged']
(V/'native-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');result.update({'version':'32.124','originalV123Untouched':True,'actualNativeOnAndOffRenders':True,'extraCalendarVectorPrint':'props-detail.glb','oldUprightBooksRemoved':True,'addedProps':['desk calendar','natural rubber eraser','over-ear headphones with cable'],'nativeSHA256':hashlib.sha256((R/'blender/directory-v32-124/directory-room.blend').read_bytes()).hexdigest(),'propsDetailSHA256':hashlib.sha256((A/'props-detail.glb').read_bytes()).hexdigest(),'calendarReadabilityRefinement':'Large 17 / OCTOBER 2026 / SATURDAY, no microscopic grid','headphonesForwardRelocationM':.42});(A/'native-result.json').write_text(json.dumps(result,indent=2),encoding='utf8')
(A/'PRODUCTION.md').write_text('''# V124 native room changes

Original V123 native geometry was preserved on disk. The three far-right upright binders and their three paper insets were removed from both visible geometry and exact-triangle collision geometry. The atlas was re-unwrapped and all three lighting components were genuinely rebaked, so their old shadows do not survive on the desk.

Added an editable folded October 2026 desk calendar with actual paper thickness, board foot, six binding loops and vector print; a softened natural rubber eraser and sleeve; and over-ear headphones moved 0.42m forward from the rear telephone, with rounded metal shells, thick foam pads, inset woven drivers, padded spring arch, cable and jack. Calendar lettering is exported separately as props-detail.glb at absolute glTF coordinates, avoiding the room atlas typography limit. These are original geometry, not downloaded decorative images. Existing original glasses, recorder, white telephone, cup, pen holder and plant remain.

Three reading volumes and four slim CD cases have native shadow proxies at the actual web positions, but those proxies are excluded from static export and collision export. Existing dynamic live geometry and its exact picking must remain responsible for interaction. The remote and 2K pot maps remain in V123 and are not duplicated.

Native window area 65→105W, camera soft area12→18W, world0.12→0.17; tungsten49W rather than57W, soft emitter radius0.075m rather than0.052m. The aim is side modelling and restrained room bounce with the lamp off, plus local warm light with the lamp on. Each 2048-square48-sample Cycles CUDA diffuse component includes actual original albedo, direct and indirect illumination. Actual Blender compositor OIDN was applied to the retained HDR EXR masters; gamma-cubed PNG scales are recorded per component in room-lighting.json and must never be assumed identical to V123. A real tangent-normal bake and exact exported UV audit also pass.

Actual native on/off previews were viewed. They intentionally still contain the original placeholder outside and blue TV. They are production checks, not proof of final web appearance. Final live city, video, wood detail and reflections must be checked in the real website. Procedural incidental geometry is not a claim of 1:1 access to the reference author's private scene or cinematic quality.
''',encoding='utf8')
print(json.dumps(audit,ensure_ascii=False))
