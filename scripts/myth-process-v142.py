"""Save and render the actual new assembly stages, not final screenshots relabeled as process."""
import bpy,math,json,shutil
from pathlib import Path
from mathutils import Vector
P=Path(__file__).resolve().parents[1];O=P/'blender/mythology-v32-142/process';A=P/'assets/odyssey/process-v142';O.mkdir(parents=True,exist_ok=True);A.mkdir(parents=True,exist_ok=True)
def material(name,c,rough=.8):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*c,1);p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 if not p:p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');o=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs[0],o.inputs[0])
 p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;return m
def setup():
 s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.resolution_x=1440;s.render.resolution_y=900;s.render.resolution_percentage=100
 pr=bpy.context.preferences.addons['cycles'].preferences;pr.compute_device_type='CUDA';pr.get_devices()
 for d in pr.devices:d.use=d.type=='CUDA'
 s.cycles.device='GPU';s.view_settings.view_transform='AgX';return s
def point(o,p):o.rotation_euler=(Vector(p)-o.location).to_track_quat('-Z','Y').to_euler()
def camera(p,t,lens=48):
 bpy.ops.object.camera_add(location=p);o=bpy.context.object;o.data.lens=lens;point(o,t);bpy.context.scene.camera=o;return o
def area(p,t,power,size):
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;point(o,t)
def cube(name,p,size,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=name;o.scale=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);b=o.modifiers.new('Physical edge bevel','BEVEL');b.width=.025;b.segments=3;return o
def render(name,save=True):
 s=bpy.context.scene
 if save:bpy.ops.wm.save_as_mainfile(filepath=str(O/(name+'.blend')))
 s.render.filepath=str(O/(name+'.png'));bpy.ops.render.render(write_still=True);print('PROCESS_STAGE',name,flush=True)

bpy.ops.wm.read_factory_settings(use_empty=True);s=setup();clay=material('V142 construction clay',(.55,.58,.56));ground=material('V142 studio surface',(.13,.17,.17));floor=cube('Studio floor',(0,0,-.16),(30,30,.2),ground)
w=bpy.data.worlds.new('V142 studio world');w.use_nodes=True;w.node_tree.nodes.get('Background').inputs['Color'].default_value=(.2,.24,.25,1);w.node_tree.nodes.get('Background').inputs['Strength'].default_value=.45;s.world=w
area((-5,-6,9),(0,0,1),1400,7);area((5,3,6),(0,0,1),850,6);cam=camera((10,-12,8),(0,0,1.3),48)
block=cube('01 Initial cube',(0,0,1.3),(5.2,4.1,2.6),clay);render('01-initial-cube');bpy.data.objects.remove(block,do_unlink=True)
parts=[]
for name,p,size in [('west wall',(-2.5,0,1.3),(.24,4.1,2.6)),('east wall',(2.5,0,1.3),(.24,4.1,2.6)),('rear wall',(0,1.94,1.3),(5.2,.24,2.6)),('front left pier',(-1.65,-1.94,1.3),(1.9,.24,2.6)),('front right pier',(1.65,-1.94,1.3),(1.9,.24,2.6)),('door lintel',(0,-1.94,2.48),(1.4,.24,.24))]:parts.append(cube('02 Blockout '+name,p,size,clay))
v=[(-2.8,-2.3,2.6),(2.8,-2.3,2.6),(2.8,2.3,2.6),(-2.8,2.3,2.6),(0,-2.3,4.1),(0,2.3,4.1)];g=bpy.data.meshes.new('Gable roof mass');g.from_pydata(v,[],[(0,1,4),(3,5,2),(0,4,5,3),(1,2,5,4),(0,3,2,1)]);ob=bpy.data.objects.new('02 Roof mass',g);s.collection.objects.link(ob);ob.data.materials.append(clay);parts.append(ob);render('02-walls-roof-openings')
for o in parts:bpy.data.objects.remove(o,do_unlink=True)
# Reassemble the real detailed cottage, preserving the saved original.
with bpy.data.libraries.load(str(P/'blender/mythology-v32-138/coastal-cottage.blend'),link=False) as(a,b):b.objects=a.objects
house=[o for o in b.objects if o and o.type=='MESH']
for o in house:s.collection.objects.link(o)
bpy.context.view_layer.update()
pts=[o.matrix_world@Vector(v) for o in house for v in o.bound_box];lo=Vector([min(v[i] for v in pts) for i in range(3)]);hi=Vector([max(v[i] for v in pts) for i in range(3)]);offset=Vector((-(lo.x+hi.x)/2,-(lo.y+hi.y)/2,-lo.z))
for o in house:o.location+=offset
bpy.context.view_layer.update()
s.view_layers[0].material_override=clay;render('03-cottage-detailed-clay');s.view_layers[0].material_override=None;render('04-cottage-materials')

# Complete scene assembly: reuse actual native coast and replace its old ship with this refitted one.
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/mythology-v32-134/compact-cove-lighting.blend'));s=setup()
removed=[]
for o in list(s.objects):
 if any(k in o.name.lower() for k in ['ship0','boat0','captain','helmsman','v137 warrior','v138 actor','cyclops']):removed.append(o.name);bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.import_scene.gltf(filepath=str(P/'assets/odyssey/refit-v142/armed-ship.glb'))
shipObjects=list(bpy.context.selected_objects)
for o in shipObjects:
 if o.parent is None:o.location.x-=1;o.location.y-=5.5
# Load the actual cottage at its native hillside placement.
with bpy.data.libraries.load(str(P/'blender/mythology-v32-138/coastal-cottage.blend'),link=False) as(a,b):b.objects=a.objects
for o in b.objects:
 if o and o.type=='MESH':s.collection.objects.link(o)
for o in list(s.objects):
 if o.type in ['CAMERA','LIGHT']:bpy.data.objects.remove(o,do_unlink=True)
bpy.ops.object.light_add(type='SUN',location=(-40,-30,70));sun=bpy.context.object;sun.data.energy=2.1;sun.data.angle=.12;sun.rotation_euler=(math.radians(22),math.radians(-28),math.radians(-26));sun.data.color=(1,.92,.78)
area((40,-20,50),(0,20,4),1800,40);cam=camera((52,-72,38),(-5,18,8),45)
if not s.world:s.world=bpy.data.worlds.new('V142 coast world')
s.world.use_nodes=True;bg=next((n for n in s.world.node_tree.nodes if n.type=='BACKGROUND'),None)
if bg:bg.inputs['Color'].default_value=(.43,.52,.58,1);bg.inputs['Strength'].default_value=.35
clay=material('V142 assembled white model',(.40,.44,.43));s.view_settings.exposure=-.8;s.view_layers[0].material_override=clay;render('05-complete-scene-clay');s.view_layers[0].material_override=None;s.cycles.samples=48;s.view_settings.exposure=-.4;render('06-complete-scene-render')
(O/'assembly.json').write_text(json.dumps({'actualStages':True,'newAssemblyDate':'2026-10-22','oldInputsPreserved':True,'removedOldShipComponents':len(removed),'currentShipInput':'assets/odyssey/refit-v142/armed-ship.glb','cyclesGPU':True},indent=2),encoding='utf-8');print('V142_PROCESS_COMPLETE',flush=True)
