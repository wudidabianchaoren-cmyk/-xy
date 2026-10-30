"""Repair verified axis/texture import defects in the saved native cove."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]
exec((P/'scripts/ue-lookdev-v146.py').read_text(encoding='utf-8').split('try:\n u.SystemLibrary.execute_console_command')[0])
P=Path(__file__).resolve().parents[1];V=P/'.verify/v32-147';report={'stage':'correcting reviewed native cove','errors':[]}
world=u.get_editor_subsystem(u.LevelEditorSubsystem).load_level('/Game/Cove/FullCoveV147');world=u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
for path in assets.list_assets('/Game/Cove',True,False):
 if 'V147T_' in path and '_color' in path:
  tx=assets.load_asset(path);tx.set_editor_property('compression_settings',u.TextureCompressionSettings.TC_DEFAULT);tx.set_editor_property('srgb',True);assets.save_loaded_asset(tx)
 if '/V147M_' in path:mel.recompile_material(assets.load_asset(path))
terrain=assets.load_asset('/Game/Cove/V147_Terrain');mel.delete_all_material_expressions(terrain);uv=mel.create_material_expression(terrain,u.MaterialExpressionTextureCoordinate);uv.set_editor_property('u_tiling',24.);uv.set_editor_property('v_tiling',24.)
for fn,role,prop in [('Diffuse.jpg','color',u.MaterialProperty.MP_BASE_COLOR),('nor_gl.jpg','normal',u.MaterialProperty.MP_NORMAL),('Rough.jpg','masks',u.MaterialProperty.MP_ROUGHNESS)]:
 tex=texture(P/'assets/odyssey/pbr-v103/coast_sand_03'/fn,'V147_Ground_'+role,role,role=='normal');node=mel.create_material_expression(terrain,u.MaterialExpressionTextureSample);node.texture=tex;node.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_COLOR if role=='color' else u.MaterialSamplerType.SAMPLERTYPE_NORMAL if role=='normal' else u.MaterialSamplerType.SAMPLERTYPE_MASKS;mel.connect_material_expressions(uv,'',node,'UVs');mel.connect_material_property(node,'R' if role=='masks' else 'RGB',prop)
mel.recompile_material(terrain);assets.save_loaded_asset(terrain)
sea=assets.load_asset('/Game/Cove/V147_Sea');mel.delete_all_material_expressions(sea);col=mel.create_material_expression(sea,u.MaterialExpressionConstant3Vector);col.constant=u.LinearColor(.016,.24,.28,1);mel.connect_material_property(col,'',u.MaterialProperty.MP_BASE_COLOR);rough=mel.create_material_expression(sea,u.MaterialExpressionConstant);rough.r=.24;mel.connect_material_property(rough,'',u.MaterialProperty.MP_ROUGHNESS);em=mel.create_material_expression(sea,u.MaterialExpressionConstant3Vector);em.constant=u.LinearColor(.003,.025,.03,1);mel.connect_material_property(em,'',u.MaterialProperty.MP_EMISSIVE_COLOR);uv=mel.create_material_expression(sea,u.MaterialExpressionTextureCoordinate);uv.set_editor_property('u_tiling',600.);uv.set_editor_property('v_tiling',600.);normal=mel.create_material_expression(sea,u.MaterialExpressionTextureSample);normal.texture=texture(P/'assets/odyssey/waternormals.jpg','V147_Sea_Normal','normal',True);normal.sampler_type=u.MaterialSamplerType.SAMPLERTYPE_NORMAL;mel.connect_material_expressions(uv,'',normal,'UVs');mel.connect_material_property(normal,'RGB',u.MaterialProperty.MP_NORMAL);mel.recompile_material(sea);assets.save_loaded_asset(sea)
cam=None;settings=None
for a in actors.get_all_level_actors():
 label=a.get_actor_label()
 if label.startswith('Foliage '):
  p=a.get_actor_location();p.y=-p.y;a.set_actor_location(p,False,False);r=a.get_actor_rotation();a.set_actor_rotation(u.Rotator(pitch=0,yaw=-r.yaw,roll=0),False)
 if label.startswith('Scanned fractured'):
  p=a.get_actor_location();p.y=-p.y;a.set_actor_location(p,False,False);r=a.get_actor_rotation();a.set_actor_rotation(u.Rotator(pitch=0,yaw=r.yaw-180,roll=0),False)
 if isinstance(a,u.SceneCapture2D):actors.destroy_actor(a)
 if isinstance(a,u.CineCameraActor):cam=a
 if isinstance(a,u.SkyLight):a.light_component.set_intensity(2.5)
 if isinstance(a,u.DirectionalLight):a.light_component.set_intensity(8);a.set_actor_rotation(u.Rotator(pitch=-37,yaw=-45,roll=0),False)
 if isinstance(a,u.PostProcessVolume):settings=a.get_editor_property('settings')
cam.set_actor_location(u.Vector(5000,8500,3500),False,False);cam.set_actor_rotation(u.MathLibrary.find_look_at_rotation(cam.get_actor_location(),u.Vector(-700,-2200,850)),False);u.get_editor_subsystem(u.UnrealEditorSubsystem).set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV147');assets.save_directory('/Game/Cove')
capture=actors.spawn_actor_from_class(u.SceneCapture2D,cam.get_actor_location(),cam.get_actor_rotation());comp=capture.get_component_by_class(u.SceneCaptureComponent2D);rt=u.RenderingLibrary.create_render_target2d(world,1920,1080,u.TextureRenderTargetFormat.RTF_RGBA8);comp.texture_target=rt;comp.capture_source=u.SceneCaptureSource.SCS_FINAL_COLOR_LDR;comp.fov_angle=54;comp.post_process_settings=settings;comp.post_process_blend_weight=1.;comp.capture_every_frame=True
start=time.monotonic();phase=0;handle=None
def tick(dt):
 global phase,handle
 t=time.monotonic()-start
 if phase==0 and t>40:
  u.RenderingLibrary.export_render_target(world,rt,str(V),'ue-cove-revised.png');u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V/'ue-cove-revised-viewport.png'),camera=cam);phase=1
 elif phase==1 and t>50:
  (V/'ue-revision.json').write_text(json.dumps({'complete':True,'native':'/Game/Cove/FullCoveV147','axisFixed':True,'samplersFixed':True}),encoding='utf-8');u.unregister_slate_post_tick_callback(handle);u.SystemLibrary.quit_editor()
handle=u.register_slate_post_tick_callback(tick)
