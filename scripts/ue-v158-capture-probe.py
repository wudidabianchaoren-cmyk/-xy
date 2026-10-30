"""Isolated staged capture proof. No existing map or asset is saved or edited."""
import unreal as u,json,time,traceback
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'.verify/v32-158/ue'
OUT.mkdir(parents=True,exist_ok=True)
r={'engine':u.SystemLibrary.get_engine_version(),'savedCoveModified':False,'stages':[],'properties':{}}
handle=None
def save(): (OUT/'probe.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
def prop(obj,k,v):
 try:obj.set_editor_property(k,v);r['properties'][k]='set'
 except Exception as e:r['properties'][k]=str(e)
try:
 u.EditorLoadingAndSavingUtils.new_blank_map(False)
 world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world();actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 cube=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,0,100));cube.static_mesh_component.set_static_mesh(u.load_asset('/Engine/BasicShapes/Cube.Cube'))
 cube.set_actor_scale3d(u.Vector(2,2,2));cube.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
 floor=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,0,-10));floor.static_mesh_component.set_static_mesh(u.load_asset('/Engine/BasicShapes/Cube.Cube'));floor.set_actor_scale3d(u.Vector(10,10,.1));floor.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE)
 key=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(0,0,700),u.Rotator(-40,-30,0));key.light_component.set_mobility(u.ComponentMobility.MOVABLE);key.light_component.set_intensity(8);key.light_component.set_light_color(u.LinearColor(1,.75,.45))
 point=actors.spawn_actor_from_class(u.PointLight,u.Vector(220,-220,300));point.light_component.set_mobility(u.ComponentMobility.MOVABLE);point.light_component.set_intensity(10000);point.light_component.set_attenuation_radius(1500)
 sky=actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector(0,0,0));prop(key.light_component,'atmosphere_sun_light',True)
 cap=actors.spawn_actor_from_class(u.SceneCapture2D,u.Vector(600,-650,450));cap.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cap.get_actor_location(),u.Vector(0,0,90)),False)
 c=cap.get_component_by_class(u.SceneCaptureComponent2D)
 target=u.RenderingLibrary.create_render_target2d(world,960,640,u.TextureRenderTargetFormat.RTF_RGBA8)
 u.RenderingLibrary.clear_render_target2d(world,target,u.LinearColor(.9,.04,.01,1))
 u.RenderingLibrary.export_render_target(world,target,str(OUT),'clear-red.png')
 prop(c,'texture_target',target);prop(c,'capture_every_frame',False);prop(c,'capture_on_movement',False);prop(c,'always_persist_rendering_state',True);prop(c,'capture_source',u.SceneCaptureSource.SCS_FINAL_COLOR_LDR);prop(c,'fov_angle',45.)
 settings=c.get_editor_property('post_process_settings')
 for k,v in [('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',0.)]:prop(settings,k,v)
 prop(c,'post_process_settings',settings);prop(c,'post_process_blend_weight',1.)
 began=time.monotonic();step=0;last=began
 def tick(dt):
  global step,last,handle
  now=time.monotonic()
  if now-began>90:
   r['timeout']=True;save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
  if now-last<(12 if step==0 else 2):return
  try:
   if step==0:c.capture_scene();r['stages'].append('capture at separate tick');step=1
   elif step==1:u.RenderingLibrary.export_render_target(world,target,str(OUT),'probe-lit.png');r['stages'].append('export at next tick');r['renderExecuted']=True;save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
   last=now
  except Exception:r['failure']=traceback.format_exc();save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 u.EditorPythonScripting.set_keep_python_script_alive(True);handle=u.register_slate_post_tick_callback(tick);save()
except Exception:r['failure']=traceback.format_exc();save();u.SystemLibrary.quit_editor()
