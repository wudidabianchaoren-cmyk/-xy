import bpy,json,math,numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-112';scene=bpy.context.scene
# Photographed cloth was blue. Neutralise the dye, retain actual weave/normal/roughness in nodes.
for m in bpy.data.materials:
 if not m.name.startswith('V112') or not m.use_nodes or not any(k in m.name.lower() for k in ['linen','hemp']):continue
 n=m.node_tree.nodes;l=m.node_tree.links;bs=next(x for x in n if x.type=='BSDF_PRINCIPLED');socket=bs.inputs['Base Color']
 if socket.is_linked:
  output=socket.links[0].from_socket;bw=n.new('ShaderNodeRGBToBW');l.new(output,bw.inputs[0]);mul=n.new('ShaderNodeMixRGB');mul.blend_type='MULTIPLY';mul.inputs[0].default_value=1;mul.inputs[2].default_value=(1.20,1.09,.89,1);l.new(bw.outputs[0],mul.inputs[1]);l.new(mul.outputs[0],socket)
# Do not apply metre-scale rock relief to fine beach sand.
land=bpy.data.objects['V112_ISLAND / continuous bedrock, shallow bay, inland ridge'];mat=land.data.materials[0];n=mat.node_tree.nodes;l=mat.node_tree.links;bs=next(x for x in n if x.type=='BSDF_PRINCIPLED');sep=next(x for x in n if x.type=='SEPARATE_COLOR');bumps=[x for x in n if x.type=='BUMP'];rock=bumps[0]
sub=n.new('ShaderNodeMath');sub.operation='SUBTRACT';sub.inputs[0].default_value=1;l.new(sep.outputs['Red'],sub.inputs[1]);mul=n.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=.35;l.new(sub.outputs[0],mul.inputs[0]);l.new(mul.outputs[0],rock.inputs['Strength'])
# A neutral broad fill reveals cloth and skin without a blue wash; key direction and native sea retained.
light=bpy.data.lights.new('V112 neutral broad fill','SUN');light.energy=.65;light.color=(1,.96,.89);light.angle=.20;o=bpy.data.objects.new('V112 neutral broad fill',light);scene.collection.objects.link(o);o.location=(25,-50,80);o.rotation_euler=(Vector((-65,130,0))-o.location).to_track_quat('-Z','Y').to_euler()
# Use full scanned leaf geometry for LOCAL Cycles, shared between instances.
# The live GLB keeps its separate canopy LOD and is explicitly labelled as different.
before=set(scene.objects);bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/odyssey/vegetation-v104/island_tree_01/island_tree_01_1k.gltf'))
original=[o for o in scene.objects if o not in before];srcs=[o for o in original if o.type=='MESH'];points=[]
for src in srcs:
 arr=np.empty(len(src.data.vertices)*3,dtype=np.float32);src.data.vertices.foreach_get('co',arr);arr=arr.reshape(-1,3);mw=np.array(src.matrix_world,dtype=np.float32);points.append(arr@mw[:3,:3].T+mw[:3,3])
allp=np.concatenate(points);lo=allp.min(axis=0);hi=allp.max(axis=0);center=np.array([(hi[0]+lo[0])/2,(hi[1]+lo[1])/2,lo[2]],dtype=np.float32);height=hi[2]-lo[2]
for src in srcs:
 bpy.ops.object.select_all(action='DESELECT');src.select_set(True);bpy.context.view_layer.objects.active=src;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
parts=[o for o in scene.objects if o not in before and o.type=='MESH'];leaf=next(o for o in parts if o.active_material and 'leaves' in o.active_material.name.lower());data=leaf.data.copy();arr=np.empty(len(data.vertices)*3,dtype=np.float32);data.vertices.foreach_get('co',arr);mw=np.array(leaf.matrix_world,dtype=np.float32);arr=((arr.reshape(-1,3)@mw[:3,:3].T+mw[:3,3])-center)/height;data.vertices.foreach_set('co',arr.ravel());data.update();fulltri=sum(len(p.vertices)-2 for p in data.polygons)
forest=bpy.data.collections['V112_FOREST / clustered canopy and shrub succession'];changed=0
for o in forest.objects:
 if o.type=='MESH' and o.data.materials and 'leaves' in o.data.materials[0].name.lower():o.data=data;changed+=1
for o in list(scene.objects):
 if o not in before:bpy.data.objects.remove(o,do_unlink=True)
scene.render.resolution_x=1600;scene.render.resolution_y=900;scene.cycles.samples=48;scene.render.resolution_percentage=100;scene.render.filepath=str(OUT/'cycles-hero-final.png')
bpy.ops.object.select_all(action='DESELECT');land.select_set(True);bpy.context.view_layer.objects.active=land
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'06-local-cycles-detailed-canopy.blend'))
(OUT/'native-final-audit.json').write_text(json.dumps({'actualVisibleMcp':True,'fullNativeLeafPrototypeTriangles':fulltri,'sharedLeafInstances':changed,'liveCanopyHasSeparateLod':True,'blueClothNeutralisedInShader':True,'sandRockReliefSeparated':True,'seaMaterialChanged':False,'render':str(OUT/'cycles-hero-final.png'),'nativeFile':str(OUT/'06-local-cycles-detailed-canopy.blend')},indent=2),encoding='utf8')
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('V112_FULL_CANOPY_FINAL_RENDER_INVOKED',fulltri,changed)
