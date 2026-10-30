import bpy,runpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118'
a=runpy.run_path(str(R/'scripts/mythology-v118-face-final.py'))['face_final'](R,O)
# Weld the surface-following hair caps so smooth normals cross their original face splits.
import bmesh
for name in ['V118 continuous surface-following scalp cap','V118 continuous surface-following beard cap']:
 obj=bpy.data.objects.get(name)
 if obj:
  bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
  for f in bm.faces:f.smooth=True
  bm.to_mesh(obj.data);bm.free();obj.data.update()
runpy.run_path(str(R/'scripts/mythology-v118-export.py'))['export_figures'](R,O)
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'04e-native-structural-face-and-export-repair.blend'));print(json.dumps(a,ensure_ascii=False))
