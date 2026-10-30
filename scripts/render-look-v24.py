import bpy,json,pathlib,array,zlib
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v24';s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='CUDA';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='CUDA'
s.cycles.device='GPU';s.cycles.samples=32;s.cycles.use_denoising=True
wide=json.loads((p/'blender/reference-architecture-v16/world-track.json').read_text())['camera']['frames'][0]
from mathutils import Vector
camera=s.camera;camera.animation_data_clear();camera.data.animation_data_clear();camera.data.type='PERSP';camera.data.lens=wide['lens'];camera.data.sensor_width=36;camera.data.sensor_fit='HORIZONTAL'
camera.location=(wide['position'][0],-wide['position'][2],wide['position'][1]);target=Vector((wide['target'][0],-wide['target'][2],wide['target'][1]));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
s.render.resolution_x=1600;s.render.resolution_y=900;s.render.filepath=str(out/'matched-wide-cycles.png')
if not (out/'matched-wide-cycles.png').exists():bpy.ops.render.render(write_still=True)
probe=bpy.data.cameras.new('Native clock reflection radiance probe');probe.type='PANO';probe.panorama_type='EQUIRECTANGULAR';o=bpy.data.objects.new(probe.name,probe);s.collection.objects.link(o);o.location=(0,-1.7,4);o.rotation_euler=(1.5707963,0,0);s.camera=o
s.render.resolution_x=256;s.render.resolution_y=128;s.cycles.samples=16;s.render.image_settings.file_format='OPEN_EXR';s.render.image_settings.color_depth='32';s.render.filepath=str(out/'reflection-probe.exr');bpy.ops.render.render(write_still=True)
image=bpy.data.images.load(str(out/'reflection-probe.exr'));pixels=array.array('f',[0])*(256*128*4);image.pixels.foreach_get(pixels)
(out/'reflection-probe.bin.z').write_bytes(zlib.compress(pixels.tobytes(),6))
(out/'reflection-probe.json').write_text(json.dumps({'width':256,'height':128,'format':'RGBA float32 scene-linear','source':'Actual Cycles rendered current complete scene, not an external HDRI','position':[0,4,1.7]}),encoding='utf8')
print('Native matched view and reflection probe complete')
