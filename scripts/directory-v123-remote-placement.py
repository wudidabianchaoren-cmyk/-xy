import bpy,json,math,struct,hashlib
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v123';NATIVE=ROOT/'blender/directory-v32-123'
p=OUT/'remote-detail.glb';d=p.read_bytes();jl=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+jl]);tail=d[20+jl:]
for node in g['nodes']:
 if node.get('name')=='Remote123 physical controls':node['translation']=[.05,.781,.56];node['rotation']=[0,math.sin(-.04),0,math.cos(-.04)]
raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);p.write_bytes(struct.pack('<III',0x46546C67,2,12+8+len(raw)+len(tail))+struct.pack('<II',len(raw),0x4E4F534A)+raw+tail)
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'));bpy.data.objects['Remote123 physical controls'].matrix_world=bpy.data.objects['Remote123 assembly anchor'].matrix_world.copy();bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
r=json.loads((OUT/'native-result.json').read_text(encoding='utf8'));r['nativeSHA256']=hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest();r['remoteDetailSHA256']=hashlib.sha256(p.read_bytes()).hexdigest();r['originalV122Untouched']=True;(OUT/'native-result.json').write_text(json.dumps(r,indent=2),encoding='utf8')
print('REMOTE_PLACEMENT_FIXED',json.dumps(r),flush=True)
