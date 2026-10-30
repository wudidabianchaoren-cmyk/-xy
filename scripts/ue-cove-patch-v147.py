"""Fix the two actual shader compile errors and disable photographic DOF."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');ed=u.get_editor_subsystem(u.UnrealEditorSubsystem);world=ed.get_editor_world()
linen=assets.load_asset('/Game/Cove/V147_LinenColor');linen.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_DEFAULT);linen.set_editor_property('srgb',True);assets.save_loaded_asset(linen);mel.recompile_material(assets.load_asset('/Game/Cove/V147_NaturalLinen'))
terrain=assets.load_asset('/Game/Cove/V147_Terrain');# material expressions are inspectable through the library in UE 5.8
# Rebuild a small graph with verified connections. No implicit node pin guesses.
mel.delete_all_material_expressions(terrain);uv=mel.create_material_expression(terrain,u.MaterialExpressionTextureCoordinate);uv.set_editor_property('u_tiling',20.);uv.set_editor_property('v_tiling',20.)
def sample(asset,typ):
 n=mel.create_material_expression(terrain,u.MaterialExpressionTextureSample);n.texture=assets.load_asset(asset);n.sampler_type=typ;mel.connect_material_expressions(uv,'',n,'UVs');return n
sand=sample('/Game/Cove/V147_Ground_color',u.MaterialSamplerType.SAMPLERTYPE_COLOR);soil=sample('/Game/Cove/V147_Soil_Color',u.MaterialSamplerType.SAMPLERTYPE_COLOR)
for name in ['V147_Ground_color','V147_Soil_Color']:
 t=assets.load_asset('/Game/Cove/'+name);t.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_DEFAULT);t.set_editor_property('srgb',True);assets.save_loaded_asset(t)
wp=mel.create_material_expression(terrain,u.MaterialExpressionWorldPosition);dot=mel.create_material_expression(terrain,u.MaterialExpressionDotProduct);z=mel.create_material_expression(terrain,u.MaterialExpressionConstant3Vector);z.constant=u.LinearColor(0,0,1,1);mel.connect_material_expressions(wp,'',dot,'A');mel.connect_material_expressions(z,'',dot,'B');div=mel.create_material_expression(terrain,u.MaterialExpressionDivide);height=mel.create_material_expression(terrain,u.MaterialExpressionConstant);height.r=900.;mel.connect_material_expressions(dot,'',div,'A');mel.connect_material_expressions(height,'',div,'B');clamp=mel.create_material_expression(terrain,u.MaterialExpressionClamp);assert mel.connect_material_expressions(div,'',clamp,''),'Clamp connection failed';lerp=mel.create_material_expression(terrain,u.MaterialExpressionLinearInterpolate);assert mel.connect_material_expressions(sand,'RGB',lerp,'A');assert mel.connect_material_expressions(soil,'RGB',lerp,'B');assert mel.connect_material_expressions(clamp,'',lerp,'Alpha');mel.connect_material_property(lerp,'',u.MaterialProperty.MP_BASE_COLOR);normal=sample('/Game/Cove/V147_Ground_normal',u.MaterialSamplerType.SAMPLERTYPE_NORMAL);mel.connect_material_property(normal,'RGB',u.MaterialProperty.MP_NORMAL);r=mel.create_material_expression(terrain,u.MaterialExpressionConstant);r.r=.94;mel.connect_material_property(r,'',u.MaterialProperty.MP_ROUGHNESS);mel.recompile_material(terrain);assets.save_loaded_asset(terrain)
for a in actors.get_all_level_actors():
 if a.get_actor_label().startswith('Scanned fractured'):
  p=a.get_actor_location();p.y-=350;p.z-=180;a.set_actor_location(p,False,False)
u.SystemLibrary.execute_console_command(world,'r.DepthOfFieldQuality 0');u.SystemLibrary.execute_console_command(world,'r.MotionBlurQuality 0')
cams={a.get_actor_label():a for a in actors.get_all_level_actors() if isinstance(a,u.CineCameraActor)}
for c in cams.values():
 try:
  f=c.get_cine_camera_component().get_editor_property('focus_settings');f.focus_method=u.CameraFocusMethod.DISABLE;c.get_cine_camera_component().set_editor_property('focus_settings',f)
 except:pass
assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>40:u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-reviewed.png'),camera=cams['Full cove']);phase=1
 elif phase==1 and t>55:ed.set_level_viewport_camera_info(cams['Crew study'].get_actor_location(),cams['Crew study'].get_actor_rotation());phase=2
 elif phase==2 and t>70:u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-crew-reviewed.png'),camera=cams['Crew study']);phase=3
 elif phase==3 and t>85:u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
