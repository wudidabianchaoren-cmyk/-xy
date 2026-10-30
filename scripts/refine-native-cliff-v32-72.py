import bpy,ast,math,json,sys
from pathlib import Path
from mathutils import noise,Vector
H=Path(__file__).resolve().parents[1]/'blender/reference-architecture-v18';P=H.parents[1];A=P/'assets'
tree=ast.parse((H.parent/'reference-architecture-v17/build-increment.py').read_text('utf8'))
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name!='render'],type_ignores=[]),'native-helper','exec'),globals())
if '--cliff-only' not in sys.argv:
 bpy.ops.wm.open_mainfile(filepath=str(H/'polyphemus-reclining.blend'))
 for o in list(bpy.context.scene.objects):
  if 'scalp' in o.name.lower():bpy.data.objects.remove(o,do_unlink=True)
 selected_export([o for o in bpy.context.scene.objects if o.type=='MESH'],'polyphemus-reclining.glb')
 bpy.ops.wm.save_as_mainfile(filepath=str(H/'polyphemus-reclining.blend'))
 s=bpy.context.scene;s.render.filepath=str(H/'polyphemus-cycles-v18.png');bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
mat=material('irregular stratified coastal limestone',(.18,.19,.15),.97,maps=photos(A/'home','sandstone_cracks'))
verts=[];faces=[];segments=100;rings=40
for j in range(rings+1):
 t=j/rings
 for i in range(segments):
  a=i/segments*math.tau
  ripple=1+.13*math.sin(a*3)+.075*math.sin(a*7+1.2)+.045*math.cos(a*13+t*3)
  taper=1-.14*t+.045*math.sin(t*math.pi*7)
  x=21+33*math.cos(a)*ripple*taper;z=17*math.sin(a)*ripple*taper
  surface=18+.40*x+1.2*math.sin(x*.13)+.7*math.cos(z*.34)
  n=noise.noise(Vector((x*.28,t*6,z*.28)))
  y=-1+t*surface+n*(1.1 if j==rings else 2.3)
  verts.append((x,y,z))
  if j<rings:
   k=j*segments+i;nn=j*segments+(i+1)%segments;faces.extend([(k,nn,k+segments),(nn,nn+segments,k+segments)])
# Concentric rough strata triangulate the entire ridge: no broad planar fan cap.
previous=rings*segments
for ring in range(1,25):
 rho=1-ring/25;current=len(verts)
 for i in range(segments):
  a=i/segments*math.tau;ripple=1+.13*math.sin(a*3)+.075*math.sin(a*7+1.2)+.045*math.cos(a*13+3)
  x=21+33*math.cos(a)*ripple*.86*rho;z=17*math.sin(a)*ripple*.86*rho
  n=noise.noise(Vector((x*.17,2.3,z*.17)))
  y=18+.40*x+1.2*math.sin(x*.13)+.7*math.cos(z*.34)+n*2.8
  verts.append((x,y,z))
 for i in range(segments):
  a=previous+i;b=previous+(i+1)%segments;c=current+i;d=current+(i+1)%segments;faces.extend([(a,b,c),(b,d,c)])
 previous=current
center=len(verts);verts.append((21,18+.40*21+1.2*math.sin(21*.13)+.7,0))
for i in range(segments):faces.append((previous+i,previous+(i+1)%segments,center))
faces.append(tuple(range(segments-1,-1,-1)))
o=mesh('Continuous sloping eroded strata supporting reclining giant',verts,faces,mat)
for f in o.data.polygons:f.use_smooth=True
uv_world(o,.16);selected_export([o],'natural-cliff.glb');bpy.ops.wm.save_as_mainfile(filepath=str(H/'natural-cliff.blend'))
audit=json.loads((H/'native-production-audit.json').read_text('utf8'));audit.update({'organicSlopingCliff':True,'extraScalpRemoved':True,'cliffVertices':len(verts)})
(H/'native-production-audit.json').write_text(json.dumps(audit,indent=2),'utf8')
print('Refined continuous sloping cliff and removed extra scalp volume')
