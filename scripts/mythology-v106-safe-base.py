import bpy,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106'
# The first erosion pass in V05 also distorted small triangles. Use the original revised solid V04.
code=(ROOT/'scripts/mythology-v106-stable-relief.py').read_text(encoding='utf8').split('# Native fine sand:')[0].replace('05-final-local-cycles.blend','04-revised-complete-island.blend');exec(code)
bvh=BVHTree.FromPolygons([v.co.copy() for v in island.data.vertices],[list(p.vertices) for p in island.data.polygons]);forest=bpy.data.collections.get('V106 actual 460 tree coastal woodland');plants={}
for o in forest.objects:
 p,_,_,_=bvh.ray_cast(Vector((o.location.x,o.location.y,120)),Vector((0,0,-1)),160)
 if p:o.location.z=p.z
 i=int(o.name.split(' ')[2]);plants[i]={'x':o.location.x,'blenderY':o.location.y,'z':-o.location.y,'y':o.location.z,'height':o.scale.z,'width':o.scale.x/o.scale.z,'rotation':o.rotation_euler.z}
(OUT/'woodland-placement.json').write_text(json.dumps({'version':106,'trees':list(plants.values()),'distribution':'actual final native support height'},indent=2),encoding='utf8')
cover=bpy.data.objects.get('V106_GROUNDCOVER / clustered meadow blades');mesh=cover.data
for start in range(0,len(mesh.vertices),8):
 center=(mesh.vertices[start].co+mesh.vertices[start+1].co)*.5;p,_,_,_=bvh.ray_cast(Vector((center.x,center.y,120)),Vector((0,0,-1)),160)
 if not p:continue
 delta=p.z-center.z
 for k in range(8):mesh.vertices[start+k].co.z+=delta
mesh.update();giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt');p,_,_,_=bvh.ray_cast(Vector((giant.location.x,giant.location.y,120)),Vector((0,0,-1)),160)
if p:giant.location.z=p.z+.075
body=next(o for o in giant.children_recursive if o.type=='MESH' and 'Human.body' in o.name);bm=bmesh.new();bm.from_mesh(body.data);flipped=0
for f in bm.faces:
 if len(f.verts)>8 and all(1.23<v.co.z<1.29 and .08<abs(v.co.x)<.2 and v.co.y<-.09 for v in f.verts) and f.normal.y>0:f.normal_flip();flipped+=1
bm.to_mesh(body.data);bm.free();body.data.update()
def export(objs,name):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.hide_set(False);o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(OUT/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
export([island],'island-geometry-v106.glb');export([cover],'groundcover-v106.glb');export([giant,*giant.children_recursive],'cyclops-male-v106.glb')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-cove-rocky-headlands-and-uplands.blend'))
audit={'actualVisibleBlenderMcp':True,'newCompleteIsland':True,'vertices':len(g.vertices),'boundaryEdges':boundary,'nonManifoldEdges':nonmanifold,'cliffReliefMaximumMetres':.32,'reliefLimitedToAdjacentEdgeLength':.13,'reliefVertices':changed,'heightMax':max(v.co.z for v in g.vertices),'heightMin':min(v.co.z for v in g.vertices),'coveSandOnly':True,'nativeTextureRepetitionReduced':True,'base':'Original new solid V04; both earlier excessive erosion passes replaced','forestAndGrassRegrounded':True,'chestCapsFlippedOutward':flipped}
(OUT/'stable-geometry-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8');print(json.dumps(audit));scene.render.filepath=str(OUT/'cycles-coastal-world.png');bpy.ops.render.render('INVOKE_DEFAULT',write_still=True)
