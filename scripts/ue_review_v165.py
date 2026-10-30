"""Scoped V165 jobs. Never rebuild accepted island, vessel, crew, or home assets."""
import unreal as u,json,time,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-165';OUT.mkdir(exist_ok=True)
def inventory():
 actors=u.get_editor_subsystem(u.EditorActorSubsystem);ed=u.get_editor_subsystem(u.UnrealEditorSubsystem)
 r={'at':time.time(),'world':ed.get_editor_world().get_path_name(),'actors':[],'materials':{}}
 for a in actors.get_all_level_actors():
  q={'label':a.get_actor_label(),'class':a.get_class().get_name(),'position':str(a.get_actor_location())}
  if isinstance(a,u.StaticMeshActor):
   c=a.static_mesh_component;q['mesh']=c.static_mesh.get_path_name()if c.static_mesh else None;q['materials']=[c.get_material(i).get_path_name()if c.get_material(i)else None for i in range(c.get_num_materials())]
  if isinstance(a,u.Light):q.update(intensity=a.light_component.intensity,color=str(a.light_component.get_light_color()))
  r['actors'].append(q)
 for path in ['/Game/V164/CoastalLivingWater','/Game/V162Polish/OriginalNaturalWater']:
  m=u.load_asset(path)
  if not m:continue
  expr=[]
  for e in u.ObjectIterator(u.MaterialExpression):
   if e.get_outer()!=m:continue
   q={'name':e.get_name(),'class':e.get_class().get_name()}
   for key in ['code','parameter_name','default_value','r','g','b','a','constant','const_a','const_b']:
    try:q[key]=str(e.get_editor_property(key))
    except Exception:pass
   expr.append(q)
  r['materials'][path]=expr
 (OUT/'native-inventory.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
def run():
 request=OUT/'request.json';v=json.loads(request.read_text(encoding='utf-8-sig'));kind=v['kind']
 if kind=='inventory':inventory()
 elif kind=='warm-install':
  import inspect,ue_worlds_v165,ue_art_v165
  importlib.reload(ue_worlds_v165);w=ue_worlds_v165.ensure()
  subsystem=u.get_editor_subsystem(u.EditorActorSubsystem);removed=[]
  for a in subsystem.get_all_level_actors():
   if a.get_path_name().startswith(ue_worlds_v165.PATH+'.PortfolioLiveV165:PersistentLevel.')and a.get_actor_label()in['V162 actual planar courtyard reflection','V162 native night exposure']:
    removed.append(a.get_actor_label());subsystem.destroy_actor(a)
  u.EditorLoadingAndSavingUtils.save_map(w,ue_worlds_v165.PATH)
  (OUT/'resident-host-cleanup.json').write_text(json.dumps({'removedGeneratedHelpersBeforeSaving':removed,'sourceActorsRemoved':0}))
  g=next(frame.frame.f_globals for frame in inspect.stack()if frame.filename.replace('\\','/').endswith('ue-live-final-v162.py')and 'report'in frame.frame.f_globals)
  source=(P/'scripts/ue-live-final-v162.py').read_text(encoding='utf-8');section=source[source.index('def load(scene):'):source.index('initialScene=')]
  exec(compile(section,str(P/'scripts/ue-live-final-v162.py'),'exec'),g);g['load'](g['current']);importlib.reload(ue_art_v165).runtime()
 elif kind=='warm-test':
  import ue_worlds_v165
  importlib.reload(ue_worlds_v165).ensure()
 elif kind=='stream':
  import ue_stream_v164
  importlib.reload(ue_stream_v164).ensure(refresh=True)
 elif kind=='runtime':
  import ue_art_v165
  importlib.reload(ue_art_v165).runtime()
 elif kind=='stable-capture':
  w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
  u.SystemLibrary.execute_console_command(w,'MediaIO.EnableExperimentalScheduling 0')
  (OUT/'capture-scheduling.json').write_text(json.dumps({'experimentalScheduling':u.SystemLibrary.get_console_variable_int_value('MediaIO.EnableExperimentalScheduling'),'reason':'use the supported render-thread capture path; experimental GPU fence waits timed out during switches','at':time.time()}))
 elif kind=='profile':
  w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
  u.SystemLibrary.execute_console_command(w,'r.ProfileGPU.ShowUI 0')
  u.SystemLibrary.execute_console_command(w,'ProfileGPU')
 elif kind in ['codec-h264','codec-vp8']:
  codec='H264'if kind=='codec-h264'else'VP8';w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
  u.SystemLibrary.execute_console_command(w,'PixelStreaming2.Encoder.Codec '+codec)
  (OUT/'codec-trial.json').write_text(json.dumps({'requested':codec,'actual':u.SystemLibrary.get_console_variable_string_value('PixelStreaming2.Encoder.Codec'),'at':time.time()}))
 elif kind in ['water','lighting','room','home','leaves']:
  import ue_art_v165
  getattr(importlib.reload(ue_art_v165),kind)()
 else:raise ValueError('Unknown V165 job '+kind)
 (OUT/'job-result.json').write_text(json.dumps({'kind':kind,'ok':True,'at':time.time()}));request.unlink()
