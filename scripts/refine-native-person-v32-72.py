import bpy,math,json,ast,numpy as np
from pathlib import Path
from mathutils import Vector
H=Path(__file__).resolve().parents[1]/'blender/reference-architecture-v18';P=H.parents[1];A=P/'assets'
tree=ast.parse((H.parent/'reference-architecture-v17/build-increment.py').read_text(encoding='utf8'));exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-functions','exec'),globals())
bpy.ops.wm.open_mainfile(filepath=str(H/'polyphemus-reclining.blend'))
for o in list(bpy.context.scene.objects):
 if o.type=='MESH' and any(q in o.name.lower() for q in ['waist wrap','waist binding','robe','apron','clasp','stitch']):bpy.data.objects.remove(o,do_unlink=True)
# Fit to the actual baked torso, in its original upright body coordinates.
skin=[]
for o in bpy.context.scene.objects:
 if o.type=='MESH' and 'Uncut' in o.name:
  for v in o.data.vertices:
   p=o.matrix_world@v.co;xx,yy,zz=p.x,p.z,-p.y
   x=xx*math.cos(-1.18)+yy*math.sin(-1.18);y=-xx*math.sin(-1.18)+yy*math.cos(-1.18)
   if abs(x)<.265 and .7<y<1.45 and abs(zz)<.29:skin.append((x,y,zz-.020))
cloud=np.array(skin);angles=np.arctan2(cloud[:,0],cloud[:,2]);radii=np.hypot(cloud[:,0],cloud[:,2]);N=96;R=42;verts=[];faces=[]
for j in range(R+1):
 t=j/R;y=1.43-.70*t;band=np.abs(cloud[:,1]-min(y,1.398))<.028
 for i in range(N+1):
  a=i/N*math.tau;delta=np.abs(np.arctan2(np.sin(angles-a),np.cos(angles-a)));sample=radii[band&(delta<.20)]
  r=float(np.percentile(sample,95))+.020 if len(sample) else .17
  r=max(.135,r)
  if t<.10:r=.10+(r-.10)*t/.10
  if t>.64:r=max(r,.185)
  r+=.004*math.sin(a*17+t*.9)
  x=math.sin(a)*r;z=math.cos(a)*r+.020
  verts.append((x*math.cos(-1.18)-y*math.sin(-1.18),x*math.sin(-1.18)+y*math.cos(-1.18),z))
  if j<R and i<N:k=j*(N+1)+i;faces.append((k,k+1,k+N+2,k+N+1))
arr=np.array(verts).reshape(R+1,N+1,3)
for _ in range(6):arr[1:-1,1:-1]=arr[1:-1,1:-1]*.6+(arr[1:-1,:-2]+arr[1:-1,2:]+arr[:-2,1:-1]+arr[2:,1:-1])*.1
wool=material('warm heavy woven robe',(.23,.17,.095),.97,maps={'Base Color':H.parent/'reference-architecture-v17/baked-wool-basecolor.png','Normal':A/'odyssey/rough_linen/rough_linen_nor_gl_1k.jpg','Roughness':A/'odyssey/rough_linen/rough_linen_rough_1k.jpg'})
robe=mesh('Tailored reclining heavy wool robe',arr.reshape(-1,3).tolist(),faces,wool)
for f in robe.data.polygons:f.use_smooth=True
uv=robe.data.uv_layers.active
for f in robe.data.polygons:
 for li in f.loop_indices:
  j,i=divmod(robe.data.loops[li].vertex_index,N+1);uv.data[li].uv=(i/N*4,j/R*3)
# Use a mesh cap instead of old alpha hair cards; short stubble is material grain on the jaw.
hair=material('short sculpted dark hair',(.047,.032,.021),.98)
# Head coordinates share the same retained pose, including the original small head tilt.
c=(1.71*math.sin(1.18),1.71*math.cos(1.18),-.034)
cap=sphere('Compact natural scalp without alpha hair cards',c,(.100,.077,.085),hair)
for image in bpy.data.images:
 if image.source=='FILE':
  try:image.pack()
  except Exception:pass
selected_export([o for o in bpy.context.scene.objects if o.type=='MESH'],'polyphemus-reclining.glb')
bpy.ops.wm.save_as_mainfile(filepath=str(H/'polyphemus-reclining.blend'))
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=64;s.cycles.use_denoising=True;s.render.filepath=str(H/'polyphemus-cycles-v18.png');bpy.ops.render.render(write_still=True)
audit=json.loads((H/'native-production-audit.json').read_text());audit['fittedGarmentRefined']=True;audit['alphaHairCardsRemoved']=True;(H/'native-production-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf8')
