import bpy, json, pathlib, time
from mathutils import Vector
P=pathlib.Path(__file__).resolve().parents[1]
O=P/'blender/home-intro-v32-88'; O.mkdir(parents=True,exist_ok=True)
started=time.monotonic()
bpy.ops.wm.open_mainfile(filepath=str(P/'blender/reference-architecture-v24/current-complete-courtyard.blend'))
s=bpy.context.scene
names=['V13__chased_pale_gold_bronze_batch','V13__chased_pale_gold_bronze_batch001']
for name in names:
    obj=bpy.data.objects.get(name)
    if obj: bpy.data.objects.remove(obj,do_unlink=True)
with bpy.data.libraries.load(str(P/'blender/reference-architecture-v25/clock-refinement.blend'),link=False) as (source,target):
    target.objects=[name for name in source.objects if name in names]
for obj in target.objects:
    if obj: s.collection.objects.link(obj)
s.render.engine='CYCLES'; s.cycles.samples=192; s.cycles.use_denoising=False
s.cycles.denoising_use_gpu=False
s.cycles.adaptive_threshold=.035
s.cycles.max_bounces=7; s.cycles.diffuse_bounces=3; s.cycles.glossy_bounces=4
s.render.resolution_x=2560; s.render.resolution_y=1440; s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG'; s.render.image_settings.color_mode='RGB'
s.view_settings.view_transform='AgX';s.view_settings.look='None';s.view_settings.exposure=-.30
devices=[]
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
    for d in prefs.devices:
        d.use=d.type=='CUDA'
        if d.use: devices.append(d.name)
    s.cycles.device='GPU' if devices else 'CPU'
except Exception:s.cycles.device='CPU'
camera=bpy.data.objects.new('V88 / enamel and bronze close-up',bpy.data.cameras.new('V88 close-up optics'))
s.collection.objects.link(camera);s.camera=camera
camera.location=(-.15,-11.8,5.65)
target=Vector((-.15,.1,5.45));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='PERSP';camera.data.lens=52;camera.data.dof.use_dof=False
s.render.filepath=str(O/'clock-close-cycles.png')
bpy.ops.wm.save_as_mainfile(filepath=str(O/'clock-close-native.blend'))
try:bpy.ops.render.render(write_still=True)
except RuntimeError:
    s.cycles.device='CPU';bpy.ops.render.render(write_still=True)
(O/'render-audit.json').write_text(json.dumps({'actualBlender':bpy.app.version_string,'engine':s.render.engine,'device':s.cycles.device,'devices':devices,'samples':s.cycles.samples,'resolution':[2560,1440],'nativeSource':'reference-architecture-v24/current-complete-courtyard.blend','fourRingSource':'reference-architecture-v25/clock-refinement.blend','cameraPosition':list(camera.location),'cameraLens':camera.data.lens,'meshes':sum(o.type=='MESH' for o in s.objects),'seconds':time.monotonic()-started,'render':'clock-close-cycles.png'},indent=2),encoding='utf8')
print('V32.88 actual native close-up rendered',flush=True)
