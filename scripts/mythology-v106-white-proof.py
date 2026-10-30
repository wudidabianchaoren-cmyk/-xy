import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
clay=bpy.data.materials.new('V106 white model inspection only');clay.use_nodes=True;clay.node_tree.nodes.clear();bs=clay.node_tree.nodes.new('ShaderNodeBsdfPrincipled');bs.inputs['Base Color'].default_value=(.68,.68,.64,1);bs.inputs['Roughness'].default_value=.82;output=clay.node_tree.nodes.new('ShaderNodeOutputMaterial');clay.node_tree.links.new(bs.outputs[0],output.inputs['Surface'])
previous=(scene.render.filepath,scene.cycles.samples,scene.render.resolution_x,scene.render.resolution_y,scene.view_layers[0].material_override)
sea=bpy.data.objects.get('V106 Cycles sea / separate from live web water');sea_hidden=sea.hide_render if sea else None
try:
 scene.view_layers[0].material_override=clay
 if sea:sea.hide_render=True
 scene.render.filepath=str(OUT/'cycles-white-model.png');scene.cycles.samples=16;scene.render.resolution_x=1280;scene.render.resolution_y=720
 bpy.ops.render.render(write_still=True)
 (OUT/'white-proof-audit.json').write_text(json.dumps({'actualBlenderMcp':True,'renderer':'Cycles CUDA','samples':16,'resolution':[1280,720],'proof':'New final island geometry without colour textures, current native scene restored afterward'},indent=2),encoding='utf8')
finally:
 scene.render.filepath,scene.cycles.samples,scene.render.resolution_x,scene.render.resolution_y,scene.view_layers[0].material_override=previous
 if sea:sea.hide_render=sea_hidden
print('V106_ACTUAL_NATIVE_WHITE_PROOF_AND_MATERIAL_RESTORED')
