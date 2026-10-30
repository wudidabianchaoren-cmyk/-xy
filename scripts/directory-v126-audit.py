import bpy,json,hashlib,struct,collections
from pathlib import Path
R=Path.cwd();A=R/'assets/directory-v126';V=R/'.verify/v32-126'
bpy.ops.wm.open_mainfile(filepath=str(R/'blender/directory-v32-126/directory-room.blend'))
def glb(n):
 b=(A/n).read_bytes();j=struct.unpack_from('<I',b,12)[0];return json.loads(b[20:20+j])
def tris(g):return sum(g['accessors'][p['indices']]['count']//3 for m in g.get('meshes',[]) for p in m.get('primitives',[]) if 'indices' in p)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
lighting=json.loads((A/'room-lighting.json').read_text(encoding='utf8'));native=json.loads((A/'native-result.json').read_text(encoding='utf8'))
assert sha(R/'blender/directory-v32-125/directory-room.blend')==lighting['originalV125NativeSHA256']
shell=bpy.data.objects['CRT126 unified watertight rounded ABS cabinet'];shell.data.calc_loop_triangles();keys=[]
for t in shell.data.loop_triangles:
 pts=[tuple(round(v,6) for v in (shell.matrix_world@shell.data.vertices[i].co)) for i in t.vertices];keys.append(tuple(sorted(pts)))
dup=sum(v-1 for v in collections.Counter(keys).values() if v>1);assert dup==0
names=[o.name for o in bpy.context.scene.objects]
assert not any(n.startswith('Calendar124 print ') or 'legible vector print' in n for n in names)
assert not any(n.startswith('CRT cabinet vertical assembly seam') for n in names)
assert not any(n in names for n in ['CRT cabinet back','CRT thick side shell','CRT thick side shell.001','CRT top shell','CRT lower controls'])
c=glb('room-collision.glb');s=glb('room-static.glb');cn=[n.get('name','') for n in c['nodes']];ck=[n.get('extras',{}).get('key','') for n in c['nodes']]
assert not any('Preview dynamic' in n for n in cn)
assert all(k in ck for k in ['cup','pens','window-tl','window-tr','window-bl','window-br'])
assert not any(k.startswith(('book','tape')) for k in ck)
assert not (A/'props-detail.glb').exists()
micro=[]
for p in (A/'materials').glob('*'):
 if p.is_file():
  old=R/'assets/directory-v125/materials'/p.name;assert sha(p)==sha(old);micro.append({'name':p.name,'sha256':sha(p)})
report={'complete':True,'version':'32.126','actualBlender':'5.1.2 Cycles CUDA 48 samples / actual OIDN / tangent normals','staticTriangles':tris(s),'collisionTriangles':tris(c),'nativeSHA256':sha(R/'blender/directory-v32-126/directory-room.blend'),'staticSHA256':sha(A/'room-static.glb'),'collisionSHA256':sha(A/'room-collision.glb'),'originalV125NativeSHA256':lighting['originalV125NativeSHA256'],'originalV125NativeUnchanged':True,'cabinet':dict(lighting['cabinetAudit'],duplicateTriangles=dup),'calendarOldTextAndJoinedGhostRemoved':True,'liveCalendarFace':lighting['liveCalendar'],'dynamicCDRootPositions':lighting['cdRootWorldPositions'],'dynamicMediaGIProxies':7,'dynamicMediaExcludedFromStaticAndCollision':True,'nativeOnOffPreviewsActuallyViewed':True,'lightChanges':lighting['nativeGIchanges'],'passes':[{'name':p['name'],'samples':p['samples'],'scale':p['scale'],'denoise':p['denoise']} for p in lighting['passes']],'materialSpecificMicrotexturesReusedUnchanged':micro,'webReviewRequired':True,'limits':['Native checks have placeholder phosphor and previous outside previews; root checks actual web separately.','Fixed baked GI does not dynamically remove media contact shadows after it flies.','Cabinet native topology fixed; user-observed flicker may have additional shader causes and must be checked by real camera motion.']}
independent=V/'reference/duplicate-triangles-126.json'
if independent.exists():
 x=json.loads(independent.read_text(encoding='utf8'));report['independentExportGeometryAudit']={'report':'.verify/v32-126/reference/duplicate-triangles-126.json','exactDuplicateTriangles':x.get('exactDuplicateTriangles'),'quantizedZeroAreaTriangles':x.get('degenerate'),'scope':'Entire exported static triangle positions rounded at1micrometre; zero-area rounding slivers retained, no competing overlapping triangles.'}
(V/'native-audit.json').write_text(json.dumps(report,indent=2),encoding='utf8')
native.update({'version':'32.126','originalV125Untouched':True,'originalV125NativeSHA256':lighting['originalV125NativeSHA256'],'cabinetContinuousVolume':True,'calendarOldPrintRemoved':True});native.pop('originalV120Untouched',None);(A/'native-result.json').write_text(json.dumps(native,indent=2),encoding='utf8')
(A/'PRODUCTION.md').write_text('''# V126 local desktop production

Started from saved V125 native scene without modifying it. Deleted all old joined atlas/export meshes and old calendar print meshes before restoring individual source objects. The former five-box CRT body shared exterior planes at the left, back and top. An initial union exposed non-manifold overlap and was rejected. The delivered cabinet is a new continuous 22 mm rounded outer body with a real 10 mm rounded front screen cavity, zero boundary edges, zero non-manifold edges and zero duplicate triangles. Two decorative thin seam bars were removed. This is actual geometry correction, not bright-outline rendering or polygon offset.

The central television remains the main mass. Four CD roots now occupy a compact two-column, two-height stepped rack with every cover above the front row; physical supports, retaining lips and GI-only stand-ins match the live runtime. Three standing reading book roots retain their positions. Palette, pigment and paintbrushes are regrouped beside the left sketchbook. Charcoal, calendar, cup, headphones, telephone and navigation paper remain.

Light hierarchy is rebuilt in native Cycles: warm tungsten 84 W (previous49), cool city-window area60 W (previous105), camera fill7 W (previous18), world0.085 (previous0.17). Real lamp-on and lamp-off renders were viewed and show a warm left desk pool versus cooler off-state material. The brass, satin ABS, porcelain, paper, wood and original photo pot retain separate material handling. Calendar stock now has clean uncoated white diffuse color0.82/0.81/0.78, old17 vector ink is removed completely. The browser places a live local-date face on the measured tilted paper.

Actual CUDA Cycles three-way2048² diffuse/albedo/direct/indirect bakes at48 samples, retained scene-linear raw EXRs, actual OpenImageDenoise EXRs, audited UV coordinates and real tangent-normal bake are supplied. IMPORTANT final decode scales are1(off),128(lamp),2(TV), with pow(rgb,3), not previous2/64/2. Six material-specific micro-normal/roughness pairs are copied byte-identically fromV125 with SHA evidence; they remain honestly labelled original procedural manufacturing microtextures, not photo scans.

Final native directory-room.blend is saved with editable source geometry and actual material nodes. Native previews still contain the previous placeholder outside and CRT phosphor, so the delivered browser must be independently reviewed. Browser PBR+GI is not real-time Cycles and no private reference source, one-to-one identity, or user visual acceptance is claimed. No homepage, myth, Yangjian, reading interiors or other films are changed by these native files.
''',encoding='utf8')
print(json.dumps({'complete':True,'nativeSHA':report['nativeSHA256'],'staticTriangles':report['staticTriangles'],'collisionTriangles':report['collisionTriangles'],'scales':[p['scale'] for p in report['passes']],'cabinetDuplicateTriangles':dup}),flush=True)
