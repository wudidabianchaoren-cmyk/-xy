"""One scoped B coast sync. Preserve existing crew, oars, water, cliff scans and light."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-148';A=P/'assets/odyssey/refit-v148';report={'stage':'starting C geometry sync','errors':[]};u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0')
try:
 allActors=actors.get_all_level_actors();byName={a.get_actor_label():a for a in allActors};island=byName['Island'];islandMesh=imp(A/'island-bridged-c.fbx','V148_ContinuousCoastC',True);island.static_mesh_component.set_static_mesh(islandMesh);island.static_mesh_component.set_material(0,assets.load_asset('/Game/Cove/V147_Terrain'))
 grass=byName['Grass'];grassMat=grass.static_mesh_component.get_material(0);grassMesh=imp(A/'grass-grounded-c.fbx','V148_GroundedGrassC',True);grass.static_mesh_component.set_static_mesh(grassMesh);grass.static_mesh_component.set_material(0,grassMat)
 placements=json.loads((A/'vegetation-grounded-c.json').read_text(encoding='utf-8'));updated=[]
 for i,p in enumerate(placements):
  actor=byName.get('Foliage '+str(i))
  if actor:
   x,h,z=p['position'];actor.set_actor_location(u.Vector(x*100,z*100,h*100),False,False);updated.append(i)
 assert len(updated)==396,len(updated)
 report.update(stage='C island / grass / 396 foliage parts saved',foliageParts=len(updated),plantGroups=132,grassReplaced=True,islandSource=str(A/'island-bridged-c.fbx'),terrainMaterial=island.static_mesh_component.get_material(0).get_path_name(),crewMesh=byName['Crew'].static_mesh_component.static_mesh.get_path_name(),vesselMesh=byName['Vessel'].static_mesh_component.static_mesh.get_path_name(),scannedCliffsPreserved=True,waterPreserved=True,lightingPreserved=True)
 assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');cams={a.get_actor_label():a for a in allActors if isinstance(a,u.CineCameraActor)};cam=cams['Full cove'];shore=cams['Rock shore'];ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());u.SystemLibrary.execute_console_command(world,'r.DepthOfFieldQuality 0');u.SystemLibrary.execute_console_command(world,'r.Streaming.PoolSize 2000');u.SystemLibrary.execute_console_command(world,'r.Streaming.FullyLoadUsedTextures 1');start=time.monotonic();phase=0;handle=None
 def tick(dt):
  global phase,handle
  t=time.monotonic()-start
  if phase==0 and t>45:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-c.png'),camera=cam);phase=1
  elif phase==1 and t>58:ed.set_level_viewport_camera_info(shore.get_actor_location(),shore.get_actor_rotation());phase=2
  elif phase==2 and t>78:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-shore-c.png'),camera=shore);phase=3
  elif phase==3 and t>92:
   report.update(stage='C world actual captures saved',captures=['ue-cove-c.png','ue-shore-c.png'],nativeMap='/Game/Cove/FullCoveV147',artReviewed=False);(V/'ue-coast-c-native.json').write_text(json.dumps(report,indent=2),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
 handle=u.register_slate_post_tick_callback(tick)
except Exception:
 report['failure']=traceback.format_exc();(V/'ue-coast-c-native.json').write_text(json.dumps(report,indent=2),encoding='utf-8');u.log_error(report['failure']);u.SystemLibrary.quit_editor()
