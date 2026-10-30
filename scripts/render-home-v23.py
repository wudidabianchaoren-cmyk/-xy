import bpy,json,pathlib
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v23';s=bpy.context.scene
s.render.filepath=str(out/'courtyard-material-cycles.png');s.cycles.samples=48;bpy.ops.render.render(write_still=True)
clay=bpy.data.materials.new('V23 / neutral clay validation');clay.use_nodes=True;b=clay.node_tree.nodes['Principled BSDF'];b.inputs['Base Color'].default_value=(.35,.35,.35,1);b.inputs['Roughness'].default_value=.8
bpy.context.view_layer.material_override=clay;s.cycles.samples=24;s.render.filepath=str(out/'courtyard-clay-cycles.png');bpy.ops.render.render(write_still=True);bpy.context.view_layer.material_override=None
(out/'render-audit.json').write_text(json.dumps({'actualBlenderMcp':True,'engine':'Cycles','materialProof':'courtyard-material-cycles.png','clayProof':'courtyard-clay-cycles.png','nativeSaved':True,'webVerificationSeparate':True},indent=2))
print('V23 material and white-clay renders completed')
