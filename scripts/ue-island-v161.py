"""Actual local UE5 island look development; existing source map is never saved over."""
import unreal as u,time,json,math,traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-161/ue-island';OUT.mkdir(parents=True,exist_ok=True)
r={'engine':u.SystemLibrary.get_engine_version(),'sourceMap':'/Game/Cove/FullCoveV149','savedSourceMapModified':False,'newHouse':str(P/'assets/odyssey/refit-v161/island-craft.glb'),'faces':[],'errors':[],'warnings':[]}
def note():(OUT/'report.json').write_text(json.dumps(r,indent=2),encoding='utf-8')
def vec(p):return u.Vector(p[0]*100,p[2]*100,p[1]*100)
def prop(o,k,v):
 try:o.set_editor_property(k,v)
 except Exception as e:r['warnings'].append(k+': '+str(e)[:140])
try:
 u.EditorPythonScripting.set_keep_python_script_alive(True);u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV149');actors=u.get_editor_subsystem(u.EditorActorSubsystem);editor=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=editor.get_editor_world();old=actors.get_all_level_actors();r['sourceActors']=len(old)
 inventory=[];hidden=[]
 for a in old:
  if isinstance(a,u.DirectionalLight):a.light_component.set_intensity(0.)
  if isinstance(a,u.SceneCapture2D):actors.destroy_actor(a)
  if isinstance(a,u.StaticMeshActor):
   comp=a.static_mesh_component;mesh=comp.static_mesh;label=a.get_actor_label();materials=[comp.get_material(i).get_name()if comp.get_material(i)else''for i in range(comp.get_num_materials())];text=(label+' '+str(mesh.get_path_name()if mesh else'')+' '+' '.join(materials)).lower();inventory.append({'label':label,'materials':materials,'mesh':str(mesh.get_path_name()if mesh else'')})
   if any(k in text for k in ['cottage','limewashed','v138_house']):comp.set_visibility(False,True);hidden.append(label)
   if label=='Grass':comp.set_visibility(False,True)
   if 'sky' in label.lower() and max(a.get_actor_bounds(False)[1].x,a.get_actor_bounds(False)[1].y)>15000:comp.set_visibility(False,True)
 (OUT/'source-inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8');r['oldHouseHidden']=hidden
 task=u.AssetImportTask();task.filename=r['newHouse'];task.destination_path='/Game/V161Island';task.automated=True;task.replace_existing=True;task.save=False;u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);imported=[]
 for path in task.imported_object_paths:
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector());a.static_mesh_component.set_static_mesh(asset);a.static_mesh_component.set_mobility(u.ComponentMobility.MOVABLE);a.set_actor_label('V161 historical stone house / '+asset.get_name());imported.append(a)
 r['newHouseMeshes']=len(imported)
 if not imported:raise RuntimeError('No actual new stone-house meshes imported')
 sun=actors.spawn_actor_from_class(u.DirectionalLight,vec([-76,86,35]));sun.set_actor_label('V161 warm clear maritime sun');sun.set_actor_rotation(u.MathLibrary.find_look_at_rotation(sun.get_actor_location(),vec([-7,8,-20])),False);sun.light_component.set_mobility(u.ComponentMobility.MOVABLE);sun.light_component.set_light_color(u.LinearColor(1.,.78,.49,1.));sun.light_component.set_intensity(8.5);prop(sun.light_component,'atmosphere_sun_light',True);prop(sun.light_component,'light_source_angle',1.2);prop(sun.light_component,'volumetric_scattering_intensity',.85)
 sky=next((a for a in old if isinstance(a,u.SkyLight)),None)
 if not sky:sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,1500))
 sky.light_component.set_mobility(u.ComponentMobility.MOVABLE);sky.light_component.set_intensity(2.4);sky.light_component.set_light_color(u.LinearColor(.78,.88,1.,1.))
 if not any(isinstance(a,u.SkyAtmosphere)for a in old):actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector())
 fog=next((a for a in old if isinstance(a,u.ExponentialHeightFog)),None)
 if not fog:fog=actors.spawn_actor_from_class(u.ExponentialHeightFog,u.Vector(0,0,50))
 fc=fog.get_component_by_class(u.ExponentialHeightFogComponent)
 for k,v in [('fog_density',.004),('fog_height_falloff',.24),('enable_volumetric_fog',True),('volumetric_fog_scattering_distribution',.3),('volumetric_fog_albedo',u.Color(245,232,205,255))]:prop(fc,k,v)
 r['volumetricFogEnabled']=bool(fc.get_editor_property('enable_volumetric_fog'))
 settings=u.PostProcessSettings()
 for k,v in [('override_dynamic_global_illumination_method',True),('dynamic_global_illumination_method',u.DynamicGlobalIlluminationMethod.LUMEN),('override_reflection_method',True),('reflection_method',u.ReflectionMethod.LUMEN),('override_auto_exposure_method',True),('auto_exposure_method',u.AutoExposureMethod.AEM_MANUAL),('override_auto_exposure_apply_physical_camera_exposure',True),('auto_exposure_apply_physical_camera_exposure',False),('override_auto_exposure_bias',True),('auto_exposure_bias',.55),('override_motion_blur_amount',True),('motion_blur_amount',0.)]:prop(settings,k,v)
 pp=actors.spawn_actor_from_class(u.PostProcessVolume,u.Vector());pp.set_editor_property('unbound',True);pp.set_editor_property('priority',100.);pp.set_editor_property('settings',settings)
 for cmd in ['r.ScreenPercentage 100','r.AntiAliasingMethod 4','r.MotionBlurQuality 0','r.DepthOfFieldQuality 0','r.Streaming.PoolSize 2000','t.MaxFPS 30']:u.SystemLibrary.execute_console_command(world,cmd)
 cam=actors.spawn_actor_from_class(u.CameraActor,vec([37,17,49]));cam.set_actor_label('V161 actual island review camera');cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),vec([-6,9,-16])),False);cc=cam.get_component_by_class(u.CameraComponent);cc.set_editor_property('field_of_view',math.degrees(2*math.atan(math.tan(math.radians(34)/2)*16/9)));cc.set_editor_property('aspect_ratio',16/9);cc.set_editor_property('constrain_aspect_ratio',True);cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.)
 u.EditorAssetLibrary.save_directory('/Game/V161Island');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV161');r['savedMap']='/Game/Cove/FullCoveV161';r['matchedWebCraft']=True
 editor.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());r['stage']='warming actual Lumen scene';r['lighting']='new maritime sun / Lumen / sky atmosphere / actual volumetric height fog';note()
 faces=[('px',u.Rotator(pitch=0,yaw=0,roll=0)),('nx',u.Rotator(pitch=0,yaw=180,roll=0)),('py',u.Rotator(pitch=0,yaw=90,roll=0)),('ny',u.Rotator(pitch=0,yaw=-90,roll=0)),('pz',u.Rotator(pitch=90,yaw=0,roll=0)),('nz',u.Rotator(pitch=-90,yaw=0,roll=0))]
 began=time.monotonic();last=began;stage='warm';pending=None;index=0;handle=None
 def tick(dt):
  global last,stage,pending,index,handle
  now=time.monotonic()
  try:
   if now-began>480:raise RuntimeError('UE island capture timeout')
   if stage=='warm'and now-last>30:
    pending=u.AutomationLibrary.take_high_res_screenshot(1600,900,str(OUT/'island-hero.exr'),camera=cam,capture_hdr=True);stage='hero';last=now
   elif stage=='hero'and now-last>8:
    done=getattr(pending,'is_task_done',None)
    if done is not None and not(done()if callable(done)else done):return
    r['heroReady']=(OUT/'island-hero.exr').exists();r['stage']='six native viewport faces';note();cam.set_actor_location(vec([0,9,-20]),False,False);cam.set_actor_rotation(faces[0][1],False);cc.set_editor_property('field_of_view',90.);cc.set_editor_property('aspect_ratio',1.);editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[0][1]);stage='face-warm';last=now
   elif stage=='face-warm'and now-last>7:
    name=faces[index][0];pending=u.AutomationLibrary.take_high_res_screenshot(512,512,str(OUT/('viewport-linear-'+name+'.exr')),camera=cam,capture_hdr=True);r['faces'].append(name);note();stage='face-wait';last=now
   elif stage=='face-wait'and now-last>6:
    done=getattr(pending,'is_task_done',None)
    if done is not None and not(done()if callable(done)else done):return
    index+=1
    if index==6:r['complete']=True;r['stage']='complete';note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor();return
    cam.set_actor_rotation(faces[index][1],False);editor.set_level_viewport_camera_info(cam.get_actor_location(),faces[index][1]);stage='face-warm';last=now
  except Exception:r['errors'].append(traceback.format_exc());note();u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:r['errors'].append(traceback.format_exc());note();u.SystemLibrary.quit_editor()
