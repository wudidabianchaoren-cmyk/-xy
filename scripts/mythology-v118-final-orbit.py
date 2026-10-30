import bpy,bmesh,math,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
if sc.get('v118_final_orbit_source_restored'):raise RuntimeError('Already restored')
body=bpy.data.objects['V117 CC0 complete male anatomical cyclops body'];giant=body.parent;mat=body.data.materials[0]
with bpy.data.libraries.load(str(O/'04d-4k-live-native-radiance.blend'),link=False) as (a,b):b.objects=[body.name]
source=b.objects[0];body.data=source.data.copy();bpy.data.objects.remove(source,do_unlink=True);body.data.materials.clear();body.data.materials.append(mat)
bpy.ops.object.select_all(action='DESELECT');body.hide_set(False);body.select_set(True);bpy.context.view_layer.objects.active=body
for m in list(body.modifiers):body.modifiers.remove(m)
sub=body.modifiers.new('V118 final actual anatomical surface refinement','SUBSURF');sub.levels=1;bpy.ops.object.modifier_apply(modifier=sub.name)
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
n=0
for v in body.data.vertices:
 x,y,z=v.co
 if abs(x)<.078 and 1.579<z<1.648 and y<-.035:
  w=smooth((z-1.579)/.016)*smooth((1.648-z)/.016)*smooth((.078-abs(x))/.023)
  target=-.122+.90*x*x
  v.co.y=y*(1-w)+target*w;n+=1
body.data.update()
# A small orbital recess cut into the continuous original face; no added orbital mass.
bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24);cut=bpy.context.object;cut.parent=giant;cut.location=(0,-.127,1.625);cut.scale=(.027,.018,.0105);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
bpy.context.view_layer.objects.active=body;mod=body.modifiers.new('V118 one recessed socket in original face','BOOLEAN');mod.operation='DIFFERENCE';mod.solver='EXACT';mod.object=cut;bpy.ops.object.modifier_apply(modifier=mod.name);bpy.data.objects.remove(cut,do_unlink=True)
bm=bmesh.new();bm.from_mesh(body.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));boundary=sum(e.is_boundary for e in bm.edges)
for f in bm.faces:f.smooth=True
bm.to_mesh(body.data);bm.free();body.data.update()
for name,c,r in [('V117 ONE anatomical cyclops eyeball',(0,-.119,1.625),(.025,.012,.011)),('V117 ONE brown cyclops iris',(0,-.130,1.625),(.0085,.001,.0085)),('V117 ONE black cyclops pupil',(0,-.131,1.625),(.0038,.0007,.0048))]:
 obj=bpy.data.objects[name];old=sum((v.co for v in obj.data.vertices),Vector())/len(obj.data.vertices);rad=[max(abs(v.co[k]-old[k]) for v in obj.data.vertices) for k in range(3)]
 for v in obj.data.vertices:
  for k in range(3):v.co[k]=c[k]+(v.co[k]-old[k])*r[k]/max(rad[k],1e-8)
sc['v118_final_orbit_source_restored']=True
(O/'04-final-orbit-audit.json').write_text(json.dumps({'restoredOriginalAnatomicalFaceBeforeFailedBulkyUnion':True,'filledExistingBilateralPitsByContinuousVertexMorph':n,'noAddedOrbitalMass':True,'singleSmallRecess':True,'bodyBoundaryEdges':boundary,'oneExistingEyeRetained':True},indent=2),encoding='utf8')
import runpy
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_objects'](O,[giant,*giant.children_recursive],'cyclops-v118.glb')
runpy.run_path(str(R/'scripts/mythology-v118-final-render.py'))
print('FINAL_ORIGINAL_ANATOMY_RECESS_SAVED')
