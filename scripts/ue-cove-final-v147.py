"""Final native viewport (Nanite) captures, not SceneCapture fallback renders."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world()
# Correct explicit atlas assignment rather than relying on FBX's sanitized slot names.
tx=P/'assets/odyssey/refit-v145/textures';hm=material('M_WarriorPBR',texture(tx/'warrior_basecolor.png','Warrior_Albedo'),texture(tx/'warrior_normal.png','Warrior_Normal','normal',True),texture(tx/'warrior_orm.png','Warrior_ORM','masks'));albedo=assets.load_asset('/Game/Cove/Warrior_Albedo');albedo.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_DEFAULT);albedo.set_editor_property('srgb',True);assets.save_loaded_asset(albedo);mel.recompile_material(hm)
linen=P/'assets/odyssey/pbr-v103/rough_linen';lm=material('V147_NaturalLinen',texture(linen/'Diffuse.jpg','V147_LinenColor'),texture(linen/'nor_gl.jpg','V147_LinenNormal','normal',True),rough=.92)
for a in actors.get_all_level_actors():
 if isinstance(a,u.SceneCapture2D):actors.destroy_actor(a)
 if a.get_actor_label()=='Crew':
  slots=a.static_mesh_component.static_mesh.get_editor_property('static_materials')
  for i,s in enumerate(slots):a.static_mesh_component.set_material(i,hm if 'atlas' in str(s.material_slot_name).lower() else flat('V147_CharcoalFlax',(.04,.047,.033),.94))
 if a.get_actor_label()=='Vessel':
  slots=a.static_mesh_component.static_mesh.get_editor_property('static_materials')
  for i,s in enumerate(slots):
   if 'sail' in str(s.material_slot_name).lower() or 'linen' in str(s.material_slot_name).lower():a.static_mesh_component.set_material(i,lm)
terrain=assets.load_asset('/Game/Cove/V147_Terrain');mel.delete_all_material_expressions(terrain);uv=mel.create_material_expression(terrain,u.MaterialExpressionTextureCoordinate);uv.set_editor_property('u_tiling',20.);uv.set_editor_property('v_tiling',20.)
def texnode(path,name,typ):
 n=mel.create_material_expression(terrain,u.MaterialExpressionTextureSample);n.texture=texture(path,name,typ,typ=='normal');n.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_COLOR if typ=='color' else u.MaterialSamplerType.SAMPLERTYPE_NORMAL if typ=='normal' else u.MaterialSamplerType.SAMPLERTYPE_MASKS;mel.connect_material_expressions(uv,'',n,'UVs');return n
sand=texnode(P/'assets/odyssey/pbr-v103/coast_sand_03/Diffuse.jpg','V147_Ground_color','color');soil=texnode(P/'assets/odyssey/pbr-v103/forest_ground_04/Diffuse.jpg','V147_Soil_Color','color');wp=mel.create_material_expression(terrain,u.MaterialExpressionWorldPosition);dot=mel.create_material_expression(terrain,u.MaterialExpressionDotProduct);z=mel.create_material_expression(terrain,u.MaterialExpressionConstant3Vector);z.constant=u.LinearColor(0,0,1,1);mel.connect_material_expressions(wp,'',dot,'A');mel.connect_material_expressions(z,'',dot,'B');div=mel.create_material_expression(terrain,u.MaterialExpressionDivide);height=mel.create_material_expression(terrain,u.MaterialExpressionConstant);height.r=900.;mel.connect_material_expressions(dot,'',div,'A');mel.connect_material_expressions(height,'',div,'B');clamp=mel.create_material_expression(terrain,u.MaterialExpressionClamp);mel.connect_material_expressions(div,'',clamp,'Input');lerp=mel.create_material_expression(terrain,u.MaterialExpressionLinearInterpolate);mel.connect_material_expressions(sand,'RGB',lerp,'A');mel.connect_material_expressions(soil,'RGB',lerp,'B');mel.connect_material_expressions(clamp,'',lerp,'Alpha');mel.connect_material_property(lerp,'',u.MaterialProperty.MP_BASE_COLOR);normal=texnode(P/'assets/odyssey/pbr-v103/coast_sand_03/nor_gl.jpg','V147_Ground_normal','normal');mel.connect_material_property(normal,'RGB',u.MaterialProperty.MP_NORMAL);rough=mel.create_material_expression(terrain,u.MaterialExpressionConstant);rough.r=.94;mel.connect_material_property(rough,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(terrain);assets.save_loaded_asset(terrain)
settings=next(a for a in actors.get_all_level_actors() if isinstance(a,u.PostProcessVolume)).get_editor_property('settings');cams=[]
for label,p,target,focal in [('Full cove',(5000,9500,3700),(-700,-2200,850),30.),('Crew study',(-1400,1300,450),(-884,760,315),55.),('Rock shore',(-1100,400,850),(-1700,-1900,400),40.)]:
 cam=actors.spawn_actor_from_class(u.CineCameraActor,u.Vector(*p));cam.set_actor_label(label);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),u.Vector(*target)),False);cc=cam.get_cine_camera_component();cc.set_editor_property('current_focal_length',focal);cc.set_editor_property('post_process_settings',settings);cc.set_editor_property('post_process_blend_weight',1.);cams.append(cam)
ed.set_level_viewport_camera_info(cams[0].get_actor_location(),cams[0].get_actor_rotation());u.SystemLibrary.execute_console_command(world,'r.AntiAliasingMethod 4');u.SystemLibrary.execute_console_command(world,'r.ScreenPercentage 100');assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>35:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-final.png'),camera=cams[0]);phase=1
 elif phase==1 and t>48:ed.set_level_viewport_camera_info(cams[1].get_actor_location(),cams[1].get_actor_rotation());phase=2
 elif phase==2 and t>65:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-crew-final.png'),camera=cams[1]);phase=3
 elif phase==3 and t>78:ed.set_level_viewport_camera_info(cams[2].get_actor_location(),cams[2].get_actor_rotation());phase=4
 elif phase==4 and t>95:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-rock-final.png'),camera=cams[2]);phase=5
 elif phase==5 and t>110:
  (V/'ue-final.json').write_text(json.dumps({'native':'/Game/Cove/FullCoveV147','source':'actual UE5.8.4 viewport / Nanite / Lumen','fullCoveAssembly':True,'webUsesUE':False,'captures':['ue-cove-final.png','ue-crew-final.png','ue-rock-final.png']}),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
