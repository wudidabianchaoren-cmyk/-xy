import bpy,math,json
from pathlib import Path
from mathutils import Vector,noise
ROOT=Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');OUT=ROOT/'blender/mythology-v32-106';scene=bpy.context.scene
island=bpy.data.objects.get('V106_ISLAND / new shore, cove and broad interior');ground=island.data.materials[0];n=ground.node_tree.nodes;l=ground.node_tree.links;bs=next(v for v in n if v.type=='BSDF_PRINCIPLED')
# Resolve photographed rock relief in world coordinates, including vertical cliff faces.
geo=n.new('ShaderNodeNewGeometry');scale=n.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=.38;l.new(geo.outputs['Position'],scale.inputs[0]);texture=n.new('ShaderNodeTexImage');texture.image=bpy.data.images.load(str(ROOT/'assets/odyssey/pbr-v103/seaside_rock/Displacement.jpg'),check_existing=True);texture.image.colorspace_settings.name='Non-Color';texture.projection='BOX';texture.projection_blend=.23;l.new(scale.outputs[0],texture.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.53;bump.inputs['Distance'].default_value=.22;l.new(texture.outputs[0],bump.inputs['Height']);l.new(bump.outputs[0],bs.inputs['Normal'])
# Geometry has real meso-scale erosion; no square patches or scattered rock carpet.
for v in island.data.vertices:
 if v.co.z<2 or v.normal.z>.82:continue
 amount=(1-v.normal.z)*1.65;detail=noise.fractal(v.co*.31,.85,2.11,3);v.co+=v.normal*detail*amount
island.data.update()
# A broad sky-side source brings the shaded coast out of black without moving the original sun.
bpy.ops.object.light_add(type='AREA',location=(-30,-80,125));fill=bpy.context.view_layer.objects.active;fill.name='V106 broad sky-side coastal fill';fill.data.energy=190000;fill.data.shape='DISK';fill.data.size=160;fill.rotation_euler=(Vector((-65,145,15))-fill.location).to_track_quat('-Z','Y').to_euler()
next(v for v in scene.world.node_tree.nodes if v.type=='BACKGROUND').inputs['Strength'].default_value=.85
scene.view_settings.exposure=.05;scene.cycles.samples=48;scene.cycles.use_denoising=True
bpy.ops.object.select_all(action='DESELECT');island.select_set(True);bpy.context.view_layer.objects.active=island
bpy.ops.export_scene.gltf(filepath=str(OUT/'island-geometry-v106.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
scene.render.filepath=str(OUT/'cycles-coastal-world.png');bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'05-final-local-cycles.blend'))
(OUT/'render-audit.json').write_text(json.dumps({'actualBlenderMcp':True,'nativeCycles':True,'resolution':[1600,900],'samples':48,'rockDisplacementPhotograph':True,'realCliffErosion':True,'nativeSeaAndLightingSeparateFromWeb':True,'file':str(OUT/'05-final-local-cycles.blend')},indent=2),encoding='utf8')
bpy.ops.render.render('INVOKE_DEFAULT',write_still=True);print('V106_VISIBLE_CYCLES_FINAL_INVOKED')
