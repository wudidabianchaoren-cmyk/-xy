"""Bounded V170 calendar/sea inspection and runtime changes; preserve original scene assets."""
import unreal as u,json,time,importlib
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-170'
def run():
 import ue_worlds_v165
 kind=json.loads((OUT/'request.json').read_text(encoding='utf-8-sig'))['kind'];result={'kind':kind}
 if kind=='inventory':
  rows=[]
  for scene in ['room','myth']:
   for a in ue_worlds_v165.actors(scene):
    if not isinstance(a,u.StaticMeshActor):continue
    c=a.static_mesh_component;name=c.static_mesh.get_name()if c.static_mesh else''
    if 'calendar'in name.lower()or a.get_actor_label()=='Water foundation':rows.append({'scene':scene,'label':a.get_actor_label(),'mesh':name,'materials':[c.get_material(i).get_path_name()for i in range(c.get_num_materials())]})
  result['actors']=rows
 elif kind=='runtime':
  import ue_runtime_v162,ue_room_calendar_v170,ue_stream_v164,builtins
  if ue_runtime_v162.handle is not None:u.unregister_slate_post_tick_callback(ue_runtime_v162.handle)
  importlib.reload(ue_room_calendar_v170);importlib.reload(ue_runtime_v162).ensure_runtime()
  c=getattr(builtins,'_zaojing_native_capture_v164',None)
  if c:c.set_editor_property('stream_fps_override',45)
  u.SystemLibrary.execute_console_command(u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world(),'PixelStreaming2.WebRTC.Fps 45')
  result.update(persistentProducer=True,activeCap=45)
 elif kind=='visibility':
  import ue_worlds_v165 as m
  prior=m.active;source=(P/'scripts/ue_worlds_v165.py').read_text(encoding='utf-8');m.visibility_groups={};exec(compile(source[source.index('def show('):source.index('def actors(')],str(P/'scripts/ue_worlds_v165.py'),'exec'),m.__dict__);m.active=None;m.show(prior)
  result.update(scenePreserved=prior,cached={k:{'volumes':len(v['volumes']),'components':len(v['components'])}for k,v in m.visibility_groups.items()},sourceMeshesPreserved=True)
 elif kind in ['codec-vp9','codec-vp8']:
  codec='VP9'if kind=='codec-vp9'else'VP8';w=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world();u.SystemLibrary.execute_console_command(w,'PixelStreaming2.Encoder.Codec '+codec);result.update(codec=codec)
  import inspect
  for frame in inspect.stack():
   if frame.filename.replace('\\','/').endswith('ue-live-final-v162.py')and 'report'in frame.frame.f_globals:frame.frame.f_globals['report']['codec']=codec;break
 elif kind=='camera':
  import inspect
  g=next(frame.frame.f_globals for frame in inspect.stack()if frame.filename.replace('\\','/').endswith('ue-live-final-v162.py')and 'report'in frame.frame.f_globals)
  source=(P/'scripts/ue-live-final-v162.py').read_text(encoding='utf-8');body=source[source.index('def tick(dt):'):source.index('from ue_stability_v163 import QUALITY')]
  u.unregister_slate_post_tick_callback(g['handle']);exec(compile(body,str(P/'scripts/ue-live-final-v162.py'),'exec'),g);g['handle']=u.register_slate_post_tick_callback(g['tick']);result.update(sameEngine=True,fovOnlyWhenChanged=True)
 elif kind=='stream45':
  import builtins
  c=getattr(builtins,'_zaojing_native_capture_v164',None);assert c
  c.set_editor_property('stream_fps_override',45);c.start_streaming()
  result.update(fps=45,explicitStop=False,sameEngine=True)
 elif kind=='water':
  source=u.load_asset('/Game/V166/QuietBreakingSea');sea=u.load_asset('/Game/V170/WeightedCoveSea')or u.EditorAssetLibrary.duplicate_asset(source.get_path_name(),'/Game/V170/WeightedCoveSea');mel=u.MaterialEditingLibrary;changes=[]
  for e in u.ObjectIterator(u.MaterialExpressionCustom):
   if e.get_outer()!=sea:continue
   code=e.get_editor_property('code')
   if 'float depth=max(0.,D.r-Z)'in code:
    e.set_editor_property('code',code.replace('grain)*.40','grain)*.22').replace('.25+wash*.35','.19+wash*.26'));changes.append('restrained shore wash / less chalky water')
  output=next(e for e in u.ObjectIterator(u.MaterialExpressionSingleLayerWaterMaterialOutput)if e.get_outer()==sea)
  for pin,c in [('ScatteringCoefficients',(.00065,.00135,.0015)),('AbsorptionCoefficients',(.0042,.0018,.0012))]:
   n=mel.create_material_expression(sea,u.MaterialExpressionConstant3Vector);n.constant=u.LinearColor(*c,1);mel.connect_material_expressions(n,'',output,pin)
  mel.recompile_material(sea);u.EditorAssetLibrary.save_loaded_asset(sea)
  for a in ue_worlds_v165.actors('myth'):
   if a.get_actor_label()=='Water foundation':a.static_mesh_component.set_material(0,sea)
  result.update(material=sea.get_path_name(),changes=changes,sourcePreserved=True)
 else:raise ValueError('Unknown bounded V170 operation')
 result.update(at=time.time(),ok=True);(OUT/(kind+'-native.json')).write_text(json.dumps(result,indent=2));(OUT/'request.json').unlink()
