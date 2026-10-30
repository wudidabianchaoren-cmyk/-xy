"""Bounded UE5 clock/courtyard look-development; never modifies the saved cove map."""
import unreal as u, json, time, traceback
from pathlib import Path
P=Path(__file__).resolve().parents[1];OUT=P/'.verify/v32-157';OUT.mkdir(exist_ok=True)
result={'engine':u.SystemLibrary.get_engine_version(),'source':'blender/reference-architecture-v16/architecture-world.glb','webRendererUnchanged':True,'savedCoveModified':False}
try:
 u.EditorLoadingAndSavingUtils.new_blank_map(False)
 actors=u.get_editor_subsystem(u.EditorActorSubsystem);world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
 task=u.AssetImportTask();task.filename=str(P/result['source']);task.destination_path='/Game/LookdevV157';task.automated=True;task.replace_existing=False;task.save=False
 u.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task]);paths=list(task.imported_object_paths);result['importedPaths']=paths
 meshes=[]
 for path in paths:
  asset=u.load_asset(path)
  if isinstance(asset,u.StaticMesh):
   a=actors.spawn_actor_from_class(u.StaticMeshActor,u.Vector(0,0,0));a.static_mesh_component.set_static_mesh(asset);meshes.append(a)
 if not meshes:raise RuntimeError('No static mesh imported from existing native glTF; do not claim a UE-rendered webpage.')
 key=actors.spawn_actor_from_class(u.DirectionalLight,u.Vector(0,0,1000),u.Rotator(-38,55,0));key.light_component.set_intensity(5);key.light_component.set_light_color(u.LinearColor(1,.66,.28))
 actors.spawn_actor_from_class(u.SkyAtmosphere,u.Vector(0,0,0));key.light_component.set_editor_property('atmosphere_sun_light',True)
 sky=actors.spawn_actor_from_class(u.SkyLight,u.Vector(0,0,800));sky.light_component.set_intensity(.8);sky.light_component.recapture_sky()
 result['meshBounds']=[{'name':a.static_mesh_component.static_mesh.get_name(),'centre':[a.get_actor_bounds(False)[0].x,a.get_actor_bounds(False)[0].y,a.get_actor_bounds(False)[0].z],'extent':[a.get_actor_bounds(False)[1].x,a.get_actor_bounds(False)[1].y,a.get_actor_bounds(False)[1].z]} for a in meshes]
 focus=next((a for a in meshes if 'quarried_warm_limestone' in a.static_mesh_component.static_mesh.get_name()),meshes[-1]);centre,extent=focus.get_actor_bounds(False);size=max(extent.x,extent.y,extent.z);result['focus']={'centre':[centre.x,centre.y,centre.z],'size':size};(OUT/'ue-clock-bounds.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
 cap=actors.spawn_actor_from_class(u.SceneCapture2D,centre+u.Vector(size*3.3,0,size*.25));cap.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cap.get_actor_location(),centre),False)
 target=u.RenderingLibrary.create_render_target2d(world,1600,1100,u.TextureRenderTargetFormat.RTF_RGBA8)
 component=cap.get_component_by_class(u.SceneCaptureComponent2D);component.texture_target=target;component.fov_angle=35;component.capture_source=u.SceneCaptureSource.SCS_FINAL_COLOR_LDR
 u.EditorPythonScripting.set_keep_python_script_alive(True);began=time.monotonic();handle=None
 def tick(_dt):
  global handle
  if time.monotonic()-began<22:return
  try:
   for label,offset in [('xp',u.Vector(1,0,.14)),('xn',u.Vector(-1,0,.14)),('yp',u.Vector(0,1,.14)),('yn',u.Vector(0,-1,.14))]:
    cap.set_actor_location(centre+offset*(size*3.3),False,False);cap.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cap.get_actor_location(),centre),False);component.capture_scene();u.RenderingLibrary.export_render_target(world,target,str(OUT),'ue-clock-bounds-'+label+'.png')
   result['captures']=[str(p) for p in OUT.glob('ue-clock-bounds-*.png')];result['captureExists']=bool(result['captures']);result['meshCount']=len(meshes);result['renderExecuted']=True;result['passed']=False;result['visualReview']='pending; capture existence is not visual acceptance';(OUT/'ue-clock-result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
  except Exception:result['failure']=traceback.format_exc();(OUT/'ue-clock-result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
  u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:
 result['passed']=False;result['failure']=traceback.format_exc();(OUT/'ue-clock-result.json').write_text(json.dumps(result,indent=2),encoding='utf-8');u.SystemLibrary.quit_editor()
