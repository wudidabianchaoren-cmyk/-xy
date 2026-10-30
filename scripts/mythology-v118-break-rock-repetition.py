import bpy,runpy,json
from pathlib import Path
R=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');O=R/'blender/mythology-v32-118';sc=bpy.context.scene
if sc.get('v118_rock_mapping_warped'):raise RuntimeError('Already warped')
mat=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'].data.materials[0];n=mat.node_tree.nodes;l=mat.node_tree.links;geo=next(q for q in n if q.type=='NEW_GEOMETRY')
noise=n.new('ShaderNodeTexNoise');noise.name='V118 continuous rock strata coordinate variation';noise.inputs['Scale'].default_value=.33;noise.inputs['Detail'].default_value=2;noise.inputs['Roughness'].default_value=.6;l.new(geo.outputs['Position'],noise.inputs['Vector'])
sub=n.new('ShaderNodeVectorMath');sub.operation='SUBTRACT';sub.inputs[1].default_value=(.5,.5,.5);l.new(noise.outputs['Color'],sub.inputs[0]);scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=1.3;l.new(sub.outputs[0],scale.inputs[0]);add=n.new('ShaderNodeVectorMath');add.operation='ADD';l.new(geo.outputs['Position'],add.inputs[0]);l.new(scale.outputs[0],add.inputs[1])
count=0
for q in list(n):
 if q.type=='VECT_MATH' and q.operation=='SCALE' and q!=scale and q.inputs[0].is_linked and q.inputs[0].links[0].from_node==geo:
  l.new(add.outputs[0],q.inputs[0]);count+=1
sc['v118_rock_mapping_warped']=True
(O/'04-continuous-photo-mapping.json').write_text(json.dumps({'continuousWorldSpaceWarpMetres':1.3,'noiseScale':.33,'imageMappings':count,'purpose':'Break visible 1.8m regular repeated rock square pattern without introducing tile boundaries','samePhotos':True},indent=2),encoding='utf8')
runpy.run_path(str(R/'scripts/mythology-v118-bake-4k.py'))
runpy.run_path(str(R/'scripts/mythology-v118-final-render.py'))
print('FINAL_NONPERIODIC_PHOTO_MAPPING_NATIVE_AND_WEB_BAKE_SAVED')
