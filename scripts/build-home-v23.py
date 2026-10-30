import bpy,bmesh,json,math,pathlib
from mathutils import Vector
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v23';out.mkdir(exist_ok=True)
scene=bpy.context.scene
if len(scene.objects)<1000: bpy.ops.wm.open_mainfile(filepath=str(p/'blender/reference-architecture-v22/current-complete-courtyard.blend'))
scene=bpy.context.scene
changed=[];selected=[];calibration=[]
for o in scene.objects:
 if o.type!='MESH' or not o.name.startswith(('V16__quarried_warm_limestone_batch','V16__cut_pale_travertine_arris_batch')):continue
 o.data=o.data.copy();bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00003);bm.to_mesh(o.data);bm.free()
 bevel=o.modifiers.new('V23 actual dressed stone arris / 12mm two-cut bevel','BEVEL');bevel.width=.012;bevel.segments=2;bevel.limit_method='ANGLE';bevel.angle_limit=.60
 bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=bevel.name)
 changed.append({'name':o.name,'vertices':len(o.data.vertices),'bevelMetres':.012});selected.append(o)
for m in bpy.data.materials:
 if not m.use_nodes:continue
 b=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not b:continue
 name=m.name
 if any(x in name for x in ['gilt','gold','brass','machined silver','chased dark bronze','patinated bronze','solar copper']):
  b.inputs['Roughness'].default_value=.43 if 'gold' in name or 'gilt' in name else .48
  b.inputs['Metallic'].default_value=.92
  if 'Coat Weight' in b.inputs:b.inputs['Coat Weight'].default_value=0
 elif any(x in name for x in ['limestone','travertine','sandstone','ashlar']):
  b.inputs['Roughness'].default_value=.76
  for n in m.node_tree.nodes:
   if n.type=='NORMAL_MAP':n.inputs['Strength'].default_value=.28
 elif 'polished enamel' in name:
  b.inputs['Roughness'].default_value=.36;b.inputs['Coat Weight'].default_value=.18;b.inputs['Coat Roughness'].default_value=.32
 calibration.append({'name':name.replace(' / web PBR','').replace(' / polished enamel',''),'roughness':b.inputs['Roughness'].default_value,'metalness':b.inputs['Metallic'].default_value,'base':list(b.inputs['Base Color'].default_value)})
for o in scene.objects:
 if o.type=='LIGHT':
  if 'broad warm key' in o.name:o.data.energy=1350;o.data.color=(1,.66,.32);o.data.size=5.5
  elif 'dark-side detail' in o.name:o.data.energy=38
  elif 'quiet cool rim' in o.name:o.data.energy=85
scene.view_settings.exposure=-.30
bpy.ops.object.select_all(action='DESELECT')
for o in selected:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'dressed-stone.glb'),export_format='GLB',use_selection=True,export_apply=True)
(out/'material-calibration.json').write_text(json.dumps({'version':'V32.80 / Native V23','source':'Actual Blender Principled BSDF and applied geometry','materials':calibration,'geometry':changed,'key':{'color':[1,.66,.32],'power':1350}},indent=2),encoding='utf8')
scene.render.resolution_x=1600;scene.render.resolution_y=900;scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.render.filepath=str(out/'courtyard-material-cycles.png')
bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
print(json.dumps({'saved':True,'nativeModified':changed,'calibrationMaterials':len(calibration),'phase':'geometry, material, lighting, export complete; proof render next'}))
