import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-117';scene=bpy.context.scene
# Open the cave shoulder and the giant's silhouette, rather than covering every surface with trees.
rocks=[o for o in bpy.data.collections['V117_ROCKS'].objects if o];hidden=0
for o in bpy.data.collections['V117_FOREST'].objects:
 if not o or not o.name.startswith('V117 tree'):continue
 p=o.location
 near_giant=((p.x+132)/18)**2+((p.y-125)/21)**2<1
 near_cliff=any(((p.x-r.location.x)/9)**2+((p.y-r.location.y)/8)**2<1 for r in rocks)
 if near_giant or near_cliff:o.hide_render=True;o.hide_set(True);hidden+=1
# The camera background is separate from physically illuminating Nishita, avoiding a blank overbright sky.
n=scene.world.node_tree.nodes;l=scene.world.node_tree.links;out=next(q for q in n if q.type=='OUTPUT_WORLD');physical=next(q for q in n if q.type=='BACKGROUND');cam=n.new('ShaderNodeBackground');cam.inputs['Color'].default_value=(.16,.215,.26,1);cam.inputs['Strength'].default_value=.7;lp=n.new('ShaderNodeLightPath');mix=n.new('ShaderNodeMixShader');l.new(lp.outputs['Is Camera Ray'],mix.inputs[0]);l.new(physical.outputs[0],mix.inputs[1]);l.new(cam.outputs[0],mix.inputs[2]);l.new(mix.outputs[0],out.inputs['Surface'])
scene.camera.location=(27,-60,15);scene.camera.rotation_euler=(Vector((-105,130,16))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=34
scene.render.filepath=str(OUT/'cycles-cove-preview.png');scene.cycles.samples=24
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'04b-composed-cove-and-forest-clearing.blend'))
(OUT/'04b-shot.json').write_text(json.dumps({'camera':list(scene.camera.location),'target':[-105,130,16],'focalLength':34,'treePartsClearedFromRockAndGiant':hidden,'reason':'First actual Cycles preview had too much blank sky and the cave lay outside the frame; retarget west shore and keep sightline open.'},indent=2),encoding='utf8')
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('V117_REVISED_COVE_PREVIEW_INVOKED')
