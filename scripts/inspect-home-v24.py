import bpy,json,pathlib,time
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v24';out.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(p/'blender/reference-architecture-v23/current-complete-courtyard.blend'))
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences
devices=[]
try:
 prefs.compute_device_type='OPTIX';prefs.get_devices()
 devices=[{'name':d.name,'type':d.type} for d in prefs.devices]
except Exception as e:devices=[{'error':str(e)}]
meshes=[]
for o in s.objects:
 if o.type=='MESH' and (o.name.startswith('V16__') or 'vault' in o.name.lower() or 'cloister' in o.name.lower()):
  meshes.append({'name':o.name,'vertices':len(o.data.vertices),'materials':[m.name for m in o.data.materials if m]})
materials=[]
for m in bpy.data.materials:
 if not m.use_nodes:continue
 b=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if b:materials.append({'name':m.name,'base':list(b.inputs['Base Color'].default_value),'rough':b.inputs['Roughness'].default_value,'metal':b.inputs['Metallic'].default_value,'links':[{'node':l.from_node.type,'socket':l.to_socket.name} for l in m.node_tree.links if l.to_node==b]})
lights=[{'name':o.name,'type':o.data.type,'energy':o.data.energy,'color':list(o.data.color),'position':list(o.location),'rotation':list(o.rotation_euler),'size':getattr(o.data,'size',0)} for o in s.objects if o.type=='LIGHT']
report={'devices':devices,'meshes':meshes,'materials':materials,'lights':lights,'camera':{'position':list(s.camera.location),'rotation':list(s.camera.rotation_euler),'lens':s.camera.data.lens}}
(out/'native-inspection.json').write_text(json.dumps(report,indent=2),encoding='utf8')
bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
print(json.dumps({'devices':devices,'meshTargets':len(meshes),'materials':len(materials),'lights':lights}))
