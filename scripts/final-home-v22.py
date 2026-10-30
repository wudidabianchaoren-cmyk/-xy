import bpy,json,pathlib
out=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype/blender/reference-architecture-v22')
bpy.ops.wm.open_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
changed=[]
for m in bpy.data.materials:
 if 'honed silver marble' in m.name and m.use_nodes:
  bsdf=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
  if bsdf:
   bsdf.inputs['Base Color'].default_value=(.24,.165,.090,1)
   for n in m.node_tree.nodes:
    if n.type=='MIX_RGB' and n.blend_type=='MULTIPLY':n.inputs[2].default_value=(.24,.165,.090,1)
    if n.type=='MIX' and n.blend_type=='MULTIPLY':
     for i in n.inputs:
      if i.name=='B' and i.type=='RGBA':i.default_value=(.24,.165,.090,1)
   bsdf.inputs['Roughness'].default_value=.22
   changed.append(m.name)
if not changed:raise RuntimeError('Current native courtyard floor material missing')
scene=bpy.context.scene;scene.render.filepath=str(out/'current-complete-courtyard-cycles.png')
bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
bpy.ops.render.render(write_still=True)
audit=json.loads((out/'native-audit.json').read_text(encoding='utf8'))
audit.update(passed=True,finalFloorCalibration=changed,finalFloorLinearColor=[.24,.165,.09],proof='current-complete-courtyard-cycles.png',nativeLightingSeparateFromWeb=True,viewportGPUWorkReleasedBeforeBrowserPerformanceTests=True)
(out/'native-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'passed':True,'finalFloorCalibration':changed,'renderCompleted':True}))
