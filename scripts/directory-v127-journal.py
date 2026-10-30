import bpy,math,json,time,hashlib,struct,zlib,shutil
import numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v127';NATIVE=ROOT/'blender/directory-v32-127';OLD=ROOT/'blender/directory-v32-126/directory-room.blend'
OUT.mkdir(parents=True,exist_ok=True);NATIVE.mkdir(parents=True,exist_ok=True)
for name in ['room-normal.png','room-collision.glb','collision-contract.json','uv-audit.json','material-groups.json','web-environment.json','web-env-on.rgba16f','web-env-off.rgba16f']:
 p=ROOT/'assets/directory-v126'/name
 if p.exists():shutil.copy2(p,OUT/name)
shutil.copytree(ROOT/'assets/directory-v126/materials',OUT/'materials',dirs_exist_ok=True)
oldsha=hashlib.sha256(OLD.read_bytes()).hexdigest();bpy.ops.wm.open_mainfile(filepath=str(OLD));scene=bpy.context.scene
delta=Vector((.12,-.08,0));names=['Desk yellow navigation paper / dynamic cover','Yellow paper front edge']
for name in names:bpy.data.objects[name].location+=delta
atlas=bpy.data.objects['room-static'];export=bpy.data.objects['room-static-export'];moved=[]
for ob in [atlas,export]:
 touched=set();mw=ob.matrix_world.copy();inv=mw.inverted()
 for poly in ob.data.polygons:
  mat=ob.data.materials[poly.material_index]
  if not any(x in mat.name for x in ['Yellow archive notepad cotton','Warm cotton paper']):continue
  for i in poly.vertices:
   if i in touched:continue
   v=mw@ob.data.vertices[i].co
   if not(.60<v.x<1.20 and -.70<v.y<-.24 and .74<v.z<.80):continue
   ob.data.vertices[i].co=inv@(v+delta);touched.add(i)
 moved.append({'name':ob.name,'vertices':len(touched)})
 assert len(touched)>0
# Preserve the existing single UV layout and every other source geometry/material/light.
visible={o.name:(o.hide_render,o.hide_get()) for o in scene.objects}
for o in scene.objects:
 keep=o.name.startswith(('Preview dynamic','CC0 photo plant','Remote123')) and o.name!='Remote123 physical controls'
 if o.type=='MESH' and not keep:o.hide_render=True;o.hide_set(True)
atlas.hide_render=False;atlas.hide_set(False)
screen=bpy.data.objects['nav-screen'];bulb=bpy.data.objects['Lamp luminous bulb'];tvlight=bpy.data.objects['CRT soft blue bounce'];lamplight=bpy.data.objects['Warm tungsten local light']
scene.render.engine='CYCLES';scene.cycles.samples=48;pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
for d in pref.devices:d.use=d.type=='CUDA'
scene.cycles.device='GPU'
source=(ROOT/'scripts/directory-v120-native.py').read_text(encoding='utf8');block=source[source.index('states={o.name:'):source.index('\nexport=atlas.copy()')].replace("'samples':24","'samples':48");exec(compile(block,'V127 actual journal contact shadow update','exec'),globals())
for name,(hr,hv) in visible.items():bpy.data.objects[name].hide_render=hr;bpy.data.objects[name].hide_set(hv)
for o in bpy.context.selected_objects:o.select_set(False)
export.hide_set(False);export.select_set(True);bpy.context.view_layer.objects.active=export;bpy.ops.export_scene.gltf(filepath=str(OUT/'room-static.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_materials='EXPORT');export.hide_set(True)
# Keep precise individual collision nodes and shift only the same two paper objects.
path=OUT/'room-collision.glb';d=path.read_bytes();jl=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+jl]);tail=d[20+jl:];collision=[]
for n in g['nodes']:
 if n.get('extras',{}).get('sourceName',n.get('name')) in names:
  t=n.setdefault('translation',[0,0,0]);t[0]+=.12;t[2]+=.08;collision.append(n.get('name'))
raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);path.write_bytes(struct.pack('<III',0x46546C67,2,12+8+len(raw)+len(tail))+struct.pack('<II',len(raw),0x4E4F534A)+raw+tail)
meta=json.loads((ROOT/'assets/directory-v126/room-lighting.json').read_text(encoding='utf8'));meta.update({'epoch':'v32.127-only-navigation-journal-reposition','passes':records,'journal':{'position':[1.02,.795,.54],'nativeObjectDelta':list(delta),'moved':moved,'collisionNodes':collision}});(OUT/'room-lighting.json').write_text(json.dumps(meta,indent=2),encoding='utf8')
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
finish=(ROOT/'scripts/directory-v120-denoise-atlas.py').read_text(encoding='utf8');finish=finish[:finish.index('mg=json.loads')].replace('assets/directory-v120','assets/directory-v127').replace('blender/directory-v32-120','blender/directory-v32-127').replace("startswith('WEB ')","startswith('WEB122 ')").replace('material.name[4:]','material.name[7:]');exec(compile(finish,'V127 actual OIDN and unchanged UV audit','exec'),globals())
assert hashlib.sha256(OLD.read_bytes()).hexdigest()==oldsha
report={'complete':True,'scope':'Only two journal objects moved, same UV and48sample three passes with actualOIDN; no other modelling or lighting change','moved':moved,'collision':collision,'originalV126Unchanged':True,'nativeSHA256':hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest()};(ROOT/'.verify/v32-127/native-audit.json').write_text(json.dumps(report,indent=2),encoding='utf8');print('V127_JOURNAL_COMPLETE',flush=True)
