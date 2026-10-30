import bpy,json,math,time
from pathlib import Path
from mathutils import Vector
R=Path(__file__).resolve().parents[1];O=R/'blender/mythology-v32-133';A=R/'assets/odyssey/compact-v133';bpy.ops.wm.open_mainfile(filepath=str(O/'compact-cove.blend'));sc=bpy.context.scene
# Correct the unit-normalized scan to metre-scale trees and low coastal shrubs.
for o in sc.objects:
 if (o.name.startswith('V133 tree ') or o.name.startswith('V133 shrub ')) and max(o.scale)<1:o.scale*=10
for name in ['V133 pale weathered limestone','V133 fine ochre sand']:
 m=bpy.data.materials.get(name);n=m.node_tree.nodes;l=m.node_tree.links;mapping=next(v for v in n if v.bl_idname=='ShaderNodeVectorMath');geo=n.new('ShaderNodeNewGeometry');l.new(geo.outputs['Position'],mapping.inputs[0]);mapping.inputs[3].default_value=.36 if 'limestone' in name else .9
 for t in n:
  if t.bl_idname=='ShaderNodeTexImage':t.projection='BOX';t.projection_blend=.25
 if 'limestone' in name:
  tex=next(v for v in n if v.bl_idname=='ShaderNodeTexImage' and 'diff' in v.image.name);p=n.get('Principled BSDF');attr=n.new('ShaderNodeVertexColor');attr.layer_name='Biome';mix=n.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=.65;l.new(tex.outputs['Color'],mix.inputs[1]);l.new(attr.outputs['Color'],mix.inputs[2]);l.new(mix.outputs[0],p.inputs['Base Color'])
for o in sc.objects:
 if o.name.startswith('V133 cliff buttress'):o.scale.z*=.65;o.location.z-=.4
water=bpy.data.objects['V133 ocean'];water.scale=(20,20,1)
sc.camera.location=(65,-80,37);sc.camera.rotation_euler=(Vector((-4,24,8))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.lens=43
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
sc.render.filepath=str(O/'cycles-compact-1920.png');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(O/'compact-cove.blend'))
t=time.time();bpy.ops.render.render(write_still=True)
report={'native':'compact-cove.blend','gpu':'RTX 4060 Laptop / CUDA','actualCyclesRender':True,'samples':96,'seconds':time.time()-t,'stage':'metre-scale vegetation and triplanar material correction'};(O/'render.json').write_text(json.dumps(report,indent=2))
# Runtime assets use the same world, smaller textures and intact separated leaf cards.
for image in bpy.data.images:
 if image.type!='IMAGE' or not image.has_data:continue
 w,h=image.size
 if max(w,h)>1024:image.scale(round(w*1024/max(w,h)),round(h*1024/max(w,h)))
def export(name,objects):
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:
  if o.type=='MESH':o.hide_set(False);o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=str(A/name),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_attributes=True,export_cameras=False,export_lights=False,export_image_format='AUTO')
ship=bpy.data.objects['V112_SHIP_0'];export('hero-ship.glb',list(ship.children_recursive));export('island.glb',[o for o in sc.objects if o.name=='V133_ISLAND' or o.name.startswith('V133 cliff buttress') or o.name.startswith('V133 elevation')])
land=bpy.data.objects['V133_ISLAND'];(A/'height.json').write_text(json.dumps({'size':117,'bounds':[-56,47,-4,86],'heights':[v.co.z for v in land.data.vertices]}))
protos=[next(o for o in sc.objects if o.name.startswith('V133 tree ') and o.name.endswith('part'+str(i))) for i in range(3)];copies=[]
for i,src in enumerate(protos):
 o=bpy.data.objects.new('V133 prototype '+str(i),src.data.copy());sc.collection.objects.link(o);copies.append(o);tri=sum(len(p.vertices)-2 for p in o.data.polygons)
 if tri>2400:
  bpy.context.view_layer.objects.active=o;o.select_set(True);mod=o.modifiers.new('Web foliage topology budget','DECIMATE');mod.ratio=2400/tri;bpy.ops.object.modifier_apply(modifier=mod.name)
export('vegetation.glb',copies)
placements=[]
for o in sc.objects:
 if o.name.startswith('V133 tree ') or o.name.startswith('V133 shrub '):placements.append({'name':o.name,'prototype':int(o.name[-1]),'position':[o.location.x,o.location.z,-o.location.y],'scale':list(o.scale),'angle':-o.rotation_euler.z})
(A/'vegetation.json').write_text(json.dumps(placements),encoding='utf-8');print('REFINED_AND_EXPORTED',json.dumps(report),flush=True)
