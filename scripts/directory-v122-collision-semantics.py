import bpy,json,hashlib,struct
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'assets/directory-v122';NATIVE=ROOT/'blender/directory-v32-122'
def key(name):
 if name.startswith(('Upright archive binder','Binder cloth inset')):return 'about'
 if name.startswith('TV lower control inset separator'):return 'tv'
 return None
p=OUT/'room-collision.glb';d=p.read_bytes();jl=struct.unpack_from('<I',d,12)[0];g=json.loads(d[20:20+jl]);tail=d[20+jl:];changes=[]
for node in g.get('nodes',[]):
 k=key(node.get('name',''))
 if k:
  node.setdefault('extras',{})['key']=k;changes.append({'name':node['name'],'key':k})
raw=json.dumps(g,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4);p.write_bytes(struct.pack('<III',0x46546C67,2,12+8+len(raw)+len(tail))+struct.pack('<II',len(raw),0x4E4F534A)+raw+tail)
bpy.ops.wm.open_mainfile(filepath=str(NATIVE/'directory-room.blend'))
for ob in bpy.context.scene.objects:
 k=key(ob.name)
 if k:ob['key']=k
bpy.ops.wm.save_as_mainfile(filepath=str(NATIVE/'directory-room.blend'))
contract=json.loads((OUT/'collision-contract.json').read_text(encoding='utf8'));contract['powerKnob']={'center':[.028,.984,.229],'frontSurface':[.028,.984,.238],'projectedTestPoint':[.028,.984,.239],'radius':.021};contract['semanticVisibleChildFixes']=changes;contract['triangleBinaryUnchanged']=True;contract['collisionSHA256']=hashlib.sha256(p.read_bytes()).hexdigest();(OUT/'collision-contract.json').write_text(json.dumps(contract,indent=2),encoding='utf8')
r=json.loads((OUT/'native-result.json').read_text(encoding='utf8'));r['collisionSHA256']=contract['collisionSHA256'];r['nativeSHA256']=hashlib.sha256((NATIVE/'directory-room.blend').read_bytes()).hexdigest();r['semanticChildPartsFixed']=True;(OUT/'native-result.json').write_text(json.dumps(r,indent=2),encoding='utf8');print(json.dumps({'complete':True,'changes':changes,'triangleBinaryUnchanged':True,'collisionSHA256':contract['collisionSHA256'],'power':contract['powerKnob']}),flush=True)
