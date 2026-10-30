import bpy,json,pathlib,time,math
from mathutils import Vector
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v24';s=bpy.context.scene;started=time.monotonic()
bpy.ops.wm.open_mainfile(filepath=str(out/'current-complete-courtyard.blend'));s=bpy.context.scene
# Extract the factor actually feeding Principled, including glTF texture multipliers.
materials=[]
for m in bpy.data.materials:
 if not m.use_nodes:continue
 b=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not b:continue
 color=list(b.inputs['Base Color'].default_value);rough=b.inputs['Roughness'].default_value;metal=b.inputs['Metallic'].default_value
 if b.inputs['Base Color'].is_linked:
  node=b.inputs['Base Color'].links[0].from_node
  if node.type in ('MIX','MIX_RGB'):
   candidates=[i for i in node.inputs if i.type=='RGBA' and not i.is_linked and i.enabled]
   if candidates:color=list(candidates[-1].default_value)
 for key in ('Roughness','Metallic'):
  socket=b.inputs[key]
  if socket.is_linked:
   n=socket.links[0].from_node
   if n.type=='MATH' and n.operation=='MULTIPLY':
    factors=[i.default_value for i in n.inputs if not i.is_linked]
    if factors:
     if key=='Roughness':rough=factors[0]
     else:metal=factors[0]
 normal=next((n for n in m.node_tree.nodes if n.type=='NORMAL_MAP'),None)
 materials.append({'name':m.name.replace(' / web PBR','').replace(' / polished enamel',''),'base':color,'roughness':rough,'metalness':metal,'normalStrength':normal.inputs['Strength'].default_value if normal else None})
lights=[]
for o in s.objects:
 if o.type=='LIGHT':
  direction=o.rotation_euler.to_matrix()@Vector((0,0,-1));v=o.location
  lights.append({'name':o.name,'energy':o.data.energy,'color':list(o.data.color),'position':[v.x,v.z,-v.y],'direction':[direction.x,direction.z,-direction.y],'width':getattr(o.data,'size',1),'height':getattr(o.data,'size_y',getattr(o.data,'size',1))})
(out/'look-calibration.json').write_text(json.dumps({'materials':materials,'lights':lights,'exposureEV':s.view_settings.exposure,'source':'Actual connected Blender Principled factors and saved area lights'},indent=2),encoding='utf8')
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
s.render.engine='CYCLES';s.cycles.device='GPU';s.cycles.samples=16;s.cycles.use_denoising=False;s.render.bake.margin=8;s.render.bake.use_clear=True
targets=[o for o in s.objects if o.type=='MESH' and (o.name in ('V16__quarried_warm_limestone_batch','V16__cut_pale_travertine_arris_batch') or 'chamfered_cloister_vault_limestone' in o.name)]
if len(targets)!=3:raise RuntimeError('Expected complete primary stone and vaulted cloister meshes, got '+str(len(targets)))
# Leaf instances do not contribute stable architectural GI; keep the native scene intact on disk.
hidden=[]
for o in s.objects:
 if o.type=='MESH' and any(w in o.name.lower() for w in ('foliage','leaf','leaves','oak_crown','branchlet')):
  hidden.append((o,o.hide_render));o.hide_render=True
audit=[]
for index,o in enumerate(targets):
 bpy.ops.object.select_all(action='DESELECT');o.hide_set(False);o.hide_viewport=False;o.hide_select=False;o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.context.view_layer.update()
 o.data=o.data.copy();original=o.data.uv_layers.active.name if o.data.uv_layers else None
 lm=o.data.uv_layers.new(name='BakedArchitectureUV');o.data.uv_layers.active=lm
 with bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o]):
  bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.008);bpy.ops.object.mode_set(mode='OBJECT')
 size=2048 if index==0 else 1024
 ao=bpy.data.images.new('Native architectural AO '+str(index),width=size,height=size);ao.colorspace_settings.name='Non-Color'
 gi=bpy.data.images.new('Native indirect irradiance '+str(index),width=size,height=size,float_buffer=True);gi.colorspace_settings.name='Non-Color'
 nodes=[]
 for m in o.data.materials:
  node=m.node_tree.nodes.new('ShaderNodeTexImage');node.name='V24 bake destination';node.image=ao;m.node_tree.nodes.active=node;nodes.append((m,node))
 s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.45
 print('BAKE_AO '+o.name,flush=True)
 with bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o]):bpy.ops.object.bake(type='AO')
 ao.filepath_raw=str(out/('architecture-ao-'+str(index)+'.png'));ao.file_format='PNG';ao.save()
 for m,n in nodes:n.image=gi;m.node_tree.nodes.active=n
 s.render.bake.use_pass_direct=False;s.render.bake.use_pass_indirect=True;s.render.bake.use_pass_color=False
 print('BAKE_INDIRECT '+o.name,flush=True)
 with bpy.context.temp_override(object=o,active_object=o,selected_objects=[o],selected_editable_objects=[o]):bpy.ops.object.bake(type='DIFFUSE')
 # Scene-linear HDR values, losslessly compressed; no tone mapping is baked into the asset.
 import array,zlib
 values=array.array('f',[0])*(size*size*4);gi.pixels.foreach_get(values)
 (out/('architecture-indirect-'+str(index)+'.bin.z')).write_bytes(zlib.compress(values.tobytes(),6))
 for m,n in nodes:m.node_tree.nodes.remove(n)
 if original:o.data.uv_layers.active=o.data.uv_layers[original]
 audit.append({'name':o.name,'ao':'architecture-ao-'+str(index)+'.png','indirect':'architecture-indirect-'+str(index)+'.bin.z','size':size,'uvChannel':1,'maxIrradiance':max(values[0::4]),'vertices':len(o.data.vertices),'samples':16})
 (out/'bake-progress.json').write_text(json.dumps({'completed':audit,'seconds':time.monotonic()-started},indent=2),encoding='utf8')
for o,v in hidden:o.hide_render=v
bpy.ops.object.select_all(action='DESELECT')
for o in targets:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(out/'baked-architecture.glb'),export_format='GLB',use_selection=True,export_apply=True)
s.render.bake.use_pass_direct=True;s.render.bake.use_pass_color=True
bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
(out/'bake-audit.json').write_text(json.dumps({'actualBlender':True,'nativeInspectionViaMcp':True,'execution':'Blender background process, after MCP scene inspection','engine':'Cycles','device':'CUDA','layers':audit,'seconds':time.monotonic()-started,'staticDirectLightBaked':False,'dynamicActorsNotReplaced':True,'completeNativeSceneSaved':True},indent=2),encoding='utf8')
print('COMPLETE_NATIVE_BAKES '+json.dumps(audit),flush=True)
