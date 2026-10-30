"""UE-authored original courtyard capture and six linear-HDR environment faces."""
import unreal as u,json,time,traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-158/ue';OUT.mkdir(parents=True,exist_ok=True)
r={'engine':u.SystemLibrary.get_engine_version(),'savedCoveModified':False,'source':'blender/reference-architecture-v16/architecture-world.glb','properties':{},'stages':[]}
def save(): (OUT/'clock.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
def prop(o,k,v):
 try:o.set_editor_property(k,v);r['properties'][k]='set'
 except Exception as e:r['properties'][k]=str(e)
try:
 u.EditorLoadingAndSavingUtils.new_blank_map(False);world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world();actors=u.get_editor_subsystem(u.EditorActorSubsystem)
 task=u.AssetImportTask();task.filename=str(P/r['source']);task.destination_path='/Game/V158ClockStudy';task.automated=True;task.save=False;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);meshes=[]
 for path in task.imported_object_paths:
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,0,0));a.static_mesh_component.set_static_mesh(asset);a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);meshes.append(a)
 r['meshCount']=len(meshes)
 key=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(-600,900,1800),u.Rotator(-36,-62,0));key.light_component.set_mobility(u.ComponentMobility.MOVABLE);key.light_component.set_intensity(65000);key.light_component.set_light_color(u.LinearColor(1,.78,.45));prop(key.light_component,'atmosphere_sun_light',True)
 actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector(0,0,0));sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,800));sky.light_component.set_mobility(u.ComponentMobility.MOVABLE);sky.light_component.set_intensity(.8);prop(sky.light_component,'real_time_capture',True)
 cap=actors.spawn_actor_from_class(u.SceneCapture2D,u.Vector(-25,2800,700));cap.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cap.get_actor_location(),u.Vector(-15,-120,440)),False);c=cap.get_component_by_class(u.SceneCaptureComponent2D)
 target=u.RenderingLibrary.create_render_target2d(world,1600,1000,u.TextureRenderTargetFormat.RTF_RGBA8);hdr=u.RenderingLibrary.create_render_target2d(world,512,512,u.TextureRenderTargetFormat.RTF_RGBA16F)
 for k,v in [('texture_target',target),('capture_every_frame',False),('capture_on_movement',False),('always_persist_rendering_state',True),('capture_source',u.SceneCaptureSource.SCS_FINAL_COLOR_LDR),('fov_angle',40.)]:prop(c,k,v)
 pp=c.get_editor_property('post_process_settings')
 for k,v in [('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',-13.)]:prop(pp,k,v)
 prop(c,'post_process_settings',pp);prop(c,'post_process_blend_weight',1.)
 # Probe is in the courtyard in front of the original clock, with six 90-degree views.
 probe=u.Vector(-15,650,280);views=[('px',u.Rotator(0,0,0)),('nx',u.Rotator(0,180,0)),('py',u.Rotator(0,90,0)),('ny',u.Rotator(0,-90,0)),('pz',u.Rotator(90,0,0)),('nz',u.Rotator(-90,0,0))]
 step=0;index=0;last=time.monotonic();began=last;handle=None
 def tick(dt):
  global step,index,last,handle
  now=time.monotonic()
  if now-began>180:r['timeout']=True;save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
  if now-last<(32 if step==0 else 2):return
  try:
   if step==0:sky.light_component.recapture_sky();c.capture_scene();step=1;r['stages'].append('hero capture')
   elif step==1:u.RenderingLibrary.export_render_target(world,target,str(OUT),'clock-ue5.png');step=2
   elif step==2:
    if index==len(views):r['renderExecuted']=True;r['captureFaces']=len(views);save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
    label,rot=views[index];cap.set_actor_location(probe,False,False);cap.set_actor_rotation(rot,False);prop(c,'texture_target',hdr);prop(c,'capture_source',u.SceneCaptureSource.SCS_SCENE_COLOR_HDR);prop(c,'fov_angle',90.);step=3
   elif step==3:c.capture_scene();step=4
   elif step==4:
    label,_=views[index];u.RenderingLibrary.export_render_target(world,hdr,str(OUT),'courtyard-'+label+'.hdr');r['stages'].append('linear HDR '+label);index+=1;step=2
   last=now;save()
  except Exception:r['failure']=traceback.format_exc();save();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 u.EditorPythonScripting.set_keep_python_script_alive(True);handle=u.register_slate_post_tick_callback(tick);save()
except Exception:r['failure']=traceback.format_exc();save();u.SystemLibrary.quit_editor()
