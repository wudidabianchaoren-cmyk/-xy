import bpy,json,pathlib,math
from mathutils import Vector
p=pathlib.Path('C:/Users/HP/Desktop/codex 测试2/cinematic-ai-archive-prototype');out=p/'blender/reference-architecture-v23';s=bpy.context.scene;c=s.camera
track=json.loads((p/'blender/reference-architecture-v16/world-track.json').read_text());w=track['camera']['frames'][0]
keys=[{'t':0,'p':[-.45,1.25,5.8],'g':[0,7.8,-1],'f':68},{'t':3.2,'p':[-1.25,1.6,7.2],'g':[-2.1,5.6,-1.1],'f':62},{'t':5.8,'p':[-3.6,2,9.3],'g':[-5.8,3.2,-3],'f':58},{'t':8.5,'p':[3.5,1.85,8.8],'g':[7.15,3.2,-1],'f':56},{'t':11.5,'p':[1.3,4.2,10.8],'g':[0,5.5,-.4],'f':52},{'t':16,'p':w['position'],'g':w['target'],'f':math.degrees(2*math.atan(36/(2*w['lens']*16/9)))}]
c.animation_data_clear();c.rotation_mode='XYZ'
for constraint in list(c.constraints):c.constraints.remove(constraint)
s.render.fps=30;s.frame_start=1;s.frame_end=481
for k in keys:
 c.location=(k['p'][0],-k['p'][2],k['p'][1]);target=Vector((k['g'][0],-k['g'][2],k['g'][1]));c.rotation_euler=(target-c.location).to_track_quat('-Z','Y').to_euler();c.data.lens=36/(2*math.tan(math.radians(k['f'])/2)*16/9)
 frame=1+round(k['t']*30);c.keyframe_insert(data_path='location',frame=frame);c.keyframe_insert(data_path='rotation_euler',frame=frame);c.data.keyframe_insert(data_path='lens',frame=frame)
(out/'camera-v23.json').write_text(json.dumps({'source':'Blender V23 native camera keyframes','duration':16,'keys':keys},indent=2))
s.frame_set(1);s.cycles.samples=32;s.render.filepath=str(out/'tower-low-angle-cycles.png');bpy.ops.render.render(write_still=True)
s.frame_set(481);s.render.filepath=str(out/'courtyard-material-cycles.png');bpy.ops.wm.save_as_mainfile(filepath=str(out/'current-complete-courtyard.blend'))
print('Native six-look camera authored, low-angle Cycles proof saved, final wide retained')
