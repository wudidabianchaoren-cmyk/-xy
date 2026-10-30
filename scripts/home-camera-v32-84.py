import bpy,json,os
from mathutils import Vector
P=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));O=os.path.join(P,'blender','home-camera-v32-84');j=json.load(open(os.path.join(O,'camera-v84.json'),encoding='utf8'));bpy.ops.wm.read_factory_settings(use_empty=True)
for i,k in enumerate(j['keys']):
 d=bpy.data.cameras.new('V32.84 confined architecture look '+str(i+1));o=bpy.data.objects.new(d.name,d);bpy.context.scene.collection.objects.link(o);o.location=(k['p'][0],-k['p'][2],k['p'][1]);g=Vector((k['g'][0],-k['g'][2],k['g'][1]));o.rotation_euler=(g-o.location).to_track_quat('-Z','Y').to_euler();d.lens=18/__import__('math').tan(__import__('math').radians(k['f'])/2);o['second']=k['t'];o['gaze']=list(g)
j['actualBlender']=bpy.app.version_string;j['nativeCameraCount']=len(bpy.data.cameras);json.dump(j,open(os.path.join(O,'camera-v84.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2);bpy.ops.wm.save_as_mainfile(filepath=os.path.join(O,'camera-visit.blend'))
