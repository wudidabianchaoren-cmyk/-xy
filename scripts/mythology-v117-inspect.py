import bpy,json
from pathlib import Path
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'.verify/v32-117';OUT.mkdir(parents=True,exist_ok=True)
scene=bpy.context.scene
report={'file':bpy.data.filepath,'objects':len(scene.objects),'collections':[{'name':c.name,'objects':len(c.all_objects)} for c in bpy.data.collections if 'V112' in c.name], 'addons':list(bpy.context.preferences.addons.keys()),'camera':{'position':list(scene.camera.location),'rotation':list(scene.camera.rotation_euler),'lens':scene.camera.data.lens},'materials':[],'giant':[],'fleetSamples':[]}
for m in bpy.data.materials:
 if m.name.startswith('V112') or 'skin' in m.name.lower():
  report['materials'].append({'name':m.name,'users':m.users,'nodes':[{'type':n.type,'image':n.image.name if n.type=='TEX_IMAGE' and n.image else None} for n in m.node_tree.nodes] if m.use_nodes else []})
giant=bpy.data.objects.get('V106_CYCLOPS / retained anatomical base, new male sculpt')
if giant:
 for o in [giant,*giant.children_recursive]:
  report['giant'].append({'name':o.name,'type':o.type,'vertices':len(o.data.vertices) if o.type=='MESH' else 0,'parent':o.parent.name if o.parent else None,'location':list(o.location),'scale':list(o.scale),'hidden':o.hide_render,'materials':[m.name if m else None for m in o.data.materials] if o.type=='MESH' else []})
fleet=bpy.data.collections.get('V112_FLEET')
if fleet:
 report['fleetSamples']=[{'name':o.name,'vertices':len(o.data.vertices),'materials':[m.name if m else None for m in o.data.materials]} for o in fleet.all_objects if o.type=='MESH'][:65]
(OUT/'native-inventory.json').write_text(json.dumps(report,indent=2),encoding='utf8')
for w in bpy.context.window_manager.windows:
 for a in w.screen.areas:
  if a.type=='IMAGE_EDITOR':a.type='VIEW_3D'
  if a.type=='VIEW_3D':a.spaces.active.shading.type='SOLID';a.spaces.active.region_3d.view_perspective='CAMERA';a.spaces.active.clip_end=5000
print(json.dumps({'file':report['file'],'objects':report['objects'],'collections':report['collections'],'addons':report['addons'],'giantObjects':len(report['giant'])}))
