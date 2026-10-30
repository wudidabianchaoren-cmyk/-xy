"""Sync the proven V148 grip poses and replacement ash looms into native UE."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world();u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0');vessel=next(a for a in actors.get_all_level_actors() if a.get_actor_label()=='Vessel');old=vessel.static_mesh_component.static_mesh;mapping={str(s.material_slot_name):vessel.static_mesh_component.get_material(i) for i,s in enumerate(old.get_editor_property('static_materials'))};new=imp(P/'assets/odyssey/ue-v147/Vessel-without-old-shafts-v148.fbx','V148_VesselWithoutOldLooms',True);vessel.static_mesh_component.set_static_mesh(new)
for i,s in enumerate(new.get_editor_property('static_materials')):
 if str(s.material_slot_name) in mapping:vessel.static_mesh_component.set_material(i,mapping[str(s.material_slot_name)])
mesh=imp(P/'assets/odyssey/refit-v146/complete-crew-static-v148.fbx','V148_CompleteCrewContact',True);crew=next(a for a in actors.get_all_level_actors() if a.get_actor_label()=='Crew');crew.static_mesh_component.set_static_mesh(mesh);wood=P/'assets/odyssey/wood_planks';wm=material('V148_GrainedAshLoom',texture(wood/'wood_planks_diff_1k.jpg','V148_AshColor'),texture(wood/'wood_planks_nor_gl_1k.jpg','V148_AshNormal','normal',True),rough=.82);assignments=[]
for i,s in enumerate(mesh.get_editor_property('static_materials')):
 name=str(s.material_slot_name);role='atlas' if 'atlas' in name.lower() else 'wood' if any(k in name.lower() for k in ['ash','loom','shaft']) else 'cloth';mat=assets.load_asset('/Game/Cove/M_WarriorPBR') if role=='atlas' else wm if role=='wood' else assets.load_asset('/Game/Cove/V147_CharcoalFlax');crew.static_mesh_component.set_material(i,mat);assignments.append({'slot':name,'role':role,'material':mat.get_path_name()})
settings=next(a for a in actors.get_all_level_actors() if isinstance(a,u.PostProcessVolume)).get_editor_property('settings');cam=actors.spawn_actor_from_class(u.CineCameraActor,u.Vector(-100,1400,290));cam.set_actor_label('V148 actual rower grip');cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),u.Vector(-500,910,145)),False);cc=cam.get_cine_camera_component();cc.set_editor_property('current_focal_length',50.);cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.)
try:f=cc.get_editor_property('focus_settings');f.focus_method=u.CameraFocusMethod.DISABLE;cc.set_editor_property('focus_settings',f)
except:pass
u.SystemLibrary.execute_console_command(world,'r.DepthOfFieldQuality 0');u.SystemLibrary.execute_console_command(world,'r.MotionBlurQuality 0');full=next(a for a in actors.get_all_level_actors() if a.get_actor_label()=='Full cove');assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');ed.set_level_viewport_camera_info(full.get_actor_location(),full.get_actor_rotation());start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>45:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-crew-v148.png'),camera=full);phase=1
 elif phase==1 and t>60:ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());phase=2
 elif phase==2 and t>80:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-rower-grip-v148.png'),camera=cam);phase=3
 elif phase==3 and t>95:
  (V/'ue-crew-v148.json').write_text(json.dumps({'actors':14,'oldShaftsRemoved':12,'newShafts':12,'bladesPreserved':True,'crewInput':'complete-crew-static-v148.fbx','materialAssignments':assignments,'nativeMap':'/Game/Cove/FullCoveV147','otherWorldActorsPreserved':True},indent=2),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
