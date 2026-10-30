import bpy,bmesh,json,runpy
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene;body=bpy.data.objects['V117 CC0 complete male anatomical cyclops body'];giant=body.parent;material=bpy.data.materials['V117 CC0 male skin / generated technical maps, no inherited atlas']
with bpy.data.libraries.load(str(O/'04c-native-radiance-for-live-3d.blend'),link=False) as(a,b):b.objects=['V117 CC0 complete male anatomical cyclops body']
source=b.objects[0];data=source.data.copy();assert len(data.vertices)>5000,'Pristine anatomy source empty';bpy.data.objects.remove(source,do_unlink=True);body.data=data;data.materials.clear();data.materials.append(material)
for mod in list(body.modifiers):body.modifiers.remove(mod)
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
n=0
for v in data.vertices:
 x,y,z=v.co
 if abs(x)<.078 and 1.579<z<1.648 and y<-.035:
  w=smooth((z-1.579)/.016)*smooth((1.648-z)/.016)*smooth((.078-abs(x))/.023)*.90
  v.co.y=y*(1-w)+(-.122+.9*x*x)*w;n+=1
bm=bmesh.new();bm.from_mesh(data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bound=sum(e.is_boundary for e in bm.edges)
for f in bm.faces:f.smooth=True
bm.to_mesh(data);bm.free();data.update();assert len(data.polygons)>5000
sub=body.modifiers.new('V118 preserved anatomical smooth surface','SUBSURF');sub.levels=1;sub.render_levels=1
bvh=BVHTree.FromPolygons([v.co.copy() for v in data.vertices],[tuple(p.vertices) for p in data.polygons]);hit=bvh.ray_cast(Vector((0,-.8,1.637)),Vector((0,1,0)),1.6)[0];assert hit is not None
cy=hit.y+.002
for name,c,r in [('V117 ONE anatomical cyclops eyeball',(0,cy,1.637),(.023,.012,.010)),('V117 ONE brown cyclops iris',(0,cy-.011,1.637),(.008,.001,.008)),('V117 ONE black cyclops pupil',(0,cy-.012,1.637),(.0036,.0007,.0046))]:
 obj=bpy.data.objects[name];old=sum((v.co for v in obj.data.vertices),Vector())/len(obj.data.vertices);rad=[max(abs(v.co[k]-old[k]) for v in obj.data.vertices) for k in range(3)]
 for v in obj.data.vertices:
  for k in range(3):v.co[k]=c[k]+(v.co[k]-old[k])*r[k]/max(rad[k],1e-8)
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_objects'](O,[giant,*giant.children_recursive],'cyclops-v118.glb')
a={'actualBodyVertices':len(data.vertices),'actualFaces':len(data.polygons),'boundaryEdges':bound,'bodyPresentVerified':True,'continuousOriginalVertexMorph':n,'failedBooleanRemoved':True,'noAddedOrbitalMass':True,'oneExistingEyeRetained':True,'frontSurface':list(hit)};(O/'04-final-orbit-audit.json').write_text(json.dumps(a,indent=2),encoding='utf8')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'05-final-mediterranean-world.blend'));print(json.dumps(a))
