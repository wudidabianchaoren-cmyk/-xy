import bpy,os,math,json
from mathutils import Vector
P=os.getcwd();O=os.path.join(P,'blender','mythology-v32-95');os.makedirs(O,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=os.path.join(P,'blender','mythology-v32-85','mythology-refined.blend'))
scene=bpy.context.scene
def lift(x,y,z):
 t=max(0,min(1,(z-7)/13));t=t*t*(3-2*t)
 return t*(27*math.exp(-((x+107)/66)**2-((y-178)/45)**2)+18*math.exp(-((x+12)/42)**2-((y-183)/36)**2))
terrain=[]
for o in scene.objects:
 if o.type=='MESH' and 'complete_large_island' in str(o.get('source_name','')) and int(o.get('source_key','native84_999').split('_')[-1])<25:
  terrain.append(o);inv=o.matrix_world.inverted()
  for v in o.data.vertices:
   p=o.matrix_world@v.co;p.z+=lift(p.x,p.y,p.z);v.co=inv@p
  o.data.update()
 # Keep existing forest objects grounded on the elevated native surface.
 elif o.type=='MESH' and not o.get('source_key') and any(s in o.name.lower() for s in ['forest','crown','trunk','pine','oak']):
  x,y,z=o.location;o.location.z+=lift(x,y,max(8,z-7))
for o in terrain:
 for mat in o.data.materials:
  if not mat or not mat.use_nodes:continue
  mat=mat.copy();o.data.materials[0]=mat;n=mat.node_tree.nodes;l=mat.node_tree.links;bs=next((n for n in n if n.type=='BSDF_PRINCIPLED'),None)
  if not bs:continue
  tex=n.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=9;tex.inputs['Detail'].default_value=5;tex.inputs['Roughness'].default_value=.72
  bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.28;bump.inputs['Distance'].default_value=.085
  if bs.inputs['Normal'].is_linked:l.new(bs.inputs['Normal'].links[0].from_socket,bump.inputs['Normal'])
  l.new(tex.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
  ramp=n.new('ShaderNodeMapRange');ramp.inputs['To Min'].default_value=.62;ramp.inputs['To Max'].default_value=.96;l.new(tex.outputs['Fac'],ramp.inputs[0]);l.new(ramp.outputs[0],bs.inputs['Roughness'])
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
 if o.type=='MESH' and o.get('source_key'):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(O,'refined-world.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_yup=True)
scene.camera.location=(34,-62,35);target=Vector((-57,130,25));scene.camera.rotation_euler=(target-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.lens=38
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
scene.cycles.samples=16;scene.cycles.use_denoising=True
try:
 pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='CUDA';pref.get_devices()
 for d in pref.devices:d.use=d.type=='CUDA'
 scene.cycles.device='GPU'
except:pass
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'mythology-refined.blend'))
json.dump({'actualBlender':bpy.app.version_string,'source':'V32.85 native world','terrainMeshes':len(terrain),'method':'native vertex ridges; preserved coastal threshold; spatial roughness and layered bump','web':'same exported native geometry; triplanar photographic material applied after import'},open(os.path.join(O,'native-production-audit.json'),'w'),indent=2)
clay=bpy.data.materials.new('V95 clay review');clay.diffuse_color=(.45,.43,.38,1);clay.use_nodes=True;next(n for n in clay.node_tree.nodes if n.type=='BSDF_PRINCIPLED').inputs['Base Color'].default_value=(.45,.43,.38,1)
scene.view_layers[0].material_override=clay;scene.render.filepath=os.path.join(O,'01-clay.png');bpy.ops.render.render(write_still=True)
scene.view_layers[0].material_override=None;scene.render.filepath=os.path.join(O,'02-native-material.png');bpy.ops.render.render(write_still=True)
print('V95 NATIVE GEOMETRY AND TWO PROCESS STILLS COMPLETE')
