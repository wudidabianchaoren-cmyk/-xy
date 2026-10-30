import bpy, json, os, math
from mathutils import Vector
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O=os.path.join(P,'blender','mythology-v32-85')
bpy.ops.wm.open_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
data=json.load(open(os.path.join(P,'.verify','v32-84','native-input.json'),encoding='utf8'))
extras=[o for o in bpy.context.scene.objects if o.name.startswith('native85_extra_')]
for variant in range(1,4):
 start,end=[57,108,158,207][variant],[108,158,207,253][variant]
 body=next(m for m in data['meshes'] if start<=int(m['key'].split('_')[1])<end and len(m['vertices'])//3==13307)
 v=body['vertices'];top=max(v[1::3]);points=[Vector((v[i],-v[i+2],v[i+1])) for i in range(0,len(v),3) if v[i+1]>top-.06]
 center=sum(points,Vector())/len(points);center.z=top-.09
 mat=bpy.data.materials.new(['','Worn bronze lookout helmet','Green woven scout cap','Ochre cargo head wrap'][variant]);mat.use_nodes=True
 bs=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=[(0,0,0,1),(.22,.115,.035,1),(.075,.105,.062,1),(.22,.10,.036,1)][variant];bs.inputs['Roughness'].default_value=.46 if variant==1 else .88;bs.inputs['Metallic'].default_value=.82 if variant==1 else 0
 tex=mat.node_tree.nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=90;bump=mat.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.22;bump.inputs['Distance'].default_value=.002;mat.node_tree.links.new(tex.outputs['Fac'],bump.inputs['Height']);mat.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
 vertices=[];faces=[];radius=[0,.22,.23,.225][variant]
 for ring in range(11):
  theta=.015+(math.pi/2-.015)*ring/10
  for segment in range(32):
   phi=2*math.pi*segment/32
   r=radius*(1+.018*math.sin(phi*12) if variant==3 else 1)
   vertices.append((r*math.sin(theta)*math.cos(phi),r*.90*math.sin(theta)*math.sin(phi),r*.76*math.cos(theta)))
 for ring in range(10):
  for segment in range(32):
   a=ring*32+segment;b=ring*32+(segment+1)%32;faces.append((a,b,b+32,a+32))
 mesh=bpy.data.meshes.new('Continuous domed headwear');mesh.from_pydata(vertices,[],faces);mesh.materials.append(mat)
 obj=bpy.data.objects.new('native85_extra_'+['','escort','scout','provision'][variant]+'_individual_headwear',mesh);obj.location=center;bpy.context.collection.objects.link(obj)
 for face in mesh.polygons:face.use_smooth=True
 extras.append(obj)
bpy.ops.object.select_all(action='DESELECT')
for o in extras:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'fleet-details.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
audit=json.load(open(os.path.join(O,'native-production-audit.json'),encoding='utf8'));audit.update(fleetNativeAdditions=len(extras),individualDeckHeadwear=3,headwearPlacement='actual V84 deck body upper vertices; native continuous domed geometry')
json.dump(audit,open(os.path.join(O,'native-production-audit.json'),'w',encoding='utf8'),indent=2)
print('V85 ACTUAL THREE DISTINCT DECK HEADWEAR EXPORTED')
