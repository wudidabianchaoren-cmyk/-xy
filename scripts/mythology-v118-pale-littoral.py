import bpy,math,json,runpy
from pathlib import Path
from mathutils import Vector
from mathutils.kdtree import KDTree
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-118';sc=bpy.context.scene
land=bpy.data.objects['V118_ISLAND / continuous Mediterranean headlands'];me=land.data;mat=me.materials[0]
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
points=[o.location.copy() for o in bpy.data.collections['V117_FOREST'].objects if o and o.name.startswith('V117 tree') and o.name.endswith('part1') and not o.hide_render]
kd=KDTree(len(points))
for i,p in enumerate(points):kd.insert(p,i)
kd.balance();hab=me.color_attributes['Habitat'];changed=0
for v in me.vertices:
 x,y,z=v.co;old=hab.data[v.index].color;cove=math.exp(-((x+62)/61)**4)*math.exp(-((y-73)/31)**4)
 exposed=(1-cove)*(1-smooth((y-153)/45))*(1-smooth((z-18)/10))*smooth((z-.4)/2)
 soil=old[1]*(1-.94*exposed)
 nearest,index,_=kd.find(v.co);horizontal=math.hypot(x-nearest.x,y-nearest.y)
 pocket=.76*math.exp(-(horizontal/1.65)**2)*smooth((v.normal.z-.6)/.25)*(1-old[0])
 soil=max(soil,pocket);hab.data[v.index].color=(old[0],soil,max(0,1-old[0]-soil),1)
 if exposed>.4:changed+=1
# Calibrate photographic reflectance to pale coastal geology. Dark joints remain in the source photo.
nodes=mat.node_tree.nodes;links=mat.node_tree.links;tex=next(n for n in nodes if n.type=='TEX_IMAGE' and n.image and 'marble_rock_03_diff' in n.image.name)
tint=next(link.to_node for link in tex.outputs['Color'].links if link.to_node.type=='MIX_RGB' and link.to_node.blend_type=='MULTIPLY')
tint.inputs[2].default_value=(3.8,3.7,3.25,1)
hs=nodes.new('ShaderNodeHueSaturation');hs.name='V118 low saturation pale calcareous visual calibration';hs.inputs['Saturation'].default_value=.38;links.new(tex.outputs['Color'],hs.inputs['Color']);links.new(hs.outputs[0],tint.inputs[1])
dest=list(tint.outputs[0].links);cap=nodes.new('ShaderNodeVectorMath');cap.operation='MINIMUM';cap.inputs[1].default_value=(.82,.82,.80);links.new(tint.outputs[0],cap.inputs[0])
for link in dest:links.new(cap.outputs[0],link.to_socket)
for o in bpy.data.collections['V118_CLOSED_ROCKS'].objects:
 if not o or o.type!='MESH':continue
 attr=o.data.color_attributes.get('Habitat') or o.data.color_attributes.new(name='Habitat',type='FLOAT_COLOR',domain='POINT')
 for c in attr.data:c.color=(0,0,1,1)
# Native full geometry remains for Cycles, with an inexpensive working viewport.
viewport=0
for o in bpy.data.collections['V117_FOREST'].objects:
 if o and o.type=='MESH' and any(m and 'leaves' in m.name.lower() for m in o.data.materials):o.display_type='BOUNDS';viewport+=1
(OUT/'04-pale-coast-calibration.json').write_text(json.dumps({'paleExposedCoastVertices':changed,'trueSoilPocketsAroundTrees':len(points),'photograph':'marble_rock_03','saturation':.38,'linearReflectanceTint':[3.8,3.7,3.25],'reflectanceCap':[.82,.82,.8],'nativeViewportLeafBoundsOnly':viewport,'nativeRenderFullLeaves':True,'seaChanged':False},indent=2),encoding='utf8')
runpy.run_path(str(ROOT/'scripts/mythology-v118-bake-radiance.py'))
runpy.run_path(str(ROOT/'scripts/mythology-v118-export.py'))['export_objects'](OUT,[land],'island-v118.glb')
print('PALE_COAST_WITH_LOCAL_SOIL_POCKETS_AND_NEW_CYCLES_RADIANCE_SAVED')
