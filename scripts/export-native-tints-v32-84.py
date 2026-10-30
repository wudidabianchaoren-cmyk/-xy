import bpy,os,json,struct
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','mythology-v32-84')
bpy.ops.wm.open_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
factors={}
for m in bpy.data.materials:
 if m.use_nodes and any(n.label=='Original authored surface tint x native PBR' for n in m.node_tree.nodes):
  factors[m.name]=list(m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value)
# The exporter does not serialize Blender MixRGB MULTIPLY's constant tint.
# Preserve that exact native scalar as the standard glTF baseColorFactor.
file=os.path.join(O,'refined-world.glb');data=open(file,'rb').read();length=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+length].decode('utf8'));fixed=0
for m in doc['materials']:
 if m['name'] in factors and m.get('pbrMetallicRoughness',{}).get('baseColorTexture'):
  m['pbrMetallicRoughness']['baseColorFactor']=factors[m['name']];fixed+=1
js=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode('utf8');js+=b' '*((-len(js))%4);tail=data[20+length:]
open(file,'wb').write(struct.pack('<III',0x46546c67,2,20+len(js)+len(tail))+struct.pack('<II',len(js),0x4e4f534a)+js+tail)
json.dump({'source':'Actual connected Blender material tint constants','factors':factors,'correctedGLTFMaterials':fixed},open(os.path.join(O,'native-material-factors.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
stats=json.load(open(os.path.join(O,'native-production-audit.json'),encoding='utf8'));stats['correctedGLTFTextureTintMaterials']=fixed;json.dump(stats,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
print('Actual native texture tint factors exported:',fixed)
